import { NextResponse } from "next/server";
import { generateFinalExam } from "@/lib/exams/generateFinalExam";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = body.userId;
    const selectedTopicSlugs = body.selectedTopicSlugs || [];

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

    const { data: progress, error: progressError } = await supabase
      .from("final_exam_progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    const attemptsCount = Number(progress?.attempts_count || 0);
    const passedCount = Number(progress?.passed_count || 0);
    const fullyCompleted = Boolean(progress?.fully_completed);

    const blocked = fullyCompleted || passedCount >= 3 || attemptsCount >= 6;

    if (blocked) {
      return NextResponse.json({
        blocked: true,
        redirectTo: "/exam-strategy",
        attemptsCount,
        passedCount,
        fullyCompleted,
      });
    }

    const exam = await generateFinalExam({
      selectedTopicSlugs,
    });

    return NextResponse.json({
      blocked: false,
      ...exam,
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