import mysql from "mysql2";
import dotenv from 'dotenv'; // Cargar variables de entorno desde .env

// Cargar variables de entorno (si existe un .env en la raíz)
dotenv.config();

// --- Tu Script SQL ---
// Pega el SQL de creación/seed aquí. Es idempotente (usa IF NOT EXISTS y checks antes de insertar).
const sqlScript = `
CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (autor_id) REFERENCES autores(id)
    ON DELETE SET NULL
);

-- Insertar autores (solo si la tabla está vacía)
INSERT INTO autores (nombre)
SELECT * FROM (SELECT 'Gabriel García Márquez') AS tmp
WHERE NOT EXISTS (SELECT nombre FROM autores WHERE nombre = 'Gabriel García Márquez');

INSERT INTO autores (nombre)
SELECT * FROM (SELECT 'Mario Vargas Llosa') AS tmp
WHERE NOT EXISTS (SELECT nombre FROM autores WHERE nombre = 'Mario Vargas Llosa');

INSERT INTO autores (nombre)
SELECT * FROM (SELECT 'Isabel Allende') AS tmp
WHERE NOT EXISTS (SELECT nombre FROM autores WHERE nombre = 'Isabel Allende');

INSERT INTO autores (nombre)
SELECT * FROM (SELECT 'Jorge Luis Borges') AS tmp
WHERE NOT EXISTS (SELECT nombre FROM autores WHERE nombre = 'Jorge Luis Borges');

INSERT INTO autores (nombre)
SELECT * FROM (SELECT 'Pablo Neruda') AS tmp
WHERE NOT EXISTS (SELECT nombre FROM autores WHERE nombre = 'Pablo Neruda');


-- Insertar libros (solo si la tabla está vacía)
INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'Cien años de soledad', 1) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'Cien años de soledad');

INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'El amor en los tiempos del cólera', 1) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'El amor en los tiempos del cólera');

INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'La ciudad y los perros', 2) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'La ciudad y los perros');

INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'La casa de los espíritus', 3) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'La casa de los espíritus');

INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'Ficciones', 4) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'Ficciones');

INSERT INTO libros (titulo, autor_id)
SELECT * FROM (SELECT 'Veinte poemas de amor', 5) AS tmp
WHERE NOT EXISTS (SELECT titulo FROM libros WHERE titulo = 'Veinte poemas de amor');
`;
// --- Fin del Script SQL ---


// Configuración de la base de datos (usar variables de entorno en .env)
// Valores por defecto no contienen credenciales sensibles.
const dbUser = process.env.DB_USER || 'defaultdb';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'biblioteca';
const dbPort = process.env.DB_PORT || 3306;

const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: Number(dbPort),
  multipleStatements: true // Permite ejecutar el script SQL completo
});

/*
  Nota: este script ejecuta las sentencias SQL al iniciar la conexión.
  - Si prefieres ejecutar la creación/seed sólo una vez, envuelve la ejecución
    en una comprobación externa o coméntala después de la primera ejecución.
  - Variables de entorno esperadas (añadir un archivo `.env` en la raíz):
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=tu_password
      DB_NAME=biblioteca
      DB_PORT=3306
*/

connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    console.error("Soluciones posibles:");
    console.error("1. Verifica que MySQL esté ejecutándose");
    console.error("2. Revisa las variables de entorno en .env o en tu entorno");
    console.error("3. Crea la base de datos si no existe: CREATE DATABASE biblioteca;");
    process.exit(1);
  }

  console.log("✅ Conexión exitosa a MySQL ✅");

  // Ejecutar script de creación/seed (idempotente)
  console.log("Creando tablas e insertando datos (si es necesario)...");
  connection.query(sqlScript, (err, results) => {
    if (err) {
      console.error("Error al ejecutar el script SQL:", err.message);
    } else {
      console.log("Tablas creadas y datos insertados (si procedía).\n");
    }

    // NOTA: No cerramos la conexión aquí para que el resto de la app pueda usarla.
    // Si quieres cerrarla después del setup, descomenta la siguiente línea:
    // connection.end();
  });
});

export default connection;