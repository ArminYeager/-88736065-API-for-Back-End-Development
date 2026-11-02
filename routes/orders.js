const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

/**
 * Pattern B: สั่งซื้ออาหารด้วย Database Transaction
 * POST /api/orders
 * Body: {
 *   customer_name: string,
 *   items: [{ menu_item_id: number, quantity: number }]
 * }
 */
router.post("/", async (req, res, next) => {
  const { customer_name, items } = req.body;

  // 1. ตรวจสอบข้อมูลขาเข้า (Input Validation)
  if (!customer_name || typeof customer_name !== "string" || !customer_name.trim()) {
    return res.status(400).json({
      success: false,
      error: "กรุณาระบุชื่อลูกค้า (customer_name) ให้ถูกต้อง",
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: "ต้องระบุรายการอาหาร (items) อย่างน้อย 1 รายการ",
    });
  }

  for (const item of items) {
    if (
      !item ||
      !item.menu_item_id ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        error: "แต่ละรายการต้องมี menu_item_id และ quantity ที่เป็นจำนวนเต็มบวก (>= 1)",
      });
    }
  }

  // 2. ขอ Connection จาก Pool เพื่อเปิด Transaction
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 3. วนลูปตรวจสอบความถูกต้องของสินค้าและสถานะความพร้อมจำหน่าย (available)
    for (const item of items) {
      const [menuRows] = await connection.query(
        "SELECT id, name, price, available FROM menu_items WHERE id = ? FOR UPDATE",
        [item.menu_item_id]
      );

      // หากไม่พบเมนู หรือสินค้าหมด (available = 0) ต้อง Rollback ทั้งหมด
      if (menuRows.length === 0 || !menuRows[0].available) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          error: `เมนูรหัส ${item.menu_item_id} ไม่มีอยู่ในระบบหรือหมดชั่วคราว`,
        });
      }
    }

    // 4. บันทึกข้อมูลลงตาราง orders
    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_name, status) VALUES (?, 'pending')",
      [customer_name.trim()]
    );
    const orderId = orderResult.insertId;

    // 5. บันทึกข้อมูลลงตาราง order_items
    for (const item of items) {
      await connection.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity]
      );
    }

    // 6. Commit การเปลี่ยนแปลงทั้งหมด
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: {
        id: orderId,
        order_id: orderId,
        customer_name: customer_name.trim(),
        status: "pending",
      },
    });
  } catch (error) {
    await connection.rollback();
    return res.status(400).json({
      success: false,
      error: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ ระบบได้ทำการ Rollback แล้ว: " + error.message,
    });
  } finally {
    // 7. คืน Connection สู่ Pool เสมอ เพื่อป้องกัน Connection Leak
    connection.release();
  }
});

/**
 * Pattern D: ดึงรายละเอียดออเดอร์พร้อมรายการอาหารย่อยและคำนวณยอดรวม (Subtotal & Total Amount)
 * GET /api/orders/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. ดึงข้อมูลใบสั่งซื้อหลัก
    const [orderRows] = await pool.query(
      "SELECT id, customer_name, status, created_at FROM orders WHERE id = ?",
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "ไม่พบคำสั่งซื้อรหัสนี้ในระบบ",
      });
    }

    // 2. ดึงรายการอาหารในออเดอร์พร้อม JOIN ชื่อและราคาเมนู
    const [items] = await pool.query(
      `SELECT 
        oi.id,
        oi.menu_item_id,
        m.name AS menu_name,
        m.price,
        oi.quantity,
        (m.price * oi.quantity) AS subtotal
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?`,
      [id]
    );

    // 3. คำนวณราคารวมทั้งหมด (Total Amount)
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        ...orderRows[0],
        items,
        total_amount: Number(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Pattern C: อัปเดตสถานะออเดอร์ พร้อมตรวจสอบสิทธิ์ JWT และ State Machine Validation
 * PATCH /api/orders/:id/status
 * Header: Authorization: Bearer <token>
 * Body: { status: 'pending' | 'preparing' | 'delivered' | 'cancelled' }
 */
router.patch("/:id/status", authenticateToken, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status: newStatus } = req.body;

    const allowedStatuses = ["pending", "preparing", "delivered", "cancelled"];
    if (!newStatus || !allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        error: "สถานะไม่ถูกต้อง อนุญาตเฉพาะ: " + allowedStatuses.join(", "),
      });
    }

    // ตรวจสอบว่ามีออเดอร์นี้อยู่ในฐานข้อมูลหรือไม่
    const [rows] = await pool.query("SELECT status FROM orders WHERE id = ?", [orderId]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "ไม่พบคำสั่งซื้อรหัสนี้",
      });
    }

    const currentStatus = rows[0].status;

    // State Machine Validation: ห้ามแก้ไขสถานะหากออเดอร์ถูกส่งมอบหรือยกเลิกแล้ว
    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        error: `ออเดอร์อยู่ในสถานะสิ้นสุด (${currentStatus}) แล้ว ไม่สามารถแก้ไขสถานะได้`,
      });
    }

    // ดำเนินการอัปเดตสถานะ
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [newStatus, orderId]);

    return res.status(200).json({
      success: true,
      message: "อัปเดตสถานะสำเร็จ",
      data: {
        order_id: Number(orderId),
        status: newStatus,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

