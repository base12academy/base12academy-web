import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getShortQuestionsByTopic } from "@/lib/exams/getShortQuestions";
import { gradeShorts } from "@/lib/exams/gradeShorts";
import { gradeDevelopment } from "@/lib/exams/gradeDevelopment";
import { getShortFileSlug } from "@/lib/exams/getShortFileSlug";
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

    const {data:profile,error:profileError}=await supabase.from("perfiles").select("temas_activos").eq("user_id",userId).maybeSingle();
    if(profileError)return NextResponse.json({error:profileError.message},{status:500});
    const selectedTopicSlugs:string[]=Array.isArray(profile?.temas_activos)?profile.temas_activos.map((value:unknown)=>String(value)):[];
    const topicSlug = body.topicSlug || "";
    const shortAnswers = body.shortAnswers || {};
    const shortQuestionIds:string[]=Array.isArray(body.shortQuestionIds)?body.shortQuestionIds.map((value:unknown)=>String(value)):[];
    const sourceAnswer = body.sourceAnswer || "";
    const sourceId = String(body.sourceId || "");
    const developmentAnswer = body.developmentAnswer || "";

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

    if(!selectedTopicSlugs.includes(String(topicSlug)))return NextResponse.json({error:"Tema de desarrollo no permitido"},{status:400});
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

    const selectedShortQuestions=shortQuestionIds.map((id:string)=>shortQuestionsPool.find((q:any)=>q.id===id)).filter(Boolean);
    if(selectedShortQuestions.length!==5||new Set(shortQuestionIds).size!==5){
      return NextResponse.json({error:"Preguntas cortas no válidas"},{status:400});
    }

    const shortResult = gradeShorts(shortAnswers, selectedShortQuestions);

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
          examType: "final",
          selectedTopicSlugs,
          topicSlug,
          shortQuestionIds,
          shortAnswers,
          sourceAnswer,
          sourceId,
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

    const commonScore=Math.max(0,Math.min(100,Math.round((total/10)*100)));
    const {error:learningError}=await supabase.from("course_learning_events").insert({
      user_id:userId,enrollment_id:courseEnrollment.id,course_slug:"historia-espana",content_id:"final-exam",event_type:"assessment_submitted",progress_percent:commonScore,
      metadata:{activityType:"legacy_final_exam",attemptId:String(attemptData.id),topicSlug,passed,score:Number(total.toFixed(2)),maxScore:10},occurred_at:new Date().toISOString()
    });
    if(learningError)console.error("No se pudo registrar el examen final en el progreso común",learningError);

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
