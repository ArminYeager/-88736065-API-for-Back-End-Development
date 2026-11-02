const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("Pattern A: GET /api/menu (Pagination, Filtering, Sorting)", () => {
  afterAll(async () => {
    try {
      if (pool && typeof pool.end === "function") {
        await pool.end();
      }
    } catch (e) {
      // ป้องกัน teardown error
    }
  });

  test("1. ควรคืนค่า 200 พร้อมรายการเมนู 5 รายการและ pagination ที่ถูกต้อง (page=1&limit=5)", async () => {
    const res = await request(app).get("/api/menu?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 5,
      total: 22,
      totalPages: 5,
    });
  });

  test("2. ควรคืนค่า 400 เมื่อส่ง page หรือ limit ที่น้อยกว่า 1", async () => {
    const res1 = await request(app).get("/api/menu?page=0&limit=10");
    expect(res1.status).toBe(400);

    const res2 = await request(app).get("/api/menu?page=1&limit=-5");
    expect(res2.status).toBe(400);
  });

  test("3. ควรกรองเฉพาะเมนูที่พร้อมขาย (available=true) และนับ total ได้ 20 รายการ", async () => {
    const res = await request(app).get("/api/menu?available=true&limit=50");

    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBe(20);
    expect(res.body.data.every((item) => Boolean(item.available) === true)).toBe(true);
  });

  test("4. ควรกรองเมนูตามช่วงราคา min_price=40 และ max_price=60 ได้ถูกต้อง", async () => {
    const res = await request(app).get("/api/menu?min_price=40&max_price=60&limit=50");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((item) => {
      expect(Number(item.price)).toBeGreaterThanOrEqual(40);
      expect(Number(item.price)).toBeLessThanOrEqual(60);
    });
  });

  test("5. ควรค้นหาเมนูตามชื่อ (search=ข้าวมันไก่) ได้ถูกต้อง", async () => {
    const res = await request(app).get("/api/menu?search=ข้าวมันไก่");

    expect(res.status).toBe(200);
    expect(res.body.data.some((item) => item.name.includes("ข้าวมันไก่"))).toBe(true);
  });

  test("6. ควรป้องกัน SQL Injection และ fallback ไปเรียงตาม id เมื่อส่ง sort ที่ไม่อยู่ใน Allowlist", async () => {
    const res = await request(app).get("/api/menu?sort=hacked_column;DROP TABLE menu_items;--");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].id).toBe(1);
  });
});

