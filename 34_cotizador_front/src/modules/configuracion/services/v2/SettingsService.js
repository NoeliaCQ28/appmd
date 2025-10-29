import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v2/settings";

const SettingsService = {
  fetchAllPreferences: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/preferences`);

      if (!response.success) {
        throw new Error("Error al obtener datos de las preferencias");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las preferencias"
      );
    }
  },

  createPreference: async (preferenceData) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/preferences`,
        preferenceData
      );

      if (!response.success) {
        throw new Error("Error al crear la preferencia");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrió un error inesperado al crear la preferencia");
    }
  },

  updatePreference: async ({ key, updateData }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/preferences/${key}`,
        updateData
      );

      if (!response.success) {
        throw new Error("Error al actualizar la preferencia");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrió un error inesperado al actualizar la preferencia"
      );
    }
  },

  deletePreference: async (key) => {
    try {
      const { data: response } = await api.delete(
        `${API_ENDPOINT}/preferences/${key}`
      );

      if (!response.success) {
        throw new Error("Error al eliminar la preferencia");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrió un error inesperado al eliminar la preferencia");
    }
  },
};

export default SettingsService;
