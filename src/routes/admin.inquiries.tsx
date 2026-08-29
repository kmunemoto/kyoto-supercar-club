import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDebouncedQuery, validateAdminSearch } from "@/components/admin/use-filters";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminToolbar } from "@/components/admin/toolbar";
import { CHANNEL_LABEL, listContacts, type ContactRow } from "@/lib/data/admin";
import { downloadText, formatDateTime, toCsv } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries")({
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
  const [rows, setRows] = useState<ContactRow[] | null>(null);

  useEffect(() => {
    listContacts({ data: { q, status } })
      .then(setRows)
      .catch(() => setRows([]));
  }, [q, status]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl">お問い合わせ</h1>
      </header>
      <AdminToolbar
        q={draftQ}
        status={status}
        onQ={setDraftQ}
        onStatus={setStatus}
        onExport={() => {
          if (!rows) return;
          downloadText(
            "contact-inquiries.csv",
            // message is the enquiry itself; leaving it out made the export
            // useless for anything but counting.
            toCsv(rows, [
              "id",
              "full_name",
              "email",
              "phone",
              "topic",
              "message",
              "channel",
              "policy_version",
              "status",
              "created_at",
            ]),
          );
        }}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="py-2 font-medium">氏名</th>
              <th className="py-2 font-medium">種別</th>
              <th className="py-2 font-medium">状態</th>
              <th className="py-2 font-medium">受付</th>
            </tr>
          </thead>
          <tbody>
            {rows == null ? (
              <tr>
                <td className="py-6 text-muted" colSpan={4}>
                  読み込み中…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="py-6 text-muted" colSpan={4}>
                  該当なし
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-line/70">
                  <td className="py-3">
                    <Link
                      to="/admin/inquiries/$id"
                      params={{ id: r.id }}
                      className="hover:underline"
                    >
                      {r.full_name}
                    </Link>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="py-3">
                    {r.topic}
                    {r.channel && r.channel !== "form" ? (
                      <p className="text-xs text-copper">
                        {CHANNEL_LABEL[r.channel] ?? r.channel}経由（手動登録）
                      </p>
                    ) : null}
                  </td>
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
