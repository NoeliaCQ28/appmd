import { isAxiosError } from 'axios';
import { api } from '../../../../libs/axios';

const API_ENDPOINT = '/v1/sunat/tipo-cambio';

export const getTypeChange = async (fecha) => {
  try {
    const response = await api.post(API_ENDPOINT, { fecha });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching type change:", error.message);
    }
    throw error;
  }
};