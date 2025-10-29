import isAxiosError from "axios";
import Cookies from "js-cookie";
import { api } from "../../../libs/axios";

export const aunthenticateUser = async (formData) => {
  try {
    const url = "/auth/login";
    const { data } = await api.post(url, formData);
    if (data.success) {
      Cookies.set("AUTH_TOKEN", data.data, { expires: 7 });
      return data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const getUser = async () => {
  try {
    const { data } = await api.get("/auth/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const userLogout = async () => {
  try {
    const { data } = await api.post("/auth/logout");
    if (data.success) {
      Cookies.remove("AUTH_TOKEN");
      return data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const createUser = async (formData) => {
  try {
    const { data } = await api.post("/auth/register", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const editUser = async ({ nUsuarioId, data }) => {
  try {
    const response = await api.put(`/auth/user/${nUsuarioId}`, data);

    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
