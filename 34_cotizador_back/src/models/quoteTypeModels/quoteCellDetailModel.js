import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../../config/db.js";

const QuoteCellDetailModel = {
  attachCellDetailToQuote: async ({ user_id, quote_detail_id, details }) => {
    const {
      CeldaId,
      CeldaPrecio,
      CeldaCantidad,
      CeldaDiasEntrega,
      details: Accesorios,
      operativeCosts: {
        shipping: { isPresent: isShippingPresent, amount: shippingAmount } = {},
        startup: { isPresent: isStartupPresent, amount: startupAmount } = {},
      } = {},
    } = details;

    const accesoriosAmount =
      Accesorios?.reduce((acc, item) => {
        return acc + Number.parseFloat(item.price);
      }, 0) || 0;

    const unitPrice =
      Number.parseFloat(CeldaPrecio) + Number.parseFloat(accesoriosAmount);

    const total = unitPrice * Number.parseInt(CeldaCantidad);

    const { outputParamsResult } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "cotizaciondetalle_celda_crear",
      parameters: {
        in: [
          quote_detail_id,
          CeldaId,
          unitPrice,
          Number.parseInt(CeldaCantidad),
          total,
          Number.parseInt(CeldaDiasEntrega),
          isShippingPresent || false,
          shippingAmount || 0,
          isStartupPresent || false,
          startupAmount || 0,
        ],
        out: ["@pnCotizacionDetalleCeldaId"],
      },
    });

    const { outParam1: CotizacionDetalleCeldaId } = outputParamsResult;

    if (CotizacionDetalleCeldaId === null || !CotizacionDetalleCeldaId) {
      throw new Error(
        "No se pudo crear la cotizacion detalle de la celda porque no se obtuvo el id del detalle de la cotizacion",
      );
    }

    if (!Accesorios || Accesorios.length === 0) return;

    for (const accesorio of Accesorios) {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetalle_celda_accesorio_crear",
        parameters: {
          in: [
            // Quantity of each accessory is always 1 by default
            Number.parseInt(CotizacionDetalleCeldaId),
            Number.parseInt(accesorio.id),
            Number.parseInt(accesorio.price), // Unit price
            Number.parseInt(accesorio.price), // Total
          ],
        },
      });
    }
  },
};

export default QuoteCellDetailModel;
