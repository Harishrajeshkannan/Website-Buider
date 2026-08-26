-- Migration 0004: Storage bucket for project images (Task 4.4)
-- Requirements: 3.1, 3.2
--
-- Public-read bucket; only authenticated users can upload/update/delete.
-- File-type and size limits are also enforced in application code
-- (validateImageUpload) per Req 3.3/3.4 — the bucket config is defense in depth.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read of objects in the bucket
drop policy if exists project_images_public_read on storage.objects;
create policy project_images_public_read
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');

-- Authenticated write (insert/update/delete)
drop policy if exists project_images_auth_write on storage.objects;
create policy project_images_auth_write
  on storage.objects for all to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');
