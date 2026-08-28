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

const requiredPhone = z
  .string()
  .trim()
  .min(10, "電話番号を入力してください")
  .max(20, "電話番号が長すぎます")
  .regex(/^[0-9+\-() ]+$/, "電話番号の形式を確認してください");

/** OWNER NETWORK: Kyoto storage / handover region only. */
export const REGIONS = ["京都市", "京都府内（京都市以外）"] as const;

/** Residence may be outside Kyoto. Storage/handover is still Kyoto. */
export const RESIDENCE_REGIONS = ["京都市", "京都府内（京都市以外）", "京都府外"] as const;

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

export const OWNER_PURPOSES = [
  "他の登録車両を利用したい",
  "愛車を登録したい",
  "両方",
  "まず説明を聞きたい",
] as const;

export const OWNER_MANAGEMENT = [
  "洗車・整備手配",
  "予約と受け渡し",
  "利用前後の記録",
  "まずは話だけ聞きたい",
] as const;

/** @deprecated kept for archived member records */
export const OWNER_INTERESTS = OWNER_MANAGEMENT;

export const YES_NO = ["はい", "いいえ"] as const;

export const YES_NO_UNDECIDED = ["可", "不可", "未定"] as const;

export const HANDOVER_ACCESS = ["はい", "確認が必要", "未定"] as const;

export const DAILY_KM_PREFS = [
  "1日200kmを基準でよい",
  "200kmより短くしたい",
  "200kmより長くしたい",
  "車両ごとに相談したい",
] as const;

export const MIN_DRIVER_AGE_OPTIONS = ["KSC基準（25歳）でよい", "30歳以上", "未定"] as const;

export const LICENSE_YEAR_OPTIONS = ["KSC基準（5年以上）でよい", "10年以上", "未定"] as const;

export const PREFERRED_CONTACT = ["メール", "電話", "どちらでもよい"] as const;

export const PARTICIPATION_OPTIONS = [
  "車について知る・学ぶ",
  "展示や交流イベントへ参加したい",
  "オーナーの話を聞きたい",
  "将来ドライビング会員になりたい",
  "車両の利用を希望している",
  "まだ決めていない",
] as const;

export const DRIVING_INTERESTS = [
  "将来ドライビング会員になりたい",
  "車両の利用を希望している",
] as const;

export function wantsDrivingMembership(interests: string[]): boolean {
  return interests.some((item) => (DRIVING_INTERESTS as readonly string[]).includes(item));
}

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
  "詳しく話したい",
] as const;

export const CONTACT_TOPICS = [
  "共同所有について",
  "オーナーネットワークについて",
  "取材・提携",
  "その他",
] as const;

export const APPLICANT_TYPES = ["個人", "法人"] as const;

export const KYOTO_CONNECTIONS = [
  "京都で定期的に車両を利用できる",
  "これから京都での利用を検討",
  "保管・受け渡しは京都で問題ない",
  "その他",
] as const;

export const CURRENT_VEHICLE_STATUS = [
  "スーパーカーを所有している",
  "普通車を所有している",
  "所有していない",
  "その他",
] as const;

export const COLLECTION_BUDGETS = [
  "未定・相談したい",
  "約500万円の上限目安で検討したい",
  "500万円より抑えたい",
  "車両による",
] as const;

export const DESIRED_DAYS = [
  "計画の年間24日でよい",
  "24日より少なくしたい",
  "24日より多くしたい",
  "まだ決めていない",
] as const;

export const DESIRED_KM = [
  "計画の年間800kmでよい",
  "800kmより少なくしたい",
  "800kmより多くしたい",
  "まだ決めていない",
] as const;

export const START_TIMING = [
  "できるだけ早く話を聞きたい",
  "半年以内",
  "1年以内",
  "まだ決めていない",
] as const;

export const COLLECTION_PRIORITIES = [
  "保管の質",
  "利用日の確保",
  "費用の見通し",
  "車種",
  "少人数であること",
  "売却時の扱い",
  "まだ決めていない",
] as const;

export const VEHICLE_CONDITIONS = ["新車", "中古", "どちらでも"] as const;

export const RESALE_PRIORITIES = [
  "できるだけ長く乗る",
  "3年程度での売却も視野",
  "残価より乗り味",
  "再販しやすい車種を優先",
  "まだ決めていない",
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

const optionalLicenseYears = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().int().min(0, "免許取得年数を確認してください").max(70).optional());

const optionalAge = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.coerce.number().int().min(10, "年齢を確認してください").max(99).optional());

export const ownerInquirySchema = z.object({
  ownsVehicle: z.enum(OWNS_VEHICLE, {
    message: "所有の有無を選択してください",
  }),
  region: z.enum(REGIONS, { message: "保管地域を選択してください" }),
  make: z.string().trim().min(1, "メーカーを入力してください").max(80),
  model: z.string().trim().min(1, "車種を入力してください").max(80),
  year: optionalYear,
  mileageBand: z.enum(MILEAGE_BANDS).optional().or(z.literal("")),
  annualUseCount: z.enum(ANNUAL_USE, {
    message: "利用頻度を選択してください",
  }),
  storageType: z.enum(STORAGE_TYPES, {
    message: "保管形態を選択してください",
  }),
  participationPurpose: z.enum(OWNER_PURPOSES, {
    message: "参加目的を選択してください",
  }),
  wantToUseOthers: z.enum(YES_NO, {
    message: "他車利用の希望を選択してください",
  }),
  wantToRegisterCar: z.enum(YES_NO, {
    message: "愛車登録の希望を選択してください",
  }),
  priorityUsePeriod: z.string().trim().min(1, "希望する利用可能日を入力してください").max(500),
  dailyKmPreference: z.enum(DAILY_KM_PREFS, {
    message: "距離の希望を選択してください",
  }),
  minDriverAge: z.enum(MIN_DRIVER_AGE_OPTIONS, {
    message: "運転者の最低年齢希望を選択してください",
  }),
  requiredLicenseYears: z.enum(LICENSE_YEAR_OPTIONS, {
    message: "免許歴の希望を選択してください",
  }),
  rainUse: z.enum(YES_NO_UNDECIDED, {
    message: "雨天利用の可否を選択してください",
  }),
  snowUse: z.enum(YES_NO_UNDECIDED, {
    message: "降雪時利用の可否を選択してください",
  }),
  regionLimit: z.string().trim().max(500).optional().or(z.literal("")),
  outdoorNightParking: z.enum(YES_NO_UNDECIDED, {
    message: "屋外夜間保管の可否を選択してください",
  }),
  handoverAccessOk: z.enum(HANDOVER_ACCESS, {
    message: "受け渡し時のアクセス可否を選択してください",
  }),
  otherDriverConditions: z.string().trim().max(2000).optional().or(z.literal("")),
  managementNeeds: z.array(z.string()).optional(),
  annualKmCap: z.string().trim().max(200).optional().or(z.literal("")),
  concerns: z.string().trim().min(1, "気になること・質問を入力してください").max(2000),
  fullName: name,
  email,
  phone: requiredPhone,
  preferLine: z.boolean().optional(),
  privacyAgreed: z.literal(true, {
    message: "プライバシーポリシーへの同意が必要です",
  }),
  companyUrl: honeypot,
  ...attribution,
});

export const collectionInquirySchema = z.object({
  fullName: name,
  email,
  phone: requiredPhone,
  applicantType: z.enum(APPLICANT_TYPES, {
    message: "個人または法人を選択してください",
  }),
  region: z.enum(RESIDENCE_REGIONS, { message: "居住地域を選択してください" }),
  kyotoConnection: z.enum(KYOTO_CONNECTIONS, {
    message: "京都での利用・受け渡しについて選択してください",
  }),
  currentVehicleStatus: z.enum(CURRENT_VEHICLE_STATUS, {
    message: "現在の車両所有状況を選択してください",
  }),
  desiredMake: z.string().trim().min(1, "希望メーカーを入力してください").max(80),
  desiredModel: z.string().trim().min(1, "希望車種を入力してください").max(80),
  desiredModels: z.string().trim().min(1, "希望する車種・メーカーを入力してください").max(500),
  vehicleCondition: z.enum(VEHICLE_CONDITIONS, {
    message: "新車・中古の希望を選択してください",
  }),
  budgetBand: z.enum(COLLECTION_BUDGETS, {
    message: "予算感を選択してください",
  }),
  desiredDaysPerYear: z.enum(DESIRED_DAYS, {
    message: "希望する年間利用日数を選択してください",
  }),
  desiredKmPerYear: z.enum(DESIRED_KM, {
    message: "希望する年間走行距離を選択してください",
  }),
  desiredStartTiming: z.enum(START_TIMING, {
    message: "希望する開始時期を選択してください",
  }),
  wantValueCheck: z.enum(YES_NO, {
    message: "VALUE CHECKの希望を選択してください",
  }),
  resalePriorities: z.array(z.string()).min(1, "再販・保有の考え方を1つ以上選んでください"),
  licenseYears: optionalLicenseYears,
  incidentHistory: z.enum(INCIDENT_OPTIONS).optional().or(z.literal("")),
  priorities: z.array(z.string()).min(1, "重視する条件を1つ以上選んでください"),
  concerns: z.string().trim().max(2000).optional().or(z.literal("")),
  preferLine: z.boolean().optional(),
  privacyAgreed: z.literal(true, {
    message: "プライバシーポリシーへの同意が必要です",
  }),
  companyUrl: honeypot,
  ...attribution,
});

export const memberPreregSchema = z
  .object({
    participationInterests: z.array(z.string()).min(1, "興味のある参加方法を1つ以上選んでください"),
    fullName: name,
    email,
    phone: requiredPhone,
    age: optionalAge,
    region: z.enum(REGIONS, { message: "居住地域を選択してください" }),
    licenseYears: optionalLicenseYears,
    useFrequency: z.enum(USE_FREQUENCY).optional().or(z.literal("")),
    interestModels: z.array(z.string()).optional(),
    budgetBand: z.enum(BUDGET_BANDS).optional().or(z.literal("")),
    usePurpose: z.enum(USE_PURPOSES).optional().or(z.literal("")),
    incidentHistory: z.enum(INCIDENT_OPTIONS).optional().or(z.literal("")),
    requests: z.string().trim().max(2000).optional().or(z.literal("")),
    privacyAgreed: z.literal(true, {
      message: "プライバシーポリシーへの同意が必要です",
    }),
    companyUrl: honeypot,
    ...attribution,
  })
  .superRefine((value, ctx) => {
    if (!wantsDrivingMembership(value.participationInterests)) return;
    if (value.licenseYears === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["licenseYears"],
        message: "免許取得年数を入力してください",
      });
    }
    if (!value.useFrequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["useFrequency"],
        message: "利用頻度を選択してください",
      });
    }
    if (!value.incidentHistory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["incidentHistory"],
        message: "自己申告を選択してください",
      });
    }
  });

export const contactSchema = z.object({
  fullName: name,
  email,
  phone: optionalPhone,
  topic: z.enum(CONTACT_TOPICS, { message: "種別を選択してください" }),
  message: z.string().trim().min(10, "内容を10文字以上入力してください").max(3000),
  privacyAgreed: z.literal(true, {
    message: "プライバシーポリシーへの同意が必要です",
  }),
  companyUrl: honeypot,
  ...attribution,
});

export type OwnerInquiryInput = z.infer<typeof ownerInquirySchema>;
export type CollectionInquiryInput = z.infer<typeof collectionInquirySchema>;
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
