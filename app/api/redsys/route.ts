import { NextResponse } from "next/server";
import crypto from "crypto";
import { courses, type CourseSlug } from "@/lib/courses";
import { getSupabase } from "@/lib/supabase/server";
import { createRedsysSignature, getRedsysCredentials } from "@/lib/redsys";

const LEGAL_VERSION = "2026-08-11";
const REDSYS_SIGNATURE_VERSION = "HMAC_SHA256_V1";

function base64Encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
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
  let credentials;

  try {
    credentials = getRedsysCredentials();
  } catch (error) {
    console.error("Configuración de Redsys no válida", error);
    return NextResponse.json(
      {
        error: "La pasarela de pago no está configurada correctamente",
      },
      { status: 500 }
    );
  }

  const { environment, merchantCode, terminal, signingKey } = credentials;

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


  const isClassBono =
    "accessType" in course &&
    course.accessType === "class_bono";

  const holdId =
    typeof body?.holdId === "string"
      ? body.holdId.trim()
      : "";

  const holdToken =
    typeof body?.holdToken === "string"
      ? body.holdToken.trim()
      : "";

  if (isClassBono && (!holdId || !holdToken)) {
    return NextResponse.json(
      {
        error:
          "Debes seleccionar una hora disponible antes de iniciar el pago.",
      },
      { status: 409 }
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
   * En Clases Online, el pedido queda vinculado a la
   * reserva provisional antes de enviar al alumno a Redsys.
   */
  if (isClassBono) {
    const holdTokenHash = crypto
      .createHash("sha256")
      .update(holdToken)
      .digest("hex");

    const now = new Date().toISOString();

    const {
      data: linkedHold,
      error: holdLinkError,
    } = await supabase
      .from("class_booking_holds")
      .update({
        checkout_order_id: checkoutOrder.id,
        updated_at: now,
      })
      .eq("id", holdId)
      .eq("hold_token_hash", holdTokenHash)
      .eq("status", "held")
      .gt("expires_at", now)
      .select("id")
      .maybeSingle();

    if (holdLinkError || !linkedHold) {
      console.error(
        "No se pudo vincular la reserva provisional",
        holdLinkError
      );

      await supabase
        .from("checkout_orders")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", checkoutOrder.id);

      return NextResponse.json(
        {
          error:
            "La reserva provisional ha caducado o ya no est? disponible. Selecciona otra hora.",
        },
        { status: 409 }
      );
    }
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
    base64Encode(
      JSON.stringify(params)
    );

  let signature: string;

  try {
    signature = createRedsysSignature(
      dsMerchantParameters,
      order,
      signingKey
    );
  } catch (error) {
    console.error("No se pudo firmar la operacion de Redsys", error);

    await supabase
      .from("checkout_orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", checkoutOrder.id);

    return NextResponse.json(
      {
        error:
          "La pasarela de pago no esta configurada correctamente. Intentalo de nuevo mas tarde.",
      },
      { status: 500 }
    );
  }

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
