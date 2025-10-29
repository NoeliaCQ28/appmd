import { isAxiosError } from "axios";
import { api } from "../../../../../libs/axios";

const API_ENDPOINT = "/v2/generator-sets/margins/";

const MarginService = {
  find: async ({ generatorSetId, motorBrandId, marketId }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}?generatorSetId=${generatorSetId}&motorBrandId=${motorBrandId}&marketId=${marketId}`
      );

      if (!response.success) {
        throw new Error("Error al obtener datos de los márgenes");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los márgenes"
      );
    }
  },
};

export default MarginService;
