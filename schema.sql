-- Chat Erdogan: initial schema. Review policies before production use.
create extension if not exists pgcrypto;

create type public.account_role as enum ('owner', 'trader');
create type public.account_status as enum ('pending', 'active', 'suspended', 'banned');
create type public.post_kind as enum ('طلب', 'بيع');
create type public.post_status as enum ('published', 'hidden', 'removed');
create type public.verification_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'تاجر' check (char_length(display_name) between 1 and 80),
  role public.account_role not null default 'trader',
  status public.account_status not null default 'pending',
  verified boolean not null default false,
  avatar_url text,
  banner_url text,
  bio text check (bio is null or char_length(bio) <= 500),
  contact_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.registration_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  message text check (message is null or char_length(message) <= 1000),
  status public.verification_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  kind public.post_kind not null,
  body text not null check (char_length(body) between 1 and 1500),
  status public.post_status not null default 'published',
  created_at timestamptz not null default now()
);
create index posts_feed_idx on public.posts(status, created_at desc);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete set null,
  participant_a uuid not null references public.profiles(id) on delete cascade,
  participant_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (participant_a <> participant_b)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index messages_conversation_idx on public.messages(conversation_id, created_at);

create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  note text check (note is null or char_length(note) <= 1500),
  status public.verification_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  trader_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references public.profiles(id),
  action text not null check (action in ('warning', 'suspend', 'ban', 'unban')),
  reason text not null check (char_length(reason) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 1000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.is_owner()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner' and status = 'active'
  );
$$;

create or replace function public.is_active_trader()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'active'
  );
$$;

-- New auth users get a pending trader profile. Never accept role from user metadata.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, status)
  values (
    new.id,
    coalesce(nullif(left(new.raw_user_meta_data->>'display_name', 80), ''), 'تاجر'),
    'trader',
    'pending'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.registration_requests enable row level security;
alter table public.posts enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.verification_requests enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.notifications enable row level security;

-- Profiles: active users can see public profile fields; users edit only non-privileged fields.
create policy "active users read profiles" on public.profiles for select
using (public.is_active_trader() or public.is_owner() or id = auth.uid());
create policy "user edits own public profile" on public.profiles for update
using (id = auth.uid() and status = 'active')
with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()) and status = (select p.status from public.profiles p where p.id = auth.uid()) and verified = (select p.verified from public.profiles p where p.id = auth.uid()));
create policy "owner manages profiles" on public.profiles for all
using (public.is_owner()) with check (public.is_owner());

-- Feed readable by active users and guests for published posts; only active traders post.
create policy "read published posts" on public.posts for select
using (status = 'published' or author_id = auth.uid() or public.is_owner());
create policy "active trader creates own posts" on public.posts for insert
with check (author_id = auth.uid() and public.is_active_trader());
create policy "author edits own posts" on public.posts for update
using (author_id = auth.uid() and public.is_active_trader())
with check (author_id = auth.uid() and public.is_active_trader());
create policy "owner moderates posts" on public.posts for all
using (public.is_owner()) with check (public.is_owner());

-- Conversations can only be viewed by their participants or owner.
create policy "participants read conversations" on public.conversations for select
using (auth.uid() in (participant_a, participant_b) or public.is_owner());
create policy "active traders start conversations" on public.conversations for insert
with check (public.is_active_trader() and auth.uid() in (participant_a, participant_b));

create policy "participants read messages" on public.messages for select
using (
  exists (select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() in (c.participant_a, c.participant_b))
  or public.is_owner()
);
create policy "participants send messages" on public.messages for insert
with check (
  sender_id = auth.uid() and public.is_active_trader()
  and exists (select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() in (c.participant_a, c.participant_b))
);

create policy "user reads own registration requests" on public.registration_requests for select
using (user_id = auth.uid() or public.is_owner());
create policy "user submits own registration request" on public.registration_requests for insert
with check (user_id = auth.uid() and status = 'pending');
create policy "owner reviews registration requests" on public.registration_requests for update
using (public.is_owner()) with check (public.is_owner());

create policy "user reads own verification requests" on public.verification_requests for select
using (user_id = auth.uid() or public.is_owner());
create policy "active user requests verification" on public.verification_requests for insert
with check (user_id = auth.uid() and status = 'pending' and public.is_active_trader());
create policy "owner reviews verification requests" on public.verification_requests for update
using (public.is_owner()) with check (public.is_owner());

create policy "owner manages moderation actions" on public.moderation_actions for all
using (public.is_owner()) with check (public.is_owner());
create policy "user reads own notifications" on public.notifications for select
using (user_id = auth.uid() or public.is_owner());
create policy "user marks own notifications read" on public.notifications for update
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Realtime feed: enable in Supabase Dashboard > Database > Replication if not already enabled.
-- Add public.posts and public.messages to the supabase_realtime publication as needed.
