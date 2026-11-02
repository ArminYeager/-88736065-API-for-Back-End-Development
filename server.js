const app = require("./app");
const config = require("./config");

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server กำลังทำงานที่พอร์ต http://localhost:${PORT}`);
  console.log(`📋 ตรวจสอบรายการเมนู: http://localhost:${PORT}/api/menu`);
});

