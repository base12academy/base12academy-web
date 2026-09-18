import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    const token=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
        if(!token)return NextResponse.json({error:"authentication_required"},{status:401});
        const {data:authData,error:authError}=await supabase.auth.getUser(token);
        if(authError||!authData.user)return NextResponse.json({error:"authentication_required"},{status:401});
        const userId=authData.user.id;
    

    const { data, error } = await supabase
      .from("final_exam_progress")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const attempts = Number(data?.attempts_count || 0);
    const passed = Number(data?.passed_count || 0);
    const completed = Boolean(data?.fully_completed);

    const blocked = completed || passed >= 3 || attempts >= 6;

    return NextResponse.json({
      blocked,
      attempts,
      passed,
      completed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
