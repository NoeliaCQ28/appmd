import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import { UAParser } from "ua-parser-js";

export const AuditActions = Object.freeze({
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  READ: "READ",
  STATE_CHANGE: "STATE_CHANGE",
  SAP_SYNC: "SAP_SYNC",
  PUT_FILE: "PUT_FILE",
  DELETE_FILE: "DELETE_FILE",
  UPDATE_FILE: "UPDATE_FILE",
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CHANGE_CONFIGURATION: "CHANGE_CONFIGURATION",
  OTHER: "OTHER",
  TRANSFORM_TO_SAP: "TRANSFORM_TO_SAP",
  SEND_TO_SAP: "SEND_TO_SAP",
});

const AuditModel = {
  /**
   * Registra una operación de auditoría
   * @param {Object} params
   * @param {number} params.ctx - contexto de la petición, debe incluir info del usuario
   * @param {string} params.action - Tipo de acción: CREATE, UPDATE, DELETE, STATE_CHANGE, SAP_SYNC
   * @param {string} [params.actionDetail] - Detalle adicional de la acción (opcional)
   * @param {string} [params.humanDescription] - Descripción legible de la acción (opcional)
   * @param {string} params.entity - Entidad afectada: cotizacion, cotizacion_detalle, cliente, etc.
   * @param {number} params.entityId - ID del registro afectado
   * @param {Object} params.oldData - Datos antes del cambio (opcional)
   * @param {Object} params.newData - Datos después del cambio
   * @param {Array<string>} params.modifiedFields - Campos modificados
   * @param {Object} params.context - Contexto de la petición
   */
  log: async ({
    ctx,
    action,
    actionDetail = null,
    humanDescription = null,
    entity,
    entityId = null,
    subEntity = null,
    subEntityId = null,
    oldData = null,
    newData = null,
    modifiedFields = [],
    success = true,
    error = null,
    durationMs = 0,
  }) => {
    try {
      await executeStoredProcedure({
        sp_name: "auditoria_registrar",
        pool: db_pool,
        parameters: {
          in: [
            ctx?.user?.id,
            action,
            actionDetail,
            humanDescription,
            entity,
            entityId,
            subEntity,
            subEntityId,
            oldData ? JSON.stringify(oldData) : null,
            newData ? JSON.stringify(newData) : null,
            modifiedFields.join(","),
            ctx?.method || "desconocido",
            ctx?.endpoint || "desconocido",
            ctx?.user?.ip || "desconocido",
            ctx?.ua?.userAgentRaw || "desconocido",
            success,
            error || null,
            durationMs,
          ],
        },
      });

      return true;
    } catch (err) {
      logger.error("Error al registrar auditoría:", {
        error: err.message,
        userId,
        action,
        entity,
      });
      return false;
    }
  },

  /**
   * Obtiene el historial de cambios de una entidad
   */
  getHistory: async ({ entity, entityId, limit = 50 }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "auditoria_historial",
        parameters: {
          in: [entity, entityId, limit],
        },
      });

      return handleResponse(rows, "Historial consultado con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  /**
   * Obtiene todas las acciones de un usuario
   */
  getUserActions: async ({ userId, startDate, endDate, limit = 100 }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "auditoria_acciones_usuario",
        parameters: {
          in: [userId, startDate, endDate, limit],
        },
      });

      return handleResponse(rows, "Acciones del usuario consultadas con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  /**
   * Obtiene un resumen de actividad
   */
  getActivity: async ({ startDate, endDate, limit = 100 }) => {
    try {
      console.log(startDate, endDate, limit);
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "auditoria_actividad",
        parameters: {
          in: [startDate, endDate, limit],
        },
      });

      const rowsWithUAParsed = rows.map((row) => {
        try {
          return {
            ...row,
            sUserAgent: UAParser(row.sUserAgent),
          };
        } catch {
          return {
            ...row,
            sUserAgent: null,
          };
        }
      });

      const data = {
        logs: rowsWithUAParsed,
        meta: {
          startDate,
          endDate,
          limit,
          count: rows?.length || 0,
        },
      };

      return handleResponse(data, "Actividad consultada con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  /**
   * Obtiene un resumen de actividad
   */
  getActivitySummary: async ({ startDate, endDate }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "auditoria_actividad_resumen",
        parameters: {
          in: [startDate, endDate],
        },
      });

      return handleResponse(rows, "Resumen de actividad consultado con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default AuditModel;
