import { executeStoredProcedure } from "#libs/dbUtils.js";
import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const CablesModel = {
  getParams: async () => {
    try {
      const {
        result: [brands],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "clabemarca_listar",
        parameters: {
          in: [],
        },
      });

      const {
        result: [types],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cabletipo_listar",
        parameters: {
          in: [],
        },
      });

      const brandsMapped = brands.map((brand) => {
        return {
          CableMarca_Id: brand.CableMarca_Id,
          sCabMarDescripcion: brand.sCabMarDescripcion,
        };
      });

      const typesMapped = types.map((type) => {
        return {
          CableTipo_Id: type.CableTipo_Id,
          sCabMarDescripcion: type.sCabTipDescripcion,
        };
      });

      return handleResponse(
        {
          brands: brandsMapped,
          types: typesMapped,
        },
        "Datos cargados correctamente",
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCables: async ({ brand, type }) => {
    try {
      const {
        result: [cables],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cable_buscar",
        parameters: {
          in: [brand, type],
        },
      });

      return handleResponse(cables, "Datos cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getAll: async () => {
    try {
      const {
        result: [cables],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cable_buscar",
        parameters: {
          in: ["Todos", "Todos"],
        },
      });

      return handleResponse(cables, "Cables cargados correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  create: async (user_id, data) => {
    const {
      CableMarca_Id,
      CableTipo_Id,
      sCabCodSap,
      sCabNombre,
      sCabDescripcion,
      sCabUnidad,
      nCabPrecio,
      nCabStock,
    } = data;

    try {
      const {
        result: [cables],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cable_crear",
        parameters: {
          in: [
            Number(CableMarca_Id),
            Number(CableTipo_Id),
            sCabCodSap,
            sCabNombre,
            sCabDescripcion,
            sCabUnidad,
            nCabPrecio,
            nCabStock,
          ],
          out: ["@pCable_Id"],
        },
      });

      return handleResponse(cables, "El cable fue creado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  update: async (id, user_id, data) => {
    const {
      CableMarca_Id,
      CableTipo_Id,
      sCabCodSap,
	  sCabNombre,
      sCabDescripcion,
      sCabUnidad,
      nCabPrecio,
      nCabStock,
    } = data;

    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cable_actualizar",
        parameters: {
          in: [
            Number(id),
            Number(CableMarca_Id),
            Number(CableTipo_Id),
            sCabCodSap,
			sCabNombre,
            sCabDescripcion,
            sCabUnidad,
            nCabPrecio,
            nCabStock,
          ],
        },
      });

      return handleResponse(null, "El cable fue actualizado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },

  delete: async (id) => {
    try {
      await executeStoredProcedure({
        pool: db_pool,
        sp_name: "cable_eliminar",
        parameters: {
          in: [Number(id)],
        },
      });

      return handleResponse(null, "El cable fue eliminado correctamente");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default CablesModel;
