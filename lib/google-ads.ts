// Google measurement remains blocked until the visitor chooses the optional purposes.
export const ADS_ID = "AW-18544997331";
export const ADS_CONVERSION = `${ADS_ID}/1dPtCLqMv64dENPn-IpF`;
export const GTM_ID = "GTM-PGM85HJL";
export const CONSENT_KEY = "base12-ad-measurement-v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;

type StoredChoice = {
  analytics?: boolean;
  ads?: boolean;
  // Compatibility with choices saved before analytics was added as a separate purpose.
  accepted?: boolean;
  at: number;
};
export type MeasurementConsent = { analytics: boolean; ads: boolean };
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

export function readMeasurementConsent(): MeasurementConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const choice: StoredChoice = JSON.parse(raw);
    if (!Number.isFinite(choice.at) || Date.now() - choice.at < 0 || Date.now() - choice.at >= MAX_AGE) {
      return null;
    }
    if (typeof choice.analytics === "boolean" && typeof choice.ads === "boolean") {
      return { analytics: choice.analytics, ads: choice.ads };
    }
    if (typeof choice.accepted === "boolean") {
      return { analytics: choice.accepted, ads: choice.accepted };
    }
    return null;
  } catch {
    return null;
  }
}

// Kept for purchase reporting code that needs to know whether ad measurement is allowed.
export function readAdConsent(): boolean | null {
  const choice = readMeasurementConsent();
  return choice ? choice.ads : null;
}

export function safeMeasurementUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

function removeOptionalGoogleCookies(removeAnalytics: boolean, removeAds: boolean) {
  const prefixes = [
    ...(removeAnalytics ? ["_ga"] : []),
    ...(removeAds ? ["_gcl_"] : []),
  ];
  if (!prefixes.length) return;
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!prefixes.some(prefix => name === prefix || name.startsWith(prefix))) continue;
    const domains = ["", window.location.hostname, ".base12academy.es"];
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""} SameSite=Lax; Secure`;
    }
  }
}

function startTagManager() {
  if (document.querySelector(`script[data-base12-gtm="${GTM_ID}"]`)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  script.dataset.base12Gtm = GTM_ID;
  document.head.appendChild(script);
}

export function startGoogleMeasurement() {
  const choice = readMeasurementConsent();
  if (!choice || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.ads ? "granted" : "denied",
    ad_user_data: choice.ads ? "granted" : "denied",
    ad_personalization: "denied",
  });

  if (choice.analytics) startTagManager();
  if (choice.ads) {
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
  }
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
  startGoogleMeasurement();
  flushPurchase();
}

export function saveMeasurementConsent(choice: MeasurementConsent) {
  try {
    const previous = readMeasurementConsent();
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...choice, at: Date.now() }));
    if (!choice.analytics || !choice.ads) {
      removeOptionalGoogleCookies(!choice.analytics, !choice.ads);
    }
    // A changed choice must reload a tag that may already have been started.
    if (initialized && (previous?.analytics !== choice.analytics || previous?.ads !== choice.ads)) {
      window.location.reload();
    }
    return true;
  } catch {
    return false;
  }
}

// Compatibility for callers that set both optional purposes together.
export function saveAdConsent(accepted: boolean) {
  return saveMeasurementConsent({ analytics: accepted, ads: accepted });
}
