import { ERP_PROXY_API } from "#libs/axios.js";
import { executeFunction, executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import { splitIntoChunks } from "#libs/utils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";
import { MaterialSAPModel } from "../SAP/materials/models/MaterialSAPModel.js";
import { QuoteValidateSAPModel } from "../SAP/quote/models/QuoteValidateSAPModel.js";
import AuditModel, { AuditActions } from "./AuditModel.js";
import QuoteDetailsModel from "./quoteDetailsModel.js";
import QuoteModelv2 from "./v2/quote/QuoteModel.js";

const QuotesModel = {
  getAllQuoteTypes: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciontipo_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Tipos de cotizacion consultados con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(rows, "Cotizaciones consultadas con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAllOrdersOnly: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_pedidos_listarC",
        parameters: {
          in: [0],
        },
      });

      return handleResponse(
        rows,
        "Cotizaciones (pedidos) consultadas con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getById: async (id) => {
    try {
      const {
        result: [[rows]],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [id],
        },
      });

      const { Cotizacon_Id } = rows;

      const { getAllByQuoteId: getAllDetailsByQuoteId } = QuoteDetailsModel;

      const details = await getAllDetailsByQuoteId(Cotizacon_Id);

      const quoteWithDetails = {
        ...rows,
        details: details.data,
      };

      return handleResponse(
        quoteWithDetails,
        "Cotizacion consultada con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (user_id, data) => {
    try {
      const {
        cliente_id,
        ejecutivo_id,
        fecha,
        validez_oferta,
        proyecto,
        direccion,
        contacto,
        telefono,
        email,
        envio,
        costo_envio,
        instalacion,
        costo_instalacion,
        puesta_en_marcha,
        costo_puesta_en_marcha,
        mercado,
        moneda_id,
        tipo_cambio,
        condicion_comercial_id,
        canal_distribucion_id,
        incoterm_id,
        estado = 1,
        usuario_aprobador_id,
        aprobacion_fecha,
        eliminado = 0,
        cotizador_tipo,
        descuento_global,
        margen_global,
        details,
        observaciones,
        observaciones_HTML,
      } = data;

      const {
        result: [rows],
        outputParamsResult,
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_crear",
        parameters: {
          in: [
            cotizador_tipo,
            cliente_id,
            ejecutivo_id,
            fecha,
            validez_oferta,
            proyecto,
            direccion,
            contacto,
            telefono,
            email,
            envio,
            costo_envio || 0,
            instalacion,
            costo_instalacion || 0,
            puesta_en_marcha,
            costo_puesta_en_marcha || 0,
            mercado,
            moneda_id,
            tipo_cambio,
            condicion_comercial_id,
            estado,
            usuario_aprobador_id,
            aprobacion_fecha,
            eliminado,
            canal_distribucion_id,
            incoterm_id,
            descuento_global,
            margen_global,
            observaciones,
            observaciones_HTML,
            user_id,
          ],
          out: ["@pCotizacion_Id"],
        },
      });

      const { outParam1: Cotizacion_Id } = outputParamsResult;

      if (!Cotizacion_Id) {
        throw new Error("Error al crear la cotizacion");
      }

      const { attachDetailsToQuote } = QuoteDetailsModel;

      const response = await attachDetailsToQuote(
        user_id,
        Cotizacion_Id,
        details,
      );

      if (!response.success) {
        return handleResponse(
          null,
          response.message || "Error al agregar los detalles a la cotización",
          false,
          500,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_establecer_codigo_inicial",
        parameters: {
          in: [Cotizacion_Id],
          out: [],
        },
      });

      return handleResponse(rows, "Cotizacion creada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  update: async (ctx, cotizacion_id, data) => {
    try {
      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [cotizacion_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        await AuditModel.log({
          ctx: ctx,
          action: AuditActions.UPDATE,
          humanDescription: `El usuario ${ctx.user.name} intentó editar la cotizacion ${cotizacion_id} [CABECERA], pero no se encontró`,
          entity: "cotizacion",
          entityId: cotizacion_id,
          oldData: data,
        });
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      const {
        cliente_id,
        ejecutivo_id,
        fecha,
        validez_oferta,
        proyecto,
        direccion,
        contacto,
        telefono,
        email,
        envio,
        costo_envio,
        instalacion,
        costo_instalacion,
        puesta_en_marcha,
        costo_puesta_en_marcha,
        moneda_id,
        tipo_cambio,
        condicion_comercial_id,
        canal_distribucion_id,
        incoterm_id,
        incoterm_valor = 0,
        incoterm_valor_seguro = 0,
        estado,
        usuario_aprobador_id,
        aprobacion_fecha,
        eliminado = 0,
        observaciones,
        observaciones_HTML,
      } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_editar",
        parameters: {
          in: [
            cotizacion_id,
            cliente_id,
            ejecutivo_id,
            fecha,
            validez_oferta,
            proyecto,
            direccion,
            contacto,
            telefono,
            email,
            envio,
            costo_envio || 0,
            instalacion,
            costo_instalacion || 0,
            puesta_en_marcha,
            costo_puesta_en_marcha || 0,
            moneda_id,
            tipo_cambio,
            condicion_comercial_id,
            estado,
            usuario_aprobador_id,
            aprobacion_fecha,
            eliminado,
            canal_distribucion_id,
            incoterm_id,
            incoterm_valor,
            incoterm_valor_seguro,
            observaciones,
            observaciones_HTML,
            ctx.user.id,
          ],
        },
      });

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.UPDATE,
        humanDescription: `El usuario ${ctx.user.name} editó la cotizacion ${cotizacion_id} [CABECERA]`,
        entity: "cotizacion",
        entityId: cotizacion_id,
        newData: data,
      });

      await QuoteModelv2.incrementQuoteRevision({ ctx, quoteId: cotizacion_id });

      return handleResponse(null, "Cotizacion editada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  updateState: async (ctx, cotizacion_id, data) => {
    const { state } = data;

    try {
      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [cotizacion_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      let successMessage =
        Number(state) === 6
          ? "Pedido enviando a SAP"
          : "Se actualizó el estado de la cotizacion exitosamente";

      let SAPQuoteCode = null;

      // If the state is 6, we will create the order in SAP
      if (Number(state) === 6) {
        const quoteSAPPayloadTransformResponse =
          await QuotesModel.transformToSAPQuote(ctx.user.id, cotizacion_id);

        if (!quoteSAPPayloadTransformResponse.success) {
          await AuditModel.log({
            ctx: ctx,
            action: AuditActions.TRANSFORM_TO_SAP,
            humanDescription: `El usuario ${ctx.user.name} intentó transformar la cotizacion ${cotizacion_id} para enviarla a SAP, pero ocurrió un error.`,
            entity: "cotizacion",
            entityId: cotizacion_id,
            success: false,
            error:
              quoteSAPPayloadTransformResponse.message ||
              "Error al transformar la cotizacion a SAP",
          });

          return handleResponse(
            null,
            quoteSAPPayloadTransformResponse.message ||
              "Error al transformar la cotizacion a SAP",
            false,
            500,
          );
        }

        try {
          const ERPCreateQuoteResponse = await ERP_PROXY_API.post(
            "/quote",
            quoteSAPPayloadTransformResponse.data,
          );

          SAPQuoteCode = ERPCreateQuoteResponse.data.Vbeln;

          if (!SAPQuoteCode) {
            await AuditModel.log({
              ctx: ctx,
              action: AuditActions.SEND_TO_SAP,
              humanDescription: `El usuario ${ctx.user.name} intentó crear el pedido en SAP para la cotizacion ${cotizacion_id}, pero no se obtuvo el codigo de referencia.`,
              entity: "cotizacion",
              entityId: cotizacion_id,
              success: false,
              error:
                "No se pudo crear el pedido en el ERP, no se obtuvo el codigo de referencia",
            });

            return handleResponse(
              null,
              "No se pudo crear el pedido en el ERP, no se obtuvo el codigo de referencia",
              false,
              500,
            );
          }

          await AuditModel.log({
            ctx: ctx,
            action: AuditActions.SEND_TO_SAP,
            actionDetail: `Pedido creado en SAP con numero de referencia ${SAPQuoteCode}`,
            humanDescription: `El usuario ${ctx.user.name} creó el pedido en SAP para la cotizacion ${cotizacion_id}, con numero de referencia ${SAPQuoteCode}.`,
            entity: "cotizacion",
            entityId: cotizacion_id,
            newData: quoteSAPPayloadTransformResponse.data,
          });

          successMessage = `${successMessage}. ¡Pedido creado exitosamente! Número de referencia: ${SAPQuoteCode}`;
        } catch (error) {
          const errorMessage = error.response?.data?.TMensajes
            ? error.response.data.TMensajes.reduce((ac, message) => {
                return `${ac + message.Mensaje}, `;
              }, "")
            : error.response?.data?.error || "Error desconocido";

          await AuditModel.log({
            ctx: ctx,
            action: AuditActions.SEND_TO_SAP,
            humanDescription: `El usuario ${ctx.user.name} intentó enviar la cotizacion ${cotizacion_id} a SAP, pero ocurrió un error. Error: ${errorMessage}`,
            entity: "cotizacion",
            entityId: cotizacion_id,
            success: false,
            error: errorMessage,
          });

          return handleResponse(
            null,
            `No se pudo crear el pedido en el ERP : ${errorMessage}`,
            false,
            500,
          );
        }
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_edit_estado",
        parameters: {
          in: [cotizacion_id, state, SAPQuoteCode, ctx.user.id],
        },
      });

      const {
        result: [statesRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_estado_listarC",
        parameters: {
          in: [state],
        },
      });

      const stateName = statesRaw?.length > 0 ? statesRaw[0].nombre : state;

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.STATE_CHANGE,
        actionDetail: stateName,
        humanDescription: `El usuario ${ctx.user.name} cambió el estado de la cotizacion ${cotizacion_id} a ${stateName}.`,
        entity: "cotizacion",
        entityId: cotizacion_id,
      });

      return handleResponse(null, successMessage);
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  delete: async (ctx, cotizacion_id) => {
    try {
      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [cotizacion_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_ocultar",
        parameters: {
          in: [cotizacion_id, ctx.user.id, null],
        },
      });

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.DELETE,
        humanDescription: `La cotizacion ${cotizacion_id} del usuario ${ctx.user.name} fue eliminada.`,
        entity: "cotizacion",
        entityId: cotizacion_id,
      });

      return handleResponse(null, "Cotizacion eliminada exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  validateQuote: async (user_id, cotizacion_id) => {
    try {
      // Find quote by id

      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [cotizacion_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      const quote = rowsExistsQuote[0];

      const distributionChannelAreaCode = quote?.CanalDisribucionCodigoArea;

      logger.debug(
        `Canal de distribucion: ${quote?.CanalDisribucionCodigoArea}`,
      );

      const { getAllByQuoteId: getAllDetailsByQuoteId } = QuoteDetailsModel;

      const details = await getAllDetailsByQuoteId(cotizacion_id);

      // Check if customer belogs to the same quote distribution channel

      // 1. Check on this environment

      const customerId = quote.Cliente_Id;
      const executiveId = quote.Ejecutivo_Id;

      const detailsMapped = details.data
        ?.filter((detail) => detail.quote_extra_details)
        ?.map((detail) => detail.quote_extra_details);

      const detailsValidations = [];

      switch (Number.parseInt(quote.nCotTipo)) {
        // GRUPOS ELECTROGENOS
        case 1:
          for (const detail of detailsMapped) {
            const modelName = detail.sModNombre;

            const motorCodigoSAP = detail.sMotCodigoSAP || "";
            const multipleMotorSAPCodes = motorCodigoSAP.includes(",");
            const motorSAPCode = multipleMotorSAPCodes
              ? motorCodigoSAP.split(",")
              : motorCodigoSAP;

            const altCodigoSAP = detail.sAltCodigoSAP || "";
            const multipleAlternatorSAPCodes = altCodigoSAP.includes(",");
            const alternadorSAPCodes = multipleAlternatorSAPCodes
              ? altCodigoSAP.split(",")
              : altCodigoSAP;

            const ITMCodigoSAP = detail.sITMCodigoSAP || "";
            const multipleITMSAPCodes = ITMCodigoSAP.includes(",");
            const ITMSAPCodes = multipleITMSAPCodes
              ? ITMCodigoSAP.split(",")
              : ITMCodigoSAP;

            // Get stock using only the first SAP code if multiple exist
            const effectiveMotorSAPCode = Array.isArray(motorSAPCode)
              ? motorSAPCode[0]
              : motorSAPCode;
            const effectiveAlternadorSAPCode = Array.isArray(alternadorSAPCodes)
              ? alternadorSAPCodes[0]
              : alternadorSAPCodes;
            const effectiveITMSAPCode = Array.isArray(ITMSAPCodes)
              ? ITMSAPCodes[0]
              : ITMSAPCodes;

            // Check if motor code exists before checking stock
            let motorStock = { data: { items: [{ StockDisp: 0 }] } };
            if (effectiveMotorSAPCode && effectiveMotorSAPCode.trim() !== "") {
              motorStock = await MaterialSAPModel.getStock({
                matnr: effectiveMotorSAPCode,
                werks: distributionChannelAreaCode,
              });
            } else {
              logger.warn("Motor SAP code is missing, skipping stock check");
            }

            // Check if alternator code exists before checking stock
            let alternadorStock = { data: { items: [{ StockDisp: 0 }] } };
            if (
              effectiveAlternadorSAPCode &&
              effectiveAlternadorSAPCode.trim() !== ""
            ) {
              alternadorStock = await MaterialSAPModel.getStock({
                matnr: effectiveAlternadorSAPCode,
                werks: distributionChannelAreaCode,
              });
            } else {
              logger.warn(
                "Alternator SAP code is missing, skipping stock check",
              );
            }

            // Check if ITM code exists before checking stock
            let itmStock = { data: { items: [{ StockDisp: 0 }] } };
            if (effectiveITMSAPCode && effectiveITMSAPCode.trim() !== "") {
              itmStock = await MaterialSAPModel.getStock({
                matnr: effectiveITMSAPCode,
                werks: distributionChannelAreaCode,
              });
            } else {
              logger.warn("ITM SAP code is missing, skipping stock check");
            }

            logger.debug(
              `Motor stock: ${JSON.stringify(
                motorStock?.data?.items?.[0] || {},
                null,
                2,
              )}`,
            );
            logger.debug(
              `Alternador stock: ${JSON.stringify(
                alternadorStock?.data?.items?.[0] || {},
                null,
                2,
              )}`,
            );
            logger.debug(
              `ITM stock: ${JSON.stringify(
                itmStock?.data?.items?.[0] || {},
                null,
                2,
              )}`,
            );

            const motorStockAvailable =
              motorStock?.data?.items?.[0]?.StockDisp || 0;
            const alternatorStockAvailable =
              alternadorStock?.data?.items?.[0]?.StockDisp || 0;
            const itmStockAvailable =
              itmStock?.data?.items?.[0]?.StockDisp || 0;

            const motorIsAvailableStock = motorStockAvailable > 0 || false;
            const alternatorIsAvailableStock =
              alternatorStockAvailable > 0 || false;
            const itmIsAvailableStock = itmStockAvailable > 0 || false;

            const validations = {
              model: {
                name: modelName,
              },
              motor: {
                name: `${detail?.sMotMarca} ${detail?.sMotModelo}`,
                SAPCode: motorSAPCode,
                existsOnSAP: multipleMotorSAPCodes
                  ? motorSAPCode.length > 0
                  : motorSAPCode !== "",
                multipleCodes: multipleMotorSAPCodes,
                stock: motorStockAvailable,
                isAvailableStock: motorIsAvailableStock,
              },
              alternador: {
                name: `${detail?.sAltMarca} ${detail?.sAltModelo}`,
                SAPCode: alternadorSAPCodes,
                existsOnSAP: multipleAlternatorSAPCodes
                  ? alternadorSAPCodes.length > 0
                  : alternadorSAPCodes !== "",
                multipleCodes: multipleAlternatorSAPCodes,
                stock: alternatorStockAvailable,
                isAvailableStock: alternatorIsAvailableStock,
              },
              itm: {
                name: detail?.sITMKitNombre,
                SAPCode: ITMSAPCodes,
                existsOnSAP: multipleITMSAPCodes
                  ? ITMSAPCodes.length > 0
                  : ITMSAPCodes !== "",
                multipleCodes: multipleITMSAPCodes,
                stock: itmStockAvailable,
                isAvailableStock: itmIsAvailableStock,
              },
            };

            const isDetailPassed = [
              validations.motor.existsOnSAP,
              validations.motor.isAvailableStock,
              validations.alternador.existsOnSAP,
              validations.alternador.isAvailableStock,
              validations.itm.existsOnSAP,
              validations.itm.isAvailableStock,
            ].every((validation) => validation === true);

            validations.isDetailPassed = isDetailPassed;

            detailsValidations.push(validations);
          }

          break;
        // CABLES
        case 2:
          for (const detail of detailsMapped) {
            const cableCode = detail.CableCodigoSAP || "";
            const multipleCableSAPCodes = cableCode.includes(",");
            const cableSAPCode = multipleCableSAPCodes
              ? cableCode.split(",")
              : cableCode;

            const existsOnSAP = multipleCableSAPCodes
              ? cableSAPCode.length > 0
              : cableSAPCode !== "";

            const effectiveCableSAPCode = Array.isArray(cableSAPCode)
              ? cableSAPCode[0]
              : cableSAPCode;

            const cableStock = await MaterialSAPModel.getStock({
              matnr: effectiveCableSAPCode,
              werks: distributionChannelAreaCode,
            });

            const cableStockAvailable =
              cableStock?.data?.items?.[0]?.StockDisp || 0;

            const cableIsAvailableStock = cableStockAvailable > 0 || false;

            detailsValidations.push({
              brand: detail?.CableMarca,
              type: detail?.CableTipo,
              description: detail?.CableDescripcion,
              SAPCode: cableSAPCode,
              existsOnSAP: existsOnSAP,
              multipleCodes: multipleCableSAPCodes,
              stock: cableStockAvailable,
              isAvailableStock: cableIsAvailableStock,
            });
          }

          break;
        // CELDAS
        case 3:
          for (const detail of detailsMapped) {
            const celdaCodigoSAP = detail.CeldaCodigoSAP || "";
            const multipleCeldaSAPCodes = celdaCodigoSAP.includes(",");
            const celdaSAPCode = multipleCeldaSAPCodes
              ? celdaCodigoSAP.split(",")
              : celdaCodigoSAP;

            const existsOnSAP = multipleCeldaSAPCodes
              ? celdaSAPCode.length > 0
              : celdaSAPCode !== "";

            const effectiveCellSAPCode = Array.isArray(celdaSAPCode)
              ? celdaSAPCode[0]
              : celdaSAPCode;

            const cellStock = await MaterialSAPModel.getStock({
              matnr: effectiveCellSAPCode,
              werks: distributionChannelAreaCode,
            });

            const cellStockAvailable =
              cellStock?.data?.items?.[0]?.StockDisp || 0;

            const cellIsAvailableStock = cellStockAvailable > 0 || false;

            detailsValidations.push({
              brand: detail?.CeldaMarca,
              type: detail?.CeldaTipo,
              description: detail?.CeldaDetalle,
              SAPCode: celdaSAPCode,
              existsOnSAP: existsOnSAP,
              multipleCodes: multipleCeldaSAPCodes,
              stock: cellStockAvailable,
              isAvailableStock: cellIsAvailableStock,
            });
          }

          break;
        // TRANSFORMADORES
        case 4:
          for (const detail of detailsMapped) {
            const transformadorCodigoSAP = detail.TransformadorCodigoSAP || "";
            const multipleTransformerSAPCodes =
              transformadorCodigoSAP.includes(",");
            const transformerSAPCode = multipleTransformerSAPCodes
              ? transformadorCodigoSAP.split(",")
              : transformadorCodigoSAP;

            const existsOnSAP = multipleTransformerSAPCodes
              ? transformerSAPCode.length > 0
              : transformerSAPCode !== "";

            const effectiveTransformerSAPCode = Array.isArray(
              transformerSAPCode,
            )
              ? transformerSAPCode[0]
              : transformerSAPCode;
            const transformerStock = await MaterialSAPModel.getStock({
              matnr: effectiveTransformerSAPCode,
              werks: distributionChannelAreaCode,
            });
            const transformerStockAvailable =
              transformerStock?.data?.items?.[0]?.StockDisp || 0;
            const transformerIsAvailableStock =
              transformerStockAvailable > 0 || false;

            detailsValidations.push({
              brand: detail?.TransformadorMarca,
              type: detail?.TransformadorTipo,
              description: detail?.TransformadorDescripcion,
              SAPCode: transformerSAPCode,
              existsOnSAP: existsOnSAP,
              multipleCodes: multipleTransformerSAPCodes,
              stock: transformerStockAvailable,
              isAvailableStock: transformerIsAvailableStock,
            });
          }
          break;
      }

      const isCustomerSameDistributionChannelOfQuote = await executeFunction({
        pool: db_pool,
        functionName: "validar_cliente_mismo_canal_cotizacion",
        params: [customerId, cotizacion_id],
      });

      const customerHasSAPCodeInDatabase = await executeFunction({
        pool: db_pool,
        functionName: "validar_cliente_tiene_codigo_SAP",
        params: [customerId],
      });

      // const isCustomerSameCurrencyOfQuote = await executeFunction({
      //   pool: db_pool,
      //   functionName: "validar_cliente_misma_moneda",
      //   params: [customerId, cotizacion_id],
      // });

      const isCustomerSameCurrencyOfQuote = true;

      const isExecutiveOnSAP = await executeFunction({
        pool: db_pool,
        functionName: "validar_ejecutivo_esta_en_SAP",
        params: [executiveId],
      });

      let passed = false;

      switch (Number.parseInt(quote.nCotTipo)) {
        // GRUPOS ELECTROGENOS
        case 1:
          passed = detailsValidations.every(
            (validation) => validation.isDetailPassed === true,
          );
          break;
        // CABLES, CELDAS, TRANSFORMADORES
        case 2:
        case 3:
        case 4:
          passed = detailsValidations.every(
            (validation) =>
              validation.existsOnSAP && validation.isAvailableStock,
          );
          break;
        default:
          passed = false;
      }

      const customerValidation = {
        sameDistributionChannel:
          Number.parseInt(isCustomerSameDistributionChannelOfQuote) === 1,
        hasSAPCodeInDatabase:
          Number.parseInt(customerHasSAPCodeInDatabase) === 1,
        sameCurrency: isCustomerSameCurrencyOfQuote,
      };

      const executiveValidation = {
        existsOnSAP: Number.parseInt(isExecutiveOnSAP) === 1,
      };

      const quoteTransformPayloadResponse =
        await QuotesModel.transformToSAPQuote(user_id, cotizacion_id);

      if (!quoteTransformPayloadResponse.success) {
        logger.error(
          "Error transforming quote to SAP payload: ",
          quoteTransformPayloadResponse.message || "Unknown error",
        );
      }

      const quoteSAPPayload = quoteTransformPayloadResponse?.data;

      const ERPValidationResponse = await QuoteValidateSAPModel.validate({
        quote: quoteSAPPayload,
      });

      if (!ERPValidationResponse.success) {
        logger.error(
          "Error validating quote on SAP: ",
          ERPValidationResponse.message || "Unknown error",
        );
      }

      const SAPValidations = ERPValidationResponse?.data || {
        hasErrors: true,
        message: ERPValidationResponse.message || "Error desconocido",
        serviceDown: !ERPValidationResponse.success,
      };

      passed =
        (passed &&
          customerValidation.sameDistributionChannel &&
          customerValidation.sameCurrency &&
          customerValidation.hasSAPCodeInDatabase &&
          executiveValidation.existsOnSAP &&
          !SAPValidation?.hasErrors) ||
        false;

      const general = {
        general: {
          customer: customerValidation,
          executive: executiveValidation,
        },
        details: details.data.length > 0 ? detailsValidations : [],
        passed: passed,
      };

      return handleResponse(
        { ...general, SAPValidations },
        "Validacion de cotizacion generada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  economicOffer: async (ctx, quote_id) => {
    try {
      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [quote_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      const {
        result: [[rows]],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_oferta_economica",
        parameters: {
          in: [quote_id],
        },
      });

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.EXPORT,
        humanDescription: `el usuario ${ctx?.user?.name} genero la oferta económica de la cotizazcion ${quote_id}`,
        entity: "cotizacion",
        entityId: quote_id,
        newData: rows,
      });

      return handleResponse(rows, "Oferta economica generada exitosamente");
    } catch (error) {
      const { message } = error;

      await AuditModel.log({
        ctx: ctx,
        action: AuditActions.EXPORT,
        humanDescription: `el usuario ${ctx?.user?.name} intento generar la oferta económica de la cotizazcion ${quote_id}, pero ocurrió un error: ${message}`,
        entity: "cotizacion",
        entityId: quote_id,
        success: false,
        error: message,
      });

      return handleResponse(null, message, false, 500);
    }
  },
  transformToSAPQuote: async (user_id, quote_id) => {
    try {
      const {
        result: [rowsExistsQuote],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cot_listarC",
        parameters: {
          in: [quote_id],
        },
      });

      if (!rowsExistsQuote || rowsExistsQuote.length === 0) {
        return handleResponse(null, "Cotizacion no encontrada", false, 404);
      }

      const quoteType = Number.parseInt(rowsExistsQuote[0].nCotTipo);

      let SAPPayload = null;

      const {
        result: [SAP_HEADER_ROWS],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizacion_SAP_HEADER",
        parameters: {
          in: [quote_id],
        },
      });

      const SAP_HEADER = SAP_HEADER_ROWS[0];

      switch (quoteType) {
        // GRUPOS ELECTROGENOS
        case 1:
          {
            const {
              result: [SAP_DETAILS_ROWS],
            } = await executeStoredProcedure({
              pool: db_pool,
              sp_name: "cotizacion_SAP_DETALLE_GE",
              parameters: {
                in: [quote_id],
              },
            });
            const SAP_DETAILS = SAP_DETAILS_ROWS;

            const SAP_HEADER_SATINIZED = {
              ...SAP_HEADER,
              TextoCab: [SAP_HEADER.TextoCab],
            };

            const SAP_DETAILS_SATINIZED_PROMISE = SAP_DETAILS.map(
              async (detail) => {
                let detailWithoutGEId = detail;

                const generatorQuoteDetailId = detail.CotizacionDetalleGE;
                const detailId = detail.CotizacionDetalleId;

                delete detailWithoutGEId.CotizacionDetalleGE;
                delete detailWithoutGEId.CotizacionDetalleId;

                const channelDistributionAreaCode = detail?.Werks || "";

                const {
                  result: [SAP_DETAILS_RESERV_GE_ROWS],
                } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "cotizacion_SAP_DETALLE_RESERVA_GE",
                  parameters: {
                    in: [generatorQuoteDetailId],
                  },
                });

                const {
                  result: [SAP_DETAILS_GE_OPTIONALS_ROWS],
                } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "cotizacion_SAP_DETALLE_GE_OPCIONALES",
                  parameters: {
                    in: [generatorQuoteDetailId],
                  },
                });

                const GEOptionalsTextDetails = splitIntoChunks(
                  (SAP_DETAILS_GE_OPTIONALS_ROWS || [])
                    .map((geOptional) =>
                      `${geOptional?.Nombre}, ${geOptional?.sOpcDescripcion}`.trim(),
                    )
                    .map((word) => word.trim())
                    .join(" "),
                );

                // const {
                //   result: [SAP_DETAILS_RESERV_GE_OPTIONALS_ROWS],
                // } = await executeStoredProcedure({
                //   pool: db_pool,
                //   sp_name: "cotizacion_SAP_DETALLE_RESERVA_GE_OPCIONALES",
                //   parameters: {
                //     in: [generatorQuoteDetailId],
                //   },
                // });

                // Reversa de materiales

                let GEReserv = await Promise.all(
                  (SAP_DETAILS_RESERV_GE_ROWS || []).map(async (optional) => {
                    const reservItems = [];

                    const werks = channelDistributionAreaCode;

                    const checkAndPushMaterial = async ({ materialCode }) => {
                      if (!materialCode || materialCode.trim() === "") return;

                      try {
                        const stockInfo = await MaterialSAPModel.getStock({
                          matnr: materialCode,
                          werks: werks,
                        });
                        const stockDisponible =
                          stockInfo?.data?.items?.[0]?.StockDisp || 0;

                        logger.info(
                          `Stock check for ${materialCode} in channel distribution ${werks}: ${stockDisponible}`,
                        );

                        if (stockDisponible > 0) {
                          reservItems.push({
                            Matnr: materialCode,
                          });
                        } else {
                          logger.warn(
                            `Material ${materialCode} has 0 stock, not adding to reservItems.`,
                          );
                        }
                      } catch (error) {
                        logger.error(
                          `Error checking stock for material ${materialCode}: ${error.message}`,
                        );
                      }
                    };

                    await Promise.all([
                      /*
                          NO se envia a reversa el codigo SAP del modelo porque eso se crea despues como material, no lo momento del envio.
                        */
                      //checkAndPushMaterial({ materialCode: optional.sModCodigoSAP }),
                      checkAndPushMaterial({
                        materialCode: optional.sAltCodigoSAP,
                      }),
                      checkAndPushMaterial({
                        materialCode: optional.sMotCodigoSAP,
                      }),
                      checkAndPushMaterial({
                        materialCode: optional.sITMCodigoSAP,
                      }),
                    ]);

                    return reservItems;
                  }),
                );

                GEReserv = GEReserv.flat();

                /**
                 *  LOS OPCIONALES DE RESERVA NO SE ESTAN ENVIANDO A SAP POR AHORA PORQUE NO TIENE CODIGO SAP
                 */

                // const GEOptionalsReserv = (
                //   SAP_DETAILS_RESERV_GE_OPTIONALS_ROWS || []
                // ).map((optional) => {
                //   return {
                //     Matnr: optional.sOpcCodigo,
                //   };
                // });

                const Kwmeng = Number.parseInt(detailWithoutGEId.Kwmeng) || 1;

                const TFechaEntregaTemplate = {
                  Kwmeng: Kwmeng,
                  Handoverdate: detailWithoutGEId.TFechaEntrega,
                };

                const operativeCost = await executeFunction({
                  pool: db_pool,
                  functionName: "fn_cotizaciondetalle_costos_operativos",
                  params: [detailId],
                });

                const operativeCostTextDetails = splitIntoChunks(
                  operativeCost || "",
                );

                return {
                  ...detailWithoutGEId,
                  TFechaEntrega: [TFechaEntregaTemplate],
                  TextoDet: [
                    // detailWithoutGEId.TextoDet,
                    GEOptionalsTextDetails.length > 0 ? "OPCIONALES:" : "",
                    ...GEOptionalsTextDetails,
                    operativeCostTextDetails.length > 0
                      ? "&#10;&#10;&#10;&#10;INCLUYE:"
                      : "",
                    ...operativeCostTextDetails,
                  ],
                  TReserva: [...GEReserv],
                };
              },
            );

            const SAP_DETAILS_SATINIZED = await Promise.all(
              SAP_DETAILS_SATINIZED_PROMISE,
            );

            SAPPayload = {
              ...SAP_HEADER_SATINIZED,
              TDetalle: [...SAP_DETAILS_SATINIZED],
            };
          }
          break;
        // CABLES
        case 2:
        // CELDAS
        case 3:
        // TRANSFORMADORES
        case 4:
          {
            const {
              result: [SAP_DETAILS_ROWS],
            } = await executeStoredProcedure({
              pool: db_pool,
              sp_name: "cotizacion_SAP_DETALLE_OTRAS_COTIZACIONES",
              parameters: {
                in: [quote_id],
              },
            });

            const SAP_DETAILS = SAP_DETAILS_ROWS;

            const SAP_HEADER_SATINIZED = {
              ...SAP_HEADER,
              TextoCab: [SAP_HEADER.TextoCab],
            };

            const SAP_DETAILS_SATINIZED = await Promise.all(
              SAP_DETAILS.map(async (detail) => {
                const detailId = detail.CotizacionDetalleId;

                const detailWithoutId = detail;

                delete detailWithoutId.CotizacionDetalleId;

                const Kwmeng = Number.parseInt(detailWithoutId.Kwmeng) || 1;

                const werks = detailWithoutId?.Werks;

                const TFechaEntregaTemplate = {
                  Kwmeng: Kwmeng,
                  Handoverdate: detailWithoutId.TFechaEntrega,
                };

                const reservItems = [];

                const checkAndPushMaterial = async ({ materialCode }) => {
                  if (!materialCode || materialCode.trim() === "") return;

                  try {
                    const stockInfo = await MaterialSAPModel.getStock({
                      matnr: materialCode,
                      werks: werks,
                    });
                    const stockDisponible =
                      stockInfo?.data?.items?.[0]?.StockDisp || 0;

                    logger.info(
                      `Stock check for ${materialCode} in channel distribution ${werks}: ${stockDisponible}`,
                    );

                    if (stockDisponible > 0) {
                      reservItems.push({
                        Matnr: materialCode,
                      });
                    } else {
                      logger.warn(
                        `Material ${materialCode} has 0 stock, not adding to reservItems.`,
                      );
                    }
                  } catch (error) {
                    logger.error(
                      `Error checking stock for material ${materialCode}: ${error.message}`,
                    );
                  }
                };

                await checkAndPushMaterial({
                  materialCode: detailWithoutId.Matnr,
                });

                const operativeCost = await executeFunction({
                  pool: db_pool,
                  functionName: "fn_cotizaciondetalle_costos_operativos",
                  params: [detailId],
                });

                const operativeCostTextDetails = splitIntoChunks(
                  operativeCost || "",
                );

                return {
                  ...detailWithoutId,
                  TFechaEntrega: [TFechaEntregaTemplate],
                  TextoDet: [
                    detailWithoutId.TextoDet,
                    operativeCostTextDetails.length > 0
                      ? "&#10;&#10;&#10;&#10;INCLUYE:"
                      : "",
                    ...operativeCostTextDetails,
                  ],
                  TReserva: reservItems,
                };
              }),
            );

            SAPPayload = {
              ...SAP_HEADER_SATINIZED,
              TDetalle: [...SAP_DETAILS_SATINIZED],
            };
          }
          break;
        default: {
          return handleResponse(
            null,
            "No se pudo transformar la cotizacion a SAP, el tipo de cotizacion no esta aun implementado",
            false,
            500,
          );
        }
      }

      return handleResponse(
        SAPPayload,
        "Cotizacion transformada a SAP exitosamente",
        true,
        200,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default QuotesModel;
