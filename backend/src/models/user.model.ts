import { supabaseAdmin } from "../config/supabase";
import bcrypt from "bcrypt";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UserCreateInput = Pick<User, "email"> & {
  password: string;
  full_name?: string;
};

export type UserResponse = Omit<User, "password_hash" | "updated_at">;

const SAFE_COLUMNS = "id, email, full_name, photo_url, created_at";

export async function findByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  return error || !data ? null : (data as User);
}

export async function existsById(id: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  return !!data;
}

export async function emailExists(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return !!data;
}

export async function create(input: UserCreateInput): Promise<UserResponse | null> {
  const hashedPassword = await bcrypt.hash(input.password, 10);

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      email: input.email,
      password_hash: hashedPassword,
      full_name: input.full_name || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select(SAFE_COLUMNS)
    .single();

  if (error) {
    console.error("Supabase create user error:", JSON.stringify(error, null, 2));
    return null;
  }
  return data as UserResponse;
}

export async function updatePassword(id: string, newPassword: string): Promise<boolean> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabaseAdmin
    .from("users")
    .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
    .eq("id", id);

  return !error;
}

export type UserUpdateInput = Partial<Pick<User, "full_name" | "photo_url">>;

export async function updateProfile(id: string, updates: UserUpdateInput): Promise<UserResponse | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(SAFE_COLUMNS)
    .single();

  return error ? null : (data as UserResponse);
}

export async function getSanitized(id: string): Promise<UserResponse | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(SAFE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  return error || !data ? null : (data as UserResponse);
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}
