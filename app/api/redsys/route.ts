import { NextResponse } from "next/server";
import crypto from "crypto";
import { courses, type CourseSlug } from "@/lib/courses";
import { getSupabase } from "@/lib/supabase/server";
import { createRedsysSignature } from "@/lib/redsys";

const LEGAL_VERSION = "2026-08-11";

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateOrder() {
  return Date.now().toString().slice(-12);
}

export async function POST(req: Request) {
  const merchantCode = process.env.REDSYS_MERCHANT_CODE;
  const terminal = process.env.REDSYS_TERMINAL;
  const signingKey = process.env.REDSYS_SIGNING_KEY;
  const environment = process.env.REDSYS_ENVIRONMENT || "test";

  if (!merchantCode || !terminal || !signingKey) {
    return NextResponse.json(
      {
        error:
          "Faltan variables REDSYS_MERCHANT_CODE, REDSYS_TERMINAL o REDSYS_SIGNING_KEY",
      },
      { status: 500 }
    );
  }

  const token = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json(
      { error: "Debes iniciar sesión" },
      { status: 401 }
    );
  }

  const supabase = getSupabase();

  const { data: authData, error: authError } =
    await supabase.auth.getUser(token);

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: "Sesión no válida" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const userId = authData.user.id;
  const courseSlug = body?.courseSlug as CourseSlug;
  const course = courses[courseSlug];

  if (!course || !course.active || course.priceInCents == null) {
    return NextResponse.json(
      { error: "Curso no válido" },
      { status: 400 }
    );
  }

  const termsAccepted = body?.termsAccepted === true;
  const privacyAcknowledged =
    body?.privacyAcknowledged === true;
  const immediateAccess = body?.immediateAccess === true;
  const withdrawalAcknowledged =
    body?.withdrawalAcknowledged === true;

  if (
    !termsAccepted ||
    !privacyAcknowledged ||
    (immediateAccess && !withdrawalAcknowledged)
  ) {
    return NextResponse.json(
      { error: "Faltan consentimientos obligatorios" },
      { status: 400 }
    );
  }

  const order = generateOrder();

  const forwardedFor =
    req.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim() || "";

  const ipHash = forwardedFor
    ? crypto
        .createHash("sha256")
        .update(forwardedFor)
        .digest("hex")
    : null;

  const contractSnapshot = {
    legalVersion: LEGAL_VERSION,
    course: course.title,
    catalogSlug: course.slug,
    priceInCents: course.priceInCents,
    terms:
      "Acepto las condiciones de contratación y las normas de uso.",
    privacy:
      "Confirmo el tratamiento necesario para gestionar la matrícula y prestar el servicio.",
    immediateAccess: immediateAccess
      ? "Solicito expresamente el inicio antes de finalizar el plazo de desistimiento de 14 días."
      : "No solicito el inicio inmediato; el acceso se activará al finalizar el plazo legal.",
    withdrawal: withdrawalAcknowledged
      ? "Conozco las consecuencias legales del inicio de la prestación y del contenido digital."
      : null,
  };

  const { data: acceptance, error: acceptanceError } =
    await supabase
      .from("contract_acceptances")
      .insert({
        user_id: userId,
        order_id: order,
        catalog_slug: course.slug,
        legal_version: LEGAL_VERSION,
        terms_accepted: termsAccepted,
        privacy_acknowledged: privacyAcknowledged,
        immediate_access_requested: immediateAccess,
        withdrawal_acknowledged:
          withdrawalAcknowledged,
        marketing_consent:
          body?.marketingConsent === true,
        contract_snapshot: contractSnapshot,
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent"),
      })
      .select("id")
      .single();

  if (acceptanceError || !acceptance) {
    console.error(
      "No se pudo registrar la aceptación contractual",
      acceptanceError
    );

    return NextResponse.json(
      { error: "No se pudo registrar el consentimiento" },
      { status: 500 }
    );
  }

  const merchantData = {
    userId,
    courseSlug,
    catalogSlug: course.slug,
    planSlug:
      "planSlug" in course
        ? course.planSlug
        : "standard",
    accessMonths:
      "accessMonths" in course
        ? course.accessMonths
        : null,
    consentId: acceptance.id,
    immediateAccess,
  };

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;

const paymentAmount =
  environment.toLowerCase() === "test"
    ? 1000
    : course.priceInCents;

const params = {
  DS_MERCHANT_AMOUNT: String(paymentAmount),
  DS_MERCHANT_ORDER: order,
  DS_MERCHANT_MERCHANTCODE: merchantCode,
  DS_MERCHANT_CURRENCY: "978",
  DS_MERCHANT_TRANSACTIONTYPE: "0",
  DS_MERCHANT_TERMINAL: terminal,
  DS_MERCHANT_MERCHANTDATA:
    Buffer.from(
      JSON.stringify(merchantData),
      "utf8"
    ).toString("base64"),
  DS_MERCHANT_MERCHANTURL:
    `${origin}/api/redsys/notify`,
  DS_MERCHANT_URLOK:
    `${origin}/pago-ok`,
  DS_MERCHANT_URLKO:
    `${origin}/pago-error`,
};

const dsMerchantParameters =
  base64UrlEncode(JSON.stringify(params));

  const signature = createRedsysSignature(
    dsMerchantParameters,
    order,
    signingKey
  );

  const isLive =
    environment.toLowerCase() === "live";

  const redsysUrl = isLive
    ? "https://sis.redsys.es/sis/realizarPago"
    : "https://sis-t.redsys.es:25443/sis/realizarPago";

  return NextResponse.json({
    redsysUrl,
    dsSignatureVersion: "HMAC_SHA512_V2",
    dsMerchantParameters,
    signature,
    order,
  });
}


