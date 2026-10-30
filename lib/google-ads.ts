// Basic consent mode: the Google script is never loaded before acceptance.
export const ADS_ID = "AW-18544997331";
export const ADS_CONVERSION = `${ADS_ID}/1dPtCLqMv64dENPn-IpF`;
export const CONSENT_KEY = "base12-ad-measurement-v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

type Choice = { accepted: boolean; at: number };
export type ConfirmedPurchase = {
  transactionId: string;
  amountCents: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
let initialized = false;
let pending: ConfirmedPurchase | null = null;
const sent = new Set<string>();

export function readAdConsent(): boolean | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const choice: Choice = JSON.parse(raw);
    return typeof choice.accepted === "boolean" && Number.isFinite(choice.at)
      && Date.now() - choice.at >= 0 && Date.now() - choice.at < MAX_AGE
      ? choice.accepted : null;
  } catch { return null; }
}

export function safeMeasurementUrl(value: string): string {
  try { const url = new URL(value); return `${url.origin}${url.pathname}`; }
  catch { return ""; }
}

export function startAdMeasurement() {
  if (readAdConsent() !== true || initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied",
    ad_personalization: "denied", analytics_storage: "denied",
  });
  window.gtag("consent", "update", {
    ad_storage: "granted", ad_user_data: "granted",
    ad_personalization: "denied", analytics_storage: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", ADS_ID, {
    send_page_view: false,
    allow_ad_personalization_signals: false,
    allow_enhanced_conversions: false,
    cookie_expires: 90 * 24 * 60 * 60,
    page_location: safeMeasurementUrl(window.location.href),
    page_referrer: safeMeasurementUrl(document.referrer),
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(script);
  flushPurchase();
}

function flushPurchase() {
  if (!initialized || readAdConsent() !== true || !pending || sent.has(pending.transactionId)) return;
  sent.add(pending.transactionId);
  window.gtag?.("event", "conversion", {
    send_to: ADS_CONVERSION,
    value: pending.amountCents / 100,
    currency: "EUR",
    transaction_id: pending.transactionId,
    page_location: safeMeasurementUrl(window.location.href),
    page_referrer: safeMeasurementUrl(document.referrer),
  });
  pending = null;
}

// Call only with the receipt returned by the server AFTER bank confirmation.
export function reportConfirmedPurchase(purchase: ConfirmedPurchase) {
  if (!purchase || typeof purchase.transactionId !== "string" || !purchase.transactionId
    || !Number.isSafeInteger(purchase.amountCents) || purchase.amountCents <= 0) return;
  pending = purchase;
  startAdMeasurement();
  flushPurchase();
}

export function saveAdConsent(accepted: boolean) {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted, at: Date.now() })); }
  catch { return false; }
  if (accepted) startAdMeasurement();
  else {
    // Remove first-party ad cookies, including the parent-domain variants.
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!name.startsWith("_gcl_")) continue;
      const domains = ["", window.location.hostname, ".base12academy.es"];
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""} SameSite=Lax; Secure`;
      }
    }
    // Fully unload a previously accepted tag so no further events are sent.
    if (initialized) window.location.reload();
  }
  return true;
}
