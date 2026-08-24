-- Coraeli: estrutura necessária para publicar e compartilhar presentes.
-- Execute este arquivo uma única vez no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  status text not null default 'draft',
  theme_id text not null default 'aurora',
  recipient_name text not null default 'Alguém especial',
  content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gifts
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists slug text,
  add column if not exists status text not null default 'draft',
  add column if not exists theme_id text not null default 'aurora',
  add column if not exists recipient_name text not null default 'Alguém especial',
  add column if not exists content jsonb not null default '{}'::jsonb,
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists gifts_slug_unique_idx
  on public.gifts (slug)
  where slug is not null;

create index if not exists gifts_user_id_idx on public.gifts (user_id);
create index if not exists gifts_status_idx on public.gifts (status);

alter table public.gifts enable row level security;

drop policy if exists "Users can read their gifts and published gifts" on public.gifts;
create policy "Users can read their gifts and published gifts"
on public.gifts
for select
using (status = 'published' or auth.uid() = user_id);

drop policy if exists "Users can create their gifts" on public.gifts;
create policy "Users can create their gifts"
on public.gifts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their gifts" on public.gifts;
create policy "Users can update their gifts"
on public.gifts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their gifts" on public.gifts;
create policy "Users can delete their gifts"
on public.gifts
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit)
values ('gift-media', 'gift-media', true, 26214400)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Users can upload their gift media" on storage.objects;
create policy "Users can upload their gift media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gift-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their gift media" on storage.objects;
create policy "Users can update their gift media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'gift-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'gift-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their gift media" on storage.objects;
create policy "Users can delete their gift media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gift-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
