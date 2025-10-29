import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/clientes";

const customerContactsService = {
  fetchAllByCustomerId: async (customer_id) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/${customer_id}/contacts`
      );

      if (!response.success) {
        throw new Error("Error al optener datos de los contactos");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los contactos"
      );
    }
  },

  createContact: async ({ customer_id, data }) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/${customer_id}/contacts`,
        data
      );

      if (!response.success) {
        throw new Error("Error al crear el contacto");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear el contacto");
    }
  },

  editContact: async ({ customer_id, contact_id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/${customer_id}/contacts/${contact_id}`,
        data
      );

      if (!response.success) {
        throw new Error("Error al editar el contacto del cliente");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar el contacto del cliente"
      );
    }
  },
  deleteContact: async ({ customer_id, contact_id }) => {
    try {
      const { data: response } = await api.delete(
        `${API_ENDPOINT}/${customer_id}/contacts/${contact_id}`
      );

      if (!response.success) {
        throw new Error("Error al eliminar el contacto del cliente");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al eliminar el contacto del cliente"
      );
    }
  },
  fetchAllDenominations: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/contacts/denominations`
      );

      if (!response.success) {
        throw new Error("Error al obtener las denominaciones");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las denominaciones"
      );
    }
  },
  fetchAllDeparments: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/contacts/deparments`
      );

      if (!response.success) {
        throw new Error("Error al obtener los departamentos");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los departamentos"
      );
    }
  },
};

export default customerContactsService;
