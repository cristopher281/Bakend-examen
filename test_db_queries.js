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
  try {
    const conn = await mysql.createConnection(cfg);
    const [autores] = await conn.query('SELECT id, nombre FROM autores ORDER BY nombre ASC');
    const [libros] = await conn.query("SELECT l.id, l.titulo, l.autor_id AS autorId FROM libros l ORDER BY l.id DESC");
    console.log('AUTORES:', autores);
    console.log('LIBROS:', libros);
    await conn.end();
  } catch (err) {
    console.error('DB error:', err.message);
    process.exit(1);
  }
})();
