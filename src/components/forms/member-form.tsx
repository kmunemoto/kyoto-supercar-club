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
  PARTICIPATION_OPTIONS,
  REGIONS,
  USE_FREQUENCY,
  USE_PURPOSES,
  fieldErrors,
  focusFirstError,
  memberPreregSchema,
  wantsDrivingMembership,
  type MemberPreregInput,
} from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function MemberForm() {
  const [form, setForm] = useState({
    participationInterests: [] as string[],
    fullName: "",
    email: "",
    phone: "",
    age: "" as string | number,
    region: "京都市" as MemberPreregInput["region"],
    licenseYears: "" as string | number,
    useFrequency: "" as string,
    interestModels: [] as string[],
    budgetBand: "" as string,
    usePurpose: "" as string,
    incidentHistory: "" as string,
    requests: "",
    privacyAgreed: false,
    companyUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const driving = wantsDrivingMembership(form.participationInterests);

  function set<K extends string>(key: K, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggle(listKey: "participationInterests" | "interestModels", opt: string) {
    setForm((f) => ({
      ...f,
      [listKey]: f[listKey].includes(opt)
        ? f[listKey].filter((x) => x !== opt)
        : [...f[listKey], opt],
    }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const attr = readAttribution();
    const parsed = memberPreregSchema.safeParse({
      ...form,
      age: form.age === "" ? undefined : form.age,
      licenseYears: form.licenseYears === "" ? undefined : form.licenseYears,
      useFrequency: form.useFrequency || undefined,
      budgetBand: form.budgetBand || undefined,
      usePurpose: form.usePurpose || undefined,
      incidentHistory: form.incidentHistory || undefined,
      ...attr,
    });
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
        body="予約や入会の確定ではありません。クラブへの参加希望であり、運転資格の確定でもありません。準備の進捗に応じて、必要な場合のみご連絡します。"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <p className="text-sm text-ink-soft">
        クラブへの参加と、スーパーカーの運転資格は別です。若い世代も参加できますが、すぐに運転できるわけではありません。
      </p>
      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          興味のある参加方法 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
        </legend>
        <div className="grid gap-3">
          {PARTICIPATION_OPTIONS.map((opt) => (
            <CheckRow key={opt}>
              <Checkbox
                checked={form.participationInterests.includes(opt)}
                onChange={() => toggle("participationInterests", opt)}
              />
              <span>{opt}</span>
            </CheckRow>
          ))}
        </div>
        {errors["participationInterests"] ? (
          <p className="mt-2 text-sm text-oxblood">{errors["participationInterests"]}</p>
        ) : null}
      </fieldset>
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
        <Field label="年齢" htmlFor="age" hint="任意" error={errors["age"]}>
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
      </div>
      {driving ? (
        <div className="space-y-8 rounded-xl border border-line bg-cream p-5">
          <p className="text-sm text-ink-soft">
            ドライビング会員の想定条件は、30歳以上・免許取得5年以上です。いま満たしていなくても、将来の希望として登録できます。
          </p>
          <Field
            label="運転免許取得年数"
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
              <option value="">選択してください</option>
              {USE_FREQUENCY.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="事故・重大違反歴の自己申告"
            htmlFor="incidentHistory"
            required
            hint="この段階では証明書の提出は不要です。"
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
          <fieldset>
            <legend className="mb-3 text-sm font-medium">興味のある車種</legend>
            <div className="grid gap-3">
              {INTEREST_MODELS.map((opt) => (
                <CheckRow key={opt}>
                  <Checkbox
                    checked={form.interestModels.includes(opt)}
                    onChange={() => toggle("interestModels", opt)}
                  />
                  <span>{opt}</span>
                </CheckRow>
              ))}
            </div>
          </fieldset>
          <Field
            label="希望する料金帯"
            htmlFor="budgetBand"
            hint="料金は未確定です。"
            error={errors["budgetBand"]}
          >
            <NativeSelect
              id="budgetBand"
              value={form.budgetBand}
              onChange={(e) => set("budgetBand", e.target.value)}
            >
              <option value="">未入力</option>
              {BUDGET_BANDS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="利用目的" htmlFor="usePurpose" error={errors["usePurpose"]}>
            <NativeSelect
              id="usePurpose"
              value={form.usePurpose}
              onChange={(e) => set("usePurpose", e.target.value)}
            >
              <option value="">未入力</option>
              {USE_PURPOSES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      ) : null}
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
