import { AuthError } from "./auth.service";
import * as CVService from "./cv.service";
import * as MLService from "./ml.service";
import * as ClassificationModel from "../models/classification.model";
import { uploadPhoto } from "./storage.service";
import { deriveFeatures } from "../utils/feature-derivation";
import type { ClassificationResult, ClassificationRecord, QuestionnaireInput, MLDerivedFeatures, CVPredictionResponse, CVTopKPrediction } from "../types/classification";

const CV_CONFIDENCE_THRESHOLD = 0.5;

// Category-specific required questionnaire fields
const REQUIRED_QUESTIONNAIRE: Record<string, (keyof QuestionnaireInput)[]> = {
  plastic: ["is_container", "is_multilayer"],
  paper: ["is_dry", "is_clean"],
  glass: ["is_container"],
  metal: ["is_container"],
  textile: ["is_clean", "is_dry"],
};

export async function scan(
  userId: string,
  imageBuffer: Buffer,
  mimeType: string,
  latitude: number,
  longitude: number,
  questionnaire: QuestionnaireInput,
  locationName?: string
): Promise<ClassificationResult> {
  const imageUrl = await uploadImage(userId, imageBuffer, mimeType);
  const cvResult = await classifyWaste(imageBuffer, mimeType);

  // Task 1: Confidence threshold with top-k fallback
  const selectedClass = selectBestClass(cvResult);

  // Task 2: Validate questionnaire for detected category
  validateQuestionnaire(selectedClass.predicted_class, questionnaire);

  // Task 3: Activate feature-derivation.ts — merge questionnaire with smart defaults
  const features = buildFeatures(selectedClass.predicted_class, questionnaire, selectedClass.confidence);

  // Task 4: Propagate CV confidence to ML model
  const mlResult = await predictRecyclability(features);

  const record = await saveClassification({
    user_id: userId,
    image_url: imageUrl,
    waste_type: selectedClass.predicted_class,
    confidence: selectedClass.confidence,
    cv_confidence: selectedClass.confidence,
    latitude,
    longitude,
    location_name: locationName,
    recyclable: mlResult.recyclable,
    treatment: mlResult.treatment,
    recyclable_confidence: mlResult.confidence.recyclable,
    treatment_confidence: mlResult.confidence.treatment,
  });

  return toResult(record);
}

// Task 1: Select best class using confidence threshold + top-k fallback
function selectBestClass(cvResult: CVPredictionResponse): { predicted_class: string; confidence: number } {
  // If top-1 confidence meets threshold, use it
  if (cvResult.confidence >= CV_CONFIDENCE_THRESHOLD) {
    return { predicted_class: cvResult.predicted_class, confidence: cvResult.confidence };
  }

  // Otherwise, try top-k candidates — pick first one above threshold
  if (cvResult.top_k && cvResult.top_k.length > 1) {
    for (const candidate of cvResult.top_k) {
      if (candidate.confidence >= CV_CONFIDENCE_THRESHOLD) {
        return { predicted_class: candidate.class, confidence: candidate.confidence };
      }
    }
  }

  // All candidates below threshold — waste category not recognizable
  const candidates = cvResult.top_k?.map(c => `${c.class} (${(c.confidence * 100).toFixed(1)}%)`).join(", ") || "none";
  console.warn(`[CV] All predictions below threshold ${CV_CONFIDENCE_THRESHOLD}. Candidates: ${candidates}`);

  throw new AuthError(
    422,
    `Jenis sampah tidak dapat dikenali dengan pasti. ` +
    `Silakan ambil foto yang lebih jelas atau dari sudut yang berbeda. ` +
    `(Kandidat: ${candidates})`
  );
}

// Task 2: Validate questionnaire is not empty for known categories
const FIELD_LABELS: Record<string, string> = {
  is_container: "apakah sampah berbentuk wadah/kontainer",
  is_multilayer: "apakah sampah terdiri dari beberapa lapisan",
  is_dry: "apakah sampah dalam kondisi kering",
  is_clean: "apakah sampah dalam kondisi bersih",
};

function validateQuestionnaire(category: string, q: QuestionnaireInput): void {
  const cat = category.toLowerCase();
  const required = REQUIRED_QUESTIONNAIRE[cat];
  if (!required) return;

  const missing = required.filter((field) => q[field] === undefined || q[field] === null);
  if (missing.length > 0) {
    const labels = missing.map(f => `- ${FIELD_LABELS[f] || f}`).join("\n");
    throw new AuthError(
      422,
      `Sampah terdeteksi sebagai "${category}". Mohon jawab pertanyaan berikut sebelum melakukan scan:\n${labels}`
    );
  }
}

// Task 3: Build features by merging questionnaire with deriveFeatures() defaults
function buildFeatures(category: string, q: QuestionnaireInput, cvConfidence: number): MLDerivedFeatures {
  // Get smart defaults from feature-derivation.ts
  const defaults = deriveFeatures(category);

  // Override with actual questionnaire answers (only if provided)
  const fromQuestionnaire: Partial<MLDerivedFeatures> = {};
  if (q.is_hard !== undefined) fromQuestionnaire.Hardness = q.is_hard ? "Hard" : "Flexible";
  if (q.is_multilayer !== undefined) fromQuestionnaire.is_multilayer = toYesNo(q.is_multilayer);
  if (q.is_dry !== undefined) fromQuestionnaire.is_dry = toYesNo(q.is_dry);
  if (q.is_clean !== undefined) fromQuestionnaire.is_clean = toYesNo(q.is_clean);
  if (q.is_container !== undefined) fromQuestionnaire.is_container = toYesNo(q.is_container);
  if (q.is_fragment !== undefined) fromQuestionnaire.is_fragment = toYesNo(q.is_fragment);
  if (q.is_hazardous !== undefined) fromQuestionnaire.is_hazardous = toYesNo(q.is_hazardous);
  if (q.is_foam !== undefined) fromQuestionnaire.is_foam = toYesNo(q.is_foam);
  if (q.is_small_item !== undefined) fromQuestionnaire.is_small_item = toYesNo(q.is_small_item);

  return {
    ...defaults,
    ...fromQuestionnaire,
    cv_confidence: cvConfidence,
  };
}

async function uploadImage(userId: string, buffer: Buffer, mimeType: string): Promise<string> {
  const url = await uploadPhoto(userId, buffer, mimeType, "scans");
  if (!url) throw new AuthError(500, "Failed to upload image");
  return url;
}

async function classifyWaste(buffer: Buffer, mimeType: string) {
  try {
    return await CVService.classifyImage(buffer, mimeType);
  } catch {
    throw new AuthError(502, "CV classification service unavailable");
  }
}

async function predictRecyclability(features: MLDerivedFeatures) {
  try {
    return await MLService.predictRecyclability(features);
  } catch {
    throw new AuthError(502, "ML prediction service unavailable");
  }
}

function toYesNo(val: boolean | undefined): string {
  if (val === undefined || val === null) return "Unknown";
  return val ? "Yes" : "No";
}

async function saveClassification(input: ClassificationModel.ClassificationCreateInput): Promise<ClassificationRecord> {
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
    recyclable: record.recyclable ?? "",
    treatment: record.treatment ?? "",
    recyclable_confidence: record.recyclable_confidence ?? 0,
    treatment_confidence: record.treatment_confidence ?? 0,
    created_at: record.created_at,
  };
}