import { supabase } from "@/lib/supabase/server";

export async function getExamSource(sourceId: string) {
  const { data, error } = await supabase
    .from("exam_sources")
    .select("*")
    .eq("source_id", sourceId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new Error("No se encontró la fuente");
  }

  return data;
}