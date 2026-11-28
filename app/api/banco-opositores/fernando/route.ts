import { NextResponse } from "next/server";
import { type OppositionCall } from "@/lib/oppositions";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const stopWords = new Set([
  "estoy", "quiero", "preparando", "preparar", "oposicion", "oposiciones",
  "para", "como", "otras", "puede", "pueden", "interesar", "interesan",
  "tengo", "vivo", "busco", "unas", "unos", "esta", "este", "del", "las",
  "los", "una", "con", "por", "que", "me", "en", "de", "y", "o",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ]+/g, " ")
    .trim();
}

function tokens(value: string) {
  return new Set(
    normalize(value)
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !stopWords.has(word))
  );
}

function sharedWords(left: Set<string>, right: Set<string>) {
  return [...left].filter((word) => right.has(word));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      preparation?: string;
      territory?: string;
      group?: string;
      qualification?: string;
    };
    const preparation = typeof body?.preparation === "string" ? body.preparation.trim().slice(0, 180) : "";
    const territory = typeof body?.territory === "string" ? body.territory.trim().slice(0, 80) : "";
    const group = typeof body?.group === "string" ? body.group.trim().slice(0, 30) : "";

    if (preparation.length < 3) {
      return NextResponse.json(
        { error: "Cuéntame qué oposición o tipo de plaza estás preparando." },
        { status: 400 }
      );
    }

    const goalTokens = tokens(preparation);
    const supabase = getSupabase();
    const { data, error } = goalTokens.size
      ? await supabase.rpc("opposition_orientation_candidates", { search_terms: [...goalTokens].slice(0, 12) })
      : { data: [], error: null };
    if (error) throw error;
    const normalizedTerritory = normalize(territory);
    const normalizedGroup = normalize(group);

    const ranked = ((data ?? []) as unknown as OppositionCall[])
      .map((call) => {
        const callTokens = tokens(
          [call.title, call.specialty, call.organisation, call.administration].filter(Boolean).join(" ")
        );
        const shared = sharedWords(goalTokens, callTokens);
        const sameTerritory = Boolean(
          normalizedTerritory && normalize([call.territory, call.province, call.locality].filter(Boolean).join(" ")).includes(normalizedTerritory)
        );
        const sameGroup = Boolean(
          normalizedGroup && normalize(call.group_category ?? "") === normalizedGroup
        );
        const score = shared.length * 8 + (sameTerritory ? 4 : 0) + (sameGroup ? 3 : 0);
        const reasons = [
          shared.length ? `Coincide en: ${shared.slice(0, 4).join(", ")}` : null,
          sameTerritory ? `Coincide con el territorio ${territory}` : null,
          sameGroup ? `Coincide con el grupo ${group}` : null,
          shared.length ? null : "Coincide con términos relacionados con la preparación",
        ].filter(Boolean) as string[];

        return { call, score, reasons, termMatches: shared.length };
      });

    const completeMatches = goalTokens.size > 1
      ? ranked.filter((item) => item.termMatches === goalTokens.size)
      : [];
    const recommendations = (completeMatches.length ? completeMatches : ranked)
      .sort((a, b) => b.score - a.score || b.call.publication_date.localeCompare(a.call.publication_date))
      .slice(0, 5)
      .map(({ call, score, reasons }) => ({
        id: call.id,
        slug: call.slug,
        title: call.title,
        organisation: call.organisation,
        territory: call.territory,
        group: call.group_category,
        publicationDate: call.publication_date,
        matchedTerms: score,
        reasons,
        officialUrl: call.official_url,
        base12CourseSlug: call.base12_course_slug,
      }));

    return NextResponse.json({
      answer: recommendations.length
        ? "He comparado tu objetivo con convocatorias oficiales ya publicadas. Estas son las coincidencias verificables más próximas. Revisa siempre la ficha y la fuente oficial antes de decidir."
        : "No encuentro ahora una coincidencia suficientemente respaldada por las convocatorias oficiales cargadas. Puedes ampliar el territorio o describir la plaza de otra forma; no voy a inventar una compatibilidad.",
      recommendations,
      qualificationNote: body.qualification
        ? "Comprueba la titulación exigida en las bases de cada convocatoria."
        : null,
    });
  } catch (error) {
    console.error("Error en Fernando para Banco de Opositores", error);
    return NextResponse.json(
      { error: "Fernando no puede consultar ahora las convocatorias oficiales." },
      { status: 500 }
    );
  }
}
