import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("AUTH_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 500 &&
      error.response.data.error === "Token no válido"
    ) {
      Cookies.remove("AUTH_TOKEN");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
