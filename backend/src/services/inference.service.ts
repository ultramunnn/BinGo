import * as ort from "onnxruntime-node";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

// Paths to ONNX models and encoders
const MODELS_DIR = path.resolve(__dirname, "../../../models");
const CV_MODEL_PATH = path.join(MODELS_DIR, "onnx/waste_classifier.onnx");
const TABULAR_MODEL_PATH = path.join(MODELS_DIR, "onnx/bingo_model.onnx");
const ENCODERS_PATH = path.join(MODELS_DIR, "label/label_encoders.json");

const CLASS_NAMES = ["glass", "metal", "paper", "plastic", "textile"];
const INPUT_COLS = [
  "category",
  "Hardness",
  "is_multilayer",
  "is_dry",
  "is_clean",
  "is_container",
  "is_fragment",
  "is_hazardous",
  "is_foam",
  "is_small_item",
];

let cvSession: ort.InferenceSession | null = null;
let tabularSession: ort.InferenceSession | null = null;
let encoders: Record<string, string[]> | null = null;

async function ensureModelsLoaded(): Promise<void> {
  if (cvSession && tabularSession && encoders) return;

  if (!cvSession) {
    console.log("[Inference] Loading CV model (ONNX) ...");
    cvSession = await ort.InferenceSession.create(CV_MODEL_PATH);
    console.log("[Inference] CV model loaded");
  }

  if (!tabularSession) {
    console.log("[Inference] Loading Tabular model (ONNX) ...");
    tabularSession = await ort.InferenceSession.create(TABULAR_MODEL_PATH);
    console.log("[Inference] Tabular model loaded");
  }

  if (!encoders) {
    console.log("[Inference] Loading label encoders ...");
    encoders = JSON.parse(fs.readFileSync(ENCODERS_PATH, "utf-8"));
    console.log("[Inference] Label encoders loaded");
  }
}

/**
 * Run CV inference on an image buffer.
 * Returns the predicted class name and confidence.
 */
export async function classifyImage(
  imageBuffer: Buffer,
): Promise<{ predictedClass: string; confidence: number }> {
  await ensureModelsLoaded();

  // Preprocess: resize to 224x224, normalize to [0,1]
  const raw = await sharp(imageBuffer)
    .resize(224, 224, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();

  // raw is RGB uint8, convert to float32 tensor [1, 224, 224, 3]
  // Don't normalize — the ONNX model includes EfficientNet's preprocess_input
  // (rescaling + normalization) inside the graph. It expects raw [0,255] values.
  const floatData = new Float32Array(224 * 224 * 3);
  for (let i = 0; i < raw.length; i++) {
    floatData[i] = raw[i];
  }

  // Create ONNX tensor: shape [1, 224, 224, 3]
  const inputTensor = new ort.Tensor("float32", floatData, [1, 224, 224, 3]);

  // Run inference
  const results = await cvSession!.run({ input: inputTensor });
  const probs = results["dense_4"].data as Float32Array;

  const predictedIdx = probs.indexOf(Math.max(...probs));
  const confidence = probs[predictedIdx];

  return {
    predictedClass: CLASS_NAMES[predictedIdx],
    confidence,
  };
}

/**
 * Run tabular ML prediction given category and questionnaire features.
 */
export async function predictTabular(
  category: string,
  features: Record<string, string>,
): Promise<{
  recyclable: string;
  treatment: string;
  recyclableConfidence: number;
  treatmentConfidence: number;
}> {
  await ensureModelsLoaded();

  // Build input tensors matching the 10 input columns
  const feeds: Record<string, ort.Tensor> = {};

  for (const col of INPUT_COLS) {
    const value = col === "category" ? category : features[col] || "Unknown";

    // Normalize boolean strings
    let normalizedValue = value;
    if (value === "true" || value === "True") normalizedValue = "Yes";
    else if (value === "false" || value === "False") normalizedValue = "No";

    // Look up label encoder
    const encoderKey = `le_${col}`;
    const classes = encoders![encoderKey];
    if (!classes) {
      throw new Error(
        `Label encoder not found for '${col}' (key: ${encoderKey})`,
      );
    }

    // Case-insensitive lookup with Unknown fallback
    const valLower = normalizedValue.toLowerCase();
    let encodedIdx = classes.findIndex((c) => c.toLowerCase() === valLower);
    if (encodedIdx === -1) {
      const unknownIdx = classes.findIndex(
        (c) => c.toLowerCase() === "unknown",
      );
      encodedIdx = unknownIdx >= 0 ? unknownIdx : 0;
    }

    const inputName = `input_${col}`;
    feeds[inputName] = new ort.Tensor(
      "float32",
      new Float32Array([encodedIdx]),
      [1, 1],
    );
  }

  // Run prediction
  const results = await tabularSession!.run(feeds);
  const recProbs = results["output_recyclability"].data as Float32Array;
  const treatProbs = results["output_treatment"].data as Float32Array;

  // Output 0: recyclable sigmoid (single value)
  const recValue = recProbs[0];
  const recyclable = recValue > 0.5 ? "Yes" : "No";
  const recyclableConfidence = Math.max(recValue, 1 - recValue);

  // Output 1: treatment softmax (5 classes)
  const treatIdx = Array.from(treatProbs).indexOf(Math.max(...treatProbs));
  const treatmentClasses = encoders!["le_recyclemethod"];
  const treatment = treatmentClasses[treatIdx];
  const treatmentConfidence = treatProbs[treatIdx];

  return {
    recyclable,
    treatment,
    recyclableConfidence,
    treatmentConfidence,
  };
}
