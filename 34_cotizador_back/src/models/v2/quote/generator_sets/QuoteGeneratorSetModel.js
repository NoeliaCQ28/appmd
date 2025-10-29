import db_pool from "#config/db.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import AuditModel, { AuditActions } from "#models/AuditModel.js";
import { composeExtraDetails } from "./QuoteGeneratorSetDatabaseMapper";

const QuoteGeneratorSetModel = {
  createDetail: async ({ ctx, quoteDetailId, detail }) => {
    try {
      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetallege_crear",
        parameters: {
          in: [
            quoteDetailId,
            detail.sIntKey,
            detail.IntegradoraId,
            detail.nIntITMA,
            detail.nIntVoltaje,
            detail.nIntFrecuencia,
            detail.nIntFases,
            detail.nIntFP,
            detail.nIntAltura,
            detail.nIntTemperatura,
            detail.nIntInsonoro ? 1 : 0,
            detail.ModeloGE_Id,
            detail.Motor_Id,
            detail.Alternador_Id,
            detail.nITMId,
            detail.nIntDescuentoPorcentaje,
            detail.nIntMargenExportacionPorcentaje,
            // Incremento de descuento (Deprecated 31/07/2025)
            0,
            detail.nIntDiasParaEntrega,
            detail.PrimeKW,
            detail.PrimeKVA,
            detail.StandByKW,
            detail.StandByKVA,
            detail.nIntPesoTotalKg,
            detail.nIntCostoTotalUSD,
            detail.nIntPrecioTotalUSD,
            detail.nIntCantidad,
            // 1 -> Silenciador Industrial
            // 2 -> Silenciador Residencial
            Number.parseInt(detail.nIntSileciadorTipo),
            detail.nIntSileciadorPermiteCambio ? 1 : 0,
            detail.operativeCosts?.shipping?.isPresent ? 1 : 0,
            detail.operativeCosts?.shipping?.amount || 0,
            detail.operativeCosts?.startup?.isPresent ? 1 : 0,
            detail.operativeCosts?.startup?.amount || 0,
            detail.configuration.alternator.isPresent ? 1 : 0,
            detail.configuration.alternator.alternatorBaseId,
            detail.configuration.alternator.alternatorSwappedId,
            detail.configuration.itm.isPresent ? 1 : 0,
            detail.configuration.itm.itmBaseId,
            detail.configuration.itm.itmSwappedId,
            detail.sRegimen || "STAND BY",
          ],
          out: ["@CotizacionDetalleGEId"],
        },
      });

      const { outParam1: quoteDetailGeneratorSetId } = outputParamsResult;

      if (quoteDetailGeneratorSetId === null || !quoteDetailGeneratorSetId) {
        await AuditModel.log({
          ctx: ctx,
          action: AuditActions.CREATE,
          humanDescription: `El usuario ${ctx?.user?.name} intento agregar un grupo electrógeno a la cotización con id de detalle ${quoteDetailId}, pero falló debido a que no se obtuvo el id del detalle de cotización.`,
          entity: "cotizaciondetalle",
          entityId: quoteDetailId,
          subEntity: "cotizaciondetallege",
          success: false,
          error:
            "No se pudo crear la cotizacion detalle del grupo electrogeno porque no se obtuvo el id de la cotizacion detalle",
          oldData: detail,
        });

        throw new Error(
          "No se pudo crear la cotizacion detalle del grupo electrogeno porque no se obtuvo el id de la cotizacion detalle",
        );
      }

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.CREATE,
        humanDescription: `El usuario ${ctx?.user?.name} agregó un grupo electrógeno a la cotización con id de detalle ${quoteDetailId}, satisfactoriamente.`,
        entity: "cotizaciondetalle",
        entityId: quoteDetailId,
        subEntity: "cotizaciondetallege",
        subEntityId: quoteDetailGeneratorSetId,
        newData: detail,
      });

      const accessories = detail?.accessories;

      const hasAccessories = accessories && accessories.length > 0;

      if (hasAccessories) {
        for (const accessory of accessories) {
          await executeStoredProcedure({
            pool: db_pool,
            sp_name: "compadicionalge_crear",
            parameters: {
              in: [
                quoteDetailGeneratorSetId,
                accessory.id,
                accessory.name,
                accessory.description,
                accessory.price,
              ],
            },
          });

          await AuditModel.log({
            ctx: ctx,
            action: AuditActions.CREATE,
            humanDescription: `El usuario ${ctx?.user?.name} agregó un accesorio a la cotización con id de detalle ${quoteDetailGeneratorSetId}, satisfactoriamente.`,
            entity: "cotizaciondetallege",
            entityId: quoteDetailGeneratorSetId,
            subEntity: "cotdetallegecomponenteadicional",
            newData: accessory,
          });
        }
      }

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_carreta",
          parameters: {
            in: [quoteDetailGeneratorSetId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al adjuntar la carreta al detalle del grupo electrogeno al crear: ${error.message}`,
        );
      }

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_modulo_control",
          parameters: {
            in: [quoteDetailGeneratorSetId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al adjuntar el modulo de control al detalle del grupo electrogeno al crear: ${error.message}`,
        );
      }
    } catch (error) {
      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.CREATE,
        humanDescription: `El usuario ${ctx?.user?.name} intento agregar un grupo electrógeno a la cotización con id de detalle ${quoteDetailId}, pero falló debido a un error. Error: ${error?.message || "Desconocido"}`,
        entity: "cotizaciondetalle",
        entityId: quoteDetailId,
        subEntity: "cotizaciondetallege",
        success: false,
        error:
          error?.message ||
          "No se pudo adjuntar el grupo electrogeno al detalle de cotizacion",
        oldData: detail,
      });

      logger.error(
        `Error al adjuntar grupo electrogeno a detalle de cotizacion: ${error.message}`,
      );
    }
  },
  updateDetail: async ({ ctx, quoteDetailId, detail }) => {
    try {
      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetallege_editar",
        parameters: {
          in: [
            quoteDetailId,
            detail.sIntKey,
            detail.IntegradoraId,
            detail.nIntITMA,
            detail.nIntVoltaje,
            detail.nIntFrecuencia,
            detail.nIntFases,
            detail.nIntFP,
            detail.nIntAltura,
            detail.nIntTemperatura,
            detail.nIntInsonoro,
            detail.ModeloGE_Id,
            detail.Motor_Id,
            detail.Alternador_Id,
            detail.nITMId,
            detail.nIntDescuentoPorcentaje,
            detail.nIntMargenExportacionPorcentaje,
            // Incremento de descuento (Deprecated 31/07/2025)
            0,
            detail.nIntDiasParaEntrega,
            detail.PrimeKW,
            detail.PrimeKVA,
            detail.StandByKW,
            detail.StandByKVA,
            detail.nIntPesoTotalKg,
            Number.parseFloat(detail.nIntCostoTotalUSD),
            Number.parseFloat(detail.nIntPrecioTotalUSD),
            detail.nIntCantidad,
            // 1 -> Silenciador Industrial
            // 2 -> Silenciador Residencial
            detail.nIntSileciadorTipo,
            detail.operativeCosts?.shipping?.isPresent ? 1 : 0,
            detail.operativeCosts?.shipping?.amount || 0,
            detail.operativeCosts?.startup?.isPresent ? 1 : 0,
            detail.operativeCosts?.startup?.amount || 0,
            detail.configuration.alternator.isPresent ? 1 : 0,
            detail.configuration.alternator.alternatorBaseId,
            detail.configuration.alternator.alternatorSwappedId,
            detail.configuration.itm.isPresent ? 1 : 0,
            detail.configuration.itm.itmBaseId,
            detail.configuration.itm.itmSwappedId,
            detail.sRegimen || "STAND BY",
          ],
          out: ["@CotizacionDetalleGEId"],
        },
      });

      const { outParam1: quoteDetailGeneratorSetId } = outputParamsResult;

      if (quoteDetailGeneratorSetId === null || !quoteDetailGeneratorSetId) {
        await AuditModel.log({
          ctx: ctx,
          action: AuditActions.UPDATE,
          humanDescription: `El usuario ${ctx?.user?.name} intentó actualizar el grupo electrógeno en la cotización con id de detalle ${quoteDetailId}, pero falló debido a un error. Error: ${error?.message || "Desconocido"}`,
          entity: "cotizaciondetalle",
          entityId: quoteDetailId,
          subEntity: "cotizaciondetallege",
          success: false,
          error:
            error?.message ||
            "No se pudo editar el grupo electrogeno porque no se obtuvo el identificador",
          oldData: detail,
        });

        throw new Error(
          `No se pudo editar el grupo electrogeno porque no se obtuvo el identificador`,
        );
      }

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.UPDATE,
        humanDescription: `El usuario ${ctx?.user?.name} actualizó el grupo electrógeno en la cotización con id de detalle ${quoteDetailId}.`,
        entity: "cotizaciondetalle",
        entityId: quoteDetailId,
        subEntity: "cotizaciondetallege",
        subEntityId: quoteDetailGeneratorSetId,
        newData: detail,
      });

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "compadicionalge_eliminar",
          parameters: {
            in: [quoteDetailGeneratorSetId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al eliminar los accesorios del grupo electrogeno: ${error?.message}`,
        );
      }

      const accessories = detail?.accessories;

      const hasAccessories = accessories && accessories.length > 0;

      if (hasAccessories) {
        for (const accessory of accessories) {
          await executeStoredProcedure({
            pool: db_pool,
            sp_name: "compadicionalge_crear",
            parameters: {
              in: [
                quoteDetailGeneratorSetId,
                accessory.id,
                accessory.name,
                accessory.description,
                accessory.price,
              ],
            },
          });
        }

        await AuditModel.log({
          ctx: ctx,
          action: AuditActions.CREATE,
          humanDescription: `Se actualizaron los accesorios del grupo electrógeno en la cotización con id de detalle ${quoteDetailId}. Se reemplazaron todos los accesorios anteriores. El usuario que realizó la acción fue ${ctx?.user?.name}.`,
          entity: "cotizaciondetalle",
          subEntity: "cotdetallegecomponenteadicional",
          newData: accessories,
        });
      }

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_carreta",
          parameters: {
            in: [quoteDetailGeneratorSetId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al adjuntar la carreta al detalle del grupo electrogeno al crear: ${error?.message}`,
        );
      }

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_modulo_control",
          parameters: {
            in: [quoteDetailGeneratorSetId],
          },
        });
      } catch (error) {
        logger.error(
          `Error al adjuntar el modulo de control al detalle del grupo electrogeno al crear: ${error?.message}`,
        );
      }

      try {
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetallege_actualizar_precios",
          parameters: {
            in: [
              quoteDetailGeneratorSetId,
              detail.operativeCosts?.shipping?.isPresent ? 1 : 0,
              detail.operativeCosts?.shipping?.amount || 0,
              detail.operativeCosts?.startup?.isPresent ? 1 : 0,
              detail.operativeCosts?.startup?.amount || 0,
            ],
          },
        });
      } catch (error) {
        logger.error(
          `Error al actualizar los precios del detalle del grupo electrogeno: ${error?.message}`,
        );
      }
    } catch (error) {
      logger.error(
        `Error al editar grupo electrogeno a detalle de cotizacion: ${error?.message}`,
      );

      throw error;
    }
  },
  getDetails: async ({ quoteId }) => {
    try {
      const {
        result: [detailsRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listarC",
        parameters: {
          in: [quoteId],
        },
      });

      if (!detailsRaw || detailsRaw.length === 0) {
        throw new Error(
          "No se encontraron detalles de grupo electrogeno para la cotizacion proporcionada",
        );
      }

      const detailsPromises = detailsRaw.map(async (detail) => {
        const quoteDetailId = detail.nCotDetItem;

        const {
          result: [quoteExtraDetailsRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizaciondetalleextra_listarC",
          parameters: {
            in: [quoteDetailId],
          },
        });

        const {
          result: [accessoriesRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "compadicionaldetalle_listarC",
          parameters: {
            in: [quoteDetailId],
          },
        });

        const quote_extra_details = composeExtraDetails(
          detail,
          quoteExtraDetailsRaw[0],
          accessoriesRaw,
        );

        return {
          ...detail,
          quote_extra_details,
        };
      });

      const details = await Promise.all(detailsPromises);

      return details;
    } catch (error) {
      logger.error(
        `Error al obtener los detalles del grupo electrogeno de la cotizacion: ${error.message}`,
      );
      throw error;
    }
  },
};

export default QuoteGeneratorSetModel;
