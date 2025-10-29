import { isAxiosError } from "axios";
import { api } from "../libs/axios";

const API_ENDPOINT = "/v1/SAP";

const SAPService = {
  findCustomer: async ({ ruc, code }) => {
    try {
      if (!code && !ruc) {
        throw new Error("El codigo o RUC es requerido para obtener el cliente");
      }

      if (code && ruc) {
        throw new Error(
          "Solo el RUC o Codigo es requerido para obtener el cliente"
        );
      }

      const { data: response } = code
        ? await api.get(`${API_ENDPOINT}/clientes?code=${code}`)
        : await api.get(`${API_ENDPOINT}/clientes?ruc=${ruc}`);

      return response?.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }

      throw new Error(error);
    }
  },
  createCustomerFromModel: async ({ customerId }) => {
    try {
      const response = await api.post(
        `${API_ENDPOINT}/clientes/create-from-model/${customerId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }

      throw new Error(
        "Ocurrio un error inesperado al crear el cliente en el ERP"
      );
    }
  },
};

export default SAPService;
