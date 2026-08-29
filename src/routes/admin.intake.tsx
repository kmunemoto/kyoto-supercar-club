import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Checkbox, CheckRow, Field } from "@/components/ui/field";
import { Input, NativeSelect, Textarea } from "@/components/ui/native";
import { Button } from "@/components/ui/button";
import { LEAD_CHANNELS, LEAD_CHANNEL_LABEL, createLead, type LeadChannel } from "@/lib/data/admin";
import { CONTACT_TOPICS } from "@/lib/schemas";

export const Route = createFileRoute("/admin/intake")({
  component: Page,
});

/**
 * Records a lead that arrived outside the public forms. Without it, anyone who
 * asks through LINE or over the phone exists only in a chat window: no status,
 * no reminder when they go unanswered, and nothing for a deletion request to
 * act on.
 */
function Page() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    channel: "line" as LeadChannel,
    fullName: "",
    email: "",
    phone: "",
    topic: CONTACT_TOPICS[0] as string,
    message: "",
    consentConfirmed: false,
  });
  const [pending, setPending] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await createLead({
        data: {
          channel: form.channel,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          topic: form.topic,
          message: form.message,
          consentConfirmed: form.consentConfirmed,
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("相談を登録しました");
      void navigate({ to: "/admin/inquiries/$id", params: { id: res.id } });
    } catch {
      toast.error("登録に失敗しました");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="font-serif text-3xl">相談を手動で登録</h1>
        <p className="mt-2 text-ink-soft">
          LINE・電話・対面など、フォーム以外で受けた相談をお問い合わせとして記録します。ここに登録しておくと、フォーム経由の相談と同じように、対応状況の管理・メモ・履歴・滞留の検知、削除請求への対応ができます。
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="受けた経路" htmlFor="channel" required>
            <NativeSelect
              id="channel"
              value={form.channel}
              onChange={(e) => set("channel", e.target.value as LeadChannel)}
            >
              {LEAD_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {LEAD_CHANNEL_LABEL[c]}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="種別" htmlFor="topic" required>
            <NativeSelect
              id="topic"
              value={form.topic}
              onChange={(e) => set("topic", e.target.value)}
            >
              {CONTACT_TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </NativeSelect>
          </Field>
          <Field
            label="氏名・表示名"
            htmlFor="fullName"
            required
            hint="LINEの表示名でも構いません。"
          >
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
            />
          </Field>
          <Field
            label="メールアドレス"
            htmlFor="email"
            hint="不明な場合は空欄で構いません。登録後、詳細画面からは編集できません。"
          >
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="電話番号" htmlFor="phone">
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="相談内容"
          htmlFor="message"
          required
          hint="やり取りの要点を書き写します。転記元（LINEのトーク等）は削除請求時に併せて削除してください。"
        >
          <Textarea
            id="message"
            className="min-h-32"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </Field>

        <CheckRow>
          <Checkbox
            checked={form.consentConfirmed}
            onChange={(e) => set("consentConfirmed", e.target.checked)}
          />
          <span>
            個人情報の利用目的を本人に案内し、記録することへの同意を得た
            <span className="mt-1 block text-sm text-muted">
              チェックしない場合も登録はできます。未同意として記録され、次に連絡するときに案内が必要なことが履歴に残ります。
            </span>
          </span>
        </CheckRow>

        <Button type="submit" disabled={pending}>
          {pending ? "登録中…" : "登録する"}
        </Button>
      </form>
    </div>
  );
}
