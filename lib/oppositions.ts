import { getSupabase } from "@/lib/supabase/server";

export type OppositionCall = {
  id: string;
  source_id: string;
  source_external_id: string;
  slug: string;
  title: string;
  summary: string | null;
  organisation: string | null;
  administration: string | null;
  territory: string;
  province: string | null;
  locality: string | null;
  group_category: string | null;
  specialty: string | null;
  vacancies: number | null;
  access_system: string | null;
  status: string;
  publication_date: string;
  application_start: string | null;
  application_end: string | null;
  exam_date: string | null;
  official_syllabus_included: boolean | null;
  official_url: string;
  application_url: string | null;
  bulletin_name: string;
  bulletin_identifier: string | null;
  base12_course_slug: string | null;
  last_official_update: string;
};

export type OppositionPublication = {
  id: string;
  external_id: string;
  publication_type: string;
  publication_date: string;
  bulletin_name: string;
  bulletin_identifier: string | null;
  official_url: string;
  official_pdf_url: string | null;
  change_summary: string;
  relevance: "informativa" | "relevante" | "critica";
  detected_at: string;
};

export const territoryPages = [
  { slug: "estado", label: "Estado", values: ["España", "Estado"] },
  { slug: "andalucia", label: "Andalucía", values: ["Andalucía"] },
  { slug: "madrid", label: "Madrid", values: ["Madrid"] },
  {
    slug: "valencia",
    label: "Comunitat Valenciana",
    values: ["Comunitat Valenciana", "Valencia"],
  },
] as const;

export const publicCallFields = [
  "id",
  "source_id",
  "source_external_id",
  "slug",
  "title",
  "summary",
  "organisation",
  "administration",
  "territory",
  "province",
  "locality",
  "group_category",
  "specialty",
  "vacancies",
  "access_system",
  "status",
  "publication_date",
  "application_start",
  "application_end",
  "exam_date",
  "official_syllabus_included",
  "official_url",
  "application_url",
  "bulletin_name",
  "bulletin_identifier",
  "base12_course_slug",
  "last_official_update",
].join(",");

export function formatOfficialDate(value: string | null) {
  if (!value) return "No indicado en la publicación oficial";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(`${value}T12:00:00+02:00`));
}

export function applicationStatus(call: OppositionCall) {
  if (!call.application_start || !call.application_end) {
    return {
      label: "Plazo no indicado",
      tone: "neutral" as const,
    };
  }

  const now = new Date();
  const start = new Date(`${call.application_start}T00:00:00+01:00`);
  const end = new Date(`${call.application_end}T23:59:59+01:00`);

  if (now < start) return { label: "Próxima apertura", tone: "next" as const };
  if (now > end) return { label: "Inscripción cerrada", tone: "closed" as const };
  return { label: "Inscripción abierta", tone: "open" as const };
}

export async function getLatestOppositionCalls(limit = 60) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("opposition_calls")
      .select(publicCallFields)
      .eq("active", true)
      .order("publication_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as unknown as OppositionCall[];
  } catch (error) {
    console.warn("Banco de Opositores aún no disponible", error);
    return [];
  }
}

export async function getTerritoryOppositionCalls(values: readonly string[], limit = 80) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("opposition_calls")
      .select(publicCallFields)
      .eq("active", true)
      .in("territory", [...values])
      .order("publication_date", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as OppositionCall[];
  } catch (error) {
    console.warn("No se pudo consultar el territorio", error);
    return [];
  }
}

export async function getOppositionCall(slug: string) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("opposition_calls")
      .select(publicCallFields)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const { data: publications, error: publicationsError } = await supabase
      .from("opposition_publications")
      .select(
        "id,external_id,publication_type,publication_date,bulletin_name,bulletin_identifier,official_url,official_pdf_url,change_summary,relevance,detected_at"
      )
      .eq("call_id", (data as unknown as { id: string }).id)
      .order("publication_date", { ascending: true })
      .order("detected_at", { ascending: true });

    if (publicationsError) throw publicationsError;

    return {
      call: data as unknown as OppositionCall,
      publications: (publications ?? []) as OppositionPublication[],
    };
  } catch (error) {
    console.warn("No se pudo consultar la convocatoria", error);
    return null;
  }
}

export function missingOfficialValue(value: string | number | null | undefined) {
  return value === null || value === undefined || value === ""
    ? "No indicado en la publicación oficial"
    : String(value);
}
