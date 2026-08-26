import { z } from "zod";
import { isValidHttpUrl } from "./validators";

/**
 * Typed schema layer for projects and testimonials (Tasks 2.1, 2.4).
 *
 * Zod is the single source of truth; TypeScript types are inferred via z.infer.
 * The same schemas validate admin writes and shape typed reads
 * (design: Data Models / Typed Schema Layer).
 */

/** A rich-text / media block used in optional detail-page content (Req 1.2). */
export const ContentBlock = z.object({
  type: z.enum(["paragraph", "heading", "image", "quote"]),
  text: z.string().min(1).max(2000).optional(),
  imageUrl: z.string().min(1).optional(),
  imageAlt: z.string().min(1).max(300).optional(),
});
export type ContentBlock = z.infer<typeof ContentBlock>;

/** Embedded testimonial associated with a project (Req 1.2, 13.1). */
export const TestimonialEmbed = z.object({
  quote: z.string().min(1).max(1000),
  authorName: z.string().min(1).max(100),
  role: z.string().min(1).max(120).optional(),
});
export type TestimonialEmbed = z.infer<typeof TestimonialEmbed>;

/**
 * Project input schema (Req 1.1 required fields, 1.2 optional fields, 18.1 alt text).
 * `slug` is the unique identifier and is constrained to a URL-safe form.
 */
export const ProjectInput = z.object({
  // Required (Req 1.1)
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and hyphens only"),
  clientName: z.string().min(1).max(100),
  industry: z.string().min(1).max(60),
  shortDescription: z.string().min(1).max(200),
  previewImageUrl: z.string().min(1),
  previewImageAlt: z.string().min(1).max(300), // Req 18.1
  liveSiteLink: z
    .string()
    .min(1)
    .refine(isValidHttpUrl, "must be a valid http(s) URL"), // Req 1.7

  // Optional (Req 1.2)
  longDescription: z.string().min(1).max(2000).optional(),
  testimonial: TestimonialEmbed.optional(),
  detailSections: z.array(ContentBlock).optional(),
});
export type ProjectInput = z.infer<typeof ProjectInput>;

/**
 * A persisted project as read from the Database. Extends the input shape with
 * server-managed fields.
 */
export const Project = ProjectInput.extend({
  id: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof Project>;
