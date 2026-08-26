-- Migration 0001: Content tables with constraints (Task 4.1)
-- Requirements: 1.1, 1.6, 1.7, 2.1, 11.1, 12.2, 13.1, 15.2, 15.3, 18.1
--
-- Run this in the Supabase SQL editor (or via the Supabase CLI).

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Reusable updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- projects (Req 1.1, 1.6, 1.7, 18.1)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (char_length(slug) between 1 and 60)
    check (slug ~ '^[a-z0-9-]+$'),
  client_name text not null
    check (char_length(client_name) between 1 and 100),
  industry text not null
    check (char_length(industry) between 1 and 60),
  short_description text not null
    check (char_length(short_description) between 1 and 200),
  preview_image_url text not null
    check (char_length(preview_image_url) >= 1),
  preview_image_alt text not null
    check (char_length(preview_image_alt) between 1 and 300),
  live_site_link text not null
    check (live_site_link ~* '^https?://'),
  long_description text
    check (long_description is null or char_length(long_description) between 1 and 2000),
  detail_sections jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_industry_idx on public.projects (industry);
create index if not exists projects_sort_idx on public.projects (sort_order);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- testimonials (Req 13.1) — at most one per project
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique
    references public.projects (id) on delete cascade,
  quote text not null
    check (char_length(quote) between 1 and 1000),
  author_name text not null
    check (char_length(author_name) between 1 and 100),
  role text
    check (role is null or char_length(role) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- website_types (Req 11.1)
-- ---------------------------------------------------------------------------
create table if not exists public.website_types (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(name) between 1 and 80),
  description text not null
    check (char_length(description) between 1 and 400),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists website_types_set_updated_at on public.website_types;
create trigger website_types_set_updated_at
  before update on public.website_types
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- site_content (Req 7, 12, 14) — singleton row
-- Nullable content fields let the render layer substitute placeholders.
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique
    check (singleton = true),
  owner_name text check (owner_name is null or char_length(owner_name) <= 100),
  tagline text check (tagline is null or char_length(tagline) <= 160),
  service_statement text check (service_statement is null or char_length(service_statement) <= 300),
  about_text text check (about_text is null or char_length(about_text) <= 4000),
  process_strategy text not null default '',
  process_design text not null default '',
  process_development text not null default '',
  process_launch text not null default '',
  contact_email text check (contact_email is null or char_length(contact_email) <= 254),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- inquiries (Req 15.2, 15.3)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(name) between 1 and 100),
  email text not null
    check (char_length(email) between 1 and 254),
  message text not null
    check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
