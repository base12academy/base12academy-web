// lib/redsys.ts
import crypto from "crypto";

export function decodeMerchantParameters(
  dsMerchantParameters: string
) {
  const decoded = Buffer.from(
    dsMerchantParameters,
    "base64"
  ).toString("utf8");

  return JSON.parse(decoded);
}

function diversifyKey(
  order: string,
  signingKey: string
) {
  // La clave se recibe tal como aparece en el módulo de administración.
  // La decodificación forma parte del algoritmo HMAC_SHA256_V1.
  const key = Buffer.from(signingKey, "base64");

  const iv = Buffer.alloc(8, 0);

  const orderBuffer = Buffer.from(order, "utf8");

  const paddedLength =
    Math.ceil(orderBuffer.length / 8) * 8;

  const paddedOrder = Buffer.alloc(
    paddedLength,
    0
  );

  orderBuffer.copy(paddedOrder);

  const cipher = crypto.createCipheriv(
    "des-ede3-cbc",
    key,
    iv
  );

  cipher.setAutoPadding(false);

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

 return crypto
  .createHmac("sha256", diversifiedKey)
  .update(dsMerchantParameters, "utf8")
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");
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
    .replace(/ /g, "+");
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
