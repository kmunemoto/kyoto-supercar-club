import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { getOwner } from "@/lib/data/admin";
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
          ["所有", r.owns_vehicle],
          ["地域", r.region],
          ["メーカー", r.make],
          ["車種", r.model],
          ["年式", r.year],
          ["走行距離帯", r.mileage_band],
          ["保管形態", r.storage_type],
          ["年間利用", r.annual_use_count],
          ["関心", jsonList(r.interests.length ? r.interests : r.management_needs)],
          ["不安・気になること", r.concerns ?? r.questions],
          ["希望連絡", r.preferred_contact],
          ["自由記述", r.free_text],
          [
            "流入",
            [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || null,
          ],
          ["landing", r.landing_path],
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
