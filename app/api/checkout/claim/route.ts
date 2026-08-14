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

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatEuro(amountCents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);
}

function planName(planSlug: string) {
  if (planSlug === "esencial") {
    return "Competencias Digitales";
  }

  if (planSlug === "estandar") {
    return "Ofim├ítica";
  }

  if (planSlug === "premium") {
    return "Productividad Digital e IA";
  }

  return planSlug;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

type ConfirmationEmailInput = {
  email: string;
  fullName: string;
  orderId: string;
  planSlug: string;
  amountCents: number;
  accessMonths: number | null;
  immediateAccess: boolean;
  startsAt: Date;
  expiresAt: Date | null;
  termsAccepted: boolean;
  privacyAcknowledged: boolean;
  withdrawalAcknowledged: boolean;
  marketingConsent: boolean;
};

async function sendPurchaseConfirmation(
  input: ConfirmationEmailInput
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "Correo de confirmaci├│n no enviado: faltan RESEND_API_KEY o RESEND_FROM_EMAIL."
    );
    return false;
  }

  const accessName = planName(input.planSlug);
  const price = formatEuro(input.amountCents);
  const activationText = input.immediateAccess
    ? "Acceso inmediato solicitado y habilitado."
    : `El acceso de pago se activar├í el ${formatDate(input.startsAt)}.`;

  const expirationText = input.expiresAt
    ? ` hasta el ${formatDate(input.expiresAt)}`
    : "";

  const durationText = input.accessMonths
    ? `${input.accessMonths} meses${expirationText}`
    : "Seg├║n las condiciones del acceso contratado";

  const subject =
    `Confirmaci├│n de contrataci├│n ┬À ${accessName} ┬À Base12 Academy`;

  const text = [
    `Hola ${input.fullName},`,
    "",
    "Tu contrataci├│n en Base12 Academy ha quedado registrada correctamente.",
    "",
    "RESUMEN DE LA CONTRATACI├ôN",
    "Curso: Competencias, Productividad, Ofim├ítica e IA",
    `Acceso: ${accessName}`,
    `Importe pagado: ${price}`,
    `Referencia del pedido: ${input.orderId}`,
    `Duraci├│n del acceso: ${durationText}`,
    `Activaci├│n: ${activationText}`,
    "",
    "ACEPTACIONES REGISTRADAS",
    `Condiciones de contrataci├│n y normas de uso: ${input.termsAccepted ? "Aceptadas" : "No aceptadas"}`,
    `Pol├¡tica de privacidad: ${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}`,
    `Inicio inmediato: ${input.immediateAccess ? "Solicitado" : "No solicitado"}`,
    `Conocimiento de las consecuencias del inicio inmediato: ${input.withdrawalAcknowledged ? "Confirmado" : "No aplicable / no confirmado"}`,
    `Comunicaciones comerciales opcionales: ${input.marketingConsent ? "Aceptadas" : "No aceptadas"}`,
    "",
    "TU CUENTA",
    `Correo de acceso: ${input.email}`,
    "Por seguridad, Base12 Academy no env├¡a contrase├▒as por correo electr├│nico.",
    "Puedes acceder a tu cuenta desde https://base12academy.es/login",
    "",
    "Durante el alta completar├ís los datos de facturaci├│n, tu planificaci├│n con Fernando, la vinculaci├│n con Telegram y los v├¡deos de bienvenida.",
    "",
    "Conserva este correo junto con la referencia del pedido.",
    "",
    "Base12 Academy",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#172033;line-height:1.55">
      <div style="padding:24px 0 18px;border-bottom:1px solid #e5e7eb">
        <div style="font-size:22px;font-weight:800;color:#0b4fc2">Base12 Academy</div>
      </div>

      <div style="padding:26px 0">
        <p>Hola ${escapeHtml(input.fullName)},</p>

        <p>
          Tu contrataci├│n en Base12 Academy ha quedado registrada correctamente.
          Este correo resume la operaci├│n y las aceptaciones asociadas a tu pedido.
        </p>

        <h2 style="font-size:18px;margin-top:28px">Resumen de la contrataci├│n</h2>

        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#64748b">Curso</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              Competencias, Productividad, Ofim├ítica e IA
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Acceso</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(accessName)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Importe pagado</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(price)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Referencia</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(input.orderId)}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Duraci├│n</td>
            <td style="padding:8px 0;font-weight:700;text-align:right">
              ${escapeHtml(durationText)}
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:14px 16px;background:#eef5ff;border:1px solid #bfdbfe;border-radius:12px;color:#174b8f">
          ${escapeHtml(activationText)}
        </div>

        <h2 style="font-size:18px;margin-top:30px">Aceptaciones registradas</h2>

        <ul style="padding-left:20px">
          <li>Condiciones de contrataci├│n y normas de uso: <strong>${input.termsAccepted ? "Aceptadas" : "No aceptadas"}</strong>.</li>
          <li>Pol├¡tica de privacidad: <strong>${input.privacyAcknowledged ? "Confirmada" : "No confirmada"}</strong>.</li>
          <li>Inicio inmediato: <strong>${input.immediateAccess ? "Solicitado" : "No solicitado"}</strong>.</li>
          <li>Conocimiento de las consecuencias del inicio inmediato: <strong>${input.withdrawalAcknowledged ? "Confirmado" : "No aplicable / no confirmado"}</strong>.</li>
          <li>Comunicaciones comerciales opcionales: <strong>${input.marketingConsent ? "Aceptadas" : "No aceptadas"}</strong>.</li>
        </ul>

        <h2 style="font-size:18px;margin-top:30px">Tu cuenta</h2>

        <p>
          Correo de acceso:
          <strong>${escapeHtml(input.email)}</strong>.
          Por seguridad, Base12 Academy no env├¡a contrase├▒as por correo electr├│nico.
        </p>

        <p>
          <a
            href="https://base12academy.es/login"
            style="display:inline-block;background:#0b4fc2;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px"
          >
            Acceder a Base12 Academy
          </a>
        </p>

        <p style="margin-top:26px;color:#526176">
          Durante el alta completar├ís los datos de facturaci├│n, tu planificaci├│n con Fernando,
          la vinculaci├│n con Telegram y los v├¡deos de bienvenida.
        </p>

        <p style="margin-top:24px">
          Conserva este correo junto con la referencia del pedido.
        </p>
      </div>

      <div style="border-top:1px solid #e5e7eb;padding:18px 0;color:#64748b;font-size:13px">
        Base12 Academy
      </div>
    </div>
  `;

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Base12Academy/1.0",
        "Idempotency-Key": `base12-contract-${input.orderId}`,
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject,
        html,
        text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      "Resend no pudo enviar la confirmaci├│n de contrataci├│n",
      response.status,
      errorText
    );
    return false;
  }

  return true;
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
            "Indica un correo electr├│nico v├ílido.",
        },
        { status: 400 }
      );
    }

    if (phone.length < 6) {
      return NextResponse.json(
        {
          error:
            "Indica un n├║mero de m├│vil v├ílido.",
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
            "El pago todav├¡a no est├í confirmado.",
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
            "La bienvenida inicial todav├¡a no est├í completada.",
        },
        { status: 409 }
      );
    }

    /*
     * Si el pedido ya est├í vinculado,
     * no puede reclamarse con otra cuenta.
     */
    if (
      checkout.status === "linked" &&
      checkout.linked_user_id
    ) {
      return NextResponse.json(
        {
          error:
            "Esta compra ya est├í vinculada a una cuenta.",
          code: "ALREADY_LINKED",
        },
        { status: 409 }
      );
    }

    /*
     * Si viene una sesi├│n autenticada,
     * utilizamos esa cuenta existente.
     *
     * Si no, creamos una cuenta nueva
     * con contrase├▒a provisional.
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
              "La sesi├│n no es v├ílida.",
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
                "Ya existe una cuenta de Base12 con este correo. Introduce la contrase├▒a de esa cuenta para vincular la compra.",
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
     * Perfil b├ísico del alumno.
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
     * Fecha real de activaci├│n.
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
     * Matr├¡cula.
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
          "No se pudo crear la matr├¡cula."
        );
    }

    /*
     * El alta ya equivale al paso
     * de datos personales.
     * El siguiente paso ser├í Facturaci├│n.
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
     * Asociamos tambi├®n el pago
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
     * Cerramos el pedido an├│nimo.
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
     * de acceso que ya exist├¡a.
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

    /*
     * Confirmaci├│n de contrataci├│n y bienvenida.
     *
     * El correo nunca contiene la contrase├▒a.
     * Un fallo del proveedor de correo no bloquea
     * el alta ni deja la compra a medias.
     */
    const confirmationEmailSent =
      await sendPurchaseConfirmation({
        email,
        fullName,
        orderId: checkout.order_id,
        planSlug: checkout.plan_slug,
        amountCents: checkout.amount_cents,
        accessMonths: checkout.access_months,
        immediateAccess,
        startsAt,
        expiresAt,
        termsAccepted:
          checkout.terms_accepted,
        privacyAcknowledged:
          checkout.privacy_acknowledged,
        withdrawalAcknowledged:
          checkout.withdrawal_acknowledged,
        marketingConsent:
          checkout.marketing_consent,
      }).catch((emailError) => {
        console.error(
          "Error enviando confirmaci├│n de contrataci├│n",
          emailError
        );
        return false;
      });

    createdUserId = null;

    return NextResponse.json({
      ok: true,
      newAccount,
      email,
      temporaryPassword,
      nextStep: "billing",
      confirmationEmailSent,
    });
  } catch (error) {
    /*
     * Si se cre├│ un usuario nuevo pero
     * fall├│ la vinculaci├│n posterior,
     * evitamos dejar una cuenta hu├®rfana.
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
