import { createServerFn } from "@tanstack/react-start";
import { LEGAL_TODOS } from "@/lib/content";
import { getAccessToken } from "@/lib/staff";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
  type ApplicationStatus,
  type SubjectType,
} from "@/lib/status";
import type {
  CollectionRow,
  ContactRow,
  EventRow,
  MemberRow,
  NoteRow,
  OwnerRow,
} from "@/lib/store";
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
    want_to_use_others: row["want_to_use_others"] == null ? null : String(row["want_to_use_others"]),
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
    return {
      owners: counts(owners),
      members: counts(members),
      contacts: counts(contacts),
      collections: counts(collections),
      recentOwners: owners.slice(0, 5),
      recentMembers: members.slice(0, 5),
      recentCollections: collections.slice(0, 5),
      legal,
    };
  });

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
  const notes: NoteRow[] = (notesRes.data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    return {
      id: String(row["id"] ?? ""),
      subject_type: subjectType,
      subject_id: subjectId,
      body: String(row["body"] ?? ""),
      author_user_id: String(row["author_user_id"] ?? ""),
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
  return { userId: session.userId, role: "admin" as const };
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
