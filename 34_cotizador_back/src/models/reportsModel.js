import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const ReportsModel = {
  getCardResume: async () => {
    try {
      const {
        result: [quotesQuantityResume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizacion_resumen_conteo",
        parameters: {
          in: [],
        },
      });

      const {
        result: [customerQuantityResume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cliente_resumen_conteo",
        parameters: {
          in: [],
        },
      });

      const {
        result: [sellerQuantityResume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "ejecutivo_resumen_conteo",
        parameters: {
          in: [],
        },
      });

      const {
        result: [salesQuantityResume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cotizacion_ventas_resumen_conteo",
        parameters: {
          in: [],
        },
      });

      const resume = {
        quotesQuantityResume,
        customerQuantityResume,
        sellerQuantityResume,
        salesQuantityResume,
      };

      return handleResponse(resume, "Resumen creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getExecutiveReport: async (filters) => {
    try {
      const {
        result: [resume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "reporte_por_ejecutivos",
        parameters: {
          in: [
            filters.typeOfQuoteId || 0,
            filters.marketId || 0,
            filters.executiveId || 0,
          ],
        },
      });

      return handleResponse(resume, "Reporte creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getQuoteReport: async (filters) => {
    try {
      const {
        result: [resume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "reporte_cotizaciones",
        parameters: {
          in: [
            filters.startDate,
            filters.endDate,
            filters.typeOfQuoteId || 0,
            filters.marketId || 0,
            filters.quoteState || "Todos",
          ],
        },
      });

      return handleResponse(resume, "Reporte creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCustomerReport: async (filters) => {
    try {
      const {
        result: [resume],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "reporte_clientes",
        parameters: {
          in: [filters.source || "Todos", filters.industry || "Todos"],
        },
      });

      return handleResponse(resume, "Reporte creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default ReportsModel;
