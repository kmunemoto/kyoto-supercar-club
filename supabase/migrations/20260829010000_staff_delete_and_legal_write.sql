-- Additive. Do not drop existing tables, columns, or member_preregistrations data.
--
-- Two gaps this closes:
--
-- 1. legal_review_items had a staff SELECT policy but no INSERT or UPDATE, so
--    the "要確認" checklist could be read and never advanced. It only appeared
--    to work where SUPABASE_SERVICE_ROLE_KEY is set, because the service role
--    bypasses RLS entirely — an environment-dependent trap.
--
-- 2. The inquiry tables had no DELETE policy and no anonymisation path, so a
--    deletion request under the Act on the Protection of Personal Information
--    could be accepted at the contact form and then not actually carried out.
--    Staff may now clear the identifying columns in place.

create policy legal_staff_insert
  on public.legal_review_items
  for insert
  to authenticated
  with check (public.is_staff());

create policy legal_staff_update
  on public.legal_review_items
  for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Deletion requests are served by clearing the identifying columns rather than
-- dropping the row: the funnel counts and the audit trail stay honest, and no
-- personal data remains. Staff already hold UPDATE on these tables.

create policy owner_inquiries_staff_delete
  on public.owner_inquiries
  for delete
  to authenticated
  using (public.is_staff());

create policy member_prereg_staff_delete
  on public.member_preregistrations
  for delete
  to authenticated
  using (public.is_staff());

create policy contact_inquiries_staff_delete
  on public.contact_inquiries
  for delete
  to authenticated
  using (public.is_staff());

do $$
begin
  if exists (
    select 1 from pg_tables where schemaname = 'public' and tablename = 'collection_inquiries'
  ) then
    execute $p$
      create policy collection_inquiries_staff_delete
        on public.collection_inquiries
        for delete
        to authenticated
        using (public.is_staff())
    $p$;
  end if;
end $$;
