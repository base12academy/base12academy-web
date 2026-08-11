import { NextResponse } from "next/server";
import crypto from "crypto";
import { courses, type CourseSlug } from "@/lib/courses";
import { getSupabase } from "@/lib/supabase/server";

const LEGAL_VERSION = "2026-08-11";

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

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const userId = authData.user.id;
  const courseSlug = (body?.courseSlug || "historia-espana") as CourseSlug;
  const course = courses[courseSlug];

  if (!course || !course.active || course.priceInCents == null) {
    return NextResponse.json({ error: "Curso no válido" }, { status: 400 });
  }

  const termsAccepted = body?.termsAccepted === true;
  const privacyAcknowledged = body?.privacyAcknowledged === true;
  const immediateAccess = body?.immediateAccess === true;
  const withdrawalAcknowledged = body?.withdrawalAcknowledged === true;
  if (!termsAccepted || !privacyAcknowledged || (immediateAccess && !withdrawalAcknowledged)) {
    return NextResponse.json(
      { error: "Faltan consentimientos obligatorios" },
      { status: 400 }
    );
  }

  const order = generateOrder();
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const ipHash = forwardedFor
    ? crypto.createHash("sha256").update(forwardedFor).digest("hex")
    : null;
  const contractSnapshot = {
    legalVersion: LEGAL_VERSION,
    course: course.title,
    catalogSlug: course.slug,
    priceInCents: course.priceInCents,
    terms: "Acepto las condiciones de contratación y las normas de uso.",
    privacy: "Confirmo el tratamiento necesario para gestionar la matrícula y prestar el servicio.",
    immediateAccess: immediateAccess
      ? "Solicito expresamente el inicio antes de finalizar el plazo de desistimiento de 14 días."
      : "No solicito el inicio inmediato; el acceso se activará al finalizar el plazo legal.",
    withdrawal: withdrawalAcknowledged
      ? "Conozco las consecuencias legales del inicio de la prestación y del contenido digital."
      : null,
  };

  const { data: acceptance, error: acceptanceError } = await supabase
    .from("contract_acceptances")
    .insert({
      user_id: userId,
      order_id: order,
      catalog_slug: course.slug,
      legal_version: LEGAL_VERSION,
      terms_accepted: termsAccepted,
      privacy_acknowledged: privacyAcknowledged,
      immediate_access_requested: immediateAccess,
      withdrawal_acknowledged: withdrawalAcknowledged,
      marketing_consent: body?.marketingConsent === true,
      contract_snapshot: contractSnapshot,
      ip_hash: ipHash,
      user_agent: req.headers.get("user-agent"),
    })
    .select("id")
    .single();

  if (acceptanceError || !acceptance) {
    console.error("No se pudo registrar la aceptación contractual", acceptanceError);
    return NextResponse.json(
      { error: "No se pudo registrar el consentimiento" },
      { status: 500 }
    );
  }

  const params = {
    Ds_Merchant_Amount: String(course.priceInCents),
    Ds_Merchant_Order: order,
    Ds_Merchant_MerchantCode: merchantCode,
    Ds_Merchant_Currency: "978",
    Ds_Merchant_TransactionType: "0",
    Ds_Merchant_Terminal: terminal,
    Ds_Merchant_MerchantData: Buffer.from(
  JSON.stringify({
    userId,
    courseSlug,
    catalogSlug: course.slug,
    planSlug: "planSlug" in course ? course.planSlug : "standard",
    accessMonths: "accessMonths" in course ? course.accessMonths : null,
    consentId: acceptance.id,
    immediateAccess,
})
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
