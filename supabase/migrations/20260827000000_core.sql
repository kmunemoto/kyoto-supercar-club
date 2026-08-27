-- Core inquiry tables for the pre-launch MVP.
-- IDs are application-generated text (no pgcrypto).

create table if not exists staff (
  user_id text primary key,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists owner_inquiries (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  region text not null,
  make text not null,
  model text not null,
  year integer not null,
  mileage_km integer not null,
  storage_location text not null,
  annual_use_count text not null,
  lendable_period text not null,
  management_needs jsonb not null default '[]'::jsonb,
  reward_preference text not null,
  photo_notes text,
  questions text,
  privacy_agreed boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists member_preregistrations (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  age integer not null,
  region text not null,
  license_years integer not null,
  use_frequency text not null,
  interest_models jsonb not null default '[]'::jsonb,
  budget_band text not null,
  use_purpose text not null,
  incident_history text not null,
  requests text,
  privacy_agreed boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_inquiries (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  privacy_agreed boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inquiry_notes (
  id text primary key,
  subject_type text not null,
  subject_id text not null,
  body text not null,
  author_user_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists inquiry_status_events (
  id text primary key,
  subject_type text not null,
  subject_id text not null,
  from_status text,
  to_status text not null,
  author_user_id text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists legal_review_items (
  id text primary key,
  title text not null,
  detail text not null,
  status text not null default 'needs_review',
  created_at timestamptz not null default now()
);

create index if not exists owner_inquiries_status_idx on owner_inquiries (status, created_at desc);
create index if not exists owner_inquiries_email_idx on owner_inquiries (email);
create index if not exists member_prereg_status_idx on member_preregistrations (status, created_at desc);
create index if not exists member_prereg_email_idx on member_preregistrations (email);
create index if not exists contact_inquiries_status_idx on contact_inquiries (status, created_at desc);
create index if not exists inquiry_notes_subject_idx on inquiry_notes (subject_type, subject_id, created_at desc);
create index if not exists inquiry_status_subject_idx on inquiry_status_events (subject_type, subject_id, created_at desc);

alter table owner_inquiries enable row level security;
alter table member_preregistrations enable row level security;
alter table contact_inquiries enable row level security;
alter table inquiry_notes enable row level security;
alter table inquiry_status_events enable row level security;
alter table legal_review_items enable row level security;
alter table staff enable row level security;

create policy owner_inquiries_insert_public on owner_inquiries for insert to anon, authenticated with check (true);
create policy member_prereg_insert_public on member_preregistrations for insert to anon, authenticated with check (true);
create policy contact_inquiries_insert_public on contact_inquiries for insert to anon, authenticated with check (true);

create policy owner_inquiries_staff_read on owner_inquiries for select to authenticated using (true);
create policy member_prereg_staff_read on member_preregistrations for select to authenticated using (true);
create policy contact_inquiries_staff_read on contact_inquiries for select to authenticated using (true);
create policy owner_inquiries_staff_update on owner_inquiries for update to authenticated using (true);
create policy member_prereg_staff_update on member_preregistrations for update to authenticated using (true);
create policy contact_inquiries_staff_update on contact_inquiries for update to authenticated using (true);
create policy notes_staff_all on inquiry_notes for all to authenticated using (true) with check (true);
create policy events_staff_all on inquiry_status_events for all to authenticated using (true) with check (true);
create policy legal_staff_read on legal_review_items for select to authenticated using (true);
create policy staff_self_read on staff for select to authenticated using (true);

