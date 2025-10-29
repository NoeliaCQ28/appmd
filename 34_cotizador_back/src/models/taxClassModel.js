import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const TaxClassModel = {
  getAll: async () => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "clase_impuesto_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(cells, "Clases de impuestos consultadas con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default TaxClassModel;
