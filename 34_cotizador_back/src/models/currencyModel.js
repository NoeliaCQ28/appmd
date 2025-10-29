import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const CurrencyModel = {
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "mon_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(rows, "Monedas consultadas con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCode: async ({ currencyId }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "mon_optener_codigo",
        parameters: {
          in: [currencyId],
        },
      });

      return handleResponse(rows[0], "Moneda consultada con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default CurrencyModel;
