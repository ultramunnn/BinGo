import type { MLDerivedFeatures } from "../types/classification";

const DEFAULT_FEATURES: Omit<MLDerivedFeatures, "category"> = {
  Hardness: "Unknown",
  is_multilayer: "Unknown",
  is_dry: "Unknown",
  is_clean: "Unknown",
  is_container: "Unknown",
  is_fragment: "Unknown",
  is_hazardous: "No",
  is_foam: "No",
  is_small_item: "No",
};

const CATEGORY_OVERRIDES: Record<string, Partial<MLDerivedFeatures>> = {
  plastic: { is_fragment: "No", is_multilayer: "No", is_container: "No" },
  glass: { is_container: "No", is_fragment: "No" },
  metal: { is_container: "No", is_fragment: "No" },
  paper: { is_dry: "Yes", is_clean: "Yes", is_container: "No", is_fragment: "No" },
  textile: { is_clean: "No", is_dry: "No", is_container: "No", is_fragment: "No" },
};

export function deriveFeatures(category: string): MLDerivedFeatures {
  const cat = category.toLowerCase();
  const override = CATEGORY_OVERRIDES[cat] ?? {};

  return {
    ...DEFAULT_FEATURES,
    ...override,
    category: capitalize(cat),
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
