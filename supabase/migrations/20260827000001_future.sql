-- Forward-looking tables. Unused in this MVP, kept so later features
-- (review, vehicles, bookings, Stripe, GPS, contracts) can land without
-- reshaping the inquiry records.
--
-- READ THIS BEFORE TREATING IT AS A DESIGN. It is a sketch, not a plan:
--
--   * The hardest rules the site publishes have no tables here at all —
--     credit lots with 24-month expiry and retroactive return on cancellation,
--     the annual day/distance allowance and its transfer between co-owners,
--     per-vehicle owner conditions, and double-booking prevention. `bookings`
--     is six columns with none of that.
--   * At one to three vehicles the answer is very likely to buy or to do by
--     hand: a shared calendar plus a timestamped request form for booking,
--     hosted Stripe for payments, a telematics SaaS for GPS, an e-signature
--     service for contracts, and a spreadsheet for the ledgers. See
--     docs/LAUNCH_SYSTEMS.md.
--   * If a SaaS is chosen instead, drop these with a new migration. Deleting
--     this file does not remove the tables from a database that already ran it.
--
-- One exception: notification_log is NOT forward-looking. It is written on
-- every send attempt by src/lib/cloud.server.ts and read by the admin
-- dashboard. RLS is deny-all, so writes need SUPABASE_SERVICE_ROLE_KEY.

create table if not exists members (
  id text primary key,
  preregistration_id text references member_preregistrations(id),
  user_id text,
  full_name text,
  email text,
  phone text,
  status text not null default 'pending_review',
  license_verified_at timestamptz,
  identity_verified_at timestamptz,
  interview_at timestamptz,
  driving_check_at timestamptz,
  deposit_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicle_owners (
  id text primary key,
  inquiry_id text references owner_inquiries(id),
  user_id text,
  full_name text,
  email text,
  phone text,
  status text not null default 'candidate',
  contract_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicles (
  id text primary key,
  owner_id text references vehicle_owners(id),
  inquiry_id text references owner_inquiries(id),
  make text,
  model text,
  year integer,
  vin text,
  mileage_km integer,
  status text not null default 'candidate',
  storage_location text,
  annual_km_cap integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists identity_verifications (
  id text primary key,
  member_id text references members(id),
  method text,
  status text not null default 'not_started',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id text primary key,
  vehicle_id text references vehicles(id),
  member_id text references members(id),
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'requested',
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  member_id text references members(id),
  booking_id text references bookings(id),
  kind text not null,
  amount_jpy integer,
  stripe_ref text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists deposits (
  id text primary key,
  member_id text references members(id),
  amount_jpy integer,
  status text not null default 'held',
  created_at timestamptz not null default now()
);

create table if not exists mileage_logs (
  id text primary key,
  vehicle_id text references vehicles(id),
  booking_id text references bookings(id),
  km integer,
  recorded_at timestamptz not null default now()
);

create table if not exists inspection_photos (
  id text primary key,
  vehicle_id text references vehicles(id),
  booking_id text references bookings(id),
  stage text not null,
  storage_key text,
  created_at timestamptz not null default now()
);

create table if not exists incident_reports (
  id text primary key,
  vehicle_id text references vehicles(id),
  booking_id text references bookings(id),
  kind text,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists maintenance_logs (
  id text primary key,
  vehicle_id text references vehicles(id),
  kind text,
  detail text,
  performed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists wash_logs (
  id text primary key,
  vehicle_id text references vehicles(id),
  performed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists owner_payouts (
  id text primary key,
  owner_id text references vehicle_owners(id),
  vehicle_id text references vehicles(id),
  period text,
  amount_jpy integer,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists gps_devices (
  id text primary key,
  vehicle_id text references vehicles(id),
  device_ref text,
  status text not null default 'unassigned',
  created_at timestamptz not null default now()
);

create table if not exists notification_log (
  id text primary key,
  channel text not null,
  subject_type text,
  subject_id text,
  payload jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id text primary key,
  subject_type text not null,
  subject_id text not null,
  kind text,
  status text not null default 'draft',
  signed_at timestamptz,
  created_at timestamptz not null default now()
);
