/**
 * Image upload validation (Task 2.8; Req 3.3, 3.4).
 *
 * Pure function so it can be property-tested directly (Property 8) and reused
 * by both the client-side pre-check and the server-side upload action.
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB (Req 3.3)

export const ACCEPTED_FORMATS_LABEL = "JPEG, PNG, or WebP";
export const MAX_SIZE_LABEL = "5 MB";

export type UploadValidation =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Accepts iff the MIME type is one of JPEG/PNG/WebP and the byte size is at
 * most 5 MB. Otherwise rejects with a message naming the accepted formats and
 * maximum size (Req 3.4).
 */
export function validateImageUpload(input: {
  type: string;
  size: number;
}): UploadValidation {
  const typeOk = (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(
    input.type,
  );
  const sizeOk = input.size >= 0 && input.size <= MAX_IMAGE_BYTES;

  if (typeOk && sizeOk) {
    return { ok: true };
  }

  return {
    ok: false,
    message: `Image must be ${ACCEPTED_FORMATS_LABEL} and no larger than ${MAX_SIZE_LABEL}.`,
  };
}
