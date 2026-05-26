export interface MLDerivedFeatures {
  category: string;
  Hardness: string;
  is_multilayer: string;
  is_dry: string;
  is_clean: string;
  is_container: string;
  is_fragment: string;
  is_hazardous: string;
  is_foam: string;
  is_small_item: string;
  cv_confidence?: number;
}

export interface QuestionnaireInput {
  is_hard?: boolean;
  is_multilayer?: boolean;
  is_dry?: boolean;
  is_clean?: boolean;
  is_container?: boolean;
  is_fragment?: boolean;
  is_hazardous?: boolean;
  is_foam?: boolean;
  is_small_item?: boolean;
}

export interface CVTopKPrediction {
  class: string;
  confidence: number;
}

export interface CVPredictionResponse {
  predicted_class: string;
  confidence: number;
  top_k: CVTopKPrediction[];
}

export interface MLPredictionResponse {
  category: string;
  recyclable: string;
  treatment: string;
  confidence: {
    recyclable: number;
    treatment: number;
  };
}

export interface ClassificationRecord {
  id: string;
  user_id: string;
  image_url: string;
  waste_type: string;
  confidence: number;
  cv_confidence: number | null;
  latitude: number;
  longitude: number;
  location_name: string | null;
  recyclable: string | null;
  treatment: string | null;
  recyclable_confidence: number | null;
  treatment_confidence: number | null;
  created_at: string;
}

export interface ClassificationResult {
  id: string;
  image_url: string;
  waste_type: string;
  confidence: number;
  cv_confidence: number;
  latitude: number;
  longitude: number;
  location_name: string | null;
  recyclable: string;
  treatment: string;
  recyclable_confidence: number;
  treatment_confidence: number;
  created_at: string;
}

export interface ScanInput {
  userId: string;
  imageBuffer: Buffer;
  mimeType: string;
  latitude: number;
  longitude: number;
  locationName?: string;
}
