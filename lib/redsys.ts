// lib/redsys.ts
import crypto from "crypto";

export function decodeMerchantParameters(
  dsMerchantParameters: string
) {
  const normalized = dsMerchantParameters
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const decoded = Buffer.from(
    normalized,
    "base64"
  ).toString("utf8");

  return JSON.parse(decoded);
}

function base64UrlEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function diversifyKey(
  order: string,
  signingKey: string
) {
  const normalizedKey =
  signingKey.length >= 16
    ? signingKey.slice(0, 16)
    : signingKey.padEnd(16, "0");

const key = Buffer.from(normalizedKey, "utf8");
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    key,
    iv
  );

  cipher.setAutoPadding(false);

  const orderBuffer = Buffer.from(order, "utf8");

  const paddedLength =
    Math.ceil(orderBuffer.length / 16) * 16;

  const paddedOrder = Buffer.alloc(
    paddedLength,
    0
  );

  orderBuffer.copy(paddedOrder);

  return Buffer.concat([
    cipher.update(paddedOrder),
    cipher.final(),
  ]);
}

export function createRedsysSignature(
  dsMerchantParameters: string,
  order: string,
  signingKey: string
) {
  const diversifiedKey = diversifyKey(
    order,
    signingKey
  );

  const hmac = crypto
    .createHmac("sha512", diversifiedKey)
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

export function normalizeSignature(
  signature: string
) {
  return signature
    .replace(/\s/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function safeEqual(
  a: string,
  b: string
) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}
