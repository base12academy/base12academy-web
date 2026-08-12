import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  decodeMerchantParameters,
  createNotifySignature,
  normalizeSignature,
  safeEqual,
} from "@/lib/redsys";
import { courses, type CourseSlug } from "@/lib/courses";

function isApproved(dsResponse?: string) {
  const code = Number(dsResponse);
  return Number.isFinite(code) && code >= 0 && code < 100;
}

function decodeMerchantData(value?: string) {
  if (!value) return null;

  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const signingKey = process.env.REDSYS_SIGNING_KEY;

    if (!signingKey) {
      console.error("Falta REDSYS_SIGNING_KEY");
      return NextResponse.json(
        { ok: false, error: "missing_signing_key" },
        { status: 500 }
      );
    }

    const formData = await req.formData();

    const dsSignatureVersion =
      formData.get("Ds_SignatureVersion")?.toString() || "";

    const dsMerchantParameters =
      formData.get("Ds_MerchantParameters")?.toString() || "";

    const dsSignature =
      formData.get("Ds_Signature")?.toString() || "";

    if (
      !dsSignatureVersion ||
      !dsMerchantParameters ||
      !dsSignature
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_params" },
        { status: 400 }
      );
    }

    if (dsSignatureVersion !== "HMAC_SHA512_V2") {
      console.error(
        "Versión de firma Redsys no admitida:",
        dsSignatureVersion
      );

      return NextResponse.json(
        { ok: false, error: "invalid_signature_version" },
        { status: 400 }
      );
    }

    const decoded =
      decodeMerchantParameters(dsMerchantParameters);

    const order =
      decoded.Ds_Order ||
      decoded.Ds_Merchant_Order ||
      decoded.DS_ORDER ||
      decoded.DS_MERCHANT_ORDER ||
      "";

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "missing_order" },
        { status: 400 }
      );
    }

    const expectedSignature =
      createNotifySignature(
        dsMerchantParameters,
        String(order),
        signingKey
      );

    const validSignature = safeEqual(
      normalizeSignature(expectedSignature),
      normalizeSignature(dsSignature)
    );

    if (!validSignature) {
      console.error("Firma Redsys no válida");

      return NextResponse.json(
        { ok: false, error: "invalid_signature" },
        { status: 400 }
      );
    }

    const dsResponse =
      decoded.Ds_Response?.toString() ||
      decoded.DS_RESPONSE?.toString();

    const approved = isApproved(dsResponse);

    const merchantData = decodeMerchantData(
      decoded.Ds_MerchantData ||
      decoded.DS_MERCHANTDATA
    );

    const userId = merchantData?.userId;

    const catalogSlug = (
      merchantData?.catalogSlug ||
      merchantData?.courseSlug ||
      ""
    ) as CourseSlug;

    const course = courses[catalogSlug];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (!userId) {
      console.error(
        "Pago recibido sin userId",
        merchantData
      );
    }

    const amount =
      Number(
        decoded.Ds_Amount ||
        decoded.DS_AMOUNT ||
        0
      );

    const currency =
      decoded.Ds_Currency ||
      decoded.DS_CURRENCY ||
      "978";

    const { error: paymentError } =
      await supabase
        .from("pagos")
        .upsert(
          {
            user_id: userId || null,
            order_id: String(order),
            course_slug:
              course && "courseSlug" in course
                ? course.courseSlug
                : catalogSlug,
            amount,
            currency,
            status: approved ? "paid" : "denied",
            response_code: Number(dsResponse),
            redsys_signature_version:
              dsSignatureVersion,
            merchant_data: merchantData,
            redsys_raw: decoded,
            paid_at: approved
              ? new Date().toISOString()
              : null,
          },
          {
            onConflict: "order_id",
          }
        );

    if (paymentError) {
      console.error(
        "No se pudo registrar el pago",
        paymentError
      );

      return NextResponse.json(
        { ok: false, error: "payment_record_failed" },
        { status: 500 }
      );
    }

    if (!approved) {
      return NextResponse.json({ ok: true });
    }

    if (!userId) {
      console.error(
        "Pago aprobado pero sin userId"
      );

      return NextResponse.json(
        { ok: false, error: "missing_user" },
        { status: 400 }
      );
    }

    if (!course) {
      console.error(
        "Pago aprobado para producto desconocido",
        catalogSlug
      );

      return NextResponse.json(
        { ok: false, error: "unknown_product" },
        { status: 400 }
      );
    }

    if (
      course.priceInCents != null &&
      amount !== course.priceInCents
    ) {
      console.error(
        "Importe Redsys no coincide con el curso",
        {
          received: amount,
          expected: course.priceInCents,
        }
      );

      return NextResponse.json(
        { ok: false, error: "amount_mismatch" },
        { status: 400 }
      );
    }

    const {
      data: acceptance,
      error: acceptanceError,
    } = await supabase
      .from("contract_acceptances")
      .select(
        "id, immediate_access_requested, withdrawal_acknowledged"
      )
      .eq("id", merchantData?.consentId || "")
      .eq("order_id", String(order))
      .eq("user_id", userId)
      .single();

    if (acceptanceError || !acceptance) {
      console.error(
        "Pago aprobado sin evidencia contractual válida",
        acceptanceError
      );

      return NextResponse.json(
        {
          ok: false,
          error: "missing_contract_evidence",
        },
        { status: 500 }
      );
    }

    const paidAt = new Date();

    const immediateAccess =
      acceptance.immediate_access_requested &&
      acceptance.withdrawal_acknowledged;

    const startsAt = new Date(paidAt);

    if (!immediateAccess) {
      startsAt.setUTCDate(
        startsAt.getUTCDate() + 14
      );
    }

    const accessMonths =
      "accessMonths" in course
        ? course.accessMonths
        : null;

    const expiresAt = accessMonths
      ? new Date(startsAt)
      : null;

    if (
      expiresAt &&
      accessMonths !== null
    ) {
      expiresAt.setUTCMonth(
        expiresAt.getUTCMonth() +
          accessMonths
      );
    }

    const enrollment = {
      user_id: userId,
      course_slug:
        "courseSlug" in course
          ? course.courseSlug
          : course.slug,
      plan_slug:
        "planSlug" in course
          ? course.planSlug
          : "standard",
      status: immediateAccess
        ? "active"
        : "pending",
      starts_at: startsAt.toISOString(),
      expires_at:
        expiresAt?.toISOString() || null,
      payment_order_id: String(order),
      amount_cents: amount,
      consent_id: acceptance.id,
      metadata: {
        catalogSlug,
        immediateAccess,
      },
      updated_at: paidAt.toISOString(),
    };

    const { error: enrollmentError } =
      await supabase
        .from("course_enrollments")
        .upsert(enrollment, {
          onConflict:
            "user_id,course_slug,plan_slug",
        });

    if (enrollmentError) {
      console.error(
        "No se pudo activar la matrícula",
        enrollmentError
      );

      return NextResponse.json(
        {
          ok: false,
          error: "enrollment_failed",
        },
        { status: 500 }
      );
    }

    await supabase
      .from("contract_acceptances")
      .update({
        payment_confirmed_at:
          paidAt.toISOString(),
      })
      .eq("id", acceptance.id);

    if (immediateAccess) {
      await supabase
        .from("perfiles")
        .update({ acceso: true })
        .eq("user_id", userId);
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Error en notify Redsys:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: "server_error",
      },
      { status: 500 }
    );
  }
}
