const ENDPOINT = "/quote/validate";

import { handleResponse } from "#helpers/handlerResponse.js";
import { ERP_PROXY_API } from "#libs/axios.js";
import { convertQuoteValidateResponse } from "../schemas/QuoteValidateResponseSchema.js";

export const QuoteValidateSAPModel = {
  validate: async ({ quote }) => {
    try {
      const response = await ERP_PROXY_API.post(`${ENDPOINT}`, quote);
      const { data, status } = response;

      const validation = convertQuoteValidateResponse(data);

      if (status !== 200) {
        return handleResponse(
          { errors: validation.errors, hasErrors: validation.hasErrors },
          validation.message,
          validation.success,
          400,
        );
      }

      return handleResponse(
        { errors: validation.errors, hasErrors: validation.hasErrors },
        validation.message,
        true,
        status,
      );
    } catch (error) {
      return handleResponse(
        null,
        `Error al validar la cotización: ${error.message}, posible problema con el servicio externo.`,
        false,
        500,
      );
    }
  },
};
