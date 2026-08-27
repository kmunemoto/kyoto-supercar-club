import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { getContact } from "@/lib/data/admin";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getContact>> | undefined>(undefined);

  const load = useCallback(() => {
    getContact({ data: id }).then(setData);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (data === undefined) return <p className="text-muted">読み込み中…</p>;
  if (!data) return <p>見つかりません。</p>;
  const r = data.row;

  return (
    <div className="space-y-10">
      <p>
        <Link to="/admin/inquiries" className="text-sm text-muted hover:text-ink">
          ← 一覧
        </Link>
      </p>
      <header>
        <h1 className="font-serif text-3xl">{r.full_name}</h1>
        <p className="mt-2 text-muted">{formatDateTime(r.created_at)} 受付</p>
      </header>
      <Defs
        items={[
          ["メール", r.email],
          ["電話", r.phone],
          ["種別", r.topic],
          ["内容", r.message],
        ]}
      />
      <StatusAndNotes
        subjectType="contact"
        id={r.id}
        status={r.status}
        notes={data.notes}
        events={data.events}
        onChanged={load}
      />
    </div>
  );
}
