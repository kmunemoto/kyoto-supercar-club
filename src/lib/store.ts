import { LEGAL_TODOS } from "@/lib/content";
import { allowLocalStore } from "@/lib/site";
import type { ApplicationStatus, SubjectType } from "@/lib/status";
import { newId } from "@/lib/utils";

const KEY = "ksc.db.v3";

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
  participation_purpose: string | null;
  priority_use_period: string | null;
  annual_km_cap: string | null;
  other_driver_conditions: string | null;
  want_to_use_others: string | null;
  want_to_register_car: string | null;
  daily_km_preference: string | null;
  min_driver_age: string | null;
  license_years_pref: string | null;
  rain_use: string | null;
  snow_use: string | null;
  region_limit: string | null;
  outdoor_night_parking: string | null;
  handover_access_ok: string | null;
  prefer_line: boolean | null;
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

export type CollectionRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  applicant_type: string;
  region: string;
  kyoto_connection: string;
  current_vehicle_status: string;
  desired_models: string;
  desired_make?: string | null;
  desired_model?: string | null;
  vehicle_condition?: string | null;
  want_value_check?: string | null;
  resale_priorities?: string[];
  prefer_line?: boolean | null;
  budget_band: string;
  desired_days_per_year: string;
  desired_km_per_year: string;
  desired_start_timing: string;
  license_years: number | null;
  incident_history: string;
  priorities: string[];
  concerns: string | null;
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
  author_label?: string | undefined;
  created_at: string;
};

export type EventRow = {
  id: string;
  subject_type: SubjectType;
  subject_id: string;
  from_status: string | null;
  to_status: string;
  author_user_id: string | null;
  author_label?: string | null | undefined;
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
  collections: CollectionRow[];
  notes: NoteRow[];
  events: EventRow[];
  legal: LegalItem[];
};

function emptyDb(): Db {
  return {
    owners: [],
    members: [],
    contacts: [],
    collections: [],
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
