import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/condiciones-comerciales";

const comercialConditionsService = {
  fetchAll: async () => {
    try {
      const { data: response } = await api.get(API_ENDPOINT);

      if (!response.success) {
        throw new Error(
          "Error al optener datos de las condiciones comerciales"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las condiciones comerciales"
      );
    }
  },

  createComercialCondition: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}`, data);

      if (!response.success) {
        throw new Error("Error al crear la condicion comercial");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al crear la condición comercial"
      );
    }
  },

  deleteComercialCondition: async ({ id }) => {
    try {
      const { data: response } = await api.delete(`${API_ENDPOINT}/${id}`);

      if (response.success) {
        return response;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al eliminar la condición comercial"
      );
    }
  },

  updateComercialCondition: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(`${API_ENDPOINT}/${id}`, data);

      if (!response.success) {
        throw new Error("Error al editar la condición comercial");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la condición comercial"
      );
    }
  },
};

export default comercialConditionsService;
