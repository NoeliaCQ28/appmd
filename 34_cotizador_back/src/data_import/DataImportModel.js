import { isAxiosError } from "axios";
import { DATA_TRANSFORMER_API } from "#libs/axios.js";
import { logger } from "#libs/logger.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import FormData from "form-data";
import { mysql } from "#libs/db.js";

export const DataImportModel = {
  import: async ({ transformName, file, sheetName, upsertMode }) => {
    try {
      if (!file) {
        throw new Error("Archivo no recibido");
      }
      if (!sheetName) {
        throw new Error("sheetName no recibido");
      }
      if (!upsertMode) {
        throw new Error("upsertMode no recibido");
      }
      if (!transformName) {
        throw new Error("transformName no recibido");
      }

      const formData = new FormData();
      formData.append("file", file.buffer, file.originalname);
      formData.append("sheet_name", sheetName);
      formData.append("upsert_mode", upsertMode);

      const response = await DATA_TRANSFORMER_API.post(
        `/transform/${transformName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const websocketURL = `${process.env.DATA_TRANSFORMER_API_ENDPOINT?.replace(
        "http",
        "ws",
      )}/ws/${response.data?.job_id}`;

      // Crear insntancia de WebSocket para el job_id recibido y esperar mensajes de cuando se complete el job para luego realizar una operacion de insercion en la base de datos

      listenTransformationProcess(websocketURL, response.data?.job_id);

      return handleResponse(
        {
          ...response.data,
          websocketURL: websocketURL,
          sheetName: sheetName,
          upsertMode: upsertMode,
        },
        "Transformación iniciada",
      );
    } catch (error) {
      logger.error("Error in DataImportModel.import: ", error);
      return handleResponse(
        null,
        error?.message || "Error desconocido al importar datos",
        false,
        500,
      );
    }
  },
  getJobStatus: async (job_id) => {
    try {
      const response = await DATA_TRANSFORMER_API.get(`/job/${job_id}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        logger.warn(`${error?.response?.data.detail}`);
      } else {
        logger.error("Error desconocido al recuperar estado del job: ", error);
      }
      throw error;
    }
  },
  getJobSQLFile: async (job_id) => {
    try {
      const response = await DATA_TRANSFORMER_API.get(
        `/job/${job_id}/download`,
      );
      return response.data;
    } catch (error) {
      logger.error("Error in DataTransformerService.getJobSQLFile", error);
      throw error;
    }
  },
  bindWebSocket: (job_id) => {
    try {
      const DATA_TRANSFORMER_WS_ENDPOINT =
        process.env.DATA_TRANSFORMER_API_ENDPOINT?.replace("http", "ws");
      const DATA_TRANSFORMER_API_KEY = process.env.DATA_TRANSFORMER_API_KEY;

      if (!DATA_TRANSFORMER_WS_ENDPOINT) {
        throw new Error("DATA_TRANSFORMER_API_ENDPOINT not configured");
      }

      if (!DATA_TRANSFORMER_API_KEY) {
        throw new Error("DATA_TRANSFORMER_API_KEY not configured");
      }

      const wsUrl = `${DATA_TRANSFORMER_WS_ENDPOINT}/ws/${job_id}`;

      logger.info(`Connecting to DataTransformer WebSocket: ${wsUrl}`);
      logger.debug(`Using API Key: ${DATA_TRANSFORMER_API_KEY}`);
      logger.debug(`Job ID: ${job_id}`);
      logger.debug(`WebSocket URL: ${wsUrl}`);

      const ws = new WebSocket(wsUrl, [], {
        headers: {
          "X-API-KEY": DATA_TRANSFORMER_API_KEY,
        },
      });

      return ws;
    } catch (error) {
      logger.error("Error in DataTransformerService.bindWebSocket", error);
    }
  },
};

function listenTransformationProcess(websocketURL, jobId) {
  const ws = new WebSocket(websocketURL, [], {
    headers: {
      "X-API-KEY": process.env.DATA_TRANSFORMER_API_KEY,
    },
  });

  ws.onopen = () => {
    logger.info("WebSocket connection opened for job_id: ", jobId);
  };

  ws.onerror = (error) => {
    logger.error("WebSocket error: ", error);
  };

  ws.onmessage = async (event) => {
    const messageData = JSON.parse(event.data);

    const jobId = messageData?.job_id;
    const jobResultIsSuccess = messageData?.result?.success;
    const sqlStatements = messageData?.result?.sql_statements;

    if (jobResultIsSuccess && sqlStatements && sqlStatements?.length > 0) {
      logger.info(
        `Job ${jobId} completed successfully. Executing SQL statements...`,
      );

      const reservedMYSQL = await mysql.reserve();

      try {
        await reservedMYSQL.begin(async (tx) => {
          for (const sqlStatement of sqlStatements) {
            try {
              logger.debug(`Executing SQL Statement: ${sqlStatement}`);
              await tx.unsafe(sqlStatement);
              logger.debug(`Successfully executed: ${sqlStatement}`);
            } catch (error) {
              logger.error(
                `Error executing SQL statement: ${sqlStatement}`,
                error?.message,
              );

              throw error; // Rethrow to trigger transaction rollback
            }
          }
        });
      } catch (error) {
        logger.error(`Error reserving MySQL connection: `, error);
      } finally {
        reservedMYSQL.release();
      }
    }
  };

  ws.onclose = () => {
    logger.info("WebSocket connection closed for job_id: ", jobId);
  };
}
