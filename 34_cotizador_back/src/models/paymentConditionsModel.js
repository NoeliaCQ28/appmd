import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const PaymentConditionsModel = {
  getAll: async () => {
    try {
      const {
        result: [paymentConditions],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "condiciones_pago_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        paymentConditions,
        "Condiciones de pago consultadas con exito"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default PaymentConditionsModel;
