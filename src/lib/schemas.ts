import { z } from "zod";

const email = z.string().trim().email("メールアドレスの形式を確認してください").max(200);

const name = z.string().trim().min(1, "氏名を入力してください").max(80);

const optionalPhone = z
  .string()
  .trim()
  .max(20)
  .refine((v) => v === "" || /^[0-9+\-() ]{10,20}$/.test(v), "電話番号の形式を確認してください")
  .optional()
  .or(z.literal(""));

export const REGIONS = ["京都市", "京都府内（京都市以外）"] as const;

export const OWNS_VEHICLE = ["はい", "いいえ"] as const;

export const ANNUAL_USE = [
  "ほとんど乗らない",
  "年に数回",
  "月に1回程度",
  "月に数回",
  "週に1回以上",
] as const;

export const STORAGE_TYPES = [
  "屋内ガレージ",
  "屋根付き",
  "屋外",
  "月極・共同駐車場",
  "その他",
] as const;

export const MILEAGE_BANDS = [
  "わからない",
  "5,000km未満",
  "5,000〜15,000km",
  "15,000〜30,000km",
  "30,000km以上",
] as const;

export const OWNER_INTERESTS = [
  "保管・日常管理",
  "バッテリー管理",
  "洗車・整備手配",
  "維持費負担の軽減",
  "車両提供の条件確認",
  "まずは話だけ聞きたい",
] as const;

export const PREFERRED_CONTACT = ["メール", "電話", "どちらでもよい"] as const;

export const USE_FREQUENCY = [
  "月1回程度",
  "月2〜3回",
  "週1回程度",
  "まずは少数回試したい",
  "まだ決めていない",
] as const;

export const INTEREST_MODELS = [
  "扱いやすいグランドツアラー",
  "オープンカー",
  "スポーツクーペ",
  "まだ決めていない",
] as const;

export const BUDGET_BANDS = [
  "未定・相談したい",
  "まずは試したい範囲",
  "本格的に乗りたい範囲",
  "料金より車種を重視",
] as const;

export const USE_PURPOSES = [
  "所有を検討する前の体験",
  "休日のドライブ",
  "特別な日の移動",
  "まだ決めていない",
] as const;

export const INCIDENT_OPTIONS = [
  "ない",
  "軽微な違反がある",
  "重大な違反または事故歴がある",
  "面談で詳しく話したい",
] as const;

export const CONTACT_TOPICS = [
  "車両提供について",
  "会員事前登録について",
  "取材・提携",
  "その他",
] as const;

const honeypot = z.string().optional();

const attribution = {
  utmSource: z.string().trim().max(200).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(200).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(200).optional().or(z.literal("")),
  utmContent: z.string().trim().max(200).optional().or(z.literal("")),
  utmTerm: z.string().trim().max(200).optional().or(z.literal("")),
  landingPath: z.string().trim().max(500).optional().or(z.literal("")),
  referrer: z.string().trim().max(500).optional().or(z.literal("")),
};

export function maxVehicleYear(): number {
  return new Date().getFullYear() + 1;
}

const optionalYear = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().int().min(1980, "年式を確認してください").max(maxVehicleYear(), "年式を確認してください").optional());

export const ownerInquirySchema = z.object({
  ownsVehicle: z.enum(OWNS_VEHICLE, {
    errorMap: () => ({ message: "所有の有無を選択してください" }),
  }),
  region: z.enum(REGIONS, { errorMap: () => ({ message: "保管地域を選択してください" }) }),
  make: z.string().trim().min(1, "メーカーを入力してください").max(80),
  model: z.string().trim().min(1, "車種を入力してください").max(80),
  year: optionalYear,
  mileageBand: z.enum(MILEAGE_BANDS).optional().or(z.literal("")),
  annualUseCount: z.enum(ANNUAL_USE, {
    errorMap: () => ({ message: "利用頻度を選択してください" }),
  }),
  storageType: z.enum(STORAGE_TYPES, {
    errorMap: () => ({ message: "保管形態を選択してください" }),
  }),
  interests: z.array(z.string()).min(1, "関心のある内容を1つ以上選んでください"),
  concerns: z.string().trim().min(1, "気になること・不安を入力してください").max(2000),
  fullName: name,
  email,
  phone: optionalPhone,
  preferredContact: z.enum(PREFERRED_CONTACT, {
    errorMap: () => ({ message: "連絡方法を選択してください" }),
  }),
  freeText: z.string().trim().max(2000).optional().or(z.literal("")),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }),
  }),
  companyUrl: honeypot,
  ...attribution,
});

export const memberPreregSchema = z.object({
  fullName: name,
  email,
  phone: z
    .string()
    .trim()
    .min(10, "電話番号を入力してください")
    .max(20, "電話番号が長すぎます")
    .regex(/^[0-9+\-() ]+$/, "電話番号の形式を確認してください"),
  age: z.coerce.number().int().min(30, "現時点の想定条件は30歳以上です").max(99),
  region: z.enum(REGIONS, { errorMap: () => ({ message: "居住地域を選択してください" }) }),
  licenseYears: z.coerce.number().int().min(5, "現時点の想定条件は免許取得5年以上です").max(60),
  useFrequency: z.enum(USE_FREQUENCY, {
    errorMap: () => ({ message: "利用頻度を選択してください" }),
  }),
  interestModels: z.array(z.string()).min(1, "興味のある車種を1つ以上選んでください"),
  budgetBand: z.enum(BUDGET_BANDS, {
    errorMap: () => ({ message: "希望の料金感を選択してください" }),
  }),
  usePurpose: z.enum(USE_PURPOSES, { errorMap: () => ({ message: "利用目的を選択してください" }) }),
  incidentHistory: z.enum(INCIDENT_OPTIONS, {
    errorMap: () => ({ message: "自己申告を選択してください" }),
  }),
  requests: z.string().trim().max(2000).optional().or(z.literal("")),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }),
  }),
  companyUrl: honeypot,
  ...attribution,
});

export const contactSchema = z.object({
  fullName: name,
  email,
  phone: optionalPhone,
  topic: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "種別を選択してください" }) }),
  message: z.string().trim().min(10, "内容を10文字以上入力してください").max(3000),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }),
  }),
  companyUrl: honeypot,
  ...attribution,
});

export type OwnerInquiryInput = z.infer<typeof ownerInquirySchema>;
export type MemberPreregInput = z.infer<typeof memberPreregSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPath?: string;
  referrer?: string;
};

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function focusFirstError(errors: Record<string, string>) {
  const first = Object.keys(errors)[0];
  if (!first || typeof document === "undefined") return;
  const el = document.getElementById(first);
  if (el && "focus" in el) {
    (el as HTMLElement).focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
