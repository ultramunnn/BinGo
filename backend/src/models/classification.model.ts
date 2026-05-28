import { supabase } from "../config/supabase";
import type { ClassificationRecord } from "../types/classification";

const TABLE = "classification_history";

export interface ClassificationCreateInput {
  user_id: string;
  image_url: string;
  waste_type: string;
  confidence: number;
  cv_confidence?: number;
  latitude: number;
  longitude: number;
  location_name?: string;
  beach_id?: string;
  recyclable: string;
  treatment: string;
  recyclable_confidence: number;
  treatment_confidence: number;
}

interface PaginatedResult {
  data: ClassificationRecord[];
  total: number;
}

export async function create(input: ClassificationCreateInput): Promise<ClassificationRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  return error ? null : (data as ClassificationRecord);
}

export async function findById(id: string): Promise<ClassificationRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select()
    .eq("id", id)
    .maybeSingle();

  return error || !data ? null : (data as ClassificationRecord);
}

export async function findByUserId(userId: string, page = 1, limit = 20): Promise<PaginatedResult> {
  return fetchPaginated(
    supabase.from(TABLE).select("*", { count: "exact" }).eq("user_id", userId),
    page,
    limit
  );
}

export async function findAll(page = 1, limit = 20): Promise<PaginatedResult> {
  return fetchPaginated(
    supabase.from(TABLE).select("*", { count: "exact" }),
    page,
    limit
  );
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  return !error;
}

async function fetchPaginated(query: any, page: number, limit: number): Promise<PaginatedResult> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    data: error ? [] : (data as ClassificationRecord[]),
    total: count ?? 0,
  };
}
