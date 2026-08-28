-- Additive. Do not drop existing tables, columns, or member_preregistrations data.

alter table if exists public.collection_inquiries
  add column if not exists desired_make text,
  add column if not exists desired_model text,
  add column if not exists vehicle_condition text,
  add column if not exists want_value_check text,
  add column if not exists resale_priorities jsonb,
  add column if not exists prefer_line boolean;

update public.legal_review_items
set
  title = 'COLLECTIONの報酬',
  detail = '入会金22万円、月額管理費2万2,000円、予約・対面受け渡し管理料1予約5,500円、別プロジェクト事務手数料11万円、持分譲渡管理手数料22万円、売却手数料2.2％は計画値。税込か税別は未確定。契約で確定すること。'
where id = 'collection-fees';

update public.legal_review_items
set
  title = '保証金と参加申込預り金',
  detail = 'COLLECTIONは記名運転者1人100万円を維持。参加申込預り金50万円は購入資金の一部でKSC売上ではない。OWNER NETWORKは登録のみ保証金なし、他車利用時はSTANDARD 50万／PREMIUM 100万／ICON 200万。事故責任の上限ではないことを契約で明示すること。'
where id = 'deposit-credit';

insert into public.legal_review_items (id, title, detail, status)
values
  (
    'holding-deposit',
    '参加申込預り金の分別管理',
    'プロジェクトごとに分別し運転資金に使わないこと。90日（＋任意30日）で6人未達、車両不承認、KSC中止は返還。申込者都合は合理的実費控除。全額没収としないこと。',
    'needs_review'
  ),
  (
    'value-check',
    'KSC VALUE CHECK',
    '3年総負担の比較方法、再販前提距離の分離（COLLECTION 4,800km／単独800km）、3シナリオ、最低50％・目標40％・レンタル70％、未達時は実施しないことを契約・社内規程化すること。',
    'needs_review'
  )
on conflict (id) do update
set
  title = excluded.title,
  detail = excluded.detail;
