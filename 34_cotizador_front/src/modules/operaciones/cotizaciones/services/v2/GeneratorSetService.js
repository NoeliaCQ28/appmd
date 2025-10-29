import { isAxiosError } from "axios";
import { api } from "../../../../../libs/axios";

const API_ENDPOINT = "/v2/generator-sets";
/**
 * @module GeneratorSetService
 *
 * @description
 * Este servicio proporciona métodos para interactuar con la API de generadores, permitiendo obtener datos
 * de alternadores, combinaciones de generadores y simular cambios de alternadores.
 *
 * @function getAllAlternators: Obtiene todos los alternadores disponibles
 * @function getAllCombinations: Obtiene todas las combinaciones de generadores según los parámetros. ahora el esquema es mas sencillo y optinene las combinaciones segun la tabla integradora
 * @function simulateAlternatorSwap: Simula el cambio de un alternador en una combinación de generador (Nuevo peso, costos y precios)
 *
 * @version 2.0
 * @since 1.20250729
 * @author @georgegiosue
 */
const GeneratorSetService = {
  getAllAlternators: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/alternators`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los alternadores");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los alternadores"
      );
    }
  },

  getAllITMsByCombination: async ({ integradoraId }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/itms/by-combination/${integradoraId}`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los interruptores por combinación"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los interruptores por combinación"
      );
    }
  },

  getITMById: async (id) => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/itms/${id}`);

      if (!response.success) {
        throw new Error("Error al obtener datos del interruptor");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del interruptor"
      );
    }
  },
  getAllITMs: async () => {
    try {
      const { data: response } = await api.get(`${API_ENDPOINT}/itms`);

      if (!response.success) {
        throw new Error("Error al obtener datos de los interruptores");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los interruptores"
      );
    }
  },

  getAllAlternatorsByCombination: async ({ integradoraId }) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/alternators/by-combination/${integradoraId}`
      );

      if (!response.success) {
        throw new Error(
          "Error al obtener datos de los alternadores por combinación"
        );
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los alternadores por combinación"
      );
    }
  },

  getAlternatorById: async (id) => {
    try {
      const { data: response } = await api.get(
        `${API_ENDPOINT}/alternators/${id}`
      );

      if (!response.success) {
        throw new Error("Error al obtener datos del alternador");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos del alternador"
      );
    }
  },
  getAllCombinations: async ({
    modelo,
    motorMarca,
    voltaje,
    frecuencia,
    fases,
    factorPotencia,
    altura,
    temperatura,
    insonoro,
    powerThreshold,
    primePower,
    standbyPower,
    marketId = 1, // Default marketId to 1 if not provided | NACIONAL
  }) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/get-all-combinations`,
        {
          modelo,
          motorMarca,
          voltaje,
          frecuencia,
          fases,
          factorPotencia,
          altura,
          temperatura,
          insonoro,
          powerThreshold,
          primePower,
          standbyPower,
          marketId,
        }
      );

      if (!response.success) {
        throw new Error("Error al obtener datos de los grupos electrogenos");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        "Ocurrio un error inesperado al obtener los datos de los grupos electrogenos"
      );
    }
  },
  changeConfiguration: async ({
    configuration,
    integradoraId,
    params: {
      modelo,
      voltaje,
      frecuencia,
      fases,
      factorPotencia,
      altura,
      temperatura,
      insonoro,
      powerThreshold,
      primePower,
      standbyPower,
      marketId,
    },
  }) => {
    try {
      const { data: response } = await api.post(
        `${API_ENDPOINT}/change-configuration`,
        {
          params: {
            modelo,
            voltaje,
            frecuencia,
            fases,
            factorPotencia,
            altura,
            temperatura,
            insonoro,
            powerThreshold,
            primePower,
            standbyPower,
            marketId,
          },
          integradoraId,
          configuration,
        }
      );

      if (!response.success) {
        throw new Error("Error al cambiar la configuración del modelo base");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        `Ocurrio un error inesperado al cambiar la configuración del modelo base: ${error.message}`
      );
    }
  },
};

export default GeneratorSetService;
