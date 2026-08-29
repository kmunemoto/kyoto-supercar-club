import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ContactActions, Defs, StatusAndNotes } from "@/components/admin/detail-tools";
import { CHANNEL_LABEL, getOwner } from "@/lib/data/admin";
import { formatDateTime, jsonList } from "@/lib/utils";

export const Route = createFileRoute("/admin/owners/$id")({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getOwner>> | undefined>(undefined);

  const load = useCallback(() => {
    getOwner({ data: id })
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
        <Link to="/admin/owners" className="text-sm text-muted hover:text-ink">
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
          ["参加目的", r.participation_purpose],
          ["他車利用希望", r.want_to_use_others],
          ["愛車登録希望", r.want_to_register_car],
          ["優先したい時期", r.priority_use_period],
          ["1日200km基準", r.daily_km_preference ?? r.annual_km_cap],
          ["運転者最低年齢", r.min_driver_age],
          ["免許歴希望", r.license_years_pref],
          ["雨天利用", r.rain_use],
          ["降雪時利用", r.snow_use],
          ["走行地域制限", r.region_limit],
          ["屋外夜間保管", r.outdoor_night_parking],
          ["保管場所アクセス", r.handover_access_ok],
          ["LINE連絡希望", r.prefer_line == null ? null : r.prefer_line ? "はい" : "いいえ"],
          ["他の運転者への条件", r.other_driver_conditions],
          ["希望する管理", jsonList(r.management_needs)],
          ["不安・気になること", r.concerns ?? r.questions],
          ["希望連絡", r.preferred_contact],
          ["自由記述", r.free_text],
          ["受付経路", r.channel ? (CHANNEL_LABEL[r.channel] ?? r.channel) : null],
          ["同意時の版", r.policy_version],
          [
            "流入",
            [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || null,
          ],
          ["ランディングページ", r.landing_path],
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
