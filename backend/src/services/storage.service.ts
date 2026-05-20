import { supabaseAdmin } from "../config/supabase";

const BUCKET = "avatars";

export async function uploadPhoto(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<string | null> {
  const ext = mimeType.split("/")[1] || "jpg";
  const filePath = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) return null;

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deletePhoto(url: string): Promise<void> {
  // Extract path from URL: .../object/public/avatars/userId/timestamp.ext
  const match = url.match(/\/avatars\/(.+)$/);
  if (!match) return;

  await supabaseAdmin.storage.from(BUCKET).remove([match[1]]);
}