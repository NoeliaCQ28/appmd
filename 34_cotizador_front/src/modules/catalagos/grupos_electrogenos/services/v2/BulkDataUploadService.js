import { isAxiosError } from "axios";
import site from "./../../../../../config/site.js";
import { api } from "../../../../../libs/axios.js";

const API_IMPORT_ENDPOINT = "/v1/data-import";

const BulkDataUploadService = {
  downloadTemplate: async () => {
    try {
      const axiosAPI = api.getUri();
      const apiBaseURL = axiosAPI.replace("/api", "");

      const response = await fetch(`${apiBaseURL}/${site.templateFileName}`);

      if (!response.ok) {
        throw new Error(
          `Error al descargar la plantilla: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      return blob;
    } catch (error) {
      if (error.message.includes("Error al descargar la plantilla")) {
        throw error;
      }
      throw new Error(
        "Ocurrió un error inesperado al descargar la plantilla: " +
          error.message
      );
    }
  },
  upload: async ({ file, transformName, sheetName, upsertMode }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sheetName", sheetName);
      formData.append("upsertMode", upsertMode);

      const response = await api.post(
        `${API_IMPORT_ENDPOINT}/import?transformName=${encodeURIComponent(
          transformName
        )}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Error en la carga de datos. Inténtelo de nuevo."
        );
      }
      throw new Error("Error inesperado: " + error.message);
    }
  },
};

export default BulkDataUploadService;
