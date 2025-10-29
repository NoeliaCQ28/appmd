import { isAxiosError } from "axios";
import { api } from "../../../libs/axios";

const API_ENDPOINT = "/v1/reports";

const ReportsService = {
  getCardResume: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/card-resume`);

      if (!response.success) {
        throw new Error("Error al obtener datos del resumen de tarjetas");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del resumen de tarjetas"
      );
    }
  },
  getExecutiveReport: async (filters) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/by-executive?` + new URLSearchParams(filters)
      );

      if (!response.success) {
        throw new Error("Error al obtener datos del reporte por ejecutivo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del reporte por ejecutivo"
      );
    }
  },
  exportExecutiveReport: async (filters) => {
    try {
      const { data } = await api.get(
        `${API_ENDPOINT}/by-executive/export?` + new URLSearchParams(filters),
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Reporte_Ejecutivos_${today}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al exportar el reporte");
      }
      throw new Error(
        "Ocurrio un error inesperado al exportar el reporte por ejecutivo"
      );
    }
  },
  getQuotesReport: async (filters) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/by-quotes?` + new URLSearchParams(filters)
      );

      if (!response.success) {
        throw new Error("Error al obtener datos del reporte por cotizaciones");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del reporte por cotizaciones"
      );
    }
  },
  exportQuotesReport: async (filters) => {
    try {
      const { data } = await api.get(
        `${API_ENDPOINT}/by-quotes/export?` + new URLSearchParams(filters),
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Reporte_Cotizaciones_${today}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al exportar el reporte");
      }
      throw new Error(
        "Ocurrio un error inesperado al exportar el reporte por cotizaciones"
      );
    }
  },
  getClientsReport: async (filters) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/by-customers?` + new URLSearchParams(filters)
      );

      if (!response.success) {
        throw new Error("Error al obtener datos del reporte de clientes");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del reporte de clientes"
      );
    }
  },
  exportClientsReport: async (filters) => {
    try {
      const { data } = await api.get(
        `${API_ENDPOINT}/by-customers/export?` + new URLSearchParams(filters),
        {
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `Reporte_Clientes_${today}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al exportar el reporte");
      }
      throw new Error(
        "Ocurrio un error inesperado al exportar el reporte de clientes"
      );
    }
  },
};

export default ReportsService;
