/**
 * Row shapes for the records stored in Lovable Cloud. This file also used to
 * carry a localStorage-backed copy of the whole database, which nothing read:
 * the admin console queries Supabase directly.
 */
import type { ApplicationStatus, SubjectType } from "@/lib/status";

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
  channel: string | null;
  policy_version: string | null;
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
  channel: string | null;
  policy_version: string | null;
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
  channel: string | null;
  policy_version: string | null;
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
  channel: string | null;
  policy_version: string | null;
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
