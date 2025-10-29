import { isAxiosError } from "axios";
import { api } from "../../../../../libs/axios";

const API_ENDPOINT = "/v2/quote";

const QuoteService = {
  updateDetail: async ({ quoteId, quoteDetailId, detail }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/${quoteId}/details/${quoteDetailId}`,
        detail
      );

      if (!response.success) {
        throw new Error("Error al actualizar los detalles de la cotización");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al actualizar los detalles de la cotización"
      );
    }
  },
  addDetails: async ({ quoteId, details }) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/${quoteId}/details`,
        details
      );

      if (!response.success) {
        throw new Error("Error al agregar los detalles de la cotización");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al agregar los detalles de la cotización"
      );
    }
  },
};

export default QuoteService;
