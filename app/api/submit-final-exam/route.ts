import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { getShortQuestionsByTopic } from "@/lib/exams/getShortQuestions";
import { gradeShorts } from "@/lib/exams/gradeShorts";
import { gradeDevelopment } from "@/lib/exams/gradeDevelopment";
import { getShortFileSlug } from "@/lib/exams/getShortFileSlug";
import { temasHistoria } from "@/lib/temas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = body.userId;
    const selectedTopicSlugs = body.selectedTopicSlugs || [];
    const topicSlug = body.topicSlug || "";
    const shortAnswers = body.shortAnswers || {};
    const sourceAnswer = body.sourceAnswer || "";
    const sourceExpectedContent = body.sourceExpectedContent || "";
    const developmentAnswer = body.developmentAnswer || "";

    if (!userId) {
      return NextResponse.json(
        { error: "Falta userId" },
        { status: 400 }
      );
    }

    if (!Array.isArray(selectedTopicSlugs) || selectedTopicSlugs.length === 0) {
      return NextResponse.json(
        { error: "Faltan selectedTopicSlugs" },
        { status: 400 }
      );
    }

    const { data: existingProgress, error: existingError } = await supabase
      .from("final_exam_progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    const currentAttempts = Number(existingProgress?.attempts_count || 0);
    const currentPassedCount = Number(existingProgress?.passed_count || 0);

    if (currentAttempts >= 6) {
      return NextResponse.json(
        { error: "Se ha alcanzado el máximo de 6 intentos finales" },
        { status: 400 }
      );
    }

    const tema = temasHistoria.find((t: any) => t.slug === topicSlug);

    if (!tema) {
      return NextResponse.json(
        { error: "Tema de desarrollo no encontrado" },
        { status: 500 }
      );
    }

    const shortQuestionsPool = selectedTopicSlugs.flatMap((slug: string) => {
      const fileSlug = getShortFileSlug(slug);
      return getShortQuestionsByTopic(fileSlug).map((q: any) => ({
        ...q,
        topicSlug: slug,
      }));
    });

    const firstFive = shortQuestionsPool.slice(0, 5);

    if (firstFive.length < 5) {
      return NextResponse.json(
        { error: "No hay suficientes preguntas cortas" },
        { status: 500 }
      );
    }

    const shortResult = gradeShorts(shortAnswers, firstFive);

    const sourceWordCount = sourceAnswer.split(" ").filter(Boolean).length;
    const sourceScore = sourceWordCount >= 20 && sourceExpectedContent ? 4 : 0;

    const sourceResult = {
      score: sourceScore,
      breakdown: {
        recognition: sourceScore > 0 ? 1 : 0,
        context: sourceScore > 0 ? 1 : 0,
        analysis: sourceScore > 0 ? 1 : 0,
        relevance: sourceScore > 0 ? 1 : 0,
      },
      wordCount: sourceWordCount,
    };

    const developmentResult = gradeDevelopment(
      developmentAnswer,
      (tema as any).contenido
    );

    const total =
      shortResult.scoreOver3 +
      sourceResult.score +
      developmentResult.score;

    const passed = total >= 8;

    const { data: attemptData, error: attemptError } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: userId,
        answer: JSON.stringify({
          examType: "final",
          selectedTopicSlugs,
          topicSlug,
          shortAnswers,
          sourceAnswer,
          sourceExpectedContent,
          developmentAnswer,
        }),
        score: total,
        breakdown: {
          examType: "final",
          short: shortResult,
          source: sourceResult,
          development: developmentResult,
          passed,
        },
      })
      .select()
      .single();

    if (attemptError) {
      return NextResponse.json(
        { error: attemptError.message },
        { status: 500 }
      );
    }

    const attemptsCount = currentAttempts + 1;
    const passedCount = passed ? currentPassedCount + 1 : currentPassedCount;
    const fullyCompleted = passedCount >= 3;
    const bestScore = Math.max(
      Number(existingProgress?.best_score || 0),
      Number(total.toFixed(2))
    );

    const { error: progressError } = await supabase
      .from("final_exam_progress")
      .upsert(
        {
          user_id: userId,
          attempts_count: attemptsCount,
          passed_count: passedCount,
          fully_completed: fullyCompleted,
          best_score: bestScore,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved: true,
      attemptId: attemptData.id,
      short: shortResult.scoreOver3,
      source: sourceResult.score,
      development: developmentResult.score,
      total: Number(total.toFixed(2)),
      passed,
      attemptsCount,
      passedCount,
      fullyCompleted,
      bestScore,
    });
    } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}