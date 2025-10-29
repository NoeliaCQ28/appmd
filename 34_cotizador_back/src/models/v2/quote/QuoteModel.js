import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import AuditModel, { AuditActions } from "#models/AuditModel.js";
import QuoteRouter from "./QuoteRouter";

const QuoteModel = {
  create: async ({ ctx, quote }) => {
    let quoteId = null;

    try {
      logger.info(
        `Iniciando creación de cotización para usuario: ${ctx?.user?.id}`,
      );
      logger.info(`Datos de cotización: ${JSON.stringify(quote, null, 2)}`);

      const {
        result: [rows],
        outputParamsResult,
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_crear",
        parameters: {
          in: [
            quote.cotizador_tipo,
            quote.cliente_id,
            quote.ejecutivo_id,
            quote.fecha,
            quote.validez_oferta,
            quote.proyecto,
            quote.direccion,
            quote.contacto,
            quote.telefono,
            quote.email,
            // ¿Envio? [Deprecated 31/07/2025]
            0,
            // Costo de envio [Deprecated 31/07/2025]
            0,
            // ¿Instalación? [Deprecated 31/07/2025]
            0,
            // Costo de instalación [Deprecated 31/07/2025]
            0,
            // ¿Puesta en marcha? [Deprecated 31/07/2025]
            0,
            // Costo de puesta en marcha [Deprecated 31/07/2025]
            0,
            quote.mercado,
            quote.moneda_id,
            quote.tipo_cambio,
            quote.condicion_comercial_id,
            quote.estado,
            quote.usuario_aprobador_id,
            quote.aprobacion_fecha,
            quote.eliminado,
            quote.canal_distribucion_id,
            quote.incoterm_id,
            quote.incoterm_valor,
            quote.incoterm_valor_seguro,
            quote.descuento_global,
            quote.margen_global,
            quote.observaciones,
            quote.observaciones_HTML,
            ctx?.user?.id,
          ],
          out: ["@pCotizacion_Id"],
        },
      });

      const { outParam1 } = outputParamsResult;

      quoteId = outParam1;

      if (!quoteId) {
        throw new Error("Error al crear la cotizacion");
      }

      logger.info(`Cotización creada con Id: ${quoteId}`);

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.CREATE,
        humanDescription: `El usuario ${ctx.user.name} creó la cotizacion ${quoteId}.`,
        entity: "cotizacion",
        entityId: quoteId,
        newData: quote,
      });

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.STATE_CHANGE,
        humanDescription: `La cotizacion ${quoteId} del usuario ${ctx.user.name} fue inicializada en estado BORRADOR.`,
        actionDetail: "BORRADOR",
        entity: "cotizacion",
        entityId: quoteId,
      });

      const quoteDetails = quote.details;

      const hasDetails = quoteDetails && quoteDetails.length > 0;

      if (!hasDetails) {
        throw new Error("La cotizacion no puede ser creada sin detalles");
      }

      const { detailHandler } = QuoteRouter({ userId: ctx.user.id, quote });

      for (const quoteDetail of quoteDetails) {
        const {
          tipo,
          cantidad,
          precio_unitario,
          producto_id,
          quote_extra_details,
        } = quoteDetail;

        logger.info(
          `Creando detalle de cotizacion ${quoteId}: ${JSON.stringify(quoteDetail)}`,
        );

        const importe = cantidad * precio_unitario;

        const { outputParamsResult } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotdet_crear",
          parameters: {
            in: [
              quoteId,
              tipo,
              cantidad,
              precio_unitario,
              importe,
              producto_id,
            ],
            out: ["@nCotDetalleItem"],
          },
        });

        const { outParam1: quoteDetailId } = outputParamsResult;

        if (!quoteDetailId) {
          return handleResponse(
            null,
            "No se ha podido crear el detalle de la cotizacion, debido a que no se ha podido obtener el ID del detalle",
            false,
            500,
          );
        }

        try {
          await detailHandler.createDetail({
            ctx: ctx,
            quoteDetailId,
            detail: quote_extra_details,
          });
        } catch (error) {
          logger.error(
            `Error al crear el detalle de la cotizacion: ${error.message}`,
          );

          throw error;
        }
      }

      return handleResponse(rows, "Cotizacion creada exitosamente");
    } catch (error) {
      logger.error(
        `Error al crear la cotizacion: ${error.message}, se procederá a eliminar la cotización creada sí existiera (ocultar)`,
      );

      if (quoteId && quoteId !== null) {
        try {
          const {
            result: [[user]],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "usu_listarC",
            parameters: {
              in: [ctx.user.id],
            },
          });

          const userName = user?.sUsuNombre || "Desconocido";

          logger.error(JSON.stringify(user, null, 2));

          await executeStoredProcedure({
            pool: db_pool,
            sp_name: "cot_ocultar",
            parameters: {
              in: [
                quoteId,
                ctx.user.id,
                (error.message &&
                  `El usuario con id ${ctx?.user?.name} (${userName}) 
                   ha tenido un problema al crear la cotización: ${error.message}`) ||
                  "Error al crear la cotización",
              ],
            },
          });
        } catch (error) {
          logger.error(
            `Error al ocultar la cotización ${quoteId} tras un error en la creación: ${error.message}`,
          );
        }
      }

      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getById: async ({ ctx, quoteId }) => {
    try {
      const {
        result: [[quoteRaw]],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [quoteId],
        },
      });

      if (!quoteRaw) {
        return handleResponse(
          null,
          "No se encontró la cotización con el ID proporcionado",
          false,
          404,
        );
      }

      const { detailHandler } = QuoteRouter({ quote: quoteRaw });

      const details = await detailHandler.getDetails({ quoteId });

      const quoteWithDetails = {
        ...quoteRaw,
        details: details,
      };

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.READ,
        humanDescription: `El usuario ${ctx.user.name} consultó la cotizacion ${quoteId}.`,
        entity: "cotizacion",
        entityId: quoteId,
      });

      return handleResponse(
        quoteWithDetails,
        "Cotizacion consultada con exito",
      );
    } catch (error) {
      const { message } = error;
      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.READ,
        humanDescription: `El usuario ${ctx.user.name} intentó consultar la cotizacion ${quoteId}, pero ocurrió un error: ${message}`,
        entity: "cotizacion",
        entityId: quoteId,
      });
      return handleResponse(null, message, false, 500);
    }
  },
  updateDetail: async ({ ctx, quoteId, quoteDetailId, detail }) => {
    try {
      const {
        result: [[quoteRaw]],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [quoteId],
        },
      });

      if (!quoteRaw) {
        return handleResponse(
          null,
          "No se encontró la cotización con el ID proporcionado",
          false,
          404,
        );
      }

      const { detailHandler } = QuoteRouter({
        userId: ctx.user.id,
        quote: quoteRaw,
        callback: (type) => {
          if (type !== 1) {
            throw new Error(
              "Solo se pueden editar detalles de cotizaciones modernas",
            );
          }
        },
      });

      try {
        await detailHandler.updateDetail({
          ctx: ctx,
          quoteDetailId,
          detail,
        });
      } catch (error) {
        logger.error(
          `Error al editar el detalle de la cotizacion: ${error?.message}`,
        );

        throw error;
      }

      await QuoteModel.incrementQuoteRevision({ ctx, quoteId });

      return handleResponse(null, "Cotizacion actualizada con exito");
    } catch (error) {
      const message = error?.message || "Error desconocido";

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.UPDATE,
        humanDescription: `El usuario ${ctx.user.name} intentó actualizar el detalle de la cotizacion ${quoteId}, pero ocurrió un error: ${message}`,
        entity: "cotizacion",
        entityId: quoteId,
        subEntity: "cotizaciondetallege",
        subEntityId: quoteDetailId,
      });

      return handleResponse(null, message, false, 500);
    }
  },
  addDetails: async ({ ctx, quoteId, details }) => {
    try {
      const {
        result: [[quoteRaw]],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [quoteId],
        },
      });

      if (!quoteRaw) {
        return handleResponse(
          null,
          "No se encontró la cotización con el ID proporcionado",
          false,
          404,
        );
      }

      const { detailHandler } = QuoteRouter({
        userId: ctx.user.id,
        quote: quoteRaw,
        callback: (type) => {
          if (![1, 3, 4].includes(type)) {
            throw new Error(
              "Solo se pueden agregar detalles a cotizaciones modernas. Cotizaciones soportadas: Grupos electrogenos y celdas",
            );
          }
        },
      });

      for (const detail of details) {
        const {
          tipo,
          cantidad,
          precio_unitario,
          producto_id,
          quote_extra_details,
        } = detail;

        logger.info(
          `Creando detalle de cotizacion ${quoteId}: ${JSON.stringify(detail)}`,
        );

        const importe = cantidad * precio_unitario;

        const { outputParamsResult } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotdet_crear",
          parameters: {
            in: [
              quoteId,
              tipo,
              cantidad,
              precio_unitario,
              importe,
              producto_id,
            ],
            out: ["@nCotDetalleItem"],
          },
        });

        const { outParam1: quoteDetailId } = outputParamsResult;

        if (!quoteDetailId) {
          return handleResponse(
            null,
            "No se ha podido crear el detalle de la cotizacion, debido a que no se ha podido obtener el ID del detalle",
            false,
            500,
          );
        }

        try {
          await detailHandler.createDetail({
            ctx: ctx,
            quoteDetailId,
            detail: quote_extra_details,
          });
        } catch (error) {
          logger.error(
            `Error al crear el detalle de la cotizacion: ${error.message}`,
          );

          throw error;
        }
      }

      await QuoteModel.incrementQuoteRevision({ ctx, quoteId });

      return handleResponse(null, "Detalle agregado con exito");
    } catch (error) {
      const message = error?.message || "Error desconocido";
      return handleResponse(null, message, false, 500);
    }
  },
  incrementQuoteRevision: async ({ ctx, quoteId }) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_incrementar_version_codigo",
        parameters: {
          in: [quoteId],
        },
      });
    } catch (error) {
      const message = error?.message || "Error desconocido";

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.STATE_CHANGE,
        humanDescription: `La cotizacion ${quoteId} del usuario ${ctx.user.name} no pudo incrementar su versión debido a un error: ${message}`,
        entity: "cotizacion",
        entityId: quoteId,
      });
    }
  },
};

export default QuoteModel;
