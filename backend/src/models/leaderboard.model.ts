import { supabaseAdmin } from "../config/supabase";

export interface TopUser {
  user_id: string;
  full_name: string;
  photo_url: string | null;
  scan_count: number;
}

export interface TopBeach {
  beach_id: string;
  name: string;
  image_url: string | null;
  avg_rating: number;
  review_count: number;
}

const LIMIT = 10;

/**
 * Top 10 users by scan count.
 * - Primary sort: scan_count DESC (terbanyak dulu)
 * - Secondary sort: created_at ASC (jika count sama, yang pertama daftar duluan)
 */
export async function getTopUsers(): Promise<TopUser[]> {
  // 1. Get ALL users with created_at
  const { data: allUsers, error } = await supabaseAdmin
    .from("users")
    .select("id, full_name, photo_url, created_at")
    .order("created_at", { ascending: true });

  if (error || !allUsers) return [];

  // 2. Get scan counts
  const { data: scans } = await supabaseAdmin
    .from("classification_history")
    .select("user_id");

  const scanCounts: Record<string, number> = {};
  if (scans) {
    for (const row of scans) {
      scanCounts[row.user_id] = (scanCounts[row.user_id] || 0) + 1;
    }
  }

  // 3. Merge + sort: scan_count DESC, then created_at ASC
  const users: TopUser[] = allUsers
    .map((u) => ({
      user_id: u.id,
      full_name: u.full_name || "User",
      photo_url: u.photo_url || null,
      scan_count: scanCounts[u.id] || 0,
      created_at: u.created_at,
    }))
    .sort((a, b) => {
      if (b.scan_count !== a.scan_count) return b.scan_count - a.scan_count;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    })
    .slice(0, LIMIT)
    .map(({ created_at, ...rest }) => rest);

  return users;
}

/**
 * Top 10 beaches by average rating.
 * - Primary sort: avg_rating DESC (tertinggi dulu)
 * - Secondary sort: created_at ASC (jika rating sama, yang pertama dibuat duluan)
 */
export async function getTopBeaches(): Promise<TopBeach[]> {
  // 1. Get ALL beaches with created_at
  const { data: allBeaches, error } = await supabaseAdmin
    .from("beaches")
    .select("id, name, image_url, created_at")
    .order("created_at", { ascending: true });

  if (error || !allBeaches) return [];

  // 2. Get all reviews
  const { data: reviews } = await supabaseAdmin
    .from("beach_reviews")
    .select("beach_id, rating");

  const beachRatings: Record<string, { sum: number; count: number }> = {};
  if (reviews) {
    for (const row of reviews) {
      if (!beachRatings[row.beach_id]) {
        beachRatings[row.beach_id] = { sum: 0, count: 0 };
      }
      beachRatings[row.beach_id].sum += row.rating;
      beachRatings[row.beach_id].count += 1;
    }
  }

  // 3. Merge + sort: avg_rating DESC, then created_at ASC
  const beaches: TopBeach[] = allBeaches
    .map((b) => {
      const rating = beachRatings[b.id];
      return {
        beach_id: b.id,
        name: b.name || "Pantai",
        image_url: b.image_url || null,
        avg_rating: rating ? Math.round((rating.sum / rating.count) * 10) / 10 : 0,
        review_count: rating ? rating.count : 0,
        created_at: b.created_at,
      };
    })
    .sort((a, b) => {
      if (b.avg_rating !== a.avg_rating) return b.avg_rating - a.avg_rating;
      if (b.review_count !== a.review_count) return b.review_count - a.review_count;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    })
    .slice(0, LIMIT)
    .map(({ created_at, ...rest }) => rest);

  return beaches;
}

/**
 * Get current user's rank among ALL users by scan count.
 * Returns rank (1-based) and scan_count.
 */
export async function getCurrentUserRank(userId: string): Promise<{ rank: number; scan_count: number }> {
  // 1. Get ALL users
  const { data: allUsers, error } = await supabaseAdmin
    .from("users")
    .select("id, created_at")
    .order("created_at", { ascending: true });

  if (error || !allUsers) return { rank: 0, scan_count: 0 };

  // 2. Get scan counts
  const { data: scans } = await supabaseAdmin
    .from("classification_history")
    .select("user_id");

  const scanCounts: Record<string, number> = {};
  if (scans) {
    for (const row of scans) {
      scanCounts[row.user_id] = (scanCounts[row.user_id] || 0) + 1;
    }
  }

  // 3. Sort all users: scan_count DESC, created_at ASC
  const sorted = allUsers
    .map((u) => ({
      id: u.id,
      scan_count: scanCounts[u.id] || 0,
      created_at: u.created_at,
    }))
    .sort((a, b) => {
      if (b.scan_count !== a.scan_count) return b.scan_count - a.scan_count;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  // 4. Find current user's position
  const rank = sorted.findIndex((u) => u.id === userId) + 1;
  const scan_count = scanCounts[userId] || 0;

  return { rank, scan_count };
}
