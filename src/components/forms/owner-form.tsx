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
  OWNER_MANAGEMENT,
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
    priorityUsePeriod: "",
    annualKmCap: "",
    otherDriverConditions: "",
    managementNeeds: [] as string[],
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

  function toggleNeed(opt: string) {
    setForm((f) => ({
      ...f,
      managementNeeds: f.managementNeeds.includes(opt)
        ? f.managementNeeds.filter((x) => x !== opt)
        : [...f.managementNeeds, opt],
    }));
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

  function onNext() {
    const parsed = ownerInquirySchema
      .pick({
        ownsVehicle: true,
        region: true,
        make: true,
        model: true,
        year: true,
        mileageBand: true,
        annualUseCount: true,
        storageType: true,
        participationPurpose: true,
        priorityUsePeriod: true,
        annualKmCap: true,
        otherDriverConditions: true,
        managementNeeds: true,
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
    const parsed = ownerInquirySchema.safeParse(payload());
    if (!parsed.success) {
      const nextErrors = fieldErrors(parsed.error);
      setErrors(nextErrors);
      toast.error("入力内容を確認してください。");
      track("owner_form_error");
      focusFirstError(nextErrors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitOwnerInquiry({ data: parsed.data });
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast.error(res.error);
        track("owner_form_error");
        focusFirstError(res.fields ?? {});
        return;
      }
      track("owner_form_submit");
      setDone(true);
    } catch {
      toast.error("送信に失敗しました。時間をおいて再度お試しください。");
      track("owner_form_error");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <SuccessPanel
        title="お問い合わせありがとうございます"
        body="車両登録や相互利用の確定ではありません。内容を確認後、必要に応じてご連絡します。"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <p className="text-sm text-ink-soft">
        オーナー同士の相互利用と車両管理の先行相談です。一般の方への貸し出しではありません。初回では正確な保管住所・ナンバー・車検証は不要です。
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
            label="京都府内の居住・保管地域"
            htmlFor="region"
            required
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
              hint="任意・概算"
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
            label="現在の保管場所"
            htmlFor="storageType"
            required
            hint="形態で構いません。正確な住所は不要です。"
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
            label="年間の利用回数"
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
            label="自分の利用を優先したい時期"
            htmlFor="priorityUsePeriod"
            required
            hint="例：週末、GW、未定"
            error={errors["priorityUsePeriod"]}
          >
            <Input
              id="priorityUsePeriod"
              value={form.priorityUsePeriod}
              onChange={(e) => set("priorityUsePeriod", e.target.value)}
            />
          </Field>
          <Field
            label="設定したい年間走行距離上限"
            htmlFor="annualKmCap"
            required
            hint="希望の目安で構いません。未確定でも「未定」と書いてください。"
            error={errors["annualKmCap"]}
          >
            <Input
              id="annualKmCap"
              value={form.annualKmCap}
              onChange={(e) => set("annualKmCap", e.target.value)}
            />
          </Field>
          <Field
            label="他の運転者に求める条件"
            htmlFor="otherDriverConditions"
            required
            hint="年齢、免許歴、面談の希望など。まだ決まっていなくても構いません。"
            error={errors["otherDriverConditions"]}
          >
            <Textarea
              id="otherDriverConditions"
              value={form.otherDriverConditions}
              onChange={(e) => set("otherDriverConditions", e.target.value)}
            />
          </Field>
          <fieldset>
            <legend className="mb-3 text-sm font-medium">
              希望する管理内容 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
            </legend>
            <div className="grid gap-3">
              {OWNER_MANAGEMENT.map((opt) => (
                <CheckRow key={opt}>
                  <Checkbox
                    checked={form.managementNeeds.includes(opt)}
                    onChange={() => toggleNeed(opt)}
                  />
                  <span>{opt}</span>
                </CheckRow>
              ))}
            </div>
            {errors["managementNeeds"] ? (
              <p className="mt-2 text-sm text-oxblood">{errors["managementNeeds"]}</p>
            ) : null}
          </fieldset>
          <Field label="質問・懸念事項" htmlFor="concerns" required error={errors["concerns"]}>
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
              {pending ? "送信中…" : "相談を送る"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
