import { useEffect, useState } from "react";
import {
  analyticsConsent,
  clearAnalyticsConsent,
  hasAnalyticsConfig,
  setAnalyticsConsent,
  type ConsentState,
} from "@/lib/analytics";

const LABEL: Record<ConsentState, string> = {
  granted: "現在の設定：同意しています",
  denied: "現在の設定：同意していません",
  unset: "現在の設定：未選択",
};

/**
 * Withdrawing consent has to be as easy as giving it. The scripts already
 * loaded stay for this page view; a reload is what actually clears them, so
 * that is what this does.
 */
export function ConsentControl() {
  const [state, setState] = useState<ConsentState>("unset");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(analyticsConsent());
    setReady(hasAnalyticsConfig());
  }, []);

  if (!ready) {
    return (
      <p className="text-sm text-muted">
        現在、分析・広告用のCookieは設定されていないため読み込まれていません。
      </p>
    );
  }

  const button =
    "inline-flex h-11 min-h-11 items-center justify-center rounded-md border border-line px-4 text-sm";
  return (
    <div className="rounded-lg border border-line bg-cream p-4">
      <p className="text-sm text-ink-soft">{LABEL[state]}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={button}
          onClick={() => {
            setAnalyticsConsent(true);
            setState("granted");
            window.location.reload();
          }}
        >
          同意する
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            setAnalyticsConsent(false);
            setState("denied");
            window.location.reload();
          }}
        >
          同意を取り消す
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            clearAnalyticsConsent();
            setState("unset");
            window.location.reload();
          }}
        >
          選択をリセット
        </button>
      </div>
    </div>
  );
}
