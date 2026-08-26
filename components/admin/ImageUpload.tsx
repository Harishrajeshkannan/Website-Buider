"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadProjectImage } from "@/app/actions/upload";
import { validateImageUpload } from "@/lib/schema/upload";

/**
 * Image upload widget (Task 13.3).
 * Requirements: 3.1-3.5. Client-side pre-validates format/size for instant
 * feedback; the server action re-validates and performs the upload. The
 * resulting public URL is written into a hidden input the project form submits.
 */
export function ImageUpload({
  name,
  altName,
  initialUrl,
  initialAlt,
}: {
  name: string; // hidden input name for the URL (e.g. "previewImageUrl")
  altName: string; // input name for the alt text
  initialUrl?: string;
  initialAlt?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [alt, setAlt] = useState(initialAlt ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string>();

  async function handleFile(file: File) {
    // Client-side pre-check (Req 3.4)
    const pre = validateImageUpload({ type: file.type, size: file.size });
    if (!pre.ok) {
      setError(pre.message);
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setError(undefined);

    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadProjectImage(fd);

    if (result.ok) {
      setUrl(result.url); // Req 3.2 — store URL only on success
      setStatus("idle");
    } else {
      setError(result.error); // Req 3.5 — surface error, keep existing url
      setStatus("error");
    }
  }

  return (
    <div>
      <label className="block text-sm text-muted">Preview image</label>

      {url && (
        <div className="relative mt-3 aspect-[16/10] w-full max-w-md overflow-hidden border border-line bg-paper-soft">
          <Image src={url} alt={alt || "Preview"} fill className="object-cover" sizes="400px" />
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
        className="mt-3 block w-full text-sm text-muted file:mr-4 file:border file:border-ink file:bg-paper file:px-4 file:py-2 file:text-sm file:text-ink hover:file:bg-paper-soft"
      />

      {status === "uploading" && (
        <p className="mt-2 text-sm text-muted">Uploading...</p>
      )}
      {status === "error" && error && (
        <p role="alert" className="mt-2 text-sm text-ink">
          {error}
        </p>
      )}

      {/* Submitted with the form */}
      <input type="hidden" name={name} value={url} readOnly />

      <div className="mt-4">
        <label htmlFor={altName} className="block text-sm text-muted">
          Image alt text (for accessibility)
        </label>
        <input
          id={altName}
          name={altName}
          type="text"
          maxLength={300}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-ink outline-none transition-colors duration-micro focus:border-ink"
          placeholder="Describe the image for screen readers"
        />
      </div>
    </div>
  );
}
