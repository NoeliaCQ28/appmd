import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { logger } from "#libs/logger.js";
import db_pool from "./../../config/db.js";

const DEFAULT_VALUES = {
  VOLTAGE: 220,
  FREQUENCY: 60,
  PHASES: 3,
  POWER_FACTOR: 0.8,
  ALTITUDE: 1000,
  TEMPERATURE: 0,
  NOISE_REDUCTION: true,
};

const SEARCH_MODES = {
  ALL: "Todos",
  SPECIFIC: "specific",
  NATIONAL: 1,
};

const REQUIRED_FIELDS_FOR_ALL_SEARCH = [
  "voltaje",
  "frecuencia",
  "fases",
  "factorPotencia",
  "altura",
  "temperatura",
  "insonoro",
];

/**
 * Generator Set Model for handling generator-related operations
 */
const GeneratorSetModel = {
  /**
   * Retrieves all interruptors from the database
   * @returns {Promise<Object>} Response with interruptors data or error
   */
  /**
   * Retrieves all interruptors from the database
   * @returns {Promise<Object>} Response with interruptors data or error
   */
  getAllITMs: async () => {
    try {
      const {
        result: [alternators],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "itm_listarC",
        parameters: {
          in: [0],
        },
      });

      if (!alternators || alternators.length === 0) {
        return handleResponse([], "No se encontraron interruptores", true, 200);
      }

      return handleResponse(alternators, "Interruptores recuperados con éxito");
    } catch (error) {
      logger.error(`Error retrieving interruptores: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al recuperar interruptores: ${error.message}`,
        false,
        500,
      );
    }
  },

  /**
   * Retrieves all ITMs with price according combination from the database
   * @returns {Promise<Object>} Response with ITMs data or error
   */
  /**
   * Retrieves all ITMs from the database
   * @returns {Promise<Object>} Response with ITMs data or error
   */
  getAllITMsByCombination: async ({ integradoraId }) => {
    try {
      const {
        result: [ITMs],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "itm_listarxCombinacion",
        parameters: {
          in: [0, integradoraId],
        },
      });

      if (!ITMs || ITMs.length === 0) {
        return handleResponse([], "No se encontraron interruptores", true, 200);
      }

      return handleResponse(ITMs, "ITMs recuperados con éxito");
    } catch (error) {
      logger.error(`Error retrieving interruptores: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al recuperar interruptores: ${error.message}`,
        false,
        500,
      );
    }
  },

  getITMById: async (id) => {
    try {
      const {
        result: [interruptores],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "itm_listarC",
        parameters: {
          in: [id],
        },
      });

      if (!interruptores || interruptores.length === 0) {
        return handleResponse([], "No se encontro el interruptor", true, 200);
      }

      return handleResponse(
        interruptores[0],
        "Interruptor recuperado con éxito",
      );
    } catch (error) {
      logger.error(`Error al recuperar el interruptor: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al recuperar el interruptor: ${error.message}`,
        false,
        500,
      );
    }
  },

  /**
   * Retrieves all alternators from the database
   * @returns {Promise<Object>} Response with alternators data or error
   */
  /**
   * Retrieves all alternators from the database
   * @returns {Promise<Object>} Response with alternators data or error
   */
  getAllAlternators: async () => {
    try {
      const {
        result: [alternators],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternador_listarC",
        parameters: {
          in: [0],
        },
      });

      if (!alternators || alternators.length === 0) {
        return handleResponse([], "No se encontraron alternadores", true, 200);
      }

      return handleResponse(alternators, "Alternadores recuperados con éxito");
    } catch (error) {
      logger.error(`Error retrieving alternators: ${error.message}`, { error });
      return handleResponse(
        null,
        `Error al recuperar alternadores: ${error.message}`,
        false,
        500,
      );
    }
  },

  /**
   * Retrieves all alternators with price according combination from the database
   * @returns {Promise<Object>} Response with alternators data or error
   */
  /**
   * Retrieves all alternators from the database
   * @returns {Promise<Object>} Response with alternators data or error
   */
  getAllAlternatorsByCombination: async ({ integradoraId }) => {
    try {
      const {
        result: [alternators],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternador_listarxCombinacion",
        parameters: {
          in: [0, integradoraId],
        },
      });

      if (!alternators || alternators.length === 0) {
        return handleResponse([], "No se encontraron alternadores", true, 200);
      }

      return handleResponse(alternators, "Alternadores recuperados con éxito");
    } catch (error) {
      logger.error(`Error retrieving alternators: ${error.message}`, { error });
      return handleResponse(
        null,
        `Error al recuperar alternadores: ${error.message}`,
        false,
        500,
      );
    }
  },

  getAlternatorById: async (id) => {
    try {
      const {
        result: [alternators],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "alternador_listarC",
        parameters: {
          in: [id],
        },
      });

      if (!alternators || alternators.length === 0) {
        return handleResponse([], "No se encontro el alternador", true, 200);
      }

      return handleResponse(alternators[0], "Alternador recuperado con éxito");
    } catch (error) {
      logger.error(`Error al recuperar el alternador: ${error.message}`, {
        error,
      });
      return handleResponse(
        null,
        `Error al recuperar el alternador: ${error.message}`,
        false,
        500,
      );
    }
  },

  /**
   * Normalizes null/undefined values to "Todos"
   * @param {*} value - Value to normalize
   * @returns {string} Normalized value
   */
  _normalizePowerValue: (value) => {
    return value === null || value === undefined ? SEARCH_MODES.ALL : value;
  },

  /**
   * Validates required fields for "Todos" search mode
   * @param {Object} params - Search parameters
   * @returns {Object|null} Validation error response or null if valid
   */
  _validateRequiredFields: (params) => {
    const missingFields = REQUIRED_FIELDS_FOR_ALL_SEARCH.filter(
      (field) => params[field] == null,
    );

    if (missingFields.length > 0) {
      return handleResponse(
        null,
        `Campos requeridos faltantes: ${missingFields.join(", ")}`,
        false,
        400,
      );
    }
    return null;
  },

  /**
   * Applies default values to search parameters
   * @param {Object} params - Original parameters
   * @returns {Object} Parameters with default values applied
   */
  _applyDefaultValues: (params) => {
    return {
      ...params,
      voltaje: params.voltaje || DEFAULT_VALUES.VOLTAGE,
      frecuencia: params.frecuencia || DEFAULT_VALUES.FREQUENCY,
      fases: params.fases || DEFAULT_VALUES.PHASES,
      factorPotencia: params.factorPotencia || DEFAULT_VALUES.POWER_FACTOR,
      altura: params.altura || DEFAULT_VALUES.ALTITUDE,
      temperatura: params.temperatura || DEFAULT_VALUES.TEMPERATURE,
      insonoro:
        params.insonoro !== undefined
          ? params.insonoro
          : DEFAULT_VALUES.NOISE_REDUCTION,
    };
  },

  _getAverageDerate: (derateValues) => {
    const deratePrimeSafeLength = Math.max(
      derateValues?.filter((a) => Number(a.prime.kw) > 0).length || 0,
      1,
    );
    const derateStandbySafeLength = Math.max(
      derateValues?.filter((a) => Number(a.standby.kw) > 0).length || 0,
      1,
    );

    const prime = {
      kw: Number(
        derateValues?.reduce((acc, a) => acc + Number(a.prime.kw), 0) /
        deratePrimeSafeLength,
      ).toFixed(2),
      kva: Number(
        derateValues?.reduce((acc, a) => acc + Number(a.prime.kva), 0) /
        deratePrimeSafeLength,
      ).toFixed(2),
    };

    const standby = {
      kw: Number(
        derateValues?.reduce((acc, a) => acc + Number(a.standby.kw), 0) /
        derateStandbySafeLength,
      ).toFixed(2),
      kva: Number(
        derateValues?.reduce((acc, a) => acc + Number(a.standby.kva), 0) /
        derateStandbySafeLength,
      ).toFixed(2),
    };

    const averageDerate = {
      prime: {
        kw: Number.parseFloat(prime.kw),
        kva: Number.parseFloat(prime.kva),
      },
      standby: {
        kw: Number.parseFloat(standby.kw),
        kva: Number.parseFloat(standby.kva),
      },
    };

    return averageDerate;
  },

  _getDerateRange: (
    primePower,
    standbyPower,
    powerThreshold,
    factorPotencia,
    derateValues,
  ) => {
    const primePowerSatinized =
      primePower === SEARCH_MODES.ALL
        ? Math.min(
          ...(derateValues?.map((a) => a.prime.kw).filter((a) => a > 0) ||
            []),
        )
        : primePower;

    const standbyPowerSatinized =
      standbyPower === SEARCH_MODES.ALL
        ? Math.min(
          ...(derateValues?.map((a) => a.standby.kw).filter((a) => a > 0) ||
            []),
        )
        : standbyPower;

    const derateRange = {
      prime: {
        kw: {
          min: Number(
            Number(
              primePowerSatinized -
              (powerThreshold / 100) * primePowerSatinized,
            ).toFixed(2),
          ),
          max: Number(
            Number(
              primePowerSatinized +
              (powerThreshold / 100) * primePowerSatinized,
            ).toFixed(2),
          ),
        },
        kva: {
          min: Number(
            Number(
              primePowerSatinized / factorPotencia -
              (powerThreshold / 100) * primePowerSatinized,
            ).toFixed(2),
          ),
          max: Number(
            Number(
              primePowerSatinized / factorPotencia +
              (powerThreshold / 100) * primePowerSatinized,
            ).toFixed(2),
          ),
        },
      },
      standby: {
        kw: {
          min: Number(
            Number(
              standbyPowerSatinized -
              (powerThreshold / 100) * standbyPowerSatinized,
            ).toFixed(2),
          ),
          max: Number(
            Number(
              standbyPowerSatinized +
              (powerThreshold / 100) * standbyPowerSatinized,
            ).toFixed(2),
          ),
        },
        kva: {
          min: Number(
            Number(
              standbyPowerSatinized / factorPotencia -
              (powerThreshold / 100) * standbyPowerSatinized,
            ).toFixed(2),
          ),
          max: Number(
            Number(
              standbyPowerSatinized / factorPotencia +
              (powerThreshold / 100) * standbyPowerSatinized,
            ).toFixed(2),
          ),
        },
      },
    };

    return derateRange;
  },

  _parseCombination: (combination, temperatura, insonoro) => {
    return {
      ...combination,
      nIntAltura: Number(combination.nIntAltura) || 0,
      nIntTemperatura: Number(temperatura) || 0,
      nIntInsonoro: insonoro,
      nIntSileciadorTipo: !insonoro ? 1 : 2, // 1 for Industrial, 2 for Residential
      sIntSileciadorTipo: !insonoro ? "Industrial" : "Residencial",
      nIntSileciadorPermiteCambio: !insonoro,
      nModPesoKgAbierto: Number(combination.nModPesoKgAbierto) || 0,
      nModPesoKgInsonoro: Number(combination.nModPesoKgInsonoro) || 0,
      nAltPesoKg: Number(combination.nAltPesoKg) || 0,
      nAltCostoUSD: Number(combination.nAltCostoUSD) || 0,
      nAltPrecioUSD: Number(combination.nAltPrecioUSD) || 0,
      nIntCostoGEAbierto: Number(combination.nIntCostoGEAbierto) || 0,
      nIntCostoGECabina: Number(combination.nIntCostoGECabina) || 0,
      nIntPrecioGEAbierto: Number(combination.nIntPrecioGEAbierto) || 0,
      nIntPrecioGECabina: Number(combination.nIntPrecioGECabina) || 0,
      nIntFP: Number(combination.nIntFP) || 0,
      nIntPrimeKW: Number(combination.nIntPrimeKW) || 0,
      nIntStandBy: Number(combination.nIntStandBy) || 0,
      nIntCostoTotalUSD: Number(combination.nIntCostoTotalUSD) || 0,
      nIntPrecioTotalUSD: Number(combination.nIntPrecioTotalUSD) || 0,
      nIntPesoTotalKg: Number(combination.nIntPesoTotalKg) || 0,
      PrimeKW: Number(combination.PrimeKW) || 0,
      PrimeKVA: Number(combination.PrimeKVA) || 0,
      StandByKW: Number(combination.StandByKW) || 0,
      StandByKVA: Number(combination.StandByKVA) || 0,
      CorrientePrimeA: Number(combination.CorrientePrimeA) || 0,
      CorrienteStandByA: Number(combination.CorrienteStandByA) || 0,
      sTipoFabricacion: combination?.sTipoFabricacion,
    };
  },

  _getExtraDetails: () => {
    return {
      sRegimen: "STAND BY",
      nIntCantidad: 1,
      accessories: [],
      operativeCosts: {
        shipping: {
          isPresent: false,
          ammount: 0,
        },
        startup: {
          isPresent: false,
          amount: 0,
        },
      },
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
        }

      },
    };
  },

  /**
   * Searches for generator sets based on specified criteria
   * @param {Object} searchParams - Search parameters
   * @param {string} [searchParams.modelo="Todos"] - Model to search for
   * @param {number} [searchParams.voltaje] - Voltage requirement
   * @param {number} [searchParams.frecuencia] - Frequency requirement
   * @param {number} [searchParams.fases] - Number of phases
   * @param {number} [searchParams.factorPotencia] - Power factor
   * @param {number} [searchParams.altura] - Altitude
   * @param {number} [searchParams.temperatura] - Temperature
   * @param {boolean} [searchParams.insonoro] - Sound insulation requirement
   * @param {string} [searchParams.primePower="Todos"] - Prime power requirement
   * @param {string} [searchParams.standbyPower="Todos"] - Standby power requirement
   * @returns {Promise<Object>} Response with search results or error
   */
  getAllCombinations: async (params) => {
    try {
      let {
        modelo = SEARCH_MODES.ALL,
        motorMarca = SEARCH_MODES.ALL,
        voltaje,
        frecuencia,
        fases,
        factorPotencia,
        altura,
        temperatura,
        insonoro,
        powerThreshold = 10, // Default threshold for power range
        primePower = SEARCH_MODES.ALL,
        standbyPower = SEARCH_MODES.ALL,
        marketId = SEARCH_MODES.NATIONAL,
      } = params;

      // Normalize power values
      primePower = GeneratorSetModel._normalizePowerValue(primePower);
      standbyPower = GeneratorSetModel._normalizePowerValue(standbyPower);

      // Validate required fields when searching all models

      const validationError = GeneratorSetModel._validateRequiredFields({
        voltaje,
        frecuencia,
        fases,
        factorPotencia,
        altura,
        temperatura,
        insonoro,
        marketId,
      });

      if (validationError) return validationError;

      const {
        result: [combinationsRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_buscar_combinaciones_base",
        parameters: {
          in: [
            modelo,
            motorMarca,
            voltaje,
            frecuencia,
            fases,
            factorPotencia,
            altura,
            temperatura,
            insonoro,
            marketId,
          ],
        },
      });

      const combinations =
        combinationsRaw?.map((combination) => {
          return {
            ...GeneratorSetModel._parseCombination(
              combination,
              temperatura,
              insonoro,
            ),
            nIntDiasParaEntrega: 7,
            nIntDescuentoPorcentaje: 0,
            nIntMargenExportacionPorcentaje: 0,
          };
        }) || [];

      // Filter based on prime and standby power if specified
      const combinationsFilteredByPower = combinations?.filter(
        (combination) => {
          const primeKW = combination.PrimeKW;
          const standbyKW = combination.StandByKW;

          // Check if prime power is within the specified range
          const isPrimePowerValid =
            primePower === SEARCH_MODES.ALL ||
            (primeKW >= primePower - (powerThreshold / 100) * primePower &&
              primeKW <= primePower + (powerThreshold / 100) * primePower);

          // Check if standby power is within the specified range
          const isStandbyPowerValid =
            standbyPower === SEARCH_MODES.ALL ||
            (standbyKW >=
              standbyPower - (powerThreshold / 100) * standbyPower &&
              standbyKW <=
              standbyPower + (powerThreshold / 100) * standbyPower);

          return isPrimePowerValid && isStandbyPowerValid;
        },
      );

      const derateValues = combinationsFilteredByPower?.map((combination) => {
        return {
          prime: {
            kw: combination.PrimeKW,
            kva: combination.PrimeKVA,
          },
          standby: {
            kw: combination.StandByKW,
            kva: combination.StandByKVA,
          },
        };
      });

      const averageDerate = GeneratorSetModel._getAverageDerate(derateValues);

      const derateRange = GeneratorSetModel._getDerateRange(
        primePower,
        standbyPower,
        powerThreshold,
        factorPotencia,
        derateValues,
      );

      const derates = {
        averageDerate,
        derateRange,
      };

      const combinationsGroupedByIntKey =
        combinationsFilteredByPower?.reduce((acc, combination) => {
          const intKey = combination.sIntKey;
          if (!acc[intKey]) {
            acc[intKey] = [];
          }
          acc[intKey].push({
            ...combination,
            ...GeneratorSetModel._getExtraDetails(),
          });
          return acc;
        }, {}) || {};

      // Transform to the desired array format
      const generatorSetsFormattedData = Object.keys(
        combinationsGroupedByIntKey,
      ).map((intKey) => ({
        sIntKey: intKey,
        sModNombre: combinationsGroupedByIntKey[intKey][0].sModNombre,
        sMotModelo: combinationsGroupedByIntKey[intKey][0].sMotModelo,
        sMotMarca: combinationsGroupedByIntKey[intKey][0].sMotMarca,
        sMotMarcaVisual: combinationsGroupedByIntKey[intKey][0].sMotMarcaVisual,
        nIntITMA: combinationsGroupedByIntKey[intKey][0].nIntITMA,
        combinations: combinationsGroupedByIntKey[intKey],
      }));

      const response = {
        generatorSets: generatorSetsFormattedData,
        derates,
      };

      const message =
        modelo === SEARCH_MODES.ALL
          ? "Búsqueda de todos los modelos completada"
          : `Búsqueda del modelo ${modelo} completada`;

      return handleResponse(response, message, true, 200);
    } catch (error) {
      logger.error(`Error during generator set search: ${error.message}`);
      return handleResponse(
        null,
        `Error en la búsqueda: ${error.message}`,
        false,
        500,
      );
    }
  },
  /**
   *
   * @param {Object} params
   * @param {number} integradoraId
   * @returns {Promise<Object>} Response with combinations for the specified integradora or error
   */
  getCombinationByIntegradora: async (params, integradoraId) => {
    try {
      if (!integradoraId) {
        return handleResponse(
          null,
          "ID de integradora no especificado",
          false,
          400,
        );
      }

      const combinationsResponse =
        await GeneratorSetModel.getAllCombinations(params);

      let combinations = combinationsResponse.data || [];

      if (
        !combinations.generatorSets ||
        combinations.generatorSets.length === 0
      ) {
        return handleResponse(
          null,
          "No se encontraron combinaciones para el modelo especificado",
          false,
          404,
        );
      }

      const filteredCombinations = combinations.generatorSets
        ?.map((group) => {
          const filteredCombination = group.combinations?.find(
            (combination) =>
              Number(combination.IntegradoraId) === integradoraId,
          );

          delete group.combinations;

          return filteredCombination
            ? {
              ...group,
              combination: filteredCombination,
            }
            : null;
        })
        .filter((group) => group !== null);

      if (filteredCombinations.length === 0 || !filteredCombinations) {
        return handleResponse(
          null,
          "No se encontraron combinaciones para la integradora especificada",
          false,
          404,
        );
      }

      combinations = filteredCombinations[0];

      return handleResponse(
        {
          generatorSet: combinations,
          derates: combinationsResponse.data.derates || {},
          derateRange: combinationsResponse.data.derateRange || {},
        },
        "Combinaciones recuperadas con éxito",
        true,
        200,
      );
    } catch (error) {
      logger.error(
        `Error durante la búsqueda de combinaciones: ${error.message}`,
      );
      return handleResponse(
        null,
        `Error en la búsqueda: ${error.message}`,
        false,
        500,
      );
    }
  },
  /**
   *
   * @param {Object} params
   * @param {number} integradoraId
   * @param {number} alternadorId
   * @returns {Promise<Object>} Response with the result of the simulation or error
   */
  changeConfiguration: async (params, integradoraId, configuration) => {
    try {
      const {
        modelo = SEARCH_MODES.ALL,
        insonoro,
        altura,
        temperatura,
        marketId = SEARCH_MODES.NATIONAL,
      } = params;

      if (modelo === SEARCH_MODES.ALL) {
        return handleResponse(
          null,
          "Modelo no especificado para búsqueda de combinaciones",
          false,
          400,
        );
      }

      if (!integradoraId) {
        return handleResponse(
          null,
          "ID de integradora no especificado",
          false,
          400,
        );
      }

      if (!configuration.alternatorId) {
        return handleResponse(
          null,
          "ID de alternador no especificado",
          false,
          400,
        );
      }

      /**
       * Cambio de alternador e ITM de una combinación base
       */
      const {
        result: [combinationRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_configuracion",
        parameters: {
          in: [
            Number(integradoraId),
            Number(temperatura),
            Number(altura),
            Number(insonoro),
            Number(marketId),
            Number(configuration.itmId),
            Number(configuration.alternatorId),
          ],
        },
      });

      if (!combinationRaw || !combinationRaw[0]) {
        return handleResponse(
          null,
          "No se pudo realizar el cambio de configuración",
          false,
          404,
        );
      }

      const combination = combinationRaw[0];

      const combinationFormated = GeneratorSetModel._parseCombination(
        combination,
        temperatura,
        insonoro,
      );

      const combinationFormat = {
        sIntKey: combination.sIntKey,
        combination: combinationFormated,
      };

      return handleResponse(
        combinationFormat,
        "Cambio de configuración realizado con éxito",
        true,
        200,
      );
    } catch (error) {
      logger.error(
        `Error durante el cambio de configuración: ${error.message}`,
      );
      return handleResponse(
        null,
        `Error en el cambio de configuración: ${error.message}`,
        false,
        500,
      );
    }
  },
};

export default GeneratorSetModel;
