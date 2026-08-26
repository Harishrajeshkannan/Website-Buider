-- Migration 0003: Row Level Security policies (Task 4.3)
-- Requirements: 2.1, 5.1, 5.2, 6.1, 15.3
--
-- Security model:
--   projects / testimonials / website_types / site_content
--       -> public SELECT (anon), authenticated INSERT/UPDATE/DELETE
--   inquiries
--       -> public INSERT only (anon), authenticated SELECT
--   auth_attempts
--       -> no anon/authenticated access (managed server-side only)
--
-- This is what makes the public anon key safe to ship to the browser: RLS,
-- not key secrecy, is the enforcement boundary.

-- Enable RLS on every table
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.website_types  enable row level security;
alter table public.site_content   enable row level security;
alter table public.inquiries      enable row level security;
alter table public.auth_attempts  enable row level security;

-- ---------------------------------------------------------------------------
-- Public content: anyone can read, only authenticated users can write
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'testimonials', 'website_types', 'site_content']
  loop
    execute format('drop policy if exists %I on public.%I;', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true);',
      t || '_public_read', t
    );

    execute format('drop policy if exists %I on public.%I;', t || '_auth_write', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true);',
      t || '_auth_write', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- inquiries: anon can INSERT (contact form), only authenticated can SELECT
-- ---------------------------------------------------------------------------
drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert
  on public.inquiries for insert to anon, authenticated
  with check (true);

drop policy if exists inquiries_auth_read on public.inquiries;
create policy inquiries_auth_read
  on public.inquiries for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- auth_attempts: no client access at all. With RLS enabled and no policies,
-- anon/authenticated are denied. Server-side lockout logic uses a privileged
-- context (service role) outside the public request path.
-- ---------------------------------------------------------------------------
-- (intentionally no policies)
