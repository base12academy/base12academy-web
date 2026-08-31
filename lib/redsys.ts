import crypto from "crypto";

export type RedsysEnvironment = "TEST" | "PROD";

export type RedsysCredentials = {
  environment: RedsysEnvironment;
  merchantCode: string;
  terminal: string;
  signingKey: string;
};

type RedsysEnvironmentSource = Record<string, string | undefined>;

function normalizeEnvironment(value?: string): RedsysEnvironment {
  const normalized = value?.trim().toUpperCase();

  if (normalized === "PROD" || normalized === "PRODUCTION" || normalized === "LIVE") {
    return "PROD";
  }

  if (!normalized || normalized === "TEST" || normalized === "SANDBOX") {
    return "TEST";
  }

  throw new Error("REDSYS_ENV no tiene un valor válido");
}

function decodePackedCredentials(apiKey: string): RedsysCredentials {
  const separator = apiKey.indexOf("_");

  if (separator <= 0) {
    throw new Error("REDSYS_API_KEY no tiene un formato válido");
  }

  const environment = normalizeEnvironment(apiKey.slice(0, separator));
  const encodedPayload = apiKey.slice(separator + 1);
  let decodedPayload = "";

  try {
    decodedPayload = Buffer.from(encodedPayload, "base64url").toString("utf8");
  } catch {
    throw new Error("No se ha podido decodificar REDSYS_API_KEY");
  }

  const [merchantCode, terminal, ...keyParts] = decodedPayload.split("_");
  const signingKey = keyParts.join("_");

  if (!merchantCode || !terminal || !signingKey) {
    throw new Error("REDSYS_API_KEY no contiene credenciales válidas");
  }

  return { environment, merchantCode, terminal, signingKey };
}

export function getRedsysCredentials(
  source: RedsysEnvironmentSource = process.env
): RedsysCredentials {
  const packedApiKey = source.REDSYS_API_KEY?.trim();

  if (packedApiKey) {
    return decodePackedCredentials(packedApiKey);
  }

  const merchantCode = source.REDSYS_MERCHANT_CODE?.trim();
  const terminal = source.REDSYS_TERMINAL?.trim();
  const signingKey = (
    source.REDSYS_SECRET_KEY || source.REDSYS_SIGNING_KEY
  )?.trim();

  if (!merchantCode || !terminal || !signingKey) {
    throw new Error(
      "Faltan REDSYS_MERCHANT_CODE, REDSYS_TERMINAL o REDSYS_SECRET_KEY"
    );
  }

  return {
    environment: normalizeEnvironment(source.REDSYS_ENV),
    merchantCode,
    terminal,
    signingKey,
  };
}

export function decodeMerchantParameters(dsMerchantParameters: string) {
  const decoded = Buffer.from(dsMerchantParameters, "base64url").toString("utf8");
  return JSON.parse(decoded);
}

function diversifyKey(order: string, signingKey: string) {
  const key = Buffer.alloc(16, 0);
  Buffer.from(signingKey.slice(0, 16), "utf8").copy(key);
  const cipher = crypto.createCipheriv("aes-128-cbc", key, Buffer.alloc(16, 0));

  return Buffer.concat([cipher.update(order, "utf8"), cipher.final()]);
}

export function createRedsysSignature(
  dsMerchantParameters: string,
  order: string,
  signingKey: string
) {
  const diversifiedKey = diversifyKey(order, signingKey);

  return crypto
    .createHmac("sha512", diversifiedKey.toString("base64"))
    .update(dsMerchantParameters, "utf8")
    .digest("base64url");
}

export function createNotifySignature(
  dsMerchantParameters: string,
  order: string,
  signingKey: string
) {
  return createRedsysSignature(dsMerchantParameters, order, signingKey);
}

export function normalizeSignature(signature: string) {
  return signature
    .trim()
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(normalizeSignature(a), "base64url");
  const bBuffer = Buffer.from(normalizeSignature(b), "base64url");

  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}
