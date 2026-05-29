import axios from "axios";
import { getToken, removeToken, removeUser } from "./token";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/reset-password", "/auth/change-password"];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => err.config?.url?.includes(path));
    if (err.response?.status === 401 && !isAuthEndpoint) {
      removeToken();
      removeUser();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
