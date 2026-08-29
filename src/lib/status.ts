export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "interview_scheduled",
  "terms_adjusting",
  "approved",
  "on_hold",
  "declined",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "新規",
  reviewing: "確認中",
  interview_scheduled: "追加確認",
  terms_adjusting: "条件調整中",
  approved: "承認",
  on_hold: "保留",
  declined: "見送り",
};

export const STATUS_TONE: Record<ApplicationStatus, string> = {
  new: "bg-oxblood/10 text-oxblood",
  reviewing: "bg-copper/15 text-copper",
  interview_scheduled: "bg-ink/8 text-ink",
  terms_adjusting: "bg-warn/12 text-warn",
  approved: "bg-success/12 text-success",
  on_hold: "bg-muted/15 text-muted",
  declined: "bg-line text-muted",
};

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return (APPLICATION_STATUSES as readonly string[]).includes(value);
}

export const SUBJECT_TYPES = ["owner", "member", "contact", "collection"] as const;
export type SubjectType = (typeof SUBJECT_TYPES)[number];

export function isSubjectType(value: string): value is SubjectType {
  return (SUBJECT_TYPES as readonly string[]).includes(value);
}

/**
 * Trail entries that are not status transitions. Without this the timeline
 * would print the raw slug.
 */
export const EVENT_LABEL: Record<string, string> = {
  personal_data_erased: "個人情報を削除",
};

export const SUBJECT_LABEL: Record<SubjectType, string> = {
  owner: "オーナーネットワーク申込",
  member: "旧・会員事前登録",
  contact: "お問い合わせ",
  collection: "共同オーナー候補",
};
