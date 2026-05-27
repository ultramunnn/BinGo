/**
 * Wikipedia topics for BinGo educational articles.
 * Each category maps to search queries and display metadata.
 *
 * To add a new topic:
 * 1. Add a new entry to WIKI_TOPICS
 * 2. Set category, label, searchQueries (array of Wikipedia search terms)
 * 3. Optionally set icon and color for the UI
 */

export const WIKI_TOPICS = [
  {
    id: "recycling",
    category: "Daur Ulang Plastik",
    label: "Daur Ulang",
    searchQueries: [
      "Plastic recycling",
      "Recycling",
      "Plastic pollution",
    ],
    color: "emerald",
  },
  {
    id: "waste-management",
    category: "Pengelolaan Sampah",
    label: "Pengelolaan Sampah",
    searchQueries: [
      "Waste management",
      "Solid waste",
      "Landfill",
    ],
    color: "slate",
  },
  {
    id: "e-waste",
    category: "Sampah Elektronik",
    label: "E-Waste",
    searchQueries: [
      "Electronic waste",
      "E-waste",
      "Computer recycling",
    ],
    color: "amber",
  },
  {
    id: "compost",
    category: "Kompos",
    label: "Kompos",
    searchQueries: [
      "Compost",
      "Organic waste",
      "Composting",
    ],
    color: "lime",
  },
  {
    id: "glass-recycling",
    category: "Daur Ulang Kaca",
    label: "Daur Ulang Kaca",
    searchQueries: [
      "Glass recycling",
      "Glass bottle recycling",
    ],
    color: "sky",
  },
  {
    id: "paper-recycling",
    category: "Daur Ulang Kertas",
    label: "Daur Ulang Kertas",
    searchQueries: [
      "Paper recycling",
      "Paper mill",
      "Recycled paper",
    ],
    color: "orange",
  },
];

export const DEFAULT_CATEGORY = "all";

/**
 * Get all unique category labels for filter pills.
 */
export const getCategoryFilters = () => [
  { id: "all", label: "Semua" },
  ...WIKI_TOPICS.map(({ id, label }) => ({ id, label })),
];
