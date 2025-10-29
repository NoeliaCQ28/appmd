import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const TransformerModel = {
  getParams: async () => {
    try {
      const {
        result: [brands],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformadormarca_listar",
        parameters: {
          in: [],
        },
      });

      const {
        result: [types],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_tipo_listar",
        parameters: {
          in: [],
        },
      });

      const brandsMapped = brands.map((brand) => {
        return {
          TransformadorMarca_Id: brand.TransformadorMarca_Id,
          sTraMarDescripcion: brand.sTraMarDescripcion,
        };
      });

      const typesMapped = types.map((type) => {
        return type.sTraTipo;
      });

      return handleResponse(
        {
          brands: brandsMapped,
          types: typesMapped,
        },
        "Datos cargados correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getTransformers: async ({ brand, type }) => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_buscar",
        parameters: {
          in: [brand, type],
        },
      });

      return handleResponse(cells, "Datos cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAllTransformers: async () => {
    try {
      const {
        result: [cells],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_buscar",
        parameters: {
          in: ["Todos", "Todos"],
        },
      });

      return handleResponse(cells, "Datos cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  create: async (user_id, data) => {
    const {
      TransformadorMarca_Id,
      sTraNombre,
      sTraDescripcion,
      sTraCodigoSAP,
      sTraTipo,
      sTraUnidad,
      nTraPrecio,
      nTraStock,
    } = data;

    try {
      const {
        result: [transformadores],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_crear",
        parameters: {
          in: [
            Number(TransformadorMarca_Id),
            sTraNombre,
            sTraDescripcion,
            sTraCodigoSAP,
            sTraTipo,
            sTraUnidad,
            nTraPrecio,
            nTraStock,
          ],
          out: ["@p_Transformador_Id"],
        },
      });

      return handleResponse(
        transformadores,
        "El transformador fue creado correctamente"
      );
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
        sp_name: "transformadoraccesorio_listar",
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
      sTraAccDescripcion,
      sTraAccCodSAP,
      sTraAccTipo,
      sTraAccUnidad,
      nTraAccPrecio,
      nTraAccStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformadoraccesorio_crear",
        parameters: {
          in: [
            sTraAccDescripcion,
            sTraAccCodSAP,
            sTraAccTipo,
            sTraAccUnidad,
            Number.parseFloat(nTraAccPrecio),
            Number.parseInt(nTraAccStock),
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
      sTraAccDescripcion,
      sTraAccCodSAP,
      sTraAccTipo,
      sTraAccUnidad,
      nTraAccPrecio,
      nTraAccStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformadoraccesorio_editar",
        parameters: {
          in: [
            Number.parseInt(id),
            sTraAccDescripcion,
            sTraAccCodSAP,
            sTraAccTipo,
            sTraAccUnidad,
            Number.parseFloat(nTraAccPrecio),
            Number.parseInt(nTraAccStock),
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
        sp_name: "transformadoraccesorio_eliminar",
        parameters: {
          in: [Number.parseInt(id), Number.parseInt(user_id)],
        },
      });

      return handleResponse(null, "El accesorio fue eliminado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  update: async (id, user_id, data) => {
    const {
      TransformadorMarca_Id,
      sTraDescripcion,
      sTraNombre,
      sTraCodigoSAP,
      sTraTipo,
      sTraUnidad,
      nTraPrecio,
      nTraStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_actualizar",
        parameters: {
          in: [
            Number(id),
            Number(TransformadorMarca_Id),
            sTraNombre,
            sTraDescripcion,
            sTraCodigoSAP,
            sTraTipo,
            sTraUnidad,
            nTraPrecio,
            nTraStock,
          ],
        },
      });

      return handleResponse(
        null,
        "El transformador fue actualizado correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  delete: async (id) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "transformador_eliminar",
        parameters: {
          in: [Number(id)],
        },
      });

      return handleResponse(
        null,
        "El transformador fue eliminado correctamente"
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default TransformerModel;
