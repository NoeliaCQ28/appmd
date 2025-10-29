import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";
import { parseFloatOrNull, parseIntOrNull } from "#libs/utils.js";
import db_pool from "../config/db.js";

const OpcionalesModel = {
  getByIntegradoraId: async (integradoraId) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opc_listarxIntegradora",
        parameters: {
          in: [integradoraId],
        },
      });

      return handleResponse(rows, "Accesorios consultados con exito");
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
        sp_name: "opcionalesge_listar_C",
        parameters: {
          in: [0],
          out: [],
        },
      });

      return handleResponse(
        rows,
        "Componentes opcionales de GE listados exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getById: async ({ id }) => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_listar_C",
        parameters: {
          in: [id],
          out: [],
        },
      });

      return handleResponse(
        rows,
        "Componente opcional de GE encontrado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (user_id, data) => {
    try {
      const {
        nOpcTipo,
        sOpcFabricacion,
        sOpcNombre,
        sOpcDescripcion,
        nOpcAplicacion,
        sOpcMarca,
        nOpcCosto,
        nOpcValorEstandar,
        sOpcMarcaGE,
        sOpcModeloGE,
        nOpcMargenVariable,
        nOpcEstado,
      } = data;

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_crear",
        parameters: {
          in: [
            parseIntOrNull(nOpcTipo),
            sOpcFabricacion,
            sOpcNombre,
            sOpcDescripcion,
            nOpcAplicacion,
            sOpcMarca,
            parseFloatOrNull(nOpcCosto),
            nOpcValorEstandar ? 1 : 0,
            sOpcMarcaGE,
            sOpcModeloGE,
            parseFloatOrNull(nOpcMargenVariable / 100),
            parseInt(nOpcEstado),
            parseIntOrNull(user_id),
          ],
        },
      });

      return handleResponse(
        null,
        "Accesorio de Grupo Electrogeno creado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  update: async (user_id, id, data) => {
    const {
      nOpcTipo,
      sOpcFabricacion,
      sOpcNombre,
      sOpcDescripcion,
      nOpcAplicacion,
      sOpcMarca,
      nOpcCosto,
      nOpcValorEstandar,
      sOpcMarcaGE,
      sOpcModeloGE,
      nOpcMargenVariable,
      nOpcEstado,
    } = data;

    try {
      const {
        result: [rowsExistsOptionalGE],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_listar_C",
        parameters: {
          in: [id],
        },
      });

      if (!rowsExistsOptionalGE || rowsExistsOptionalGE.length === 0) {
        return handleResponse(
          null,
          "Accesorio de grupo electrogeno no encontrado",
          false,
          404,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_editar",
        parameters: {
          in: [
            id,
            parseIntOrNull(nOpcTipo),
            sOpcFabricacion,
            sOpcNombre,
            sOpcDescripcion,
            nOpcAplicacion,
            sOpcMarca,
            parseFloatOrNull(nOpcCosto),
            nOpcValorEstandar ? 1 : 0,
            sOpcMarcaGE,
            sOpcModeloGE,
            parseFloatOrNull(nOpcMargenVariable / 100),
            parseInt(nOpcEstado),
            parseIntOrNull(user_id),
          ],
        },
      });

      return handleResponse(
        null,
        "Componente adicional de GE editado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  delete: async (user_id, opcionalGEId) => {
    try {
      const {
        result: [rowsExistsOptionalGE],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_listar_C",
        parameters: {
          in: [opcionalGEId],
        },
      });

      if (!rowsExistsOptionalGE || rowsExistsOptionalGE.length === 0) {
        return handleResponse(
          null,
          "Componente adicional de GE no encontrado",
          false,
          404,
        );
      }

      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_eliminar",
        parameters: {
          in: [opcionalGEId, user_id],
        },
      });

      return handleResponse(
        null,
        "Componente adicional de GE eliminado exitosamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAllBrands: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_marca_listarC",
        parameters: {
          in: [],
          out: [],
        },
      });

      return handleResponse(
        rows,
        "Marcas de accesorios de grupos electrogenos listadas con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAllTypes: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "opcionalesge_tipos_listarC",
        parameters: {
          in: [],
          out: [],
        },
      });

      return handleResponse(
        rows,
        "Tipos de accesorios de grupos electrogenos listados con éxito",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default OpcionalesModel;
