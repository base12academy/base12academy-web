import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import {
  hashTrainingGiftCode,
  normalizeTrainingGiftCode,
  trainingGiftErrorMessage,
} from "@/lib/training-gift";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });

  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  const user = authData.user;
  if (authError || !user?.email) {
    return NextResponse.json({ error: "La sesión no es válida." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const code = normalizeTrainingGiftCode(body.code);
  if (!code) return NextResponse.json({ error: "El enlace de regalo no es válido." }, { status: 400 });
  if (body.termsAccepted !== true || body.privacyAcknowledged !== true) {
    return NextResponse.json(
      { error: "Debes aceptar las condiciones y confirmar que has leído la política de privacidad." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("redeem_training_gift", {
    p_code_hash: hashTrainingGiftCode(code),
    p_user_id: user.id,
    p_user_email: user.email,
    p_user_agent: req.headers.get("user-agent"),
  });

  if (error || !data?.[0]) {
    console.error("No se pudo canjear la invitación de Base12 Training", error);
    const message = trainingGiftErrorMessage(error?.message);
    const status = error?.message?.includes("redeemed") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({
    ok: true,
    alreadyRedeemed: data[0].already_redeemed,
    redeemedCount: data[0].redeemed_count,
    remainingCount: data[0].remaining_count,
    accessUrl: "/apps/base12-training",
  });
}
