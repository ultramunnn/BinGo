import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { predictTabular } from "./inference.service";
import type {
  HybridPredictionResponse,
  QuestionnaireResponse,
  QuestionnaireField,
} from "../types/classification";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
let genai: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!genai) genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return genai;
}

const SYSTEM_PROMPT = "Kamu adalah asisten edukasi pengelolaan sampah. Tugasmu adalah memberikan rekomendasi penanganan sampah yang SINGKAT dan JELAS (3-4 kalimat). Hanya gunakan data yang diberikan. Jangan pernah mengarang fakta, angka, atau statistik. Jangan sebutkan nama lembaga, organisasi, atau penelitian yang tidak disebutkan di data. JANGAN PERNAH memotong jawaban di tengah kalimat. Tulis sampai selesai.";

function buildPrompt(category: string,
  recyclable: string, treatment: string): string {
  return (
    `Berdasarkan data sampah berikut, tulislah rekomendasi penanganan SINGKAT dan JELAS dalam bahasa Indonesia.\n\n` +
    `DATA SAMPAH:\n` +
    `- Jenis: ${category}\n` +
    `- Dapat didaur ulang: ${recyclable}\n` +
    `- Metode treatment: ${treatment}\n\n` +
    `Tulis rekomendasi 3-4 kalimat saja. Cukup jelaskan:\n` +
    `1. Apa itu sampah ${category} dan apakah bisa didaur ulang.\n` +
    `2. Satu tips praktis cara menangani di rumah.\n\n` +
    `Jangan potong jawaban. Gunakan bahasa yang ramah dan mudah dipahami.`
  );
}

async function generateFromGemini(prompt: string): Promise<string> {
  const client = getGenAI();
  if (!client) return "";

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
  const config = {
    temperature: 0.5,
    maxOutputTokens: 500,
    systemInstruction: SYSTEM_PROMPT,
    thinkingConfig: { thinkingBudget: 0 },
  };

  for (const model of models) {
    try {
      const response = await client.models.generateContent({ model, contents: prompt, config });
      const finishReason = response.candidates?.[0]?.finishReason;
      const text = response.text?.trim();
      console.log(`[Gemini] ${model} finishReason=${finishReason}, length=${text?.length || 0}`);
      if (finishReason === "MAX_TOKENS") {
        console.warn(`[Gemini] ${model} hit max token limit — output may be truncated`);
      }
      if (text) return text;
    } catch (err: any) {
      console.warn(`[Gemini] ${model} failed: ${err.message}`);
    }
  }

  return "";
}

async function generateFromGroq(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) return "";

  try {
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 500,
    });
    const finishReason = response.choices[0]?.finish_reason;
    const text = response.choices[0]?.message?.content?.trim();
    console.log(`[Groq] finishReason=${finishReason}, length=${text?.length || 0}`);
    if (finishReason === "length") {
      console.warn("[Groq] Hit max token limit — output may be truncated");
    }
    if (text) return text;
  } catch (err: any) {
    console.warn(`[Groq] failed: ${err.message}`);
  }

  return "";
}

async function generateTips(
  category: string,
  recyclable: string,
  treatment: string
): Promise<string> {
  const prompt = buildPrompt(category, recyclable, treatment);

  const geminiResult = await generateFromGemini(prompt);
  if (geminiResult) return geminiResult;

  console.log("[Gemini] All models failed, trying Groq...");
  const groqResult = await generateFromGroq(prompt);
  if (groqResult) return groqResult;

  console.error("[LLM] All providers failed");
  return "";
}

export async function predictHybrid(
  imageBuffer: Buffer,
  _mimeType: string,
  _filename: string,
  features: Record<string, string>
): Promise<HybridPredictionResponse> {
  const { classifyImage } = await import("./inference.service");
  const cvResult = await classifyImage(imageBuffer);

  const category = cvResult.predictedClass;
  const cvConfidence = cvResult.confidence;

  const tabResult = await predictTabular(category, features);

  const aiRecommendation = await generateTips(
    category,
    tabResult.recyclable,
    tabResult.treatment
  );

  return {
    predicted_material: category,
    cv_confidence: cvConfidence,
    cv_probabilities: cvResult.probabilities,
    recyclable: tabResult.recyclable,
    treatment_method: tabResult.treatment,
    ml_confidence: {
      recyclable: tabResult.recyclableConfidence,
      treatment: tabResult.treatmentConfidence,
    },
    ai_recommendation: aiRecommendation,
  };
}

export function getQuestionnaire(
  category: string
): QuestionnaireResponse {
  const categoryLower = category.toLowerCase().trim();

  const baseQuestions: QuestionnaireField[] = [
    {
      field: "is_clean",
      label: "Apakah sampah dalam kondisi bersih?",
      type: "radio",
      options: ["Unknown", "Yes", "No"],
    },
    {
      field: "is_dry",
      label: "Apakah sampah dalam kondisi kering?",
      type: "radio",
      options: ["Unknown", "Yes", "No"],
    },
    {
      field: "is_hazardous",
      label: "Apakah sampah ini bekas wadah bahan kimia/medis/berbahaya?",
      type: "radio",
      options: ["Unknown", "Yes", "No"],
    },
  ];

  let specificQuestions: QuestionnaireField[] = [];

  if (categoryLower === "plastic" || categoryLower === "kristal") {
    specificQuestions = [
      { field: "Hardness", label: "Bagaimana tekstur plastik ini?", type: "radio", options: ["Unknown", "Hard", "Flexible"] },
      { field: "is_multilayer", label: "Apakah plastik ini berlapis (seperti bungkus makanan ringan)?", type: "radio", options: ["Unknown", "Yes", "No"] },
      { field: "is_container", label: "Apakah plastik ini berupa botol/wadah?", type: "radio", options: ["Unknown", "Yes", "No"] },
      { field: "is_foam", label: "Apakah ini berupa styrofoam (gabus)?", type: "radio", options: ["Unknown", "Yes", "No"] },
    ];
  } else if (categoryLower === "paper") {
    specificQuestions = [
      { field: "is_multilayer", label: "Apakah kertas/karton ini berlapis plastik/aluminium (seperti kotak susu)?", type: "radio", options: ["Unknown", "Yes", "No"] },
    ];
  } else if (categoryLower === "glass") {
    specificQuestions = [
      { field: "is_fragment", label: "Apakah kaca ini berupa pecahan/serpihan?", type: "radio", options: ["Unknown", "Yes", "No"] },
      { field: "is_container", label: "Apakah ini berupa botol/toples utuh?", type: "radio", options: ["Unknown", "Yes", "No"] },
    ];
  } else if (categoryLower === "metal") {
    specificQuestions = [
      { field: "is_container", label: "Apakah ini berupa kaleng?", type: "radio", options: ["Unknown", "Yes", "No"] },
    ];
  } else if (categoryLower === "textile") {
    specificQuestions = [
      { field: "is_small_item", label: "Apakah ini kain perca/berukuran sangat kecil?", type: "radio", options: ["Unknown", "Yes", "No"] },
    ];
  }

  return {
    category,
    questions: [...baseQuestions, ...specificQuestions],
  };
}
