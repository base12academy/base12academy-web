import { supabase } from "@/lib/supabase/server";

export async function getSourceGradingConfig(
  sourceType: "image" | "text",
  sourceId: string
) {
  const { data, error } = await supabase
    .from("source_grading_configs")
    .select("config")
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .single();

  if (error || !data) {
    throw new Error("No se encontró la rúbrica de la fuente");
  }

  return data.config;
}