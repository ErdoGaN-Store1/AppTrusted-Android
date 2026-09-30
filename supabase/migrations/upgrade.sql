-- Run this in Supabase SQL Editor after the original schema.sql.
-- Group chat rooms: messages persist unless manually deleted by a database owner.
create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  room text not null check (room in ('orders','sales')),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists group_messages_room_created_idx
  on public.group_messages(room, created_at asc);
alter table public.group_messages enable row level security;

drop policy if exists "active traders read group messages" on public.group_messages;
create policy "active traders read group messages" on public.group_messages
for select using (public.is_active_trader() or public.is_owner());

drop policy if exists "active traders send group messages" on public.group_messages;
create policy "active traders send group messages" on public.group_messages
for insert with check (sender_id = auth.uid() and public.is_active_trader());

-- Allow users to edit their own non-privileged profile fields.
-- Existing profile policies from schema.sql should remain in place.

-- Public avatar bucket. Upload is restricted to the signed-in user's own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 4194304;

drop policy if exists "users upload own avatar" on storage.objects;
create policy "users upload own avatar" on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users update own avatar" on storage.objects;
create policy "users update own avatar" on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "public read avatars" on storage.objects;
create policy "public read avatars" on storage.objects for select
using (bucket_id = 'avatars');

-- Enable realtime for group messages.
do $$
begin
  alter publication supabase_realtime add table public.group_messages;
exception when duplicate_object then null;
when undefined_object then null;
end $$;
