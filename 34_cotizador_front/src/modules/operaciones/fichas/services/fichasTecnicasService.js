import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_URL = "/fichas";

export const getModelosFichas = async (params) => {
  try {
    const { data } = await api.post(`${API_URL}/modelos`, params);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const getFichasTecnicas = async ({
  selectModeloId,
  altura,
  temperatura,
  alternatorSwapped = false,
  alternatorSwappedId = 0,
}) => {
  try {
    const { data } = await api.get(
      `${API_URL}/tecnicas/${selectModeloId}?altura=${altura}&temperatura=${temperatura}&alternatorSwapped=${alternatorSwapped}&alternatorSwappedId=${alternatorSwappedId}`
    );
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
