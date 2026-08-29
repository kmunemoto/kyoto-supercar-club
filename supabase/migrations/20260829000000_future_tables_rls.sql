-- Additive. Do not drop existing tables, columns, or member_preregistrations data.
--
-- The forward-looking tables from 20260827000001_future.sql were created without
-- row level security. Postgres grants public-schema tables to anon and
-- authenticated by default, and the anon key ships in the client bundle
-- (VITE_SUPABASE_ANON_KEY), so anyone could read and write them through
-- PostgREST. They hold personal data (members.full_name/email/phone),
-- vehicle identifiers (vehicles.vin), and payment references
-- (payments.stripe_ref).
--
-- These tables carry no application code yet, so this enables RLS with no
-- policies at all: deny-all for anon and authenticated. The service role still
-- bypasses RLS, and each feature adds its own policies when it lands.

do $$
declare
  t text;
  future_tables text[] := array[
    'members',
    'vehicle_owners',
    'vehicles',
    'identity_verifications',
    'bookings',
    'payments',
    'deposits',
    'mileage_logs',
    'inspection_photos',
    'incident_reports',
    'maintenance_logs',
    'wash_logs',
    'owner_payouts',
    'gps_devices',
    'notification_log',
    'contracts'
  ];
begin
  foreach t in array future_tables loop
    if exists (
      select 1 from pg_tables where schemaname = 'public' and tablename = t
    ) then
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end $$;
