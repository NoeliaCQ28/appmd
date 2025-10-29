const ENDPOINT = "/materials/stock";

import { handleResponse } from "#helpers/handlerResponse.js";
import { ERP_PROXY_API } from "#libs/axios.js";

export const MaterialSAPModel = {
  getStock: async ({ matnr, werks }) => {
    try {
      const response = await ERP_PROXY_API.get(
        `${ENDPOINT}?matnr=${matnr}&werks=${werks}`
      );
      const { data, status } = response;

      return handleResponse(
        data,
        `Stock del material con codigo ERP ${matnr} fue obtenido correctamente`,
        true,
        status
      );
    } catch (error) {
      return handleResponse(
        null,
        `Error al optener el stock del material: ${error.message}`,
        false,
        500
      );
    }
  },
};
