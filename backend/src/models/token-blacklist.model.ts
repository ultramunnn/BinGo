import { supabaseAdmin } from "../config/supabase";
import { decodeToken } from "../services/jwt.service";

export async function addToBlacklist(token: string): Promise<boolean> {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return false;

  const { error } = await supabaseAdmin.from("token_blacklist").insert({
    token,
    expires_at: new Date(decoded.exp * 1000).toISOString(),
  });

  return !error;
}

export async function isBlacklisted(token: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("token_blacklist")
    .select("token")
    .eq("token", token)
    .maybeSingle();

  if (error) return true; // fail-closed: assume blacklisted on DB error
  return !!data;
}

export async function cleanExpired(): Promise<void> {
  await supabaseAdmin
    .from("token_blacklist")
    .delete()
    .lt("expires_at", new Date().toISOString());
}