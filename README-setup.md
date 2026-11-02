# ชุดติดตั้งสภาพแวดล้อม ข้อสอบปลายภาค 88736065

ชุดนี้ใช้ติดตั้งและทดสอบสภาพแวดล้อมก่อนวันสอบ ไม่มีโค้ดของข้อสอบ

## ขั้นตอน

1. ติดตั้ง Docker Desktop และ Node.js ให้พร้อมใช้งาน

   1.1ตรวจสอบ Node.js และ npm
   node -v
   npm -v

ถ้ายังไม่มี Node.js สามารถใช้คำสั่งนี้ใน PowerShell เพื่อติดตั้งผ่าน Windows Package Manager ได้ (ถ้ามี winget)
winget install OpenJS.NodeJS.LTS

ติดตั้งเสร็จแล้วเปิด Terminal ใหม่
1.2ติดตั้ง Docker Desktop
ใช้คำสั่งใน Terminal ได้เช่นกัน
winget install Docker.DockerDesktop

ติดตั้งเสร็จให้เปิด Docker Desktop และรอจน Engine พร้อมใช้งาน
1.3จากนั้นรันคำสั่งโปรเจกต์ตามลำดับ
Copy-Item .env.example .env

docker compose up -d

npm install

npm run seed

npm run check

npm test

แนะนำ: ตอนนี้เปิด VS Code แล้วลองพิมพ์คำสั่งนี้ก่อน
node -v

2. คัดลอก `.env.example` เป็น `.env`
3. เปิดฐานข้อมูล: `docker compose up -d` (รอประมาณ 20 วินาที)
4. ติดตั้ง dependency: `npm install`
5. ใส่ข้อมูลตัวอย่าง: `npm run seed`
6. ตรวจการเชื่อมต่อ: `npm run check` ควรแสดงว่าเชื่อมต่อได้และพบเมนู 22 รายการ
7. ทดสอบเครื่องมือ: `npm test` ควรผ่านทั้ง 3 เทสต์ (ฐานข้อมูล, Express กับ Supertest, JWT)

## หมายเหตุ

- ถ้าพอร์ต 3309 ถูกใช้อยู่ ให้เปลี่ยนค่า `DB_PORT` ใน `.env` และพอร์ตใน `docker-compose.yml` ให้ตรงกัน
- ถ้าต้องการหยุดฐานข้อมูล ให้รัน `docker compose down`
