import assert from "node:assert/strict";
import { test } from "node:test";
import { collectionInquirySchema, memberPreregSchema, ownerInquirySchema } from "./schemas.ts";

const ownerBase = {
  ownsVehicle: "はい",
  region: "京都市",
  make: "Porsche",
  model: "911",
  year: 2019,
  mileageBand: "15,000〜30,000km",
  annualUseCount: "年に数回",
  storageType: "屋内ガレージ",
  participationPurpose: "両方",
  wantToUseOthers: "はい",
  wantToRegisterCar: "はい",
  priorityUsePeriod: "週末以外",
  dailyKmPreference: "1日200kmを基準でよい",
  minDriverAge: "KSC基準（25歳）でよい",
  requiredLicenseYears: "KSC基準（5年以上）でよい",
  rainUse: "未定",
  snowUse: "未定",
  handoverAccessOk: "確認が必要",
  outdoorNightParking: "未定",
  concerns: "保険と受け渡しの流れを知りたいです。",
  fullName: "山田 太郎",
  email: "taro@example.com",
  phone: "075-000-0000",
};

test("owner inquiry rejects missing privacy agreement", () => {
  const result = ownerInquirySchema.safeParse({ ...ownerBase, privacyAgreed: false });
  assert.equal(result.success, false);
});

test("owner inquiry accepts current network consultation fields", () => {
  const result = ownerInquirySchema.safeParse({ ...ownerBase, privacyAgreed: true });
  assert.equal(result.success, true);
});

test("collection inquiry accepts planned budget band and Kyoto-outside residence", () => {
  const result = collectionInquirySchema.safeParse({
    fullName: "佐藤 花子",
    email: "hanako@example.com",
    phone: "090-0000-0000",
    applicantType: "個人",
    region: "京都府外",
    kyotoConnection: "京都で定期的に車両を利用できる",
    currentVehicleStatus: "所有していない",
    desiredMake: "未定",
    desiredModel: "未定",
    desiredModels: "未定",
    vehicleCondition: "どちらでも",
    budgetBand: "車両によって判断したい",
    desiredDaysPerYear: "車両プロジェクトの条件に合わせたい",
    desiredKmPerYear: "車両プロジェクトの条件に合わせたい",
    desiredStartTiming: "まだ決めていない",
    wantValueCheck: "はい",
    resalePriorities: ["できるだけ長く乗る"],
    priorities: ["保管の質", "利用日の確保"],
    preferLine: true,
    privacyAgreed: true,
  });
  assert.equal(result.success, true);
});

test("collection inquiry accepts new per-project budget and use bands", () => {
  const result = collectionInquirySchema.safeParse({
    fullName: "佐藤 花子",
    email: "hanako@example.com",
    phone: "090-0000-0000",
    applicantType: "個人",
    region: "京都市",
    kyotoConnection: "京都で定期的に車両を利用できる",
    currentVehicleStatus: "所有していない",
    desiredMake: "未定",
    desiredModel: "未定",
    desiredModels: "未定",
    vehicleCondition: "新車",
    budgetBand: "800万〜1,200万円",
    desiredDaysPerYear: "年間24日程度",
    desiredKmPerYear: "年間800km程度",
    desiredStartTiming: "まだ決めていない",
    wantValueCheck: "はい",
    resalePriorities: ["できるだけ長く乗る"],
    priorities: ["少人数であること"],
    privacyAgreed: true,
  });
  assert.equal(result.success, true);
});

test("collection inquiry rejects former fixed 5-million budget band", () => {
  const result = collectionInquirySchema.safeParse({
    fullName: "佐藤 花子",
    email: "hanako@example.com",
    phone: "090-0000-0000",
    applicantType: "個人",
    region: "京都市",
    kyotoConnection: "京都で定期的に車両を利用できる",
    currentVehicleStatus: "所有していない",
    desiredMake: "未定",
    desiredModel: "未定",
    desiredModels: "未定",
    vehicleCondition: "どちらでも",
    budgetBand: "約500万円の上限目安で検討したい",
    desiredDaysPerYear: "計画の年間24日でよい",
    desiredKmPerYear: "計画の年間800kmでよい",
    desiredStartTiming: "まだ決めていない",
    wantValueCheck: "はい",
    resalePriorities: ["できるだけ長く乗る"],
    priorities: ["保管の質"],
    privacyAgreed: true,
  });
  assert.equal(result.success, false);
});

test("collection inquiry rejects missing vehicle condition", () => {
  const result = collectionInquirySchema.safeParse({
    fullName: "佐藤 花子",
    email: "hanako@example.com",
    phone: "090-0000-0000",
    applicantType: "個人",
    region: "京都市",
    kyotoConnection: "京都で定期的に車両を利用できる",
    currentVehicleStatus: "所有していない",
    desiredMake: "未定",
    desiredModel: "未定",
    desiredModels: "未定 未定",
    budgetBand: "未定・相談したい",
    desiredDaysPerYear: "まだ決めていない",
    desiredKmPerYear: "まだ決めていない",
    desiredStartTiming: "まだ決めていない",
    wantValueCheck: "はい",
    resalePriorities: ["まだ決めていない"],
    priorities: ["まだ決めていない"],
    privacyAgreed: true,
  });
  assert.equal(result.success, false);
});

test("member prereg without driving interest does not require age 30", () => {
  const result = memberPreregSchema.safeParse({
    participationInterests: ["車について知る・学ぶ"],
    fullName: "佐藤 花子",
    email: "hanako@example.com",
    phone: "090-0000-0000",
    region: "京都市",
    privacyAgreed: true,
  });
  assert.equal(result.success, true);
});

const collectionBase = {
  fullName: "佐藤 花子",
  email: "hanako@example.com",
  phone: "090-0000-0000",
  applicantType: "個人",
  region: "京都市",
  kyotoConnection: "京都で定期的に車両を利用できる",
  currentVehicleStatus: "所有していない",
  desiredModels: "未定",
  vehicleCondition: "どちらでも",
  budgetBand: "未定・相談したい",
  desiredDaysPerYear: "まだ決めていない",
  desiredKmPerYear: "まだ決めていない",
  desiredStartTiming: "まだ決めていない",
  wantValueCheck: "はい",
  resalePriorities: ["まだ決めていない"],
  priorities: ["まだ決めていない"],
  privacyAgreed: true,
};

test("oversized attribution is truncated, never rejected", () => {
  const result = collectionInquirySchema.safeParse({
    ...collectionBase,
    landingPath: `/apply/collection?${"utm_content=x".repeat(200)}`,
    referrer: `https://example.com/${"a".repeat(900)}`,
    utmCampaign: "c".repeat(400),
  });
  assert.equal(result.success, true);
  assert.equal(result.data?.landingPath?.length, 500);
  assert.equal(result.data?.referrer?.length, 500);
  assert.equal(result.data?.utmCampaign?.length, 200);
});

test("full-width phone digits and separators are accepted", () => {
  const result = collectionInquirySchema.safeParse({
    ...collectionBase,
    phone: "０９０－１２３４－５６７８",
  });
  assert.equal(result.success, true);
  assert.equal(result.data?.phone, "090-1234-5678");
});

test("full-width email characters are normalized", () => {
  const result = collectionInquirySchema.safeParse({
    ...collectionBase,
    email: "ｈａｎａｋｏ＠example.com",
  });
  assert.equal(result.success, true);
  assert.equal(result.data?.email, "hanako@example.com");
});

test("a phone number typed with the prolonged sound mark is accepted", () => {
  const result = collectionInquirySchema.safeParse({ ...collectionBase, phone: "090ー1234ー5678" });
  assert.equal(result.success, true);
  assert.equal(result.data?.phone, "090-1234-5678");
});

test("desired make and model may be left blank, as the hint promises", () => {
  const result = collectionInquirySchema.safeParse({
    ...collectionBase,
    desiredMake: "",
    desiredModel: "",
  });
  assert.equal(result.success, true);
});

test("owner inquiry accepts blank optional free text", () => {
  const result = ownerInquirySchema.safeParse({
    ...ownerBase,
    priorityUsePeriod: "",
    concerns: "",
    privacyAgreed: true,
  });
  assert.equal(result.success, true);
});

test("a malformed phone number is still rejected", () => {
  const result = collectionInquirySchema.safeParse({
    ...collectionBase,
    phone: "電話はありません",
  });
  assert.equal(result.success, false);
});
