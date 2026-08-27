import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitMemberPrereg } from "@/lib/data/public";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import {
  BUDGET_BANDS,
  INCIDENT_OPTIONS,
  INTEREST_MODELS,
  REGIONS,
  USE_FREQUENCY,
  USE_PURPOSES,
  fieldErrors,
  focusFirstError,
  memberPreregSchema,
  type MemberPreregInput,
} from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function MemberForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: 35,
    region: "京都市" as MemberPreregInput["region"],
    licenseYears: 10,
    useFrequency: "まずは少数回試したい" as MemberPreregInput["useFrequency"],
    interestModels: [] as string[],
    budgetBand: "未定・相談したい" as MemberPreregInput["budgetBand"],
    usePurpose: "所有を検討する前の体験" as MemberPreregInput["usePurpose"],
    incidentHistory: "ない" as MemberPreregInput["incidentHistory"],
    requests: "",
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
      interestModels: f.interestModels.includes(opt)
        ? f.interestModels.filter((x) => x !== opt)
        : [...f.interestModels, opt],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const attr = readAttribution();
    const parsed = memberPreregSchema.safeParse({ ...form, ...attr });
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
      const res = await submitMemberPrereg({ data: parsed.data });
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast.error(res.error);
        focusFirstError(res.fields ?? {});
        return;
      }
      track("member_prereg_submit");
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
        body="予約や入会の確定ではありません。準備の進捗に応じて、必要な場合のみご連絡します。"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
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
        <Field
          label="年齢"
          htmlFor="age"
          required
          hint="現時点の想定は30歳以上です。"
          error={errors["age"]}
        >
          <Input
            id="age"
            type="number"
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
          />
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
          label="運転免許取得年数"
          htmlFor="licenseYears"
          required
          hint="現時点の想定は5年以上です。"
          error={errors["licenseYears"]}
        >
          <Input
            id="licenseYears"
            type="number"
            value={form.licenseYears}
            onChange={(e) => set("licenseYears", e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="希望する利用頻度"
        htmlFor="useFrequency"
        required
        error={errors["useFrequency"]}
      >
        <NativeSelect
          id="useFrequency"
          value={form.useFrequency}
          onChange={(e) => set("useFrequency", e.target.value)}
        >
          {USE_FREQUENCY.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          興味のある車種 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
        </legend>
        <p className="mb-3 text-sm text-muted">
          具体的なメーカー名の希望は、まだ確定ラインナップがないため伺いません。
        </p>
        <div className="grid gap-3">
          {INTEREST_MODELS.map((opt) => (
            <CheckRow key={opt}>
              <Checkbox checked={form.interestModels.includes(opt)} onChange={() => toggle(opt)} />
              <span>{opt}</span>
            </CheckRow>
          ))}
        </div>
        {errors["interestModels"] ? (
          <p className="mt-2 text-sm text-oxblood">{errors["interestModels"]}</p>
        ) : null}
      </fieldset>
      <Field
        label="希望する料金帯"
        htmlFor="budgetBand"
        required
        hint="料金は未確定です。ご希望の感じ方だけ伺います。"
        error={errors["budgetBand"]}
      >
        <NativeSelect
          id="budgetBand"
          value={form.budgetBand}
          onChange={(e) => set("budgetBand", e.target.value)}
        >
          {BUDGET_BANDS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="利用目的" htmlFor="usePurpose" required error={errors["usePurpose"]}>
        <NativeSelect
          id="usePurpose"
          value={form.usePurpose}
          onChange={(e) => set("usePurpose", e.target.value)}
        >
          {USE_PURPOSES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field
        label="事故・重大違反歴の自己申告"
        htmlFor="incidentHistory"
        required
        hint="この段階では証明書の提出は不要です。虚偽がある場合、後の審査に進めないことがあります。"
        error={errors["incidentHistory"]}
      >
        <NativeSelect
          id="incidentHistory"
          value={form.incidentHistory}
          onChange={(e) => set("incidentHistory", e.target.value)}
        >
          {INCIDENT_OPTIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="サービスへの要望" htmlFor="requests" error={errors["requests"]}>
        <Textarea
          id="requests"
          value={form.requests}
          onChange={(e) => set("requests", e.target.value)}
        />
      </Field>
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
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "送信中…" : "事前登録を送る"}
      </Button>
    </form>
  );
}
