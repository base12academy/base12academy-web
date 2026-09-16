"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type Props = {
  onTokenChange: (token: string) => void;
  resetKey?: number;
};

const SCRIPT_ID = "cloudflare-turnstile-script";

export default function TurnstileWidget({
  onTokenChange,
  resetKey = 0,
}: Props) {
  const reactId = useId().replaceAll(":", "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(
    typeof window !== "undefined" && Boolean(window.turnstile)
  );
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

  const clearToken = useCallback(() => {
    onTokenChange("");
  }, [onTokenChange]);

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.turnstile) {
      return;
    }

    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    clearToken();

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      callback: (token) => onTokenChange(token),
      "expired-callback": clearToken,
      "error-callback": clearToken,
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [clearToken, onTokenChange, resetKey, scriptReady, siteKey]);

  if (!siteKey) {
    return (
      <p role="alert" style={{ margin: "10px 0", color: "#b91c1c", fontSize: 14 }}>
        La protección anti-bots no está configurada.
      </p>
    );
  }

  return (
    <>
      <Script
        id={SCRIPT_ID}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div
        id={`turnstile-${reactId}`}
        ref={containerRef}
        style={{ minHeight: 70, margin: "12px 0" }}
      />
    </>
  );
}
