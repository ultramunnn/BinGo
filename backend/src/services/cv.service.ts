<<<<<<< HEAD
import type { CVPredictionResponse } from "../types/classification";

const CV_API_URL = process.env.CV_API_URL || "http://localhost:7860";

export async function classifyImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<CVPredictionResponse> {
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });

  const form = new FormData();
  form.append("file", blob, `image.${mimeType.split("/")[1] || "jpg"}`);

  const res = await fetch(`${CV_API_URL}/predict`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`CV API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<CVPredictionResponse>;
}
=======
import { classifyImage as runCV } from "./inference.service";
import type { CVPredictionResponse } from "../types/classification";

/**
 * Pre-classify: run CV model locally via TF.js.
 * Returns predicted category + confidence.
 */
export async function classifyImage(
  imageBuffer: Buffer,
  _mimeType: string
): Promise<CVPredictionResponse> {
  const { predictedClass, confidence } = await runCV(imageBuffer);

  return {
    predicted_class: predictedClass,
    confidence,
    top_k: [{ class: predictedClass, confidence }],
  };
}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
