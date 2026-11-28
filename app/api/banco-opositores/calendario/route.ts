import { NextRequest, NextResponse } from "next/server";
import { oppositionTerritories } from "@/lib/opposition-geography";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? "";
  const territory = request.nextUrl.searchParams.get("territory") ?? "";
  if (!/^20\d\d-(?:0[1-9]|1[012])$/.test(month)) {
    return NextResponse.json({ error: "Mes no válido." }, { status: 400 });
  }
  const [year, monthNumber] = month.split("-").map(Number);
  const start = `${month}-01`;
  const end = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);

  const fields = ["application_start", "application_end", "exam_date"];
  let query = getSupabase().from("opposition_calls")
    .select("id,slug,title,application_start,application_end,exam_date")
    .eq("active", true)
    .neq("status", "anulada")
    .or(fields.map(field => `and(${field}.gte.${start},${field}.lt.${end})`).join(","))
    .order("id");
  if (territory === "España" || oppositionTerritories.some(([name]) => name === territory)) {
    query = query.eq("territory", territory);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "No se pudo cargar el calendario." }, { status: 500 });
  return NextResponse.json({ calls: data ?? [] });
}
