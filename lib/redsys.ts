import crypto from "crypto";

export type RedsysEnvironment = "TEST" | "PROD";

export type RedsysCredentials = {
  environment: RedsysEnvironment;
  merchantCode: string;
  terminal: string;
  signingKey: string;
};

type RedsysEnvironmentSource = Record<string, string | undefined>;

const REDSYS_STANDARD_TEST_KEY = "sq7HjrUOBfKmC576ILgskD5srU870gJ7";

function validateCredentials(credentials: RedsysCredentials) {
  if (
    credentials.environment === "PROD" &&
    credentials.signingKey === REDSYS_STANDARD_TEST_KEY
  ) {
    throw new Error(
      "La clave estandar de pruebas de Redsys no puede utilizarse en produccion"
    );
  }

  return credentials;
}

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
  const merchantCode = source.REDSYS_MERCHANT_CODE?.trim();
  const terminal = source.REDSYS_TERMINAL?.trim();
  const signingKey = (
    source.REDSYS_SECRET_KEY || source.REDSYS_SIGNING_KEY
  )?.trim();

  if (merchantCode && terminal && signingKey) {
    return validateCredentials({
      environment: normalizeEnvironment(source.REDSYS_ENV),
      merchantCode,
      terminal,
      signingKey,
    });
  }

  const packedApiKey = source.REDSYS_API_KEY?.trim();

  if (packedApiKey) {
    return validateCredentials(decodePackedCredentials(packedApiKey));
  }

  throw new Error(
    "Faltan REDSYS_MERCHANT_CODE, REDSYS_TERMINAL o REDSYS_SECRET_KEY"
  );
}

export function decodeMerchantParameters(dsMerchantParameters: string) {
  const decoded = Buffer.from(dsMerchantParameters, "base64url").toString("utf8");
  return JSON.parse(decoded);
}

function diversifyKey(order: string, signingKey: string) {
  const key = Buffer.from(signingKey, "base64");

  if (key.length !== 24) {
    throw new Error("La clave de firma HMAC SHA-256 de Redsys no es valida");
  }

  const orderBytes = Buffer.from(order, "utf8");
  const paddedOrder = Buffer.alloc(
    Math.ceil(orderBytes.length / 8) * 8,
    0
  );
  orderBytes.copy(paddedOrder);

  const cipher = crypto.createCipheriv(
    "des-ede3-cbc",
    key,
    Buffer.alloc(8, 0)
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
  const diversifiedKey = diversifyKey(order, signingKey);

  return crypto
    .createHmac("sha256", diversifiedKey)
    .update(dsMerchantParameters, "utf8")
    .digest("base64");
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
