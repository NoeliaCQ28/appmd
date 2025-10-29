import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";
import QuoteCableDetailModel from "./quoteTypeModels/quoteCableDetailModel.js";
import QuoteCellDetailModel from "./quoteTypeModels/quoteCellDetailModel.js";
import QuoteDetailGEModel from "./quoteTypeModels/quoteGEDetailModel.js";
import QuoteTransformerDetailModel from "./quoteTypeModels/quoteTransformerDetailModel.js";

const QuoteDetailsModel = {
  getAllByQuoteId: async (quote_id) => {
    try {
      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "tipocotizacion",
        parameters: {
          in: [quote_id],
          out: ["@pTipo"],
        },
      });

      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listarC",
        parameters: {
          in: [quote_id],
        },
      });

      const { outParam1: quoteType } = outputParamsResult;

      if (quoteType === null || !quoteType) {
        return handleResponse(
          null,
          "No se ha podido obtener el tipo de cotizacion",
          false,
          500,
        );
      }

      if (Number.parseInt(quoteType) > 4) {
        return handleResponse(
          null,
          "Tipo de cotizacion no soportado",
          false,
          500,
        );
      }

      const rowsWithExtraDetails = await Promise.all(
        rows.map(async (row) => {
          const quoteDetailId = row.nCotDetItem;

          const {
            result: [extraRows],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "cotizaciondetalleextra_listarC",
            parameters: {
              in: [quoteDetailId],
            },
          });

          const quote_extra_details = extraRows[0];
          const ModeloKey = `${quote_extra_details.nIntegradoraId}-${quote_extra_details.nModelo_Id}-${quote_extra_details.nMotor_Id}-${quote_extra_details.nITM_A}-${quote_extra_details.nParamInsonoro}`;

          return {
            ...row,
            quote_extra_details: {
              ...quote_extra_details,
              operativeCosts: {
                shipping: {
                  isPresent: (row?.nCotDetEnvio || 0) === 1,
                  amount: Number(row?.nCotDetCostoEnvio || 0).toFixed(2),
                },
                startup: {
                  isPresent: (row?.nCotDetPuestoEnMarcha || 0) === 1,
                  amount: Number(row?.nCotDetCostoPuestoEnMarcha || 0).toFixed(
                    2,
                  ),
                },
              },
              ModeloKey,
            },
          };
        }),
      );

      const extraRowsWithAditionalComponents = await Promise.all(
        rowsWithExtraDetails.map(async (extraRow) => {
          const quoteDetailIdInner = extraRow.nCotDetItem;
          const {
            result: [extraRowsWithOtherComponents],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "compadicionaldetalle_listarC",
            parameters: {
              in: [quoteDetailIdInner],
            },
          });

          return {
            ...extraRow,
            otherComponents: extraRowsWithOtherComponents,
          };
        }),
      );

      return handleResponse(
        extraRowsWithAditionalComponents,
        "Detalles de la Cotizacion consultadas con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  /**
   * Optiene la ficha tecnica de cada item de la cotización
   * @param {number} quote_id
   * @returns Una lista de fichas tecnicas de cada item de la cotización y ademas sus accesorios agregados
   */
  getIntegradora: async (quote_id) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listarC",
        parameters: {
          in: [quote_id],
        },
      });

      const integradoraData = await Promise.all(
        rows.map(async (row) => {
          const quoteDetailId = row.nCotDetItem;

          const {
            result: [quoteExtraDetailsRaw],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "cotizaciondetalleextra_listarC",
            parameters: {
              in: [quoteDetailId],
            },
          });

          const quoteExtraDetails = quoteExtraDetailsRaw[0];

          const alternatorSwapped =
            quoteExtraDetails.nHuboCambioDeAlternador === 1;
          const alternatorSwappedId = quoteExtraDetails.nAltCambioId || 0;

          /**
           * Retorna el id de la combinacion base el cual sera necesario para construir la ficha tecnica
           */
          const {
            result: [extraRows],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name:
              "optener_identificador_ficha_tecnica_por_cotizaciondetallege",
            parameters: {
              in: [quoteDetailId],
            },
          });

          const {
            result: [accesories],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "compadicionaldetalle_listarC",
            parameters: {
              in: [quoteDetailId],
            },
          });

          return {
            integradora: extraRows, // El id de la integradora (combinación base)
            alternatorSwapped,
            alternatorSwappedId,
            altura: quoteExtraDetails?.nParamAltura,
            temperatura: quoteExtraDetails?.nParamTemperatura,
            accesories: accesories || [],
          };
        }),
      );

      return handleResponse(
        integradoraData,
        "No se pudo obtener la integradora de los detalles de la cotizacion",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  attachDetailsToQuote: async (user_id, quote_id, details) => {
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
        return handleResponse(
          null,
          "No se pudo agregar el detalle a la cotizacion, debe existir la cotizacion",
          false,
          404,
        );
      }

      if (!details || details.length === 0) {
        return handleResponse(
          null,
          "No se han proporcionado detalles para agregar a la cotización",
          false,
          404,
        );
      }

      for (const detail of details) {
        const {
          tipo,
          cantidad,
          precio_unitario,
          producto_id,
          quote_extra_details,
        } = detail;

        const importe = cantidad * precio_unitario;

        const { outputParamsResult } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotdet_crear",
          parameters: {
            in: [
              quote_id,
              tipo,
              cantidad,
              precio_unitario,
              importe,
              producto_id,
            ],
            out: ["@nCotDetalleItem"],
          },
        });

        const { outParam1: nCotDetalleItem } = outputParamsResult;

        if (!nCotDetalleItem) {
          return handleResponse(
            null,
            "No se ha podido crear el detalle de la cotizacion, debido a que no se ha podido obtener el ID del detalle",
            false,
            500,
          );
        }

        const { attachGEToQuoteDetail } = QuoteDetailGEModel;
        const { attachCableDetailToQuote } = QuoteCableDetailModel;
        const { attachCellDetailToQuote } = QuoteCellDetailModel;
        const { attachTransformerDetailToQuote } = QuoteTransformerDetailModel;

        switch (tipo) {
          // GRUPOS ELECTROGENOS
          case 1:
            await attachGEToQuoteDetail(
              user_id,
              nCotDetalleItem,
              quote_extra_details,
            );
            break;
          // CABLES
          case 2:
            await attachCableDetailToQuote({
              user_id: user_id,
              quote_detail_id: nCotDetalleItem,
              details: quote_extra_details,
            });
            break;
          // CELDAS
          case 3:
            await attachCellDetailToQuote({
              user_id: user_id,
              quote_detail_id: nCotDetalleItem,
              details: quote_extra_details,
            });
            break;
          // TRANSFORMADORES
          case 4:
            await attachTransformerDetailToQuote({
              user_id: user_id,
              quote_detail_id: nCotDetalleItem,
              details: quote_extra_details,
            });
            break;
          default:
            return handleResponse(
              null,
              "Tipo de cotización no soportado",
              false,
              500,
            );
        }
      }

      return handleResponse(
        null,
        "Los detalles fueron agregados a la cotización con éxito",
      );
    } catch (error) {
      return handleResponse(
        null,
        error.message || "Error al agregar los detalles a la cotización",
        false,
        500,
      );
    }
  },
  delete: async (user_id, quote_id, quote_detalle_id) => {
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
        result: [rowsExistsQuoteDetail],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listar_unico",
        parameters: {
          in: [quote_id, quote_detalle_id],
        },
      });

      if (!rowsExistsQuoteDetail || rowsExistsQuoteDetail.length === 0) {
        return handleResponse(
          null,
          "El item no fue encontrado o no pertenece a la cotizacion",
          false,
          404,
        );
      }

      const { outputParamsResult: outputCantidadDetalles } =
        await executeStoredProcedure({
          pool: db_pool,
          sp_name: "cotizacion_cantidad_detalles",
          parameters: {
            in: [quote_id],
            out: ["@pnCantidad"],
          },
        });

      const { outParam1: pnCantidad } = outputCantidadDetalles;

      if (Number.parseInt(pnCantidad) === 1) {
        return handleResponse(
          null,
          "La cotizacion no puede quedar sin detalles",
          false,
          400,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_eliminar",
        parameters: {
          in: [quote_detalle_id],
        },
      });

      return handleResponse(
        null,
        "El item de la Cotización a sido eliminado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  update: async (user_id, quote_id, quote_detalle_id, data) => {
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
        result: [rowsExistsQuoteDetail],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listar_unico",
        parameters: {
          in: [quote_id, quote_detalle_id],
        },
      });

      if (!rowsExistsQuoteDetail || rowsExistsQuoteDetail.length === 0) {
        return handleResponse(
          null,
          "El item no fue encontrado o no pertenece a la cotizacion",
          false,
          404,
        );
      }

      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "tipocotizacion",
        parameters: {
          in: [quote_id],
          out: ["@pTipo"],
        },
      });

      const { outParam1: tipo } = outputParamsResult;

      const quoteType = Number.parseInt(tipo);

      switch (quoteType) {
        // GRUPO ELECTROGENO
        case 1:
          {
            const {
              quoteDetailId,
              quoteGEId,
              alternador: {
                Alternador_Id: alternadorId,
                Alternador: alternadorName,
              },
              discount: {
                descripcion: discountDescription,
                value: discountValue,
              },
              operativeCosts: {
                shipping: {
                  isPresent: isShippingPresent,
                  amount: shippingAmount,
                } = {},
                startup: {
                  isPresent: isStartupPresent,
                  amount: startupAmount,
                } = {},
              } = {},
              increaseDiscount,
              deliveryDays,
              originalPrice,
              finalPrice,
              quantity,
              otherComponents,
            } = data;

            const isShippingPresentValue = isShippingPresent || false;
            const shippingAmountValue = isShippingPresentValue
              ? shippingAmount || 0
              : 0;
            const isStartupPresentValue = isStartupPresent || false;
            const startupAmountValue = isStartupPresentValue
              ? startupAmount || 0
              : 0;

            await executeStoredProcedure({
              pool: db_pool,
              sp_name: "cotizaciondetallege_editar",
              parameters: {
                in: [
                  quoteDetailId,
                  alternadorId,
                  alternadorName,
                  discountDescription,
                  discountValue,
                  increaseDiscount,
                  deliveryDays,
                  originalPrice,
                  finalPrice,
                  quantity,
                  isShippingPresentValue,
                  shippingAmountValue,
                  isStartupPresentValue,
                  startupAmountValue,
                ],
              },
            });

            await executeStoredProcedure({
              pool: db_pool,
              sp_name: "compadicionalge_eliminar",
              parameters: {
                in: [quoteGEId],
              },
            });

            if (otherComponents.length > 0) {
              for (const otherComponent of otherComponents) {
                await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "compadicionalge_crear",
                  parameters: {
                    in: [
                      quoteGEId,
                      otherComponent.id,
                      otherComponent.name,
                      otherComponent.description,
                      otherComponent.price,
                    ],
                  },
                });
              }
            }

            try {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetallege_carreta",
                parameters: {
                  in: [quoteGEId],
                },
              });
            } catch (error) {
              logger.error(
                `Error al adjuntar la carreta al detalle del grupo electrogeno al editar: ${error.message}`,
              );
            }

            try {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetallege_modulo_control",
                parameters: {
                  in: [quoteGEId],
                },
              });
            } catch (error) {
              logger.error(
                `Error al adjuntar el modulo de control al detalle del grupo electrogeno al editar: ${error.message}`,
              );
            }
          }
          break;
        // CELDAS
        case 3:
          {
            const {
              quoteDetailId,
              quoteDetailsCeldaId,
              nPrecioUnitario,
              nCantidad,
              nTotal,
              nDiasParaEntrega,
              otherComponents,
              operativeCosts: {
                shipping: {
                  isPresent: isShippingPresent,
                  amount: shippingAmount,
                } = {},
                startup: {
                  isPresent: isStartupPresent,
                  amount: startupAmount,
                } = {},
              } = {},
            } = data;

            const isShippingPresentValue = isShippingPresent || false;
            const shippingAmountValue = isShippingPresentValue
              ? shippingAmount || 0
              : 0;
            const isStartupPresentValue = isStartupPresent || false;
            const startupAmountValue = isStartupPresentValue
              ? startupAmount || 0
              : 0;

            await executeStoredProcedure({
              pool: db_pool,
              sp_name: "cotizaciondetalle_celda_editar",
              parameters: {
                in: [
                  quoteDetailId,
                  nPrecioUnitario,
                  nCantidad,
                  nTotal,
                  nDiasParaEntrega,
                  isShippingPresentValue,
                  shippingAmountValue,
                  isStartupPresentValue,
                  startupAmountValue,
                ],
              },
            });

            await executeStoredProcedure({
              pool: db_pool,
              sp_name: "cotizaciondetalle_celda_accesorio_eliminar",
              parameters: {
                in: [quoteDetailsCeldaId],
              },
            });

            if (otherComponents.length > 0) {
              for (const otherComponent of otherComponents) {
                await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "cotizaciondetalle_celda_accesorio_crear",
                  parameters: {
                    in: [
                      quoteDetailsCeldaId,
                      otherComponent.id,
                      otherComponent.price,
                      otherComponent.price,
                    ],
                  },
                });
              }
            }
          }
          break;
        // TRANSFORMADORES
        case 4: {
          const {
            quoteDetailId,
            quoteDetailsTransformadorId,
            nPrecioUnitario,
            nCantidad,
            nTotal,
            nDiasParaEntrega,
            otherComponents,
            operativeCosts: {
              shipping: {
                isPresent: isShippingPresent,
                amount: shippingAmount,
              } = {},
              startup: {
                isPresent: isStartupPresent,
                amount: startupAmount,
              } = {},
            } = {},
          } = data;

          const isShippingPresentValue = isShippingPresent || false;
          const shippingAmountValue = isShippingPresentValue
            ? shippingAmount || 0
            : 0;
          const isStartupPresentValue = isStartupPresent || false;
          const startupAmountValue = isStartupPresentValue
            ? startupAmount || 0
            : 0;

          await executeStoredProcedure({
            pool: db_pool,
            sp_name: "cotizaciondetalle_transformador_editar",
            parameters: {
              in: [
                quoteDetailId,
                nPrecioUnitario,
                nCantidad,
                nTotal,
                nDiasParaEntrega,
                isShippingPresentValue,
                shippingAmountValue,
                isStartupPresentValue,
                startupAmountValue,
              ],
            },
          });

          await executeStoredProcedure({
            pool: db_pool,
            sp_name: "cotizaciondetalle_transformador_accesorio_eliminar",
            parameters: {
              in: [quoteDetailsTransformadorId],
            },
          });

          if (otherComponents.length > 0) {
            for (const otherComponent of otherComponents) {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetalle_transformador_accesorio_crear",
                parameters: {
                  in: [
                    quoteDetailsTransformadorId,
                    otherComponent.id,
                    Number.parseFloat(otherComponent.price),
                    Number.parseFloat(otherComponent.price),
                  ],
                },
              });
            }
          }
        }
      }

      return handleResponse(
        null,
        "El item de la Cotización a sido actualizado con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  UpdateQuantity: async (cotizacion_Id_item, data) => {
    const { type, quantity } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "update_items",
        parameters: {
          in: [type, quantity, cotizacion_Id_item],
        },
      });

      return handleResponse(null, "Cantidad actualizada correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getDetailItems: async (quote_id, quote_detalle_id) => {
    try {
      const {
        result: [rowsExistsQuoteDetail],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotdet_listar_unico",
        parameters: {
          in: [quote_id, quote_detalle_id],
        },
      });

      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "tipocotizacion",
        parameters: {
          in: [quote_id],
          out: ["@pTipo"],
        },
      });

      const { outParam1: tipo } = outputParamsResult;

      const quoteType = Number.parseInt(tipo);

      switch (quoteType) {
        case 3: {
          //celdas
          const quoteDetailId = rowsExistsQuoteDetail[0].nCotDetItem;

          const {
            result: [cellsResult],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "obtener_detalle_celda",
            parameters: {
              in: [quoteDetailId],
            },
          });

          // Procesar cada celda con sus accesorios
          const processedCells = await Promise.all(
            cellsResult.map(async (cell) => {
              const {
                result: [accesorios],
              } = await executeStoredProcedure({
                pool: db_pool,
                sp_name: "obtener_detalle_celda_accesorio",
                parameters: {
                  in: [cell.CotizacionDetalleCeldaId],
                },
              });

              return {
                ...cell,
                accesorios,
              };
            }),
          );

          return handleResponse(
            {
              cells: processedCells,
            },
            "Detalles y accesorios consultados con éxito",
          );
        }
        case 4: {
          const quoteDetailId = rowsExistsQuoteDetail[0].nCotDetItem;

          const {
            result: [transformersResult],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "obtener_detalle_transformador",
            parameters: {
              in: [quoteDetailId],
            },
          });

          // Procesar cada celda con sus accesorios
          const processedTransformers = await Promise.all(
            transformersResult.map(async (transformer) => {
              const {
                result: [accesorios],
              } = await executeStoredProcedure({
                pool: db_pool,
                sp_name: "obtener_detalle_transformador_accesorio",
                parameters: {
                  in: [transformer.CotizacionDetalleTransformadorId],
                },
              });

              return {
                ...transformer,
                accesorios,
              };
            }),
          );

          return handleResponse(
            {
              transformers: processedTransformers,
            },
            "Detalles y accesorios consultados con éxito",
          );
        }
        default:
          break;
      }
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  AddItemsDetails: async (user_id, quote_id, data) => {
    try {
      const { total } = data;

      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "tipocotizacion",
        parameters: {
          in: [quote_id],
          out: ["@pTipo"],
        },
      });

      const { outParam1: tipo } = outputParamsResult;

      const quoteType = Number.parseInt(tipo);

      // Eliminar el detalle de la cotizacion tabla cotizaciondetalle
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizaciondetalle_eliminar",
        parameters: {
          in: [quote_id],
        },
      });

      //Actualizar la cabecera de la cotizacion general
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizacion_update_fields_certain",
        parameters: {
          in: [quote_id, total],
        },
      });

      switch (quoteType) {
        case 2:
          {
            const { details, quoteDeatilsIds } = data;

            // Eliminar el detalle extra que esta en la tabla cotizaciondetalle_cable
            quoteDeatilsIds.forEach(async (id) => {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetalle_cable_eliminar",
                parameters: {
                  in: [id],
                },
              });
            });

            //volver a crear el detalle de la cotizacion
            for (const detail of details) {
              try {
                const importe =
                  Number(detail.CableCantidad) * parseFloat(detail.CablePrecio);

                const { outputParamsResult } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "cotdet_crear",
                  parameters: {
                    in: [
                      quote_id,
                      quoteType,
                      detail.CableCantidad,
                      parseFloat(detail.CablePrecio),
                      importe,
                      detail.CableId,
                    ],
                    out: ["@nCotDetalleItem"],
                  },
                });

                // Obtener el ID generado
                const { outParam1: nCotDetalleItem } = outputParamsResult;
                if (!nCotDetalleItem) {
                  throw new Error(
                    "No se ha podido crear el detalle de la cotizacion",
                  );
                }

                const { attachCableDetailToQuote } = QuoteCableDetailModel;

                await attachCableDetailToQuote({
                  user_id: user_id,
                  quote_detail_id: nCotDetalleItem,
                  details: detail,
                });
              } catch (error) {
                const { message } = error;
                return handleResponse(null, message, false, 500);
              }
            }
          }
          break;
        case 4:
          {
            const { details, quoteDeatilsIds, quoteDetailsTransformadorId } =
              data;

            quoteDeatilsIds.forEach(async (id) => {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetalle_transformador_eliminar",
                parameters: {
                  in: [id],
                },
              });
            });

            quoteDetailsTransformadorId.forEach(async (id) => {
              await executeStoredProcedure({
                pool: db_pool,
                sp_name: "cotizaciondetalle_transformador_accesorio_eliminar",
                parameters: {
                  in: [id],
                },
              });
            });

            for (const detail of details) {
              try {
                const importe =
                  Number(detail.TransformadorCantidad) *
                  parseFloat(detail.TransformadorPrecio);

                const { outputParamsResult } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "cotdet_crear",
                  parameters: {
                    in: [
                      quote_id,
                      quoteType,
                      detail.TransformadorCantidad,
                      parseFloat(detail.TransformadorPrecio),
                      importe,
                      detail.TransformadorId,
                    ],
                    out: ["@nCotDetalleItem"],
                  },
                });

                // Obtener el ID generado
                const { outParam1: nCotDetalleItem } = outputParamsResult;
                if (!nCotDetalleItem) {
                  throw new Error(
                    "No se ha podido crear el detalle de la cotizacion",
                  );
                }

                const { attachTransformerDetailToQuote } =
                  QuoteTransformerDetailModel;

                await attachTransformerDetailToQuote({
                  user_id: user_id,
                  quote_detail_id: nCotDetalleItem,
                  details: detail, //aca van los accesorios tambien
                });
              } catch (error) {
                const { message } = error;
                return handleResponse(null, message, false, 500);
              }
            }
          }
          break;
        default:
          break;
      }
      return handleResponse(null, "Items agregados a la cotizacion con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default QuoteDetailsModel;
