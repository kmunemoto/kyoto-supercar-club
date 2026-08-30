import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitOwnerInquiry } from "@/lib/data/public";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import {
  ANNUAL_USE,
  MILEAGE_BANDS,
  OWNER_PURPOSES,
  OWNS_VEHICLE,
  REGIONS,
  STORAGE_TYPES,
  fieldErrors,
  focusFirstError,
  maxVehicleYear,
  ownerInquirySchema,
} from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function OwnerForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    ownsVehicle: "はい" as (typeof OWNS_VEHICLE)[number],
    region: "京都市" as (typeof REGIONS)[number],
    make: "",
    model: "",
    year: "" as string | number,
    mileageBand: "" as string,
    annualUseCount: "年に数回" as (typeof ANNUAL_USE)[number],
    storageType: "屋内ガレージ" as (typeof STORAGE_TYPES)[number],
    participationPurpose: "まず説明を聞きたい" as (typeof OWNER_PURPOSES)[number],
    concerns: "",
    fullName: "",
    email: "",
    phone: "",
    preferLine: false,
    privacyAgreed: false,
    companyUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      setStarted(true);
      track("owner_form_start");
    }
  }, [started]);

  function set<K extends string>(key: K, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function payload() {
    const attr = readAttribution();
    return {
      ...form,
      year: form.year === "" ? undefined : form.year,
      mileageBand: form.mileageBand || undefined,
      privacyAgreed: form.privacyAgreed ? true : false,
      ...attr,
    };
  }

  const step1Keys = {
    ownsVehicle: true,
    region: true,
    make: true,
    model: true,
    year: true,
    mileageBand: true,
    annualUseCount: true,
    storageType: true,
    participationPurpose: true,
    concerns: true,
  } as const;

  /** Server-side errors can name a step 1 field while step 2 is on screen. */
  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    if (Object.keys(nextErrors).some((key) => key in step1Keys)) setStep(1);
    focusFirstError(nextErrors);
  }

  function onNext() {
    const parsed = ownerInquirySchema.pick(step1Keys).safeParse(payload());
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      toast.error("入力内容を確認してください。");
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = ownerInquirySchema.safeParse(payload());
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      toast.error("入力内容を確認してください。");
      track("owner_form_error");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitOwnerInquiry({ data: parsed.data });
      if (!res.ok) {
        showErrors(res.fields ?? {});
        toast.error(res.error);
        track("owner_form_error");
        return;
      }
      track("owner_form_submit");
      setDoneId(res.id);
    } catch {
      toast.error("送信に失敗しました。時間をおいて再度お試しください。");
      track("owner_form_error");
    } finally {
      setPending(false);
    }
  }

  if (doneId) {
    return (
      <SuccessPanel
        title="REGISTRYへの登録を受け付けました"
        body="登録は無料です。契約や決済は発生していません。受付内容の控えをメールでお送りします。"
        referenceId={doneId}
        nextSteps={[
          "登録内容を確認します。",
          "車両について、担当より個別にご連絡することがあります。",
          "売却のご相談、MORNING RUN、愛車撮影など、ご案内できるようになった時点でお声がけします。",
        ]}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <p className="text-sm text-ink-soft">
        既存スーパーカーオーナー向けの無料登録です。費用は一切かかりません。初回は正確な保管住所、ナンバー、車検証、免許証画像は不要です。
      </p>
      <div className="flex gap-2 text-xs tracking-[0.16em] text-muted">
        <span className={step === 1 ? "text-oxblood" : ""}>01 車両と希望</span>
        <span>/</span>
        <span className={step === 2 ? "text-oxblood" : ""}>02 ご連絡先</span>
      </div>

      {step === 1 ? (
        <>
          <Field
            label="現在、対象車両を所有していますか"
            htmlFor="ownsVehicle"
            required
            error={errors["ownsVehicle"]}
          >
            <NativeSelect
              id="ownsVehicle"
              value={form.ownsVehicle}
              onChange={(e) => set("ownsVehicle", e.target.value)}
            >
              {OWNS_VEHICLE.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="京都府内の車両保管地域"
            htmlFor="region"
            required
            hint="オーナーの住所は京都府外でも構いません。車両は引き続きご自身で保管いただきます。"
            error={errors["region"]}
          >
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
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="メーカー" htmlFor="make" required error={errors["make"]}>
              <Input id="make" value={form.make} onChange={(e) => set("make", e.target.value)} />
            </Field>
            <Field label="車種" htmlFor="model" required error={errors["model"]}>
              <Input id="model" value={form.model} onChange={(e) => set("model", e.target.value)} />
            </Field>
            <Field
              label="年式"
              htmlFor="year"
              hint="任意。わかる範囲で構いません。"
              error={errors["year"]}
            >
              <Input
                id="year"
                type="number"
                min={1980}
                max={maxVehicleYear()}
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </Field>
            <Field
              label="現在の走行距離帯"
              htmlFor="mileageBand"
              hint="任意。概算で構いません。"
              error={errors["mileageBand"]}
            >
              <NativeSelect
                id="mileageBand"
                value={form.mileageBand}
                onChange={(e) => set("mileageBand", e.target.value)}
              >
                <option value="">未入力</option>
                {MILEAGE_BANDS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Field
            label="普段の保管形態"
            htmlFor="storageType"
            required
            hint="保管形態を選ぶだけで構いません。正確な住所、駐車場の鍵、暗証番号は不要です。"
            error={errors["storageType"]}
          >
            <NativeSelect
              id="storageType"
              value={form.storageType}
              onChange={(e) => set("storageType", e.target.value)}
            >
              {STORAGE_TYPES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="参加目的"
            htmlFor="participationPurpose"
            required
            error={errors["participationPurpose"]}
          >
            <NativeSelect
              id="participationPurpose"
              value={form.participationPurpose}
              onChange={(e) => set("participationPurpose", e.target.value)}
            >
              {OWNER_PURPOSES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="現在の利用頻度"
            htmlFor="annualUseCount"
            required
            error={errors["annualUseCount"]}
          >
            <NativeSelect
              id="annualUseCount"
              value={form.annualUseCount}
              onChange={(e) => set("annualUseCount", e.target.value)}
            >
              {ANNUAL_USE.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="質問・懸念事項"
            htmlFor="concerns"
            hint="任意。相談時に伺うこともできます。"
            error={errors["concerns"]}
          >
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
              checked={form.preferLine}
              onChange={(e) => set("preferLine", e.target.checked)}
            />
            <span>LINEでの連絡を希望する</span>
          </CheckRow>
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
              {pending ? "送信中…" : "相談を送る"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
