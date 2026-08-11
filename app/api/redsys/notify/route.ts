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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const dsSignatureVersion =
      formData.get("Ds_SignatureVersion")?.toString() || "";
    const dsMerchantParameters =
      formData.get("Ds_MerchantParameters")?.toString() || "";
    const dsSignature = formData.get("Ds_Signature")?.toString() || "";

    if (!dsSignatureVersion || !dsMerchantParameters || !dsSignature) {
      return NextResponse.json(
        { ok: false, error: "missing_params" },
        { status: 400 }
      );
    }

    const decoded = decodeMerchantParameters(dsMerchantParameters);

    const order =
      decoded.Ds_Order ||
      decoded.Ds_Merchant_Order ||
      "";

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "missing_order" },
        { status: 400 }
      );
    }

    const expectedSignature = createNotifySignature(
      dsMerchantParameters,
      order,
      process.env.REDSYS_SECRET_KEY!
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

    const dsResponse = decoded.Ds_Response?.toString();
    const approved = isApproved(dsResponse);

    let merchantData: any = null;

    try {
      merchantData = decoded.Ds_MerchantData
        ? JSON.parse(decoded.Ds_MerchantData)
        : null;
    } catch (error) {
      console.error("Error parseando Ds_MerchantData:", error);
    }

    const userId = merchantData?.userId;
    const catalogSlug = (merchantData?.catalogSlug ||
      merchantData?.courseSlug ||
      "historia-espana") as CourseSlug;
    const course = courses[catalogSlug];

    const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (!userId) {
  console.error("Pago recibido sin userId", merchantData);
}

// Guardar el pago SIEMPRE
await supabase.from("pagos").upsert(
  {
    user_id: userId || null,
    order_id: order,
    course_slug:
      course && "courseSlug" in course ? course.courseSlug : catalogSlug,
    amount: Number(decoded.Ds_Amount || 0),
    currency: decoded.Ds_Currency || "978",
    status: approved ? "paid" : "denied",
    response_code: Number(dsResponse),
    redsys_signature_version: dsSignatureVersion,
    merchant_data: merchantData,
    redsys_raw: decoded,
    paid_at: approved ? new Date().toISOString() : null,
  },
  {
    onConflict: "order_id",
  }
);

// Activar acceso SOLO si pago aprobado
if (approved) {
  if (userId) {
    if (!course) {
      console.error("Pago aprobado para un producto desconocido", catalogSlug);
      return NextResponse.json(
        { ok: false, error: "unknown_product" },
        { status: 400 }
      );
    }

    const { data: acceptance, error: acceptanceError } = await supabase
      .from("contract_acceptances")
      .select("id, immediate_access_requested, withdrawal_acknowledged")
      .eq("id", merchantData?.consentId || "")
      .eq("order_id", order)
      .eq("user_id", userId)
      .single();

    if (acceptanceError || !acceptance) {
      console.error("Pago aprobado sin evidencia contractual válida", acceptanceError);
      return NextResponse.json(
        { ok: false, error: "missing_contract_evidence" },
        { status: 500 }
      );
    }

    const paidAt = new Date();
    const immediateAccess =
      acceptance.immediate_access_requested && acceptance.withdrawal_acknowledged;
    const startsAt = new Date(paidAt);
    if (!immediateAccess) startsAt.setUTCDate(startsAt.getUTCDate() + 14);
    const accessMonths =
      "accessMonths" in course ? course.accessMonths : null;
    const expiresAt = accessMonths ? new Date(startsAt) : null;
    if (expiresAt && accessMonths !== null) {
      expiresAt.setUTCMonth(expiresAt.getUTCMonth() + accessMonths);
    }

    const enrollment = {
      user_id: userId,
      course_slug:
        "courseSlug" in course ? course.courseSlug : course.slug,
      plan_slug: "planSlug" in course ? course.planSlug : "standard",
      status: immediateAccess ? "active" : "pending",
      starts_at: startsAt.toISOString(),
      expires_at: expiresAt?.toISOString() || null,
      payment_order_id: order,
      amount_cents: Number(decoded.Ds_Amount || 0),
      consent_id: acceptance.id,
      metadata: { catalogSlug, immediateAccess },
      updated_at: paidAt.toISOString(),
    };

    const { error: enrollmentError } = await supabase
      .from("course_enrollments")
      .upsert(enrollment, {
        onConflict: "user_id,course_slug,plan_slug",
      });

    if (enrollmentError) {
      console.error("No se pudo activar la matrícula", enrollmentError);
      return NextResponse.json(
        { ok: false, error: "enrollment_failed" },
        { status: 500 }
      );
    }

    await supabase
      .from("contract_acceptances")
      .update({ payment_confirmed_at: paidAt.toISOString() })
      .eq("id", acceptance.id);

    // Compatibilidad temporal con las pantallas antiguas.
    if (immediateAccess) {
      await supabase
        .from("perfiles")
        .update({ acceso: true })
        .eq("user_id", userId);
    }
  } else {
    console.error("Pago aprobado pero sin userId → acceso no activado");
  }
}

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en notify Redsys:", error);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
