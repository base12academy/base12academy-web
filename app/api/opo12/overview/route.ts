import { NextRequest, NextResponse } from "next/server";
import {
  authorizeOpo12Request,
  isOpo12AuthorizationError,
  madridDay,
  opo12PublicProfile,
  secondsUntilMadridMidnight,
} from "@/lib/opo12/server";
import { resolveSubscriptionState } from "@/lib/opo12/subscription";

export async function GET(request: NextRequest) {
  const authorization = await authorizeOpo12Request(request);
  if (isOpo12AuthorizationError(authorization)) return authorization;
  const { supabase, user } = authorization;
  const { data: opposition } = await supabase
    .from("opo12_oppositions")
    .select("id")
    .eq("slug", opo12PublicProfile.slug)
    .maybeSingle();
  if (!opposition) return NextResponse.json({ error: "opposition_unavailable" }, { status: 503 });

  const today = madridDay();
  const [{ data: subscription }, { data: grant }, { data: attempts }, { data: incidents }] = await Promise.all([
    supabase.from("opo12_subscriptions").select("status,paid_through,failed_at,purge_due_at").eq("user_id", user.id).eq("opposition_id", opposition.id).maybeSingle(),
    supabase.from("opo12_access_grants").select("ends_at,reason").eq("user_id", user.id).eq("opposition_id", opposition.id).is("revoked_at", null).lte("starts_at", new Date().toISOString()).or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`).limit(1).maybeSingle(),
    supabase.from("opo12_attempts").select("id,mode,configuration,status,madrid_day,started_at,deadline_at,submitted_at,score,score_snapshot").eq("user_id", user.id).eq("opposition_id", opposition.id).order("started_at", { ascending: false }).limit(30),
    supabase.from("opo12_incidents").select("id,category,status,created_at,resolved_at").eq("user_id", user.id).eq("opposition_id", opposition.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const history = attempts ?? [];
  const activeAttempt = history.find((attempt) => ["preparing", "in_progress"].includes(attempt.status)) ?? null;
  const complimentary = Boolean(grant);
  const resolvedAccess = resolveSubscriptionState(subscription ? {
    status: subscription.status,
    paidThrough: subscription.paid_through,
  } : null, today, complimentary);
  const active = resolvedAccess.state === "active";

  return NextResponse.json({
    profile: opo12PublicProfile,
    access: {
      state: resolvedAccess.state,
      regularizationDaysRemaining: resolvedAccess.regularizationDaysRemaining,
      complimentary,
      paidThrough: subscription?.paid_through ?? null,
      purgeDueAt: subscription?.purge_due_at ?? null,
      canStart: active,
      canViewSolutions: active || Boolean(activeAttempt),
    },
    includedModes: ["simulation", "topic", "review"],
    usage: { unlimitedAttempts: true, madridDay: today, dayEndsInSeconds: secondsUntilMadridMidnight() },
    activeAttempt,
    history: history.filter((attempt) => !["preparing", "in_progress"].includes(attempt.status)),
    incidents: incidents ?? [],
  });
}
