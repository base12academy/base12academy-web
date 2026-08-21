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
        {
          ok: false,
          error: "missing_signing_key",
        },
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
        {
          ok: false,
          error: "missing_params",
        },
        { status: 400 }
      );
    }

    /*
     * Conservamos el sistema de verificación
     * que ya utilizaba la notificación Redsys.
     */
    if (dsSignatureVersion !== "HMAC_SHA512_V2") {
      console.error(
        "Versión de firma Redsys no admitida:",
        dsSignatureVersion
      );

      return NextResponse.json(
        {
          ok: false,
          error: "invalid_signature_version",
        },
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
        {
          ok: false,
          error: "missing_order",
        },
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
        {
          ok: false,
          error: "invalid_signature",
        },
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

    const checkoutId =
      merchantData?.checkoutId || "";

    const catalogSlug = (
      merchantData?.catalogSlug ||
      merchantData?.courseSlug ||
      ""
    ) as CourseSlug;

    const course = courses[catalogSlug];

    const amount = Number(
      decoded.Ds_Amount ||
        decoded.DS_AMOUNT ||
        0
    );

    const currency =
      decoded.Ds_Currency ||
      decoded.DS_CURRENCY ||
      "978";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    /*
     * Conservamos también un registro contable
     * del intento de pago. Todavía no existe
     * user_id porque el alumno se dará de alta
     * después del pago.
     */
    const { error: paymentError } =
      await supabase
        .from("pagos")
        .upsert(
          {
            user_id: null,
            order_id: String(order),

            course_slug:
              course && "courseSlug" in course
                ? course.courseSlug
                : catalogSlug,

            amount,
            currency,

            status: approved
              ? "paid"
              : "denied",

            response_code:
              Number(dsResponse),

            redsys_signature_version:
              dsSignatureVersion,

            merchant_data:
              merchantData,

            redsys_raw:
              decoded,

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
        {
          ok: false,
          error: "payment_record_failed",
        },
        { status: 500 }
      );
    }

    /*
     * A partir de aquí la referencia principal
     * es checkout_orders, no el usuario.
     */
    if (!checkoutId) {
      console.error(
        "Notificación Redsys sin checkoutId",
        merchantData
      );

      return NextResponse.json(
        {
          ok: false,
          error: "missing_checkout",
        },
        { status: 400 }
      );
    }

    const {
      data: checkoutOrder,
      error: checkoutError,
    } = await supabase
      .from("checkout_orders")
      .select(
        "id, order_id, catalog_slug, amount_cents, status, linked_user_id"
      )
      .eq("id", checkoutId)
      .eq("order_id", String(order))
      .single();

    if (
      checkoutError ||
      !checkoutOrder
    ) {
      console.error(
        "No se ha encontrado el pedido previo",
        checkoutError
      );

      return NextResponse.json(
        {
          ok: false,
          error: "checkout_not_found",
        },
        { status: 400 }
      );
    }

    /*
     * Comprobamos que el producto que vuelve
     * de Redsys sea el mismo que se preparó.
     */
    if (
      checkoutOrder.catalog_slug !==
      catalogSlug
    ) {
      console.error(
        "El producto Redsys no coincide con el pedido",
        {
          checkout:
            checkoutOrder.catalog_slug,
          received:
            catalogSlug,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          error: "product_mismatch",
        },
        { status: 400 }
      );
    }

    if (
      amount !==
      checkoutOrder.amount_cents
    ) {
      console.error(
        "Importe Redsys no coincide con el pedido",
        {
          received:
            amount,
          expected:
            checkoutOrder.amount_cents,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          error: "amount_mismatch",
        },
        { status: 400 }
      );
    }

    const now =
      new Date().toISOString();

    /*
     * Si Redsys deniega el pago, dejamos
     * constancia y termina el proceso.
     */
    if (!approved) {
      const { error: deniedError } =
        await supabase
          .from("checkout_orders")
          .update({
            status: "denied",

            redsys_response_code:
              Number(dsResponse),

            redsys_raw:
              decoded,

            updated_at:
              now,
          })
          .eq(
            "id",
            checkoutOrder.id
          );

      if (deniedError) {
        console.error(
          "No se pudo marcar el pedido como denegado",
          deniedError
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "checkout_update_failed",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
      });
    }

    if (!course) {
      console.error(
        "Pago aprobado para producto desconocido",
        catalogSlug
      );

      return NextResponse.json(
        {
          ok: false,
          error: "unknown_product",
        },
        { status: 400 }
      );
    }

    /*
     * PAGO APROBADO.
     *
     * Todavía NO:
     * - creamos usuario;
     * - creamos matrícula;
     * - creamos perfil;
     * - asignamos contraseña.
     *
     * Solo marcamos el pedido como pagado.
     */
    const {
      error: paidCheckoutError,
    } = await supabase
      .from("checkout_orders")
      .update({
        status:
          checkoutOrder.linked_user_id
            ? "linked"
            : "paid",

        redsys_response_code:
          Number(dsResponse),

        redsys_raw:
          decoded,

        paid_at:
          now,

        updated_at:
          now,
      })
      .eq(
        "id",
        checkoutOrder.id
      );

    if (paidCheckoutError) {
      console.error(
        "No se pudo confirmar el pedido pagado",
        paidCheckoutError
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "checkout_payment_update_failed",
        },
        { status: 500 }
      );
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