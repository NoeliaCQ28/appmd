import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/opcionales";

const OptionalsService = {
  fetchByIntegradoraId: async (integradoraId) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-by-integradora/${integradoraId}`
      );

      if (!response.success) {
        throw new Error("Error al optener datos de los componentes opcionales");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los componentes opcionales"
      );
    }
  },
  fetchAll: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/`);

      if (!response.success) {
        throw new Error(
          "Error al optener componentes opcionales para grupos electrogenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los componentes opcionales"
      );
    }
  },
  fetchAllBrands: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/brands`);
      if (!response.success) {
        throw new Error(
          "Error al obtener las marcas de los componentes opcionales"
        );
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las marcas de los componentes opcionales"
      );
    }
  },
  fetchAllTypes: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/types`);
      if (!response.success) {
        throw new Error(
          "Error al obtener los tipos de los componentes opcionales"
        );
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los tipos de los componentes opcionales"
      );
    }
  },
  create: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/`, data);

      if (!response.success) {
        throw new Error(
          "Error al crear el componente opcional para grupos electrogenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al crear el componente opcional"
      );
    }
  },
  deleteOptional: async (id) => {
    try {
      const { data: response } = await api.delete(`${API_ENDPOINT}/${id}`);

      if (!response.success) {
        throw new Error(
          "Error al eliminar el componente opcional para grupos electrogenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al eliminar el componente opcional"
      );
    }
  },
  update: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(`${API_ENDPOINT}/${id}`, data);

      if (!response.success) {
        throw new Error(
          "Error al actualizar el componente opcional para grupos electrogenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al actualizar el componente opcional"
      );
    }
  },
};

export default OptionalsService;
