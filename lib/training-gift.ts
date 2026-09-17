import crypto from "crypto";

export const TRAINING_GIFT_CAMPAIGN = "training-50";
export const TRAINING_GIFT_LIMIT = 50;

export function normalizeTrainingGiftEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizeTrainingGiftCode(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

export function isValidTrainingGiftEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function createTrainingGiftCode() {
  return `B12-TRAINING-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

export function hashTrainingGiftCode(code: unknown) {
  return crypto.createHash("sha256").update(normalizeTrainingGiftCode(code)).digest("hex");
}

export function trainingGiftErrorMessage(message: string | undefined) {
  if (message?.includes("gift_email_already_invited")) return "Ya existe un enlace vigente para este correo.";
  if (message?.includes("gift_campaign_full")) return "Las 50 plazas de Base12 Training ya están reservadas.";
  if (message?.includes("gift_email_mismatch")) return "Este regalo está reservado para otro correo electrónico.";
  if (message?.includes("gift_invite_expired")) return "Este enlace ha caducado. Solicita uno nuevo si la promoción sigue disponible.";
  if (message?.includes("gift_invite_redeemed")) return "Este enlace ya ha sido utilizado.";
  if (message?.includes("gift_invite_invalid")) return "El enlace de regalo no es válido.";
  if (message?.includes("gift_campaign_unavailable")) return "Esta promoción no está disponible.";
  return "No se pudo gestionar el regalo de Base12 Training.";
}
