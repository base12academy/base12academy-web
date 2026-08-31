import { NextRequest, NextResponse } from "next/server";
import {
  authorizeTropaRequest,
  canAccessTropaAptitude,
  isTropaAuthorizationError,
} from "@/lib/tropa-access";
import {
  isTropaAptitudeSlug,
  tropaPlanAccess,
  type TropaPlanSlug,
} from "@/lib/tropa-config";

const planOrder: TropaPlanSlug[] = ["esencial", "operativa", "integral"];

export async function GET(request: NextRequest) {
  const authorization = await authorizeTropaRequest(request);
  if (isTropaAuthorizationError(authorization)) return authorization;
  const { supabase, access } = authorization;
  const aptitudeSlug = request.nextUrl.searchParams.get("aptitude") ?? "";
  if (!isTropaAptitudeSlug(aptitudeSlug)) {
    return NextResponse.json({ error: "invalid_aptitude" }, { status: 400 });
  }
  if (!canAccessTropaAptitude(access, aptitudeSlug)) {
    return NextResponse.json({ error: "aptitude_not_allowed" }, { status: 403 });
  }

  const requestedMotor = request.nextUrl.searchParams.get("motor");
  if (requestedMotor && !access.availableMotors.includes(requestedMotor as never)) {
    return NextResponse.json({ error: "motor_not_allowed" }, { status: 403 });
  }
  const requestedLevel = Number(request.nextUrl.searchParams.get("level") || 0);
  if (requestedLevel && (!Number.isInteger(requestedLevel) || requestedLevel < 1 || requestedLevel > 5)) {
    return NextResponse.json({ error: "invalid_level" }, { status: 400 });
  }
  const limit = Math.min(25, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 10)));
  const allowedAccess = access.planSlug
    ? planOrder.filter((plan) => tropaPlanAccess[plan].rank <= tropaPlanAccess[access.planSlug!].rank)
    : planOrder;

  let countQuery = supabase
    .from("trop_questions")
    .select("question_id", { count: "exact", head: true })
    .eq("active", true)
    .eq("aptitude_slug", aptitudeSlug)
    .in("access_min", allowedAccess);
  if (requestedMotor) countQuery = countQuery.eq("motor_code", requestedMotor);
  if (requestedLevel) countQuery = countQuery.eq("level", requestedLevel);
  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error("No se pudo contar el banco TROP", countError);
    return NextResponse.json({ error: "question_bank_unavailable" }, { status: 503 });
  }
  if (!count) return NextResponse.json({ questions: [], totalAvailable: 0 });

  const offset = Math.floor(Math.random() * Math.max(1, count - limit + 1));
  let questionQuery = supabase
    .from("trop_questions")
    .select("question_id, aptitude_slug, motor_code, family_id, level, prompt, options, stimulus")
    .eq("active", true)
    .eq("aptitude_slug", aptitudeSlug)
    .in("access_min", allowedAccess)
    .order("question_id")
    .range(offset, Math.min(count - 1, offset + limit - 1));
  if (requestedMotor) questionQuery = questionQuery.eq("motor_code", requestedMotor);
  if (requestedLevel) questionQuery = questionQuery.eq("level", requestedLevel);
  const { data, error } = await questionQuery;
  if (error) {
    console.error("No se pudo leer el banco TROP", error);
    return NextResponse.json({ error: "question_bank_unavailable" }, { status: 503 });
  }

  return NextResponse.json({ questions: data ?? [], totalAvailable: count });
}
