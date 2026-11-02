const express = require("express");
const router = express.Router();
const pool = require("../db");

// รายชื่อคอลัมน์ที่อนุญาตให้เรียงลำดับ (Allowlist ป้องกัน SQL Injection)
const ALLOWED_SORT_FIELDS = ["id", "name", "price", "available"];

/**
 * Pattern A: ค้นหา กรอง จัดเรียง และแบ่งหน้าเมนูอาหาร
 * GET /api/menu
 * Query parameters:
 *  - search: ค้นหาชื่อเมนูด้วย LIKE %...%
 *  - min_price: ราคาสูงสุดขึ้นไป (price >= ?)
 *  - max_price: ราคาต่ำสุดลงมา (price <= ?)
 *  - available: กรองสถานะพร้อมขาย ("true"/"1" หรือ "false"/"0")
 *  - sort: คอลัมน์ที่ต้องการเรียง (name, price, available, id)
 *  - order: ทิศทางการเรียง (asc, desc)
 *  - page: ลำดับหน้า (default: 1)
 *  - limit: จำนวนรายการต่อหน้า (default: 10, สูงสุดไม่เกิน 50)
 */
router.get("/", async (req, res, next) => {
  try {
    // 1. ตรวจสอบและคำนวณ Pagination
    const rawPage = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
    const rawLimit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;

    if (isNaN(rawPage) || rawPage < 1 || isNaN(rawLimit) || rawLimit < 1) {
      return res.status(400).json({
        success: false,
        error: "พารามิเตอร์ page และ limit ต้องเป็นจำนวนเต็มบวกที่มากกว่าหรือเท่ากับ 1",
      });
    }

    const page = rawPage;
    const limit = Math.min(50, rawLimit); // จำกัด limit สูงสุดไม่เกิน 50
    const offset = (page - 1) * limit;    // คำนวณ offset หน้าแรกเริ่มที่ 0

    // 2. เงื่อนไขการค้นหาและกรอง (Filtering & Search)
    const conditions = [];
    const filterParams = [];

    // 2.1 ค้นหาตามชื่อ (search)
    if (req.query.search && req.query.search.trim() !== "") {
      conditions.push("name LIKE ?");
      filterParams.push(`%${req.query.search.trim()}%`);
    }

    // 2.2 กรองราคาต่ำสุด (min_price)
    if (req.query.min_price !== undefined && req.query.min_price !== "") {
      const minPrice = Number(req.query.min_price);
      if (!isNaN(minPrice)) {
        conditions.push("price >= ?");
        filterParams.push(minPrice);
      }
    }

    // 2.3 กรองราคาสูงสุด (max_price)
    if (req.query.max_price !== undefined && req.query.max_price !== "") {
      const maxPrice = Number(req.query.max_price);
      if (!isNaN(maxPrice)) {
        conditions.push("price <= ?");
        filterParams.push(maxPrice);
      }
    }

    // 2.4 กรองสถานะพร้อมขาย (available)
    if (req.query.available !== undefined && req.query.available !== "") {
      const avail = String(req.query.available).toLowerCase();
      if (avail === "true" || avail === "1") {
        conditions.push("available = ?");
        filterParams.push(1);
      } else if (avail === "false" || avail === "0") {
        conditions.push("available = ?");
        filterParams.push(0);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // 3. จัดการ Sorting อย่างปลอดภัยด้วย Allowlist
    const sortField = ALLOWED_SORT_FIELDS.includes(req.query.sort)
      ? req.query.sort
      : "id";
    const sortOrder =
      String(req.query.order).toLowerCase() === "desc" ? "DESC" : "ASC";

    // 4. นับจำนวนรายการทั้งหมดตามเงื่อนไข (Total Count)
    const countSql = `SELECT COUNT(*) AS total FROM menu_items ${whereClause}`;
    const [countRows] = await pool.query(countSql, filterParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit) || 1;

    // 5. ดึงข้อมูลรายการเมนูพร้อมแบ่งหน้า
    const dataSql = `SELECT * FROM menu_items ${whereClause} ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(dataSql, [...filterParams, limit, offset]);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

