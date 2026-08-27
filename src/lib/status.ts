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
  interview_scheduled: "面談予定",
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

export const SUBJECT_TYPES = ["owner", "member", "contact"] as const;
export type SubjectType = (typeof SUBJECT_TYPES)[number];

export const SUBJECT_LABEL: Record<SubjectType, string> = {
  owner: "車両オーナー申込",
  member: "会員事前登録",
  contact: "お問い合わせ",
};
