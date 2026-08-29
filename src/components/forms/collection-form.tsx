import { useRef, useState, type FormEvent } from "react";
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
  KYOTO_CONNECTIONS,
  RESALE_PRIORITIES,
  RESIDENCE_REGIONS,
  START_TIMING,
  VEHICLE_CONDITIONS,
  YES_NO,
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
    kyotoConnection: "京都で定期的に車両を利用できる" as CollectionInquiryInput["kyotoConnection"],
    currentVehicleStatus: "所有していない" as CollectionInquiryInput["currentVehicleStatus"],
    desiredMake: "",
    desiredModel: "",
    vehicleCondition: "どちらでも" as CollectionInquiryInput["vehicleCondition"],
    budgetBand: "未定・相談したい" as CollectionInquiryInput["budgetBand"],
    desiredDaysPerYear: "まだ決めていない" as CollectionInquiryInput["desiredDaysPerYear"],
    desiredKmPerYear: "まだ決めていない" as CollectionInquiryInput["desiredKmPerYear"],
    desiredStartTiming: "まだ決めていない" as CollectionInquiryInput["desiredStartTiming"],
    wantValueCheck: "はい" as CollectionInquiryInput["wantValueCheck"],
    resalePriorities: [] as string[],
    priorities: [] as string[],
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

  const started = useRef(false);
  function set<K extends string>(key: K, value: unknown) {
    if (!started.current) {
      started.current = true;
      track("collection_form_start");
    }
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggle(list: "priorities" | "resalePriorities", opt: string) {
    setForm((f) => ({
      ...f,
      [list]: f[list].includes(opt) ? f[list].filter((x) => x !== opt) : [...f[list], opt],
    }));
  }

  function payload() {
    const attr = readAttribution();
    const desiredModels =
      [form.desiredMake, form.desiredModel].filter(Boolean).join(" ").trim() || "未定";
    return {
      ...form,
      desiredModels,
      ...attr,
    };
  }

  const step1Keys = {
    applicantType: true,
    region: true,
    kyotoConnection: true,
    currentVehicleStatus: true,
    desiredMake: true,
    desiredModel: true,
    desiredModels: true,
    vehicleCondition: true,
    budgetBand: true,
    desiredDaysPerYear: true,
    desiredKmPerYear: true,
    desiredStartTiming: true,
    wantValueCheck: true,
    resalePriorities: true,
    priorities: true,
    concerns: true,
  } as const;

  /** Server-side errors can name a step 1 field while step 2 is on screen. */
  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    if (Object.keys(nextErrors).some((key) => key in step1Keys)) setStep(1);
    focusFirstError(nextErrors);
  }

  function onNext() {
    const parsed = collectionInquirySchema.pick(step1Keys).safeParse(payload());
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
    const parsed = collectionInquirySchema.safeParse(payload());
    if (!parsed.success) {
      showErrors(fieldErrors(parsed.error));
      toast.error("入力内容を確認してください。");
      track("collection_form_error");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitCollectionInquiry({ data: parsed.data });
      if (!res.ok) {
        showErrors(res.fields ?? {});
        toast.error(res.error);
        track("collection_form_error");
        return;
      }
      track("collection_prereg_submit");
      setDoneId(res.id);
    } catch {
      toast.error("送信に失敗しました。時間をおいて再度お試しください。");
      track("collection_form_error");
    } finally {
      setPending(false);
    }
  }

  if (doneId) {
    return (
      <SuccessPanel
        title="興味登録を受け付けました"
        body="契約や決済は発生していません。受付内容の控えをメールでお送りします。"
        referenceId={doneId}
        nextSteps={[
          "ご登録内容を確認します。",
          "希望条件に合う車両プロジェクトの検討状況を、担当より個別にご連絡します。",
          "正式募集の開始時に、税を含む総額と契約条件をあらためてご案内します。",
        ]}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <p className="text-sm text-ink-soft">無料の興味登録です。契約や決済は発生しません。</p>
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
            <Field
              label="居住地域"
              htmlFor="region"
              required
              hint="京都府外在住でも登録できます。受け渡し拠点は京都府内です。"
              error={errors["region"]}
            >
              <NativeSelect
                id="region"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
              >
                {RESIDENCE_REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="京都での利用・受け渡し"
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
          <div className="grid gap-6 md:grid-cols-2">
            <Field
              label="希望メーカー"
              htmlFor="desiredMake"
              hint="未定でも構いません。空欄のままでも送信できます。"
              error={errors["desiredMake"]}
            >
              <Input
                id="desiredMake"
                value={form.desiredMake}
                onChange={(e) => set("desiredMake", e.target.value)}
                placeholder="例：未定"
              />
            </Field>
            <Field
              label="希望車種"
              htmlFor="desiredModel"
              hint="未定でも構いません。空欄のままでも送信できます。"
              error={errors["desiredModel"]}
            >
              <Input
                id="desiredModel"
                value={form.desiredModel}
                onChange={(e) => set("desiredModel", e.target.value)}
                placeholder="例：未定"
              />
            </Field>
            <Field
              label="新車／中古"
              htmlFor="vehicleCondition"
              required
              error={errors["vehicleCondition"]}
            >
              <NativeSelect
                id="vehicleCondition"
                value={form.vehicleCondition}
                onChange={(e) => set("vehicleCondition", e.target.value)}
              >
                {VEHICLE_CONDITIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field
              label="共同購入に充てられる予算感"
              htmlFor="budgetBand"
              required
              hint="車両価格と共同オーナー数によって、1人あたりの購入負担は変わります。現在は無料の興味登録であり、決済は発生しません。"
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
              hint="実際の年間利用日数は、車両と共同オーナー数に応じて決定します。"
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
              hint="実際の年間走行距離は、車両の利用計画と共同オーナー数に応じて決定します。"
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
              label="KSC VALUE CHECKを希望しますか"
              htmlFor="wantValueCheck"
              required
              hint="単独所有との3年負担比較です。仮の車両価格はサイトに載せていません。"
              error={errors["wantValueCheck"]}
            >
              <NativeSelect
                id="wantValueCheck"
                value={form.wantValueCheck}
                onChange={(e) => set("wantValueCheck", e.target.value)}
              >
                {YES_NO.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <fieldset>
            <legend className="mb-3 text-sm font-medium">
              再販・保有の考え方 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
            </legend>
            <div className="grid gap-3">
              {RESALE_PRIORITIES.map((opt) => (
                <CheckRow key={opt}>
                  <Checkbox
                    checked={form.resalePriorities.includes(opt)}
                    onChange={() => toggle("resalePriorities", opt)}
                  />
                  <span>{opt}</span>
                </CheckRow>
              ))}
            </div>
            {errors["resalePriorities"] ? (
              <p className="mt-2 text-sm text-oxblood">{errors["resalePriorities"]}</p>
            ) : null}
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-sm font-medium">
              重視する条件 <span className="ml-2 text-xs font-normal text-oxblood">必須</span>
            </legend>
            <div className="grid gap-3">
              {COLLECTION_PRIORITIES.map((opt) => (
                <CheckRow key={opt}>
                  <Checkbox
                    checked={form.priorities.includes(opt)}
                    onChange={() => toggle("priorities", opt)}
                  />
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
              {pending ? "送信中…" : "興味登録を送る"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
