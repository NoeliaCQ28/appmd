import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";

const MarginModel = {
  find: async (data) => {
    try {
      const {
        result: [margins],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "margen_buscar",
        parameters: {
          in: [data.generatorSetId, data.motorBrandId, data.marketId],
        },
      });

      if (!margins || margins.length === 0) {
        return handleResponse(null, "No se encontraron margenes", false, 404);
      }

      const margin = margins[0];

      const marginMapped = {
        motor: {
          brand: margin.sMotMarca,
          brandId: margin.MotorMarca_Id,
        },
        generatorSet: {
          name: margin.sModNombre,
          id: margin.ModeloGE_Id,
        },
        market: {
          name: margin.sMercadoNombre,
          id: margin.nMrgMercadoId,
        },
        factors: {
          margin: Number(margin.nMrgFactorMargen),
          discount: Number(margin.nMrgFactorDescuento),
        },
      };

      return handleResponse(marginMapped, "Margenes obtenidos correctamente");
    } catch (error) {
      return handleResponse(
        null,
        `Error al obtener margenes: ${error.message}`,
        false,
        500,
      );
    }
  },
};

export default MarginModel;
