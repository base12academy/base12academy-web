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
  const normalized = dsMerchantParameters
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const decoded = Buffer.from(normalized, "base64").toString("utf8");
  return JSON.parse(decoded);
}

function normalizeSigningKey(signingKey: string) {
  if (signingKey.length >= 16) {
    return signingKey.slice(0, 16);
  }

  return signingKey.padEnd(16, "0");
}

function diversifyKey(order: string, signingKey: string) {
  const key = Buffer.from(normalizeSigningKey(signingKey), "utf8");
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(order, "utf8"),
    cipher.final(),
  ]);

  return encrypted.toString("base64");
}

export function createRedsysSignature(
  dsMerchantParameters: string,
  order: string,
  signingKey: string
) {
  const diversifiedKey = diversifyKey(order, signingKey);

  const hmac = crypto
    .createHmac("sha512", Buffer.from(diversifiedKey, "utf8"))
    .update(dsMerchantParameters, "utf8")
    .digest();

  return base64UrlEncode(hmac);
}

export function createNotifySignature(
  dsMerchantParameters: string,
  order: string,
  signingKey: string
) {
  return createRedsysSignature(
    dsMerchantParameters,
    order,
    signingKey
  );
}

export function normalizeSignature(signature: string) {
  return signature
    .replace(/\s/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

