const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const pool = require("../db");
const { jwtSecret } = require("../config");

describe("Pattern B, C, D: Orders API (/api/orders)", () => {
  let authToken;

  beforeAll(() => {
    // สร้าง Token สำหรับใช้ในการทดสอบที่มีการยืนยันตัวตน (Pattern C)
    authToken = jwt.sign({ id: 1, role: "admin" }, jwtSecret, { expiresIn: "1h" });
  });

  afterAll(async () => {
    try {
      if (pool && typeof pool.end === "function") {
        await pool.end();
      }
    } catch (e) {
      // ป้องกัน teardown error
    }
  });

  // ==========================================
  // Pattern B: สั่งอาหารด้วย Transaction (POST /api/orders)
  // ==========================================
  describe("Pattern B: สร้างคำสั่งซื้อด้วย Transaction (POST /api/orders)", () => {
    test("1. ควรสร้างออเดอร์สำเร็จเมื่อข้อมูลถูกต้อง ได้ Status 201 และคืน order_id", async () => {
      const payload = {
        customer_name: "นายทดสอบ สั่งอาหาร",
        items: [
          { menu_item_id: 1, quantity: 2 }, // ข้าวผัดกุ้ง (available = 1)
          { menu_item_id: 2, quantity: 1 }, // ผัดกะเพรา (available = 1)
        ],
      };

      const res = await request(app).post("/api/orders").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("order_id");
      expect(res.body.data.customer_name).toBe("นายทดสอบ สั่งอาหาร");
      expect(res.body.data.status).toBe("pending");
    });

    test("2. ควรตอบ 400 เมื่อข้อมูลไม่ผ่าน Validation (ไม่มี customer_name หรือ items ว่าง)", async () => {
      const res1 = await request(app).post("/api/orders").send({
        customer_name: "",
        items: [{ menu_item_id: 1, quantity: 1 }],
      });
      expect(res1.status).toBe(400);

      const res2 = await request(app).post("/api/orders").send({
        customer_name: "สมชาย",
        items: [],
      });
      expect(res2.status).toBe(400);

      const res3 = await request(app).post("/api/orders").send({
        customer_name: "สมชาย",
        items: [{ menu_item_id: 1, quantity: 0 }],
      });
      expect(res3.status).toBe(400);
    });

    test("3. ควรตอบ 400 และ Rollback ทั้งหมดเมื่อรายการที่ 2 เป็นเมนูที่หมด (id=9) หรือไม่มีอยู่จริง", async () => {
      // ตรวจสอบจำนวนออเดอร์ก่อนส่งคำขอ
      const [beforeRows] = await pool.query("SELECT COUNT(*) AS count FROM orders");
      const countBefore = beforeRows[0].count;

      const payload = {
        customer_name: "ทดสอบ Rollback",
        items: [
          { menu_item_id: 1, quantity: 1 }, // มีของ
          { menu_item_id: 9, quantity: 1 }, // ข้าวขาหมู (available = FALSE -> ต้อง Rollback!)
        ],
      };

      const res = await request(app).post("/api/orders").send(payload);

      // ยืนยันว่าต้องได้ 400
      expect(res.status).toBe(400);

      // ยืนยันว่าต้องไม่มีออเดอร์ค้างในฐานข้อมูล (Rollback สมบูรณ์)
      const [afterRows] = await pool.query("SELECT COUNT(*) AS count FROM orders");
      expect(afterRows[0].count).toBe(countBefore);
    });
  });

  // ==========================================
  // Pattern D: ดึงรายละเอียดออเดอร์พร้อม JOIN (GET /api/orders/:id)
  // ==========================================
  describe("Pattern D: ดึงรายละเอียดออเดอร์ (GET /api/orders/:id)", () => {
    test("1. ควรดึงรายละเอียดออเดอร์สำเร็จ ได้ Status 200 พร้อมรายการอาหารและ total_amount", async () => {
      // ดึงออเดอร์ id = 1 ที่มีอยู่ใน seed.sql
      const res = await request(app).get("/api/orders/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
      expect(Array.isArray(res.body.data.items)).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data).toHaveProperty("total_amount");
      expect(typeof res.body.data.total_amount).toBe("number");
    });

    test("2. ควรตอบ 404 เมื่อค้นหาออเดอร์ที่ไม่พบในระบบ", async () => {
      const res = await request(app).get("/api/orders/999999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================
  // Pattern C: อัปเดตสถานะและตรวจ JWT (PATCH /api/orders/:id/status)
  // ==========================================
  describe("Pattern C: อัปเดตสถานะออเดอร์และตรวจสิทธิ์ JWT (PATCH /api/orders/:id/status)", () => {
    test("1. ควรอัปเดตสถานะสำเร็จเป็น preparing เมื่อแนบ Token ถูกต้อง", async () => {
      // ใช้ order id = 3 (สถานะเดิมคือ pending ตาม seed.sql)
      const res = await request(app)
        .patch("/api/orders/3/status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "preparing" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("preparing");
    });

    test("2. ควรตอบ 401 Unauthorized เมื่อไม่ส่ง Token มา", async () => {
      const res = await request(app)
        .patch("/api/orders/3/status")
        .send({ status: "preparing" });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    test("3. ควรตอบ 400 เมื่อพยายามเปลี่ยนสถานะออเดอร์ที่จัดส่งแล้ว (delivered) หรือยกเลิกแล้ว", async () => {
      // order id = 1 ใน seed.sql มีสถานะเป็น 'delivered' แล้ว
      const res = await request(app)
        .patch("/api/orders/1/status")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "cancelled" });

      expect(res.status).toBe(400);
    });
  });
});

