import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getShortQuestionsByTopic } from "@/lib/exams/getShortQuestions";
import { gradeShorts } from "@/lib/exams/gradeShorts";
import { gradeDevelopment } from "@/lib/exams/gradeDevelopment";
import { temasHistoria } from "@/lib/temas";
import { getExamSourceById } from "@/lib/exams/sourceCatalog";

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({error:"authentication_required"},{status:401});
    const {data:authData,error:authError}=await supabase.auth.getUser(token);
    if(authError||!authData.user)return NextResponse.json({error:"authentication_required"},{status:401});
    const userId=authData.user.id;
    const body = await req.json();
    const now=new Date().toISOString();
    const {data:courseEnrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",userId).eq("course_slug","historia-espana").in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
    if(!courseEnrollment)return NextResponse.json({error:"matriculation_required"},{status:403});

    const blockId = body.blockId || "bloque_1";
    const topicSlug = body.topicSlug || "tema-3";
    const shortAnswers = body.shortAnswers || {};
    const sourceAnswer = body.sourceAnswer || "";
    const sourceId = String(body.sourceId || "");
    const developmentAnswer = body.developmentAnswer || "";

    const tema = temasHistoria.find((t: any) => t.slug === topicSlug);

    if (!tema) {
      return NextResponse.json(
        { error: "Tema no encontrado" },
        { status: 500 }
      );
    }

    const shortFileSlug = topicSlug.replace("-", "");
    const shortQuestions = getShortQuestionsByTopic(shortFileSlug).slice(0, 5);

    const shortResult = gradeShorts(shortAnswers, shortQuestions);

    const sourceWordCount = sourceAnswer.split(" ").filter(Boolean).length;

const canonicalSource=getExamSourceById(sourceId);
if(!canonicalSource)return NextResponse.json({error:"Fuente no válida"},{status:400});
const sourceGrade=gradeDevelopment(sourceAnswer,canonicalSource.explanation);
const sourceScore=sourceWordCount>=20?Number(Math.min(4,(sourceGrade.score/3)*4).toFixed(2)):0;

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
          topicSlug,
shortAnswers,
sourceAnswer,
sourceId,
developmentAnswer,
        }),
        score: total,
        breakdown: {
          short: shortResult,
          source: sourceResult,
          development: developmentResult,
          passed,
          blockId,
          topicSlug,
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

    const { data: existingProgress, error: existingError } = await supabase
      .from("block_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("block_id", blockId)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    const bestScore = Math.max(
      Number(existingProgress?.best_score || 0),
      Number(total.toFixed(2))
    );

    const examPassed = Boolean(existingProgress?.exam_passed) || passed;

    const attemptsCount = Number(existingProgress?.attempts_count || 0) + 1;

    const { error: progressError } = await supabase
      .from("block_progress")
      .upsert(
        {
          user_id: userId,
          block_id: blockId,
          exam_passed: examPassed,
          best_score: bestScore,
          attempts_count: attemptsCount,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,block_id",
        }
      );

    if (progressError) {
      return NextResponse.json(
        { error: progressError.message },
        { status: 500 }
      );
    }

    const commonScore=Math.max(0,Math.min(100,Math.round((total/10)*100)));
    const {error:learningError}=await supabase.from("course_learning_events").insert({
      user_id:userId,enrollment_id:courseEnrollment.id,course_slug:"historia-espana",content_id:blockId,event_type:"assessment_submitted",progress_percent:commonScore,
      metadata:{activityType:"legacy_block_exam",attemptId:String(attemptData.id),topicSlug,passed,score:Number(total.toFixed(2)),maxScore:10},occurred_at:new Date().toISOString()
    });
    if(learningError)console.error("No se pudo registrar el examen de bloque en el progreso común",learningError);

    return NextResponse.json({
      saved: true,
      attemptId: attemptData.id,
      short: shortResult.scoreOver3,
      source: sourceResult.score,
      development: developmentResult.score,
      total: Number(total.toFixed(2)),
      passed,
      blockUpdated: true,
      attemptsCount,
      bestScore,
    });
  } catch (error: any) {
  console.error("ERROR API:", error);

  return NextResponse.json(
    {
      error: error?.message || "Error desconocido",
      stack: error?.stack,
    },
    { status: 500 }
  );
}
}
