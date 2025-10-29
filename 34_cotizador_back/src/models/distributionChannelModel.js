import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const DistributionChannelModel = {
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "canal_distribucion_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Canales de distribución consultados con exito"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCodeAndCodeArea: async ({ pCanalDistribucionId }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "canal_distribucion_optener_codigo_y_area",
        parameters: {
          in: [pCanalDistribucionId],
        },
      });

      return handleResponse(
        rows[0],
        "Código y área de distribución consultado con exito"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default DistributionChannelModel;
