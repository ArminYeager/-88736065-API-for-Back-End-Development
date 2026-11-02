const express = require("express");
const menuRouter = require("./routes/menu");
const ordersRouter = require("./routes/orders");

const app = express();

// Middleware แปลง Request Body เป็น JSON
app.use(express.json());

// Endpoint สำหรับ Health Check
app.get("/ping", (req, res) => {
  res.status(200).json({ ok: true, message: "Server is healthy" });
});

// เชื่อมต่อ Routes ทั้งหมดภายใต้ Prefix /api
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);

// จัดการกรณีเรียก Route ที่ไม่มีในระบบ (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `ไม่พบ Endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware (จัดการข้อผิดพลาดระดับ Server)
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;

