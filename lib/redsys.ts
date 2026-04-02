// lib/redsys.ts
import crypto from "crypto";

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeMerchantParameters(dsMerchantParameters: string) {
  const decoded = Buffer.from(dsMerchantParameters, "base64").toString("utf8");
  return JSON.parse(decoded);
}

function encrypt3DES(order: string, secretKeyBase64: string) {
  const key = Buffer.from(secretKeyBase64, "base64");
  const iv = Buffer.alloc(8, 0);

  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv);
  cipher.setAutoPadding(true);

  return Buffer.concat([
    cipher.update(order, "utf8"),
    cipher.final(),
  ]);
}

export function createNotifySignature(
  dsMerchantParameters: string,
  order: string,
  secretKeyBase64: string
) {
  const key = encrypt3DES(order, secretKeyBase64);
  const hmac = crypto.createHmac("sha512", key);
  hmac.update(dsMerchantParameters);

  return base64UrlEncode(hmac.digest());
}

export function normalizeSignature(signature: string) {
  return signature.replace(/\s/g, "");
}

export function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}