import { supabaseAdmin } from "../config/supabase";

const DEFAULT_BUCKET = "avatars";

export async function uploadPhoto(
  userId: string,
  fileBuffer: Buffer,
  mimeType: string,
  bucket: string = DEFAULT_BUCKET
): Promise<string | null> {
  const ext = mimeType.split("/")[1] || "jpg";
  const filePath = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) return null;

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deletePhoto(url: string, bucket: string = DEFAULT_BUCKET): Promise<void> {
  const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
  if (!match) return;

  await supabaseAdmin.storage.from(bucket).remove([match[1]]);
}