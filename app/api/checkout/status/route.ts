import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function hashCheckoutToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

async function findCheckout(token: string) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("checkout_orders")
    .select(
      `
        id,
        order_id,
        status,
        catalog_slug,
        course_slug,
        plan_slug,
        amount_cents,
        paid_at,
        linked_user_id,
        communications_video_completed_at
      `
    )
    .eq("checkout_token_hash", hashCheckoutToken(token))
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    const token =
      request.nextUrl.searchParams.get("checkout")?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Falta la referencia de compra" },
        { status: 400 }
      );
    }

    const checkout = await findCheckout(token);

    if (!checkout) {
      return NextResponse.json(
        { error: "No se ha encontrado la compra" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: checkout.status,
      paid: checkout.status === "paid" || checkout.status === "linked",
      linked: checkout.status === "linked",
      catalogSlug: checkout.catalog_slug,
      courseSlug: checkout.course_slug,
      planSlug: checkout.plan_slug,
      communicationsVideoCompleted:
        Boolean(checkout.communications_video_completed_at),
    });
  } catch (error) {
    console.error("Error consultando checkout", error);

    return NextResponse.json(
      { error: "No se pudo comprobar el pago" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const token =
      typeof body?.checkout === "string"
        ? body.checkout.trim()
        : "";

    if (!token) {
      return NextResponse.json(
        { error: "Falta la referencia de compra" },
        { status: 400 }
      );
    }

    const checkout = await findCheckout(token);

    if (!checkout) {
      return NextResponse.json(
        { error: "No se ha encontrado la compra" },
        { status: 404 }
      );
    }

    if (
      checkout.status !== "paid" &&
      checkout.status !== "linked"
    ) {
      return NextResponse.json(
        { error: "El pago todavía no está confirmado" },
        { status: 409 }
      );
    }

    const supabase = getSupabase();

    const { error } = await supabase
      .from("checkout_orders")
      .update({
        communications_video_completed_at:
          new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", checkout.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "Error registrando el vídeo de comunicaciones",
      error
    );

    return NextResponse.json(
      { error: "No se pudo registrar la bienvenida" },
      { status: 500 }
    );
  }
}