import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitOwnerInquiry } from "@/lib/server/public";
import {
  ANNUAL_USE,
  MANAGEMENT_OPTIONS,
  REGIONS,
  REWARD_OPTIONS,
  ownerInquirySchema,
  fieldErrors,
  type OwnerInquiryInput,
} from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

const empty: OwnerInquiryInput = {
  fullName: "",
  email: "",
  phone: "",
  region: "京都市",
  make: "",
  model: "",
  year: 2020,
  mileageKm: 0,
  storageLocation: "",
  annualUseCount: "年に数回",
  lendablePeriod: "",
  managementNeeds: [],
  rewardPreference: "相談して決めたい",
  photoNotes: "",
  questions: "",
  privacyAgreed: true as unknown as true,
  companyUrl: "",
};

export function OwnerForm() {
  const [form, setForm] = useState({ ...empty, privacyAgreed: false as boolean, companyUrl: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, privacyAgreed: form.privacyAgreed ? true : false };
    const parsed = ownerInquirySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      toast.error("入力内容を確認してください。");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitOwnerInquiry({ data: parsed.data });
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast.error(res.error);
        return;
      }
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
        title="相談を受け付けました"
        body="内容を確認し、必要な場合のみご連絡します。この時点で車両のお預かりは始まりません。"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="氏名" htmlFor="fullName" required error={errors["fullName"]}>
          <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
        </Field>
        <Field label="メールアドレス" htmlFor="email" required error={errors["email"]}>
          <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </Field>
        <Field label="電話番号" htmlFor="phone" required error={errors["phone"]}>
          <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </Field>
        <Field label="居住地域" htmlFor="region" required error={errors["region"]}>
          <NativeSelect id="region" value={form.region} onChange={(e) => set("region", e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="メーカー" htmlFor="make" required hint="未確定でも構いません。わかる範囲でご記入ください。" error={errors["make"]}>
          <Input id="make" value={form.make} onChange={(e) => set("make", e.target.value)} />
        </Field>
        <Field label="車種" htmlFor="model" required error={errors["model"]}>
          <Input id="model" value={form.model} onChange={(e) => set("model", e.target.value)} />
        </Field>
        <Field label="年式" htmlFor="year" required error={errors["year"]}>
          <Input id="year" type="number" value={form.year} onChange={(e) => set("year", e.target.value)} />
        </Field>
        <Field label="走行距離（km）" htmlFor="mileageKm" required error={errors["mileageKm"]}>
          <Input id="mileageKm" type="number" value={form.mileageKm} onChange={(e) => set("mileageKm", e.target.value)} />
        </Field>
      </div>
      <Field label="車両の保管場所" htmlFor="storageLocation" required error={errors["storageLocation"]}>
        <Input id="storageLocation" value={form.storageLocation} onChange={(e) => set("storageLocation", e.target.value)} />
      </Field>
      <Field label="年間のおおよその利用回数" htmlFor="annualUseCount" required error={errors["annualUseCount"]}>
        <NativeSelect id="annualUseCount" value={form.annualUseCount} onChange={(e) => set("annualUseCount", e.target.value)}>
          {ANNUAL_USE.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="車両を貸し出せる期間" htmlFor="lendablePeriod" required hint="例: 平日中心、夏季以外、要相談" error={errors["lendablePeriod"]}>
        <Input id="lendablePeriod" value={form.lendablePeriod} onChange={(e) => set("lendablePeriod", e.target.value)} />
      </Field>
      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          希望する管理内容 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
        </legend>
        <div className="grid gap-3">
          {MANAGEMENT_OPTIONS.map((opt) => (
            <CheckRow key={opt}>
              <Checkbox checked={form.managementNeeds.includes(opt)} onChange={() => toggleNeed(opt)} />
              <span>{opt}</span>
            </CheckRow>
          ))}
        </div>
        {errors["managementNeeds"] ? <p className="mt-2 text-sm text-oxblood">{errors["managementNeeds"]}</p> : null}
      </fieldset>
      <Field label="希望する報酬方式" htmlFor="rewardPreference" required hint="金額は未確定です。方式の希望だけ伺います。" error={errors["rewardPreference"]}>
        <NativeSelect id="rewardPreference" value={form.rewardPreference} onChange={(e) => set("rewardPreference", e.target.value)}>
          {REWARD_OPTIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field
        label="車両写真について"
        htmlFor="photoNotes"
        hint="この段階では画像ファイルの送信は受け付けていません。写真の有無や共有方法をメモしてください。面談時にご用意ください。"
        error={errors["photoNotes"]}
      >
        <Textarea
          id="photoNotes"
          value={form.photoNotes ?? ""}
          onChange={(e) => set("photoNotes", e.target.value)}
          placeholder="例: 外装4枚を面談時に共有できます"
        />
      </Field>
      <Field label="質問・懸念事項" htmlFor="questions" error={errors["questions"]}>
        <Textarea id="questions" value={form.questions ?? ""} onChange={(e) => set("questions", e.target.value)} />
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
      {errors["privacyAgreed"] ? <p className="text-sm text-oxblood">{errors["privacyAgreed"]}</p> : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "送信中…" : "相談を送る"}
      </Button>
    </form>
  );
}
