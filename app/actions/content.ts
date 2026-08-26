"use server";

import { revalidatePath } from "next/cache";
import {
  createWebsiteType,
  deleteWebsiteType,
  upsertSiteContent,
} from "@/lib/db/write";

/**
 * Website type + site content server actions (Task 13.5).
 * Requirements: 5.2 (manage website types + site content), 5.3 (persist),
 * 5.4 (revalidate public site), 5.5 (success), 5.6 (validation + retention).
 */

export type ContentFormState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string[]>;
  formError?: string;
};

export async function createWebsiteTypeAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const input = {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };
  const result = await createWebsiteType(input);

  if (!result.ok) {
    if (result.error.kind === "validation") {
      return { status: "error", fieldErrors: result.error.fieldErrors };
    }
    return { status: "error", formError: "Could not save. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/website-types");
  return { status: "success" };
}

export async function deleteWebsiteTypeAction(id: string): Promise<void> {
  await deleteWebsiteType(id);
  revalidatePath("/");
  revalidatePath("/admin/website-types");
}

export async function saveSiteContentAction(
  _prev: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const str = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v.length > 0 ? v : null;
  };

  const input = {
    ownerName: str("ownerName"),
    tagline: str("tagline"),
    serviceStatement: str("serviceStatement"),
    aboutText: str("aboutText"),
    processStrategy: String(formData.get("processStrategy") ?? ""),
    processDesign: String(formData.get("processDesign") ?? ""),
    processDevelopment: String(formData.get("processDevelopment") ?? ""),
    processLaunch: String(formData.get("processLaunch") ?? ""),
    contactEmail: str("contactEmail"),
  };

  const result = await upsertSiteContent(input);

  if (!result.ok) {
    if (result.error.kind === "validation") {
      return { status: "error", fieldErrors: result.error.fieldErrors };
    }
    return { status: "error", formError: "Could not save. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/site-content");
  return { status: "success" };
}
