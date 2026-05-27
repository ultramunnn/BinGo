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