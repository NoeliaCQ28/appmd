import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";

const SettingsModel = {
  getPreferences: async () => {
    try {
      const {
        result: [preferences],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "configuracion_listar",
        parameters: {
          in: ["Todos"],
        },
      });

      if (!preferences || preferences.length === 0) {
        throw new Error("No se encontraron preferencias");
      }
      const preferencesGrouped = preferences.reduce((acc, curr) => {
        const { sConfGrupo, ...rest } = curr;
        if (!acc[sConfGrupo]) {
          acc[sConfGrupo] = [];
        }
        acc[sConfGrupo].push(rest);
        return acc;
      }, {});

      return handleResponse(
        preferencesGrouped,
        "Preferencias recuperadas con éxito",
      );
    } catch (error) {
      logger.error(`Error al recuperar las preferencias: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al recuperar las preferencias: ${error.message}`,
        false,
        500,
      );
    }
  },
  createPreference: async (data) => {
    try {
      const { key, value, group, description } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "configuracion_crear",
        parameters: {
          in: [key, value, group, description],
        },
      });

      return handleResponse(null, "Preferencia creada con éxito", true, 201);
    } catch (error) {
      logger.error(`Error al crear la preferencia: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al crear la preferencia: ${error.message}`,
        false,
        500,
      );
    }
  },
  updatePreference: async (data) => {
    try {
      const { key, value, description } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "configuracion_editar",
        parameters: {
          in: [key, value, description],
        },
      });

      return handleResponse(
        null,
        "Preferencia actualizada con éxito",
        true,
        200,
      );
    } catch (error) {
      logger.error(`Error al actualizar la preferencia: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al actualizar la preferencia: ${error.message}`,
        false,
        500,
      );
    }
  },
  deletePreference: async ({ key }) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "configuracion_ocultar",
        parameters: {
          in: [key],
        },
      });

      return handleResponse(null, "Preferencia eliminada con éxito", true, 200);
    } catch (error) {
      logger.error(`Error al eliminar la preferencia: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al eliminar la preferencia: ${error.message}`,
        false,
        500,
      );
    }
  },
};

export default SettingsModel;
