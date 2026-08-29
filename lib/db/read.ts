import "server-only";
import { anonServerClient } from "./clients";
import { withTimeout, type Result, type DbError } from "./result";
import {
  mapProject,
  mapWebsiteType,
  mapSiteContent,
  mapTestimonial,
} from "./mappers";
import type { Project, TestimonialEmbed } from "@/lib/schema/project";
import type { WebsiteType, SiteContent } from "@/lib/schema/content";

/**
 * Public read functions (Task 5.3).
 * Requirements: 2.2, 2.3, 2.4, 8.7, 11.3, 13.4
 *
 * All reads go through withTimeout and return a Result. Empty reads are a
 * SUCCESS with an empty collection / null — distinct from an error — so the
 * UI can render an empty state rather than an error state (Property 7).
 */

export async function getProjects(): Promise<Result<Project[], DbError>> {
  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, testimonials(*)")
      .order("sort_order", { ascending: true })
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapProject);
  });
}

export async function getProjectBySlug(
  slug: string,
): Promise<Result<Project | null, DbError>> {
  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*, testimonials(*)")
      .eq("slug", slug)
      .abortSignal(signal)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapProject(data) : null;
  });
}

export async function getWebsiteTypes(): Promise<
  Result<WebsiteType[], DbError>
> {
  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("website_types")
      .select("*")
      .order("sort_order", { ascending: true })
      .abortSignal(signal);
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapWebsiteType);
  });
}

export async function getSiteContent(): Promise<
  Result<SiteContent | null, DbError>
> {
  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .limit(1)
      .abortSignal(signal)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapSiteContent(data) : null;
  });
}

export async function getTestimonialForProject(
  projectId: string,
): Promise<Result<TestimonialEmbed | null, DbError>> {
  const supabase = await anonServerClient();
  return withTimeout(async (signal) => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("project_id", projectId)
      .abortSignal(signal)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapTestimonial(data) : null;
  });
}
