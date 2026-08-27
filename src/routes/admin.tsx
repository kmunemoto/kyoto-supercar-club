import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/shell";
import { pageHead } from "@/lib/seo";
import { getStaffSession } from "@/lib/staff";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () =>
    pageHead({
      title: "運営",
      description: "運営向け管理画面",
      path: "/admin",
      noindex: true,
    }),
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    void getStaffSession().then((session) => setOk(Boolean(session)));
  }, []);

  if (ok === null) return <div className="min-h-dvh bg-paper" />;
  if (!ok) {
    if (typeof window !== "undefined") window.location.assign("/login");
    return <div className="min-h-dvh bg-paper" />;
  }
  return <AdminShell pathname={pathname} />;
}
