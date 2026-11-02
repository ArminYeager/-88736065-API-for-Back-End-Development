# 🏆 คัมภีร์พิชิตข้อสอบปฏิบัติ Part 2 (Open-Book) ฉบับสมบูรณ์ 100%

> **วิชา:** 88736065 API for Back-End Development  
> **คะแนน:** 15 คะแนนเต็ม (โจทย์ที่ 1: 6 คะแนน | โจทย์ที่ 2: 4 คะแนน | โจทย์ที่ 3: 5 คะแนน)  
> **เวลาที่แนะนำ:** 60 นาที (เหลือ 60 นาทีไว้ตรวจทาน)  
> **ระบบที่ใช้สอบ:** โปรเจกต์ระบบสั่งอาหารออนไลน์ (Express + MySQL + Jest + Supertest)

---

## 📌 สารบัญด่วน (กดคลิกไปดูตามสถานการณ์ในห้องสอบ)

1. [โครงสร้างข้อสอบ 3 ข้อย่อย & การแบ่งเวลา](#1-โครงสร้างข้อสอบ-3-ข้อย่อย--การแบ่งเวลา)
2. [ภาพรวมฐานข้อมูลระบบสั่งอาหาร (Database Schema)](#2-ภาพรวมฐานข้อมูลระบบสั่งอาหาร-database-schema)
3. [กล่องโค้ดสำเร็จรูปสำหรับโจทย์ที่ 1 (6 คะแนน: Implementation & Tests)](#3-กล่องโค้ดสำเร็จรูปสำหรับโจทย์ที่-1-6-คะแนน)
   - [Pattern A: ค้นหาและกรองเมนู (Search, Filter, Pagination)](#pattern-a-ค้นหาและกรองเมนู-get-apimenu)
   - [Pattern B: สั่งอาหารด้วย Transaction (POST /api/orders)](#pattern-b-สั่งอาหารด้วย-transaction-post-apiorders)
   - [Pattern C: อัปเดตสถานะออเดอร์ & ตรวจสอบสิทธิ์ JWT (PATCH /api/orders/id/status)](#pattern-c-อัปเดตสถานะออเดอร์--ตรวจสอบสิทธิ์-jwt)
   - [Pattern D: ดึงรายละเอียดออเดอร์พร้อมรายการอาหาร (GET /api/orders/id)](#pattern-d-ดึงรายละเอียดออเดอร์พร้อมรายการอาหาร)
4. [ตารางแก้บั๊กทันใจจาก Jest Error สำหรับโจทย์ที่ 2 (4 คะแนน: Debugging)](#4-ตารางแก้บั๊กทันใจจาก-jest-error-สำหรับโจทย์ที่-2-4-คะแนน)
5. [คลังคำตอบสำเร็จรูปข้อวิเคราะห์ปัญหา สำหรับโจทย์ที่ 3 (5 คะแนน: Analysis & Explanation)](#5-คลังคำตอบสำเร็จรูปข้อวิเคราะห์ปัญหา-สำหรับโจทย์ที่-3-5-คะแนน)
6. [Checklist สำคัญที่สุดก่อนส่งงาน (ห้ามลืมเด็ดขาด)](#6-checklist-สำคัญที่สุดก่อนส่งงาน)

---

## 1. โครงสร้างข้อสอบ 3 ข้อย่อย & การแบ่งเวลา

อาจารย์ได้บอกใบ้ไว้ในเอกสาร `final_test.html` ข้อ 5 ไว้อย่างชัดเจน 3 ประเด็น:

- **"เขียนการยืนยันผลในเทสต์ให้ชัดเจน"** ➔ **โจทย์ที่ 1 (6 คะแนน):** เขียน Route ใหม่ หรือเขียน Test ด้วย Jest + Supertest
- **"อ่าน error ของ Jest ให้ครบก่อนแก้"** ➔ **โจทย์ที่ 2 (4 คะแนน):** รันเทสต์เจอสีแดง แล้วแก้บั๊กในโค้ดให้เทสต์ผ่านเป็นสีเขียว
- **"อธิบายสาเหตุด้วยประโยคของตัวเอง"** ➔ **โจทย์ที่ 3 (5 คะแนน):** เขียนอธิบายสาเหตุของปัญหาเชิงทฤษฎีในข้อ 2 และวิธีแก้ไข

### ⏱️ แผนจัดสรรเวลา 60 นาที:

- **นาทีที่ 0–25 (โจทย์ที่ 1 - 6 คะแนน):** เปิดดู Pattern A, B, C หรือ D ในเอกสารนี้ ก๊อปวางโครงสร้าง ปรับชื่อฟิลด์ให้ตรงโจทย์ รัน `npm test`
- **นาทีที่ 25–45 (โจทย์ที่ 2 - 4 คะแนน):** รัน `npm test` ดู Error สีแดง เปิดดู [หมวดที่ 4](#4-ตารางแก้บั๊กทันใจจาก-jest-error-สำหรับโจทย์ที่-2-4-คะแนน) แก้ 3 บรรทัดให้เขียว
- **นาทีที่ 45–60 (โจทย์ที่ 3 - 5 คะแนน):** เปิดดู [หมวดที่ 5](#5-คลังคำตอบสำเร็จรูปข้อวิเคราะห์ปัญหา-สำหรับโจทย์ที่-3-5-คะแนน) ลอกโครงสร้าง 3 ประโยค (สาเหตุ ➔ ผลกระทบ ➔ วิธีแก้)
- **เวลาที่เหลือ:** รัน `npm run check` และ `npm test` ซ้ำอีกรอบ แล้วเตรียมไฟล์ส่ง

---

## 2. ภาพรวมฐานข้อมูลระบบสั่งอาหาร (Database Schema)

อ้างอิงจากไฟล์ `seed.sql`:

```sql
-- 1. เมนูอาหาร
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE  -- 1 = พร้อมขาย, 0 = หมด
);

-- 2. ใบสั่งอาหาร (Order หลัก)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending' | 'preparing' | 'delivered' | 'cancelled'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. รายการอาหารในแต่ละใบสั่ง (Order Detail)
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

## 3. กล่องโค้ดสำเร็จรูปสำหรับโจทย์ที่ 1 (6 คะแนน)

### Pattern A: ค้นหาและกรองเมนู (`GET /api/menu`)

**โจทย์มักจะสั่ง:** ค้นหาตามชื่อ (`search`), กรองตามช่วงราคา (`min_price`, `max_price`), กรองสถานะ (`available`), และตัดหน้า (`page`, `limit`)

#### 💻 โค้ดใน Route (`routes/menu.js` หรือ `app.js`):

```javascript
const express = require("express");
const router = express.Router();
const { pool } = require("./db");

router.get("/api/menu", async (req, res) => {
  try {
    const {
      search,
      min_price,
      max_price,
      available,
      page = 1,
      limit = 10,
    } = req.query;

    let sql = "SELECT * FROM menu_items WHERE 1=1";
    const params = [];

    // 1. ค้นหาตามชื่อ (LIKE %...%)
    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search.trim()}%`);
    }

    // 2. กรองราคาต่ำสุด
    if (min_price !== undefined && min_price !== "") {
      sql += " AND price >= ?";
      params.push(Number(min_price));
    }

    // 3. กรองราคาสูงสุด
    if (max_price !== undefined && max_price !== "") {
      sql += " AND price <= ?";
      params.push(Number(max_price));
    }

    // 4. กรองสถานะพร้อมขาย (available)
    if (available !== undefined && available !== "") {
      sql += " AND available = ?";
      params.push(available === "true" || available === "1" ? 1 : 0);
    }

    // 5. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    sql += " ORDER BY id ASC LIMIT ? OFFSET ?";
    params.push(limitNum, offset);

    const [rows] = await pool.query(sql, params);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: { page: pageNum, limit: limitNum },
    });
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});
```

#### 🧪 โค้ด Test Supertest สำหรับ Pattern A:

```javascript
const request = require("supertest");
const app = require("../app");

describe("GET /api/menu", () => {
  it("ดึงรายการเมนูสำเร็จและมีข้อมูลคืนกลับมา", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("กรองตามช่วงราคา min_price และ max_price ได้ถูกต้อง", async () => {
    const res = await request(app).get("/api/menu?min_price=40&max_price=60");
    expect(res.statusCode).toBe(200);
    res.body.data.forEach((item) => {
      expect(Number(item.price)).toBeGreaterThanOrEqual(40);
      expect(Number(item.price)).toBeLessThanOrEqual(60);
    });
  });

  it("ค้นหาเมนูตามชื่อ (search) ได้ถูกต้อง", async () => {
    const res = await request(app).get("/api/menu?search=ข้าวมันไก่");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.some((i) => i.name.includes("ข้าวมันไก่"))).toBe(true);
  });
});
```

---

### Pattern B: สั่งอาหารด้วย Transaction (`POST /api/orders`)

**โจทย์มักจะสั่ง:** รับ `customer_name` และรายการ `items: [{ menu_item_id, quantity }]` ตรวจสอบความถูกต้อง บันทึก `orders` และ `order_items` ใน Transaction เดียวกัน หากผิดพลาดให้ Rollback ทั้งหมด

#### 💻 โค้ดใน Route:

```javascript
router.post("/api/orders", async (req, res) => {
  const { customer_name, items } = req.body;

  // 1. ตรวจสอบข้อมูลเบื้องต้น
  if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "กรุณาระบุชื่อลูกค้าและรายการอาหารอย่างน้อย 1 รายการ",
      },
    });
  }

  // 2. ขอ Connection จาก Pool เพื่อเปิด Transaction
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 3. ตรวจสอบว่าสินค้ามีอยู่จริงและพร้อมขาย (available = 1)
    for (const item of items) {
      if (!item.menu_item_id || !item.quantity || item.quantity <= 0) {
        await conn.rollback();
        return res.status(400).json({
          error: {
            code: "INVALID_QUANTITY",
            message: "จำนวนสินค้าต้องมากกว่า 0",
          },
        });
      }

      const [menuRows] = await conn.query(
        "SELECT id, name, price, available FROM menu_items WHERE id = ? FOR UPDATE",
        [item.menu_item_id],
      );

      if (menuRows.length === 0) {
        await conn.rollback();
        return res.status(404).json({
          error: {
            code: "MENU_NOT_FOUND",
            message: `ไม่พบเมนูรหัส ${item.menu_item_id}`,
          },
        });
      }

      if (!menuRows[0].available) {
        await conn.rollback();
        return res.status(400).json({
          error: {
            code: "ITEM_UNAVAILABLE",
            message: `เมนู ${menuRows[0].name} หมดชั่วคราว`,
          },
        });
      }
    }

    // 4. บันทึกตาราง orders
    const [orderResult] = await conn.query(
      "INSERT INTO orders (customer_name, status) VALUES (?, ?)",
      [customer_name, "pending"],
    );
    const orderId = orderResult.insertId;

    // 5. บันทึกตาราง order_items
    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity],
      );
    }

    // 6. Commit ข้อมูล
    await conn.commit();

    return res.status(201).json({
      success: true,
      message: "สร้างออเดอร์สำเร็จ",
      data: { order_id: orderId, customer_name, status: "pending" },
    });
  } catch (error) {
    await conn.rollback();
    return res.status(500).json({ error: { message: error.message } });
  } finally {
    // 7. คืน Connection เสมอ ป้องกัน Connection Leak
    conn.release();
  }
});
```

#### 🧪 โค้ด Test Supertest สำหรับ Pattern B:

```javascript
describe("POST /api/orders", () => {
  it("สร้างออเดอร์สำเร็จ ได้ status 201 และคืน order_id", async () => {
    const payload = {
      customer_name: "ทดสอบ สั่งอาหาร",
      items: [{ menu_item_id: 1, quantity: 2 }],
    };
    const res = await request(app).post("/api/orders").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("order_id");
  });

  it("ส่งตะกร้าว่างมา ได้ status 400", async () => {
    const res = await request(app).post("/api/orders").send({
      customer_name: "ทดสอบ",
      items: [],
    });
    expect(res.statusCode).toBe(400);
  });

  it("สั่งเมนูที่ไม่มีอยู่ในระบบ ได้ status 404", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customer_name: "ทดสอบ",
        items: [{ menu_item_id: 999999, quantity: 1 }],
      });
    expect(res.statusCode).toBe(404);
  });
});
```

---

### Pattern C: อัปเดตสถานะออเดอร์ & ตรวจสอบสิทธิ์ JWT

**โจทย์มักจะสั่ง:** ตรวจสอบ State Transition (`pending` ➔ `preparing` ➔ `delivered` หรือ `cancelled`) และตรวจ Token

#### 💻 โค้ด Authentication Middleware & Route:

```javascript
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config");

// Middleware ตรวจ JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ตัด 'Bearer ' ออก

  if (!token) {
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "กรุณาแนบ Token" } });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({
          error: { code: "FORBIDDEN", message: "Token ไม่ถูกต้องหรือหมดอายุ" },
        });
    }
    req.user = user;
    next();
  });
}

// Route อัปเดตสถานะ
router.patch("/api/orders/:id/status", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status: newStatus } = req.body;

    const allowedStatuses = ["pending", "preparing", "delivered", "cancelled"];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        error: { code: "INVALID_STATUS", message: "สถานะไม่ถูกต้อง" },
      });
    }

    const [rows] = await pool.query("SELECT status FROM orders WHERE id = ?", [
      orderId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({
        error: { code: "ORDER_NOT_FOUND", message: "ไม่พบออเดอร์นี้" },
      });
    }

    const currentStatus = rows[0].status;

    // กฎ State Machine: ห้ามเปลี่ยนถ้าจัดส่งเสร็จแล้ว หรือยกเลิกไปแล้ว
    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      return res.status(400).json({
        error: {
          code: "CANNOT_CHANGE_STATUS",
          message: `ออเดอร์อยู่ในสถานะ ${currentStatus} แล้ว ไม่สามารถเปลี่ยนได้`,
        },
      });
    }

    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [
      newStatus,
      orderId,
    ]);

    return res.status(200).json({
      success: true,
      message: "อัปเดตสถานะสำเร็จ",
      data: { order_id: Number(orderId), status: newStatus },
    });
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});
```

---

### Pattern D: ดึงรายละเอียดออเดอร์ (`GET /api/orders/:id`)

**โจทย์มักจะสั่ง:** ให้ `JOIN` ตาราง `orders`, `order_items` และ `menu_items` แล้วจัดเป็น JSON สวยงาม

```javascript
router.get("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. ดึงข้อมูล Order หลัก
    const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    if (orderRows.length === 0) {
      return res.status(404).json({ error: { message: "ไม่พบออเดอร์นี้" } });
    }

    // 2. ดึงรายการอาหารใน Order นั้น
    const [items] = await pool.query(
      `
      SELECT 
        oi.id,
        oi.menu_item_id,
        m.name AS menu_name,
        m.price,
        oi.quantity,
        (m.price * oi.quantity) AS subtotal
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `,
      [id],
    );

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );

    return res.status(200).json({
      success: true,
      data: {
        ...orderRows[0],
        items,
        total_amount: totalAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: { message: error.message } });
  }
});
```

---

## 4. ตารางแก้บั๊กทันใจจาก Jest Error สำหรับโจทย์ที่ 2 (4 คะแนน)

เมื่อรัน `npm test` แล้วเจอตัวหนังสือสีแดง ให้กวาดสายตาดูข้อความ Error แล้วเทียบตารางนี้ทันที:

| ข้อความ Error ใน Jest                                                   | สาเหตุที่แท้จริง                                                                                               | วิธีแก้ในโค้ด 3 บรรทัด                                                                    |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `Expected: 200`<br>`Received: 404`                                      | 1. พิมพ์ URL หรือ Parameter ไม่ตรง เช่น ลืม `/api`<br>2. ลืม `return` ใน `if` ทำให้หลุดไป 404                  | เช็ก path ใน `app.use('/api', ...)` หรือ `router.get(...)` ให้ตรงกับในไฟล์เทสต์           |
| `TypeError: Cannot read properties of undefined (reading '...')`        | ลืมใส่ Middleware แปลง JSON ใน `app.js` ทำให้ `req.body` เป็น `undefined`                                      | เพิ่มใน `app.js` ก่อนประกาศ Route:<br>`app.use(express.json());`                          |
| `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent` | มีการส่ง `res.status().json()` มากกว่าหนึ่งครั้ง เพราะลืมใส่คำว่า `return` หน้าคำสั่ง                          | เติมคำว่า `return` หน้าทุกคำสั่ง `res`: <br>`return res.status(400).json(...);`           |
| `Expected: [...]`<br>`Received: []` (ข้อมูลไม่มา)                       | 1. ใน MySQL ค่า Boolean คือ `1` หรือ `0` แต่ในโค้ดไปเทียบ `WHERE available = true`<br>2. ลืมครอบ `%` ใน `LIKE` | แก้เป็น:<br>`params.push(available === 'true' ? 1 : 0);`<br>`params.push(`%${search}%`);` |
| `Jest did not exit one second after the test run has completed`         | Connection ของ MySQL Pool ยังเปิดค้างอยู่หลังรันเทสต์จบ Jest จึงปิดโปรเซสไม่ได้                                | เพิ่มท้ายไฟล์เทสต์ (`*.test.js`):<br>`afterAll(async () => { await pool.end(); });`       |
| `Lock wait timeout exceeded` หรือ `Too many connections`                | ใน Transaction ลืมคืน Connection เมื่อเกิด Error ทำให้ Connection ใน Pool หมดเกลี้ยง                           | เพิ่มบล็อก `finally` เสมอ:<br>`finally { conn.release(); }`                               |
| `JsonWebTokenError: jwt malformed`                                      | ส่ง Token มาใน Header แต่ไม่ได้ตัดคำว่า `"Bearer "` ออก                                                        | ดึงเฉพาะ Token:<br>`const token = req.headers['authorization']?.split(' ')[1];`           |

---

## 5. คลังคำตอบสำเร็จรูปข้อวิเคราะห์ปัญหา สำหรับโจทย์ที่ 3 (5 คะแนน)

> 💡 **สูตรการตอบ 3 ประโยคเพื่อคะแนนเต็ม:**
>
> 1. **สาเหตุของปัญหา:** โค้ดเดิมเกิดอะไรขึ้นในระดับระบบ
> 2. **ผลกระทบทางธุรกิจ:** หากปล่อยไว้จะเกิดความเสียหายอย่างไร (เช่น เงินหาย, ข้อมูลค้าง)
> 3. **แนวทางการแก้ไข:** ใช้หลักการใดแก้ และทำไมหลักการนั้นจึงป้องกันปัญหาได้ 100%

---

### คำถามที่ 1: ทำไมการสร้างออเดอร์ต้องใช้ Transaction?

- **คำถาม:** "เพราะเหตุใดการสั่งซื้อสินค้าจึงต้องใช้ Database Transaction แทนที่จะรันคำสั่ง `INSERT` แยกกันตามปกติ?"
- **แนวคำตอบ:**
  > 1. **สาเหตุ:** หากรัน `INSERT INTO orders` สำเร็จแล้ว แต่ระหว่างจะ `INSERT INTO order_items` เกิดปัญหา (เช่น เน็ตหลุด, เมนูอาหารรหัสผิด, หรือฐานข้อมูลแครช) ระบบจะตัดการทำงานกลางคัน
  > 2. **ผลกระทบ:** ทำให้เกิด **Phantom Order / Data Inconsistency** คือมีหัวบิลในตาราง `orders` เกิดขึ้น แต่ไม่มีรายการอาหารในตาราง `order_items` ร้านค้าไม่รู้ว่าลูกค้าสั่งอะไร และไม่สามารถ Rollback ได้
  > 3. **วิธีแก้:** การใช้ **Database Transaction (`beginTransaction`, `commit`, `rollback`)** ตามคุณสมบัติ **Atomicity (ใน ACID)** จะรับประกันว่าข้อมูลทั้งหมดต้องถูกบันทึกสำเร็จพร้อมกัน หากมีข้อผิดพลาดแม้แต่จุดเดียว ระบบจะ Rollback คืนสถานะเดิมทั้งหมด 100% เสมือนไม่เคยเกิดคำสั่งนั้นขึ้น

---

### คำถามที่ 2: ทำไมต้องใช้ Parameterized Query (`?`) แทนการต่อ String?

- **คำถาม:** "เพราะเหตุใดการเขียน SQL แบบ `SELECT * FROM menu_items WHERE name = '` + search + `'` จึงอันตราย และ Parameterized Query แก้ปัญหานี้อย่างไร?"
- **แนวคำตอบ:**
  > 1. **สาเหตุ:** การนำ Input ของผู้ใช้มาเชื่อมต่อ String เข้ากับคำสั่ง SQL โดยตรง เปิดโอกาสให้ผู้ไม่หวังดีป้อนอักขระพิเศษ (เช่น `' OR '1'='1`) เข้ามาเปลี่ยนโครงสร้างตรรกะของ SQL Query
  > 2. **ผลกระทบ:** เกิดช่องโหว่ **SQL Injection (OWASP Top 10)** ทำให้ผู้โจมตีสามารถขโมยข้อมูล ดัดแปลงฐานข้อมูล หรือสั่งลบตารางทั้งระบบได้ (`DROP TABLE`)
  > 3. **วิธีแก้:** การใช้ **Parameterized Query (Prepared Statement)** โดยใส่ Placeholder `?` ช่วยให้ Database Engine แยกแยะระหว่าง "โครงสร้างคำสั่ง SQL" กับ "ข้อมูล (Data)" ออกจากกันอย่างเด็ดขาด ค่าที่ส่งเข้าไปจะถูกมองเป็นเพียงข้อความธรรมดาเสมอ ไม่สามารถถูกนำไปคอมไพล์เป็นคำสั่ง SQL ได้

---

### คำถามที่ 3: ทำไมต้องมี `finally { conn.release(); }`?

- **คำถาม:** "เหตุใดการทำงานกับ MySQL Connection Pool เมื่อใช้ Transaction เสร็จแล้วจึงต้องมี `conn.release()` อยู่ในบล็อก `finally` เสมอ?"
- **แนวคำตอบ:**
  > 1. **สาเหตุ:** `pool.getConnection()` เป็นการยืม Connection ตัวหนึ่งมาจาก Pool ที่มีจำนวนจำกัด (เช่น `connectionLimit: 10`) หากโค้ดทำงานล้มเหลวแล้วเกิด Error กระโดดข้ามคำสั่ง `release()` ตัว Connection นั้นจะไม่ถูกส่งคืน
  > 2. **ผลกระทบ:** เกิดปัญหา **Connection Leak** เมื่อมีคำขอเข้ามาเรื่อยๆ จนครบ 10 ครั้ง Connection ใน Pool จะหมดเกลี้ยง ทำให้คำขอถัดไปทั้งหมดต้องรอคิวจนเกิด `Timeout` และทำให้ระบบ API ล่ม (Hung/Crash) ทั้งระบบ
  > 3. **วิธีแก้:** บล็อก `finally` มีคุณสมบัติพิเศษคือจะถูกประมวลผลเสมอไม่ว่าจะเกิด Exception หรือไม่ก็ตาม การใส่ `conn.release()` ไว้ใน `finally` จึงเป็นการการันตี 100% ว่า Connection จะถูกส่งคืน Pool ทุกกรณี

---

### คำถามที่ 4: ทำไมต้องแยกไฟล์ `app.js` ออกจาก `server.js`?

- **คำถาม:** "เพราะเหตุใดในการเขียน Automated Test ด้วย Supertest จึงจำเป็นต้องแยก `app.js` ออกจาก `server.js` (`app.listen()`)?"
- **แนวคำตอบ:**
  > 1. **สาเหตุ:** หากคำสั่ง `app.listen(port)` อยู่ในไฟล์เดียวกับที่ประกาศ Express App เมื่อไฟล์เทสต์สั่ง `require('./app')` ตัวเซิร์ฟเวอร์จะสั่งเปิดพอร์ตบนเครื่องจริงทันที
  > 2. **ผลกระทบ:** ทำให้เกิดปัญหาพอร์ตชนกัน (`EADDRINUSE`) เมื่อรันหลายเทสต์ขนานกัน และเซิร์ฟเวอร์จะเปิดค้างไว้ ทำให้โปรเซสของ Jest ไม่ยอมจบการทำงาน (`Jest did not exit...`)
  > 3. **วิธีแก้:** การแยก `app.js` (ประกาศ middleware และ routes) ออกจาก `server.js` (เปิดพอร์ตด้วย `listen`) ช่วยให้ Supertest สามารถจำลองการส่ง HTTP Request ภายใน Memory ได้โดยตรงโดยไม่ต้องเปิดพอร์ตจริง ทำให้เทสต์รันได้รวดเร็ว แยกขาดจากกัน และปิดโปรเซสได้อย่างสมบูรณ์

---

### คำถามที่ 5: ทำไมต้องมีการตรวจสอบ State Transition ในการเปลี่ยนสถานะ Order?

- **คำถาม:** "เพราะเหตุใด API อัปเดตสถานะออเดอร์จึงต้องมีเงื่อนไขตรวจสอบสถานะเดิมก่อนเปลี่ยนเป็นสถานะใหม่?"
- **แนวคำตอบ:**
  > 1. **สาเหตุ:** ในขั้นตอนทางธุรกิจ ลำดับของงานต้องเป็นเส้นตรง (`pending` ➔ `preparing` ➔ `delivered`) หากไม่มีการตรวจสอบ ผู้ใช้อาจส่งคำขอข้ามขั้นตอนได้
  > 2. **ผลกระทบ:** เกิดความผิดพลาดร้ายแรง เช่น ออเดอร์ที่ถูกจัดส่งให้ลูกค้าเสร็จสิ้นแล้ว (`delivered`) ถูกแก้สถานะย้อนกลับไปเป็น `cancelled` เพื่อขอเงินคืน หรือออเดอร์ที่ถูกยกเลิกไปแล้วกลับถูกนำไปทำอาหารซ้ำ ทำให้ร้านค้าสูญเสียต้นทุน
  > 3. **วิธีแก้:** การใช้ **State Machine Validation** เพื่อตรวจสอบสถานะปัจจุบันก่อนทุกครั้ง หากสถานะเป็นจุดสิ้นสุด (Terminal State เช่น `delivered` หรือ `cancelled`) จะตอบกลับด้วย HTTP Status `400 Bad Request` ป้องกันไม่ให้เกิดการแก้ไขข้อมูลย้อนหลัง

---

## 6. Checklist สำคัญที่สุดก่อนส่งงาน

ก่อนหมดเวลาสอบ 15 นาที ให้ทำตามขั้นตอนนี้ทีละข้อ:

1. [ ] **รันตรวจสอบฐานข้อมูล:** รัน `npm run check` ดูว่าขึ้นข้อความเชื่อมต่อ DB ได้ถูกต้อง
2. [ ] **รันชุดทดสอบทั้งหมด:** รัน `npm test` ดูว่าเทสต์ต้องขึ้น **สีเขียว (PASS) ครบทุกข้อ 100%**
3. [ ] **ตรวจสอบคำตอบข้อ 3:** เขียนอธิบายสาเหตุ ผลกระทบ และวิธีแก้ครบ 3 ประโยคในไฟล์ที่กำหนด
4. [ ] **กฎเหล็กการ Zip ส่งงาน (สำคัญมาก):**
   - ❌ **ห้ามส่งโฟลเดอร์ `node_modules` เด็ดขาด!** (ขนาดใหญ่มากและผิดกติกา)
   - ❌ **ห้ามส่งไฟล์ `.env` เด็ดขาด!** (ความปลอดภัย)
   - ให้เลือกเฉพาะโฟลเดอร์ Source Code (`app.js`, `routes/`, `tests/`, `package.json`, ฯลฯ) แล้วคลิกขวาบีบอัดเป็น `.zip` ส่งตามช่องทางที่อาจารย์กำหนด

---

ขอให้มั่นใจ มีสติ ค่อยๆ อ่าน Error สีแดงของ Jest แล้วเปิดเอกสารนี้เทียบทีละจุด รับรองว่าเก็บ 15 คะแนนเต็มแน่นอนครับ! 💯🚀
