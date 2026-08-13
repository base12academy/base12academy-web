import { NextResponse } from "next/server";
import crypto from "crypto";
import { courses, type CourseSlug } from "@/lib/courses";
import { getSupabase } from "@/lib/supabase/server";
import { createRedsysSignature } from "@/lib/redsys";

const LEGAL_VERSION = "2026-08-11";
const REDSYS_SIGNATURE_VERSION = "HMAC_SHA256_V1";

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
  const apiKey = process.env.REDSYS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la variable REDSYS_API_KEY" },
      { status: 500 }
    );
  }

  /*
   * Formato de la API Key de Redsys:
   *
   * TEST_<payload>
   * PROD_<payload>
   *
   * El payload contiene:
   * comercio_terminal_claveFirma
   */
  const separator = apiKey.indexOf("_");

  if (separator <= 0) {
    return NextResponse.json(
      { error: "REDSYS_API_KEY no tiene un formato válido" },
      { status: 500 }
    );
  }

  const environment = apiKey.slice(0, separator).toUpperCase();
  const encodedPayload = apiKey.slice(separator + 1);

  if (environment !== "TEST" && environment !== "PROD") {
    return NextResponse.json(
      { error: "Entorno Redsys no válido en REDSYS_API_KEY" },
      { status: 500 }
    );
  }

  const normalizedPayload = encodedPayload
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const paddedPayload =
    normalizedPayload +
    "=".repeat((4 - (normalizedPayload.length % 4)) % 4);

  let decodedPayload: string;

  try {
    decodedPayload = Buffer.from(
      paddedPayload,
      "base64"
    ).toString("utf8");
  } catch {
    return NextResponse.json(
      { error: "No se ha podido decodificar REDSYS_API_KEY" },
      { status: 500 }
    );
  }

  const credentialParts = decodedPayload.split("_");

  const merchantCode = credentialParts[0];
  const terminal = credentialParts[1];
  const signingKey = credentialParts[2];

  if (!merchantCode || !terminal || !signingKey) {
    return NextResponse.json(
      {
        error:
          "REDSYS_API_KEY no contiene comercio, terminal y clave de firma válidos",
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

  if (
    !course ||
    !course.active ||
    course.priceInCents == null
  ) {
    return NextResponse.json(
      { error: "Curso no válido" },
      { status: 400 }
    );
  }

  const termsAccepted =
    body?.termsAccepted === true;

  const privacyAcknowledged =
    body?.privacyAcknowledged === true;

  const immediateAccess =
    body?.immediateAccess === true;

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

  /*
   * En TEST enviamos 10,00 €.
   * En producción se utiliza el precio real.
   */
  const paymentAmount =
    environment === "TEST"
      ? 1000
      : course.priceInCents;

  const params = {
    DS_MERCHANT_AMOUNT:
      String(paymentAmount),

    DS_MERCHANT_ORDER:
      order,

    DS_MERCHANT_MERCHANTCODE:
      merchantCode,

    DS_MERCHANT_CURRENCY:
      "978",

    DS_MERCHANT_TRANSACTIONTYPE:
      "0",

    DS_MERCHANT_TERMINAL:
      terminal,

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

  /*
   * La librería oficial de Redsys genera
   * Ds_MerchantParameters como Base64 URL-safe.
   */
  const dsMerchantParameters =
    base64UrlEncode(
      JSON.stringify(params)
    );

  const signature =
    createRedsysSignature(
      dsMerchantParameters,
      order,
      signingKey
    );

  const isLive =
    environment === "PROD";

  const redsysUrl = isLive
    ? "https://sis.redsys.es/sis/realizarPago"
    : "https://sis-t.redsys.es:25443/sis/realizarPago";

  /*
   * Diagnóstico temporal sin imprimir
   * la clave de firma ni la API Key.
   */
  console.log("REDSYS_DEBUG", {
    environment,
    merchantCode,
    terminal,
    paymentAmount,
    order,
    signatureVersion:
      REDSYS_SIGNATURE_VERSION,
    redsysUrl,
  });

  return NextResponse.json({
    redsysUrl,
    dsSignatureVersion:
      REDSYS_SIGNATURE_VERSION,
    dsMerchantParameters,
    signature,
    order,
  });
}
