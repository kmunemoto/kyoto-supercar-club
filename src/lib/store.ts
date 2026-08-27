import { LEGAL_TODOS } from "@/lib/content";
import type { ApplicationStatus, SubjectType } from "@/lib/status";
import { newId } from "@/lib/utils";

const KEY = "ksc.db.v1";

export type OwnerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  region: string;
  make: string;
  model: string;
  year: number;
  mileage_km: number;
  storage_location: string;
  annual_use_count: string;
  lendable_period: string;
  management_needs: string[];
  reward_preference: string;
  photo_notes: string | null;
  questions: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type MemberRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  region: string;
  license_years: number;
  use_frequency: string;
  interest_models: string[];
  budget_band: string;
  use_purpose: string;
  incident_history: string;
  requests: string | null;
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
  created_at: string;
};

export type EventRow = {
  id: string;
  subject_type: SubjectType;
  subject_id: string;
  from_status: string | null;
  to_status: string;
  author_user_id: string | null;
  note: string | null;
  created_at: string;
};

export type LegalItem = {
  id: string;
  title: string;
  detail: string;
  status: string;
};

type Db = {
  owners: OwnerRow[];
  members: MemberRow[];
  contacts: ContactRow[];
  notes: NoteRow[];
  events: EventRow[];
  legal: LegalItem[];
  seeded: boolean;
};

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}

function emptyDb(): Db {
  return {
    owners: [],
    members: [],
    contacts: [],
    notes: [],
    events: [],
    legal: LEGAL_TODOS.map((t) => ({
      id: t.id,
      title: t.title,
      detail: t.detail,
      status: "needs_review",
    })),
    seeded: false,
  };
}

function seed(db: Db): Db {
  if (db.seeded) return db;
  const owners: OwnerRow[] = [
    {
      id: "own_demo_01",
      full_name: "高橋 健一",
      email: "kenichi.takahashi@example.com",
      phone: "075-000-1101",
      region: "京都市",
      make: "未記載（相談）",
      model: "クーペ",
      year: 2018,
      mileage_km: 14200,
      storage_location: "京都市左京区・自宅ガレージ",
      annual_use_count: "年に数回",
      lendable_period: "平日中心、年末年始は自分で使いたい",
      management_needs: ["空調・防犯に配慮した屋内保管", "バッテリー管理と定期始動", "洗車の手配"],
      reward_preference: "相談して決めたい",
      photo_notes: "面談時に写真を共有予定",
      questions: "雨の日の保管が一番心配です。",
      status: "new",
      created_at: daysAgo(2),
      updated_at: daysAgo(2),
    },
    {
      id: "own_demo_02",
      full_name: "中村 佐和子",
      email: "sawako.nakamura@example.com",
      phone: "077-000-2202",
      region: "滋賀県",
      make: "未記載（相談）",
      model: "オープン",
      year: 2016,
      mileage_km: 22100,
      storage_location: "大津市・屋外カーポート",
      annual_use_count: "月に1回程度",
      lendable_period: "夏以外は相談可",
      management_needs: ["空調・防犯に配慮した屋内保管", "点検・整備の手配", "利用前後の写真と傷の記録"],
      reward_preference: "固定報酬を希望",
      photo_notes: null,
      questions: "自宅では屋根が浅く、保管場所を探しています。",
      status: "reviewing",
      created_at: daysAgo(6),
      updated_at: daysAgo(6),
    },
    {
      id: "own_demo_03",
      full_name: "山本 直人",
      email: "naoto.yamamoto@example.com",
      phone: "06-0000-3303",
      region: "大阪府北部",
      make: "未記載（相談）",
      model: "グランドツアラー",
      year: 2020,
      mileage_km: 8300,
      storage_location: "吹田市・立体駐車場",
      annual_use_count: "ほとんど乗らない",
      lendable_period: "週末以外",
      management_needs: ["バッテリー管理と定期始動", "GPS・走行履歴の管理"],
      reward_preference: "利用実績に応じた分配を希望",
      photo_notes: "外装の凹みが数箇所あります",
      questions: "自分が乗る日を絶対に優先してほしい。",
      status: "interview_scheduled",
      created_at: daysAgo(11),
      updated_at: daysAgo(11),
    },
  ];
  const members: MemberRow[] = [
    {
      id: "mem_demo_01",
      full_name: "伊藤 美咲",
      email: "misaki.ito@example.com",
      phone: "090-0000-4404",
      age: 34,
      region: "京都市",
      license_years: 12,
      use_frequency: "月1回程度",
      interest_models: ["扱いやすいグランドツアラー", "まだ決めていない"],
      budget_band: "まずは試したい範囲",
      use_purpose: "所有を検討する前の体験",
      incident_history: "ない",
      requests: "まずは静かに乗れる車を希望します。",
      status: "new",
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      id: "mem_demo_02",
      full_name: "小林 大輔",
      email: "daisuke.kobayashi@example.com",
      phone: "080-0000-5505",
      age: 41,
      region: "大阪府北部",
      license_years: 20,
      use_frequency: "月2〜3回",
      interest_models: ["スポーツクーペ"],
      budget_band: "本格的に乗りたい範囲",
      use_purpose: "休日のドライブ",
      incident_history: "軽微な違反がある",
      requests: null,
      status: "reviewing",
      created_at: daysAgo(4),
      updated_at: daysAgo(4),
    },
    {
      id: "mem_demo_03",
      full_name: "加藤 悠",
      email: "yu.kato@example.com",
      phone: "070-0000-6606",
      age: 38,
      region: "滋賀県",
      license_years: 16,
      use_frequency: "まずは少数回試したい",
      interest_models: ["オープンカー", "扱いやすいグランドツアラー"],
      budget_band: "未定・相談したい",
      use_purpose: "特別な日の移動",
      incident_history: "ない",
      requests: "保証金の目安が知りたいです。",
      status: "on_hold",
      created_at: daysAgo(9),
      updated_at: daysAgo(9),
    },
    {
      id: "mem_demo_04",
      full_name: "藤田 遼",
      email: "ryo.fujita@example.com",
      phone: "090-0000-7707",
      age: 52,
      region: "京都市",
      license_years: 30,
      use_frequency: "まだ決めていない",
      interest_models: ["まだ決めていない"],
      budget_band: "料金より車種を重視",
      use_purpose: "所有を検討する前の体験",
      incident_history: "面談で詳しく話したい",
      requests: "運転にブランクがあります。",
      status: "interview_scheduled",
      created_at: daysAgo(13),
      updated_at: daysAgo(13),
    },
  ];
  const contacts: ContactRow[] = [
    {
      id: "inq_demo_01",
      full_name: "メディア 京都",
      email: "press@example.com",
      phone: null,
      topic: "取材・提携",
      message: "準備中の会員制サービスについて、掲載の可否を伺いたくご連絡しました。",
      status: "new",
      created_at: daysAgo(3),
      updated_at: daysAgo(3),
    },
    {
      id: "inq_demo_02",
      full_name: "田中",
      email: "tanaka@example.com",
      phone: "075-000-8808",
      topic: "車両提供について",
      message: "2台所有しています。両方相談できますか。",
      status: "reviewing",
      created_at: daysAgo(8),
      updated_at: daysAgo(8),
    },
  ];
  return { ...db, owners, members, contacts, seeded: true };
}

function load(): Db {
  if (typeof window === "undefined") return emptyDb();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = seed(emptyDb());
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Db;
    if (!parsed.seeded) {
      const seeded = seed({ ...emptyDb(), ...parsed });
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return seed(emptyDb());
  }
}

function save(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function readDb(): Db {
  return load();
}

export function writeDb(mutator: (db: Db) => void): Db {
  const db = load();
  mutator(db);
  save(db);
  return db;
}

export function pushEvent(
  db: Db,
  subjectType: SubjectType,
  subjectId: string,
  from: string | null,
  to: string,
  author: string | null,
  note: string | null,
) {
  db.events.unshift({
    id: newId("evt"),
    subject_type: subjectType,
    subject_id: subjectId,
    from_status: from,
    to_status: to,
    author_user_id: author,
    note,
    created_at: new Date().toISOString(),
  });
}
