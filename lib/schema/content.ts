import { z } from "zod";

/**
 * Website type, site content, and process-stage schemas (Task 2.8).
 */

/** A website type / service offering (Req 11.1). */
export const WebsiteTypeInput = z.object({
  name: z.string().min(1).max(80),
  description: z.string().min(1).max(400),
  sortOrder: z.number().int().min(0).default(0),
});
export type WebsiteTypeInput = z.infer<typeof WebsiteTypeInput>;

export const WebsiteType = WebsiteTypeInput.extend({
  id: z.string().uuid(),
});
export type WebsiteType = z.infer<typeof WebsiteType>;

/**
 * Site content (Req 7, 12, 14). Content fields are nullable so the render
 * layer can substitute configured placeholders (Req 7.4, 7.5, 14.3) rather
 * than rejecting the row. Process descriptions default to empty strings.
 */
export const SiteContentInput = z.object({
  ownerName: z.string().max(100).nullable(),
  tagline: z.string().max(160).nullable(),
  serviceStatement: z.string().max(300).nullable(),
  aboutText: z.string().max(4000).nullable(),
  processStrategy: z.string().max(600).default(""),
  processDesign: z.string().max(600).default(""),
  processDevelopment: z.string().max(600).default(""),
  processLaunch: z.string().max(600).default(""),
  contactEmail: z.string().max(254).nullable(),
});
export type SiteContentInput = z.infer<typeof SiteContentInput>;

export const SiteContent = SiteContentInput.extend({
  id: z.string().uuid(),
  updatedAt: z.string(),
});
export type SiteContent = z.infer<typeof SiteContent>;

/** The four fixed process stages, in required order (Req 12.1). */
export const PROCESS_STAGE_ORDER = [
  "Strategy",
  "Design",
  "Development",
  "Launch",
] as const;
export type ProcessStageName = (typeof PROCESS_STAGE_ORDER)[number];
