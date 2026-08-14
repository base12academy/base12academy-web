import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hashCheckoutToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function generateTemporaryPassword() {
  return `B12!${crypto
    .randomBytes(14)
    .toString("base64url")}`;
}

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let createdUserId: string | null = null;

  try {
    const body = await request.json().catch(() => ({}));

    const checkoutToken =
      typeof body?.checkout === "string"
        ? body.checkout.trim()
        : "";

    const fullName =
      typeof body?.fullName === "string"
        ? body.fullName.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const phone =
      typeof body?.phone === "string"
        ? body.phone.trim()
        : "";

    if (!checkoutToken) {
      return NextResponse.json(
        { error: "Falta la referencia de compra." },
        { status: 400 }
      );
    }

    if (fullName.length < 3) {
      return NextResponse.json(
        {
          error:
            "Indica tu nombre y apellidos.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          error:
            "Indica un correo electrónico válido.",
        },
        { status: 400 }
      );
    }

    if (phone.length < 6) {
      return NextResponse.json(
        {
          error:
            "Indica un número de móvil válido.",
        },
        { status: 400 }
      );
    }

    const {
      data: checkout,
      error: checkoutError,
    } = await supabase
      .from("checkout_orders")
      .select(
        `
          id,
          order_id,
          status,
          catalog_slug,
          course_slug,
          plan_slug,
          access_months,
          amount_cents,
          legal_version,
          terms_accepted,
          privacy_acknowledged,
          immediate_access_requested,
          withdrawal_acknowledged,
          marketing_consent,
          contract_snapshot,
          ip_hash,
          user_agent,
          paid_at,
          communications_video_completed_at,
          linked_user_id,
          contract_acceptance_id
        `
      )
      .eq(
        "checkout_token_hash",
        hashCheckoutToken(checkoutToken)
      )
      .maybeSingle();

    if (checkoutError) {
      throw checkoutError;
    }

    if (!checkout) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado la compra.",
        },
        { status: 404 }
      );
    }

    if (
      checkout.status !== "paid" &&
      checkout.status !== "linked"
    ) {
      return NextResponse.json(
        {
          error:
            "El pago todavía no está confirmado.",
        },
        { status: 409 }
      );
    }

    if (
      !checkout.communications_video_completed_at
    ) {
      return NextResponse.json(
        {
          error:
            "La bienvenida inicial todavía no está completada.",
        },
        { status: 409 }
      );
    }

    /*
     * Si el pedido ya está vinculado,
     * no puede reclamarse con otra cuenta.
     */
    if (
      checkout.status === "linked" &&
      checkout.linked_user_id
    ) {
      return NextResponse.json(
        {
          error:
            "Esta compra ya está vinculada a una cuenta.",
          code: "ALREADY_LINKED",
        },
        { status: 409 }
      );
    }

    /*
     * Si viene una sesión autenticada,
     * utilizamos esa cuenta existente.
     *
     * Si no, creamos una cuenta nueva
     * con contraseña provisional.
     */
    const accessToken =
      getBearerToken(request);

    let userId: string;
    let temporaryPassword: string | null = null;
    let newAccount = false;

    if (accessToken) {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(
        accessToken
      );

      if (authError || !user) {
        return NextResponse.json(
          {
            error:
              "La sesión no es válida.",
          },
          { status: 401 }
        );
      }

      const authenticatedEmail =
        user.email?.toLowerCase() ?? "";

      if (authenticatedEmail !== email) {
        return NextResponse.json(
          {
            error:
              "El correo indicado no coincide con la cuenta iniciada.",
          },
          { status: 400 }
        );
      }

      userId = user.id;
    } else {
      temporaryPassword =
        generateTemporaryPassword();

      const {
        data: createdUser,
        error: createUserError,
      } =
        await supabase.auth.admin.createUser({
          email,
          password: temporaryPassword,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone,
          },
        });

      if (
        createUserError ||
        !createdUser.user
      ) {
        const message =
          createUserError?.message?.toLowerCase() ??
          "";

        if (
          message.includes("already") ||
          message.includes("registered") ||
          message.includes("exists")
        ) {
          return NextResponse.json(
            {
              error:
                "Ya existe una cuenta de Base12 con este correo. Introduce la contraseña de esa cuenta para vincular la compra.",
              code: "ACCOUNT_EXISTS",
            },
            { status: 409 }
          );
        }

        console.error(
          "No se pudo crear el usuario",
          createUserError
        );

        return NextResponse.json(
          {
            error:
              "No se pudo crear la cuenta de alumno.",
          },
          { status: 500 }
        );
      }

      userId = createdUser.user.id;
      createdUserId = userId;
      newAccount = true;
    }

    const now = new Date();

    /*
     * Evidencia contractual:
     * ahora puede asociarse al usuario.
     */
    let acceptanceId =
      checkout.contract_acceptance_id;

    if (!acceptanceId) {
      const {
        data: acceptance,
        error: acceptanceError,
      } = await supabase
        .from("contract_acceptances")
        .insert({
          user_id: userId,
          order_id: checkout.order_id,
          catalog_slug:
            checkout.catalog_slug,
          legal_version:
            checkout.legal_version,
          terms_accepted:
            checkout.terms_accepted,
          privacy_acknowledged:
            checkout.privacy_acknowledged,
          immediate_access_requested:
            checkout.immediate_access_requested,
          withdrawal_acknowledged:
            checkout.withdrawal_acknowledged,
          marketing_consent:
            checkout.marketing_consent,
          contract_snapshot:
            checkout.contract_snapshot,
          ip_hash:
            checkout.ip_hash,
          user_agent:
            checkout.user_agent,
          payment_confirmed_at:
            checkout.paid_at ??
            now.toISOString(),
        })
        .select("id")
        .single();

      if (
        acceptanceError ||
        !acceptance
      ) {
        throw acceptanceError ??
          new Error(
            "No se pudo crear la evidencia contractual."
          );
      }

      acceptanceId = acceptance.id;
    }

    /*
     * Perfil básico del alumno.
     */
    const { error: profileError } =
      await supabase
        .from("student_profiles")
        .upsert(
          {
            user_id: userId,
            full_name: fullName,
            contact_email: email,
            phone,
            updated_at:
              now.toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

    if (profileError) {
      throw profileError;
    }

    /*
     * Fecha real de activación.
     */
    const immediateAccess =
      checkout.immediate_access_requested &&
      checkout.withdrawal_acknowledged;

    const startsAt =
      new Date(now);

    if (!immediateAccess) {
      startsAt.setUTCDate(
        startsAt.getUTCDate() + 14
      );
    }

    const expiresAt =
      checkout.access_months
        ? new Date(startsAt)
        : null;

    if (
      expiresAt &&
      checkout.access_months
    ) {
      expiresAt.setUTCMonth(
        expiresAt.getUTCMonth() +
          checkout.access_months
      );
    }

    /*
     * Matrícula.
     */
    const {
      data: enrollment,
      error: enrollmentError,
    } = await supabase
      .from("course_enrollments")
      .upsert(
        {
          user_id: userId,

          course_slug:
            checkout.course_slug,

          plan_slug:
            checkout.plan_slug,

          status:
            immediateAccess
              ? "active"
              : "pending",

          starts_at:
            startsAt.toISOString(),

          expires_at:
            expiresAt?.toISOString() ??
            null,

          payment_order_id:
            checkout.order_id,

          amount_cents:
            checkout.amount_cents,

          consent_id:
            acceptanceId,

          metadata: {
            catalogSlug:
              checkout.catalog_slug,
            immediateAccess,
            checkoutId:
              checkout.id,
          },

          updated_at:
            now.toISOString(),
        },
        {
          onConflict:
            "user_id,course_slug,plan_slug",
        }
      )
      .select("id")
      .single();

    if (
      enrollmentError ||
      !enrollment
    ) {
      throw enrollmentError ??
        new Error(
          "No se pudo crear la matrícula."
        );
    }

    /*
     * El alta ya equivale al paso
     * de datos personales.
     * El siguiente paso será Facturación.
     */
    const {
      error: progressError,
    } = await supabase
      .from("onboarding_progress")
      .upsert(
        {
          enrollment_id:
            enrollment.id,

          user_id:
            userId,

          current_step:
            "billing",

          communications_video_completed_at:
            checkout.communications_video_completed_at,

          personal_data_completed_at:
            now.toISOString(),

          updated_at:
            now.toISOString(),
        },
        {
          onConflict:
            "enrollment_id",
        }
      );

    if (progressError) {
      throw progressError;
    }

    /*
     * Asociamos también el pago
     * al usuario definitivo.
     */
    const { error: paymentLinkError } =
      await supabase
        .from("pagos")
        .update({
          user_id:
            userId,
        })
        .eq(
          "order_id",
          checkout.order_id
        );

    if (paymentLinkError) {
      throw paymentLinkError;
    }

    /*
     * Cerramos el pedido anónimo.
     */
    const {
      error: checkoutLinkError,
    } = await supabase
      .from("checkout_orders")
      .update({
        status: "linked",

        linked_user_id:
          userId,

        contract_acceptance_id:
          acceptanceId,

        linked_at:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .eq(
        "id",
        checkout.id
      );

    if (checkoutLinkError) {
      throw checkoutLinkError;
    }

    /*
     * Compatibilidad con el control
     * de acceso que ya existía.
     */
    if (immediateAccess) {
      const {
        error: legacyProfileError,
      } = await supabase
        .from("perfiles")
        .update({
          acceso: true,
        })
        .eq(
          "user_id",
          userId
        );

      if (legacyProfileError) {
        console.error(
          "No se pudo actualizar perfiles.acceso",
          legacyProfileError
        );
      }
    }

    createdUserId = null;

    return NextResponse.json({
      ok: true,
      newAccount,
      email,
      temporaryPassword,
      nextStep: "billing",
    });
  } catch (error) {
    /*
     * Si se creó un usuario nuevo pero
     * falló la vinculación posterior,
     * evitamos dejar una cuenta huérfana.
     */
    if (createdUserId) {
      try {
        await supabase.auth.admin.deleteUser(
          createdUserId
        );
      } catch (cleanupError) {
        console.error(
          "No se pudo limpiar el usuario incompleto",
          cleanupError
        );
      }
    }

    console.error(
      "Error vinculando compra y alumno",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo completar el alta del alumno.",
      },
      { status: 500 }
    );
  }
}