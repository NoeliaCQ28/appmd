import cors from "cors";
import express, { static as static_ } from "express";
import morgan from "morgan";
import { apiReference } from "@scalar/express-api-reference";
// Importación de rutas
import { handleResponse } from "#helpers/handlerResponse.js";
import { logger } from "#libs/logger.js";
import openApiSpec from "./config/openapi.json";
import authRoutes from "./routes/authRoutes.js";
import cablesRoutes from "./routes/cablesRoutes.js";
import cellsRoutes from "./routes/cellsRoutes.js";
import comercialConditionsRoutes from "./routes/comercialConditionsRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import distributionChannelRoutes from "./routes/distributionChannelRoutes.js";
import electrogenosRoutes from "./routes/electrogenosRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import fichasRoutes from "./routes/fichasRoutes.js";
import generatorSetRoutes from "./routes/generatorSetRoutes.js";
import incotermsRoutes from "./routes/incotermsRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import marketsRoutes from "./routes/marketsRoutes.js";
import opcionalesRoutes from "./routes/opcionalesRoutes.js";
import paymentConditionsRoute from "./routes/paymentConditionsRoute.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import societyRoutes from "./routes/societyRoutes.js";
import taxClassRoutes from "./routes/taxClassRoutes.js";
import taxIdTypeRoutes from "./routes/taxIdTypeRoutes.js";
import transformersRoutes from "./routes/transformersRoutes.js";
import typeChangeRoutes from "./routes/typeChangeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import generatorSetRoutesV2 from "./routes/v2/GeneratorSetRoutes.js";
import quoteRoutesV2 from "./routes/v2/quote/QuoteRoutes.js";
import settingsRoutesv2 from "./routes/v2/SettingsRoutes.js";
import vendedorRoutes from "./routes/vendedorRoutes.js";
import customerSAPRoutes from "./SAP/customers/route/CustomerSAPRoutes.js";
import materialsSAPRoutes from "./SAP/materials/route/MaterialSAPRoutes.js";
import quoteSAPRoutes from "./SAP/quote/routes/QuoteSAPRoutes.js";
import dataImportRoutes from "./data_import/DataImportRoutes.js";
import { AuditMiddleware } from "./middleware/AuditMiddleware.js";
import AuditRoutes from "./routes/AuditRoutes.js";

const inProduction = process.env.NODE_ENV === "production";
const inDevelopment =
  process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development";
const inTest = process.env.NODE_ENV === "testing";

function createServer() {
  // Inicialización de la aplicación Express
  const app = express();

  // Configuración de middlewares globales
  // Confianza en el proxy para que el rate limit tome la IP real detrás de Nginx/ALB
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "*", // Allow requests from all domains
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Forwarded-For", "X-Real-IP"],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(static_("public"));

  // Middleware de auditoría
  app.use(AuditMiddleware);

  if (!inTest) {
    const morganFormat = inProduction
      ? "combined"
      : inDevelopment
        ? "dev"
        : "combined";
    app.use(
      morgan(morganFormat, {
        stream: logger.stream,
      }),
    );
  }

  /**
   * @route /api/sunat
   * @description Maneja el tipo de cambio de sunat en dolares.
   */
  app.use("/api/v1/sunat", typeChangeRoutes);

  /**
   * @route GET /api/docs
   * @description Documentación interactiva de la API con Scalar
   */
  app.use(
    "/api/docs",
    apiReference({
      spec: {
        content: openApiSpec,
      },
      theme: "purple",
      darkMode: true,
      layout: "modern",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
    }),
  );

  /**
   * @route GET /api/openapi.json
   * @description Especificación OpenAPI en formato JSON
   */
  app.get("/api/openapi.json", (_req, res) => {
    res.json(openApiSpec);
  });

  /**
   * @route /api/auth
   * @description Maneja la autenticación y autorización de usuarios.
   */
  // Limite más estricto para intentos de login/refresh/etc
  app.use("/api/auth", authRoutes);

  /**
   * @route /api/electrogenos
   * @description Gestión de grupos electrógenos (registro, consulta, actualización).
   */
  app.use("/api/electrogenos", electrogenosRoutes);

  /**
   * @route /api/electrogenos
   * @description Gestión de grupos electrógenos (registro, consulta, actualización).
   */
  app.use("/api/v1/grupos-electrogenos", generatorSetRoutes);

  /**
   * @route /api/vendedores
   * @description Gestión de vendedores encargados de la comercialización y asesoría en cotizaciones.
   */
  app.use("/api/vendedores", vendedorRoutes);

  /**
   * @route /api/fichas
   * @description Manejo de fichas técnicas de los grupos electrógenos.
   */
  app.use("/api/fichas", fichasRoutes);

  /**
   * @route /api/v1/countries
   * @description Provee información sobre países o localizaciones.
   */
  app.use("/api/v1/countries", locationRoutes);

  /**
   * @route /api/v1/clientes
   * @description Gestión de clientes, que permite almacenar datos relevantes para cotizaciones.
   */
  app.use("/api/v1/clientes", customerRoutes);

  /**
   * @route /api/v1/condiciones-comerciales
   * @description Manejo de condiciones comerciales (términos de pago, garantías, etc.) para las cotizaciones.
   */
  app.use("/api/v1/condiciones-comerciales", comercialConditionsRoutes);

  /**
   * @route /api/v1/cotizaciones
   * @description Creación, consulta y actualización de cotizaciones para grupos electrógenos.
   */
  app.use("/api/v1/cotizaciones", quoteRoutes);

  /**
   * @route /api/v1/monedas
   * @description Información y manejo de monedas para la conversión y presentación de precios.
   */
  app.use("/api/v1/monedas", currencyRoutes);

  /**
   * @route /api/v1/opcionales
   * @description Gestión de opcionales o accesorios que pueden incluirse en una cotización.
   */
  app.use("/api/v1/opcionales", opcionalesRoutes);

  /**
   * @route /api/v1/canales-distribucion
   * @description Gestión de canales de distribución para entrega y soporte.
   */
  app.use("/api/v1/canales-distribucion", distributionChannelRoutes);

  /**
   * @route /api/v1/incoterms
   * @description Provee información sobre Incoterms, necesarios para definir responsabilidades en el transporte.
   */
  app.use("/api/v1/incoterms", incotermsRoutes);

  /**
   * @route /api/v1/mercados
   * @description Provee información sobre los mercados o sectores a los que se dirigen los grupos electrógenos. (Organizacion de ventas en el ERP)
   */
  app.use("/api/v1/mercados", marketsRoutes);

  /**
   * @route /api/v1/cables
   * @description Provee información sobre los cables
   */
  app.use("/api/v1/cables", cablesRoutes);

  /**
   * @route /api/v1/transformadores
   * @description Provee información sobre los transformadores
   */
  app.use("/api/v1/transformadores", transformersRoutes);

  /**
   * @route /api/v1/celdas
   * @description Provee información sobre las celdas
   */
  app.use("/api/v1/celdas", cellsRoutes);

  /**
   * @route /api/v1/emails
   * @description Servicio para el envío de emails
   */
  app.use("/api/v1/emails", emailRoutes);

  /**
   * @route /api/v1/reports
   * @description Servicio para la generación de reportes
   */
  app.use("/api/v1/reports", reportsRoutes);

  /**
   * @route /api/v1/files
   * @description Servicio para la carga y gestión de archivos.
   */
  app.use("/api/v1/files", uploadRoutes);

  /**
   * @route /api/v1/usuarios
   * @description Gestión de usuarios.
   */
  app.use("/api/v1/usuarios", userRoutes);

  /**
   * @route /api/v1/roles
   * @description Gestión de roles.
   */
  app.use("/api/v1/roles", rolesRoutes);

  /**
   * @route /api/v1/SAP
   * @description Manejo de la integración con SAP para clientes
   */
  app.use("/api/v1/SAP/clientes", customerSAPRoutes);

  /**
   * @route /api/v1/SAP
   * @description Manejo de la integración con SAP para materiales
   */
  app.use("/api/v1/SAP/materiales", materialsSAPRoutes);

  /**
   * @route /api/v1/SAP
   * @description Manejo de la integración con SAP para cotizaciones
   */
  app.use("/api/v1/SAP/cotizaciones", quoteSAPRoutes);

  /**
   * @route /api/v1/tipo-identificador-fiscal
   * @description Tipos de identificador fiscal
   */
  app.use("/api/v1/tipo-identificador-fiscal", taxIdTypeRoutes);

  /**
   * @route /api/v1/sociedades
   * @description Sociedades de clientes
   */
  app.use("/api/v1/sociedades", societyRoutes);

  /**
   * @route /api/v1/condiciones-pago
   * @description Condiciones de pago
   */
  app.use("/api/v1/condiciones-pago", paymentConditionsRoute);

  /**
   * @route /api/v1/clases-impuestos
   * @description Clases de impuestos
   */
  app.use("/api/v1/clases-impuestos", taxClassRoutes);

  /**
   * @route /api/v1/data-import
   * @description Importación de datos
   */
  app.use("/api/v1/data-import", dataImportRoutes);

  /**
   * @route /api/v1/data-import
   * @description Importación de datos
   */
  app.use("/api/v1/audit", AuditRoutes);

  /**
   * @route /api/v2/generator-sets
   * @description Gestión de grupos electrógenos (registro, consulta, actualización).
   */
  app.use("/api/v2/generator-sets", generatorSetRoutesV2);

  /**
   * @route /api/v2/quote
   * @description Gestión de cotizaciones
   */
  app.use("/api/v2/quote", quoteRoutesV2);

  /**
   * @route /api/v2/settings
   * @description Gestión de configuraciones
   */
  app.use("/api/v2/settings", settingsRoutesv2);

  /**
   * @route GET /
   * @description Endpoint raíz para pruebas y verificación del servicio.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @returns {string} "Hello World!"
   */
  app.get("/", (req, res) => {
    logger.info(req.headers["user-agent"]);
    res.send("Hello World!");
  });

  /**
   * @route GET /health
   * @description Endpoint de healthcheck para verificar el estado de la API.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @returns {Object} JSON con el estado de la API.
   */
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      message:
        "La API del Cotizador de MODASA S.A. está funcionando correctamente",
    });
  });

  /**
   * @middleware NotFoundHandler
   * @description Middleware para manejar rutas no encontradas.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {Function} next - Función para pasar al siguiente middleware.
   */
  app.use(async (req, res, _next) => {
    const ctx = req.ctx;

    logger.warn("Ruta no encontrada en la API", ctx);

    res
      .status(404)
      .json(
        handleResponse(
          null,
          "La ruta solicitada no existe en esta API.",
          false,
          404,
        ),
      );
  });

  /**
   * @middleware ErrorHandler
   * @description Middleware global para el manejo de errores en la API.
   * @param {Error} err - Objeto de error.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {Function} next - Función para pasar al siguiente middleware.
   */
  app.use((err, _req, res, _next) => {
    logger.error("Error no manejado en la petición", {
      message: err.message,
      stack: err.stack,
    });
    res
      .status(err.status || 500)
      .json(
        handleResponse(
          null,
          err.message || "Internal Server Error",
          false,
          err.status || 500,
        ),
      );
  });

  return app;
}

export default createServer;
