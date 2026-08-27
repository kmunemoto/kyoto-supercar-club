import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/shell";
import { pageTitle } from "@/lib/brand";
import { getStaffSession } from "@/lib/staff";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: pageTitle("運営") },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    setOk(Boolean(getStaffSession()));
  }, []);

  if (ok === null) return <div className="min-h-dvh bg-paper" />;
  if (!ok) {
    if (typeof window !== "undefined") window.location.assign("/login");
    return <div className="min-h-dvh bg-paper" />;
  }
  return <AdminShell pathname={pathname} />;
}
