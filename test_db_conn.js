import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

(async ()=>{
  const cfg = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  };
  console.log('Attempting connection with config:', {...cfg, password: cfg.password ? '***' : ''});
  try {
    const conn = await mysql.createConnection(cfg);
    const [rows] = await conn.query('SELECT 1 as ok');
    console.log('DB query result:', rows);
    await conn.end();
  } catch (err) {
    console.error('DB connection error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    process.exit(1);
  }
})();
