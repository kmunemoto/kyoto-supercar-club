import {
  contactSchema,
  fieldErrors,
  memberPreregSchema,
  ownerInquirySchema,
  type ContactInput,
  type MemberPreregInput,
  type OwnerInquiryInput,
} from "@/lib/schemas";
import { pushEvent, writeDb } from "@/lib/store";
import { newId } from "@/lib/utils";

type Result = { ok: true; id: string } | { ok: false; error: string; fields?: Record<string, string> };

function spam(data: { companyUrl?: string | undefined }): boolean {
  return Boolean(data.companyUrl && data.companyUrl.trim());
}

export async function submitOwnerInquiry(arg: { data: unknown }): Promise<Result> {
  const parsed = ownerInquirySchema.safeParse(arg.data);
  if (!parsed.success) {
    return { ok: false, error: "入力内容を確認してください。", fields: fieldErrors(parsed.error) };
  }
  if (spam(parsed.data)) return { ok: true, id: "ignored" };
  const d = parsed.data as OwnerInquiryInput;
  const id = newId("own");
  const now = new Date().toISOString();
  writeDb((db) => {
    db.owners.unshift({
      id,
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      region: d.region,
      make: d.make,
      model: d.model,
      year: d.year,
      mileage_km: d.mileageKm,
      storage_location: d.storageLocation,
      annual_use_count: d.annualUseCount,
      lendable_period: d.lendablePeriod,
      management_needs: d.managementNeeds,
      reward_preference: d.rewardPreference,
      photo_notes: d.photoNotes || null,
      questions: d.questions || null,
      status: "new",
      created_at: now,
      updated_at: now,
    });
    pushEvent(db, "owner", id, null, "new", null, "フォーム受付");
  });
  return { ok: true, id };
}

export async function submitMemberPrereg(arg: { data: unknown }): Promise<Result> {
  const parsed = memberPreregSchema.safeParse(arg.data);
  if (!parsed.success) {
    return { ok: false, error: "入力内容を確認してください。", fields: fieldErrors(parsed.error) };
  }
  if (spam(parsed.data)) return { ok: true, id: "ignored" };
  const d = parsed.data as MemberPreregInput;
  const id = newId("mem");
  const now = new Date().toISOString();
  writeDb((db) => {
    db.members.unshift({
      id,
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      age: d.age,
      region: d.region,
      license_years: d.licenseYears,
      use_frequency: d.useFrequency,
      interest_models: d.interestModels,
      budget_band: d.budgetBand,
      use_purpose: d.usePurpose,
      incident_history: d.incidentHistory,
      requests: d.requests || null,
      status: "new",
      created_at: now,
      updated_at: now,
    });
    pushEvent(db, "member", id, null, "new", null, "フォーム受付");
  });
  return { ok: true, id };
}

export async function submitContact(arg: { data: unknown }): Promise<Result> {
  const parsed = contactSchema.safeParse(arg.data);
  if (!parsed.success) {
    return { ok: false, error: "入力内容を確認してください。", fields: fieldErrors(parsed.error) };
  }
  if (spam(parsed.data)) return { ok: true, id: "ignored" };
  const d = parsed.data as ContactInput;
  const id = newId("inq");
  const now = new Date().toISOString();
  writeDb((db) => {
    db.contacts.unshift({
      id,
      full_name: d.fullName,
      email: d.email,
      phone: d.phone || null,
      topic: d.topic,
      message: d.message,
      status: "new",
      created_at: now,
      updated_at: now,
    });
    pushEvent(db, "contact", id, null, "new", null, "フォーム受付");
  });
  return { ok: true, id };
}
