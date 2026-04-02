import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  decodeMerchantParameters,
  createNotifySignature,
  normalizeSignature,
  safeEqual,
} from "@/lib/redsys";

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
    course_slug: merchantData?.courseSlug || "historia-espana",
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
    await supabase
      .from("perfiles")
      .update({ acceso: true })
      .eq("user_id", userId);
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