import { createClient } from "@/lib/supabase/client";

/**
 * Direct browser -> Supabase Storage uploads. Files go straight to storage
 * (not through our server), respecting the storage RLS policies: the uploader
 * must be authenticated and owns what they upload. Files are namespaced under
 * the user's id.
 */

function fileExt(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "bin";
}

function randomName(file: File): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${id}.${fileExt(file)}`;
}

/** Upload to a public bucket and return a permanent public URL. */
export async function uploadPublicFile(
  bucket: "avatars" | "job-photos" | "review-photos",
  userId: string,
  file: File
): Promise<string> {
  const supabase = createClient();
  const path = `${userId}/${randomName(file)}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
}

/** Upload to the private licenses bucket and return the storage path (not a URL). */
export async function uploadPrivateFile(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const path = `${userId}/${randomName(file)}`;
  const { data, error } = await supabase.storage
    .from("licenses")
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return data.path;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_IMAGE_MB = 10;

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    return "That file is not an image.";
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `Image is too big (max ${MAX_IMAGE_MB}MB).`;
  }
  return null;
}
