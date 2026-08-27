import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/data/public";
import { readAttribution } from "@/lib/attribution";
import { CONTACT_TOPICS, contactSchema, fieldErrors, focusFirstError } from "@/lib/schemas";
import { Honeypot, SuccessPanel } from "./form-status";

export function ContactForm({ initialTopic }: { initialTopic?: string | undefined }) {
  const startTopic = (CONTACT_TOPICS as readonly string[]).includes(initialTopic ?? "")
    ? (initialTopic as (typeof CONTACT_TOPICS)[number])
    : "その他";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    topic: startTopic,
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
    const attr = readAttribution();
    const parsed = contactSchema.safeParse({ ...form, ...attr });
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
      const res = await submitContact({ data: parsed.data });
      if (!res.ok) {
        setErrors(res.fields ?? {});
        toast.error(res.error);
        focusFirstError(res.fields ?? {});
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
        title="お問い合わせを受け付けました"
        body="内容を確認し、必要な場合のみご連絡します。予約や購入の受付ではありません。"
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
        <Field label="電話番号" htmlFor="phone" hint="任意" error={errors["phone"]}>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>
        <Field label="種別" htmlFor="topic" required error={errors["topic"]}>
          <NativeSelect
            id="topic"
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
          >
            {CONTACT_TOPICS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </NativeSelect>
        </Field>
      </div>
      <Field label="内容" htmlFor="message" required error={errors["message"]}>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
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
        {pending ? "送信中…" : "送信する"}
      </Button>
    </form>
  );
}
