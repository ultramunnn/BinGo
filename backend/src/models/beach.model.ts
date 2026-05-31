import { supabase, supabaseAdmin } from "../config/supabase";
import type {
  Beach,
  BeachReview,
  BeachReviewWithUser,
  BeachReviewCreateInput,
} from "../types/beach";

const BEACHES = "beaches";
const REVIEWS = "beach_reviews";

export async function findAll(): Promise<Beach[]> {
  const { data, error } = await supabase
    .from(BEACHES)
    .select()
    .order("name");

  return error ? [] : (data as Beach[]);
}

export async function findAllMinimal(): Promise<{ id: string; name: string; latitude: number; longitude: number }[]> {
  const { data, error } = await supabase
    .from(BEACHES)
    .select("id, name, latitude, longitude")
    .order("name");

  return error ? [] : data;
}

export async function findAllByBbox(
  south: number,
  west: number,
  north: number,
  east: number
): Promise<Beach[]> {
  const { data, error } = await supabase
    .from(BEACHES)
    .select()
    .gte("latitude", south)
    .lte("latitude", north)
    .gte("longitude", west)
    .lte("longitude", east)
    .order("name");

  return error ? [] : (data as Beach[]);
}

export async function updateImageUrl(id: string, imageUrl: string): Promise<void> {
  await supabase
    .from(BEACHES)
    .update({ image_url: imageUrl })
    .eq("id", id)
    .is("image_url", null);
}

export async function clearAll(): Promise<void> {
  await supabase.from(REVIEWS).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from(BEACHES).delete().neq("id", "00000000-0000-0000-0000-000000000000");
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearestBeach(
  latitude: number,
  longitude: number,
  radiusKm = 1
): Promise<(Beach & { distance: number }) | null> {
  // Bounding-box pre-filter (~1km)
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

  const { data, error } = await supabase
    .from(BEACHES)
    .select()
    .gte("latitude", latitude - latDelta)
    .lte("latitude", latitude + latDelta)
    .gte("longitude", longitude - lonDelta)
    .lte("longitude", longitude + lonDelta);

  if (error || !data || data.length === 0) return null;

  let closest: (Beach & { distance: number }) | null = null;
  for (const beach of data as Beach[]) {
    const dist = haversine(latitude, longitude, beach.latitude, beach.longitude);
    if (dist <= radiusKm && (!closest || dist < closest.distance)) {
      closest = { ...beach, distance: dist };
    }
  }

  return closest;
}

export async function findById(id: string): Promise<Beach | null> {
  const { data, error } = await supabase
    .from(BEACHES)
    .select()
    .eq("id", id)
    .maybeSingle();

  return error || !data ? null : (data as Beach);
}

export async function findOrCreateByCoords(
  name: string,
  latitude: number,
  longitude: number,
  address?: string,
  imageUrl?: string
): Promise<Beach | null> {
  const { data: existing } = await supabase
    .from(BEACHES)
    .select()
    .gte("latitude", latitude - 0.001)
    .lte("latitude", latitude + 0.001)
    .gte("longitude", longitude - 0.001)
    .lte("longitude", longitude + 0.001)
    .limit(1)
    .maybeSingle();

  if (existing) return existing as Beach;

  const { data, error } = await supabase
    .from(BEACHES)
    .insert({
      name,
      latitude,
      longitude,
      address: address || null,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  return error ? null : (data as Beach);
}


export async function insertReview(
  input: BeachReviewCreateInput
): Promise<BeachReview | null> {
  const { data, error } = await supabaseAdmin
    .from(REVIEWS)
    .insert(input)
    .select()
    .single();

  return error ? null : (data as BeachReview);
}

export async function deleteReview(
  beachId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from(REVIEWS)
    .delete()
    .eq("beach_id", beachId)
    .eq("user_id", userId);

  return !error;
}

export async function getReviewsByBeachId(
  beachId: string
): Promise<BeachReviewWithUser[]> {
  const { data, error } = await supabase
    .from(REVIEWS)
    .select("*, users(full_name, photo_url)")
    .eq("beach_id", beachId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id,
    beach_id: r.beach_id,
    user_id: r.user_id,
    rating: r.rating,
    message: r.message,
    image_url: r.image_url || null,
    created_at: r.created_at,
    user_name: r.users?.full_name || "Anonymous",
    user_avatar: r.users?.photo_url || null,
  }));
}

export async function getAverageRating(
  beachId: string
): Promise<{ average: number; total: number }> {
  const { data, error } = await supabase
    .from(REVIEWS)
    .select("rating")
    .eq("beach_id", beachId);

  if (error || !data || data.length === 0) {
    return { average: 0, total: 0 };
  }

  const sum = data.reduce((acc: number, r: any) => acc + r.rating, 0);
  return {
    average: Math.round((sum / data.length) * 10) / 10,
    total: data.length,
  };
}
