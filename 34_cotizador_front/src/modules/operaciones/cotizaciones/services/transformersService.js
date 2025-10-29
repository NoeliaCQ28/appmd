import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/transformadores";

const TransformersService = {
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
  searchTransformers: async ({ brand, type }) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/buscar`, {
        brand,
        type,
      });

      if (!response.success) {
        throw new Error("Error al obtener datos de los transformadores");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los transformadores"
      );
    }
  },
  getAllTransformers: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los transformadores");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los transformadores"
      );
    }
  },
  getAllAccesorios: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/accesorios`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los accesorios");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los accesorios"
      );
    }
  },
  createAccesorio: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/accesorios`,
        data
      );

      if (!response.success) {
        throw new Error("Error al crear el accesorio");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear el accesorio");
    }
  },

  updateAccesorio: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/accesorios/${id}`,
        data
      );

      if (!response.success) {
        throw new Error("Error al actualizar el accesorio");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al actualizar el accesorio");
    }
  },

  deleteAccesorio: async (id) => {
    try {
      const { data: response } = await api.delete(
        `${API_ENDPOINT}/accesorios/${id}`
      );

      if (!response.success) {
        throw new Error("Error al eliminar el accesorio");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al eliminar el accesorio");
    }
  },

  createTransformers: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/create`, data);

      if (!response.success) {
        throw new Error("Error al crear el transformador");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear el transformador");
    }
  },

  updateTransformers: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/update/${id}`,
        data
      );

      if (!response.success) {
        throw new Error("Error al actualizar el transformador");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al actualizar el transformador"
      );
    }
  },

  removeTransformers: async (id) => {
    try {
      const { data: response } = await api.patch(
        `${API_ENDPOINT}/delete/${id}`
      );

      if (!response.success) {
        throw new Error("Error al eliminar el transformador");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al eliminar el transformador"
      );
    }
  },
};

export default TransformersService;
