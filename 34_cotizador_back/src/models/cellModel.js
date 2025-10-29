import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const CellModel = {
  getParams: async () => {
    try {
      const {
        result: [brands],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdamarca_listar",
        parameters: {
          in: [],
        },
      });

      const {
        result: [types],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_tipo_listar",
        parameters: {
          in: [],
        },
      });

      const {
        result: [models],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdamodelo_listar",
        parameters: {
          in: [],
        },
      });

      const typesMapped = types.map((type) => {
        return type.sCelTipo;
      });

      return handleResponse(
        {
          brands: brands,
          types: typesMapped,
          models: models,
        },
        "Datos cargados correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCells: async ({ brand, model, type }) => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_buscar",
        parameters: {
          in: [brand, model, type],
        },
      });

      return handleResponse(cells, "Datos cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAllCells: async () => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_buscar",
        parameters: {
          in: ["Todos", "Todos", "Todos"],
        },
      });

      return handleResponse(cells, "Celdas cargadas correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (user_id, data) => {
    const {
      CeldaMarca_Id,
      nCelModeloId,
      sCelDescripcion,
      sCelCodSAP,
      sCelTipo,
      sCelDetalle,
      sCelUnidad,
      nCelPrecio,
      nCelStock,
    } = data;

    try {
      const {
        result: [celdas],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_crear",
        parameters: {
          in: [
            Number(CeldaMarca_Id),
            Number(nCelModeloId),
            sCelDescripcion,
            sCelCodSAP,
            sCelTipo,
            sCelDetalle,
            sCelUnidad,
            nCelPrecio,
            nCelStock,
          ],
          out: ["@p_Celda_Id"],
        },
      });

      return handleResponse(celdas, "La celda fue creada correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  update: async (id, user_id, data) => {
    const {
      CeldaMarca_Id,
      nCelModeloId,
      sCelDescripcion,
      sCelCodSAP,
      sCelTipo,
      sCelDetalle,
      sCelUnidad,
      nCelPrecio,
      nCelStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_actualizar",
        parameters: {
          in: [
            id,
            Number(CeldaMarca_Id),
            Number(nCelModeloId),
            sCelDescripcion,
            sCelCodSAP,
            sCelTipo,
            sCelDetalle,
            sCelUnidad,
            nCelPrecio,
            nCelStock,
          ],
        },
      });

      return handleResponse(null, "La celda fue actualizada correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  delete: async (id) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celda_eliminar",
        parameters: {
          in: [Number(id)],
        },
      });

      return handleResponse(null, "La celda fue eliminada correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  getAllAccesorios: async () => {
    try {
      const {
        result: [accesorios],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdaaccesorio_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(accesorios, "Accesorios cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  createAccesorio: async (user_id, data) => {
    const {
      CeldaMarca_Id,
      sCelAccDescripcion,
      sCelAccCodSAP,
      sCelAccDetalle,
      sCelAccUnidad,
      nCelAccPrecio,
      nCelAccStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdaaccesorio_crear",
        parameters: {
          in: [
            Number(CeldaMarca_Id),
            sCelAccDescripcion,
            sCelAccCodSAP,
            sCelAccDetalle,
            sCelAccUnidad,
            Number.parseFloat(nCelAccPrecio),
            Number.parseInt(nCelAccStock),
            Number(user_id),
          ],
        },
      });

      return handleResponse(null, "El accesorio fue creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  updateAccesorio: async (id, user_id, data) => {
    const {
      sCelAccDescripcion,
      sCelAccCodSAP,
      sCelAccDetalle,
      sCelAccUnidad,
      nCelAccPrecio,
      nCelAccStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdaaccesorio_editar",
        parameters: {
          in: [
            Number.parseInt(id),
            sCelAccDescripcion,
            sCelAccCodSAP,
            sCelAccDetalle,
            sCelAccUnidad,
            Number.parseFloat(nCelAccPrecio),
            Number.parseInt(nCelAccStock),
            Number(user_id),
          ],
        },
      });

      return handleResponse(null, "El accesorio fue actualizado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  deleteAccesorio: async (id, user_id) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "celdaaccesorio_eliminar",
        parameters: {
          in: [
            Number.parseInt(id),
            Number(user_id)
          ],
        },
      });

      return handleResponse(null, "El accesorio fue eliminado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default CellModel;
