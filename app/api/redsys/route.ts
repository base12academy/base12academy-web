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

function generateCheckoutToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashCheckoutToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(req: Request) {
  const apiKey = process.env.REDSYS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta la variable REDSYS_API_KEY" },
      { status: 500 }
    );
  }

  const separator = apiKey.indexOf("_");

  if (separator <= 0) {
    return NextResponse.json(
      { error: "REDSYS_API_KEY no tiene un formato válido" },
      { status: 500 }
    );
  }

  const environment = apiKey
    .slice(0, separator)
    .toUpperCase();

  const encodedPayload =
    apiKey.slice(separator + 1);

  if (
    environment !== "TEST" &&
    environment !== "PROD"
  ) {
    return NextResponse.json(
      {
        error:
          "Entorno Redsys no válido en REDSYS_API_KEY",
      },
      { status: 500 }
    );
  }

  const normalizedPayload = encodedPayload
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const paddedPayload =
    normalizedPayload +
    "=".repeat(
      (4 - (normalizedPayload.length % 4)) % 4
    );

  let decodedPayload: string;

  try {
    decodedPayload = Buffer.from(
      paddedPayload,
      "base64"
    ).toString("utf8");
  } catch {
    return NextResponse.json(
      {
        error:
          "No se ha podido decodificar REDSYS_API_KEY",
      },
      { status: 500 }
    );
  }

  const credentialParts =
    decodedPayload.split("_");

  const merchantCode = credentialParts[0];
  const terminal = credentialParts[1];
  const signingKey = credentialParts[2];

  if (
    !merchantCode ||
    !terminal ||
    !signingKey
  ) {
    return NextResponse.json(
      {
        error:
          "REDSYS_API_KEY no contiene comercio, terminal y clave de firma válidos",
      },
      { status: 500 }
    );
  }

  const body = await req
    .json()
    .catch(() => ({}));

  const courseSlug =
    body?.courseSlug as CourseSlug;

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

  const marketingConsent =
    body?.marketingConsent === true;

  if (
    !termsAccepted ||
    !privacyAcknowledged ||
    (
      immediateAccess &&
      !withdrawalAcknowledged
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Faltan consentimientos obligatorios",
      },
      { status: 400 }
    );
  }

  const order = generateOrder();
  const checkoutToken =
    generateCheckoutToken();

  const checkoutTokenHash =
    hashCheckoutToken(checkoutToken);

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

    priceInCents:
      course.priceInCents,

    terms:
      "Acepto las condiciones de contratación y las normas de uso.",

    privacy:
      "Confirmo el tratamiento necesario para gestionar la matrícula y prestar el servicio.",

    immediateAccess: immediateAccess
      ? "Solicito expresamente el inicio antes de finalizar el plazo de desistimiento de 14 días."
      : "No solicito el inicio inmediato; el acceso se activará al finalizar el plazo legal.",

    withdrawal:
      withdrawalAcknowledged
        ? "Conozco las consecuencias legales del inicio de la prestación y del contenido digital."
        : null,
  };

  const actualCourseSlug =
    "courseSlug" in course
      ? course.courseSlug
      : course.slug;

  const planSlug =
    "planSlug" in course
      ? course.planSlug
      : "standard";

  const accessMonths =
    "accessMonths" in course
      ? course.accessMonths
      : null;

  const supabase = getSupabase();

  const {
    data: checkoutOrder,
    error: checkoutError,
  } = await supabase
    .from("checkout_orders")
    .insert({
      order_id: order,

      checkout_token_hash:
        checkoutTokenHash,

      catalog_slug: course.slug,

      course_slug:
        actualCourseSlug,

      plan_slug: planSlug,

      access_months:
        accessMonths,

      amount_cents:
        course.priceInCents,

      currency: "978",

      status: "pending",

      legal_version:
        LEGAL_VERSION,

      terms_accepted:
        termsAccepted,

      privacy_acknowledged:
        privacyAcknowledged,

      immediate_access_requested:
        immediateAccess,

      withdrawal_acknowledged:
        withdrawalAcknowledged,

      marketing_consent:
        marketingConsent,

      contract_snapshot:
        contractSnapshot,

      ip_hash: ipHash,

      user_agent:
        req.headers.get("user-agent"),
    })
    .select("id")
    .single();

  if (
    checkoutError ||
    !checkoutOrder
  ) {
    console.error(
      "No se pudo crear el pedido previo al pago",
      checkoutError
    );

    return NextResponse.json(
      {
        error:
          "No se pudo preparar el pedido",
      },
      { status: 500 }
    );
  }

  /*
   * No hay datos personales ni userId.
   * Redsys recibe únicamente la referencia
   * interna necesaria para identificar
   * el pedido en la notificación.
   */
  const merchantData = {
    checkoutId:
      checkoutOrder.id,

    catalogSlug:
      course.slug,

    courseSlug:
      actualCourseSlug,

    planSlug,

    accessMonths,

    immediateAccess,
  };

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    new URL(req.url).origin;

  const paymentAmount =
    course.priceInCents;

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
        JSON.stringify(
          merchantData
        ),
        "utf8"
      ).toString("base64"),

    DS_MERCHANT_MERCHANTURL:
      `${origin}/api/redsys/notify`,

    /*
     * El token permite recuperar el pedido
     * pagado después de regresar del banco.
     * En la base de datos solo se conserva
     * su hash.
     */
    DS_MERCHANT_URLOK:
      `${origin}/pago-ok?checkout=${encodeURIComponent(
        checkoutToken
      )}`,

    DS_MERCHANT_URLKO:
      `${origin}/pago-error`,
  };

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

  console.log(
    "REDSYS_CHECKOUT_CREATED",
    {
      environment,
      merchantCode,
      terminal,
      paymentAmount,
      order,
      checkoutId:
        checkoutOrder.id,
      signatureVersion:
        REDSYS_SIGNATURE_VERSION,
      redsysUrl,
    }
  );

  return NextResponse.json({
    redsysUrl,

    dsSignatureVersion:
      REDSYS_SIGNATURE_VERSION,

    dsMerchantParameters,

    signature,

    order,
  });
}