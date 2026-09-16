import { NextRequest, NextResponse } from "next/server";
import { publicCallFields } from "@/lib/oppositions";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function clean(value: string | null, max = 100) {
  return (value ?? "")
    .replace(/[%_,().]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const q = clean(params.get("q"));
    const territory = clean(params.get("territory"));
    const administration = clean(params.get("administration"));
    const category = clean(params.get("category"));
    const group = clean(params.get("group"), 30);
    const status = clean(params.get("status"), 40);
    const deadline = clean(params.get("deadline"), 30);
    const date = clean(params.get("date"), 10);
    const limit = Math.min(Math.max(Number(params.get("limit")) || 60, 1), 100);
    const supabase = getSupabase();

    let query = supabase
      .from("opposition_calls")
      .select(publicCallFields)
      .eq("active", true)
      .order("publication_date", { ascending: false })
      .limit(limit);

    if (q) {
      query = query.or(
        `title.ilike.%${q}%,organisation.ilike.%${q}%,specialty.ilike.%${q}%,province.ilike.%${q}%,locality.ilike.%${q}%`
      );
    }
    if (territory) query = query.ilike("territory", `%${territory}%`);
    if (administration) query = query.ilike("administration", `%${administration}%`);
    if (category) query = query.ilike("specialty", `%${category}%`);
    if (group) query = query.ilike("group_category", `%${group}%`);
    if (status) query = query.ilike("status", `%${status}%`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) query = query.gte("publication_date", date);

    const today = new Date().toISOString().slice(0, 10);
    if (deadline === "abierto") {
      query = query.lte("application_start", today).gte("application_end", today);
    } else if (deadline === "proximo") {
      query = query.gt("application_start", today);
    } else if (deadline === "cerrado") {
      query = query.lt("application_end", today);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ calls: data ?? [] });
  } catch (error) {
    console.error("Error consultando Banco de Opositores", error);
    const message = error instanceof Error
      ? error.message
      : error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message)
        : String(error);
    if (/opposition_calls|schema cache|does not exist/i.test(message)) {
      return NextResponse.json({ calls: [], pending: true });
    }
    return NextResponse.json(
      { error: "No se pudieron consultar las convocatorias." },
      { status: 500 }
    );
  }
}
