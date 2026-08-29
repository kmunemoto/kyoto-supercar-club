import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  analyticsConsent,
  analyticsIds,
  hasAnalyticsConfig,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView,
} from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

function loadScripts() {
  const { gaId, pixelId } = analyticsIds();
  if (gaId && !document.getElementById("ksc-ga")) {
    const s = document.createElement("script");
    s.id = "ksc-ga";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(s);
    const inline = document.createElement("script");
    inline.id = "ksc-ga-inline";
    inline.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`;
    document.head.appendChild(inline);
  }
  if (pixelId && !document.getElementById("ksc-pixel")) {
    const inline = document.createElement("script");
    inline.id = "ksc-pixel";
    inline.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
    document.head.appendChild(inline);
  }
}

export function AnalyticsGate() {
  const [needed, setNeeded] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const firstView = useRef(true);

  useEffect(() => {
    captureAttribution();
    if (!hasAnalyticsConfig()) return;
    setNeeded(true);
    if (hasAnalyticsConsent()) {
      loadScripts();
      setOpen(false);
    } else {
      setOpen(analyticsConsent() === "unset");
    }
  }, []);

  useEffect(() => {
    // The tags send their own view on load; this covers every route change after it.
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  if (!needed || !open) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-lg px-4 lg:bottom-6">
      <div className="rounded-xl border border-line bg-paper p-4 shadow-lg">
        <p className="text-sm text-ink-soft">
          広告・アクセス解析用のクッキー（Googleアナリティクス、Metaピクセル）は、同意いただいた場合にのみ読み込みます。あとから
          <a href="/privacy" className="underline underline-offset-4">
            プライバシーポリシー
          </a>
          で変更できます。
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="inline-flex h-11 min-h-11 flex-1 items-center justify-center rounded-md bg-oxblood text-sm text-cream"
            onClick={() => {
              setAnalyticsConsent(true);
              loadScripts();
              setOpen(false);
            }}
          >
            同意する
          </button>
          <button
            type="button"
            className="inline-flex h-11 min-h-11 flex-1 items-center justify-center rounded-md border border-line text-sm"
            onClick={() => {
              setAnalyticsConsent(false);
              setOpen(false);
            }}
          >
            同意しない
          </button>
        </div>
      </div>
    </div>
  );
}
