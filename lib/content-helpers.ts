import { contentPlaceholders } from "@/lib/env";
import type { Project } from "@/lib/schema/project";
import type { SiteContent } from "@/lib/schema/content";
import { PROCESS_STAGE_ORDER } from "@/lib/schema/content";

/**
 * Pure content/logic helpers used by the public site (Task 7).
 * These are pure functions so they can be property-tested directly
 * (Properties 14, 18, 21, 22, 23, 25).
 */

/** Resolved, display-ready site content with placeholders applied (Req 7.4, 7.5, 14.2, 14.3). */
export type ResolvedContent = {
  ownerName: string;
  tagline: string;
  serviceStatement: string;
  aboutText: string;
  contactEmail: string;
};

function pick(value: string | null | undefined, fallback: string): string {
  if (value == null) return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? value : fallback;
}

/**
 * Substitutes configured placeholders for missing/empty content fields.
 * Returns the DB value when present and non-empty, else the placeholder
 * (Property 14).
 */
export function resolveContent(
  content: SiteContent | null,
): ResolvedContent {
  return {
    ownerName: pick(content?.ownerName, contentPlaceholders.ownerName),
    tagline: pick(content?.tagline, contentPlaceholders.tagline),
    serviceStatement: pick(
      content?.serviceStatement,
      contentPlaceholders.serviceStatement,
    ),
    aboutText: pick(content?.aboutText, contentPlaceholders.aboutText),
    contactEmail: pick(content?.contactEmail, contentPlaceholders.contactEmail),
  };
}

/**
 * Selects the description shown on a detail page: long description when present
 * and non-empty, otherwise the short description (Property 18, Req 9.2).
 */
export function selectDescription(project: {
  longDescription?: string;
  shortDescription: string;
}): string {
  const long = project.longDescription?.trim();
  return long && long.length > 0 ? project.longDescription! : project.shortDescription;
}

/** The special "All" filter option value. */
export const ALL_FILTER = "All" as const;

/**
 * Derives filter options: the unique industries present in the projects plus a
 * single leading "All" option, with no duplicates (Property 21, Req 10.1).
 */
export function deriveFilterOptions(
  projects: Pick<Project, "industry">[],
): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const p of projects) {
    if (!seen.has(p.industry)) {
      seen.add(p.industry);
      unique.push(p.industry);
    }
  }
  return [ALL_FILTER, ...unique];
}

/**
 * Filters projects by the selected option: every project matching the selected
 * industry, or the full set when "All" is selected (Property 22, Req 10.3, 10.4).
 */
export function filterProjects<T extends Pick<Project, "industry">>(
  projects: T[],
  selected: string,
): T[] {
  if (selected === ALL_FILTER) return projects;
  return projects.filter((p) => p.industry === selected);
}

/** A single process stage with its name and description. */
export type ProcessStage = { name: string; description: string };

/**
 * Builds exactly the four fixed process stages, in order
 * Strategy -> Design -> Development -> Launch (Property 25, Req 12.1).
 */
export function buildProcessStages(
  content: Pick<
    SiteContent,
    | "processStrategy"
    | "processDesign"
    | "processDevelopment"
    | "processLaunch"
  > | null,
): ProcessStage[] {
  const map: Record<(typeof PROCESS_STAGE_ORDER)[number], string> = {
    Strategy: content?.processStrategy ?? "",
    Design: content?.processDesign ?? "",
    Development: content?.processDevelopment ?? "",
    Launch: content?.processLaunch ?? "",
  };
  return PROCESS_STAGE_ORDER.map((name) => ({
    name,
    description: map[name],
  }));
}
