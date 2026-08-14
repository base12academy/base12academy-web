import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

type OnboardingStep =
  | "communications_video"
  | "personal_data"
  | "billing"
  | "planning"
  | "telegram"
  | "vb01"
  | "vb02"
  | "vb03";

async function getAuthenticatedUser(req: Request) {
  const token = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Debes iniciar sesión" },
        { status: 401 }
      ),
    };
  }

  const supabase = getSupabase();

  const { data, error } =
    await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      error: NextResponse.json(
        { error: "Sesión no válida" },
        { status: 401 }
      ),
    };
  }

  return {
    supabase,
    user: data.user,
  };
}

async function getCurrentEnrollment(
  supabase: ReturnType<typeof getSupabase>,
  userId: string
) {
  /*
   * Primero buscamos un onboarding pendiente.
   * Así, si el alumno abandona el proceso,
   * continuará con la misma matrícula.
   */
  const {
    data: existingProgress,
    error: progressError,
  } = await supabase
    .from("onboarding_progress")
    .select("enrollment_id, current_step")
    .eq("user_id", userId)
    .neq("current_step", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (progressError) {
    throw progressError;
  }

  if (existingProgress?.enrollment_id) {
    const { data: enrollment, error } =
      await supabase
        .from("course_enrollments")
        .select(
          "id, user_id, course_slug, plan_slug, status, payment_order_id, created_at"
        )
        .eq("id", existingProgress.enrollment_id)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (enrollment) {
      return {
        enrollment,
        currentStep: existingProgress.current_step,
      };
    }
  }

  /*
   * Si todavía no existe onboarding_progress,
   * utilizamos la matrícula más reciente.
   */
  const { data: enrollment, error } =
    await supabase
      .from("course_enrollments")
      .select(
        "id, user_id, course_slug, plan_slug, status, payment_order_id, created_at"
      )
      .eq("user_id", userId)
      .in("status", ["active", "pending"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!enrollment) {
    return null;
  }

  const { error: insertProgressError } =
    await supabase
      .from("onboarding_progress")
      .upsert(
        {
          enrollment_id: enrollment.id,
          user_id: userId,
          current_step: "communications_video",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "enrollment_id",
        }
      );

  if (insertProgressError) {
    throw insertProgressError;
  }

  return {
    enrollment,
    currentStep: "communications_video",
  };
}

/*
 * GET
 *
 * Devuelve la matrícula y el estado actual
 * del onboarding del alumno.
 */
export async function GET(req: Request) {
  try {
    const auth = await getAuthenticatedUser(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabase, user } = auth;

    const current = await getCurrentEnrollment(
      supabase,
      user.id
    );

    if (!current) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado una matrícula activa para este usuario",
        },
        { status: 404 }
      );
    }

    const [
      personalResult,
      billingResult,
      planningResult,
      telegramResult,
    ] = await Promise.all([
      supabase
        .from("student_profiles")
        .select(
          "full_name, contact_email, phone"
        )
        .eq("user_id", user.id)
        .maybeSingle(),

      supabase
        .from("billing_profiles")
        .select(
          `
          billing_type,
          nominative_invoice,
          billing_name,
          tax_id,
          address,
          postal_code,
          city,
          province,
          country,
          billing_email
        `
        )
        .eq("user_id", user.id)
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .maybeSingle(),

      supabase
        .from("study_plans")
        .select(
          `
          study_days,
          study_time,
          session_duration_minutes,
          exam_date,
          exam_place,
          objective,
          timezone,
          reminder_30_minutes,
          reminder_5_minutes
        `
        )
        .eq("user_id", user.id)
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .maybeSingle(),

      supabase
        .from("telegram_users")
        .select(
          "telegram_user_id, username, linked_at"
        )
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    return NextResponse.json({
      enrollment: current.enrollment,
      currentStep: current.currentStep,

      personal:
        personalResult.data ?? null,

      billing:
        billingResult.data ?? null,

      planning:
        planningResult.data ?? null,

      telegram: {
        linked: Boolean(telegramResult.data),
        data: telegramResult.data ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Error cargando onboarding",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudo cargar el onboarding",
      },
      { status: 500 }
    );
  }
}

/*
 * POST
 *
 * Guarda cada uno de los pasos del onboarding.
 */
export async function POST(req: Request) {
  try {
    const auth = await getAuthenticatedUser(req);

    if ("error" in auth) {
      return auth.error;
    }

    const { supabase, user } = auth;

    const current = await getCurrentEnrollment(
      supabase,
      user.id
    );

    if (!current) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado una matrícula activa",
        },
        { status: 404 }
      );
    }

    const body = await req
      .json()
      .catch(() => ({}));

    const step =
      body?.step as OnboardingStep;

    const now =
      new Date().toISOString();

    /*
     * VÍDEO GENERAL DE COMUNICACIONES
     */
    if (step === "communications_video") {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          communications_video_completed_at:
            now,
          current_step: "personal_data",
          updated_at: now,
        })
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      return NextResponse.json({
        ok: true,
        nextStep: "personal_data",
      });
    }

    /*
     * DATOS PERSONALES
     */
    if (step === "personal_data") {
      const fullName =
        String(body?.fullName ?? "").trim();

      const contactEmail =
        String(
          body?.email ??
            user.email ??
            ""
        ).trim();

      const phone =
        String(body?.phone ?? "").trim();

      if (
        !fullName ||
        !contactEmail ||
        !phone
      ) {
        return NextResponse.json(
          {
            error:
              "Completa nombre, correo y teléfono",
          },
          { status: 400 }
        );
      }

      const { error: profileError } =
        await supabase
          .from("student_profiles")
          .upsert(
            {
              user_id: user.id,
              full_name: fullName,
              contact_email:
                contactEmail,
              phone,
              updated_at: now,
            },
            {
              onConflict: "user_id",
            }
          );

      if (profileError) {
        throw profileError;
      }

      const { error: progressError } =
        await supabase
          .from("onboarding_progress")
          .update({
            personal_data_completed_at:
              now,
            current_step: "billing",
            updated_at: now,
          })
          .eq(
            "enrollment_id",
            current.enrollment.id
          )
          .eq("user_id", user.id);

      if (progressError) {
        throw progressError;
      }

      return NextResponse.json({
        ok: true,
        nextStep: "billing",
      });
    }

    /*
     * FACTURACIÓN
     */
    if (step === "billing") {
      const nominativeInvoice =
        body?.nominativeInvoice !== false;

      const billingType =
        body?.billingType === "empresa"
          ? "empresa_autonomo"
          : "particular";

      const billingName =
        String(
          body?.billingName ?? ""
        ).trim();

      const taxId =
        String(body?.taxId ?? "").trim();

      const address =
        String(
          body?.address ?? ""
        ).trim();

      const postalCode =
        String(
          body?.postalCode ?? ""
        ).trim();

      const city =
        String(body?.city ?? "").trim();

      const province =
        String(
          body?.province ?? ""
        ).trim();

      const country =
        String(
          body?.country ?? "España"
        ).trim();

      const billingEmail =
        String(
          body?.billingEmail ??
            user.email ??
            ""
        ).trim();

      if (
        nominativeInvoice &&
        (
          !billingName ||
          !taxId ||
          !address ||
          !postalCode ||
          !city ||
          !billingEmail
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Completa los datos necesarios para la factura",
          },
          { status: 400 }
        );
      }

      const { error: billingError } =
        await supabase
          .from("billing_profiles")
          .upsert(
            {
              user_id: user.id,
              enrollment_id:
                current.enrollment.id,

              billing_type:
                billingType,

              nominative_invoice:
                nominativeInvoice,

              billing_name:
                nominativeInvoice
                  ? billingName
                  : null,

              tax_id:
                nominativeInvoice
                  ? taxId
                  : null,

              address:
                nominativeInvoice
                  ? address
                  : null,

              postal_code:
                nominativeInvoice
                  ? postalCode
                  : null,

              city:
                nominativeInvoice
                  ? city
                  : null,

              province:
                nominativeInvoice
                  ? province || null
                  : null,

              country:
                nominativeInvoice
                  ? country
                  : "España",

              billing_email:
                nominativeInvoice
                  ? billingEmail
                  : null,

              updated_at: now,
            },
            {
              onConflict:
                "user_id,enrollment_id",
            }
          );

      if (billingError) {
        throw billingError;
      }

      const { error: progressError } =
        await supabase
          .from("onboarding_progress")
          .update({
            billing_completed_at: now,
            current_step: "planning",
            updated_at: now,
          })
          .eq(
            "enrollment_id",
            current.enrollment.id
          )
          .eq("user_id", user.id);

      if (progressError) {
        throw progressError;
      }

      return NextResponse.json({
        ok: true,
        nextStep: "planning",
      });
    }

    /*
     * PLANIFICACIÓN DE FERNANDO
     */
    if (step === "planning") {
      const rawStudyDays =
        body?.studyDays;

      let studyDays: string[] = [];

      if (Array.isArray(rawStudyDays)) {
        studyDays = rawStudyDays
          .map((day) =>
            String(day).trim()
          )
          .filter(Boolean);
      } else {
        studyDays = String(
          rawStudyDays ?? ""
        )
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean);
      }

      const studyTime =
        String(
          body?.studyTime ?? ""
        ).trim();

      const sessionDurationMinutes =
        Number(
          body?.sessionDurationMinutes ??
            body?.sessionDuration ??
            0
        );

      const examDate =
        body?.examDate
          ? String(body.examDate)
          : null;

      const examPlace =
        String(
          body?.examPlace ?? ""
        ).trim() || null;

      const objective =
        String(
          body?.objective ?? ""
        ).trim() || null;

      if (
        studyDays.length === 0 ||
        !studyTime ||
        !Number.isFinite(
          sessionDurationMinutes
        ) ||
        sessionDurationMinutes <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Indica tus días, horario y duración habitual de estudio",
          },
          { status: 400 }
        );
      }

      const { error: planningError } =
        await supabase
          .from("study_plans")
          .upsert(
            {
              user_id: user.id,
              enrollment_id:
                current.enrollment.id,

              study_days: studyDays,
              study_time: studyTime,

              session_duration_minutes:
                Math.round(
                  sessionDurationMinutes
                ),

              exam_date: examDate,
              exam_place: examPlace,
              objective,

              timezone: "Europe/Madrid",

              reminder_30_minutes: true,
              reminder_5_minutes: true,

              updated_at: now,
            },
            {
              onConflict:
                "user_id,enrollment_id",
            }
          );

      if (planningError) {
        throw planningError;
      }

      const { error: progressError } =
        await supabase
          .from("onboarding_progress")
          .update({
            planning_completed_at: now,
            current_step: "telegram",
            updated_at: now,
          })
          .eq(
            "enrollment_id",
            current.enrollment.id
          )
          .eq("user_id", user.id);

      if (progressError) {
        throw progressError;
      }

      return NextResponse.json({
        ok: true,
        nextStep: "telegram",
      });
    }

    /*
     * COMPROBAR VINCULACIÓN TELEGRAM
     */
    if (step === "telegram") {
      const {
        data: telegramUser,
        error: telegramError,
      } = await supabase
        .from("telegram_users")
        .select(
          "telegram_user_id, linked_at"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (telegramError) {
        throw telegramError;
      }

      if (!telegramUser) {
        return NextResponse.json(
          {
            error:
              "La cuenta de Telegram todavía no está vinculada",
            linked: false,
          },
          { status: 409 }
        );
      }

      const { error: progressError } =
        await supabase
          .from("onboarding_progress")
          .update({
            telegram_linked_at:
              telegramUser.linked_at ??
              now,
            current_step: "vb01",
            updated_at: now,
          })
          .eq(
            "enrollment_id",
            current.enrollment.id
          )
          .eq("user_id", user.id);

      if (progressError) {
        throw progressError;
      }

      return NextResponse.json({
        ok: true,
        linked: true,
        nextStep: "vb01",
      });
    }

    /*
     * VÍDEOS POST-ONBOARDING
     */
    if (step === "vb01") {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          vb01_completed_at: now,
          current_step: "vb02",
          updated_at: now,
        })
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .eq("user_id", user.id);

      if (error) throw error;

      return NextResponse.json({
        ok: true,
        nextStep: "vb02",
      });
    }

    if (step === "vb02") {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          vb02_completed_at: now,
          current_step: "vb03",
          updated_at: now,
        })
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .eq("user_id", user.id);

      if (error) throw error;

      return NextResponse.json({
        ok: true,
        nextStep: "vb03",
      });
    }

    if (step === "vb03") {
      const { error } = await supabase
        .from("onboarding_progress")
        .update({
          vb03_completed_at: now,
          current_step: "completed",
          completed_at: now,
          updated_at: now,
        })
        .eq(
          "enrollment_id",
          current.enrollment.id
        )
        .eq("user_id", user.id);

      if (error) throw error;

      return NextResponse.json({
        ok: true,
        nextStep: "completed",
      });
    }

    return NextResponse.json(
      {
        error:
          "Paso de onboarding no válido",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Error guardando onboarding",
      error
    );

    return NextResponse.json(
      {
        error:
          "No se pudieron guardar los datos",
      },
      { status: 500 }
    );
  }
}
