import { SQL } from "bun";
import { logger } from "./logger";

export const mysql = new SQL({
  adapter: "mysql",

  hostname: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,

  max: 20,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,

  // Callbacks
  onconnect: (_) => {
    logger.info("MySQL [BUN] connected successfully");
  },
  onclose: (_, err) => {
    if (err) {
      logger.error("MySQL [BUN] connection error:", err);
    } else {
      logger.info("MySQL [BUN] connection closed");
    }
  },
});
