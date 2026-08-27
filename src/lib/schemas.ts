import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(10, "電話番号を入力してください")
  .max(20, "電話番号が長すぎます")
  .regex(/^[0-9+\-() ]+$/, "電話番号の形式を確認してください");

const email = z.string().trim().email("メールアドレスの形式を確認してください").max(200);

const name = z.string().trim().min(1, "氏名を入力してください").max(80);

export const REGIONS = [
  "京都市",
  "京都府（京都市以外）",
  "滋賀県",
  "大阪府北部",
  "その他",
] as const;

export const ANNUAL_USE = [
  "ほとんど乗らない",
  "年に数回",
  "月に1回程度",
  "月に数回",
  "週に1回以上",
] as const;

export const MANAGEMENT_OPTIONS = [
  "空調・防犯に配慮した屋内保管",
  "バッテリー管理と定期始動",
  "洗車の手配",
  "点検・整備の手配",
  "GPS・走行履歴の管理",
  "利用前後の写真と傷の記録",
] as const;

export const REWARD_OPTIONS = [
  "固定報酬を希望",
  "利用実績に応じた分配を希望",
  "相談して決めたい",
] as const;

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

export const ownerInquirySchema = z.object({
  fullName: name,
  email,
  phone,
  region: z.enum(REGIONS, { errorMap: () => ({ message: "居住地域を選択してください" }) }),
  make: z.string().trim().min(1, "メーカーを入力してください").max(80),
  model: z.string().trim().min(1, "車種を入力してください").max(80),
  year: z.coerce.number().int().min(1980, "年式を確認してください").max(2027),
  mileageKm: z.coerce.number().int().min(0, "走行距離を入力してください").max(500000),
  storageLocation: z.string().trim().min(1, "保管場所を入力してください").max(200),
  annualUseCount: z.enum(ANNUAL_USE, { errorMap: () => ({ message: "利用回数を選択してください" }) }),
  lendablePeriod: z.string().trim().min(1, "貸し出せる期間を入力してください").max(200),
  managementNeeds: z.array(z.string()).min(1, "希望する管理内容を1つ以上選んでください"),
  rewardPreference: z.enum(REWARD_OPTIONS, { errorMap: () => ({ message: "報酬方式を選択してください" }) }),
  photoNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  questions: z.string().trim().max(2000).optional().or(z.literal("")),
  privacyAgreed: z.literal(true, { errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }) }),
  companyUrl: honeypot,
});

export const memberPreregSchema = z.object({
  fullName: name,
  email,
  phone,
  age: z.coerce.number().int().min(30, "現時点の想定条件は30歳以上です").max(99),
  region: z.enum(REGIONS, { errorMap: () => ({ message: "居住地域を選択してください" }) }),
  licenseYears: z.coerce
    .number()
    .int()
    .min(5, "現時点の想定条件は免許取得5年以上です")
    .max(60),
  useFrequency: z.enum(USE_FREQUENCY, { errorMap: () => ({ message: "利用頻度を選択してください" }) }),
  interestModels: z.array(z.string()).min(1, "興味のある車種を1つ以上選んでください"),
  budgetBand: z.enum(BUDGET_BANDS, { errorMap: () => ({ message: "希望の料金感を選択してください" }) }),
  usePurpose: z.enum(USE_PURPOSES, { errorMap: () => ({ message: "利用目的を選択してください" }) }),
  incidentHistory: z.enum(INCIDENT_OPTIONS, { errorMap: () => ({ message: "自己申告を選択してください" }) }),
  requests: z.string().trim().max(2000).optional().or(z.literal("")),
  privacyAgreed: z.literal(true, { errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }) }),
  companyUrl: honeypot,
});

export const contactSchema = z.object({
  fullName: name,
  email,
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  topic: z.enum(CONTACT_TOPICS, { errorMap: () => ({ message: "種別を選択してください" }) }),
  message: z.string().trim().min(10, "内容を10文字以上入力してください").max(3000),
  privacyAgreed: z.literal(true, { errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }) }),
  companyUrl: honeypot,
});

export type OwnerInquiryInput = z.infer<typeof ownerInquirySchema>;
export type MemberPreregInput = z.infer<typeof memberPreregSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
