import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

export const getVendedores = async () => {
  try {
    const { data } = await api.get("/vendedores/listar");
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const registerVendedores = async (formData) => {
  try {
    const url = "/vendedores/register";
    const { data } = await api.post(url, formData);
    if (data.success) {
      return data.message;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const editVendedores = async ({ id, formData }) => {
  try {
    const url = `/vendedores/edit/${id}`;

    const { data } = await api.put(url, formData);
    if (data.success) {
      return data.message;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const deleteVendedores = async ({ id }) => {
  try {
    const { data } = await api.patch(`/vendedores/delete/${id}`);
    if (data.success) {
      return data.message;
    }
  } catch (error) {}
};

export const syncVendedores = async ({ id }) => {
  try {
    const { data } = await api.get(`/vendedores/sincronizar`);
    if (data.success) {
      return data.message;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
