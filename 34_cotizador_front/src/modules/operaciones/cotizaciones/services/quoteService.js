import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/cotizaciones";
const API_ENDPOINT_V2 = "/v2/quote";

const QuoteService = {
  fetchAllTypes: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/tipos`);

      if (!response.success) {
        throw new Error("Error al optener datos de los tipos de cotizaciones");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los tipos de cotizaciones"
      );
    }
  },
  fetchAll: async () => {
    try {
      const { data: response } = await api.get(API_ENDPOINT);

      if (!response.success) {
        throw new Error("Error al optener datos de las cotizaciones");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las cotizaciones"
      );
    }
  },
  fetchAllOnlyOrders: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}?onlyOrders=true`
      );

      if (!response.success) {
        throw new Error("Error al optener datos de las cotizaciones (pedidos)");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las cotizaciones (pedidos)"
      );
    }
  },
  fetchById: async ({ id }) => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT_V2}/${id}`);

      if (!response.success) {
        throw new Error("Error al optener la cotizacion");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de la cotizacion"
      );
    }
  },
  fetchFichaTecnica: async ({ id }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/${id}/ficha-tecnica`
      );

      if (!response.success) {
        throw new Error("Error al optener la ficha tecnica");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener la ficha tecnica"
      );
    }
  },
  createQuote: async (data) => {
    try {
      const { data: response } = await api.post(`${API_ENDPOINT_V2}`, data);

      if (!response.success) {
        throw new Error("Error al crear la cotizacion");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al crear la cotizacion");
    }
  },
  updateQuote: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(`${API_ENDPOINT}/${id}`, data);

      if (!response.success) {
        throw new Error("Error al actualizar la cotizacion");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al actualizar la cotizacion"
      );
    }
  },
  updateStateQuote: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/${id}/estado`,
        data
      );

      if (!response.success) {
        throw new Error("Error al actualizar el estado de la cotizacion");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al actualizar el estado de la cotizacion"
      );
    }
  },
  deleteQuote: async ({ id }) => {
    try {
      const { data: response } = await api.delete(`${API_ENDPOINT}/${id}`);

      if (!response.success) {
        throw new Error("Error al eliminar la cotizacion");
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al eliminar la cotizacion");
    }
  },
  deleteDetailOfQuote: async ({ quoteId, quoteDetailId }) => {
    try {
      const { data: response } = await api.delete(
        `${API_ENDPOINT}/${quoteId}/detalles/${quoteDetailId}`
      );

      if (!response.success) {
        throw new Error(
          `Error al eliminar el item N° ${quoteDetailId} de la cotizacion`
        );
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        `Ocurrio un error inesperado al eliminar el item N° ${quoteDetailId} de la cotizacion`
      );
    }
  },
  updateDetailOfQuote: async ({ quoteId, quoteDetailId, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/${quoteId}/detalles/${quoteDetailId}`,
        data
      );

      if (!response.success) {
        throw new Error(
          `Error al actualizar el item N° ${quoteDetailId} de la cotizacion`
        );
      }

      return response;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        `Ocurrio un error inesperado al actualizar el item N° ${quoteDetailId} de la cotizacion`
      );
    }
  },
  generateEconomicOffer: async ({ quoteId }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/${quoteId}/economic-offer`
      );

      if (!response.success) {
        throw new Error("Error al generar la oferta economica");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al generar la oferta economica"
      );
    }
  },
  validateQuote: async ({ quoteId }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/validar/${quoteId}`
      );

      if (!response.success) {
        throw new Error("Error al validar la cotizacion");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al validar la cotizacion");
    }
  },

  updateQuantity: async ({ quoteDetailId, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/update/quantity/${quoteDetailId}`,
        data
      );

      if (!response.success) {
        throw new Error("Error al actualizar la cantidad");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al actualizar la cantidad");
    }
  },

  getDetailsItems: async (quote_id, quote_detalle_id) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/${quote_id}/items/${quote_detalle_id}`
      );

      if (!response.success) {
        throw new Error("Error al obtener el detalle del item");
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener el detalle del item"
      );
    }
  },

  addItemsDetails: async (data) => {
    const { quoteId, ...resData } = data;
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/${quoteId}/add-items`,
        resData
      );

      if (!response.success) {
        throw new Error("Error al agregar los items al detalle");
      }
      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al agregar los items al detalle"
      );
    }
  },
  /**
   * Agrega items al detalle de una cotización
   * Permite agregar múltiples items de diferentes tipos (grupos electrógenos, cables, celdas, transformadores)
   *
   * @param {Object} data - Datos del request
   * @param {number} data.quoteId - ID de la cotización a la que se agregarán los items
   * @param {Object[]} data.details - Array de detalles de items a agregar
   * @param {number} data.details[].tipo - Tipo de producto (1: Grupo Electrógeno, etc.)
   * @param {number} data.details[].cantidad - Cantidad del item
   * @param {number} data.details[].precio_unitario - Precio unitario del item
   * @param {number} data.details[].producto_id - ID del producto
   * @param {Object} data.details[].quote_extra_details - Detalles específicos del producto (estructura varía según tipo)
   * @param {number} data.details[].quote_extra_details.otherComponents - Otros componentes del producto (valido para GE, Celdas, Transformadores)
   *
   * @example
   * // Ejemplo para grupos electrógenos
   * const data = {
   *   quoteId: 123,
   *   details: [{
   *     tipo: 1,
   *     cantidad: 1,
   *     precio_unitario: 7521.761,
   *     producto_id: 289,
   *     quote_extra_details: {
   *       integradoraId: 6460,
   *       ModeloKey: "6460-289-107-32-0",
   *       params: { modelo: "MP-10", voltaje: 220, frecuencia: 60, ... },
   *       model: { id: 289, name: "MP-10", price: "11402.94" },
   *       motor: { Motor_Id: 107, Motor: "PERKINS 403D-11G" },
   *       alternador: { ... },
   *       discount: { value: 35 },
   *       finalPrice: 7521.761,
   *       deliveryDays: 15,
   *       otherComponents: [...]
   *     }
   *   }]
   * };
   *
   * @returns {Promise<Response>} Mensaje de éxito de la operación
   * @throws {Error} Error específico del servidor o error genérico de la operación
   */ addItems: async (data) => {
    const { quoteId, ...resData } = data;
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/${quoteId}/detalles/add`,
        resData
      );

      if (!response.success) {
        throw new Error("Error al agregar los items al detalle");
      }
      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al agregar los items al detalle"
      );
    }
  },
};

export default QuoteService;
