-- Additive. Do not drop existing tables or member_preregistrations data.

alter table if exists public.owner_inquiries
  add column if not exists participation_purpose text,
  add column if not exists priority_use_period text,
  add column if not exists annual_km_cap text,
  add column if not exists other_driver_conditions text;

create table if not exists public.collection_inquiries (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  applicant_type text not null,
  region text not null,
  kyoto_connection text not null,
  current_vehicle_status text not null,
  desired_models text not null,
  budget_band text not null,
  desired_days_per_year text not null,
  desired_km_per_year text not null,
  desired_start_timing text not null,
  license_years integer,
  incident_history text not null,
  priorities jsonb not null default '[]'::jsonb,
  concerns text,
  privacy_agreed boolean not null default false,
  status text not null default 'new',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_path text,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collection_inquiries_status_idx
  on public.collection_inquiries (status, created_at desc);
create index if not exists collection_inquiries_email_idx
  on public.collection_inquiries (email);

alter table public.collection_inquiries enable row level security;

drop policy if exists collection_inquiries_insert_anon on public.collection_inquiries;
drop policy if exists collection_inquiries_staff_select on public.collection_inquiries;
drop policy if exists collection_inquiries_staff_update on public.collection_inquiries;

create policy collection_inquiries_insert_anon
  on public.collection_inquiries
  for insert
  to anon, authenticated
  with check (privacy_agreed = true and status = 'new');

create policy collection_inquiries_staff_select
  on public.collection_inquiries
  for select
  to authenticated
  using (public.is_staff());

create policy collection_inquiries_staff_update
  on public.collection_inquiries
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

insert into public.legal_review_items (id, title, detail, status)
values
  (
    'co-ownership-title',
    '共同所有の名義と車検証',
    '共有持分の持ち方、車検証の使用者・所有者、登録変更、KSCが所有しないことの契約上の明示を弁護士と確認すること。',
    'needs_review'
  ),
  (
    'collection-structure',
    '共同所有の法的組成',
    '任意組合、共有、合同会社など、どの器で持分を持つか。KSCが購入資金を出さないこと、利用権販売ではないことを契約で切り分けること。',
    'needs_review'
  ),
  (
    'not-investment',
    '金融商品・投資勧誘への該当性',
    '共同所有の募集が集団投資スキーム等に当たらないか、広告表現の範囲を確認すること。値上がりや利回りを約束しない。',
    'needs_review'
  ),
  (
    'accident-allocation',
    '事故・全損時の負担',
    '運転者、共同所有者、車両オーナー、KSCの責任分界。整備不良や許認可不備を運転者へ転嫁しない。弁護士確認。',
    'needs_review'
  ),
  (
    'mid-sale',
    '中途売却と持分譲渡',
    '持分を途中で手放す手続、残りの所有者の先買、換金できない期間を契約化すること。売却価格は保証しない。',
    'needs_review'
  ),
  (
    'inheritance',
    '相続',
    '共同所有者の相続が発生した場合の持分の扱い、運転資格の非承継を確認すること。',
    'needs_review'
  ),
  (
    'collection-fees',
    'KSCの報酬',
    '組成手数料、登録料、年間管理費、保管・整備手配料、受け渡し手数料、売却手数料の設計。額は未確定。サイトに書かない。',
    'needs_review'
  )
on conflict (id) do nothing;
