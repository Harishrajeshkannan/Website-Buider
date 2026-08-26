"use server";

import { authServerClient } from "@/lib/db/clients";
import { validateImageUpload } from "@/lib/schema/upload";

/**
 * Image upload server action (Task 13.3).
 * Requirements: 3.1 (upload), 3.2 (store public URL), 3.3/3.4 (validate type +
 * size, re-checked server-side), 3.5 (on failure, no broken reference).
 *
 * Returns the public URL on success. The caller stores it on the project record
 * only after success, so a failed upload never leaves a broken reference.
 */

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const BUCKET = "project-images";

export async function uploadProjectImage(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose an image to upload." };
  }

  // Server-side re-validation (Req 3.4)
  const validation = validateImageUpload({ type: file.type, size: file.size });
  if (!validation.ok) {
    return { ok: false, error: validation.message };
  }

  const supabase = await authServerClient();

  const ext = file.type === "image/png"
    ? "png"
    : file.type === "image/webp"
      ? "webp"
      : "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    // Req 3.5 — surface error, create no reference
    return {
      ok: false,
      error: "The image could not be uploaded. Please try again.",
    };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
