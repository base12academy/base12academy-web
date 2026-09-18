import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { generateBlockExam } from "@/lib/exams/generateBlockExam";

export async function POST(req: Request) {
  try {
    const supabase=getSupabase();
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
    if(!token)return NextResponse.json({error:"authentication_required"},{status:401});
    const {data:authData,error:authError}=await supabase.auth.getUser(token);
    if(authError||!authData.user)return NextResponse.json({error:"authentication_required"},{status:401});
    const userId=authData.user.id;

    const body = await req.json();

    const blockId = body.blockId;
    const selectedTopicSlugs = body.selectedTopicSlugs || [];

    if (!blockId) {
      return NextResponse.json(
        { error: "Falta blockId" },
        { status: 400 }
      );
    }

    if (!Array.isArray(selectedTopicSlugs) || selectedTopicSlugs.length === 0) {
      return NextResponse.json(
        { error: "Faltan selectedTopicSlugs" },
        { status: 400 }
      );
    }

    const now=new Date().toISOString();
    const {data:enrollment}=await supabase.from("course_enrollments").select("id").eq("user_id",userId).eq("course_slug","historia-espana").in("status",["active","pending"]).lte("starts_at",now).or("expires_at.is.null,expires_at.gte."+now).limit(1).maybeSingle();
    if(!enrollment)return NextResponse.json({error:"matriculation_required"},{status:403});

    const exam = await generateBlockExam({
      blockId,
      selectedTopicSlugs,
    });

    return NextResponse.json(exam);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}