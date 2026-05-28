import api from "./api";

export async function getAllBeaches() {
  const { data } = await api.get("/beaches");
  return data.data;
}

export async function getBeachDetail(id) {
  const { data } = await api.get(`/beaches/${id}`);
  return data.data;
}

export async function submitReview(beachId, { rating, message, image }) {
  const formData = new FormData();
  formData.append("rating", rating);
  formData.append("message", message);
  if (image) {
    formData.append("photo", image);
  }
  const { data } = await api.post(`/beaches/${beachId}/reviews`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function deleteReview(beachId) {
  const { data } = await api.delete(`/beaches/${beachId}/reviews`);
  return data;
}
