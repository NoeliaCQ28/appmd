import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const GeneratorSetModel = {
  create: async (user_id, data) => {
    let {
      sModNombre,
      uModImgInsonoro,
      uModImgAbierto,
      nModTcombAbierto,
      nModTcombInsonoro,
      sModNiveldeRuido,
      sModRuidoAmbiental,
      sModNormaTecnica,
      nModDimensionesA,
      nModDimensionesB,
      nModDimensionesC,
      nModDimensionesPeso1,
      nModDimensionesEsc1,
      nModDimensionesX,
      nModDimensionesY,
      nModDimensionesZ,
      nModDimensionesPeso2,
      nModDimensionesEsc2,
      uModImgDimensiones,
      dModFecha_Act,
      sIntModControl,
    } = data;

    // Set default values for undefined or empty fields
    // Numeric fields default to 0
    nModTcombAbierto =
      nModTcombAbierto !== undefined && nModTcombAbierto !== ""
        ? Number(nModTcombAbierto) || 0
        : 0;
    nModTcombInsonoro =
      nModTcombInsonoro !== undefined && nModTcombInsonoro !== ""
        ? Number(nModTcombInsonoro) || 0
        : 0;
    nModDimensionesA =
      nModDimensionesA !== undefined && nModDimensionesA !== ""
        ? Number(nModDimensionesA) || 0
        : 0;
    nModDimensionesB =
      nModDimensionesB !== undefined && nModDimensionesB !== ""
        ? Number(nModDimensionesB) || 0
        : 0;
    nModDimensionesC =
      nModDimensionesC !== undefined && nModDimensionesC !== ""
        ? Number(nModDimensionesC) || 0
        : 0;
    nModDimensionesPeso1 =
      nModDimensionesPeso1 !== undefined && nModDimensionesPeso1 !== ""
        ? Number(nModDimensionesPeso1) || 0
        : 0;
    nModDimensionesEsc1 =
      nModDimensionesEsc1 !== undefined && nModDimensionesEsc1 !== ""
        ? Number(nModDimensionesEsc1) || 0
        : 0;
    nModDimensionesX =
      nModDimensionesX !== undefined && nModDimensionesX !== ""
        ? Number(nModDimensionesX) || 0
        : 0;
    nModDimensionesY =
      nModDimensionesY !== undefined && nModDimensionesY !== ""
        ? Number(nModDimensionesY) || 0
        : 0;
    nModDimensionesZ =
      nModDimensionesZ !== undefined && nModDimensionesZ !== ""
        ? Number(nModDimensionesZ) || 0
        : 0;
    nModDimensionesPeso2 =
      nModDimensionesPeso2 !== undefined && nModDimensionesPeso2 !== ""
        ? Number(nModDimensionesPeso2) || 0
        : 0;
    nModDimensionesEsc2 =
      nModDimensionesEsc2 !== undefined && nModDimensionesEsc2 !== ""
        ? Number(nModDimensionesEsc2) || 0
        : 0;

    // Text fields default to null
    sModNombre = sModNombre !== undefined ? sModNombre : null;
    uModImgInsonoro = uModImgInsonoro !== undefined ? uModImgInsonoro : null;
    uModImgAbierto = uModImgAbierto !== undefined ? uModImgAbierto : null;
    sModNiveldeRuido = sModNiveldeRuido !== undefined ? sModNiveldeRuido : null;
    sModRuidoAmbiental =
      sModRuidoAmbiental !== undefined ? sModRuidoAmbiental : null;
    sModNormaTecnica = sModNormaTecnica !== undefined ? sModNormaTecnica : null;
    uModImgDimensiones =
      uModImgDimensiones !== undefined ? uModImgDimensiones : null;
    dModFecha_Act = dModFecha_Act !== undefined ? dModFecha_Act : null;
    sIntModControl = sIntModControl !== undefined ? sIntModControl : null;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modeloge_crear",
        parameters: {
          in: [
            sModNombre,
            uModImgInsonoro,
            uModImgAbierto,
            nModTcombAbierto,
            nModTcombInsonoro,
            sModNiveldeRuido,
            sModRuidoAmbiental,
            sModNormaTecnica,
            nModDimensionesA,
            nModDimensionesB,
            nModDimensionesC,
            nModDimensionesPeso1,
            nModDimensionesEsc1,
            nModDimensionesX,
            nModDimensionesY,
            nModDimensionesZ,
            nModDimensionesPeso2,
            nModDimensionesEsc2,
            uModImgDimensiones,
            dModFecha_Act,
            user_id,
            sIntModControl,
          ],
        },
      });

      return handleResponse(null, "Grupo electrogeno creado exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getParams: async () => {
    try {
      const {
        result: [alturas],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_AlturasDisponibles",
        parameters: {
          in: [],
        },
      });

      const {
        result: [fases],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FasesDisponibles",
        parameters: {
          in: [],
        },
      });

      const {
        result: [factorPotencias],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FPsDisponibles",
        parameters: {
          in: [],
        },
      });

      const {
        result: [frecuencias],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FrecuenciasDisponibles",
        parameters: {
          in: [],
        },
      });

      const {
        result: [temperaturas],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_TemperaturasDisponibles",
        parameters: {
          in: [],
        },
      });

      const {
        result: [voltajes],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_VoltajesDisponibles",
        parameters: {
          in: [],
        },
      });

      const heights = alturas.map((altura) => {
        return altura.Altura;
      });

      const phases = fases.map((fase) => {
        return fase.nIntFases;
      });

      const powerFactors = factorPotencias.map((factorPotencia) => {
        return Number(parseFloat(factorPotencia.nIntFP).toFixed(2));
      });

      const frequencies = frecuencias.map((frecuencia) => {
        return frecuencia.nIntFrecuencia;
      });

      const temperatures = temperaturas.map((temperatura) => {
        return temperatura.Temperatura;
      });

      const voltages = voltajes.map((voltaje) => {
        return voltaje.nIntVoltaje;
      });

      return handleResponse(
        {
          alturas: heights,
          fases: phases,
          factorPotencias: powerFactors,
          frecuencias: frequencies,
          temperaturas: temperatures,
          voltajes: voltages,
        },
        "Datos cargados correctamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getModelsByParams: async ({
    modelo = "Todos",
    voltaje,
    frecuencia,
    fases,
    factorPotencia,
    altura,
    temperatura,
    insonoro,
    powerThreshold,
    primePower = "Todos",
    standbyPower = "Todos",
    marketId,
  }) => {
    primePower =
      primePower === null || primePower === undefined ? "Todos" : primePower;
    standbyPower =
      standbyPower === null || standbyPower === undefined
        ? "Todos"
        : standbyPower;
    //Validar todos los campos cuando modelo es "Todos"
    if (
      modelo === "Todos" &&
      (voltaje == null ||
        frecuencia == null ||
        fases == null ||
        factorPotencia == null ||
        altura == null ||
        temperatura == null ||
        insonoro == null)
    ) {
      return handleResponse(null, "Existen campos requeridos", false, 400);
    }

    //Si modelo es especifico, usar valores por defecto para campos faltantes
    if (modelo !== "Todos") {
      voltaje = voltaje || 220;
      frecuencia = frecuencia || 60;
      fases = fases || 3;
      factorPotencia = factorPotencia || 0.8;
      altura = altura || 1000;
      temperatura = temperatura || 0;
      insonoro = insonoro !== undefined ? insonoro : true;
      logger.info("direct search in progress");
    } else {
      logger.info("search all models in progress");
    }

    logger.info("parameters", {
      modelo,
      voltaje,
      frecuencia,
      fases,
      factorPotencia,
      altura,
      temperatura,
      insonoro,
      primePower,
      standbyPower,
      powerThreshold,
      marketId,
    });

    try {
      let models = [];

      if (modelo === "Todos" || modelo === "") {
        const {
          result: [modelsMapped],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_ModelosCompatibles",
          parameters: {
            in: [
              voltaje,
              frecuencia,
              fases,
              factorPotencia,
              insonoro,
              marketId,
            ],
          },
        });

        models = modelsMapped;
      } else {
        // Busqueda Directa
        const {
          result: [modelsMappedDirect],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_ModelosCompatiblesDirecto",
          parameters: {
            in: [
              modelo,
              voltaje,
              frecuencia,
              fases,
              factorPotencia,
              insonoro,
              marketId,
            ],
          },
        });

        models = modelsMappedDirect;
      }
      const modelsUnique = models.filter((model, index, self) => {
        return (
          index ===
          self.findIndex(
            (m) =>
              m.ModeloGE_Id === model.ModeloGE_Id &&
              m.nIntITMA === model.nIntITMA,
          )
        );
      });

      const modelsWithExtraAttributesPromises = [];

      for (const model of modelsUnique) {
        const modelId = model.ModeloGE_Id;
        const itmA = model.nIntITMA;

        const {
          result: [motors],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_MotoresCompatibles",
          parameters: {
            in: [modelId, voltaje, frecuencia, fases, factorPotencia, marketId],
          },
        });

        // Process each motor separately (multiple motors per model)

        // Create a separate generator set object for each motor
        for (const motor of motors) {
          const motorPromise = (async () => {
            const {
              result: [alternators],
            } = await executeStoredProcedure({
              pool: db_pool,
              sp_name: "Int_AlternadoresCompatibles",
              parameters: {
                in: [
                  modelId,
                  motor.Motor_Id,
                  voltaje,
                  frecuencia,
                  fases,
                  factorPotencia,
                  marketId,
                ],
              },
            });

            const alternatorsWithPricesITMAndDeratePromise = alternators.map(
              async (alternator) => {
                const { Alternador_Id } = alternator;

                const {
                  result: [prices],
                } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "Int_Precios",
                  parameters: {
                    in: [
                      modelId,
                      motor.Motor_Id,
                      Alternador_Id,
                      voltaje,
                      frecuencia,
                      fases,
                      factorPotencia,
                      marketId,
                    ],
                  },
                });

                const {
                  result: [derates],
                } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "DerrateoGE",
                  parameters: {
                    in: [
                      modelId,
                      motor.Motor_Id,
                      Alternador_Id,
                      voltaje,
                      frecuencia,
                      fases,
                      altura,
                      temperatura,
                      factorPotencia,
                      itmA,
                      marketId,
                    ],
                  },
                });

                const {
                  result: [itms],
                } = await executeStoredProcedure({
                  pool: db_pool,
                  sp_name: "Int_ITMDisponibles",
                  parameters: {
                    in: [
                      modelId,
                      motor.Motor_Id,
                      Alternador_Id,
                      voltaje,
                      frecuencia,
                      fases,
                      factorPotencia,
                      marketId,
                    ],
                  },
                });

                const { Prime, StandBy } = derates[0];

                const PrimeDerate = Number.parseFloat(Prime);
                const StandByDerate = Number.parseFloat(StandBy);
                const derate = {
                  prime: {
                    kw: Number(PrimeDerate.toFixed(2)),
                    kva: Number((PrimeDerate / factorPotencia).toFixed(2)),
                  },
                  standby: {
                    kw: Number(StandByDerate.toFixed(2)),
                    kva: Number((StandByDerate / factorPotencia).toFixed(2)),
                  },
                };

                if (!prices || !prices[0]) {
                  throw new Error(
                    "No se encontraron precios para esta configuración",
                  );
                }

                const { nIntPrecioGEAbierto, nIntPrecioGECabina } = prices[0]; // There is only one price per alternator

                if (
                  nIntPrecioGEAbierto === null ||
                  nIntPrecioGECabina === null
                ) {
                  throw new Error(
                    "Precios no disponibles para esta configuración",
                  );
                }

                const openPrice = Number.parseFloat(nIntPrecioGEAbierto);
                const cabinPrice = Number.parseFloat(nIntPrecioGECabina);

                if (isNaN(openPrice) || isNaN(cabinPrice)) {
                  throw new Error("Error al convertir los precios a números");
                }

                const finalPrice = insonoro
                  ? openPrice + cabinPrice
                  : openPrice;

                return {
                  ...alternator,
                  price: Number(finalPrice).toFixed(2),
                  derate: derate,
                  itms: itms,
                };
              },
            );

            const alternatorsWithPricesITMAndDerate = await Promise.all(
              alternatorsWithPricesITMAndDeratePromise,
            );
            const ModeloKey = `${model.integradora_Id}-${model.ModeloGE_Id}-${
              motor.Motor_Id
            }-${model.nIntITMA}-${insonoro ? 1 : 0}`;

            return {
              ...model,
              motor: motor,
              alternadores: alternatorsWithPricesITMAndDerate,
              ModeloKey: ModeloKey,
              integradora_Id: model.integradora_Id,
            };
          })();

          modelsWithExtraAttributesPromises.push(motorPromise);
        }
      }

      const modelsWithExtraAttributes = await Promise.all(
        modelsWithExtraAttributesPromises,
      );

      // Calculate average derate using all alternators
      const allDerates = modelsWithExtraAttributes.flatMap((model) =>
        model.alternadores.map((alternador) => alternador.derate),
      );

      // Filter out alternators with derate prime or standby equal to 0
      const validDerates = allDerates.filter(
        (derate) => derate.prime.kw !== 0 && derate.standby.kw !== 0,
      );

      const totalValidAlternators = validDerates.length;
      const averageDerate = validDerates.reduce(
        (acc, derate) => {
          const { prime, standby } = derate;

          return {
            prime: {
              kw: acc.prime.kw + prime.kw,
              kva: acc.prime.kva + prime.kva,
            },
            standby: {
              kw: acc.standby.kw + standby.kw,
              kva: acc.standby.kva + standby.kva,
            },
          };
        },
        {
          prime: {
            kw: 0,
            kva: 0,
          },
          standby: {
            kw: 0,
            kva: 0,
          },
        },
      );

      // Divide by totalValidAlternators if it's greater than 0, otherwise divide by 1
      const divisor = totalValidAlternators > 0 ? totalValidAlternators : 1;

      averageDerate.prime.kw = Number(
        (averageDerate.prime.kw / divisor).toFixed(2),
      );
      averageDerate.standby.kw = Number(
        (averageDerate.standby.kw / divisor).toFixed(2),
      );
      averageDerate.prime.kva = averageDerate.prime.kw / factorPotencia;
      averageDerate.standby.kva = averageDerate.standby.kw / factorPotencia;

      // Filter models based on power requirements
      let modelsFilteredByPower = modelsWithExtraAttributes;

      // Only filter by primePower if it's not "Todos" and is a valid number
      if (primePower !== "Todos" && !isNaN(Number(primePower))) {
        const primePowerNum = Number(primePower);
        modelsFilteredByPower = modelsFilteredByPower.filter((model) => {
          // Check if any alternator's prime power is within range of powerThreshold
          return model.alternadores.some((alternador) => {
            const alterPrime = alternador.derate.prime.kw;
            return (
              alterPrime > 0 && // Exclude alternators with prime power of 0
              alterPrime >=
                primePowerNum - (powerThreshold / 100) * primePower &&
              alterPrime <= primePowerNum + (powerThreshold / 100) * primePower
            );
          });
        });
      }

      // Only filter by standbyPower if it's not "Todos" and is a valid number
      if (standbyPower !== "Todos" && !isNaN(Number(standbyPower))) {
        const standbyPowerNum = Number(standbyPower);
        modelsFilteredByPower = modelsFilteredByPower.filter((model) => {
          // Check if any alternator's standby power is within range of powerThreshold
          return model.alternadores.some((alternador) => {
            const alterStandby = alternador.derate.standby.kw;
            return (
              alterStandby > 0 && // Exclude alternators with standby power of 0
              alterStandby >=
                standbyPowerNum - (powerThreshold / 100) * standbyPower &&
              alterStandby <=
                standbyPowerNum + (powerThreshold / 100) * standbyPower
            );
          });
        });
      }

      return handleResponse(
        {
          generatorsSet: modelsFilteredByPower,
          averageDerate,
          derateRange: {
            prime: {
              kw: {
                min: Number(
                  Number(
                    primePower - (powerThreshold / 100) * primePower,
                  ).toFixed(2),
                ),
                max: Number(
                  Number(
                    primePower + (powerThreshold / 100) * primePower,
                  ).toFixed(2),
                ),
              },
              kva: {
                min: Number(
                  Number(
                    primePower / factorPotencia -
                      (powerThreshold / 100) * primePower,
                  ).toFixed(2),
                ),
                max: Number(
                  Number(
                    primePower / factorPotencia +
                      (powerThreshold / 100) * primePower,
                  ).toFixed(2),
                ),
              },
            },
            standby: {
              kw: {
                min: Number(
                  Number(
                    standbyPower - (powerThreshold / 100) * standbyPower,
                  ).toFixed(2),
                ),
                max: Number(
                  Number(
                    standbyPower + (powerThreshold / 100) * standbyPower,
                  ).toFixed(2),
                ),
              },
              kva: {
                min: Number(
                  Number(
                    standbyPower / factorPotencia -
                      (powerThreshold / 100) * standbyPower,
                  ).toFixed(2),
                ),
                max: Number(
                  Number(
                    standbyPower / factorPotencia +
                      (powerThreshold / 100) * standbyPower,
                  ).toFixed(2),
                ),
              },
            },
          },
          generatorsSetLength: modelsFilteredByPower.length,
        },
        "Grupos electrogenos consultados con exito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  searchModels: async ({ params }) => {
    const {
      model,
      motor_brand,
      motor_model,
      alternator_brand,
      alternator_model,
      voltage,
      frecuency,
      phases,
      power_factor,
      market,
    } = params;

    try {
      const {
        result: [models],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modeloge_buscar",
        parameters: {
          in: [
            model,
            motor_brand,
            motor_model,
            alternator_brand,
            alternator_model,
            voltage,
            frecuency,
            phases,
            power_factor,
            market,
          ],
        },
      });

      return handleResponse(models, "Modelos encontrados con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getModels: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modeloge_listar_nombres",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Los nombres de los modelos se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getMotorBrands: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "motormarca_listar_nombres",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Las marcas de los modelos se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getMotorModels: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modelomotor_listar_nombres",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Los modelos de los motores se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAlternatorBrands: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternadormarca_listar_nombres",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Las marcas de los alternadores se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAlternatorModels: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternadormodelo_listar_nombres",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Los modelos de los alternadores se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getVoltages: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_VoltajesDisponibles",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Los voltajes se optuvieron con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getFrequencies: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FrecuenciasDisponibles",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Las frecuencias se optuvieron con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getPhases: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FasesDisponibles",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Las fases se optuvieron con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getPowerFactors: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FPsDisponibles",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Los factores de potencia se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAltitudes: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_AlturasDisponibles",
        parameters: {
          in: [],
        },
      });

      return handleResponse(
        rows,
        "Los datos de altitud se optuvieron con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getITMs: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_ITMsTodos",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Los datos de ITM se optuvieron con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getMarkets: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "mercados_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Los mercados se optuvieron con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  getMotorInfo: async ({ motorModelo }) => {
    if (motorModelo == null) {
      return handleResponse(
        null,
        "El modelo de motor es requerido",
        false,
        400,
      );
    }

    try {
      const {
        result: [motors],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "motor_info",
        parameters: {
          in: [motorModelo],
        },
      });

      const motorWithPowerMotorInfoPromise = motors.map(async (motor) => {
        const motorId = motor.Motor_Id;

        const {
          result: [powerMotorInfo],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "motorpotencia_motor_info",
          parameters: {
            in: [motorId],
          },
        });

        return {
          ...motor,
          powerMotorInfo,
        };
      });

      const motorWithPowerMotorInfo = await Promise.all(
        motorWithPowerMotorInfoPromise,
      );

      return handleResponse(
        motorWithPowerMotorInfo,
        "Información del motor obtenida con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAlternatorInfo: async ({ alternadorModelo }) => {
    if (alternadorModelo == null) {
      return handleResponse(
        null,
        "El modelo de alternador es requerido",
        false,
        400,
      );
    }

    try {
      const {
        result: [alternators],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternador_info",
        parameters: {
          in: [alternadorModelo],
        },
      });

      const alternatorsWithPowerInfoPromise = alternators.map(
        async (alternator) => {
          const alternatorId = alternator.Alternador_Id;

          const {
            result: [powerAlternatorInfo],
          } = await executeStoredProcedure({
            pool: db_pool,
            sp_name: "alternadorpotencia_info",
            parameters: {
              in: [alternatorId],
            },
          });

          return {
            ...alternator,
            powerAlternatorInfo,
          };
        },
      );

      const alternatorsWithPowerInfo = await Promise.all(
        alternatorsWithPowerInfoPromise,
      );

      return handleResponse(
        alternatorsWithPowerInfo,
        "Información del alternador obtenida con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getModeloInfo: async ({ modelo }) => {
    if (modelo == null) {
      return handleResponse(null, "El modelo es requerido", false, 400);
    }

    try {
      const {
        result: [model],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modeloge_info",
        parameters: {
          in: [modelo],
        },
      });

      return handleResponse(model, "Información del modelo obtenida con éxito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getModelPrices: async ({
    modeloge_id,
    motor_id,
    alternador_id,
    voltaje,
    frecuencia,
    fases,
    factor_potencia,
    market_id,
  }) => {
    if (modeloge_id == null) {
      return handleResponse(null, "El id del modelo es requerido", false, 400);
    }

    if (motor_id == null) {
      return handleResponse(null, "El id del motor es requerido", false, 400);
    }

    if (alternador_id == null) {
      return handleResponse(
        null,
        "El id del alternador es requerido",
        false,
        400,
      );
    }

    if (voltaje == null) {
      return handleResponse(null, "El voltaje es requerido", false, 400);
    }

    if (frecuencia == null) {
      return handleResponse(null, "La frecuencia es requerida", false, 400);
    }

    if (fases == null) {
      return handleResponse(null, "Las fases son requeridas", false, 400);
    }

    if (factor_potencia == null) {
      return handleResponse(
        null,
        "El factor de potencia es requerido",
        false,
        400,
      );
    }

    try {
      const {
        result: [prices],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_Precios",
        parameters: {
          in: [
            modeloge_id,
            motor_id,
            alternador_id,
            voltaje,
            frecuencia,
            fases,
            factor_potencia,
            market_id,
          ],
        },
      });

      return handleResponse(
        prices,
        "Información de los precios del modelo fue obtenida con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updateMotorInfo: async (user_id, data) => {
    const {
      Motor_Id,
      sMotCodigoSAP,
      sMotFamilia,
      sMotNoCilindros,
      sMotSisGobernacion,
      sMotCiclo,
      sMotAspiracion,
      sMotCombustible,
      sMotSisCombustion,
      sMotSisEnfriamiento,
      nMotDiametroPiston,
      nMotDesplazamientoPiston,
      nMotCapacidad,
      sMotRelCompresion,
      nMotCapSisLubricacion,
      nMotCapSisRefrigeracion,
      nMotSisElectrico,
      sMotNormasTecnicas,
      sMotNivelEmision,
      nMotConsStandBy1800,
      nMotConsPrime1800,
      nMotConsPrime1800_75porc,
      nMotConsPrime1800_50porc,
      nMotConsStandBy1500,
      nMotConsPrime1500,
      nMotConsPrime1500_75porc,
      nMotConsPrime1500_50porc,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "mot_editar",
        parameters: {
          in: [
            Number(Motor_Id),
            sMotCodigoSAP,
            sMotFamilia,
            sMotNoCilindros,
            sMotSisGobernacion,
            sMotCiclo,
            sMotAspiracion,
            sMotCombustible,
            sMotSisCombustion,
            sMotSisEnfriamiento,
            nMotDiametroPiston,
            nMotDesplazamientoPiston,
            nMotCapacidad,
            sMotRelCompresion,
            nMotCapSisLubricacion,
            nMotCapSisRefrigeracion,
            nMotSisElectrico,
            sMotNormasTecnicas,
            sMotNivelEmision,
            nMotConsStandBy1800,
            nMotConsPrime1800,
            nMotConsPrime1800_75porc,
            nMotConsPrime1800_50porc,
            nMotConsStandBy1500,
            nMotConsPrime1500,
            nMotConsPrime1500_75porc,
            nMotConsPrime1500_50porc,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información del motor actualizada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updatePowerMotorInfo: async (user_id, data) => {
    const { nMPId, Motor_Id, Frecuencia, RPM, Prime, StandBy } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "motorpotencia_motor_edit",
        parameters: {
          in: [
            Number(Motor_Id),
            Frecuencia,
            RPM,
            Prime,
            StandBy,
            nMPId,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información de la potencia del motor actualizada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  createPowerMotorInfo: async (user_id, data) => {
    const { Motor_Id, Frecuencia, RPM, Prime, StandBy } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "motorpotencia_create",
        parameters: {
          in: [Number(Motor_Id), Frecuencia, RPM, Prime, StandBy, user_id],
        },
      });

      return handleResponse(
        null,
        "Información de la potencia del motor creada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  createPowerAlternatorInfo: async (user_id, data) => {
    const {
      Alternador_Id,
      Frecuencia,
      Fases,
      Voltaje,
      Prime_KW,
      Prime_KVA,
      Standby_KW,
      SandtBy_KVA,
      Eficiencia,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternadorpotencia_create",
        parameters: {
          in: [
            Number(Alternador_Id),
            Frecuencia,
            Number(Fases),
            Voltaje,
            Prime_KW,
            Prime_KVA,
            Standby_KW,
            SandtBy_KVA,
            Eficiencia,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información de la potencia del alternador creada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updateAlternadorInfo: async (user_id, data) => {
    const {
      Alternador_Id,
      AlternadorMarca_Id,
      sAltCodigoSAP,
      sAltSistemaExitacion,
      sAltAislamiento,
      sAltGradoIP,
      nAltPesoKg,
      nAltBrida,
      nAltDisco,
      nAltCostoUSD,
      sAltNormaTecnica,
      sAltTarjetaAVR,
      nAltNroHilos,
      sAltNroPaso,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alt_editar",
        parameters: {
          in: [
            Number(Alternador_Id),
            Number(AlternadorMarca_Id),
            sAltCodigoSAP,
            sAltSistemaExitacion,
            sAltAislamiento,
            sAltGradoIP,
            nAltPesoKg,
            nAltBrida,
            nAltDisco,
            nAltCostoUSD,
            sAltNormaTecnica,
            sAltTarjetaAVR,
            nAltNroHilos,
            sAltNroPaso,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información del alternador actualizada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updatePowerAlternatorInfo: async (user_id, data) => {
    const {
      nAPId,
      Alternador_Id,
      Frecuencia,
      Fases,
      Voltaje,
      Prime_KW,
      Prime_KVA,
      Standby_KW,
      SandtBy_KVA,
      Eficiencia,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternadorpotencia_edit",
        parameters: {
          in: [
            Number(nAPId),
            Number(Alternador_Id),
            Frecuencia,
            Fases,
            Voltaje,
            Prime_KW,
            Prime_KVA,
            Standby_KW,
            SandtBy_KVA,
            Eficiencia,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información de la potencia del alternador fue actualizada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updateModeloInfo: async (user_id, data) => {
    const {
      ModeloGE_Id,
      sModNombre,
      sModNormaTecnica,
      sModNiveldeRuido,
      nModTcombAbierto,
      nModTcombInsonoro,
      nModDimensionesA,
      nModDimensionesB,
      nModDimensionesC,
      nModDimensionesPeso1,
      nModDimensionesX,
      nModDimensionesY,
      nModDimensionesZ,
      nModDimensionesPeso2,
      sIntModControl,
      uModImgInsonoro,
      uModImgAbierto,
      uModImgDimensiones,
      uModImgDimensionesInsonoro,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modge_editar",
        parameters: {
          in: [
            Number(ModeloGE_Id),
            sModNombre,
            sModNormaTecnica,
            sModNiveldeRuido,
            nModTcombAbierto,
            nModTcombInsonoro,
            nModDimensionesA,
            nModDimensionesB,
            nModDimensionesC,
            nModDimensionesPeso1,
            nModDimensionesX,
            nModDimensionesY,
            nModDimensionesZ,
            nModDimensionesPeso2,
            sIntModControl,
            uModImgInsonoro,
            uModImgAbierto,
            uModImgDimensiones,
            uModImgDimensionesInsonoro,
            user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Información del modelo actualizada exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  updateModelImages: async (user_id, data) => {
    const {
      ModeloGEId,
      uModImgAbierto,
      uModImgInsonoro,
      uModImgDimensiones,
      uModImgDimensionesInsonoro,
      user_id: requestUserId,
    } = data;

    const effectiveUserId = user_id || requestUserId;

    if (!ModeloGEId || isNaN(ModeloGEId) || ModeloGEId <= 0) {
      console.error("Validación fallida: ModeloGEId inválido", { ModeloGEId });
      return handleResponse(null, "ModeloGEId es inválido o falta", false, 400);
    }
    if (
      !effectiveUserId ||
      isNaN(effectiveUserId) ||
      effectiveUserId < 0 ||
      effectiveUserId > 255
    ) {
      console.error("Validación fallida: user_id inválido", {
        effectiveUserId,
      });
      return handleResponse(null, "user_id es inválido o falta", false, 400);
    }

    const validatedData = {
      ModeloGEId: Number(ModeloGEId),
      uModImgAbierto: uModImgAbierto ? String(uModImgAbierto) : null,
      uModImgInsonoro: uModImgInsonoro ? String(uModImgInsonoro) : null,
      uModImgDimensiones: uModImgDimensiones
        ? String(uModImgDimensiones)
        : null,
      uModImgDimensionesInsonoro: uModImgDimensionesInsonoro
        ? String(uModImgDimensionesInsonoro)
        : null,
      user_id: Number(effectiveUserId),
    };

    try {
      const result = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modge_editar_imagenes",
        parameters: {
          in: [
            validatedData.ModeloGEId,
            validatedData.uModImgAbierto,
            validatedData.uModImgInsonoro,
            validatedData.uModImgDimensiones,
            validatedData.uModImgDimensionesInsonoro,
            validatedData.user_id,
          ],
        },
      });

      return handleResponse(
        null,
        "Imágenes del modelo actualizadas exitosamente",
        true,
        200,
      );
    } catch (error) {
      console.error("Error en updateModelImages:", {
        message: error.message,
        stack: error.stack,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
      const errorMessage =
        error.code === "ER_BAD_FIELD_ERROR"
          ? "Datos inválidos proporcionados al procedimiento almacenado"
          : error.sqlMessage ||
            error.message ||
            "No se pudieron actualizar las imágenes";
      return handleResponse(null, errorMessage, false, 500);
    }
  },

  updateModelPricesInfo: async (data) => {
    const { nIntegradoraId, nIntCostoGEAbierto, nIntCostoGECabina } = data;

    if (nIntegradoraId == null) {
      return handleResponse(null, "El modelo es requerido", false, 400);
    }

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_actualizar_precios",
        parameters: {
          in: [
            Number(nIntegradoraId),
            Number.parseFloat(nIntCostoGEAbierto),
            Number.parseFloat(nIntCostoGECabina),
          ],
        },
      });

      return handleResponse(
        null,
        "La Información de los precios del modelo fue editada con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  createMotorInfo: async (user_id, data) => {
    const {
      sMotCodigoSAP,
      MotorMarca_Id,
      sMotModelo,
      sMotFamilia,
      sMotNoCilindros,
      sMotSisGobernacion,
      sMotCiclo,
      sMotAspiracion,
      sMotCombustible,
      sMotSisCombustion,
      sMotSisEnfriamiento,
      nMotDiametroPiston,
      nMotDesplazamientoPiston,
      nMotCapacidad,
      sMotRelCompresion,
      nMotCapSisLubricacion,
      nMotCapSisRefrigeracion,
      nMotSisElectrico,
      sMotNormasTecnicas,
      sMotNivelEmision,
      nMotConsStandBy1800,
      nMotConsPrime1800,
      nMotConsPrime1800_75porc,
      nMotConsPrime1800_50porc,
      nMotConsStandBy1500,
      nMotConsPrime1500,
      nMotConsPrime1500_75porc,
      nMotConsPrime1500_50porc,
      nMotEstado,
      nMotEliminado,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "motor_crear",
        parameters: {
          in: [
            sMotCodigoSAP,
            Number(MotorMarca_Id),
            sMotModelo,
            sMotFamilia,
            sMotNoCilindros,
            sMotSisGobernacion,
            sMotCiclo,
            sMotAspiracion,
            sMotCombustible,
            sMotSisCombustion,
            sMotSisEnfriamiento,
            Number(nMotDiametroPiston),
            Number(nMotDesplazamientoPiston),
            Number(nMotCapacidad),
            sMotRelCompresion,
            nMotCapSisLubricacion,
            nMotCapSisRefrigeracion,
            Number(nMotSisElectrico),
            sMotNormasTecnicas,
            sMotNivelEmision,
            nMotConsStandBy1800,
            nMotConsPrime1800,
            nMotConsPrime1800_75porc,
            nMotConsPrime1800_50porc,
            nMotConsStandBy1500,
            nMotConsPrime1500,
            nMotConsPrime1500_75porc,
            nMotConsPrime1500_50porc,
            nMotEstado,
            nMotEliminado,
            user_id,
          ],
          out: ["@p_Motor_Id"],
        },
      });

      return handleResponse(null, "Motor creado exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  createAlternadorInfo: async (user_id, data) => {
    const {
      sAltCodigoSAP,
      AlternadorMarca_Id,
      sAltModelo,
      sAltAislamiento,
      sAltSistemaExitacion,
      sAltTarjetaAVR,
      sAltGradoIP,
      sAltNormaTecnica,
      nAltNroHilos,
      sAltNroPaso,
      nAltPesoKg,
      nAltBrida,
      nAltDisco,
      nAltCostoUSD,
      nAltEstado,
      nAltEliminado,
    } = data;
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternador_crear",
        parameters: {
          in: [
            sAltCodigoSAP,
            Number(AlternadorMarca_Id),
            sAltModelo,
            sAltAislamiento,
            sAltSistemaExitacion,
            sAltTarjetaAVR,
            sAltGradoIP,
            sAltNormaTecnica,
            Number(nAltNroHilos),
            sAltNroPaso,
            nAltPesoKg,
            nAltBrida,
            nAltDisco,
            nAltCostoUSD,
            nAltEstado,
            nAltEliminado,
            user_id,
          ],
          out: ["@p_Alternador_Id"],
        },
      });

      return handleResponse(null, "Alternador creado exitosamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  createIntegradora: async (user_id, data) => {
    const {
      ModeloGE_Id,
      Motor_Id,
      Alternador_Id,
      Voltaje,
      Frecuencia,
      Fases,
      FactorPotencia,
      Altura,
      ITMA,
      PotenciaPrime,
      PotenciaStandBy,
      BridaDisco,
      CostoAbierto,
      CostoCabina,
      Factor1,
      Factor2,
      Factor1Cabina,
      Factor2Cabina,
      PrecioAbierto,
      PrecioCabina,
      TableroDescripcion,
      TableroMediciones,
      TableroProtecciones,
      TableroAccesorios,
      TableroOpcionales,
      MercadoId,
    } = data;

    logger.info("New combination in progress: ", data);

    // Validate required fields
    if (!ModeloGE_Id || !Motor_Id || !Alternador_Id) {
      return handleResponse(
        null,
        "ModeloGE_Id, Motor_Id y Alternador_Id son requeridos",
        false,
        400,
      );
    }

    try {
      const { outputParamsResult } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_crear",
        parameters: {
          in: [
            Number(ModeloGE_Id),
            Number(Motor_Id),
            Number(Alternador_Id),
            Number(Voltaje) || null,
            Number(Frecuencia) || null,
            Number(Fases) || null,
            Number(FactorPotencia) || null,
            Number(Altura) || null,
            Number(PotenciaPrime),
            Number(PotenciaStandBy),
            Number(ITMA) || null,
            BridaDisco || null,
            Number(CostoAbierto),
            Number(CostoCabina),
            Number(Factor1),
            Number(Factor2),
            Number(Factor1Cabina),
            Number(Factor2Cabina),
            Number(PrecioAbierto),
            Number(PrecioCabina),
            TableroDescripcion || null,
            TableroMediciones || null,
            TableroProtecciones || null,
            TableroAccesorios || null,
            TableroOpcionales || null,
            Number(MercadoId) || null,
          ],
          out: ["@p_Integradora_Id   INT"],
        },
      });

      const { outParam1: integradoraId } = outputParamsResult;

      if (!integradoraId) {
        return handleResponse(
          null,
          "Error al crear la combinación",
          false,
          500,
        );
      }

      return handleResponse(
        { integradoraId },
        "Combinación creada exitosamente",
        true,
        201,
      );
    } catch (error) {
      const { message } = error;
      logger.error("Error creating combination: ", message);
      return handleResponse(null, message, false, 500);
    }
  },
  updateIntegradora: async (user_id, id, data) => {
    const {
      ModeloGE_Id,
      Motor_Id,
      Alternador_Id,
      Voltaje,
      Frecuencia,
      Fases,
      FactorPotencia,
      Altura,
      ITMA,
      PotenciaPrime,
      PotenciaStandBy,
      BridaDisco,
      CostoAbierto,
      CostoCabina,
      Factor1,
      Factor2,
      Factor1Cabina,
      Factor2Cabina,
      PrecioAbierto,
      PrecioCabina,
      TableroDescripcion,
      TableroMediciones,
      TableroProtecciones,
      TableroAccesorios,
      TableroOpcionales,
      MercadoId,
    } = data;

    // Validaciones básicas
    if (!id) {
      return handleResponse(
        null,
        "Integradora_Id es requerido para la actualización",
        false,
        400,
      );
    }
    if (!ModeloGE_Id || !Motor_Id || !Alternador_Id) {
      return handleResponse(
        null,
        "ModeloGE_Id, Motor_Id y Alternador_Id son requeridos",
        false,
        400,
      );
    }

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_editar",
        parameters: {
          in: [
            Number(id),
            Number(ModeloGE_Id),
            Number(Motor_Id),
            Number(Alternador_Id),
            Number(Voltaje) || null,
            Number(Frecuencia) || null,
            Number(Fases) || null,
            Number(FactorPotencia) || null,
            Number(Altura) || null,
            Number(PotenciaPrime),
            Number(PotenciaStandBy),
            Number(ITMA) || null,
            BridaDisco || null,
            Number(CostoAbierto),
            Number(CostoCabina),
            Number(Factor1),
            Number(Factor2),
            Number(Factor1Cabina),
            Number(Factor2Cabina),
            Number(PrecioAbierto),
            Number(PrecioCabina),
            TableroDescripcion || null,
            TableroMediciones || null,
            TableroProtecciones || null,
            TableroAccesorios || null,
            TableroOpcionales || null,
            Number(MercadoId) || null,
          ],
          out: [],
        },
      });

      return handleResponse(
        { id },
        "Combinación actualizada exitosamente",
        true,
        200,
      );
    } catch (error) {
      logger.error("Error updating combination:", error);
      return handleResponse(null, error.message, false, 500);
    }
  },
  deleteModelAndIntegradora: async (user_id, modelo_id) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "modeloge_Int_eliminar",
        parameters: {
          in: [user_id, modelo_id],
        },
      });

      return handleResponse(null, "Modelo eliminado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default GeneratorSetModel;
