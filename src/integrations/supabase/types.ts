/**
 * Hand-written to match supabase/migrations/. It covers the tables this app
 * reads and writes, so a renamed or dropped column fails to compile instead of
 * failing at runtime — the authorisation lookup in src/lib/staff.ts most of all.
 *
 * It is not the generated file. To replace it with one tied to the live schema:
 *
 *   npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts
 *
 * Until then, edit this alongside any migration that changes these columns.
 */

export type StaffRow = {
  user_id: string;
  role: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
};

export type LegalReviewItemRow = {
  id: string;
  title: string;
  detail: string;
  status: string;
  created_at: string;
};

export type InquiryNoteRow = {
  id: string;
  subject_type: string;
  subject_id: string;
  body: string;
  author_user_id: string;
  created_at: string;
};

export type InquiryStatusEventRow = {
  id: string;
  subject_type: string;
  subject_id: string;
  from_status: string | null;
  to_status: string;
  author_user_id: string | null;
  note: string | null;
  created_at: string;
};

export type NotificationLogRow = {
  id: string;
  channel: string;
  subject_type: string | null;
  subject_id: string | null;
  payload: unknown;
  sent_at: string | null;
  created_at: string;
};

/** Column names that must exist for the staff allowlist to work. */
export const STAFF_COLUMNS = "user_id, role, email, display_name" satisfies string;
