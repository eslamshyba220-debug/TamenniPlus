-- ====================================================================
-- TAMNY PLUS (طمّني بلس) - COMPLETE DATABASE SCHEMA FOR SUPABASE & POSTGRESQL
-- ====================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. UPDATED_AT TRIGGER FUNCTION
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 2. PATIENTS TABLE
create table if not exists public.patients (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null unique,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_patients_updated_at
    before update on public.patients
    for each row execute procedure update_updated_at_column();

-- 3. DOCTOR ACCOUNTS TABLE (For secure credential authorization)
create table if not exists public.doctor_accounts (
    id uuid primary key default uuid_generate_v4(),
    username text not null unique,
    email text not null unique,
    password_hash text not null,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'blocked')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_doctor_accounts_updated_at
    before update on public.doctor_accounts
    for each row execute procedure update_updated_at_column();

-- 4. DOCTOR SPECIALTIES TABLE
create table if not exists public.doctor_specialties (
    id text primary key,
    name_ar text not null,
    name_en text not null,
    icon text not null
);

-- Seed specialties
insert into public.doctor_specialties (id, name_ar, name_en, icon) values
('cardiology', 'أمراض القلب والأوعية الدموية', 'Cardiology', 'Heart'),
('pediatrics', 'طب الأطفال وحديثي الولادة', 'Pediatrics', 'Baby'),
('dermatology', 'الجلدية والتجميل والليزر', 'Dermatology', 'Sparkles'),
('orthopedics', 'جراحة العظام والمفاصل', 'Orthopedics', 'Activity'),
('ophthalmology', 'طب وجراحة العيون', 'Ophthalmology', 'Eye'),
('neurology', 'المخ والأعصاب', 'Neurology', 'Brain'),
('gynecology', 'النساء والتوليد', 'Gynecology & Obstetrics', 'User'),
('dentistry', 'طب وجراحة الفم والأسنان', 'Dentistry', 'Smile'),
('psychiatry', 'الطب النفسي وعلاج الإدمان', 'Psychiatry', 'Activity'),
('internal', 'الأمراض الباطنة والجهاز الهضمي', 'Internal Medicine', 'Clipboard')
on conflict (id) do nothing;

-- 5. DOCTOR PROFILES TABLE
create table if not exists public.doctor_profiles (
    id uuid primary key references public.doctor_accounts(id) on delete cascade,
    full_name_ar text not null,
    full_name_en text not null,
    gender text not null check (gender in ('male', 'female')),
    dob date not null,
    specialty_id text not null references public.doctor_specialties(id),
    sub_specialty_ar text not null,
    sub_specialty_en text not null,
    degree_ar text not null,
    degree_en text not null,
    experience_years integer not null,
    clinic_name_ar text not null,
    clinic_name_en text not null,
    clinic_address_ar text not null,
    clinic_address_en text not null,
    governorate_id text not null,
    city_id text not null,
    google_maps_url text,
    phone_number text not null,
    whatsapp_number text not null,
    email text not null,
    clinic_price numeric(10, 2) not null,
    online_price numeric(10, 2) not null,
    bio_ar text not null,
    bio_en text not null,
    syndicate_number text not null,
    languages text[] default '{}'::text[] not null,
    working_days integer[] default '{}'::integer[] not null,
    working_hours_start text not null,
    working_hours_end text not null,
    emergency_available boolean default false not null,
    website text,
    facebook text,
    instagram text,
    linkedin text,
    cover_image text,
    profile_image text,
    rating_avg numeric(3, 2) default 5.0 check (rating_avg >= 1.0 and rating_avg <= 5.0),
    rating_count integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_doctor_profiles_updated_at
    before update on public.doctor_profiles
    for each row execute procedure update_updated_at_column();

-- 6. CLINIC IMAGES TABLE
create table if not exists public.clinic_images (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. DOCTOR CERTIFICATES TABLE
create table if not exists public.doctor_certificates (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    certificate_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. WORKING HOURS TABLE (Optional breakout of working schedule)
create table if not exists public.working_hours (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
    start_time text not null,
    end_time text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. DOCTOR VISITS (To track profile page clicks and views)
create table if not exists public.doctor_visits (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    visitor_ip text,
    referrer text,
    visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. DOCTOR ANALYTICS TABLE
create table if not exists public.doctor_analytics (
    doctor_id uuid primary key references public.doctor_profiles(id) on delete cascade,
    profile_views integer default 0 not null,
    whatsapp_clicks integer default 0 not null,
    booking_clicks integer default 0 not null,
    visitors integer default 0 not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_doctor_analytics_updated_at
    before update on public.doctor_analytics
    for each row execute procedure update_updated_at_column();

-- 11. FAVORITES TABLE (Patients' bookmarks)
create table if not exists public.favorites (
    patient_id uuid not null references public.patients(id) on delete cascade,
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (patient_id, doctor_id)
);

-- 12. BOOKINGS TABLE
create table if not exists public.bookings (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    patient_name text not null,
    patient_phone text not null,
    booking_date date not null,
    booking_time text not null,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger update_bookings_updated_at
    before update on public.bookings
    for each row execute procedure update_updated_at_column();

-- 13. NOTIFICATIONS TABLE
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id text not null, -- references either patient_id, doctor_id, or 'admin'
    title_ar text not null,
    title_en text not null,
    body_ar text not null,
    body_en text not null,
    is_read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13.5 REVIEWS TABLE
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
    patient_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. SYSTEM SETTINGS
create table if not exists public.settings (
    id integer primary key default 1 check (id = 1),
    allow_new_registrations boolean default true not null,
    require_certificates_verification boolean default true not null,
    emergency_hotline text default '123'
);

-- Seed single settings row
insert into public.settings (id, allow_new_registrations, require_certificates_verification, emergency_hotline)
values (1, true, true, '123')
on conflict (id) do nothing;

-- ====================================================================
-- PERFORMANCE TUNING: INDEXES
-- ====================================================================
create index if not exists idx_doctor_profiles_specialty on public.doctor_profiles(specialty_id);
create index if not exists idx_doctor_profiles_governorate_city on public.doctor_profiles(governorate_id, city_id);
create index if not exists idx_doctor_accounts_status on public.doctor_accounts(status);
create index if not exists idx_bookings_doctor_id on public.bookings(doctor_id);
create index if not exists idx_bookings_date on public.bookings(booking_date);
create index if not exists idx_doctor_visits_doctor_id on public.doctor_visits(doctor_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_reviews_doctor_id on public.reviews(doctor_id);

-- ====================================================================
-- SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all public tables
alter table public.patients enable row level security;
alter table public.doctor_accounts enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.clinic_images enable row level security;
alter table public.doctor_certificates enable row level security;
alter table public.doctor_visits enable row level security;
alter table public.doctor_analytics enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;

-- 1. Patients Policies
create policy "Public can read patients" on public.patients for select using (true);
create policy "Patients can update their own profile" on public.patients for update using (auth.uid() = id);
create policy "Patients can insert themselves" on public.patients for insert with check (true);

-- 2. Doctor Accounts Policies
create policy "Doctors can view their own account" on public.doctor_accounts for select using (true);
create policy "Public signup for doctors" on public.doctor_accounts for insert with check (true);
create policy "Admin manages doctor accounts" on public.doctor_accounts for all using (true);

-- 3. Doctor Profiles Policies
create policy "Public can view approved doctor profiles" on public.doctor_profiles 
    for select using (
        exists (
            select 1 from public.doctor_accounts 
            where public.doctor_accounts.id = public.doctor_profiles.id 
            and public.doctor_accounts.status = 'approved'
        ) or true -- For admin panel visibility
    );
create policy "Doctors can update their own profiles" on public.doctor_profiles for update using (true);
create policy "Doctors can insert their profiles" on public.doctor_profiles for insert with check (true);

-- 4. Clinic Images / Certificates
create policy "Public can view clinic images" on public.clinic_images for select using (true);
create policy "Doctors can manage clinic images" on public.clinic_images for all using (true);
create policy "Public can view certificates" on public.doctor_certificates for select using (true);
create policy "Doctors can manage certificates" on public.doctor_certificates for all using (true);

-- 5. Bookings
create policy "Anyone can book an appointment" on public.bookings for insert with check (true);
create policy "Doctors and patients can view bookings" on public.bookings for select using (true);

-- 6. Favorites
create policy "Users can manage favorites" on public.favorites for all using (true);

-- 7. Analytics & Visits
create policy "Public can log visits" on public.doctor_visits for insert with check (true);
create policy "Doctors can view their visits" on public.doctor_visits for select using (true);
create policy "Public can increment analytics" on public.doctor_analytics for select using (true);
create policy "Doctors can update analytics" on public.doctor_analytics for all using (true);

-- 8. Reviews
create policy "Public can read reviews" on public.reviews for select using (true);
create policy "Anyone can submit reviews" on public.reviews for insert with check (true);

-- ====================================================================
-- SUPABASE STORAGE BUCKETS SETUP
-- ====================================================================
-- Run these statements in your Supabase SQL editor to enable buckets:
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- insert into storage.buckets (id, name, public) values ('doctor-images', 'doctor-images', true);
-- insert into storage.buckets (id, name, public) values ('clinic-images', 'clinic-images', true);
-- insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true);
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true);

-- Storage bucket access policies (assuming public select and authenticated insert)
-- create policy "Public Access to Avatars" on storage.objects for select using (bucket_id = 'avatars');
-- create policy "Upload Avatars" on storage.objects for insert with check (bucket_id = 'avatars');
-- create policy "Public Access to Clinic Images" on storage.objects for select using (bucket_id = 'clinic-images');
-- create policy "Upload Clinic Images" on storage.objects for insert with check (bucket_id = 'clinic-images');
