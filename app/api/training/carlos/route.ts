import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { authorizeTrainingRequest, isTrainingAuthorizationError } from "@/lib/training-access";
import { isTrainingTestSlug, trainingTestMap, type TrainingSex } from "@/lib/training-config";
import { buildLocalTrainingRecommendation } from "@/lib/training-recommendation";

export const dynamic = "force-dynamic";

function safeJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeTrainingRequest(request);
  if (isTrainingAuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const body = await request.json().catch(() => ({}));
  const testSlug = String(body.test || "");
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 800) : "";
  if (!isTrainingTestSlug(testSlug)) return NextResponse.json({ error: "invalid_test" }, { status: 400 });

  const [profileResult, resultsResult, sessionsResult] = await Promise.all([
    supabase.from("training_profiles").select("sex").eq("user_id", user.id).maybeSingle(),
    supabase.from("training_results").select("result_value,perceived_effort,performed_at").eq("user_id", user.id).eq("test_slug", testSlug).order("performed_at", { ascending: false }).limit(8),
    supabase.from("training_sessions").select("completed_at").eq("user_id", user.id).eq("test_slug", testSlug).order("completed_at", { ascending: false }).limit(20),
  ]);

  const sex = profileResult.data?.sex as TrainingSex | undefined;
  if (sex !== "male" && sex !== "female") return NextResponse.json({ error: "profile_required" }, { status: 409 });

  const results = (resultsResult.data ?? []).map((row) => ({ result_value: Number(row.result_value), perceived_effort: row.perceived_effort, performed_at: row.performed_at }));
  const latestDate = results[0]?.performed_at ? new Date(results[0].performed_at).getTime() : 0;
  const sessionsSinceControl = (sessionsResult.data ?? []).filter((row) => new Date(row.completed_at).getTime() > latestDate).length;
  const fallback = buildLocalTrainingRecommendation({ testSlug, sex, results, sessionsSinceControl });
  const test = trainingTestMap[testSlug];

  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback, mode: "verified-local" });

  const allowed = test.exercises.map((exercise) => ({ slug: exercise.slug, name: exercise.name, defaultDose: exercise.defaultDose }));
  const context = {
    test: test.name,
    direction: test.direction,
    officialTarget: test.official[sex],
    recentResults: results,
    sessionsSinceControl,
    verifiedFallback: fallback,
    allowedExercises: allowed,
  };

  if (question) {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        answer: `Para ${test.name}, trabaja únicamente los ejercicios indicados en tu plan y registra una nueva marca después de ${fallback.sessionsBeforeControl} sesiones específicas. Si notas dolor, detén el ejercicio y consulta a un profesional sanitario.`,
        mode: "verified-local",
      });
    }

    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.create({
        model: process.env.OPENAI_TRAINING_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "Eres Carlos, entrenador IA de Base12 Training. Responde en español y de forma breve exclusivamente sobre flexiones, plancha, carrera de 2000 m, circuito de agilidad y sus entrenamientos. Tu prioridad es aclarar el nombre correcto de los ejercicios, para qué sirven dentro de la prueba elegida y cómo encajan en la sesión. Usa exactamente los nombres del repertorio permitido recibido en el contexto: no inventes, renombres ni añadas ejercicios. Rechaza amablemente cualquier pregunta que no trate sobre estas pruebas físicas o sus entrenamientos. No diagnostiques lesiones ni prescribas nutrición o medicación. Si hay dolor, lesión, mareo o síntomas, indica que se detenga el ejercicio y consulte a un profesional sanitario. No sustituyes a un entrenador presencial ni a un profesional sanitario.",
          },
          { role: "user", content: JSON.stringify({ question, context }) },
        ],
      });
      const answer = response.output_text.trim().slice(0, 1400);
      return NextResponse.json({ answer: answer || "No he podido preparar una respuesta. Prueba a formular la pregunta de otra manera.", mode: "openai" });
    } catch (error) {
      console.error("No se pudo consultar el chat de Carlos IA", error);
      return NextResponse.json({
        answer: `Para ${test.name}, sigue la sesión propuesta y evita repetir un esfuerzo máximo sin recuperación. Si notas dolor, detén el ejercicio y consulta a un profesional sanitario.`,
        mode: "verified-local",
      });
    }
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_TRAINING_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "Eres Carlos, entrenador IA de Base12 Training. Tu ámbito exclusivo son cuatro pruebas físicas de Tropa y Marinería: flexiones, plancha, carrera 2000 m y agilidad. Debes usar únicamente los ejercicios permitidos que recibes. No inventes ejercicios, no modifiques la marca oficial, no diagnostiques lesiones, no prescribas nutrición, medicación ni entrenamiento ajeno a estas pruebas. Si el alumno menciona dolor o lesión, limita la respuesta a recomendar que detenga el ejercicio y consulte a un profesional sanitario. Devuelve SOLO JSON válido con estas claves: message (string breve en español), target (number), exercises (array de 2 a 4 objetos {slug,dose}), sessionsBeforeControl (integer 1-4). El objetivo debe mantener una progresión razonable y nunca empeorar deliberadamente la marca.",
        },
        { role: "user", content: JSON.stringify(context) },
      ],
    });
    const parsed = safeJson(response.output_text);
    if (!parsed) return NextResponse.json({ ...fallback, mode: "verified-local" });

    const allowedMap = new Map(allowed.map((exercise) => [exercise.slug, exercise]));
    const exercises = Array.isArray(parsed.exercises)
      ? parsed.exercises.slice(0, 4).map((item: { slug?: unknown; dose?: unknown }) => {
          const slug = String(item?.slug || "");
          const source = allowedMap.get(slug);
          if (!source) return null;
          const dose = String(item?.dose || source.defaultDose).slice(0, 40);
          return { slug, name: source.name, dose };
        }).filter(Boolean)
      : [];
    const target = Number(parsed.target);
    const targetSafe = Number.isFinite(target) && target > 0
      && (test.direction === "higher_is_better" ? target >= (results[0]?.result_value ?? 0) : target <= (results[0]?.result_value ?? Number.POSITIVE_INFINITY))
      ? target
      : fallback.target;
    const sessionsBeforeControl = Math.min(4, Math.max(1, Number(parsed.sessionsBeforeControl) || fallback.sessionsBeforeControl));
    const message = String(parsed.message || fallback.message).trim().slice(0, 420) || fallback.message;

    return NextResponse.json({
      ...fallback,
      message,
      target: targetSafe,
      exercises: exercises.length >= 2 ? exercises : fallback.exercises,
      sessionsBeforeControl,
      mode: "openai",
    });
  } catch (error) {
    console.error("No se pudo consultar Carlos IA", error);
    return NextResponse.json({ ...fallback, mode: "verified-local" });
  }
}
