import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../../config/db.js";

const QuoteTransformerDetailModel = {
  attachTransformerDetailToQuote: async ({
    user_id,
    quote_detail_id,
    details,
  }) => {
    const {
      TransformadorId,
      TransformadorPrecio,
      TransformadorCantidad,
      TransformadorDiasEntrega,
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
      Number.parseInt(TransformadorCantidad) *
      (Number.parseFloat(TransformadorPrecio) +
        Number.parseFloat(accesoriosAmount));

    const total = unitPrice * Number.parseInt(TransformadorCantidad);

    const { outputParamsResult } = await executeStoredProcedure({
      pool: db_pool,
      sp_name: "cotizaciondetalle_transformador_crear",
      parameters: {
        in: [
          quote_detail_id,
          TransformadorId,
          unitPrice,
          Number.parseInt(TransformadorCantidad),
          total,
          Number.parseInt(TransformadorDiasEntrega),
          isShippingPresent || false,
          shippingAmount || 0,
          isStartupPresent || false,
          startupAmount || 0,
        ],
        out: ["@pnCotizacionDetalleTransformadorId"],
      },
    });

    const { outParam1: CotizacionDetalleTransformerId } = outputParamsResult;

    if (
      CotizacionDetalleTransformerId === null ||
      !CotizacionDetalleTransformerId
    ) {
      throw new Error(
        "No se pudo crear la cotizacion detalle del transformador porque no se obtuvo el id de la cotizacion detalle",
      );
    }

    if (!Accesorios || Accesorios.length === 0) return;

    for (const accesorio of Accesorios) {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetalle_transformador_accesorio_crear",
        parameters: {
          in: [
            // Quantity of each accessory is always 1 by default
            Number.parseInt(CotizacionDetalleTransformerId),
            Number.parseInt(accesorio.id),
            Number.parseFloat(accesorio.price), // Unit price
            Number.parseFloat(accesorio.price), // Total
          ],
        },
      });
    }
  },
};

export default QuoteTransformerDetailModel;
