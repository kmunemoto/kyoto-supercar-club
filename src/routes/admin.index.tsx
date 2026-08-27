import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { getDashboard } from "@/lib/data/admin";
import { APPLICATION_STATUSES, STATUS_LABEL } from "@/lib/status";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function sum(rows: { n: number }[]) {
  return rows.reduce((a, r) => a + Number(r.n), 0);
}

function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("読み込めませんでした"));
  }, []);

  if (error) return <p className="text-oxblood">{error}</p>;
  if (!data) return <p className="text-muted">読み込み中…</p>;

  const cards = [
    { label: "オーナー申込", total: sum(data.owners), href: "/admin/owners" },
    { label: "会員事前登録", total: sum(data.members), href: "/admin/members" },
    { label: "お問い合わせ", total: sum(data.contacts), href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-serif text-3xl">概況</h1>
        <p className="mt-2 text-ink-soft">Lovable Cloud に保存された実データです。</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} to={c.href} className="rounded-xl border border-line bg-cream p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 font-serif text-4xl tabular-nums">{c.total}</p>
          </Link>
        ))}
      </div>
      <section>
        <h2 className="font-serif text-xl">ステータス内訳</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 font-medium">状態</th>
                <th className="py-2 font-medium">オーナー</th>
                <th className="py-2 font-medium">会員</th>
                <th className="py-2 font-medium">問合せ</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATION_STATUSES.map((s) => (
                <tr key={s} className="border-b border-line/70">
                  <td className="py-2">{STATUS_LABEL[s]}</td>
                  <td className="py-2 tabular-nums">
                    {data.owners.find((x) => x.status === s)?.n ?? 0}
                  </td>
                  <td className="py-2 tabular-nums">
                    {data.members.find((x) => x.status === s)?.n ?? 0}
                  </td>
                  <td className="py-2 tabular-nums">
                    {data.contacts.find((x) => x.status === s)?.n ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl">最近のオーナー</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.recentOwners.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <Link to="/admin/owners/$id" params={{ id: r.id }} className="hover:underline">
                  {r.full_name}
                  <span className="ml-2 text-sm text-muted">
                    {r.make} {r.model}
                  </span>
                </Link>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-xl">最近の事前登録</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.recentMembers.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <Link to="/admin/members/$id" params={{ id: r.id }} className="hover:underline">
                  {r.full_name}
                  <span className="ml-2 text-sm text-muted">{r.region}</span>
                </Link>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <h2 className="font-serif text-xl">要確認（法務・保険・運用）</h2>
        <p className="mt-2 text-sm text-muted">断定せず、専門家確認が必要な項目です。</p>
        <ul className="mt-4 space-y-4">
          {data.legal.map((item) => (
            <li key={item.id} className="rounded-lg border border-line bg-cream p-4">
              <p className="text-xs tracking-wide text-oxblood">要確認</p>
              <h3 className="mt-1 font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
