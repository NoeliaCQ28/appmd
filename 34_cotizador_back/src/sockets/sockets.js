import { Server as SocketIO } from "socket.io";
import { logger } from "#libs/logger.js";

const DEFAULT_CORS = process.env.CORS_ORIGIN || "*";

/**
 * createSocketServer: Configura Socket.io y aplica módulos extensibles.
 *
 * @param {http.Server} server
 * @param {Object} options
 * @param {string} [options.corsOrigin]
 * @param {Function} [options.onClientConnect]
 * @param {Function} [options.onClientDisconnect]
 * @param {Function} [options.registerModules] - callback({ io, modules }) para añadir módulos
 * @returns {import('socket.io').Server}
 */
export function createSocketServer(server, options = {}) {
  const {
    corsOrigin = DEFAULT_CORS,
    onClientConnect,
    onClientDisconnect,
    registerModules,
  } = options;

  const io = new SocketIO(server, { cors: { origin: corsOrigin } });

  const nsp = io;

  const modules = [];

  if (typeof registerModules === "function") {
    registerModules({ io: nsp, modules });
  }

  nsp.on("connection", (socket) => {
    logger.info(`WS -> Connected: ${socket.id}`);

    modules.forEach((mod) => {
      if (mod.eventName && mod.initialEvent) {
        socket.emit(mod.eventName, mod.initialEvent());
      }
    });

    if (typeof onClientConnect === "function") {
      onClientConnect(socket, nsp);
    }

    socket.on("disconnect", (reason) => {
      logger.info(`WS -> Disconnect: ${socket.id} (${reason})`);
      if (typeof onClientDisconnect === "function") {
        onClientDisconnect(socket, nsp, reason);
      }
    });
  });

  return nsp;
}
