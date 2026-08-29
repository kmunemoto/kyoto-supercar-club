-- Additive. Do not drop existing tables, columns, or member_preregistrations data.
--
-- Two columns the lead records were missing, plus the policy that lets staff
-- write a lead at all.
--
-- 1. channel — how the lead arrived. The utm_* columns already record the ad or
--    referrer that brought someone to a form, but every row is a form
--    submission by construction: there was no way to record a lead that came in
--    through LINE, a phone call, or a conversation, so the console was a
--    partial view of the pipeline and those people were invisible to the
--    stale-lead check and to the deletion-request tooling.
--
-- 2. policy_version — which version of the privacy policy and the published
--    fees the person saw when they agreed. privacy_agreed is a boolean, and the
--    wording it refers to lives in git, not in the row. The fees are marked
--    provisional today and will be fixed later; the policy will be revised when
--    the operator entity is confirmed. Without a stamp there is no way to tell
--    afterwards what any given applicant was actually shown.
--
-- 3. A staff INSERT policy. The existing anon policy requires
--    privacy_agreed = true, which is a statement about a form checkbox and
--    cannot be made truthfully for a lead taken over the phone. Staff insert
--    under their own policy instead; the console requires them to confirm how
--    consent was obtained before it will submit.

do $$
declare
  t text;
  lead_tables text[] := array[
    'owner_inquiries',
    'member_preregistrations',
    'contact_inquiries',
    'collection_inquiries'
  ];
  col text;
begin
  foreach t in array lead_tables loop
    continue when not exists (
      select 1 from pg_tables where schemaname = 'public' and tablename = t
    );

    execute format('alter table public.%I add column if not exists channel text', t);
    execute format('alter table public.%I add column if not exists policy_version text', t);

    -- Every row written before this migration came from a public form.
    execute format($f$update public.%I set channel = 'form' where channel is null$f$, t);

    foreach col in array array['channel', 'policy_version'] loop
      if not exists (
        select 1 from pg_constraint where conname = format('%s_%s_len', t, col)
      ) then
        execute format(
          'alter table public.%I add constraint %I check (char_length(%I) <= 40) not valid',
          t, format('%s_%s_len', t, col), col
        );
      end if;
    end loop;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = format('%s_staff_insert', t)
    ) then
      execute format(
        'create policy %I on public.%I for insert to authenticated with check (public.is_staff())',
        format('%s_staff_insert', t), t
      );
    end if;
  end loop;
end $$;

create index if not exists owner_inquiries_channel_idx on public.owner_inquiries (channel);
create index if not exists member_prereg_channel_idx on public.member_preregistrations (channel);
create index if not exists contact_inquiries_channel_idx on public.contact_inquiries (channel);
create index if not exists collection_inquiries_channel_idx on public.collection_inquiries (channel);
