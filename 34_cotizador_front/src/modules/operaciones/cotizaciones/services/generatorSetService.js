import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/grupos-electrogenos";

const GeneratorSetService = {
  getParams: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/parametros`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los parametros");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los parametros"
      );
    }
  },
  search: async ({
    modelo,
    voltaje,
    frecuencia,
    fases,
    factorPotencia,
    altura,
    temperatura,
    insonoro,
    powerThreshold,
    primePower,
    standbyPower,
    marketId = 1, // Default marketId to 1 if not provided | NACIONAL
  }) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/modelos`, {
        modelo,
        voltaje,
        frecuencia,
        fases,
        factorPotencia,
        altura,
        temperatura,
        insonoro,
        powerThreshold,
        primePower,
        standbyPower,
        marketId
      });

      if (!response.success) {
        throw new Error("Error al obtener datos de los grupos electrogenos");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los grupos electrogenos"
      );
    }
  },

  createGeneratorSet: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}`, data);

      if (!response.success) {
        throw new Error("Error al crear el grupo electrógeno");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al crear la información del grupo electrógeno"
      );
    }
  },

};

export default GeneratorSetService;
