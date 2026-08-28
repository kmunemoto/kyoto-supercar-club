import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitCollectionInquiry } from "@/lib/data/public";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import {
  APPLICANT_TYPES,
  COLLECTION_BUDGETS,
  COLLECTION_PRIORITIES,
  CURRENT_VEHICLE_STATUS,
  DESIRED_DAYS,
  DESIRED_KM,
  INCIDENT_OPTIONS,
  KYOTO_CONNECTIONS,
  REGIONS,
  START_TIMING,
  collectionInquirySchema,
  fieldErrors,
  focusFirstError,
  type CollectionInquiryInput,
} from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function CollectionForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    applicantType: "個人" as CollectionInquiryInput["applicantType"],
    region: "京都市" as CollectionInquiryInput["region"],
    kyotoConnection: "京都市在住" as CollectionInquiryInput["kyotoConnection"],
    currentVehicleStatus: "所有していない" as CollectionInquiryInput["currentVehicleStatus"],
    desiredModels: "",
    budgetBand: "未定・相談したい" as CollectionInquiryInput["budgetBand"],
    desiredDaysPerYear: "まだ決めていない" as CollectionInquiryInput["desiredDaysPerYear"],
    desiredKmPerYear: "まだ決めていない" as CollectionInquiryInput["desiredKmPerYear"],
    desiredStartTiming: "まだ決めていない" as CollectionInquiryInput["desiredStartTiming"],
    licenseYears: "" as string | number,
    incidentHistory: "" as string,
    priorities: [] as string[],
    concerns: "",
    fullName: "",
    email: "",
    phone: "",
    privacyAgreed: false,
    companyUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends string>(key: K, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggle(opt: string) {
    setForm((f) => ({
      ...f,
      priorities: f.priorities.includes(opt)
        ? f.priorities.filter((x) => x !== opt)
        : [...f.priorities, opt],
    }));
  }

  function payload() {
    const attr = readAttribution();
    return {
      ...form,
      licenseYears: form.licenseYears === "" ? undefined : form.licenseYears,
      incidentHistory: form.incidentHistory || undefined,
      ...attr,
    };
  }

  function onNext() {
    const parsed = collectionInquirySchema
      .pick({
        applicantType: true,
        region: true,
        kyotoConnection: true,
        currentVehicleStatus: true,
        desiredModels: true,
        budgetBand: true,
        desiredDaysPerYear: true,
        desiredKmPerYear: true,
        desiredStartTiming: true,
        licenseYears: true,
        incidentHistory: true,
        priorities: true,
        concerns: true,
      })
      .safeParse(payload());
    if (!parsed.success) {
      const nextErrors = fieldErrors(parsed.error);
      setErrors(nextErrors);
      toast.error("入力内容を確認してください。");
      focusFirstError(nextErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = collectionInquirySchema.safeParse(payload());
    if (!parsed.success) {
      const nextErrors = fieldErrors(parsed.error);
      setErrors(nextErrors);
      toast.error("入力内容を確認してください。");
      focusFirstError(nextErrors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitCollectionInquiry({ data: parsed.data });
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast.error(res.error);
        focusFirstError(res.fields ?? {});
        return;
      }
      track("collection_prereg_submit");
      setDone(true);
    } catch {
      toast.error("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <SuccessPanel
        title="事前登録を受け付けました"
        body="契約、購入申込、出資、予約ではありません。共同所有に関心があることの確認です。車両代や申込金は受け取っていません。"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <p className="text-sm text-ink-soft">
        これは共同所有に関心がある人の意向確認です。契約・購入・出資・予約ではありません。免許証、本人確認書類、資産証明、車両代、申込金は受け取りません。
      </p>
      <div className="flex gap-2 text-xs tracking-[0.16em] text-muted">
        <span className={step === 1 ? "text-oxblood" : ""}>01 希望条件</span>
        <span>/</span>
        <span className={step === 2 ? "text-oxblood" : ""}>02 ご連絡先</span>
      </div>
      {step === 1 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="個人／法人"
              htmlFor="applicantType"
              required
              error={errors["applicantType"]}
            >
              <NativeSelect
                id="applicantType"
                value={form.applicantType}
                onChange={(e) => set("applicantType", e.target.value)}
              >
                {APPLICANT_TYPES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="居住地域" htmlFor="region" required error={errors["region"]}>
              <NativeSelect
                id="region"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
              >
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="京都との関係 / 京都での利用"
              htmlFor="kyotoConnection"
              required
              error={errors["kyotoConnection"]}
            >
              <NativeSelect
                id="kyotoConnection"
                value={form.kyotoConnection}
                onChange={(e) => set("kyotoConnection", e.target.value)}
              >
                {KYOTO_CONNECTIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="現在の車両所有状況"
              htmlFor="currentVehicleStatus"
              required
              error={errors["currentVehicleStatus"]}
            >
              <NativeSelect
                id="currentVehicleStatus"
                value={form.currentVehicleStatus}
                onChange={(e) => set("currentVehicleStatus", e.target.value)}
              >
                {CURRENT_VEHICLE_STATUS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Field
            label="希望する車種・メーカー"
            htmlFor="desiredModels"
            required
            hint="未定でも構いません。"
            error={errors["desiredModels"]}
          >
            <Input
              id="desiredModels"
              value={form.desiredModels}
              onChange={(e) => set("desiredModels", e.target.value)}
            />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="共同購入に充てられる予算感"
              htmlFor="budgetBand"
              required
              hint="現在の計画は1人あたり約500万円です。いまは興味登録のみで、決済しません。"
              error={errors["budgetBand"]}
            >
              <NativeSelect
                id="budgetBand"
                value={form.budgetBand}
                onChange={(e) => set("budgetBand", e.target.value)}
              >
                {COLLECTION_BUDGETS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="希望する年間利用日数"
              htmlFor="desiredDaysPerYear"
              required
              hint="現在の計画は1人あたり年間24日です。"
              error={errors["desiredDaysPerYear"]}
            >
              <NativeSelect
                id="desiredDaysPerYear"
                value={form.desiredDaysPerYear}
                onChange={(e) => set("desiredDaysPerYear", e.target.value)}
              >
                {DESIRED_DAYS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="希望する年間走行距離"
              htmlFor="desiredKmPerYear"
              required
              hint="現在の計画は1人あたり年間800kmです。"
              error={errors["desiredKmPerYear"]}
            >
              <NativeSelect
                id="desiredKmPerYear"
                value={form.desiredKmPerYear}
                onChange={(e) => set("desiredKmPerYear", e.target.value)}
              >
                {DESIRED_KM.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="希望する開始時期"
              htmlFor="desiredStartTiming"
              required
              error={errors["desiredStartTiming"]}
            >
              <NativeSelect
                id="desiredStartTiming"
                value={form.desiredStartTiming}
                onChange={(e) => set("desiredStartTiming", e.target.value)}
              >
                {START_TIMING.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="免許取得年数"
              htmlFor="licenseYears"
              required
              error={errors["licenseYears"]}
            >
              <Input
                id="licenseYears"
                type="number"
                value={form.licenseYears}
                onChange={(e) => set("licenseYears", e.target.value)}
              />
            </Field>
            <Field
              label="事故・重大違反歴の自己申告"
              htmlFor="incidentHistory"
              required
              hint="証明書の提出は不要です。"
              error={errors["incidentHistory"]}
            >
              <NativeSelect
                id="incidentHistory"
                value={form.incidentHistory}
                onChange={(e) => set("incidentHistory", e.target.value)}
              >
                <option value="">選択してください</option>
                {INCIDENT_OPTIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <fieldset>
            <legend className="mb-3 text-sm font-medium">
              重視する条件 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
            </legend>
            <div className="grid gap-3">
              {COLLECTION_PRIORITIES.map((opt) => (
                <CheckRow key={opt}>
                  <Checkbox checked={form.priorities.includes(opt)} onChange={() => toggle(opt)} />
                  <span>{opt}</span>
                </CheckRow>
              ))}
            </div>
            {errors["priorities"] ? (
              <p className="mt-2 text-sm text-oxblood">{errors["priorities"]}</p>
            ) : null}
          </fieldset>
          <Field label="質問・懸念事項" htmlFor="concerns" error={errors["concerns"]}>
            <Textarea
              id="concerns"
              value={form.concerns}
              onChange={(e) => set("concerns", e.target.value)}
            />
          </Field>
          <Button type="button" onClick={onNext} className="w-full sm:w-auto">
            ご連絡先の入力へ
          </Button>
        </>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="氏名" htmlFor="fullName" required error={errors["fullName"]}>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="メールアドレス" htmlFor="email" required error={errors["email"]}>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="電話番号" htmlFor="phone" required error={errors["phone"]}>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>
          <CheckRow>
            <Checkbox
              checked={form.privacyAgreed}
              onChange={(e) => set("privacyAgreed", e.target.checked)}
            />
            <span>
              <Link to="/privacy" className="underline underline-offset-4">
                プライバシーポリシー
              </Link>
              に同意します
            </span>
          </CheckRow>
          {errors["privacyAgreed"] ? (
            <p className="text-sm text-oxblood">{errors["privacyAgreed"]}</p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={pending}>
              戻る
            </Button>
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "送信中…" : "事前登録を送る"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
