import "server-only";
import { authServerClient } from "./clients";
import {
  withTimeout,
  type Result,
  type DbError,
  type ValidationError,
} from "./result";
import { mapProject, mapWebsiteType, mapSiteContent } from "./mappers";
import { ProjectInput, type Project } from "@/lib/schema/project";
import {
  WebsiteTypeInput,
  SiteContentInput,
  type WebsiteType,
  type SiteContent,
} from "@/lib/schema/content";
import type { ZodError } from "zod";

/**
 * Admin write functions (Task 5.5).
 * Requirements: 1.5, 1.6, 5.3, 5.6
 *
 * Every write validates through the shared Zod schema first, then writes via
 * the authenticated client (RLS authenticated-write). DB constraint violations
 * (e.g. duplicate slug) are mapped to a ValidationError rather than surfacing
 * as a raw error.
 */

function zodToValidationError(error: ZodError): ValidationError {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { kind: "validation", fieldErrors };
}

function mapConstraintError(message: string): ValidationError | null {
  if (/duplicate key|unique/i.test(message) && /slug/i.test(message)) {
    return {
      kind: "validation",
      fieldErrors: { slug: ["A project with this slug already exists."] },
    };
  }
  return null;
}

function toDbRow(input: ProjectInput) {
  return {
    slug: input.slug,
    client_name: input.clientName,
    industry: input.industry,
    short_description: input.shortDescription,
    preview_image_url: input.previewImageUrl,
    preview_image_alt: input.previewImageAlt,
    live_site_link: input.liveSiteLink,
    long_description: input.longDescription ?? null,
    detail_sections: input.detailSections ?? null,
  };
}

/**
 * Upserts or clears the testimonial for a project (Req 13.1). Testimonials live
 * in their own table with a UNIQUE project_id, so we upsert on that key or
 * delete when no testimonial is provided.
 */
async function syncTestimonial(
  supabase: Awaited<ReturnType<typeof authServerClient>>,
  projectId: string,
  testimonial: ProjectInput["testimonial"],
): Promise<void> {
  if (testimonial) {
    await supabase.from("testimonials").upsert(
      {
        project_id: projectId,
        quote: testimonial.quote,
        author_name: testimonial.authorName,
        role: testimonial.role ?? null,
      },
      { onConflict: "project_id" },
    );
  } else {
    await supabase.from("testimonials").delete().eq("project_id", projectId);
  }
}

export async function createProject(
  raw: unknown,
): Promise<Result<Project, ValidationError | DbError>> {
  const parsed = ProjectInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: zodToValidationError(parsed.error) };

  const supabase = await authServerClient();
  const result = await withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("projects")
      .insert(toDbRow(parsed.data))
      .select("id")
      .single()
      .abortSignal(signal);
    if (error) throw new Error(error.message);

    await syncTestimonial(supabase, data.id, parsed.data.testimonial);

    const { data: full, error: readErr } = await supabase
      .from("projects")
      .select("*, testimonials(*)")
      .eq("id", data.id)
      .single();
    if (readErr) throw new Error(readErr.message);
    return mapProject(full);
  });

  if (!result.ok && result.error.kind === "unknown") {
    const ve = mapConstraintError(result.error.detail ?? "");
    if (ve) return { ok: false, error: ve };
  }
  return result;
}

export async function updateProject(
  id: string,
  raw: unknown,
): Promise<Result<Project, ValidationError | DbError>> {
  const parsed = ProjectInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: zodToValidationError(parsed.error) };

  const supabase = await authServerClient();
  const result = await withTimeout(async (signal) => {
    const { error } = await supabase
      .from("projects")
      .update(toDbRow(parsed.data))
      .eq("id", id)
      .abortSignal(signal);
    if (error) throw new Error(error.message);

    await syncTestimonial(supabase, id, parsed.data.testimonial);

    const { data: full, error: readErr } = await supabase
      .from("projects")
      .select("*, testimonials(*)")
      .eq("id", id)
      .single();
    if (readErr) throw new Error(readErr.message);
    return mapProject(full);
  });

  if (!result.ok && result.error.kind === "unknown") {
    const ve = mapConstraintError(result.error.detail ?? "");
    if (ve) return { ok: false, error: ve };
  }
  return result;
}

export async function deleteProject(
  id: string,
): Promise<Result<void, DbError>> {
  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

export async function createWebsiteType(
  raw: unknown,
): Promise<Result<WebsiteType, ValidationError | DbError>> {
  const parsed = WebsiteTypeInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: zodToValidationError(parsed.error) };

  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("website_types")
      .insert({
        name: parsed.data.name,
        description: parsed.data.description,
        sort_order: parsed.data.sortOrder,
      })
      .select("*")
      .single()
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return mapWebsiteType(data);
  });
}

export async function deleteWebsiteType(
  id: string,
): Promise<Result<void, DbError>> {
  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { error } = await supabase
      .from("website_types")
      .delete()
      .eq("id", id)
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return undefined;
  });
}

export async function upsertSiteContent(
  raw: unknown,
): Promise<Result<SiteContent, ValidationError | DbError>> {
  const parsed = SiteContentInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: zodToValidationError(parsed.error) };

  const supabase = await authServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          singleton: true,
          owner_name: parsed.data.ownerName,
          tagline: parsed.data.tagline,
          service_statement: parsed.data.serviceStatement,
          about_text: parsed.data.aboutText,
          process_strategy: parsed.data.processStrategy,
          process_design: parsed.data.processDesign,
          process_development: parsed.data.processDevelopment,
          process_launch: parsed.data.processLaunch,
          contact_email: parsed.data.contactEmail,
        },
        { onConflict: "singleton" },
      )
      .select("*")
      .single()
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return mapSiteContent(data);
  });
}
