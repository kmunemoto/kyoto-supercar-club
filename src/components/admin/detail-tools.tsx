import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NativeSelect, Textarea } from "@/components/ui/native";
import { addNote, updateStatus, type EventRow, type NoteRow } from "@/lib/server/admin";
import { APPLICATION_STATUSES, STATUS_LABEL, type ApplicationStatus, type SubjectType } from "@/lib/status";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

export function StatusAndNotes({
  subjectType,
  id,
  status,
  notes,
  events,
  onChanged,
}: {
  subjectType: SubjectType;
  id: string;
  status: ApplicationStatus;
  notes: NoteRow[];
  events: EventRow[];
  onChanged: () => void;
}) {
  const [next, setNext] = useState<ApplicationStatus>(status);
  const [note, setNote] = useState("");
  const [memo, setMemo] = useState("");
  const [pending, setPending] = useState(false);

  async function saveStatus() {
    setPending(true);
    try {
      await updateStatus({ data: { subjectType, id, status: next, note: note || undefined } });
      toast.success("ステータスを更新しました");
      setNote("");
      onChanged();
    } catch {
      toast.error("更新に失敗しました");
    } finally {
      setPending(false);
    }
  }

  async function saveMemo() {
    if (!memo.trim()) return;
    setPending(true);
    try {
      const res = await addNote({ data: { subjectType, id, body: memo } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("メモを追加しました");
      setMemo("");
      onChanged();
    } catch {
      toast.error("保存に失敗しました");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="rounded-xl border border-line bg-cream p-5">
        <h2 className="font-serif text-xl">ステータス</h2>
        <div className="mt-4">
          <StatusBadge status={status} />
        </div>
        <label className="mt-5 block text-sm">変更</label>
        <NativeSelect
          className="mt-2"
          value={next}
          onChange={(e) => setNext(e.target.value as ApplicationStatus)}
        >
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </NativeSelect>
        <Textarea
          className="mt-3 min-h-20"
          placeholder="変更理由（任意）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button className="mt-4" type="button" disabled={pending} onClick={saveStatus}>
          ステータスを保存
        </Button>
      </section>
      <section className="rounded-xl border border-line bg-cream p-5">
        <h2 className="font-serif text-xl">管理者メモ</h2>
        <Textarea
          className="mt-4 min-h-24"
          placeholder="対応メモ"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <Button className="mt-4" type="button" variant="outline" disabled={pending} onClick={saveMemo}>
          メモを追加
        </Button>
      </section>
      <section className="lg:col-span-2">
        <h2 className="font-serif text-xl">対応履歴</h2>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {events.length === 0 ? (
            <li className="py-4 text-muted">履歴はまだありません。</li>
          ) : (
            events.map((ev) => (
              <li key={ev.id} className="py-4 text-sm">
                <p className="text-muted">{formatDateTime(ev.created_at)}</p>
                <p className="mt-1">
                  {ev.from_status ? STATUS_LABEL[ev.from_status as ApplicationStatus] ?? ev.from_status : "—"} →{" "}
                  {STATUS_LABEL[ev.to_status as ApplicationStatus] ?? ev.to_status}
                </p>
                {ev.note ? <p className="mt-1 text-ink-soft">{ev.note}</p> : null}
              </li>
            ))
          )}
        </ol>
        <h2 className="mt-10 font-serif text-xl">メモ一覧</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {notes.length === 0 ? (
            <li className="py-4 text-muted">メモはまだありません。</li>
          ) : (
            notes.map((n) => (
              <li key={n.id} className="py-4 text-sm">
                <p className="text-muted">{formatDateTime(n.created_at)}</p>
                <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export function Defs({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="border-t border-line pt-3">
          <dt className="text-xs tracking-wide text-muted">{k}</dt>
          <dd className="mt-1 break-words">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
