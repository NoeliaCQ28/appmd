import { logger } from "#libs/logger.js";
import mysql2 from "mysql2/promise";

const db_pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  timezone: '-05:00', // Set timezone to UTC-5
});

try {
  const connection = await db_pool.getConnection();
  logger.info("Conexión a la base de datos establecida correctamente.");
  connection.release();
} catch (error) {
  logger.error("Error al conectar a la base de datos:", {
    message: error.message,
    stack: error.stack,
  });
}

export default db_pool;
