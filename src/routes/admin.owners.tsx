import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDebouncedQuery, validateAdminSearch } from "@/components/admin/use-filters";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminToolbar } from "@/components/admin/toolbar";
import { listOwners, type OwnerRow } from "@/lib/data/admin";
import { downloadText, formatDateTime, toCsv } from "@/lib/utils";

export const Route = createFileRoute("/admin/owners")({
  validateSearch: validateAdminSearch,
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const q = search.q ?? "";
  const status = search.status ?? "all";
  const setFilters = (next: { q: string; status: string }) =>
    void navigate({
      search: {
        ...(next.q ? { q: next.q } : {}),
        ...(next.status && next.status !== "all" ? { status: next.status } : {}),
      },
      replace: true,
    });
  const setQ = (next: string) => setFilters({ q: next, status });
  const setStatus = (next: string) => setFilters({ q, status: next });
  const [draftQ, setDraftQ] = useDebouncedQuery(q, setQ);
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
        <p className="mt-2 text-ink-soft">REGISTRY（愛車の無料登録）の一覧です。</p>
      </header>
      <AdminToolbar
        q={draftQ}
        status={status}
        onQ={setDraftQ}
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
                      {r.year ?? "年式未記入"} /{" "}
                      {r.mileage_band ||
                        (r.mileage_km != null
                          ? `${r.mileage_km.toLocaleString()} km`
                          : "距離未記入")}
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
