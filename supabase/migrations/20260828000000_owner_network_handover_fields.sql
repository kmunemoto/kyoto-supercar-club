-- Additive. Do not drop existing tables, columns, or member_preregistrations data.

alter table if exists public.owner_inquiries
  add column if not exists want_to_use_others text,
  add column if not exists want_to_register_car text,
  add column if not exists daily_km_preference text,
  add column if not exists min_driver_age text,
  add column if not exists license_years_pref text,
  add column if not exists rain_use text,
  add column if not exists snow_use text,
  add column if not exists region_limit text,
  add column if not exists outdoor_night_parking text,
  add column if not exists handover_access_ok text,
  add column if not exists prefer_line boolean;

update public.legal_review_items
set
  title = 'COLLECTIONの報酬',
  detail = '入会金33万円、月額3万3,000円、事務手数料22万円、売却手数料2.2％は計画値。税込か税別は未確定。契約で確定すること。'
where id = 'collection-fees';

insert into public.legal_review_items (id, title, detail, status)
values
  (
    'deposit-credit',
    '保証金',
    'COLLECTIONは記名運転者1人100万円を維持。OWNER NETWORKは保証金なし。事故責任の上限ではないことを契約で明示すること。',
    'needs_review'
  ),
  (
    'identity-handover',
    '対面での本人確認',
    'OWNER NETWORKは各オーナー保管のまま。KSCが鍵を預かり、承認済み保管場所で対面受け渡しする。保管場所は公開しない。',
    'needs_review'
  )
on conflict (id) do nothing;
