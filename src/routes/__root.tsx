import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AnalyticsGate } from "@/components/site/analytics";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BRAND } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
      <div>
        <p className="text-xs tracking-[0.2em] text-copper">404</p>
        <h1 className="mt-4 font-serif text-3xl">ページが見つかりません</h1>
        <p className="mt-3 text-ink-soft">アドレスをご確認いただくか、トップへお戻りください。</p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center rounded-md bg-oxblood px-6 text-cream"
        >
          トップへ戻る
        </Link>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-xl text-ink">ページを表示できませんでした</h1>
        <p className="mt-2 text-sm text-ink-soft">時間をおいて再度お試しください。</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center rounded-md bg-oxblood px-4 text-sm text-cream"
          >
            再試行
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center rounded-md border border-line px-4 text-sm"
          >
            トップへ
          </a>
        </div>
      </div>
    </div>
  );
}

// Meta is deduplicated by name/property with the deepest match winning, so these
// act as defaults for any route that does not set its own. Links are NOT
// deduplicated, so the canonical from here is deliberately left out: every page
// declares its own, and emitting this one too would point each of them at "/".
const fallbackHead = pageHead({
  title: BRAND.name,
  description:
    "京都からスーパーカーの共同所有と、既存オーナー向けの無料登録を準備しています。予約・貸出は行っていません。",
  path: "/",
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1C1A17" },
      ...fallbackHead.meta,
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Noto+Serif+JP:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <AnalyticsGate />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
