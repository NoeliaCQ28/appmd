import { isAxiosError } from "axios";
import { api } from "../libs/axios";

const API_ENDPOINT = "/v1/files";

const FileService = {
  uploadFile: async ({ file, folder = "default" }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const { data: response } = await api.post(`${API_ENDPOINT}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.success) {
        throw new Error("Error al subir el archivo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrió un error inesperado al subir el archivo");
    }
  },
  getFileUrl: async ({ fileName }) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/find`, {
        fileName,
      });

      if (!response.success) {
        throw new Error("Error al obtener la URL del archivo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrió un error inesperado al obtener la URL del archivo"
      );
    }
  },
  getFileBuffer: async ({ fileName }) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}/buffer`, {
        fileName,
      });

      if (!response.success) {
        throw new Error("Error al obtener el buffer del archivo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrió un error inesperado al obtener el buffer del archivo"
      );
    }
  },
  deleteFile: async ({ fileName }) => {
    try {
      const { data: response } = await api.delete(`${API_ENDPOINT}`, {
        data: { fileName },
      });

      if (!response.success) {
        throw new Error("Error al eliminar el archivo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrió un error inesperado al eliminar el archivo");
    }
  },
};

export default FileService;
