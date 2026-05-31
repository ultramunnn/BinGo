import api from "./api";
import { getToken } from "./token";

const MAX_FILE_SIZE = 600 * 1024; // 600KB


export async function classifyImage(photoFile) {
  if (photoFile.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran foto maksimal 600KB. Foto kamu ${(photoFile.size / 1024).toFixed(0)}KB.`);
  }
  const formData = new FormData();
  formData.append("photo", photoFile);
  const token = getToken();
  const { data } = await api.post("/scans/classify", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}


export async function getQuestionnaire(category) {
  const { data } = await api.get("/scans/questionnaire", {
    params: { category },
  });
  return data.data;
}


export async function submitScan({ photoFile, latitude, longitude, locationName, answers }) {
  if (photoFile.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran foto maksimal 600KB. Foto kamu ${(photoFile.size / 1024).toFixed(0)}KB.`);
  }
  const formData = new FormData();
  formData.append("photo", photoFile);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  if (locationName) formData.append("location_name", locationName);

  for (const [key, value] of Object.entries(answers)) {
    formData.append(key, value);
  }

  const token = getToken();
  const { data } = await api.post("/scans", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
}


export async function getAllScans(page = 1, limit = 20) {
  const { data } = await api.get("/scans", { params: { page, limit } });
  return data;
}

export async function getMyScans(page = 1, limit = 20) {
  const { data } = await api.get("/scans/me", { params: { page, limit } });
  return data;
}


export async function getScanById(id) {
  const { data } = await api.get(`/scans/${id}`);
  return data.data;
}


export async function deleteScan(id) {
  const { data } = await api.delete(`/scans/${id}`);
  return data;
}


export async function getLeaderboard() {
  const { data } = await api.get("/scans/leaderboard");
  return data.data;
}