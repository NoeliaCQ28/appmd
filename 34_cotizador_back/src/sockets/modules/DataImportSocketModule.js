import { logger } from "#libs/logger.js";
import { DataImportModel } from "../../data_import/DataImportModel";

/**
 * DataTransformerHandler: Maneja las conexiones WebSocket para monitoreo de jobs
 * del servicio Data Transformer externo
 */
export class DataImportSocketModule {
  constructor() {
    this.activeJobs = new Map();
  }

  static build(ctx) {
    const dataTransformerNamespace = ctx.io.of("/data-transformer");

    dataTransformerNamespace.on("connection", (socketServer) => {
      socketServer.on("get_job_status", async (data) => {
        const { job_id } = data;

        if (!job_id) {
          socketServer.emit("error", { message: "job_id requerido" });
          return;
        }

        try {
          const socketClient = DataImportModel.bindWebSocket(job_id);

          socketClient.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              
              socketServer.emit("job_status", msg);
            } catch (parseError) {
              console.error(`❌ Error parsing message from job ${job_id}:`, parseError);
            }
          };

          socketClient.onerror = (error) => {
            console.error(`❌ Error en job ${job_id}:`, error);
            socketServer.emit("error", {
              message: `Error obteniendo estado del job ${job_id}: ${error.message}`,
            });
            socketServer.disconnect(true);
          };

          socketClient.onclose = (event) => {
            logger.warn(`🔌 Conexión cerrada para job ${job_id}:`, {
              code: event.code,
              reason: event.reason,
            });
            if (event.code !== 1000) { // 1000 = normal closure
              socketServer.emit("error", {
                message: `Conexión cerrada inesperadamente para job ${job_id}: ${event.reason}`,
              });

              socketServer.disconnect(true);
            }
          };

        } catch (error) {
          console.error(`❌ Error inicializando job ${job_id}:`, error);
          socketServer.emit("error", {
            message: `Error inicializando estado del job ${job_id}: ${error.message}`,
          });
          socketServer.disconnect(true);
        }
      });
    })

    ctx.modules.push({
      eventName: "data-transformer-module",
      initialEvent: () => ({
        status: "active",
        timestamp: Date.now(),
      }),
    });
  }

  /**
   * Conecta un cliente a un job específico
   * @param {Socket} clientSocket - Socket del cliente
   * @param {string} job_id - ID del job a monitorear
   */
}
