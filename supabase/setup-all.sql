-- =====================================================================
-- Premium Portfolio Website — full database setup
-- Paste this entire file into the Supabase SQL Editor and click "Run".
-- Safe to re-run (idempotent).
-- =====================================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique
    references public.projects (id) on delete cascade,
  quote text not null check (char_length(quote) between 1 and 1000),
  author_name text not null check (char_length(author_name) between 1 and 100),
  role text check (role is null or char_length(role) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- website_types
-- ---------------------------------------------------------------------
create table if not exists public.website_types (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  description text not null check (char_length(description) between 1 and 400),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists website_types_set_updated_at on public.website_types;
create trigger website_types_set_updated_at
  before update on public.website_types
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- site_content (singleton)
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton = true),
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

-- ---------------------------------------------------------------------
-- inquiries
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 1 and 254),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- ---------------------------------------------------------------------
-- auth_attempts (lockout support)
-- ---------------------------------------------------------------------
create table if not exists public.auth_attempts (
  account_key text primary key,
  failed_count int not null default 0,
  locked_until timestamptz,
  last_failed_at timestamptz
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.website_types  enable row level security;
alter table public.site_content   enable row level security;
alter table public.inquiries      enable row level security;
alter table public.auth_attempts  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projects','testimonials','website_types','site_content']
  loop
    execute format('drop policy if exists %I on public.%I;', t || '_public_read', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true);', t || '_public_read', t);
    execute format('drop policy if exists %I on public.%I;', t || '_auth_write', t);
    execute format('create policy %I on public.%I for all to authenticated using (true) with check (true);', t || '_auth_write', t);
  end loop;
end $$;

drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert
  on public.inquiries for insert to anon, authenticated with check (true);
drop policy if exists inquiries_auth_read on public.inquiries;
create policy inquiries_auth_read
  on public.inquiries for select to authenticated using (true);

-- ---------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images','project-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists project_images_public_read on storage.objects;
create policy project_images_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');
drop policy if exists project_images_auth_write on storage.objects;
create policy project_images_auth_write
  on storage.objects for all to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

-- ---------------------------------------------------------------------
-- Seed content (optional; safe to keep — replace via admin later)
-- ---------------------------------------------------------------------
insert into public.site_content (
  singleton, owner_name, tagline, service_statement, about_text,
  process_strategy, process_design, process_development, process_launch, contact_email
) values (
  true,
  'Studio Name',
  'Websites that mean business',
  'I design and build premium websites for modern businesses — editorial, fast, and built to convert.',
  'I''m an independent designer and developer partnering with businesses to craft websites that feel considered end to end. Every project is treated as a product: strategy first, design that earns attention, and engineering that holds up.',
  'We start by understanding your business, audience, and goals — mapping the story the site needs to tell before a single pixel is placed.',
  'Editorial, typography-led design with generous whitespace and large visuals. Every screen is designed to feel premium and intentional.',
  'Clean, performant builds with responsive layouts, accessibility, and subtle motion — engineered to load fast and last.',
  'A smooth launch with the details handled: performance checks, cross-device testing, and a handover you can build on.',
  'hello@example.com'
) on conflict (singleton) do nothing;

insert into public.website_types (name, description, sort_order) values
  ('Marketing & Brand Sites', 'Editorial sites that position a business with clarity and confidence.', 1),
  ('E-commerce', 'Considered storefronts that make browsing and buying feel effortless.', 2),
  ('Landing Pages', 'Focused, high-converting pages built around a single clear goal.', 3),
  ('Web Apps & Dashboards', 'Interfaces for products and internal tools that stay usable at scale.', 4)
on conflict do nothing;

insert into public.projects (
  slug, client_name, industry, short_description,
  preview_image_url, preview_image_alt, live_site_link, long_description, sort_order
) values
  ('northwind-coffee','Northwind Coffee','Hospitality',
   'A warm, editorial site for a specialty coffee roaster, built around big imagery and a calm reading rhythm.',
   'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80',
   'Northwind Coffee website shown on a laptop with a warm hero image',
   'https://example.com',
   'Northwind wanted a site that felt as considered as their roast. We led with full-bleed imagery, a restrained type system, and a shop that stays out of the way of the product.',1),
  ('atlas-architecture','Atlas Architecture','Architecture',
   'A minimal portfolio for an architecture studio, letting large project photography carry the page.',
   'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80',
   'Atlas Architecture portfolio homepage with a large building photograph',
   'https://example.com',
   'For Atlas we designed a near-invisible interface: whitespace, quiet navigation, and generous project galleries that place the work first.',2),
  ('verdant-skincare','Verdant Skincare','E-commerce',
   'A clean, conversion-focused storefront for a natural skincare brand.',
   'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1600&q=80',
   'Verdant Skincare product page with soft neutral tones',
   'https://example.com',
   'Verdant needed an e-commerce experience that felt premium without clutter. We built a fast storefront with editorial product storytelling and a frictionless checkout.',3)
on conflict (slug) do nothing;

insert into public.testimonials (project_id, quote, author_name, role)
select id,
  'They understood our brand better than we did. The site does the selling for us now.',
  'Maya Chen', 'Founder, Northwind Coffee'
from public.projects where slug = 'northwind-coffee'
on conflict (project_id) do nothing;

-- Done. Verify with:  select count(*) from public.projects;
