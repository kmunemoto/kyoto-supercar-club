import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminToolbar } from "@/components/admin/toolbar";
import { listCollections, type CollectionRow } from "@/lib/data/admin";
import { downloadText, formatDateTime, toCsv } from "@/lib/utils";

export const Route = createFileRoute("/admin/collection")({
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<CollectionRow[] | null>(null);

  useEffect(() => {
    listCollections({ data: { q, status } })
      .then(setRows)
      .catch(() => setRows([]));
  }, [q, status]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">共同オーナー候補</h1>
        <p className="mt-2 text-ink-soft">共同所有の事前登録一覧です。契約ではありません。</p>
      </header>
      <AdminToolbar
        q={q}
        status={status}
        onQ={setQ}
        onStatus={setStatus}
        onExport={() => {
          if (!rows) return;
          downloadText(
            "collection-inquiries.csv",
            toCsv(rows, [
              "id",
              "full_name",
              "email",
              "phone",
              "applicant_type",
              "region",
              "desired_models",
              "budget_band",
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
              <th className="py-2 font-medium">希望</th>
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
                    <Link
                      to="/admin/collection/$id"
                      params={{ id: r.id }}
                      className="hover:underline"
                    >
                      {r.full_name}
                    </Link>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="py-3">
                    {r.desired_models}
                    <p className="text-xs text-muted">{r.budget_band}</p>
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
