import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/clientes";

/**
 * Service for managing customer-related operations
 * @namespace
 * @property {Function} fetchAll - Fetches all customers from the API
 * @property {Function} create - Creates a new customer
 * @property {Function} deleteCustomer - Deletes a customer by ID
 * @property {Function} editCustomer - Updates an existing customer
 * @example
 * // Fetch all customers
 * const customers = await customerService.fetchAll();
 *
 * // Create a new customer
 * const message = await customerService.create({ data: customerData });
 *
 * // Delete a customer
 * const message = await customerService.deleteCustomer({ id: customerId });
 *
 * // Edit a customer
 * const message = await customerService.editCustomer({ id: customerId, data: updatedData });
 */
const customerService = {
  /**
   * Fetches vendors/customers from the API
   * @returns {Promise<Array>} List of vendors/customers
   * @throws {Error} When API request fails
   */
  fetchAll: async () => {
    try {
      const { data: response } = await api.get(API_ENDPOINT);

      if (!response.success) {
        throw new Error("Error al optener datos de los clientes");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los clientes"
      );
    }
  },
  /**
   * Creates a new customer in the system.
   *
   * @async
   * @param {Object} data
   * @returns {string}
   */
  createCustomer: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT}`, data);

      if (!response.success) {
        throw new Error("Error al crear el cliente");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear el cliente");
    }
  },
  /**
   * Deletes a customer by their ID
   * @param {Object} params - The parameters object
   * @param {number|string} params.id - The ID of the customer to delete
   * @returns {Promise<string>} A success message if the deletion was successful
   * @throws {Error} If there is an error when deleting the customer or an unexpected error occurs
   */
  deleteCustomer: async ({ id }) => {
    try {
      const { data } = await api.delete(`${API_ENDPOINT}/delete/${id}`);
      if (data.success) {
        return data.message;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al eliminar el cliente");
    }
  },
  /**
   * Description
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  editCustomer: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/edit/${id}`,
        data
      );

      if (!response.success) {
        throw new Error("Error al editar el cliente");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al editar el cliente");
    }
  },
  getCustomerFromERP: async ({ ruc }) => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/ERP/${ruc}`);

      if (!response.success) {
        throw new Error("Error al obtener el cliente desde el ERP");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener el cliente desde el ERP"
      );
    }
  },
};

export default customerService;
