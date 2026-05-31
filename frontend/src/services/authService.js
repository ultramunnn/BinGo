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
  return data.user;
}

export async function forgotPassword(email) {
  const { data } = await api.post("/auth/reset-password", { email });
  return data;
}

export async function resetPassword(token, newPassword) {
  const { data } = await api.post("/auth/change-password", {
    token,
    new_password: newPassword,
  });
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.put("/auth/password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
}

export async function updateProfile({ fullName, photoUrl }) {
  const body = {};
  if (fullName !== undefined) body.full_name = fullName;
  if (photoUrl !== undefined) body.photo_url = photoUrl;
  const { data } = await api.put("/auth/profile", body);
  if (data.user) {
    setUser(data.user);
  }
  return data;
}

export async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await api.post("/auth/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data.user) {
    setUser(data.user);
  }
  return data;
}

export function getStoredUser() {
  return getUser();
}

export { isAuthenticated, getToken };
