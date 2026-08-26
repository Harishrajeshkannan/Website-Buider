import type { Project, TestimonialEmbed } from "@/lib/schema/project";
import type { WebsiteType, SiteContent } from "@/lib/schema/content";
import type { Inquiry } from "@/lib/schema/inquiry";

/**
 * Row-to-type mappers (Task 5.3). Convert snake_case DB rows into the
 * camelCase typed shapes used throughout the app.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapTestimonial(row: any): TestimonialEmbed {
  return {
    quote: row.quote,
    authorName: row.author_name,
    role: row.role ?? undefined,
  };
}

export function mapProject(row: any): Project {
  return {
    id: row.id,
    slug: row.slug,
    clientName: row.client_name,
    industry: row.industry,
    shortDescription: row.short_description,
    previewImageUrl: row.preview_image_url,
    previewImageAlt: row.preview_image_alt,
    liveSiteLink: row.live_site_link,
    longDescription: row.long_description ?? undefined,
    detailSections: row.detail_sections ?? undefined,
    testimonial:
      row.testimonials && row.testimonials.length > 0
        ? mapTestimonial(row.testimonials[0])
        : row.testimonial
          ? mapTestimonial(row.testimonial)
          : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapWebsiteType(row: any): WebsiteType {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order ?? 0,
  };
}

export function mapSiteContent(row: any): SiteContent {
  return {
    id: row.id,
    ownerName: row.owner_name ?? null,
    tagline: row.tagline ?? null,
    serviceStatement: row.service_statement ?? null,
    aboutText: row.about_text ?? null,
    processStrategy: row.process_strategy ?? "",
    processDesign: row.process_design ?? "",
    processDevelopment: row.process_development ?? "",
    processLaunch: row.process_launch ?? "",
    contactEmail: row.contact_email ?? null,
    updatedAt: row.updated_at,
  };
}

export function mapInquiry(row: any): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    message: row.message,
    createdAt: row.created_at,
  };
}
