-- Additive migration. Do not edit earlier files.
-- Tightens RLS so only staff can read inquiries, and extends owner_inquiries
-- for a first-contact form that does not collect a precise storage address.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------

alter table if exists public.staff
  add column if not exists email text,
  add column if not exists display_name text;

alter table if exists public.owner_inquiries
  add column if not exists owns_vehicle text,
  add column if not exists mileage_band text,
  add column if not exists storage_type text,
  add column if not exists interests jsonb not null default '[]'::jsonb,
  add column if not exists concerns text,
  add column if not exists preferred_contact text,
  add column if not exists free_text text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_path text,
  add column if not exists referrer text;

alter table if exists public.member_preregistrations
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_path text,
  add column if not exists referrer text;

alter table if exists public.contact_inquiries
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_path text,
  add column if not exists referrer text;

-- First-contact owner form no longer requires address / plate-level detail.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'phone'
  ) then
    alter table public.owner_inquiries alter column phone drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'year'
  ) then
    alter table public.owner_inquiries alter column year drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'mileage_km'
  ) then
    alter table public.owner_inquiries alter column mileage_km drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'storage_location'
  ) then
    alter table public.owner_inquiries alter column storage_location drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'lendable_period'
  ) then
    alter table public.owner_inquiries alter column lendable_period drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'owner_inquiries' and column_name = 'reward_preference'
  ) then
    alter table public.owner_inquiries alter column reward_preference drop not null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Staff helper (security definer so it can read staff without RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff
    where user_id = auth.uid()::text
  );
$$;

revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

-- ---------------------------------------------------------------------------
-- Drop previous overly-permissive authenticated-can-read-all policies
-- ---------------------------------------------------------------------------

drop policy if exists owner_inquiries_insert_public on public.owner_inquiries;
drop policy if exists member_prereg_insert_public on public.member_preregistrations;
drop policy if exists contact_inquiries_insert_public on public.contact_inquiries;
drop policy if exists owner_inquiries_staff_read on public.owner_inquiries;
drop policy if exists member_prereg_staff_read on public.member_preregistrations;
drop policy if exists contact_inquiries_staff_read on public.contact_inquiries;
drop policy if exists owner_inquiries_staff_update on public.owner_inquiries;
drop policy if exists member_prereg_staff_update on public.member_preregistrations;
drop policy if exists contact_inquiries_staff_update on public.contact_inquiries;
drop policy if exists notes_staff_all on public.inquiry_notes;
drop policy if exists events_staff_all on public.inquiry_status_events;
drop policy if exists legal_staff_read on public.legal_review_items;
drop policy if exists staff_self_read on public.staff;

-- ---------------------------------------------------------------------------
-- Recreate: anon may INSERT a new inquiry only. Nobody else may SELECT
-- unless they are in public.staff. No DELETE for anon/authenticated.
-- ---------------------------------------------------------------------------

create policy owner_inquiries_insert_anon
  on public.owner_inquiries
  for insert
  to anon, authenticated
  with check (privacy_agreed = true and status = 'new');

create policy member_prereg_insert_anon
  on public.member_preregistrations
  for insert
  to anon, authenticated
  with check (privacy_agreed = true and status = 'new');

create policy contact_inquiries_insert_anon
  on public.contact_inquiries
  for insert
  to anon, authenticated
  with check (privacy_agreed = true and status = 'new');

create policy owner_inquiries_staff_select
  on public.owner_inquiries
  for select
  to authenticated
  using (public.is_staff());

create policy member_prereg_staff_select
  on public.member_preregistrations
  for select
  to authenticated
  using (public.is_staff());

create policy contact_inquiries_staff_select
  on public.contact_inquiries
  for select
  to authenticated
  using (public.is_staff());

create policy owner_inquiries_staff_update
  on public.owner_inquiries
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy member_prereg_staff_update
  on public.member_preregistrations
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy contact_inquiries_staff_update
  on public.contact_inquiries
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy notes_staff_all
  on public.inquiry_notes
  for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy events_staff_all
  on public.inquiry_status_events
  for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy legal_staff_select
  on public.legal_review_items
  for select
  to authenticated
  using (public.is_staff());

-- Authenticated users may only see their own staff row (to decide if /admin is allowed).
-- They cannot insert themselves into staff.
create policy staff_select_own
  on public.staff
  for select
  to authenticated
  using (user_id = auth.uid()::text);
