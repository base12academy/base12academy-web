import { NextRequest, NextResponse } from "next/server";
import { authorizeTropaRequest, isTropaAuthorizationError } from "@/lib/tropa-access";

type ProgressRow = {
  aptitude_slug: string;
  correct: boolean;
  answered_at: string;
};

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, user, access } = authorization;
  const { data, error } = await supabase
    .from("trop_question_attempts")
    .select("aptitude_slug, correct, answered_at")
    .eq("user_id", user.id)
    .in("aptitude_slug", access.aptitudeSlugs)
    .order("answered_at", { ascending: false })
    .limit(10_000);
  if (error) {
    console.error("No se pudo leer el progreso TROP", error);
    return NextResponse.json({ error: "progress_unavailable" }, { status: 503 });
  }

  const byAptitude = Object.fromEntries(access.aptitudeSlugs.map((slug) => [slug, {
    answered: 0,
    correct: 0,
    accuracy: 0,
    lastAnsweredAt: null as string | null,
  }]));
  for (const row of (data ?? []) as ProgressRow[]) {
    const progress = byAptitude[row.aptitude_slug];
    if (!progress) continue;
    progress.answered += 1;
    if (row.correct) progress.correct += 1;
    if (!progress.lastAnsweredAt) progress.lastAnsweredAt = row.answered_at;
  }
  for (const progress of Object.values(byAptitude)) {
    progress.accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;
  }
  const totalAnswered = Object.values(byAptitude).reduce((sum, item) => sum + item.answered, 0);
  const totalCorrect = Object.values(byAptitude).reduce((sum, item) => sum + item.correct, 0);
  return NextResponse.json({
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    byAptitude,
  });
}
