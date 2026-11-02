const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

/**
 * Middleware สำหรับตรวจสอบ JWT Token ใน Authorization Header
 * Header format: Authorization: Bearer <token>
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ตัด 'Bearer ' ออก

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "กรุณาแนบ Token ใน Header Authorization",
      },
    });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Token ไม่ถูกต้องหรือหมดอายุการใช้งาน",
        },
      });
    }

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

