import { AuthError } from "./auth.service";
import * as CVService from "./cv.service";
import * as MLService from "./ml.service";
import * as ClassificationModel from "../models/classification.model";
import * as BeachModel from "../models/beach.model";
import { uploadPhoto } from "./storage.service";
import type {
  ClassificationResult,
  ClassificationRecord,
  QuestionnaireInput,
  HybridPredictionResponse,
  CVPredictionResponse,
} from "../types/classification";

const CV_CONFIDENCE_THRESHOLD = 0.3;

/**
 * Pre-classify: kirim gambar ke CV API saja, dapatkan kategori + confidence.
 * Digunakan sebelum questionnaire agar frontend tahu kategori materialnya.
 */
export async function preClassify(
  imageBuffer: Buffer,
  mimeType: string
): Promise<CVPredictionResponse> {
  try {
    return await CVService.classifyImage(imageBuffer, mimeType);
  } catch (err: any) {
    console.error("[preClassify] CV error:", err.message || err);
    throw new AuthError(502, `CV classification failed: ${err.message || "unknown error"}`);
  }
}

export async function scan(
  userId: string,
  imageBuffer: Buffer,
  mimeType: string,
  latitude: number,
  longitude: number,
  questionnaire: QuestionnaireInput,
  locationName?: string
): Promise<ClassificationResult> {
  // 1. Upload image to Supabase Storage (for history/gallery)
  const imageUrl = await uploadImage(userId, imageBuffer, mimeType);

  // 2. Convert questionnaire booleans → string features for ML
  const features = buildFeaturesFromQuestionnaire(questionnaire);

  // 3. Run CV + Tabular ML locally (no external orchestrator)
  const filename = `scan_${Date.now()}.${mimeType.split("/")[1] || "jpg"}`;
  let result: HybridPredictionResponse;
  try {
    result = await MLService.predictHybrid(imageBuffer, mimeType, filename, features);
  } catch (err: any) {
    throw new AuthError(502, `ML inference failed: ${err.message}`);
  }

  // 4. Confidence threshold — reject if CV confidence too low
  if (result.cv_confidence < CV_CONFIDENCE_THRESHOLD) {
    throw new AuthError(
      422,
      `Jenis sampah tidak dapat dikenali dengan pasti. ` +
        `Silakan ambil foto yang lebih jelas atau dari sudut yang berbeda. ` +
        `(Confidence: ${(result.cv_confidence * 100).toFixed(1)}%)`
    );
  }

  // 5. Detect nearby beach (within 3km)
  const nearbyBeach = await BeachModel.findNearestBeach(latitude, longitude, 3);
  const beachId = nearbyBeach?.id || undefined;
  const resolvedLocationName = nearbyBeach ? nearbyBeach.name : locationName;

  // 6. Save classification to database
  const record = await saveClassification({
    user_id: userId,
    image_url: imageUrl,
    waste_type: result.predicted_material,
    confidence: result.cv_confidence,
    cv_confidence: result.cv_confidence,
    latitude,
    longitude,
    location_name: resolvedLocationName,
    beach_id: beachId,
    recyclable: result.recyclable,
    treatment: result.treatment_method,
    recyclable_confidence: result.ml_confidence.recyclable,
    treatment_confidence: result.ml_confidence.treatment,
  });

  return {
    ...toResult(record),
    beach_name: nearbyBeach?.name || null,
    ai_recommendation: result.ai_recommendation,
  };
}

/** Convert questionnaire booleans to "Yes"/"No" string features.
 *  Base fields (is_clean, is_dry) are guaranteed present (validated in controller).
 *  Category-specific fields use "Unknown" if not provided. */
function buildFeaturesFromQuestionnaire(q: QuestionnaireInput): Record<string, string> {
  const features: Record<string, string> = {};
  if (q.is_hard !== undefined) features.Hardness = q.is_hard ? "Hard" : "Flexible";
  if (q.is_multilayer !== undefined) features.is_multilayer = toYesNo(q.is_multilayer);
  features.is_dry = toYesNo(q.is_dry!);
  features.is_clean = toYesNo(q.is_clean!);
  if (q.is_container !== undefined) features.is_container = toYesNo(q.is_container);
  if (q.is_fragment !== undefined) features.is_fragment = toYesNo(q.is_fragment);
  if (q.is_hazardous !== undefined) features.is_hazardous = toYesNo(q.is_hazardous);
  if (q.is_foam !== undefined) features.is_foam = toYesNo(q.is_foam);
  if (q.is_small_item !== undefined) features.is_small_item = toYesNo(q.is_small_item);
  return features;
}


function toYesNo(val: boolean | undefined): string {
  if (val === undefined || val === null) return "Unknown";
  return val ? "Yes" : "No";
}

async function uploadImage(userId: string, buffer: Buffer, mimeType: string): Promise<string> {
  const url = await uploadPhoto(userId, buffer, mimeType, "scans");
  if (!url) throw new AuthError(500, "Failed to upload image");
  return url;
}

async function saveClassification(
  input: ClassificationModel.ClassificationCreateInput
): Promise<ClassificationRecord> {
  const record = await ClassificationModel.create(input);
  if (!record) throw new AuthError(500, "Failed to save classification result");
  return record;
}

function toResult(record: ClassificationRecord): ClassificationResult {
  return {
    id: record.id,
    image_url: record.image_url,
    waste_type: record.waste_type,
    confidence: record.confidence,
    cv_confidence: record.cv_confidence ?? record.confidence,
    latitude: record.latitude,
    longitude: record.longitude,
    location_name: record.location_name,
    beach_id: record.beach_id ?? null,
    beach_name: null,
    recyclable: record.recyclable ?? "",
    treatment: record.treatment ?? "",
    recyclable_confidence: record.recyclable_confidence ?? 0,
    treatment_confidence: record.treatment_confidence ?? 0,
    created_at: record.created_at,
  };
}
