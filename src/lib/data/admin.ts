import { createServerFn } from "@tanstack/react-start";
import { LEGAL_TODOS, POLICY_VERSION } from "@/lib/content";
import { CONTACT_TOPICS } from "@/lib/schemas";
import { getAccessToken } from "@/lib/staff";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
  type ApplicationStatus,
  type SubjectType,
  isSubjectType,
} from "@/lib/status";
import type {
  CollectionRow,
  ContactRow,
  EventRow,
  MemberRow,
  NoteRow,
  OwnerRow,
} from "@/lib/store";
import { countStale, type StaleRow } from "@/lib/ops-policy";
import { newId } from "@/lib/utils";

export type { CollectionRow, ContactRow, EventRow, MemberRow, NoteRow, OwnerRow };
export type StatusCount = { status: string; n: number };
export const STATUSES = APPLICATION_STATUSES;

type Token = { accessToken: string };

async function requireDb(accessToken: string) {
  const { staffDb } = await import("@/lib/cloud.server");
  const result = await staffDb(accessToken);
  if (!result.ok) throw new Error(result.error);
  return result;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

function asOwner(row: Record<string, unknown>): OwnerRow {
  return {
    id: String(row["id"] ?? ""),
    full_name: String(row["full_name"] ?? ""),
    email: String(row["email"] ?? ""),
    phone: row["phone"] == null ? null : String(row["phone"]),
    region: String(row["region"] ?? ""),
    make: String(row["make"] ?? ""),
    model: String(row["model"] ?? ""),
    year: typeof row["year"] === "number" ? row["year"] : row["year"] ? Number(row["year"]) : null,
    mileage_km: typeof row["mileage_km"] === "number" ? row["mileage_km"] : null,
    storage_location: row["storage_location"] == null ? null : String(row["storage_location"]),
    annual_use_count: row["annual_use_count"] == null ? null : String(row["annual_use_count"]),
    lendable_period: row["lendable_period"] == null ? null : String(row["lendable_period"]),
    management_needs: asStringList(row["management_needs"] ?? row["interests"]),
    reward_preference: row["reward_preference"] == null ? null : String(row["reward_preference"]),
    photo_notes: row["photo_notes"] == null ? null : String(row["photo_notes"]),
    questions: row["questions"] == null ? null : String(row["questions"]),
    owns_vehicle: row["owns_vehicle"] == null ? null : String(row["owns_vehicle"]),
    mileage_band: row["mileage_band"] == null ? null : String(row["mileage_band"]),
    storage_type: row["storage_type"] == null ? null : String(row["storage_type"]),
    interests: asStringList(row["interests"] ?? row["management_needs"]),
    concerns: row["concerns"] == null ? null : String(row["concerns"]),
    preferred_contact: row["preferred_contact"] == null ? null : String(row["preferred_contact"]),
    free_text: row["free_text"] == null ? null : String(row["free_text"]),
    participation_purpose:
      row["participation_purpose"] == null ? null : String(row["participation_purpose"]),
    priority_use_period:
      row["priority_use_period"] == null ? null : String(row["priority_use_period"]),
    annual_km_cap: row["annual_km_cap"] == null ? null : String(row["annual_km_cap"]),
    other_driver_conditions:
      row["other_driver_conditions"] == null ? null : String(row["other_driver_conditions"]),
    want_to_use_others:
      row["want_to_use_others"] == null ? null : String(row["want_to_use_others"]),
    want_to_register_car:
      row["want_to_register_car"] == null ? null : String(row["want_to_register_car"]),
    daily_km_preference:
      row["daily_km_preference"] == null ? null : String(row["daily_km_preference"]),
    min_driver_age: row["min_driver_age"] == null ? null : String(row["min_driver_age"]),
    license_years_pref:
      row["license_years_pref"] == null ? null : String(row["license_years_pref"]),
    rain_use: row["rain_use"] == null ? null : String(row["rain_use"]),
    snow_use: row["snow_use"] == null ? null : String(row["snow_use"]),
    region_limit: row["region_limit"] == null ? null : String(row["region_limit"]),
    outdoor_night_parking:
      row["outdoor_night_parking"] == null ? null : String(row["outdoor_night_parking"]),
    handover_access_ok:
      row["handover_access_ok"] == null ? null : String(row["handover_access_ok"]),
    prefer_line:
      typeof row["prefer_line"] === "boolean"
        ? row["prefer_line"]
        : row["prefer_line"] == null
          ? null
          : Boolean(row["prefer_line"]),
    utm_source: row["utm_source"] == null ? null : String(row["utm_source"]),
    utm_medium: row["utm_medium"] == null ? null : String(row["utm_medium"]),
    utm_campaign: row["utm_campaign"] == null ? null : String(row["utm_campaign"]),
    utm_content: row["utm_content"] == null ? null : String(row["utm_content"]),
    utm_term: row["utm_term"] == null ? null : String(row["utm_term"]),
    landing_path: row["landing_path"] == null ? null : String(row["landing_path"]),
    referrer: row["referrer"] == null ? null : String(row["referrer"]),
    channel: row["channel"] == null ? null : String(row["channel"]),
    policy_version: row["policy_version"] == null ? null : String(row["policy_version"]),
    status: isApplicationStatus(String(row["status"]))
      ? (row["status"] as ApplicationStatus)
      : "new",
    created_at: String(row["created_at"] ?? ""),
    updated_at: String(row["updated_at"] ?? ""),
  };
}

function asMember(row: Record<string, unknown>): MemberRow {
  return {
    id: String(row["id"] ?? ""),
    full_name: String(row["full_name"] ?? ""),
    email: String(row["email"] ?? ""),
    phone: String(row["phone"] ?? ""),
    age: row["age"] == null ? null : Number(row["age"]),
    region: String(row["region"] ?? ""),
    license_years: row["license_years"] == null ? null : Number(row["license_years"]),
    use_frequency: row["use_frequency"] == null ? null : String(row["use_frequency"]),
    interest_models: asStringList(row["interest_models"]),
    participation_interests: asStringList(row["participation_interests"]),
    budget_band: row["budget_band"] == null ? null : String(row["budget_band"]),
    use_purpose: row["use_purpose"] == null ? null : String(row["use_purpose"]),
    incident_history: row["incident_history"] == null ? null : String(row["incident_history"]),
    requests: row["requests"] == null ? null : String(row["requests"]),
    utm_source: row["utm_source"] == null ? null : String(row["utm_source"]),
    utm_medium: row["utm_medium"] == null ? null : String(row["utm_medium"]),
    utm_campaign: row["utm_campaign"] == null ? null : String(row["utm_campaign"]),
    utm_content: row["utm_content"] == null ? null : String(row["utm_content"]),
    utm_term: row["utm_term"] == null ? null : String(row["utm_term"]),
    landing_path: row["landing_path"] == null ? null : String(row["landing_path"]),
    referrer: row["referrer"] == null ? null : String(row["referrer"]),
    channel: row["channel"] == null ? null : String(row["channel"]),
    policy_version: row["policy_version"] == null ? null : String(row["policy_version"]),
    status: isApplicationStatus(String(row["status"]))
      ? (row["status"] as ApplicationStatus)
      : "new",
    created_at: String(row["created_at"] ?? ""),
    updated_at: String(row["updated_at"] ?? ""),
  };
}

function asContact(row: Record<string, unknown>): ContactRow {
  return {
    id: String(row["id"] ?? ""),
    full_name: String(row["full_name"] ?? ""),
    email: String(row["email"] ?? ""),
    phone: row["phone"] == null ? null : String(row["phone"]),
    topic: String(row["topic"] ?? ""),
    message: String(row["message"] ?? ""),
    utm_source: row["utm_source"] == null ? null : String(row["utm_source"]),
    utm_medium: row["utm_medium"] == null ? null : String(row["utm_medium"]),
    utm_campaign: row["utm_campaign"] == null ? null : String(row["utm_campaign"]),
    utm_content: row["utm_content"] == null ? null : String(row["utm_content"]),
    utm_term: row["utm_term"] == null ? null : String(row["utm_term"]),
    landing_path: row["landing_path"] == null ? null : String(row["landing_path"]),
    referrer: row["referrer"] == null ? null : String(row["referrer"]),
    channel: row["channel"] == null ? null : String(row["channel"]),
    policy_version: row["policy_version"] == null ? null : String(row["policy_version"]),
    status: isApplicationStatus(String(row["status"]))
      ? (row["status"] as ApplicationStatus)
      : "new",
    created_at: String(row["created_at"] ?? ""),
    updated_at: String(row["updated_at"] ?? ""),
  };
}

function asCollection(row: Record<string, unknown>): CollectionRow {
  return {
    id: String(row["id"] ?? ""),
    full_name: String(row["full_name"] ?? ""),
    email: String(row["email"] ?? ""),
    phone: String(row["phone"] ?? ""),
    applicant_type: String(row["applicant_type"] ?? ""),
    region: String(row["region"] ?? ""),
    kyoto_connection: String(row["kyoto_connection"] ?? ""),
    current_vehicle_status: String(row["current_vehicle_status"] ?? ""),
    desired_models: String(row["desired_models"] ?? ""),
    desired_make: row["desired_make"] == null ? null : String(row["desired_make"]),
    desired_model: row["desired_model"] == null ? null : String(row["desired_model"]),
    vehicle_condition: row["vehicle_condition"] == null ? null : String(row["vehicle_condition"]),
    want_value_check: row["want_value_check"] == null ? null : String(row["want_value_check"]),
    resale_priorities: asStringList(row["resale_priorities"]),
    prefer_line:
      typeof row["prefer_line"] === "boolean"
        ? row["prefer_line"]
        : row["prefer_line"] == null
          ? null
          : Boolean(row["prefer_line"]),
    budget_band: String(row["budget_band"] ?? ""),
    desired_days_per_year: String(row["desired_days_per_year"] ?? ""),
    desired_km_per_year: String(row["desired_km_per_year"] ?? ""),
    desired_start_timing: String(row["desired_start_timing"] ?? ""),
    license_years: row["license_years"] == null ? null : Number(row["license_years"]),
    incident_history: String(row["incident_history"] ?? ""),
    priorities: asStringList(row["priorities"]),
    concerns: row["concerns"] == null ? null : String(row["concerns"]),
    utm_source: row["utm_source"] == null ? null : String(row["utm_source"]),
    utm_medium: row["utm_medium"] == null ? null : String(row["utm_medium"]),
    utm_campaign: row["utm_campaign"] == null ? null : String(row["utm_campaign"]),
    utm_content: row["utm_content"] == null ? null : String(row["utm_content"]),
    utm_term: row["utm_term"] == null ? null : String(row["utm_term"]),
    landing_path: row["landing_path"] == null ? null : String(row["landing_path"]),
    referrer: row["referrer"] == null ? null : String(row["referrer"]),
    channel: row["channel"] == null ? null : String(row["channel"]),
    policy_version: row["policy_version"] == null ? null : String(row["policy_version"]),
    status: isApplicationStatus(String(row["status"]))
      ? (row["status"] as ApplicationStatus)
      : "new",
    created_at: String(row["created_at"] ?? ""),
    updated_at: String(row["updated_at"] ?? ""),
  };
}

function counts(rows: { status: string }[]): StatusCount[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.status, (map.get(r.status) ?? 0) + 1);
  return APPLICATION_STATUSES.map((status) => ({ status, n: map.get(status) ?? 0 }));
}

export { STALE_NEW_DAYS, STALE_OPEN_DAYS } from "@/lib/ops-policy";

function staleCount(rows: StaleRow[]): number {
  return countStale(rows, Date.now());
}

const getDashboardFn = createServerFn({ method: "POST" })
  .validator((data: Token) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const [ownersRes, membersRes, contactsRes, collectionsRes, legalRes] = await Promise.all([
      db.from("owner_inquiries").select("*").order("created_at", { ascending: false }),
      db.from("member_preregistrations").select("*").order("created_at", { ascending: false }),
      db.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
      db.from("collection_inquiries").select("*").order("created_at", { ascending: false }),
      db.from("legal_review_items").select("*"),
    ]);
    const owners = (ownersRes.data ?? []).map((r) => asOwner(r as Record<string, unknown>));
    const members = (membersRes.data ?? []).map((r) => asMember(r as Record<string, unknown>));
    const contacts = (contactsRes.data ?? []).map((r) => asContact(r as Record<string, unknown>));
    const collections = collectionsRes.error
      ? []
      : (collectionsRes.data ?? []).map((r) => asCollection(r as Record<string, unknown>));
    const storedLegal = (legalRes.data ?? []).map((r) => {
      const row = r as Record<string, unknown>;
      return {
        id: String(row["id"] ?? ""),
        title: String(row["title"] ?? ""),
        detail: String(row["detail"] ?? ""),
        status: String(row["status"] ?? "needs_review"),
      };
    });
    const storedById = new Map(storedLegal.map((item) => [item.id, item]));
    const knownIds = new Set<string>(LEGAL_TODOS.map((t) => t.id));
    const legal = [
      ...LEGAL_TODOS.map(
        (t) =>
          storedById.get(t.id) ?? {
            id: t.id,
            title: t.title,
            detail: t.detail,
            status: "needs_review",
          },
      ),
      ...storedLegal.filter((item) => item.id && !knownIds.has(item.id)),
    ];
    // notification_log records every send attempt; sent_at null means it failed
    // or was skipped. Nobody was reading it.
    const notifyRes = await db
      .from("notification_log")
      .select("id, channel, subject_type, subject_id, sent_at, created_at")
      .is("sent_at", null)
      .order("created_at", { ascending: false })
      .limit(20);
    const failedNotifications = notifyRes.error
      ? []
      : (notifyRes.data ?? []).map((r) => {
          const row = r as Record<string, unknown>;
          return {
            id: String(row["id"] ?? ""),
            channel: String(row["channel"] ?? ""),
            subject_type: String(row["subject_type"] ?? ""),
            subject_id: String(row["subject_id"] ?? ""),
            created_at: String(row["created_at"] ?? ""),
          };
        });

    const stale = {
      collections: staleCount(collections),
      owners: staleCount(owners),
      members: staleCount(members),
      contacts: staleCount(contacts),
    };
    return {
      owners: counts(owners),
      members: counts(members),
      contacts: counts(contacts),
      collections: counts(collections),
      recentOwners: owners.slice(0, 5),
      recentMembers: members.slice(0, 5),
      recentCollections: collections.slice(0, 5),
      recentContacts: contacts.slice(0, 5),
      stale,
      failedNotifications,
      environmentWarnings: await environmentWarningList(),
      legal,
    };
  });

async function environmentWarningList(): Promise<string[]> {
  const { environmentWarnings } = await import("@/lib/cloud.server");
  return environmentWarnings();
}

const listCollectionsFn = createServerFn({ method: "POST" })
  .validator((data: Token & { q?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: rows, error } = await db
      .from("collection_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const status = data.status && isApplicationStatus(data.status) ? data.status : "all";
    const q = (data.q ?? "").trim().toLowerCase();
    return (rows ?? [])
      .map((r) => asCollection(r as Record<string, unknown>))
      .filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!q ||
            [r.full_name, r.email, r.phone, r.region, r.desired_models, r.applicant_type]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      );
  });

const listOwnersFn = createServerFn({ method: "POST" })
  .validator((data: Token & { q?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: rows, error } = await db
      .from("owner_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const status = data.status && isApplicationStatus(data.status) ? data.status : "all";
    const q = (data.q ?? "").trim().toLowerCase();
    return (rows ?? [])
      .map((r) => asOwner(r as Record<string, unknown>))
      .filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!q ||
            [r.full_name, r.email, r.phone, r.make, r.model, r.region]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      );
  });

const listMembersFn = createServerFn({ method: "POST" })
  .validator((data: Token & { q?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: rows, error } = await db
      .from("member_preregistrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const status = data.status && isApplicationStatus(data.status) ? data.status : "all";
    const q = (data.q ?? "").trim().toLowerCase();
    return (rows ?? [])
      .map((r) => asMember(r as Record<string, unknown>))
      .filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!q ||
            [r.full_name, r.email, r.phone, r.region, r.use_purpose, ...r.participation_interests]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      );
  });

const listContactsFn = createServerFn({ method: "POST" })
  .validator((data: Token & { q?: string; status?: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: rows, error } = await db
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const status = data.status && isApplicationStatus(data.status) ? data.status : "all";
    const q = (data.q ?? "").trim().toLowerCase();
    return (rows ?? [])
      .map((r) => asContact(r as Record<string, unknown>))
      .filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!q ||
            [r.full_name, r.email, r.phone, r.topic, r.message]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      );
  });

/** Two people share this console; "who wrote this" has to be answerable. */
async function staffNames(
  db: Awaited<ReturnType<typeof requireDb>>["db"],
): Promise<Map<string, string>> {
  const { data } = await db.from("staff").select("user_id, email, display_name");
  const map = new Map<string, string>();
  for (const r of data ?? []) {
    const row = r as Record<string, unknown>;
    const id = String(row["user_id"] ?? "");
    if (!id) continue;
    const label = String(row["display_name"] ?? "").trim() || String(row["email"] ?? "").trim();
    if (label) map.set(id, label);
  }
  return map;
}

async function trail(
  db: Awaited<ReturnType<typeof requireDb>>["db"],
  subjectType: SubjectType,
  subjectId: string,
) {
  const [notesRes, eventsRes] = await Promise.all([
    db
      .from("inquiry_notes")
      .select("*")
      .eq("subject_type", subjectType)
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }),
    db
      .from("inquiry_status_events")
      .select("*")
      .eq("subject_type", subjectType)
      .eq("subject_id", subjectId)
      .order("created_at", { ascending: false }),
  ]);
  const authors = await staffNames(db);
  const notes: NoteRow[] = (notesRes.data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row["id"] ?? ""),
      subject_type: subjectType,
      subject_id: subjectId,
      body: String(row["body"] ?? ""),
      author_user_id: String(row["author_user_id"] ?? ""),
      author_label: authors.get(String(row["author_user_id"] ?? "")) ?? "不明な担当者",
      created_at: String(row["created_at"] ?? ""),
    };
  });
  const events: EventRow[] = (eventsRes.data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row["id"] ?? ""),
      subject_type: subjectType,
      subject_id: subjectId,
      from_status: row["from_status"] == null ? null : String(row["from_status"]),
      to_status: String(row["to_status"] ?? ""),
      author_user_id: row["author_user_id"] == null ? null : String(row["author_user_id"]),
      author_label: authors.get(String(row["author_user_id"] ?? "")) ?? null,
      note: row["note"] == null ? null : String(row["note"]),
      created_at: String(row["created_at"] ?? ""),
    };
  });
  return { notes, events };
}

const getCollectionFn = createServerFn({ method: "POST" })
  .validator((data: Token & { id: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: row } = await db
      .from("collection_inquiries")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return {
      row: asCollection(row as Record<string, unknown>),
      ...(await trail(db, "collection", data.id)),
    };
  });

const getOwnerFn = createServerFn({ method: "POST" })
  .validator((data: Token & { id: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: row } = await db
      .from("owner_inquiries")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return { row: asOwner(row as Record<string, unknown>), ...(await trail(db, "owner", data.id)) };
  });

const getMemberFn = createServerFn({ method: "POST" })
  .validator((data: Token & { id: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: row } = await db
      .from("member_preregistrations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return {
      row: asMember(row as Record<string, unknown>),
      ...(await trail(db, "member", data.id)),
    };
  });

const getContactFn = createServerFn({ method: "POST" })
  .validator((data: Token & { id: string }) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const { data: row } = await db
      .from("contact_inquiries")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return null;
    return {
      row: asContact(row as Record<string, unknown>),
      ...(await trail(db, "contact", data.id)),
    };
  });

function tableFor(subjectType: SubjectType): string {
  if (subjectType === "owner") return "owner_inquiries";
  if (subjectType === "member") return "member_preregistrations";
  if (subjectType === "collection") return "collection_inquiries";
  return "contact_inquiries";
}

const updateStatusFn = createServerFn({ method: "POST" })
  .validator(
    (
      data: Token & {
        subjectType: SubjectType;
        id: string;
        status: ApplicationStatus;
        note?: string;
      },
    ) => data,
  )
  .handler(async ({ data }) => {
    if (!isApplicationStatus(data.status)) throw new Error("Invalid status");
    if (!isSubjectType(data.subjectType)) throw new Error("unknown subject type");
    const { db, userId } = await requireDb(data.accessToken);
    const table = tableFor(data.subjectType);
    const { data: current } = await db.from(table).select("status").eq("id", data.id).maybeSingle();
    if (!current) throw new Error("Not found");
    const from = String((current as Record<string, unknown>)["status"] ?? "");
    const now = new Date().toISOString();
    const { error } = await db
      .from(table)
      .update({ status: data.status, updated_at: now })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await db.from("inquiry_status_events").insert({
      id: newId("evt"),
      subject_type: data.subjectType,
      subject_id: data.id,
      from_status: from,
      to_status: data.status,
      author_user_id: userId,
      note: data.note || null,
    });
    return { ok: true as const };
  });

/**
 * Columns cleared when a person asks for their data to be deleted. The row
 * itself stays so the funnel counts and the audit trail remain honest, but
 * nothing identifying is left in it.
 */
const PERSONAL_COLUMNS: Record<SubjectType, string[]> = {
  owner: [
    "full_name",
    "email",
    "phone",
    "storage_location",
    "questions",
    "concerns",
    "free_text",
    "photo_notes",
    "other_driver_conditions",
    "preferred_contact",
    "region_limit",
  ],
  collection: ["full_name", "email", "phone", "concerns", "kyoto_connection"],
  member: ["full_name", "email", "phone", "requests", "use_purpose"],
  contact: ["full_name", "email", "phone", "message"],
};

const anonymiseFn = createServerFn({ method: "POST" })
  .validator((data: Token & { subjectType: SubjectType; id: string }) => data)
  .handler(async ({ data }) => {
    if (!isSubjectType(data.subjectType)) throw new Error("unknown subject type");
    const { db, userId } = await requireDb(data.accessToken);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const column of PERSONAL_COLUMNS[data.subjectType]) patch[column] = null;
    patch["full_name"] = "（削除済み）";
    const { error } = await db.from(tableFor(data.subjectType)).update(patch).eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    await db.from("inquiry_status_events").insert({
      id: newId("evt"),
      subject_type: data.subjectType,
      subject_id: data.id,
      to_status: "personal_data_erased",
      author_user_id: userId,
      note: "本人からの削除請求に対応し、氏名・連絡先・自由記述を削除しました。",
      created_at: new Date().toISOString(),
    });
    return { ok: true as const };
  });

/**
 * Everything, every column, including the notes and the status history that the
 * per-table CSV exports leave behind entirely. This is the copy that would let
 * the business carry on if the database were lost, so it must not be a subset:
 * a lead without the record of what was said to it is only half a lead.
 *
 * The file is a JSON dump rather than CSV because notes and events are
 * one-to-many and would need their own files otherwise.
 */
const exportAllFn = createServerFn({ method: "POST" })
  .validator((data: Token) => data)
  .handler(async ({ data }) => {
    const { db } = await requireDb(data.accessToken);
    const tables = [
      "collection_inquiries",
      "owner_inquiries",
      "member_preregistrations",
      "contact_inquiries",
      "inquiry_notes",
      "inquiry_status_events",
      "legal_review_items",
      "notification_log",
    ];
    const dump: Record<string, unknown[]> = {};
    const failed: string[] = [];
    for (const table of tables) {
      const { data: rows, error } = await db
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        failed.push(table);
        continue;
      }
      dump[table] = rows ?? [];
    }
    const counts = Object.fromEntries(Object.entries(dump).map(([t, rows]) => [t, rows.length]));
    // Serialised here rather than returned as a structure: the payload is an
    // arbitrary row shape, and the caller only ever writes it to a file.
    const json = JSON.stringify(
      {
        exported_at: new Date().toISOString(),
        // Recorded so an old dump cannot be mistaken for a complete one after
        // the schema moves on.
        tables: Object.keys(dump),
        failed,
        counts,
        data: dump,
      },
      null,
      2,
    );
    return { json, counts, failed };
  });

/** Where a manually recorded lead came from. Form submissions carry "form". */
export const LEAD_CHANNELS = ["line", "phone", "in_person", "email", "referral", "other"] as const;
export type LeadChannel = (typeof LEAD_CHANNELS)[number];
export const LEAD_CHANNEL_LABEL: Record<LeadChannel, string> = {
  line: "LINE",
  phone: "電話",
  in_person: "対面",
  email: "メール",
  referral: "紹介",
  other: "その他",
};
export const CHANNEL_LABEL: Record<string, string> = { form: "フォーム", ...LEAD_CHANNEL_LABEL };

function isLeadChannel(value: string): value is LeadChannel {
  return (LEAD_CHANNELS as readonly string[]).includes(value);
}

/**
 * Records a lead that arrived outside the public forms — a LINE message, a
 * phone call, a conversation. Until this existed, those people had no row at
 * all: no status, no stale check, and nothing for a deletion request to act on.
 *
 * It writes a contact_inquiries row whatever the enquiry is about. That table
 * needs only a name, an address, a topic and the message, whereas the
 * collection form's table has twelve non-null columns that only a completed
 * form can supply. An intake conversation is an enquiry; if it turns into an
 * application, the person fills in the real form.
 *
 * privacy_agreed is written from the operator's own confirmation that they told
 * the person how their details would be used — it is not a claim that anyone
 * ticked a box.
 */
const createLeadFn = createServerFn({ method: "POST" })
  .validator(
    (
      data: Token & {
        channel: string;
        fullName: string;
        email: string;
        phone?: string | undefined;
        topic: string;
        message: string;
        consentConfirmed: boolean;
      },
    ) => data,
  )
  .handler(async ({ data }) => {
    if (!isLeadChannel(data.channel)) return { ok: false as const, error: "経路が不正です" };
    const fullName = data.fullName.trim();
    const message = data.message.trim();
    if (!fullName) return { ok: false as const, error: "氏名を入力してください" };
    if (!message) return { ok: false as const, error: "内容を入力してください" };
    if (!(CONTACT_TOPICS as readonly string[]).includes(data.topic)) {
      return { ok: false as const, error: "種別を選択してください" };
    }

    const { db, userId } = await requireDb(data.accessToken);
    const id = newId("inq");
    const now = new Date().toISOString();
    const { error } = await db.from("contact_inquiries").insert({
      id,
      full_name: fullName,
      // The address is optional for a phone lead; the column is not nullable.
      email: data.email.trim() || "",
      phone: data.phone?.trim() || null,
      topic: data.topic,
      message,
      privacy_agreed: data.consentConfirmed,
      status: "new",
      channel: data.channel,
      policy_version: POLICY_VERSION,
      created_at: now,
      updated_at: now,
    });
    if (error) return { ok: false as const, error: error.message };

    await db.from("inquiry_status_events").insert({
      id: newId("evt"),
      subject_type: "contact",
      subject_id: id,
      to_status: "new",
      author_user_id: userId,
      note: `${LEAD_CHANNEL_LABEL[data.channel]}経由の相談を手動で登録${data.consentConfirmed ? "（利用目的を案内し同意を確認済み）" : "（同意の確認は未取得）"}`,
      created_at: now,
    });
    return { ok: true as const, id };
  });

export const LEGAL_STATUSES = ["needs_review", "in_progress", "confirmed"] as const;
export type LegalStatus = (typeof LEGAL_STATUSES)[number];
export const LEGAL_STATUS_LABEL: Record<LegalStatus, string> = {
  needs_review: "要確認",
  in_progress: "確認中",
  confirmed: "確認済み",
};

export function isLegalStatus(value: string): value is LegalStatus {
  return (LEGAL_STATUSES as readonly string[]).includes(value);
}

/**
 * The checklist items live in code (LEGAL_TODOS) but their progress lives in
 * the database, so the row may not exist yet the first time one is touched.
 */
const setLegalStatusFn = createServerFn({ method: "POST" })
  .validator((data: Token & { id: string; status: string; note?: string }) => data)
  .handler(async ({ data }) => {
    if (!isLegalStatus(data.status)) throw new Error("unknown status");
    const { db, userId } = await requireDb(data.accessToken);
    const known = LEGAL_TODOS.find((t) => t.id === data.id);
    const { error } = await db.from("legal_review_items").upsert(
      {
        id: data.id,
        title: known?.title ?? data.id,
        detail: known?.detail ?? "",
        status: data.status,
      },
      { onConflict: "id" },
    );
    if (error) throw new Error(error.message);
    await db.from("inquiry_status_events").insert({
      id: newId("evt"),
      subject_type: "legal",
      subject_id: data.id,
      to_status: data.status,
      author_user_id: userId,
      note: data.note ?? null,
      created_at: new Date().toISOString(),
    });
    return { ok: true as const };
  });

const addNoteFn = createServerFn({ method: "POST" })
  .validator((data: Token & { subjectType: SubjectType; id: string; body: string }) => data)
  .handler(async ({ data }) => {
    const body = data.body.trim();
    if (!body) return { ok: false as const, error: "メモを入力してください。" };
    const { db, userId } = await requireDb(data.accessToken);
    const { error } = await db.from("inquiry_notes").insert({
      id: newId("note"),
      subject_type: data.subjectType,
      subject_id: data.id,
      body,
      author_user_id: userId,
    });
    if (error) return { ok: false as const, error: "保存に失敗しました。" };
    return { ok: true as const };
  });

async function token(): Promise<string> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("UNAUTHORIZED");
  return accessToken;
}

export async function getAdminSession() {
  const { getStaffSession } = await import("@/lib/staff");
  const session = await getStaffSession();
  if (!session) throw new Error("UNAUTHORIZED");
  // staff.role exists in the schema; hard-coding "admin" here made the column
  // decorative and any future role split silently ineffective.
  return { userId: session.userId, email: session.email, role: session.role };
}

export async function getDashboard() {
  return getDashboardFn({ data: { accessToken: await token() } });
}

export async function listCollections(arg: { data: { q?: string; status?: string } }) {
  const payload: { accessToken: string; q?: string; status?: string } = {
    accessToken: await token(),
  };
  if (arg.data.q) payload.q = arg.data.q;
  if (arg.data.status) payload.status = arg.data.status;
  return listCollectionsFn({ data: payload });
}

export async function getCollection(arg: { data: string }) {
  return getCollectionFn({ data: { accessToken: await token(), id: arg.data } });
}

export async function listOwners(arg: { data: { q?: string; status?: string } }) {
  const payload: { accessToken: string; q?: string; status?: string } = {
    accessToken: await token(),
  };
  if (arg.data.q) payload.q = arg.data.q;
  if (arg.data.status) payload.status = arg.data.status;
  return listOwnersFn({ data: payload });
}

export async function listMembers(arg: { data: { q?: string; status?: string } }) {
  const payload: { accessToken: string; q?: string; status?: string } = {
    accessToken: await token(),
  };
  if (arg.data.q) payload.q = arg.data.q;
  if (arg.data.status) payload.status = arg.data.status;
  return listMembersFn({ data: payload });
}

export async function listContacts(arg: { data: { q?: string; status?: string } }) {
  const payload: { accessToken: string; q?: string; status?: string } = {
    accessToken: await token(),
  };
  if (arg.data.q) payload.q = arg.data.q;
  if (arg.data.status) payload.status = arg.data.status;
  return listContactsFn({ data: payload });
}

export async function getOwner(arg: { data: string }) {
  return getOwnerFn({ data: { accessToken: await token(), id: arg.data } });
}

export async function getMember(arg: { data: string }) {
  return getMemberFn({ data: { accessToken: await token(), id: arg.data } });
}

export async function getContact(arg: { data: string }) {
  return getContactFn({ data: { accessToken: await token(), id: arg.data } });
}

export async function updateStatus(arg: {
  data: {
    subjectType: SubjectType;
    id: string;
    status: ApplicationStatus;
    note?: string | undefined;
  };
}) {
  return updateStatusFn({
    data: {
      accessToken: await token(),
      subjectType: arg.data.subjectType,
      id: arg.data.id,
      status: arg.data.status,
      ...(arg.data.note ? { note: arg.data.note } : {}),
    },
  });
}

export async function addNote(arg: {
  data: { subjectType: SubjectType; id: string; body: string };
}) {
  return addNoteFn({
    data: {
      accessToken: await token(),
      subjectType: arg.data.subjectType,
      id: arg.data.id,
      body: arg.data.body,
    },
  });
}

export async function setLegalStatus(arg: { data: { id: string; status: LegalStatus } }) {
  return setLegalStatusFn({
    data: { accessToken: await token(), id: arg.data.id, status: arg.data.status },
  });
}

export async function anonymise(arg: { data: { subjectType: SubjectType; id: string } }) {
  return anonymiseFn({
    data: { accessToken: await token(), subjectType: arg.data.subjectType, id: arg.data.id },
  });
}

export async function createLead(arg: {
  data: {
    channel: LeadChannel;
    fullName: string;
    email: string;
    phone?: string | undefined;
    topic: string;
    message: string;
    consentConfirmed: boolean;
  };
}) {
  return createLeadFn({ data: { accessToken: await token(), ...arg.data } });
}

export async function exportAll() {
  return exportAllFn({ data: { accessToken: await token() } });
}
