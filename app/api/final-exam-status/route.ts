import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Falta userId" },
        { status: 400 }
      );
    }

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