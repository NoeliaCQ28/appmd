import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../../config/db.js";

const QuoteCableDetailModel = {
  attachCableDetailToQuote: async ({ user_id, quote_detail_id, details }) => {
    const {
      CableCantidad,
      CableDiasEntrega,
      CableId,
      CablePrecio,
      operativeCosts: {
        shipping: { isPresent: isShippingPresent, amount: shippingAmount } = {},
        startup: { isPresent: isStartupPresent, amount: startupAmount } = {},
      } = {},
    } = details;

    const total =
      Number.parseInt(CableCantidad) * Number.parseFloat(CablePrecio);

    await executeStoredProcedure({
      pool: db_pool,
      sp_name: "cotizaciondetalle_cable_crear",
      parameters: {
        in: [
          quote_detail_id,
          CableId,
          CableCantidad,
          Number.parseFloat(CablePrecio),
          total,
          Number.parseInt(CableDiasEntrega),
          isShippingPresent || false,
          shippingAmount || 0,
          isStartupPresent || false,
          startupAmount || 0,
        ],
      },
    });
  },
};

export default QuoteCableDetailModel;
