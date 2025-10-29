import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import db_pool from "./../../config/db.js";

const QuoteDetailGEModel = {
  getAllByQuoteId: async (quote_id) => {
    try {
    } catch (error) {}
  },
  attachGEToQuoteDetail: async (
    user_id,
    quote_detail_id,
    quote_extra_details,
  ) => {
    try {
      const {
        integradoraId,
        itmA,
        params: {
          voltaje,
          frecuencia,
          fases,
          factorPotencia,
          altura,
          temperatura,
          insonoro,
        },
        power: { primeKW, primeKVA, standbyKW, standbyKVA },
        model,
        motor,
        alternador,
        discount,
        increaseDiscount,
        deliveryDays,
        originalPrice,
        finalPrice,
        quantity,
        otherComponents,
        isResidencial,
        operativeCosts: {
          shipping: {
            isPresent: isShippingPresent,
            amount: shippingAmount,
          } = {},
          startup: { isPresent: isStartupPresent, amount: startupAmount } = {},
        } = {},
      } = quote_extra_details;

      const { result, outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetallege_crear",
        parameters: {
          in: [
            quote_detail_id,
            integradoraId,
            itmA,
            voltaje,
            frecuencia,
            fases,
            factorPotencia,
            altura,
            temperatura,
            insonoro,
            model.id,
            model.name,
            model.price,
            motor.Motor_Id,
            motor.Motor,
            alternador.Alternador_Id,
            alternador.Alternador,
            discount?.value || 0,
            discount?.descripcion || "",
            increaseDiscount,
            deliveryDays,
            originalPrice,
            finalPrice,
            primeKW,
            primeKVA,
            standbyKW,
            standbyKVA,
            quantity,
            isResidencial,
            isShippingPresent || false,
            shippingAmount || 0,
            isStartupPresent || false,
            startupAmount || 0,
          ],
          out: ["@CotizacionDetalleGEId"],
        },
      });

      const { outParam1: CotizacionDetalleGEId } = outputParamsResult;

      if (CotizacionDetalleGEId === null || !CotizacionDetalleGEId) {
        throw new Error(
          "No se pudo crear la cotizacion detalle del grupo electrogeno porque no se obtuvo el id de la cotizacion detalle",
        );
      }

      for (const otherComponent of otherComponents) {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "compadicionalge_crear",
          parameters: {
            in: [
              CotizacionDetalleGEId,
              otherComponent.id,
              otherComponent.name,
              otherComponent.description,
              otherComponent.price,
            ],
          },
        });
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetallege_carreta",
        parameters: {
          in: [CotizacionDetalleGEId],
        },
      });

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_modulo_control",
          parameters: {
            in: [CotizacionDetalleGEId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al adjuntar el modulo de control al detalle del grupo electrogeno al crear: ${error.message}`,
        );
      }
    } catch (error) {
      logger.error(
        `Error al adjuntar grupo electrogeno a detalle de cotizacion: ${error.message}`,
      );

      throw error;
    }
  },
  delete: async (user_id, quote_id) => {
    try {
    } catch (error) {}
  },
};

export default QuoteDetailGEModel;
