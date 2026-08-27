import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminToolbar } from "@/components/admin/toolbar";
import { listOwners, type OwnerRow } from "@/lib/data/admin";
import { downloadText, formatDateTime, toCsv } from "@/lib/utils";

export const Route = createFileRoute("/admin/owners")({
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<OwnerRow[] | null>(null);

  function load(nextQ = q, nextStatus = status) {
    listOwners({ data: { q: nextQ, status: nextStatus } })
      .then(setRows)
      .catch(() => setRows([]));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">オーナー申込</h1>
        <p className="mt-2 text-ink-soft">車両提供の相談一覧です。</p>
      </header>
      <AdminToolbar
        q={q}
        status={status}
        onQ={setQ}
        onStatus={setStatus}
        onExport={() => {
          if (!rows) return;
          downloadText(
            "owner-inquiries.csv",
            toCsv(rows, [
              "id",
              "full_name",
              "email",
              "phone",
              "region",
              "make",
              "model",
              "year",
              "mileage_km",
              "status",
              "created_at",
            ]),
          );
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 font-medium">氏名</th>
              <th className="py-2 font-medium">車両</th>
              <th className="py-2 font-medium">地域</th>
              <th className="py-2 font-medium">状態</th>
              <th className="py-2 font-medium">受付</th>
            </tr>
          </thead>
          <tbody>
            {rows == null ? (
              <tr>
                <td className="py-6 text-muted" colSpan={5}>
                  読み込み中…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="py-6 text-muted" colSpan={5}>
                  該当なし
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-line/70">
                  <td className="py-3">
                    <Link to="/admin/owners/$id" params={{ id: r.id }} className="hover:underline">
                      {r.full_name}
                    </Link>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="py-3">
                    {r.make} {r.model}
                    <p className="text-xs text-muted">
                      {r.year} / {r.mileage_km.toLocaleString()} km
                    </p>
                  </td>
                  <td className="py-3">{r.region}</td>
                  <td className="py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 text-muted">{formatDateTime(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
