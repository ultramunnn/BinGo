import type { MLDerivedFeatures, MLPredictionResponse } from "../types/classification";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export async function predictRecyclability(
  features: MLDerivedFeatures
): Promise<MLPredictionResponse> {
  const res = await fetch(`${ML_API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...features, generate_tips: true }),
  });

  if (!res.ok) {
    throw new Error(`ML API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<MLPredictionResponse>;
}
