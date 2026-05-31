import { supabaseAdmin } from "../config/supabase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function create(userId: string): Promise<string | null> {
  const token = jwt.sign({ id: userId, purpose: "password_reset" }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const { error } = await supabaseAdmin.from("password_resets").insert({
    user_id: userId,
    token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    used: false,
  });

  return error ? null : token;
}

export async function validate(token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("password_resets")
    .select("user_id, used, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  if (data.used || new Date(data.expires_at) < new Date()) return null;

  return data.user_id;
}

export async function markUsed(token: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("password_resets")
    .update({ used: true })
    .eq("token", token);

  return !error;
}
