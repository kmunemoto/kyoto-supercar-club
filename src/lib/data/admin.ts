import { requireStaffSession } from "@/lib/staff";
import {
  APPLICATION_STATUSES,
  isApplicationStatus,
  type ApplicationStatus,
  type SubjectType,
} from "@/lib/status";
import {
  readDb,
  writeDb,
  pushEvent,
  type ContactRow,
  type EventRow,
  type MemberRow,
  type NoteRow,
  type OwnerRow,
} from "@/lib/store";
import { newId } from "@/lib/utils";

export type { ContactRow, EventRow, MemberRow, NoteRow, OwnerRow };

export type StatusCount = { status: string; n: number };

function matches(q: string, ...fields: Array<string | number | null | undefined>) {
  if (!q) return true;
  const n = q.toLowerCase();
  return fields.some((f) => String(f ?? "").toLowerCase().includes(n));
}

function counts(rows: { status: string }[]): StatusCount[] {
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.status, (map.get(r.status) ?? 0) + 1);
  return APPLICATION_STATUSES.map((status) => ({ status, n: map.get(status) ?? 0 }));
}

export async function getAdminSession() {
  const staff = requireStaffSession();
  return { userId: staff.email, role: staff.role };
}

export async function getDashboard() {
  requireStaffSession();
  const db = readDb();
  return {
    owners: counts(db.owners),
    members: counts(db.members),
    contacts: counts(db.contacts),
    recentOwners: [...db.owners].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    recentMembers: [...db.members].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    legal: db.legal,
  };
}

export async function listOwners(arg: { data: { q?: string; status?: string } }) {
  requireStaffSession();
  const db = readDb();
  const status = arg.data.status && isApplicationStatus(arg.data.status) ? arg.data.status : "all";
  const q = (arg.data.q ?? "").trim();
  return db.owners
    .filter(
      (r) =>
        (status === "all" || r.status === status) &&
        matches(q, r.full_name, r.email, r.phone, r.make, r.model, r.region),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listMembers(arg: { data: { q?: string; status?: string } }) {
  requireStaffSession();
  const db = readDb();
  const status = arg.data.status && isApplicationStatus(arg.data.status) ? arg.data.status : "all";
  const q = (arg.data.q ?? "").trim();
  return db.members
    .filter(
      (r) =>
        (status === "all" || r.status === status) &&
        matches(q, r.full_name, r.email, r.phone, r.region, r.use_purpose),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listContacts(arg: { data: { q?: string; status?: string } }) {
  requireStaffSession();
  const db = readDb();
  const status = arg.data.status && isApplicationStatus(arg.data.status) ? arg.data.status : "all";
  const q = (arg.data.q ?? "").trim();
  return db.contacts
    .filter(
      (r) =>
        (status === "all" || r.status === status) &&
        matches(q, r.full_name, r.email, r.phone, r.topic, r.message),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function trail(subjectType: SubjectType, subjectId: string) {
  const db = readDb();
  const notes = db.notes
    .filter((n) => n.subject_type === subjectType && n.subject_id === subjectId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const events = db.events
    .filter((e) => e.subject_type === subjectType && e.subject_id === subjectId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { notes, events };
}

export async function getOwner(arg: { data: string }) {
  requireStaffSession();
  const id = arg.data;
  const row = readDb().owners.find((r) => r.id === id);
  if (!row) return null;
  return { row, ...trail("owner", id) };
}

export async function getMember(arg: { data: string }) {
  requireStaffSession();
  const id = arg.data;
  const row = readDb().members.find((r) => r.id === id);
  if (!row) return null;
  return { row, ...trail("member", id) };
}

export async function getContact(arg: { data: string }) {
  requireStaffSession();
  const id = arg.data;
  const row = readDb().contacts.find((r) => r.id === id);
  if (!row) return null;
  return { row, ...trail("contact", id) };
}

export async function updateStatus(arg: {
  data: { subjectType: SubjectType; id: string; status: ApplicationStatus; note?: string | undefined };
}) {
  const staff = requireStaffSession();
  const data = arg.data;
  if (!isApplicationStatus(data.status)) throw new Error("Invalid status");
  writeDb((db) => {
    const list =
      data.subjectType === "owner" ? db.owners : data.subjectType === "member" ? db.members : db.contacts;
    const row = list.find((r) => r.id === data.id);
    if (!row) throw new Error("Not found");
    const from = row.status;
    row.status = data.status;
    row.updated_at = new Date().toISOString();
    pushEvent(db, data.subjectType, data.id, from, data.status, staff.email, data.note || null);
  });
  return { ok: true as const };
}

export async function addNote(arg: { data: { subjectType: SubjectType; id: string; body: string } }) {
  const staff = requireStaffSession();
  const body = arg.data.body.trim();
  if (!body) return { ok: false as const, error: "メモを入力してください。" };
  writeDb((db) => {
    db.notes.unshift({
      id: newId("note"),
      subject_type: arg.data.subjectType,
      subject_id: arg.data.id,
      body,
      author_user_id: staff.email,
      created_at: new Date().toISOString(),
    });
  });
  return { ok: true as const };
}

export const STATUSES = APPLICATION_STATUSES;
