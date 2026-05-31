import sharp from "sharp";
import * as BeachModel from "../models/beach.model";
import { uploadPhoto } from "./storage.service";
import type {
  BeachWithSummary,
  BeachDetail,
  BeachReview,
} from "../types/beach";
import { AuthError } from "./auth.service";


// OSM Nominatim search for East Java beaches
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const SEARCH_QUERIES = [
  "pantai",
  "pantai malang",
  "pantai banyuwangi",
  "pantai jember",
  "pantai lumajang",
  "pantai situbondo",
  "pantai pacitan",
  "pantai trenggalek",
  "pantai tulungagung",
  "pantai blitar",
  "pantai pasuruan",
  "pantai probolinggo",
  "pantai bangkalan",
  "pantai sumenep",
  "pantai pamekasan",
  "pantai sampang",
];
const VIEWBOX = "111.0,-9.0,115.0,-6.5";

async function fetchWikiImage(beachName: string): Promise<string | null> {
  try {
    const queries = [beachName, beachName.replace(/^Pantai\s+/i, "").trim()];

    for (const q of queries) {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=5&format=json`;
      const searchRes = await fetch(searchUrl, {
        headers: { "User-Agent": "BinGo-App/1.0" },
      });
      const searchData = await searchRes.json();
      const results = searchData?.query?.search;
      if (!results || results.length === 0) continue;

      for (const result of results) {
        const fileTitle = result.title;
        const lower = fileTitle.toLowerCase();
        if (!lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".png")) continue;

        const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json`;
        const imgRes = await fetch(imgUrl, {
          headers: { "User-Agent": "BinGo-App/1.0" },
        });
        const imgData = await imgRes.json();
        const pages = imgData?.query?.pages;
        if (!pages) continue;
        const page = Object.values(pages)[0] as any;
        const info = page?.imageinfo?.[0];
        if (info?.thumburl || info?.url) {
          return info.thumburl || info.url;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

function isBeachResult(item: any): boolean {
  const name = (item.namedetails?.name || item.display_name || "").toLowerCase();
  const osmType = item.type || "";
  const cls = item.class || "";

  // Exclude non-beach results
  const excludeWords = [
    "jalan", "gereja", "masjid", "hotel", "villa", "warung", "rumah",
    "dermaga", "pelabuhan", "pasar", "sekolah", "lapangan", "monumen",
    "kantor", "toko", "apotek", "bank", "kafe",
  ];
  const isExcluded = excludeWords.some((w) => name.startsWith(w.toLowerCase()));

  const isBeachType = (cls === "natural" && osmType === "beach") || (cls === "tourism" && osmType === "beach");

  const hasPantai = name.includes("pantai");

  return hasPantai && !isExcluded && isBeachType;
}

async function fetchFromOSM(): Promise<void> {
  const seen = new Set<string>();

  for (const query of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({
        q: query,
        format: "json",
        limit: "50",
        viewbox: VIEWBOX,
        bounded: "1",
        "accept-language": "id",
      });

      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { "User-Agent": "BinGo-App/1.0" },
      });
      const results = await res.json();

      if (!Array.isArray(results)) continue;

      for (const item of results) {
        if (!item.lat || !item.lon || !item.display_name) continue;

        if (!isBeachResult(item)) continue;

        const key = `${Math.round(parseFloat(item.lat) * 1000)}_${Math.round(parseFloat(item.lon) * 1000)}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const name = item.namedetails?.name || item.display_name.split(",")[0];
        const address = item.display_name;

        const imageUrl = await fetchWikiImage(name);

        await BeachModel.findOrCreateByCoords(
          name,
          parseFloat(item.lat),
          parseFloat(item.lon),
          address,
          imageUrl || undefined
        );
      }

      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.warn("[Beach] Failed to fetch from OSM:", (err as Error).message);
    }
  }
}

export async function getAllBeaches(forceRefresh = false): Promise<BeachWithSummary[]> {
  let beaches = await BeachModel.findAll();

  // Auto-fetch from OSM if table is empty or force refresh
  if (beaches.length === 0 || forceRefresh) {
    if (forceRefresh && beaches.length > 0) {
      console.log("[Beach] Clearing existing beaches for refresh...");
      await BeachModel.clearAll();
    }
    await fetchFromOSM();
    beaches = await BeachModel.findAll();
  }

  const missingImages = beaches.filter((b) => !b.image_url);
  if (missingImages.length > 0) {
    console.log(`[Beach] Backfilling images for ${missingImages.length} beaches...`);
    for (const beach of missingImages) {
      const imageUrl = await fetchWikiImage(beach.name);
      if (imageUrl) {
        await BeachModel.updateImageUrl(beach.id, imageUrl);
        beach.image_url = imageUrl;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const results: BeachWithSummary[] = [];
  for (const beach of beaches) {
    const { average, total } = await BeachModel.getAverageRating(beach.id);
    results.push({ ...beach, average_rating: average, total_reviews: total });
  }

  return results;
}

export async function getBeachesInBbox(
  south: number,
  west: number,
  north: number,
  east: number
): Promise<BeachWithSummary[]> {
  const beaches = await BeachModel.findAllByBbox(south, west, north, east);

  const results: BeachWithSummary[] = [];
  for (const beach of beaches) {
    const { average, total } = await BeachModel.getAverageRating(beach.id);
    results.push({ ...beach, average_rating: average, total_reviews: total });
  }

  return results;
}

export async function getBeachesForMap() {
  return BeachModel.findAllMinimal();
}

export async function getBeachDetail(id: string): Promise<BeachDetail> {
  const beach = await BeachModel.findById(id);
  if (!beach) throw new AuthError(404, "Pantai tidak ditemukan");

  const [reviews, { average, total }] = await Promise.all([
    BeachModel.getReviewsByBeachId(id),
    BeachModel.getAverageRating(id),
  ]);

  return {
    ...beach,
    average_rating: average,
    total_reviews: total,
    reviews,
  };
}

export async function submitReview(
  beachId: string,
  userId: string,
  rating: number,
  message: string,
  imageBuffer?: Buffer,
  imageMime?: string
): Promise<BeachReview> {
  const beach = await BeachModel.findById(beachId);
  if (!beach) throw new AuthError(404, "Pantai tidak ditemukan");

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AuthError(400, "Rating harus antara 1-5");
  }

  if (!message || message.trim().length === 0) {
    throw new AuthError(400, "Pesan tidak boleh kosong");
  }

  let imageUrl: string | undefined;
  if (imageBuffer && imageMime) {
    try {
      // Compress image to max ~200KB before upload
      const compressed = await sharp(imageBuffer)
        .resize(800, 800, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      const url = await uploadPhoto(userId, compressed, "image/jpeg", "image_review");
      if (url) imageUrl = url;
    } catch (err) {
      console.warn("[Beach] Image upload failed, saving review without image:", (err as Error).message);
    }
  }

  const review = await BeachModel.insertReview({
    beach_id: beachId,
    user_id: userId,
    rating,
    message: message.trim(),
    image_url: imageUrl,
  });

  if (!review) throw new AuthError(500, "Gagal menyimpan review");
  return review;
}

export async function deleteReview(
  beachId: string,
  userId: string
): Promise<void> {
  const ok = await BeachModel.deleteReview(beachId, userId);
  if (!ok) throw new AuthError(500, "Gagal menghapus review");
}
