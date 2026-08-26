"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/db/write";

/**
 * Project CRUD server actions (Task 13.2).
 * Requirements: 5.1 (create/edit/delete), 5.3 (persist), 5.4 (reflect on public
 * site via revalidate), 5.5 (success), 5.6 (validation + value retention),
 * 5.7 (delete confirmation is enforced in the UI).
 */

export type ProjectFormState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Record<string, string[]>;
  formError?: string;
};

function parseForm(formData: FormData) {
  const testimonialQuote = String(formData.get("testimonialQuote") ?? "").trim();
  const testimonialAuthor = String(
    formData.get("testimonialAuthor") ?? "",
  ).trim();
  const testimonialRole = String(formData.get("testimonialRole") ?? "").trim();

  const hasTestimonial = testimonialQuote.length > 0 || testimonialAuthor.length > 0;

  const longDescription = String(formData.get("longDescription") ?? "").trim();

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    clientName: String(formData.get("clientName") ?? "").trim(),
    industry: String(formData.get("industry") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    previewImageUrl: String(formData.get("previewImageUrl") ?? "").trim(),
    previewImageAlt: String(formData.get("previewImageAlt") ?? "").trim(),
    liveSiteLink: String(formData.get("liveSiteLink") ?? "").trim(),
    longDescription: longDescription.length > 0 ? longDescription : undefined,
    testimonial: hasTestimonial
      ? {
          quote: testimonialQuote,
          authorName: testimonialAuthor,
          role: testimonialRole.length > 0 ? testimonialRole : undefined,
        }
      : undefined,
  };
}

function revalidatePublic(slug?: string) {
  revalidatePath("/"); // home / selected work
  if (slug) revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/projects");
}

export async function createProjectAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const input = parseForm(formData);
  const result = await createProject(input);

  if (!result.ok) {
    if (result.error.kind === "validation") {
      return { status: "error", fieldErrors: result.error.fieldErrors };
    }
    return {
      status: "error",
      formError: "Could not save the project. Please try again.",
    };
  }

  revalidatePublic(result.value.slug);
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const input = parseForm(formData);
  const result = await updateProject(id, input);

  if (!result.ok) {
    if (result.error.kind === "validation") {
      return { status: "error", fieldErrors: result.error.fieldErrors };
    }
    return {
      status: "error",
      formError: "Could not save the project. Please try again.",
    };
  }

  revalidatePublic(result.value.slug);
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await deleteProject(id);
  revalidatePublic();
  redirect("/admin/projects");
}
