import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/data/public";
import { CONTACT_TOPICS, contactSchema, fieldErrors } from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    topic: "その他" as (typeof CONTACT_TOPICS)[number],
    message: "",
    privacyAgreed: false,
    companyUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends string>(key: K, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      toast.error("入力内容を確認してください。");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await submitContact({ data: parsed.data });
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
      <SuccessPanel title="送信しました" body="内容を確認し、必要な場合のみご連絡します。" />
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <Honeypot value={form.companyUrl} onChange={(v) => set("companyUrl", v)} />
      <Field label="氏名" htmlFor="fullName" required error={errors["fullName"]}>
        <Input id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
      </Field>
      <Field label="メールアドレス" htmlFor="email" required error={errors["email"]}>
        <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </Field>
      <Field label="電話番号" htmlFor="phone" error={errors["phone"]}>
        <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>
      <Field label="種別" htmlFor="topic" required error={errors["topic"]}>
        <NativeSelect id="topic" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
          {CONTACT_TOPICS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="内容" htmlFor="message" required error={errors["message"]}>
        <Textarea id="message" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      <CheckRow>
        <Checkbox checked={form.privacyAgreed} onChange={(e) => set("privacyAgreed", e.target.checked)} />
        <span>
          <Link to="/privacy" className="underline underline-offset-4">
            プライバシーポリシー
          </Link>
          に同意します
        </span>
      </CheckRow>
      {errors["privacyAgreed"] ? <p className="text-sm text-oxblood">{errors["privacyAgreed"]}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "送信中…" : "送信する"}
      </Button>
    </form>
  );
}
