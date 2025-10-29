import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const ComercialConditionsModel = {
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(
        rows,
        "Condiciones comerciales consultadas con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (user_id, data) => {
    try {
      const {
        tipo,
        marketId,
        titulo,
        descripcion,
        descripcion_html,
        estado = 0,
        eliminado = 0,
      } = data;

      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_crear",
        parameters: {
          in: [
            tipo,
            marketId,
            titulo,
            descripcion,
            descripcion_html,
            estado,
            eliminado,
            user_id,
          ],
          out: ["@pCondicionesComerciales_Id"],
        },
      });

      return handleResponse(rows, "Condición comercial creada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  update: async (user_id, comercial_condition_id, data) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_listarC",
        parameters: {
          in: [comercial_condition_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(
          null,
          "Condición comercial no encontrada",
          false,
          404,
        );
      }

      const {
        tipo,
        marketId,
        titulo,
        descripcion,
        descripcion_html,
        estado,
        eliminado = 0,
      } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_editar",
        parameters: {
          in: [
            comercial_condition_id,
            tipo,
            marketId,
            titulo,
            descripcion,
            descripcion_html,
            estado,
            eliminado,
            user_id,
          ],
        },
      });

      return handleResponse(null, "Condición comercial editada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  delete: async (user_id, comercial_condition_id) => {
    try {
      const {
        result: [rowsExistsCustomer],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_listarC",
        parameters: {
          in: [comercial_condition_id],
        },
      });

      if (!rowsExistsCustomer || rowsExistsCustomer.length === 0) {
        return handleResponse(
          null,
          "Condición comercial no encontrada",
          false,
          404,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "con_ocultar",
        parameters: {
          in: [comercial_condition_id, user_id],
        },
      });

      return handleResponse(null, "Condición comercial eliminada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default ComercialConditionsModel;
