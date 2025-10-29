import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const SalesOfficeModel = {
  getByLocation: async ({ psTipoMercado, pnCodigoAreaVentas }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "oficina_ventas_localizacion",
        parameters: {
          in: [psTipoMercado, pnCodigoAreaVentas],
        },
      });

      return handleResponse(
        rows[0],
        "La oficina de ventas se obtuvo correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default SalesOfficeModel;
