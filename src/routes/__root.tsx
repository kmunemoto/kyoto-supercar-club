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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BRAND } from "@/lib/brand";

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
  console.error(error);
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: BRAND.name },
      {
        name: "description",
        content:
          "京都発の招待制スーパーカーシェア。現在はサービス準備中です。車両提供の先行相談と会員事前登録を受け付けています。",
      },
      { name: "author", content: BRAND.name },
      { name: "theme-color", content: "#1C1A17" },
      { property: "og:title", content: BRAND.name },
      {
        property: "og:description",
        content: "サービス準備中。先行相談と事前登録を受け付けています。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
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
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
