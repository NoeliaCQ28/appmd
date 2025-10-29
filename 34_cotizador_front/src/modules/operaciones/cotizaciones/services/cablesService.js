import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/cables";

const CablesService = {
  getParams: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/parametros`);

      if (!response.success) {
        throw new Error("Error al optener datos de los parametros");
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
  searchCables: async ({ brand, type }) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/buscar`, {
        brand,
        type,
      });

      if (!response.success) {
        throw new Error("Error al optener datos de los cables");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los cables"
      );
    }
  },
  getAllCables: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/`);

      if (!response.success) {
        throw new Error("Error al optener datos de los cables");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los cables"
      );
    }
  },
  createCable: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/create`, data);

      if (!response.success) {
        throw new Error("Error al crear el cable");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear el cable");
    }
  },

  updateCable: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(`${API_ENDPOINT}/update/${id}`, data);

      if (!response.success) {
        throw new Error("Error al actualizar el cable");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al actualizar el cable");
    }
  },

  removeCable: async (id) => {
    try {
      const { data: response } = await api.patch(`${API_ENDPOINT}/delete/${id}`);

      if (!response.success) {
        throw new Error("Error al eliminar el cable");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al eliminar el cable");
    }
  },


};

export default CablesService;
