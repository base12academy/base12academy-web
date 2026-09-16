import { NextResponse } from "next/server";
import { publicCallFields, type OppositionCall } from "@/lib/oppositions";
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
    const preparation = (body.preparation ?? "").trim().slice(0, 180);
    const territory = (body.territory ?? "").trim().slice(0, 80);
    const group = (body.group ?? "").trim().slice(0, 30);

    if (preparation.length < 3) {
      return NextResponse.json(
        { error: "Cuéntame qué oposición o tipo de plaza estás preparando." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("opposition_calls")
      .select(publicCallFields)
      .eq("active", true)
      .order("publication_date", { ascending: false })
      .limit(120);
    if (error) throw error;

    const goalTokens = tokens(preparation);
    const normalizedTerritory = normalize(territory);
    const normalizedGroup = normalize(group);

    const recommendations = ((data ?? []) as unknown as OppositionCall[])
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
        const score = shared.length * 3 + (sameTerritory ? 4 : 0) + (sameGroup ? 3 : 0);
        const reasons = [
          shared.length ? `Coincide en: ${shared.slice(0, 4).join(", ")}` : null,
          sameTerritory ? `Coincide con el territorio ${territory}` : null,
          sameGroup ? `Coincide con el grupo ${group}` : null,
        ].filter(Boolean) as string[];

        return { call, score, reasons };
      })
      .filter((item) => item.score > 0)
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
        compatibility: Math.min(95, 45 + score * 5),
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
        ? "La titulación solo se ha considerado cuando la publicación oficial la indica expresamente."
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
