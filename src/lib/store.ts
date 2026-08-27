import { LEGAL_TODOS } from "@/lib/content";
import { allowLocalStore } from "@/lib/site";
import type { ApplicationStatus, SubjectType } from "@/lib/status";
import { newId } from "@/lib/utils";

const KEY = "ksc.db.v2";

export type OwnerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  region: string;
  make: string;
  model: string;
  year: number | null;
  mileage_km: number | null;
  storage_location: string | null;
  annual_use_count: string | null;
  lendable_period: string | null;
  management_needs: string[];
  reward_preference: string | null;
  photo_notes: string | null;
  questions: string | null;
  owns_vehicle: string | null;
  mileage_band: string | null;
  storage_type: string | null;
  interests: string[];
  concerns: string | null;
  preferred_contact: string | null;
  free_text: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_path: string | null;
  referrer: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number | null;
  region: string;
  license_years: number | null;
  use_frequency: string | null;
  interest_models: string[];
  participation_interests: string[];
  budget_band: string | null;
  use_purpose: string | null;
  incident_history: string | null;
  requests: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_path: string | null;
  referrer: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type ContactRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_path: string | null;
  referrer: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type NoteRow = {
  id: string;
  subject_type: SubjectType;
  subject_id: string;
  body: string;
  author_user_id: string;
  created_at: string;
};

export type EventRow = {
  id: string;
  subject_type: SubjectType;
  subject_id: string;
  from_status: string | null;
  to_status: string;
  author_user_id: string | null;
  note: string | null;
  created_at: string;
};

export type LegalItem = {
  id: string;
  title: string;
  detail: string;
  status: string;
};

type Db = {
  owners: OwnerRow[];
  members: MemberRow[];
  contacts: ContactRow[];
  notes: NoteRow[];
  events: EventRow[];
  legal: LegalItem[];
};

function emptyDb(): Db {
  return {
    owners: [],
    members: [],
    contacts: [],
    notes: [],
    events: [],
    legal: LEGAL_TODOS.map((t) => ({
      id: t.id,
      title: t.title,
      detail: t.detail,
      status: "needs_review",
    })),
  };
}

function load(): Db {
  if (typeof window === "undefined") return emptyDb();
  if (!allowLocalStore()) return emptyDb();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDb();
    return { ...emptyDb(), ...(JSON.parse(raw) as Partial<Db>) };
  } catch {
    return emptyDb();
  }
}

function save(db: Db) {
  if (typeof window === "undefined" || !allowLocalStore()) return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function readDb(): Db {
  return load();
}

export function writeDb(mutator: (db: Db) => void): Db {
  const db = load();
  mutator(db);
  save(db);
  return db;
}

export function pushEvent(
  db: Db,
  subjectType: SubjectType,
  subjectId: string,
  from: string | null,
  to: string,
  author: string | null,
  note: string | null,
) {
  db.events.unshift({
    id: newId("evt"),
    subject_type: subjectType,
    subject_id: subjectId,
    from_status: from,
    to_status: to,
    author_user_id: author,
    note,
    created_at: new Date().toISOString(),
  });
}
