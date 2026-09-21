import { NextResponse } from "next/server";
import { generateFinalExam } from "@/lib/exams/generateFinalExam";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({error:"authentication_required"},{status:401});
    const {data:authData,error:authError}=await supabase.auth.getUser(token);
    if(authError||!authData.user)return NextResponse.json({error:"authentication_required"},{status:401});
    const userId=authData.user.id;
    const now=new Date().toISOString();
    const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",userId).eq("course_slug","historia-espana").in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).order("created_at",{ascending:false}).limit(1).maybeSingle();
    if(!enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});

    const {data:profile,error:profileError}=await supabase.from("perfiles").select("temas_activos").eq("user_id",userId).maybeSingle();
    if(profileError)return NextResponse.json({error:profileError.message},{status:500});
    const selectedTopicSlugs:string[]=Array.isArray(profile?.temas_activos)?profile.temas_activos.map((value:unknown)=>String(value)):[];

    if (selectedTopicSlugs.length === 0) {
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
