# Implementation Plan: Premium Portfolio Website

## Overview

This plan implements a premium, editorial portfolio website with **Next.js (App Router) + TypeScript**, **Tailwind CSS**, **Framer Motion**, **next/image**, and **Supabase** (Postgres, Storage, Auth). Work proceeds incrementally: scaffolding → typed schema layer → database schema/RLS/storage → typed data access layer → public site sections → admin dashboard → motion/responsive/accessibility polish → integration/component testing.

Each task builds on prior tasks and ends by wiring the new code into the running application, leaving no orphaned code. Property-based tests use `fast-check` with the tagging convention `// Feature: premium-portfolio-website, Property {number}: {property_text}` and run a minimum of 100 generated cases each (`fc.assert(..., { numRuns: 100 })`), one property-based test per correctness property.

## Tasks

- [ ] 1. Scaffold project foundation
  - [x] 1.1 Initialize Next.js App Router + TypeScript + Tailwind project
    - Create the Next.js App Router project with TypeScript strict mode and Tailwind CSS configured
    - Add the base directory structure: `app/(public)`, `app/admin`, `app/actions`, `lib/schema`, `lib/db`, `lib/motion`, `components/public`, `components/admin`, and `middleware.ts` stub
    - Configure `tailwind.config` with the desktop/tablet/mobile breakpoints (>=1024, 768-1023, <=767)
    - _Requirements: 16.1, 16.2, 16.3_

  - [ ] 1.2 Install and configure dependencies and test runner
    - Add Framer Motion, `@supabase/supabase-js`, `@supabase/ssr`, Zod, and `fast-check`
    - Configure the test runner (Vitest) with `fast-check` and a component-testing setup (Testing Library + jsdom)
    - Add environment variable handling for Supabase URL and anon key (typed access helper)
    - _Requirements: 2.1_

  - [ ] 1.3 Set up Supabase client factories
    - Implement the anon/public server client (anon key, RLS-bound) and the authenticated server client (session-cookie based) in `lib/db`
    - Ensure no service-role key is used in request paths and clients are server-only
    - _Requirements: 2.1, 4.1, 5.3_

- [ ] 2. Build the typed schema layer (Zod + inferred types)
  - [ ] 2.1 Implement shared validators and content-block/testimonial schemas
    - Implement `isValidHttpUrl` (WHATWG `URL`, requires http/https) and the email validator (exactly one `@`, at least one char before, at least one dot-separated domain after)
    - Implement `TestimonialEmbed`, `ContentBlock` schemas
    - _Requirements: 1.7, 15.6_

  - [ ]* 2.2 Write property test for live-site-link URL validation
    - **Property 4: Live-site-link URL validation**
    - **Validates: Requirements 1.7, 5.6**

  - [ ]* 2.3 Write property test for email format validation
    - **Property 29: Email format validation**
    - **Validates: Requirements 15.6**

  - [ ] 2.4 Implement `ProjectInput` schema and inferred type
    - Define all required fields (slug 1-60 with `^[a-z0-9-]+$`, clientName 1-100, industry 1-60, shortDescription 1-200, previewImageUrl non-empty, previewImageAlt 1-300, liveSiteLink valid http URL) and optional fields (longDescription 1-2000, detailSections array)
    - Export inferred type via `z.infer`
    - _Requirements: 1.1, 1.2, 18.1_

  - [ ]* 2.5 Write property test for required-field validation and offending-field identification
    - **Property 1: Required-field validation rejects and identifies the offending field**
    - **Validates: Requirements 1.1, 1.5, 5.6**

  - [ ]* 2.6 Write property test for optional-field presence/absence validation
    - **Property 2: Optional fields validate when present and are omittable when absent**
    - **Validates: Requirements 1.2**

  - [ ]* 2.7 Write property test for preview-image alt-text requirement
    - **Property 33: Every project preview image has non-empty alt text**
    - **Validates: Requirements 18.1**

  - [ ] 2.8 Implement `WebsiteTypeInput`, `SiteContentInput`, `InquiryInput`, and upload-validation schemas
    - WebsiteType: non-empty name and description; SiteContent: nullable content fields + non-null process fields; Inquiry: name 1-100, email 1-254 (email format), message 1-2000
    - Upload validator: accept iff MIME is JPEG/PNG/WebP and size <= 5MB, else reject with a message naming accepted formats and max size
    - _Requirements: 3.3, 3.4, 11.1, 15.2, 15.3, 7.1, 14.1, 12.2_

  - [ ]* 2.9 Write property test for website-type field validation
    - **Property 24: Non-empty name and description for website types**
    - **Validates: Requirements 11.1**

  - [ ]* 2.10 Write property test for contact-form field-length validation
    - **Property 27: Contact-form field-length validation**
    - **Validates: Requirements 15.2, 15.5**

  - [ ]* 2.11 Write property test for empty required contact fields
    - **Property 28: Empty required contact fields are rejected and identified**
    - **Validates: Requirements 15.5**

  - [ ]* 2.12 Write property test for upload type/size validation
    - **Property 8: Upload validation accepts only allowed type and size**
    - **Validates: Requirements 3.3, 3.4**

- [ ] 3. Checkpoint - schema layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create the database schema, constraints, RLS, and storage
  - [ ] 4.1 Write migration for content tables with constraints
    - Create `projects`, `testimonials`, `website_types`, `site_content`, `inquiries` tables with the exact columns, CHECK/UNIQUE/NOT NULL constraints, FK (`testimonials.project_id` UNIQUE, ON DELETE CASCADE), and timestamps from the design
    - Include the `live_site_link ~* '^https?://'` CHECK and the `site_content` singleton constraint
    - _Requirements: 1.1, 1.6, 1.7, 2.1, 11.1, 12.2, 13.1, 15.2, 15.3, 18.1_

  - [ ] 4.2 Write migration for `auth_attempts` table
    - Create `auth_attempts` (account_key PK, failed_count, locked_until, last_failed_at) for application-level lockout
    - _Requirements: 4.5_

  - [ ] 4.3 Write RLS policies for all tables
    - Public SELECT on `projects`/`testimonials`/`website_types`/`site_content`; INSERT/UPDATE/DELETE restricted to authenticated role
    - `inquiries`: public INSERT only, SELECT restricted to authenticated role
    - `auth_attempts`: no anon access
    - _Requirements: 2.1, 5.1, 5.2, 6.1, 15.3_

  - [ ] 4.4 Create the `project-images` Storage bucket and policies
    - Public-read bucket; write policy restricted to authenticated role; object keys by slug + uuid
    - _Requirements: 3.1, 3.2_

  - [ ]* 4.5 Write integration tests for RLS policies
    - Assert anon can select public content and insert inquiries but cannot select inquiries; authenticated role can write content and read inquiries
    - _Requirements: 5.1, 5.2, 6.1, 15.3_

- [ ] 5. Implement the typed data access layer (DAL)
  - [ ] 5.1 Implement `Result` type, `DbError` union, and `withTimeout` wrapper
    - Discriminated `Result<T,E>`; `DbError` = timeout | unreachable | unknown; `withTimeout(op, 10_000)` using `AbortController`
    - _Requirements: 2.3_

  - [ ]* 5.2 Write property test for typed data-access failures
    - **Property 6: Data-access failures produce a typed error, never an unhandled exception**
    - **Validates: Requirements 2.3, 6.4, 15.7**

  - [ ] 5.3 Implement public read functions with row-to-type mapping
    - `getSiteContent`, `getProjects`, `getProjectBySlug`, `getWebsiteTypes`, `getTestimonialForProject` (anon client, RLS public-read), each wrapped by `withTimeout` and returning `Result`
    - Empty reads return a success `Result` with empty collection/null (distinct from error)
    - _Requirements: 2.2, 2.3, 2.4, 8.7, 11.3, 13.4_

  - [ ]* 5.4 Write property test for empty result sets
    - **Property 7: Empty result sets yield an empty state without error**
    - **Validates: Requirements 2.4, 6.3, 8.7, 11.3**

  - [ ] 5.5 Implement admin write functions and inquiry functions
    - `createProject`/`updateProject`/`deleteProject` and analogous testimonial/website_type/site_content writers (authenticated client), validating via Zod first and mapping constraint violations (unique-slug) to `ValidationError`
    - `createInquiry` (public insert) and `listInquiries` (admin read, ordered `created_at DESC`)
    - _Requirements: 1.5, 1.6, 5.3, 5.6, 6.1, 15.3, 15.7_

  - [ ]* 5.6 Write property test for slug uniqueness enforcement
    - **Property 3: Slug uniqueness is enforced**
    - **Validates: Requirements 1.6**

  - [ ]* 5.7 Write property test for inquiry list ordering
    - **Property 13: Inquiry list ordering is most-recent-first**
    - **Validates: Requirements 6.1**

  - [ ]* 5.8 Write integration tests for DAL reads/writes and revalidation
    - Create/edit/delete each content type against a test Supabase project and confirm persistence; upload happy path stores public URL on project; assert `revalidatePath` yields a fresh public read within budget; representative page-load timing under normal conditions
    - _Requirements: 3.1, 3.2, 5.1, 5.2, 5.3, 5.4, 2.2_

- [ ] 6. Checkpoint - data layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement pure content/logic helpers used by the public site
  - [ ] 7.1 Implement placeholder resolution and description selection
    - `resolveContent` substitutes configured placeholders for missing/empty owner name, tagline, service statement, about text; `selectDescription` prefers non-empty long over short
    - _Requirements: 7.4, 7.5, 9.2, 14.2, 14.3_

  - [ ]* 7.2 Write property test for content placeholder substitution
    - **Property 14: Content placeholder substitution**
    - **Validates: Requirements 7.4, 7.5, 14.2, 14.3**

  - [ ]* 7.3 Write property test for detail description selection
    - **Property 18: Detail description selection prefers long over short**
    - **Validates: Requirements 9.2**

  - [ ] 7.4 Implement filter helpers and process-stage builder
    - `deriveFilterOptions` (unique industries + single "All", no duplicates), `filterProjects` (match industry or all), single-select selection logic, and `buildProcessStages` (exactly four, ordered Strategy→Design→Development→Launch)
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 12.1_

  - [ ]* 7.5 Write property test for filter option derivation
    - **Property 21: Filter options are the unique industries plus "All"**
    - **Validates: Requirements 10.1**

  - [ ]* 7.6 Write property test for filtering results
    - **Property 22: Filtering shows exactly the matching projects**
    - **Validates: Requirements 10.3, 10.4**

  - [ ]* 7.7 Write property test for single-category selection
    - **Property 23: At most one filter category is selected**
    - **Validates: Requirements 10.5**

  - [ ]* 7.8 Write property test for fixed ordered process stages
    - **Property 25: Process stages are the fixed ordered four**
    - **Validates: Requirements 12.1**

- [ ] 8. Implement motion configuration layer
  - [ ] 8.1 Implement Framer Motion variants and reduced-motion resolution
    - Export entrance variants (<=600ms, fire at 25% intersection) and micro-interaction transitions (<=300ms); implement reduced-motion resolver that returns instant/final-state transitions
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [ ]* 8.2 Write property test for motion timing budgets
    - **Property 31: Micro-interaction and entrance timing budgets**
    - **Validates: Requirements 17.2, 17.4**

  - [ ]* 8.3 Write property test for reduced-motion resolution
    - **Property 32: Reduced-motion disables transitions and shows final state**
    - **Validates: Requirements 17.3**

- [ ] 9. Build the public site shell and content sections
  - [ ] 9.1 Build the public layout shell with motion providers
    - Implement `app/(public)/layout.tsx` with nav, section entrance-motion wrapper (IntersectionObserver via Framer Motion), and reduced-motion wiring
    - _Requirements: 16.4, 17.1, 17.3_

  - [ ] 9.2 Implement Hero_Section (server) with CTA
    - Render owner name, tagline, service statement from `site_content` using placeholder resolution; client anchor CTA scrolls to `#contact`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 9.3 Implement ProjectCard client island
    - Dominant preview image via `next/image` with `sizes`; hover transition 150-400ms; `onError` fallback placeholder retaining details; DB-sourced alt text; live link opens new tab (`target="_blank" rel="noopener noreferrer"`); card body navigates to detail page
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8, 18.1_

  - [ ]* 9.4 Write property test for project card required fields
    - **Property 15: Project card renders all required fields**
    - **Validates: Requirements 8.1**

  - [ ]* 9.5 Write property test for image-load fallback
    - **Property 16: Image-load failure shows a fallback while retaining details**
    - **Validates: Requirements 8.8**

  - [ ] 9.6 Implement Selected_Work_Section with client Portfolio_Filter
    - Server fetches all projects and passes to a client filter+grid; "All" default, single-select in-memory filtering; empty-state when zero projects; renders `ProjectCard`s
    - _Requirements: 8.1, 8.7, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 9.7 Implement Website_Types, Process, and About sections (server)
    - Website types name+description with empty-safe render; exactly four ordered process stages from `site_content`; about text with placeholder handling
    - _Requirements: 11.1, 11.2, 11.3, 12.1, 12.2, 12.3, 14.1, 14.2, 14.3_

  - [ ] 9.8 Implement Contact_Section shell and Contact_Form client component
    - Final CTA statement; client form holds field state, validates via shared schema, submits to server action, shows confirmation, retains values and shows per-field messages on validation/persistence error
    - _Requirements: 15.1, 15.2, 15.4, 15.5, 15.6, 15.7_

  - [ ] 9.9 Implement the contact submit server action and wire the home page
    - Server action validates via Zod, inserts inquiry (anon client), returns success/error `Result`; assemble Hero, Selected Work, Website Types, Process, Testimonials, About, Contact into `app/(public)/page.tsx`
    - _Requirements: 2.4, 15.3, 15.7_

  - [ ]* 9.10 Write property test for valid submission persistence
    - **Property 30: Valid submission persists all fields with a timestamp**
    - **Validates: Requirements 15.3**

- [ ] 10. Build the Project_Detail_Page and 404
  - [ ] 10.1 Implement dynamic route `work/[slug]` with `generateStaticParams`
    - Enumerate project slugs for one page per project; display client name, industry, description (long else short), preview image, live link; render associated testimonial (quote + author + client name) when present; back-to-work navigation; `notFound()` on unknown slug
    - _Requirements: 9.1, 9.2, 9.3, 9.5, 13.2, 13.3_

  - [ ] 10.2 Implement `not-found.tsx` for unknown project slug
    - Render the 404 page returned for non-existent identifiers
    - _Requirements: 9.4_

  - [ ]* 10.3 Write property test for one detail page per project
    - **Property 17: Exactly one detail page per project**
    - **Validates: Requirements 9.1**

  - [ ]* 10.4 Write property test for testimonial association rendering
    - **Property 19: Testimonial is shown exactly when associated**
    - **Validates: Requirements 9.3, 13.2, 13.3**

  - [ ]* 10.5 Write property test for unknown-identifier 404
    - **Property 20: Unknown project identifier yields a 404**
    - **Validates: Requirements 9.4**

  - [ ]* 10.6 Write property test for optional-field omission rendering
    - **Property 5: Optional-field omission never causes a runtime error**
    - **Validates: Requirements 1.8**

- [ ] 11. Checkpoint - public site
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement admin authentication
  - [ ] 12.1 Implement auth middleware guard and inactivity expiry
    - `middleware.ts` redirects unauthenticated admin requests to sign-in; compares `last_active` cookie timestamp, expiring sessions after 30 minutes
    - _Requirements: 4.1, 4.2, 4.6_

  - [ ]* 12.2 Write property test for unauthenticated admin access
    - **Property 10: Unauthenticated requests never receive admin content**
    - **Validates: Requirements 4.1, 4.2**

  - [ ]* 12.3 Write property test for session validity window
    - **Property 12: Session validity is exactly the inactivity window**
    - **Validates: Requirements 4.6**

  - [ ] 12.4 Implement sign-in page, sign-in/sign-out server actions, and lockout gate
    - Sign-in form + action; lockout gate checks/updates `auth_attempts` (5 consecutive failures → 15-minute block); auth error on invalid credentials; establish session on success; sign-out ends session
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ]* 12.5 Write property test for sign-in lockout
    - **Property 11: Sign-in lockout after five consecutive failures**
    - **Validates: Requirements 4.5**

  - [ ]* 12.6 Write integration tests for auth happy path
    - Valid sign-in establishes a session; sign-out ends it
    - _Requirements: 4.3, 4.6_

- [ ] 13. Build the admin dashboard content management
  - [ ] 13.1 Implement the protected dashboard shell
    - `app/admin/layout.tsx` (protected) with navigation to Projects, Testimonials, Website Types, Site Content, Inquiries
    - _Requirements: 4.1, 5.1, 5.2_

  - [ ] 13.2 Implement Project CRUD (list, create/edit form, delete confirmation)
    - Table + form bound to `ProjectInput`; create/edit call write actions; delete requires explicit confirmation dialog; retain values and show per-field messages on invalid input; success confirmation; trigger `revalidatePath`
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ] 13.3 Implement the image upload widget
    - Client-side validate format (JPEG/PNG/WebP) and size (<=5MB); upload to Storage via server action (re-validated); store returned public URL on the project only on success; on non-validation failure show error and leave record unchanged
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 13.4 Write property test for failed-upload record integrity
    - **Property 9: Failed upload leaves the project record unchanged**
    - **Validates: Requirements 3.5**

  - [ ] 13.5 Implement Testimonials, Website Types, and Site Content managers
    - CRUD forms bound to their schemas; validate referential integrity for testimonials (existing project reference); persist via write actions with confirmation and revalidation
    - _Requirements: 5.2, 5.3, 5.5, 5.6, 13.1_

  - [ ]* 13.6 Write property test for testimonial field validation and referential integrity
    - **Property 26: Testimonial field validation and referential integrity**
    - **Validates: Requirements 13.1**

  - [ ] 13.7 Implement Inquiry list and detail views
    - Server-rendered list ordered most-recent-first with name/email/message/timestamp; detail view; empty-state when none; error-state when DB unreachable
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 14. Checkpoint - admin dashboard
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Responsive, accessibility, and final wiring
  - [ ] 15.1 Apply responsive layouts across all sections
    - Ensure desktop (>=1024), tablet (768-1023), mobile (<=767) layouts and no horizontal overflow at >=320px across all public sections and admin views
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ] 15.2 Apply accessibility across interactive controls
    - Keyboard operability of filter, live links, and form fields; visible focus indicators; DOM/tab order matching content order; no positive `tabindex`; DB-sourced alt text on preview images
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [ ]* 15.3 Write component tests for responsive layout
    - Assert no horizontal overflow at 320px / mobile / tablet / desktop widths across sections
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ]* 15.4 Write component tests for accessibility
    - Keyboard operability, visible focus, tab order matches content order, no positive `tabindex`
    - _Requirements: 18.2, 18.3, 18.4_

  - [ ]* 15.5 Write component tests for Selected Work card, filter, and contact form
    - Dominant-image layout class, `next/image` with `sizes`, hover duration 150-400ms, live link new tab; filter "All" default and single-select; contact-form value retention and success confirmation; delete confirmation required
    - _Requirements: 5.7, 8.2, 8.3, 8.5, 8.6, 10.2, 15.4, 15.5, 15.7_

  - [ ]* 15.6 Write component tests for motion behavior
    - Entrance transition fires at 25% intersection; reduced-motion disables transitions and shows final state
    - _Requirements: 17.1, 17.3_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional (tests) and can be skipped for a faster MVP, though all correctness properties and requirements are covered by them.
- Each task references specific granular requirements and/or a correctness property for traceability.
- Property-based tests use `fast-check` at >=100 runs, one test per property, tagged `// Feature: premium-portfolio-website, Property {number}: {property_text}`.
- Property and requirement coverage: Properties 1-33 are each mapped to a dedicated property-test sub-task; Requirements 1-18 are each covered by at least one implementation task. Requirement 5.4 revalidation and 2.2 page-load timing are covered by integration tests (5.8); 4.3 auth happy path by 12.6; RLS by 4.5.
- Checkpoints ensure incremental validation between major layers.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.8"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.9", "2.10", "2.11", "2.12"] },
    { "id": 4, "tasks": ["2.5", "2.6", "2.7"] },
    { "id": 5, "tasks": ["4.1", "4.2"] },
    { "id": 6, "tasks": ["4.3", "4.4"] },
    { "id": 7, "tasks": ["4.5", "5.1"] },
    { "id": 8, "tasks": ["5.2", "5.3"] },
    { "id": 9, "tasks": ["5.4", "5.5"] },
    { "id": 10, "tasks": ["5.6", "5.7", "5.8"] },
    { "id": 11, "tasks": ["7.1", "7.4", "8.1"] },
    { "id": 12, "tasks": ["7.2", "7.3", "7.5", "7.6", "7.7", "7.8", "8.2", "8.3"] },
    { "id": 13, "tasks": ["9.1", "9.2", "9.3", "9.7"] },
    { "id": 14, "tasks": ["9.4", "9.5", "9.6", "9.8"] },
    { "id": 15, "tasks": ["9.9", "10.1", "10.2"] },
    { "id": 16, "tasks": ["9.10", "10.3", "10.4", "10.5", "10.6"] },
    { "id": 17, "tasks": ["12.1", "12.4"] },
    { "id": 18, "tasks": ["12.2", "12.3", "12.5", "12.6", "13.1"] },
    { "id": 19, "tasks": ["13.2", "13.5", "13.7"] },
    { "id": 20, "tasks": ["13.3"] },
    { "id": 21, "tasks": ["13.4", "13.6", "15.1", "15.2"] },
    { "id": 22, "tasks": ["15.3", "15.4", "15.5", "15.6"] }
  ]
}
```
