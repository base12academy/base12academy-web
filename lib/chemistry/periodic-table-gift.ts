import crypto from "crypto";

export const PERIODIC_TABLE_GIFT_CAMPAIGN = "ciencias-50";
export const PERIODIC_TABLE_GIFT_LIMIT = 50;

export function normalizeGiftEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizeGiftCode(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function isValidGiftEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function createGiftCode() {
  return `B12-CLARA-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

export function hashGiftCode(code: unknown) {
  return crypto.createHash("sha256").update(normalizeGiftCode(code)).digest("hex");
}

export function giftErrorMessage(message: string | undefined) {
  if (message?.includes("gift_email_already_invited")) {
    return "Ya existe un enlace vigente para este correo.";
  }
  if (message?.includes("gift_campaign_full")) {
    return "Las 50 plazas de la promoción ya están reservadas.";
  }
  if (message?.includes("gift_email_mismatch")) {
    return "Este regalo está reservado para otro correo electrónico.";
  }
  if (message?.includes("gift_invite_expired")) {
    return "Este enlace ha caducado. Solicita uno nuevo si la promoción sigue disponible.";
  }
  if (message?.includes("gift_invite_redeemed")) {
    return "Este enlace ya ha sido utilizado.";
  }
  if (message?.includes("gift_invite_invalid")) {
    return "El enlace de regalo no es válido.";
  }
  if (message?.includes("gift_campaign_unavailable")) {
    return "Esta promoción no está disponible.";
  }
  return "No se pudo gestionar el regalo.";
}
