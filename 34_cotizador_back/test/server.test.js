import { createPool } from "mysql2/promise";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import createServer from "../src/server.js";

// Configuración de la conexión de prueba a MySQL
let testPool;
let app;

beforeEach(async () => {
  // Crear una conexión de prueba
  testPool = createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || "test_user",
    password: process.env.DB_PASSWORD || "test_password",
    database: process.env.DB_TEST_DATABASE || "test_cotizador_db",
  });

  try {
    const connection = await testPool.getConnection();
    connection.release();
  } catch (error) {
    throw error;
  }

  app = createServer();
});

afterEach(async () => {
  if (testPool) {
    await testPool.end();
  }
});

// Pruebas básicas
describe("Server API", () => {
  test("El endpoint raíz retorna Hello World", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });

  test("El endpoint de health retorna status OK", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});
