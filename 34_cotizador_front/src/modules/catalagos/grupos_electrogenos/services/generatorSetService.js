import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/grupos-electrogenos";

const generatorSetService = {
  getModels: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/models`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los modelos de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los modelos de grupos electrógenos"
      );
    }
  },
  getMotorBrands: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/motor-brands`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de las marcas de modelos de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las marcas de modelos de grupos electrógenos"
      );
    }
  },
  getMotorModels: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/motor-models`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los modelos de los motores de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de las marcas de modelos de grupos electrógenos"
      );
    }
  },
  getAlternatorBrands: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/alternator-brands`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de las marcas de alternadores de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las marcas de alternadores de grupos electrógenos"
      );
    }
  },
  getAlternatorModels: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/alternator-models`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los modelos de alternadores de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los modelos de alternadores de grupos electrógenos"
      );
    }
  },
  getVoltages: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/voltages`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los voltajes de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los voltajes de grupos electrógenos"
      );
    }
  },
  getFrequencies: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/frequencies`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de las frecuencias de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las frecuencias de grupos electrógenos"
      );
    }
  },
  getPhases: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/phases`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de las fases de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las fases de grupos electrógenos"
      );
    }
  },
  getPowerFactors: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/power-factors`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los factores de potencia de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los factores de potencia de grupos electrógenos"
      );
    }
  },
  getAltitudes: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/altitudes`
      );

      if (!response.success) {
        throw new Error("Error al obtener datos de las alturas disponibles");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener las alturas disponibles"
      );
    }
  },
  getITMs: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/itms`
      );

      if (!response.success) {
        throw new Error("Error al obtener datos de los ITMs");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al obtener los ITMs");
    }
  },
  getMarkets: async () => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/search-params/markets`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los mercados de grupos electrógenos"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los mercados de grupos electrógenos"
      );
    }
  },
  searchModels: async ({ params }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/modelos/search`,
        { params }
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los modelos de grupos electrógenos"
        );
      }
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los modelos de grupos electrógenos"
      );
    }
  },
  getMotorInfo: async ({ motorModelo }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/info/motor/${encodeURIComponent(motorModelo)}`
      );

      if (!response.success) {
        throw new Error("Error al obtener información del motor");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener la información del motor"
      );
    }
  },
  getAlternatorInfo: async ({ alternadorModelo }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/info/alternator/${alternadorModelo}`
      );

      if (!response.success) {
        throw new Error("Error al obtener información del alternador");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener la información del alternador"
      );
    }
  },
  getModeloInfo: async ({ modelo }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/info/modelo/${modelo}`
      );

      if (!response.success) {
        throw new Error("Error al obtener información del modelo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener la información del modelo"
      );
    }
  },
  getModelPrices: async ({ model }) => {
    try {
      const {
        ModeloGEId: modeloge_id,
        MotorId: motor_id,
        AlternadorId: alternador_id,
        Voltaje: voltaje,
        Frecuencia: frecuencia,
        Fases: fases,
        FactorPotencia: factor_potencia,
        MercadoId: market_id,
      } = model;

      const { data: response } = await api.get(`${API_ENDPOINT}/info/prices`, {
        params: {
          modeloge_id,
          motor_id,
          alternador_id,
          voltaje,
          frecuencia,
          fases,
          factor_potencia,
          market_id,
        },
      });

      if (!response.success) {
        throw new Error("Error al obtener los precios del modelo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al obtener los precios");
    }
  },
  getTechnicalReport: async ({ model }) => {
    try {
      const { data: response } = await api.get(
        `fichas/tecnicas/${model.IntegradoraId}?altura=100&temperatura=25&alternatorSwapped=false&alternatorSwappedId=0`
      );

      if (!response.success) {
        throw new Error("Error al obtener la ficha tecnica del modelo");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener la ficha tecnica del modelo"
      );
    }
  },

  updateMotorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/motor-models`,
        data
      );

      if (!response.success) {
        throw new Error("Error al editar la informacion del motor");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información del motor"
      );
    }
  },

  updatePowerMotorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/power-motor`,
        data
      );

      if (!response.success) {
        throw new Error(
          "Error al editar la informacion de la potencia del motor"
        );
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información de la potencia del motor"
      );
    }
  },

  createPowerMotorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/create/power-motor`,
        data
      );

      if (!response.success) {
        throw new Error(
          "Error al crear la informacion de la potencia del motor"
        );
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información de la potencia del motor"
      );
    }
  },

  createPowerAlternatorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/create/power-alternator`,
        data
      );

      if (!response.success) {
        throw new Error(
          "Error al crear la informacion de la potencia del alternador"
        );
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información de la potencia del alternador"
      );
    }
  },

  updateAlternadorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/alternador-models`,
        data
      );

      if (!response.success) {
        throw new Error("Error al editar la informacion del alternador");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información del alternador"
      );
    }
  },

  updatePowerAlternatorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/power-alternator`,
        data
      );

      if (!response.success) {
        throw new Error(
          "Error al editar la informacion de la potencia del alternador"
        );
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información de la potencia del alternador"
      );
    }
  },

  updateModelosInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/modelos-models`,
        data
      );

      if (!response.success) {
        throw new Error("Error al editar la informacion del modelo");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message ||
            "Error del servidor al editar la información del modelo"
        );
      }

      throw new Error(
        "Ocurrio un error inesperado al editar la información del modelo: " +
          error.message
      );
    }
  },

  updateModelImages: async (data) => {
    const {
      ModeloGEId,
      uModImgAbierto,
      uModImgInsonoro,
      uModImgDimensiones,
      uModImgDimensionesInsonoro,
      user_id,
    } = data;

    // Validación
    if (!ModeloGEId || isNaN(ModeloGEId) || ModeloGEId <= 0) {
      throw new Error("ModeloGEId es inválido o falta");
    }
    if (!user_id || isNaN(user_id) || user_id < 0 || user_id > 255) {
      throw new Error("user_id es inválido o falta");
    }

    try {
      const response = await api.post(`${API_ENDPOINT}/update/images`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Verifica que la respuesta tenga data
      if (!response || !response.data) {
        throw new Error("Respuesta del servidor vacía o inválida");
      }

      const { data: responseData } = response;

      if (!responseData.success) {
        throw new Error(
          responseData.message || "Error al actualizar las imágenes del modelo"
        );
      }

      return responseData.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error del servidor (${error.response.status}): No se pudieron actualizar las imágenes`
        );
      }

      throw new Error(
        "Ocurrió un error inesperado al actualizar las imágenes del modelo: " +
          error.message
      );
    }
  },

  updateModelPricesInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/update/modelos-prices`,
        data
      );

      if (!response.success) {
        throw new Error(
          "Error al editar la informacion de los precios del modelo"
        );
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información de los precios del modelo"
      );
    }
  },

  createMotorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/create/motor-info`,
        data
      );

      if (!response.success) {
        throw new Error("Error al crear el motor");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información del motor"
      );
    }
  },

  createAlternadorInfo: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/create/alternador-info`,
        data
      );

      if (!response.success) {
        throw new Error("Error al crear el alternador");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al editar la información del motor"
      );
    }
  },
  removeModeloGeAndIntegradora: async (modelo) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/delete/${modelo}`
      );

      if (!response.success) {
        throw new Error("Error al eliminar el modelo");
      }

      return response.message;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Ocurrio un error inesperado al eliminar el modelo");
    }
  },

  createCombination: async (data) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/integradora`,
        data
      );

      if (!response.success) {
        throw new Error(response.message || "Error al crear la combinación");
      }

      return response.message || "Combinación creada exitosamente";
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new Error(data?.message || "Error al crear la combinación");
      }
      throw new Error("Ocurrió un error inesperado al crear la combinación");
    }
  },

  updateCombination: async ({ id, data }) => {
    try {
      const { data: response } = await api.put(
        `${API_ENDPOINT}/integradora/${id}`,
        data
      );

      if (!response.success) {
        throw new Error(
          response.message || "Error al actualizar la combinación"
        );
      }

      return response.message || "Combinación actualizada exitosamente";
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { data } = error.response;
        throw new Error(data?.message || "Error al actualizar la combinación");
      }
      throw new Error(
        "Ocurrió un error inesperado al actualizar la combinación"
      );
    }
  },
};

export default generatorSetService;
