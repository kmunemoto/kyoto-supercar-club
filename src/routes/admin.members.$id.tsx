import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ContactActions, Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { CHANNEL_LABEL, getMember } from "@/lib/data/admin";
import { formatDateTime, jsonList } from "@/lib/utils";

export const Route = createFileRoute("/admin/members/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getMember>> | undefined>(undefined);

  const load = useCallback(() => {
    getMember({ data: id })
      .then(setData)
      .catch(() => setData(null));
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
        <Link to="/admin/members" className="text-sm text-muted hover:text-ink">
          ← 一覧
        </Link>
      </p>
      <header>
        <h1 className="font-serif text-3xl">{r.full_name}</h1>
        <p className="mt-2 text-muted">
          {formatDateTime(r.created_at)} 受付 ・ 受付番号{" "}
          <span className="tabular-nums">{r.id}</span>
        </p>
        <div className="mt-4">
          <ContactActions email={r.email} phone={r.phone} referenceId={r.id} />
        </div>
      </header>
      <Defs
        items={[
          ["受付経路", r.channel ? (CHANNEL_LABEL[r.channel] ?? r.channel) : null],
          ["同意時の版", r.policy_version],
          ["メール", r.email],
          ["電話", r.phone],
          ["参加方法", jsonList(r.participation_interests)],
          ["年齢", r.age],
          ["地域", r.region],
          ["免許取得年数", r.license_years],
          ["利用頻度", r.use_frequency],
          ["興味のある車種", jsonList(r.interest_models)],
          ["料金感", r.budget_band],
          ["利用目的", r.use_purpose],
          ["事故・違反の自己申告", r.incident_history],
          ["要望", r.requests],
        ]}
      />
      <StatusAndNotes
        subjectType="member"
        id={r.id}
        status={r.status}
        notes={data.notes}
        events={data.events}
        onChanged={load}
      />
    </div>
  );
}
