-- Tamny Plus Production Supabase SQL
-- This script creates the core schema, indexes, storage buckets, and basic RLS policies.

-- Extensions
create extension if not exists pgcrypto;

-- =====================================================================
-- 1) TABLES
-- =====================================================================

create table if not exists public.doctor_accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_profiles (
  id uuid primary key references public.doctor_accounts(id) on delete cascade,
  full_name_ar text not null,
  full_name_en text not null,
  gender text not null check (gender in ('male','female')),
  dob date not null,
  specialty_id text not null,
  sub_specialty_ar text,
  sub_specialty_en text,
  degree_ar text,
  degree_en text,
  experience_years integer not null default 0,
  clinic_name_ar text not null,
  clinic_name_en text not null,
  clinic_address_ar text,
  clinic_address_en text,
  governorate_id text not null,
  city_id text not null,
  google_maps_url text,
  phone_number text not null,
  whatsapp_number text not null,
  email text not null,
  clinic_price integer not null default 0,
  online_price integer not null default 0,
  bio_ar text,
  bio_en text,
  syndicate_number text,
  languages text[] not null default '{}',
  working_days integer[] not null default '{}',
  working_hours_start text,
  working_hours_end text,
  emergency_available boolean not null default false,
  website text,
  facebook text,
  instagram text,
  linkedin text,
  certificates text[] not null default '{}',
  clinic_photos text[] not null default '{}',
  cover_image text,
  profile_image text,
  rating_avg numeric(2,1) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(patient_id, doctor_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  patient_name text not null,
  patient_phone text not null,
  booking_date date not null,
  booking_time text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  patient_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  review_text text,
  is_approved boolean not null default false,
  review_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.doctor_analytics (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade unique,
  profile_views integer not null default 0,
  whatsapp_clicks integer not null default 0,
  booking_clicks integer not null default 0,
  visitors integer not null default 0,
  views_history jsonb not null default '[]'::jsonb,
  clicks_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key default 1,
  allow_new_registrations boolean not null default true,
  require_certificates_verification boolean not null default true,
  emergency_hotline text not null default '123'
);

create table if not exists public.clinic_images (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.doctor_certificates (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  certificate_url text not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- 2) INDEXES
-- =====================================================================

create index if not exists idx_doctor_profiles_specialty on public.doctor_profiles(specialty_id);
create index if not exists idx_doctor_profiles_governorate_city on public.doctor_profiles(governorate_id, city_id);
create index if not exists idx_reviews_doctor on public.reviews(doctor_id, is_approved);
create index if not exists idx_bookings_doctor_date on public.bookings(doctor_id, booking_date);
create index if not exists idx_favorites_patient on public.favorites(patient_id);

-- =====================================================================
-- 3) TRIGGERS / FUNCTIONS
-- =====================================================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_doctor_accounts_updated_at
before update on public.doctor_accounts
for each row execute function public.update_updated_at();

create trigger trg_doctor_profiles_updated_at
before update on public.doctor_profiles
for each row execute function public.update_updated_at();

create trigger trg_patients_updated_at
before update on public.patients
for each row execute function public.update_updated_at();

-- =====================================================================
-- 4) STORAGE BUCKETS
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('doctor-uploads', 'doctor-uploads', true)
on conflict (id) do nothing;

-- =====================================================================
-- 5) ROW LEVEL SECURITY
-- =====================================================================

alter table public.doctor_accounts enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.patients enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.doctor_analytics enable row level security;
alter table public.notifications enable row level security;
alter table public.settings enable row level security;
alter table public.clinic_images enable row level security;
alter table public.doctor_certificates enable row level security;

-- Drop existing policies if they exist to keep script idempotent
DROP POLICY IF EXISTS "Allow public read doctor profiles" ON public.doctor_profiles;
DROP POLICY IF EXISTS "Allow public read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow authenticated users to manage own patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to manage own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Allow authenticated users to manage own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated users to manage own reviews" ON public.reviews;

create policy "Allow public read doctor profiles"
on public.doctor_profiles
for select
using (true);

create policy "Allow public read reviews"
on public.reviews
for select
using (is_approved = true);

create policy "Allow public read settings"
on public.settings
for select
using (true);

create policy "Allow authenticated users to manage own patients"
on public.patients
for all
using (auth.uid()::text = id::text)
with check (auth.uid()::text = id::text);

create policy "Allow authenticated users to manage own favorites"
on public.favorites
for all
using (auth.uid()::text = patient_id::text)
with check (auth.uid()::text = patient_id::text);

create policy "Allow authenticated users to manage own bookings"
on public.bookings
for all
using (auth.uid()::text = doctor_id::text)
with check (auth.uid()::text = doctor_id::text);

create policy "Allow authenticated users to manage own reviews"
on public.reviews
for all
using (auth.uid()::text = doctor_id::text)
with check (auth.uid()::text = doctor_id::text);

-- =====================================================================
-- 6) DEFAULT SEED DATA
-- =====================================================================

insert into public.settings (id, allow_new_registrations, require_certificates_verification, emergency_hotline)
values (1, true, true, '123')
on conflict (id) do nothing;
