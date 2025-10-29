import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/canales-distribucion";

const DistributionChannelService = {
  fetchAll: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los canales de distribución");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los canales de distribución"
      );
    }
  },
};

export default DistributionChannelService;
