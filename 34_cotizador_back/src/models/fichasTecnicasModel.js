import { logger } from "#libs/logger.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";
import { executeStoredProcedure } from "./../libs/dbUtils.js";

export const TechnicalReportModel = {
  search: async (data) => {
    console.log("Data received in search:", data);
    try {
      const {
        modelo,
        voltaje,
        frecuencia,
        fases,
        potencia,
        altura,
        temperatura,
        powerThreshold,
        primePower,
        standbyPower,
      } = data;

      if (
        modelo === "Todos" &&
        (!voltaje ||
          !frecuencia ||
          !fases ||
          !potencia ||
          !powerThreshold ||
          !primePower ||
          !standbyPower)
      ) {
        return handleResponse(null, "Llenar todos los campos", false, 400);
      }

      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_ModelosFichasTecnicas_V2",
        parameters: {
          in: [
            modelo,
            data?.motorBrandPriceList || "Todos",
            data?.motorBrand || "Todos",
            data?.isMotorBrandUL, // 0: No, 1: Si, 2: Todos
            data?.emisionStandard || "Todos",
            data?.unity || "kw",
            data?.powerRange?.range?.isAll ? data?.powerRange?.range?.isAll ? 1 : 0 : 0,
            data?.powerRange?.regime || "STANDBY",
            data?.powerRange?.range?.min || 0,
            data?.powerRange?.range?.max || 1000,
            Number.parseInt(voltaje),
            Number.parseInt(frecuencia),
            Number.parseInt(fases),
            Number.parseFloat(potencia),
            Number.parseInt(altura),
            Number.parseInt(temperatura),
            Number.parseFloat(powerThreshold),
            primePower,
            standbyPower,
          ],
          out: [],
        },
      });

      const generatorSets = rows;

      const rangeDefault = {
        min: 0,
        max: 0,
      };

      const generatorSetPrimePowerRangeKw =
        primePower === "Todos"
          ? rangeDefault
          : {
              min:
                Number.parseFloat(primePower) -
                Number.parseFloat(primePower) * powerThreshold,
              max:
                Number.parseFloat(primePower) +
                Number.parseFloat(primePower) * powerThreshold,
            };

      const generatorSetStandByPowerRangeKw =
        primePower === "Todos"
          ? rangeDefault
          : {
              min:
                Number.parseFloat(standbyPower) -
                Number.parseFloat(standbyPower) * powerThreshold,
              max:
                Number.parseFloat(standbyPower) +
                Number.parseFloat(standbyPower) * powerThreshold,
            };

      const response = {
        generatorSets,
        derateRange: {
          prime: {
            kw: generatorSetPrimePowerRangeKw,
            kva: {
              min:
                generatorSetPrimePowerRangeKw.min / Number.parseFloat(potencia),
              max:
                generatorSetPrimePowerRangeKw.max / Number.parseFloat(potencia),
            },
          },
          standby: {
            kw: generatorSetStandByPowerRangeKw,
            kva: {
              min:
                generatorSetStandByPowerRangeKw.min /
                Number.parseFloat(potencia),
              max:
                generatorSetStandByPowerRangeKw.max /
                Number.parseFloat(potencia),
            },
          },
        },
      };

      return handleResponse(
        response,
        "Fichas tecnicas optenidas correctamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getByCombinationId: async (
    id,
    altura,
    temperatura,
    alternatorSwapped,
    alternatorSwappedId,
  ) => {
    try {
      const {
        result: [technicalReportRaw],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "Int_FichaTecnica_v2",
        parameters: {
          in: [
            Number.parseInt(id),
            Number.parseInt(altura),
            Number.parseInt(temperatura),
            alternatorSwapped ? 1 : 0,
            alternatorSwappedId,
          ],
          out: [],
        },
      });

      let technicalReportStandardEquipmentList = [];
      let technicalReportOptionalsList = [];

      let technicalReportTableroMeasuresList = [];
      let technicalReportTableroProtectionsList = [];

      try {
        const {
          result: [technicalReportStandardEquipmentRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_FichaTecnica_EquipamientoEstandar",
          parameters: {
            in: [Number.parseInt(id)],
            out: [],
          },
        });

        technicalReportStandardEquipmentList =
          technicalReportStandardEquipmentRaw || [];
      } catch (error) {
        logger.error(
          "Error al optener el equipamiento estandar de la ficha tecnica (accesorios)",
          {
            message: error.message,
            stack: error.stack,
          },
        );
      }

      try {
        const {
          result: [technicalReportOptionalsRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_FichaTecnica_Opcionales",
          parameters: {
            in: [Number.parseInt(id)],
            out: [],
          },
        });

        technicalReportOptionalsList = technicalReportOptionalsRaw || [];
      } catch (error) {
        logger.error("Error al optener los opcionales de la ficha tecnica", {
          message: error.message,
          stack: error.stack,
        });
      }

      // Mediciones del Tablero
      try {
        const {
          result: [technicalReportTableroMeasuresRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_FichaTecnica_Tablero_Mediciones",
          parameters: {
            in: [Number.parseInt(id)],
            out: [],
          },
        });

        technicalReportTableroMeasuresList =
          technicalReportTableroMeasuresRaw || [];
      } catch (error) {
        logger.error(
          "Error al optener las mediciones del tablero de la ficha tecnica",
          {
            message: error.message,
            stack: error.stack,
          },
        );
      }

      // Protecciones del Tablero
      try {
        const {
          result: [technicalReportTableroProtectionsRaw],
        } = await executeStoredProcedure({
          pool: db_pool,
          sp_name: "Int_FichaTecnica_Tablero_Protecciones",
          parameters: {
            in: [Number.parseInt(id)],
            out: [],
          },
        });

        technicalReportTableroProtectionsList =
          technicalReportTableroProtectionsRaw || [];
      } catch (error) {
        logger.error(
          "Error al optener las protecciones del tablero de la ficha tecnica",
          {
            message: error.message,
            stack: error.stack,
          },
        );
      }

      const uniqueTechnicalReport = technicalReportRaw[0] || {};

      const technicalReport = {
        ...uniqueTechnicalReport,
        standardEquipment: technicalReportStandardEquipmentList,
        optionals: technicalReportOptionalsList,
        tablero: {
          measures: technicalReportTableroMeasuresList,
          protections: technicalReportTableroProtectionsList,
        },
      };

      return handleResponse(
        technicalReport,
        "Ficha tecnica obtenida correctamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};
