import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const formData = await req.formData();

  const dsMerchantData = formData.get("Ds_MerchantData")?.toString();
  const dsResponse = formData.get("Ds_Response")?.toString();

  if (dsResponse && parseInt(dsResponse, 10) < 100 && dsMerchantData) {
    try {
      const decoded = JSON.parse(
        Buffer.from(dsMerchantData, "base64").toString("utf8")
      );

      const userId = decoded.userId;

      if (userId) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await supabase
          .from("perfiles")
          .update({ acceso: true })
          .eq("user_id", userId);
      }
    } catch (error) {
      console.error("Error en notify Redsys:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
