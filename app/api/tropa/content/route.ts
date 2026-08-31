import { NextRequest, NextResponse } from "next/server";
import {
  authorizeTropaRequest,
  canAccessTropaAptitude,
  isTropaAuthorizationError,
} from "@/lib/tropa-access";
import { isTropaAptitudeSlug, tropaAptitudes } from "@/lib/tropa-config";

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

  const aptitude = tropaAptitudes.find((item) => item.slug === aptitudeSlug)!;
  const blockCode = `B${tropaAptitudes.findIndex((item) => item.slug === aptitudeSlug) + 1}`;
  const transversalBlocks = ["B0", "B8", "B9", "B10"];
  const [workshopResult, microResult, videoResult] = await Promise.all([
    supabase
      .from("trop_workshops")
      .select("workshop_id, block_code, block_name, title, resource_kind, bank_coverage_status")
      .in("block_code", [blockCode, ...transversalBlocks])
      .eq("active", true)
      .order("workshop_id"),
    supabase
      .from("trop_microtemarios")
      .select("micro_id, motor_code, factor_name, game_name, success_feedback, correct_sequence, main_tip, action_after_success, action_after_error")
      .in("motor_code", [...aptitude.motors])
      .eq("active", true)
      .order("micro_id"),
    supabase
      .from("trop_videos")
      .select("video_id, video_type, section_code, source_name, display_order, youtube_url")
      .in("section_code", [aptitude.code, "G00", "WELCOME", "CLOSING"])
      .eq("active", true)
      .order("display_order"),
  ]);
  const initialError = workshopResult.error || microResult.error || videoResult.error;
  if (initialError) {
    console.error("No se pudo leer el contenido pedagógico TROP", initialError);
    return NextResponse.json({ error: "content_unavailable" }, { status: 503 });
  }

  const workshops = workshopResult.data ?? [];
  const microtemarios = microResult.data ?? [];
  const workshopIds = workshops.map((item) => item.workshop_id);
  const microIds = microtemarios.map((item) => item.micro_id);
  const [workshopContentResult, microContentResult, linkResult, errorResult, gameResult] = await Promise.all([
    workshopIds.length
      ? supabase.from("trop_workshop_contents").select("*").in("workshop_id", workshopIds)
      : Promise.resolve({ data: [], error: null }),
    microIds.length
      ? supabase.from("trop_microtemario_contents").select("micro_id, full_text, content_json").in("micro_id", microIds)
      : Promise.resolve({ data: [], error: null }),
    microIds.length
      ? supabase.from("trop_microtemario_laminas").select("micro_id, lamina_id").in("micro_id", microIds)
      : Promise.resolve({ data: [], error: null }),
    microIds.length
      ? supabase.from("trop_error_patterns").select("micro_id, error_code, error_type, detection_rule, failure_feedback, correction_sequence, resource_codes").in("micro_id", microIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("trop_game_configs")
      .select("motor_code, micro_id, game_name, config_json")
      .in("motor_code", [...aptitude.motors])
      .eq("active", true),
  ]);
  const relatedError = workshopContentResult.error || microContentResult.error || linkResult.error
    || errorResult.error || gameResult.error;
  if (relatedError) {
    console.error("No se pudieron leer los recursos relacionados TROP", relatedError);
    return NextResponse.json({ error: "content_unavailable" }, { status: 503 });
  }

  const laminaIds = [...new Set((linkResult.data ?? []).map((item) => item.lamina_id))];
  const laminaResult = laminaIds.length
    ? await supabase.from("trop_laminas").select("lamina_id, factor_name, title, priority, status, format").in("lamina_id", laminaIds)
    : { data: [], error: null };
  if (laminaResult.error) {
    console.error("No se pudieron leer las láminas TROP", laminaResult.error);
    return NextResponse.json({ error: "content_unavailable" }, { status: 503 });
  }

  const workshopContents = new Map((workshopContentResult.data ?? []).map((item) => [item.workshop_id, item]));
  const microContents = new Map((microContentResult.data ?? []).map((item) => [item.micro_id, item]));
  return NextResponse.json({
    aptitude: { slug: aptitude.slug, code: aptitude.code, name: aptitude.name },
    workshops: workshops.map((item) => ({ ...item, content: workshopContents.get(item.workshop_id) ?? null })),
    microtemarios: microtemarios.map((item) => ({ ...item, content: microContents.get(item.micro_id) ?? null })),
    laminas: laminaResult.data ?? [],
    laminaLinks: linkResult.data ?? [],
    errorPatterns: errorResult.data ?? [],
    games: (gameResult.data ?? []).map((game) => ({
      ...game,
      available: access.availableMotors.includes(game.motor_code),
    })),
    videos: videoResult.data ?? [],
  });
}
