import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const TaxIdTypeModel = {
  getAll: async () => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "tipo_identificacion_fiscal_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        cells,
        "Tipos de Identificaciones fiscales consultadas con exito"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default TaxIdTypeModel;
