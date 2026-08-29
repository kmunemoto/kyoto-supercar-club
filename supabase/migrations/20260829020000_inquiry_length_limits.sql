-- Additive. Do not drop existing tables, columns, or member_preregistrations data.
--
-- The anon key ships in the client bundle, so a determined poster can insert
-- straight into PostgREST and skip the server function entirely — and with it
-- the Zod schema, the honeypot and the rate limit. The INSERT policies stay
-- (the public forms need them, and the server falls back to the anon key when
-- no service role is configured), so the database enforces its own ceiling:
-- text columns had no length limit at all, which made unbounded payloads free.
--
-- Every limit here is well above what the matching form field accepts, so a
-- genuine submission can never hit one.

do $$
declare
  spec record;
begin
  for spec in
    select * from (values
      ('owner_inquiries',        'full_name',   200),
      ('owner_inquiries',        'email',       320),
      ('owner_inquiries',        'phone',        50),
      ('owner_inquiries',        'make',        200),
      ('owner_inquiries',        'model',       200),
      ('owner_inquiries',        'questions',  4000),
      ('owner_inquiries',        'concerns',   4000),
      ('owner_inquiries',        'free_text',  8000),
      ('owner_inquiries',        'landing_path', 1000),
      ('owner_inquiries',        'referrer',   1000),
      ('collection_inquiries',   'full_name',   200),
      ('collection_inquiries',   'email',       320),
      ('collection_inquiries',   'phone',        50),
      ('collection_inquiries',   'desired_models', 1000),
      ('collection_inquiries',   'concerns',   8000),
      ('collection_inquiries',   'landing_path', 1000),
      ('collection_inquiries',   'referrer',   1000),
      ('member_preregistrations','full_name',   200),
      ('member_preregistrations','email',       320),
      ('member_preregistrations','phone',        50),
      ('member_preregistrations','requests',   4000),
      ('member_preregistrations','landing_path', 1000),
      ('member_preregistrations','referrer',   1000),
      ('contact_inquiries',      'full_name',   200),
      ('contact_inquiries',      'email',       320),
      ('contact_inquiries',      'phone',        50),
      ('contact_inquiries',      'message',    8000),
      ('contact_inquiries',      'landing_path', 1000),
      ('contact_inquiries',      'referrer',   1000)
    ) as t(tbl, col, max_len)
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = spec.tbl and column_name = spec.col
    ) and not exists (
      select 1 from pg_constraint
      where conname = format('%s_%s_len', spec.tbl, spec.col)
    ) then
      execute format(
        'alter table public.%I add constraint %I check (char_length(%I) <= %s) not valid',
        spec.tbl,
        format('%s_%s_len', spec.tbl, spec.col),
        spec.col,
        spec.max_len
      );
      -- NOT VALID so existing rows are never rejected; new writes are checked.
    end if;
  end loop;
end $$;
