/**
 * @file index.js
 * @description Entrypoint de la API del cotizador de grupos electrógenos para Motores Diesel Andinos S.A.
 */

import { createSocketServer } from "./sockets/sockets.js";
import { logger } from "#libs/logger.js";
import createServer from "./server.js";
import { HealthSocketModule } from "./sockets/modules/HealthSocketModule.js";
import { DataImportSocketModule } from "./sockets/modules/DataImportSocketModule.js";

// Configuración del puerto
const PORT = process.env.PORT || 4000;

/**
 * @function startServer
 * @description Inicia el servidor Express en el puerto especificado.
 * Si ocurre un error, se registra en consola y finaliza el proceso.
 */
const startServer = async () => {
  try {
    const app = createServer();

    const server = await app.listen(PORT);

    const ERP_PROXY_API_ENDPOINT = process.env.ERP_PROXY_API_ENDPOINT.replace(
      "sap-proxy",
      "",
    );

    createSocketServer(server, {
      corsOrigin: "*",
      registerModules: ({ io, modules }) => {
        HealthSocketModule.build(
          { io, modules },
          {
            serverName: "MODASA S.A.",
            url: ERP_PROXY_API_ENDPOINT,
            intervalMs: 10000,
          },
        );
        HealthSocketModule.build(
          { io, modules },
          {
            serverName: "MODASA S.A. ERP (DEV)",
            url: `${ERP_PROXY_API_ENDPOINT}sap-proxy/healthcheck/dev`,
            intervalMs: 10000,
          },
        );
        HealthSocketModule.build(
          { io, modules },
          {
            serverName: "MODASA S.A. ERP (QAS)",
            url: `${ERP_PROXY_API_ENDPOINT}sap-proxy/healthcheck/qas`,
            intervalMs: 10000,
          },
        );
        HealthSocketModule.build(
          { io, modules },
          {
            serverName: "MODASA S.A. ERP (PROD)",
            url: `${ERP_PROXY_API_ENDPOINT}sap-proxy/healthcheck/prod`,
            intervalMs: 10000,
          },
        );

        DataImportSocketModule.build({ io, modules });
      },
      onClientConnect: (socket) => logger.info(`WS -> Connect: ${socket.id}`),
      onClientDisconnect: (socket, _io) =>
        logger.info(`WS -> Disconnect: ${socket.id}`),
    });

    logger.info(`Servidor (API + WS) corriendo en puerto ${PORT}`);
  } catch (error) {
    logger.error("Error al iniciar el servidor", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Inicio del servidor
startServer();
