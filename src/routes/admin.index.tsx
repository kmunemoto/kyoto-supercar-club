import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  CHANNEL_LABEL,
  LEGAL_STATUSES,
  LEGAL_STATUS_LABEL,
  STALE_NEW_DAYS,
  STALE_OPEN_DAYS,
  exportAll,
  getDashboard,
  isLegalStatus,
  setLegalStatus,
  type LegalStatus,
} from "@/lib/data/admin";
import { APPLICATION_STATUSES, STATUS_LABEL } from "@/lib/status";
import { downloadText, formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function sum(rows: { n: number }[]) {
  return rows.reduce((a, r) => a + Number(r.n), 0);
}

function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("読み込めませんでした"));
  }, []);

  async function onExport() {
    setExporting(true);
    try {
      const res = await exportAll();
      const stamp = new Date().toISOString().slice(0, 10);
      downloadText(`ksc-backup-${stamp}.json`, res.json, "application/json;charset=utf-8");
      const total = Object.values(res.counts).reduce((a, n) => a + n, 0);
      if (res.failed.length) {
        toast.error(`${res.failed.join(", ")} を読み出せませんでした`);
      } else {
        toast.success(`${total}件を書き出しました`);
      }
    } catch {
      toast.error("書き出しに失敗しました");
    } finally {
      setExporting(false);
    }
  }

  async function onLegalChange(id: string, next: string) {
    if (!isLegalStatus(next)) return;
    setSaving(id);
    try {
      await setLegalStatus({ data: { id, status: next } });
      setData((prev) =>
        prev
          ? {
              ...prev,
              legal: prev.legal.map((l) => (l.id === id ? { ...l, status: next } : l)),
            }
          : prev,
      );
    } catch {
      toast.error("保存できませんでした");
    } finally {
      setSaving(null);
    }
  }

  if (error) return <p className="text-oxblood">{error}</p>;
  if (!data) return <p className="text-muted">読み込み中…</p>;

  const cards = [
    {
      label: "共同所有",
      total: sum(data.collections),
      href: "/admin/collection",
      isNew: data.collections.find((x) => x.status === "new")?.n ?? 0,
      stale: data.stale.collections,
    },
    {
      label: "オーナー",
      total: sum(data.owners),
      href: "/admin/owners",
      isNew: data.owners.find((x) => x.status === "new")?.n ?? 0,
      stale: data.stale.owners,
    },
    {
      label: "旧会員",
      total: sum(data.members),
      href: "/admin/members",
      isNew: data.members.find((x) => x.status === "new")?.n ?? 0,
      stale: data.stale.members,
    },
    {
      label: "お問い合わせ",
      total: sum(data.contacts),
      href: "/admin/inquiries",
      isNew: data.contacts.find((x) => x.status === "new")?.n ?? 0,
      stale: data.stale.contacts,
    },
  ];
  const staleTotal = cards.reduce((a, c) => a + c.stale, 0);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-serif text-3xl">概況</h1>
      </header>
      {data.environmentWarnings.length > 0 ? (
        <section className="rounded-lg border border-warn/40 bg-warn/5 px-4 py-3">
          <h2 className="text-sm font-medium text-warn">設定を確認してください</h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {data.environmentWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {data.failedNotifications.length > 0 ? (
        <section className="rounded-lg border border-oxblood/30 bg-oxblood/5 px-4 py-3">
          <h2 className="text-sm font-medium text-oxblood">
            送信できなかった通知が {data.failedNotifications.length} 件あります
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {data.failedNotifications.slice(0, 5).map((n) => (
              <li key={n.id}>
                {formatDateTime(n.created_at)} ・ {n.channel} ・ {n.subject_type}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">
            メールの設定が原因で送信できていない可能性があります。該当のリードには自分から連絡してください。
          </p>
        </section>
      ) : null}
      {staleTotal > 0 ? (
        <p className="rounded-lg border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood">
          {STALE_NEW_DAYS}日以上「新規」のまま、または{STALE_OPEN_DAYS}
          日以上動きのない申込が {staleTotal} 件あります。
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} to={c.href} className="rounded-xl border border-line bg-cream p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 font-serif text-4xl tabular-nums">{c.total}</p>
            <p className="mt-2 text-sm">
              <span className={c.isNew > 0 ? "text-oxblood" : "text-muted"}>
                新規 <span className="tabular-nums">{c.isNew}</span>
              </span>
              {c.stale > 0 ? (
                <span className="ml-3 text-oxblood">
                  ／要対応 <span className="tabular-nums">{c.stale}</span>
                </span>
              ) : null}
            </p>
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
                <th className="py-2 font-medium">共同所有</th>
                <th className="py-2 font-medium">オーナー</th>
                <th className="py-2 font-medium">旧会員</th>
                <th className="py-2 font-medium">お問い合わせ</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATION_STATUSES.map((s) => (
                <tr key={s} className="border-b border-line/70">
                  <td className="py-2">{STATUS_LABEL[s]}</td>
                  <td className="py-2 tabular-nums">
                    {data.collections.find((x) => x.status === s)?.n ?? 0}
                  </td>
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
          <h2 className="font-serif text-xl">最近の共同所有</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.recentCollections.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <Link to="/admin/collection/$id" params={{ id: r.id }} className="hover:underline">
                  {r.full_name}
                  <span className="ml-2 text-sm text-muted">{r.desired_models}</span>
                </Link>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
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
          <h2 className="font-serif text-xl">最近のお問い合わせ</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.recentContacts.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <Link to="/admin/inquiries/$id" params={{ id: r.id }} className="hover:underline">
                  {r.full_name}
                  <span className="ml-2 text-sm text-muted">
                    {r.topic}
                    {r.channel && r.channel !== "form"
                      ? ` ・ ${CHANNEL_LABEL[r.channel] ?? r.channel}`
                      : ""}
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
      <section className="rounded-xl border border-line bg-cream p-5">
        <h2 className="font-serif text-xl">バックアップ</h2>
        <p className="mt-2 text-sm text-ink-soft">
          全リードに加えて、メモ・対応履歴・要確認台帳・通知記録をまとめて書き出します。一覧ごとのCSVには含まれない項目です。書き出したファイルは個人情報そのものなので、暗号化した保管先に置いてください。
        </p>
        <button
          type="button"
          className="mt-4 inline-flex h-11 min-h-11 items-center rounded-md border border-line bg-paper px-4 text-sm hover:bg-cream disabled:opacity-60"
          onClick={onExport}
          disabled={exporting}
        >
          {exporting ? "書き出し中…" : "すべて書き出す（JSON）"}
        </button>
      </section>
      <section>
        <h2 className="font-serif text-xl">要確認（法務・保険・運用）</h2>
        <p className="mt-2 text-sm text-muted">
          サイトでは断定を避け、専門家の確認が必要な項目です。
        </p>
        <ul className="mt-4 space-y-4">
          {data.legal.map((item) => {
            const status: LegalStatus = isLegalStatus(item.status) ? item.status : "needs_review";
            return (
              <li key={item.id} className="rounded-lg border border-line bg-cream p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    className={
                      status === "confirmed"
                        ? "text-xs tracking-wide text-success"
                        : "text-xs tracking-wide text-oxblood"
                    }
                  >
                    {LEGAL_STATUS_LABEL[status]}
                  </p>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-muted">状態</span>
                    <select
                      className="h-9 rounded-md border border-line bg-paper px-2 text-sm"
                      value={status}
                      disabled={saving === item.id}
                      onChange={(e) => onLegalChange(item.id, e.target.value)}
                    >
                      {LEGAL_STATUSES.map((value) => (
                        <option key={value} value={value}>
                          {LEGAL_STATUS_LABEL[value]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <h3 className="mt-1 font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{item.detail}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
