import api from "./api";
import { setToken, removeToken, setUser, getUser, removeUser, isAuthenticated, getToken } from "./token";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  if (data.token) {
    setToken(data.token);
    setUser(data.user);
  }
  return data;
}

export async function register(email, password, fullName) {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  if (data.token) {
    setToken(data.token);
    setUser(data.user);
  }
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore — clear local state regardless
  }
  removeToken();
  removeUser();
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

export function getStoredUser() {
  return getUser();
}

export { isAuthenticated, getToken };
