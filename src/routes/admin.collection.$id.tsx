import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { getCollection } from "@/lib/data/admin";
import { formatDateTime, jsonList } from "@/lib/utils";

export const Route = createFileRoute("/admin/collection/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getCollection>> | undefined>(
    undefined,
  );

  const load = useCallback(() => {
    getCollection({ data: id }).then(setData);
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
        <Link to="/admin/collection" className="text-sm text-muted hover:text-ink">
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
          ["個人／法人", r.applicant_type],
          ["地域", r.region],
          ["京都との関係", r.kyoto_connection],
          ["所有状況", r.current_vehicle_status],
          ["希望車種", r.desired_models],
          ["予算感", r.budget_band],
          ["年間利用日数", r.desired_days_per_year],
          ["年間走行距離", r.desired_km_per_year],
          ["開始時期", r.desired_start_timing],
          ["免許取得年数", r.license_years],
          ["事故・違反の自己申告", r.incident_history],
          ["重視する条件", jsonList(r.priorities)],
          ["質問・懸念", r.concerns],
        ]}
      />
      <StatusAndNotes
        subjectType="collection"
        id={r.id}
        status={r.status}
        notes={data.notes}
        events={data.events}
        onChanged={load}
      />
    </div>
  );
}
