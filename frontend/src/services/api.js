import axios from "axios";
import { getToken, removeToken, removeUser } from "./token";

const api = axios.create({
  baseURL: "/api",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  console.log("[API] Request:", config.method?.toUpperCase(), config.url, "Token:", token ? token.substring(0, 20) + "..." : "MISSING");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("[API] 401 received:", err.response?.data);
      console.log("[API] Request headers:", err.config?.headers);
      removeToken();
      removeUser();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
