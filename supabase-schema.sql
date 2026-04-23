-- ============================================================
-- SocialVIP Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text not null,
  gender        text not null check (gender in ('male','female','non_binary','prefer_not_to_say')) default 'prefer_not_to_say',
  date_of_birth date,
  bio           text,
  interests     text[] default '{}',
  availability  text[] default '{}',
  avatar_url    text,
  phone         text,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

-- ============================================================
-- EVENTS
-- ============================================================
create table if not exists events (
  id                uuid primary key default uuid_generate_v4(),
  title             text not null,
  description       text not null,
  short_description text not null,
  image_url         text,
  event_date        timestamptz not null,
  event_end_date    timestamptz,
  location          text not null,
  location_details  text,
  capacity          int not null check (capacity > 0),
  price             int not null default 0 check (price >= 0), -- in pence
  currency          text not null default 'gbp',
  status            text not null check (status in ('draft','published','cancelled','completed')) default 'draft',
  tags              text[] default '{}',
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table events enable row level security;

-- Anyone can view published events
create policy "Public can view published events"
  on events for select
  using (status = 'published');

-- Admins can do everything
create policy "Admins full access to events"
  on events for all
  using (
    exists (
      select 1 from profiles p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists bookings (
  id                 uuid primary key default uuid_generate_v4(),
  event_id           uuid not null references events(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  status             text not null check (status in ('pending','confirmed','cancelled','refunded')) default 'pending',
  payment_intent_id  text,
  stripe_session_id  text,
  amount_paid        int not null default 0,
  currency           text not null default 'gbp',
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique(event_id, user_id) -- one booking per user per event (can be lifted later)
);

alter table bookings enable row level security;

create policy "Users can view own bookings"
  on bookings for select using (auth.uid() = user_id);

create policy "Users can insert own bookings"
  on bookings for insert with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on bookings for update using (auth.uid() = user_id);

-- Admins can view all bookings
create policy "Admins can view all bookings"
  on bookings for select
  using (
    exists (
      select 1 from profiles p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

-- Service role (used by webhook) can update any booking
-- (handled automatically by service role key bypassing RLS)

-- ============================================================
-- VIEW: events_with_counts
-- Includes booking counts & spots remaining
-- ============================================================
create or replace view events_with_counts as
select
  e.*,
  coalesce(b.bookings_count, 0) as bookings_count,
  (e.capacity - coalesce(b.bookings_count, 0)) as spots_remaining
from events e
left join (
  select event_id, count(*) as bookings_count
  from bookings
  where status in ('confirmed', 'pending')
  group by event_id
) b on b.event_id = e.id;

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create or replace trigger update_events_updated_at
  before update on events
  for each row execute function update_updated_at_column();

create or replace trigger update_bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at_column();

-- ============================================================
-- MAKE YOURSELF AN ADMIN
-- After signing up, run this with your email:
-- UPDATE profiles SET is_admin = true WHERE email = 'jlasarow@gmail.com';
-- ============================================================
