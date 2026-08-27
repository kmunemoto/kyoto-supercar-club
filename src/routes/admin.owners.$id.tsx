import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { getOwner } from "@/lib/server/admin";
import { formatDateTime, jsonList } from "@/lib/utils";

export const Route = createFileRoute("/admin/owners/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getOwner>> | undefined>(undefined);

  const load = useCallback(() => {
    getOwner({ data: id }).then(setData);
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
        <Link to="/admin/owners" className="text-sm text-muted hover:text-ink">
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
          ["地域", r.region],
          ["メーカー", r.make],
          ["車種", r.model],
          ["年式", r.year],
          ["走行距離", `${r.mileage_km.toLocaleString()} km`],
          ["保管場所", r.storage_location],
          ["年間利用", r.annual_use_count],
          ["貸出可能期間", r.lendable_period],
          ["希望する管理", jsonList(r.management_needs)],
          ["報酬方式", r.reward_preference],
          ["写真メモ", r.photo_notes],
          ["質問", r.questions],
        ]}
      />
      <StatusAndNotes
        subjectType="owner"
        id={r.id}
        status={r.status}
        notes={data.notes}
        events={data.events}
        onChanged={load}
      />
    </div>
  );
}
