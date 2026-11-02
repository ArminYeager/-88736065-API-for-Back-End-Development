// connection pool ของ MySQL
const mysql = require("mysql2/promise");
const { db } = require("./config");

const pool = mysql.createPool({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Proxy เพื่อให้รองรับทั้ง const pool = require('./db') และ const { pool } = require('./db')
const dbExport = new Proxy(pool, {
  get(target, prop, receiver) {
    if (prop === "pool") {
      return target;
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === "function") {
      return val.bind(target);
    }
    return val;
  },
});

module.exports = dbExport;
