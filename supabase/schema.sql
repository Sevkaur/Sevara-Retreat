-- Sevara Retreat — run in Supabase SQL Editor
-- Table for CMS content

create table if not exists public.site_content (
  element_id text primary key,
  content_type text not null check (content_type in ('text', 'image', 'video')),
  value text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists site_content_type_idx on public.site_content (content_type);

alter table public.site_content enable row level security;

create policy "site_content_select_public"
  on public.site_content for select
  using (true);

create policy "site_content_insert_authenticated"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

create policy "site_content_update_authenticated"
  on public.site_content for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "site_content_delete_authenticated"
  on public.site_content for delete
  using (auth.role() = 'authenticated');

-- Storage bucket (create in Dashboard → Storage if insert fails here)
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "site_media_public_read"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "site_media_authenticated_upload"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and auth.role() = 'authenticated');

create policy "site_media_authenticated_update"
  on storage.objects for update
  using (bucket_id = 'site-media' and auth.role() = 'authenticated');

create policy "site_media_authenticated_delete"
  on storage.objects for delete
  using (bucket_id = 'site-media' and auth.role() = 'authenticated');
