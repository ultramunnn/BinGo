import { supabaseAdmin } from "../config/supabase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function create(userId: string): Promise<string | null> {
  const token = jwt.sign({ id: userId, purpose: "email_verification" }, JWT_SECRET, {
    expiresIn: "24h",
  });

  const { error } = await supabaseAdmin.from("email_verifications").insert({
    user_id: userId,
    token,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    verified: false,
  });

  return error ? null : token;
}

export async function validate(token: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("email_verifications")
    .select("user_id, verified, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  if (data.verified || new Date(data.expires_at) < new Date()) return null;

  return data.user_id;
}

export async function markVerified(token: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("email_verifications")
    .update({ verified: true })
    .eq("token", token);

  return !error;
}
