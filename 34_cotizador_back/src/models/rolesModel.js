import db_pool from "#config/db.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import { executeStoredProcedure } from "#libs/dbUtils.js";

const RolesModel = {
  getAll: async () => {
    try {
      const {
        result: [rows],
      } = await executeStoredProcedure({
        pool: db_pool,
        sp_name: "roles_listar",
        parameters: {
          in: [],
        },
      });

      return handleResponse(rows, "Roles consultados con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default RolesModel;
