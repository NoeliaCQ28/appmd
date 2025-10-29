import React from "react";
import { useQuoteDetailStore } from "../../store/useQuoteDetailStore";
import { useGeneratorSetStore } from "../../store/v2/useGeneratorSetStore";
import { useQuote } from "./useQuote";

export const ACTIONS = {
  SWITCH_ALTERNATOR: "SWITCH_ALTERNATOR",
  SWITCH_SILENCER: "SWITCH_SILENCER",
  APPLY_DISCOUNT: "APPLY_DISCOUNT",
  APPLY_MARGIN: "APPLY_MARGIN",
  SET_DELIVERY_DAYS: "SET_DELIVERY_DAYS",
  ADD_ACCESSORY: "ADD_ACCESSORY",
  REMOVE_ACCESSORY: "REMOVE_ACCESSORY",
  SWITCH_OPERATIVE_COSTS_SHIPPING: "SWITCH_OPERATIVE_COSTS_SHIPPING",
  SWITCH_OPERATIVE_COSTS_STARTUP: "SWITCH_OPERATIVE_COSTS_STARTUP",
  SET_OPERATIVE_COSTS_SHIPPING: "SET_OPERATIVE_COSTS_SHIPPING",
  SET_OPERATIVE_COSTS_STARTUP: "SET_OPERATIVE_COSTS_STARTUP",
  CHANGE_CONFIGURATION: "CHANGE_CONFIGURATION",
  RESET_CONFIGURATION: "RESET_CONFIGURATION",
  REMOVE_FROM_STORE: "REMOVE_FROM_STORE",
  SET_COMBINATION: "SET_COMBINATION",
  SET_WORK_ARRANGEMENT: "SET_WORK_ARRANGEMENT",
};

export const SILENCERS = {
  INDUSTRIAL: {
    id: 1,
    label: "Industrial",
  },
  RESIDENCIAL: {
    id: 2,
    label: "Residencial",
  },
};

export const OPERATIVE_COSTS = {
  SHIPPING: "shipping",
  STARTUP: "startup",
};

const workArrangements = [
  "STAND BY",
  "PRIME"
]

export const useGeneratorSetCombination = ({ generatorSet, changeConfigurationAsync }) => {
  const { addGeneratorSet, generatorSetsAdded, removeGeneratorSet } =
    useGeneratorSetStore();
  const { updateDetailMutate } = useQuote();
  const { selectedQuote } = useQuoteDetailStore();

  const isAdded = React.useMemo(() => {
    return (
      generatorSetsAdded.find((gs) => gs.sIntKey === generatorSet.sIntKey) !==
      undefined
    );
  }, [generatorSetsAdded, generatorSet.sIntKey]);

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.SWITCH_ALTERNATOR: {
        const newCombination = generatorSet.combinations.find(
          (combination) => combination.Alternador_Id === action.alternatorId
        );

        if (!newCombination) return state;

        // Mantener el estado personalizado del usuario (descuentos, días de entrega, accesorios, etc.)
        return {
          ...newCombination,
          // Preservar configuraciones personalizadas del estado anterior
          nIntDescuentoPorcentaje: state.nIntDescuentoPorcentaje,
          nIntMargenExportacionPorcentaje: state.nIntMargenExportacionPorcentaje,
          nIntDiasParaEntrega: state.nIntDiasParaEntrega,
          nIntCantidad: state.nIntCantidad,
          nIntAltura: state.nIntAltura,
          nIntTemperatura: state.nIntTemperatura,
          accessories: state.accessories,
          // Preservar configuración del silenciador si el nuevo alternador lo permite
          ...(newCombination.nIntSileciadorPermiteCambio &&
            state.nIntSileciadorTipo && {
            nIntSileciadorTipo: state.nIntSileciadorTipo,
            sIntSileciadorTipo: state.sIntSileciadorTipo,
          }),
          // Preservar el estado de costos operativos
          operativeCosts: state.operativeCosts,
          configuration: {
            ...state.configuration,
            alternator: {
              isPresent: false,
              alternatorBaseId: null,
              alternatorSwappedId: null,
            },
            itm: {
              isPresent: false,
              itmBaseId: null,
              itmSwappedId: null,
            },
          },
          nCotizacionDetalleId: state.nCotizacionDetalleId,
        };
      }
      case ACTIONS.SWITCH_SILENCER: {
        if (!state.nIntSileciadorPermiteCambio) return state;

        const currentSilencer =
          SILENCERS[state.sIntSileciadorTipo?.toUpperCase()];

        const newSilencer =
          currentSilencer.id === SILENCERS.INDUSTRIAL.id
            ? SILENCERS.RESIDENCIAL
            : SILENCERS.INDUSTRIAL;

        return {
          ...state,
          nIntSileciadorTipo: newSilencer.id,
          sIntSileciadorTipo: newSilencer.label,
        };
      }
      case ACTIONS.APPLY_DISCOUNT: {
        return {
          ...state,
          nIntDescuentoPorcentaje: action.discount,
        };
      }
      case ACTIONS.APPLY_MARGIN: {
        return {
          ...state,
          nIntMargenExportacionPorcentaje: action.margin,
        };
      }
      case ACTIONS.SET_DELIVERY_DAYS: {
        const days =
          Number.isNaN(action.days) || action.days === null ? 1 : action.days;
        return {
          ...state,
          nIntDiasParaEntrega: days,
        };
      }
      case ACTIONS.ADD_ACCESSORY: {
        return {
          ...state,
          accessories: [...(state.accessories || []), action.accessory],
        };
      }
      case ACTIONS.REMOVE_ACCESSORY: {
        return {
          ...state,
          accessories: (state.accessories || []).filter(
            (accessory) => accessory.id !== action.accessoryId
          ),
        };
      }
      case ACTIONS.SWITCH_OPERATIVE_COSTS_SHIPPING: {
        return {
          ...state,
          operativeCosts: {
            ...state.operativeCosts,
            shipping: {
              isPresent: !state.operativeCosts.shipping.isPresent,
              amount: state.operativeCosts.shipping.isPresent
                ? 0
                : action.amount || 0,
            },
          },
        };
      }
      case ACTIONS.SWITCH_OPERATIVE_COSTS_STARTUP: {
        return {
          ...state,
          operativeCosts: {
            ...state.operativeCosts,
            startup: {
              isPresent: !state.operativeCosts.startup.isPresent,
              amount: state.operativeCosts.startup.isPresent
                ? 0
                : action.amount || 0,
            },
          },
        };
      }
      case ACTIONS.SET_OPERATIVE_COSTS_SHIPPING: {
        return {
          ...state,
          operativeCosts: {
            ...state.operativeCosts,
            shipping: {
              isPresent: true,
              amount: action.amount || 0,
            },
          },
        };
      }
      case ACTIONS.SET_OPERATIVE_COSTS_STARTUP: {
        return {
          ...state,
          operativeCosts: {
            ...state.operativeCosts,
            startup: {
              isPresent: true,
              amount: action.amount || 0,
            },
          },
        };
      }
      case ACTIONS.CHANGE_CONFIGURATION: {
        const { component, configuration } = action;

        switch (component) {
          case "alternator": {
            const { combination, alternatorBaseId, alternatorSwappedId } = configuration

            return {
              ...combination,
              nIntDescuentoPorcentaje: state.nIntDescuentoPorcentaje,
              nIntMargenExportacionPorcentaje: state.nIntMargenExportacionPorcentaje,
              nIntDiasParaEntrega: state.nIntDiasParaEntrega,
              nIntAltura: state.nIntAltura,
              nIntTemperatura: state.nIntTemperatura,
              accessories: state.accessories,
              operativeCosts: state.operativeCosts,
              nIntSileciadorTipo: state.nIntSileciadorTipo,
              sIntSileciadorTipo: state.sIntSileciadorTipo,
              nIntCantidad: state.nIntCantidad,
              configuration: {
                ...state.configuration,
                alternator: {
                  isPresent: true,
                  alternatorBaseId: alternatorBaseId,
                  alternatorSwappedId: alternatorSwappedId,
                }
              },
              nCotizacionDetalleId: state.nCotizacionDetalleId,
            };
          }
          case "itm": {
            const { combination, itmBaseId, itmSwappedId } = configuration;

            return {
              ...combination,
              nIntDescuentoPorcentaje: state.nIntDescuentoPorcentaje,
              nIntMargenExportacionPorcentaje: state.nIntMargenExportacionPorcentaje,
              nIntDiasParaEntrega: state.nIntDiasParaEntrega,
              nIntAltura: state.nIntAltura,
              nIntTemperatura: state.nIntTemperatura,
              accessories: state.accessories,
              operativeCosts: state.operativeCosts,
              nIntSileciadorTipo: state.nIntSileciadorTipo,
              sIntSileciadorTipo: state.sIntSileciadorTipo,
              nIntCantidad: state.nIntCantidad,
              configuration: {
                ...state.configuration,
                itm: {
                  isPresent: true,
                  itmBaseId: itmBaseId,
                  itmSwappedId: itmSwappedId,
                }
              },
              nCotizacionDetalleId: state.nCotizacionDetalleId,
            };
          }
        }
      }
      case ACTIONS.RESET_CONFIGURATION: {
        return {
          ...generatorSet.combinations[0],
          nIntDescuentoPorcentaje: state.nIntDescuentoPorcentaje,
          nIntMargenExportacionPorcentaje: state.nIntMargenExportacionPorcentaje,
          nIntDiasParaEntrega: state.nIntDiasParaEntrega,
          accessories: state.accessories,
          operativeCosts: state.operativeCosts,
          nIntSileciadorTipo: state.nIntSileciadorTipo,
          sIntSileciadorTipo: state.sIntSileciadorTipo,
          configuration: {
            alternator: {
              isPresent: false,
              alternatorBaseId: null,
              alternatorSwappedId: null,
            },
            itm: {
              isPresent: false,
              itmBaseId: null,
              itmSwappedId: null,
            },
          },
        };
      }

      case ACTIONS.REMOVE_FROM_STORE: {
        return {
          ...state,
          nIntCantidad: 1,
        };
      }
      case ACTIONS.SET_COMBINATION: {
        const combination = action.combination;

        return {
          ...state,
          ...combination,
        };
      }
      case ACTIONS.SET_WORK_ARRANGEMENT: {
        const workArrangement = action.workArrangement;
        return {
          ...state,
          sRegimen: workArrangement,
        };
      }
      default:
        return state;
    }
  };

  const [combination, dispatch] = React.useReducer(
    reducer,
    isAdded
      ? generatorSetsAdded.find((gs) => gs.sIntKey === generatorSet.sIntKey)
      : { ...(generatorSet.combinations[0] || {}) }
  );

  const onSave = () => {
    if (isAdded) {
      removeGeneratorSet(combination.sIntKey);
      dispatch({ type: ACTIONS.REMOVE_FROM_STORE });
    } else {
      addGeneratorSet(combination);
    }
  };

  const onEdit = () => {
    updateDetailMutate({
      quoteId: selectedQuote?.Cotizacon_Id,
      quoteDetailId: combination?.nCotizacionDetalleId,
      detail: combination,
    });
  };

  const isDirty = React.useMemo(() => {
    return (
      combination.nIntDescuentoPorcentaje !== 0 ||
      combination.nIntDiasParaEntrega !== 1 ||
      (combination.accessories || []).length > 0 ||
      combination.operativeCosts.shipping.isPresent ||
      combination.operativeCosts.startup.isPresent ||
      (combination.configuration?.alternator?.alternadorSwappedId &&
        combination.configuration?.alternator?.alternadorSwappedId !==
        combination.Alternador_Id) ||
      (combination.nIntSileciadorPermiteCambio &&
        combination.sIntSileciadorTipo !==
        SILENCERS[combination.sIntSileciadorTipo]?.label)
    );
  }, [combination]);

  const handleResetConfiguration = async (component) => {
    const state = combination;

    switch (component) {
      case "alternator": {
        if (state.configuration?.itm?.isPresent) {
          const params = {
            modelo: state.sModNombre,
            voltaje: state.nIntVoltaje,
            frecuencia: state.nIntFrecuencia,
            fases: state.nIntFases,
            factorPotencia: state.nIntFP,
            altura: state.nIntAltura,
            temperatura: state.nIntTemperatura,
            insonoro: state.nIntInsonoro,
            powerThreshold: 20,
            primePower: "Todos",
            standbyPower: "Todos",
            marketId: state.MercadoId,
          };

          const originalAlternatorId = generatorSet.combinations[0].Alternador_Id;
          const currentItmId = state.configuration.itm.itmSwappedId;

          const combinationSwappedResponse = await changeConfigurationAsync({
            params,
            configuration: {
              alternatorId: originalAlternatorId,
              itmId: currentItmId,
            },
            integradoraId: state.IntegradoraId,
          });


          const combinationSwapped = combinationSwappedResponse.combination;

          dispatch({
            type: ACTIONS.SET_COMBINATION,
            combination: {
              ...state,
              configuration: {
                ...state.configuration,
                alternator: {
                  isPresent: false,
                  alternatorBaseId: null,
                  alternatorSwappedId: null,
                }
              }
            }
          });

          dispatch({
            type: ACTIONS.CHANGE_CONFIGURATION,
            component: "itm",
            configuration: {
              combination: combinationSwapped,
              itmBaseId: generatorSet.combinations[0].nITMId,
              itmSwappedId: currentItmId,
            }
          });
        } else {
          // Si no hay ITM, volver a la combinación original
          dispatch({
            type: ACTIONS.RESET_CONFIGURATION,
          });
        }
      }; break;
      case "itm": {
        if (state.configuration?.alternator?.isPresent) {
          const params = {
            modelo: state.sModNombre,
            voltaje: state.nIntVoltaje,
            frecuencia: state.nIntFrecuencia,
            fases: state.nIntFases,
            factorPotencia: state.nIntFP,
            altura: state.nIntAltura,
            temperatura: state.nIntTemperatura,
            insonoro: state.nIntInsonoro,
            powerThreshold: 20,
            primePower: "Todos",
            standbyPower: "Todos",
            marketId: state.MercadoId,
          };

          const currentAlternatorId = state.configuration.alternator.alternatorSwappedId;
          const originalItmId = generatorSet.combinations[0].nITMId;

          const combinationSwappedResponse = await changeConfigurationAsync({
            params,
            configuration: {
              alternatorId: currentAlternatorId,
              itmId: originalItmId,
            },
            integradoraId: state.IntegradoraId,
          });

          const combinationSwapped = combinationSwappedResponse.combination;

          dispatch({
            type: ACTIONS.SET_COMBINATION,
            combination: {
              ...state,
              configuration: {
                ...state.configuration,
                itm: {
                  isPresent: false,
                  itmBaseId: null,
                  itmSwappedId: null,
                }
              }
            }
          })

          dispatch({
            type: ACTIONS.CHANGE_CONFIGURATION,
            component: "alternator",
            configuration: {
              combination: combinationSwapped,
              alternatorBaseId: generatorSet.combinations[0].Alternador_Id,
              alternatorSwappedId: currentAlternatorId,
            }
          });


        } else {
          dispatch({
            type: ACTIONS.RESET_CONFIGURATION,
          });
        }
      }; break;
      default:
        break;
    }


  };

  return {
    combination,
    dispatch,
    onSave,
    onEdit,
    isDirty,
    isAdded,
    workArrangements,
    handleResetConfiguration,
  };
};
