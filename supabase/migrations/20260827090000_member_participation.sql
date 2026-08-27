-- Additive. Keep existing member_preregistrations; do not create a second table.

alter table if exists public.member_preregistrations
  add column if not exists participation_interests jsonb not null default '[]'::jsonb;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'age'
  ) then
    alter table public.member_preregistrations alter column age drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'license_years'
  ) then
    alter table public.member_preregistrations alter column license_years drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'use_frequency'
  ) then
    alter table public.member_preregistrations alter column use_frequency drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'incident_history'
  ) then
    alter table public.member_preregistrations alter column incident_history drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'budget_band'
  ) then
    alter table public.member_preregistrations alter column budget_band drop not null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'member_preregistrations' and column_name = 'use_purpose'
  ) then
    alter table public.member_preregistrations alter column use_purpose drop not null;
  end if;
end $$;


-- Recovery-mechanism admin TODOs. Additive inserts only.
insert into public.legal_review_items (id, title, detail, status)
values
  (
    'deposit-credit',
    '保証金と与信',
    '入会時の保証金、クレジットカードの事前与信、利用限度額を、支払能力の確認として設計すること。額は未確定。サイトに書かない。',
    'needs_review'
  ),
  (
    'telematics',
    '走行記録と車両チェック',
    'GPS、速度、急加速、急減速の記録、前後方向のドライブレコーダー、利用前後の車両撮影、傷・ホイール・タイヤのチェックを運用に組み込むこと。',
    'needs_review'
  ),
  (
    'identity-handover',
    '対面での本人確認',
    '受け渡し時の対面本人確認、緊急連絡と事故対応手順を文書化すること。',
    'needs_review'
  )
on conflict (id) do nothing;

update public.legal_review_items
set
  title = '貸渡用途に対応する保険',
  detail = 'スーパーカーの貸渡用途に対応する保険、対人・対物・車両保険の補償範囲、高額な免責額を保険代理店と車両ごとに設計すること。補償額をサイトに書かない。'
where id = 'insurance';

update public.legal_review_items
set
  title = '貸渡約款と運転者負担',
  detail = '運転者の責めに帰すべき損害は、法令上認められる範囲で負担を求める方針。運営の整備不良や許認可不備まで転嫁しない。弁護士による貸渡約款の確認。'
where id = 'member-terms';

update public.legal_review_items
set
  detail = '道路運送法上のレンタカー事業許可の要否、自家用自動車の有償貸渡し、会員制モデルでの該当性を行政書士・所轄と確認すること。京都運輸支局への事業形態確認を含む。'
where id = 'rental-license';
