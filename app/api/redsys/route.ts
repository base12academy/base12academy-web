import { NextResponse } from "next/server";
import crypto from "crypto";

function toBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64Key(secretKey: string) {
  return Buffer.from(secretKey, "base64");
}

function padOrder(order: string) {
  const buf = Buffer.alloc(16, 0);
  Buffer.from(order, "utf8").copy(buf);
  return buf;
}

function generateOrder() {
  return Date.now().toString().slice(-12);
}

function encrypt3DES(order: string, secretKeyBase64: string) {
  const key = decodeBase64Key(secretKeyBase64);
  const iv = Buffer.alloc(8, 0);

  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv);
  cipher.setAutoPadding(false);

  const paddedOrder = padOrder(order);
  const encrypted = Buffer.concat([cipher.update(paddedOrder), cipher.final()]);

  return encrypted;
}

function createMerchantSignature(
  dsMerchantParameters: string,
  order: string,
  secretKeyBase64: string
) {
  const key = encrypt3DES(order, secretKeyBase64);

  return crypto
    .createHmac("sha256", key)
    .update(dsMerchantParameters, "utf8")
    .digest("base64");
}

export async function POST(req: Request) {
  const merchantCode = process.env.REDSYS_MERCHANT_CODE;
  const terminal = process.env.REDSYS_TERMINAL || "001";
  const secretKey = process.env.REDSYS_SECRET_KEY;
  const env = process.env.REDSYS_ENV || "TEST";

  if (!merchantCode || !secretKey) {
    return NextResponse.json(
      { error: "Faltan variables REDSYS_MERCHANT_CODE o REDSYS_SECRET_KEY" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const userId = body?.userId || "TEMPORAL";

  const order = generateOrder();

  const params = {
    Ds_Merchant_Amount: "2900",
    Ds_Merchant_Order: order,
    Ds_Merchant_MerchantCode: merchantCode,
    Ds_Merchant_Currency: "978",
    Ds_Merchant_TransactionType: "0",
    Ds_Merchant_Terminal: terminal,
    Ds_Merchant_MerchantData: Buffer.from(
      JSON.stringify({ userId })
    ).toString("base64"),
    Ds_Merchant_MerchantURL:
      "https://base12academy-web-3k98.vercel.app/api/redsys/notify",
    Ds_Merchant_UrlOK:
      "https://base12academy-web-3k98.vercel.app/pago-ok",
    Ds_Merchant_UrlKO:
      "https://base12academy-web-3k98.vercel.app/pago-error",
  };

  const dsMerchantParameters = toBase64(JSON.stringify(params));
  const signature = createMerchantSignature(
    dsMerchantParameters,
    order,
    secretKey
  );

  const redsysUrl =
    env === "PROD"
      ? "https://sis.redsys.es/sis/realizarPago"
      : "https://sis-t.redsys.es:25443/sis/realizarPago";

  return NextResponse.json({
    redsysUrl,
    dsSignatureVersion: "HMAC_SHA256_V1",
    dsMerchantParameters,
    signature,
    order,
  });
}