// Extract literal facts from the official BOE text. Never calculate an application
// deadline from a relative period: regional/local holidays can change that date.
export type BoeDetails = {
  paragraphs: string[];
  summary: string;
  specialty: string | null;
  category: string | null;
  positionId: string | null;
  applicationPeriod: string | null;
  headline: string | null;
};

export function boeOrganisation(title: string, fallback: string | null) {
  return title.match(/\bde(?:l| la)\s+((?:Ayuntamiento|Universidad)\s+[^,]+),/i)?.[1] || fallback;
}

function plainText(value: string) {
  return value.replace(/<[^>]*>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}

export function detailsFromParagraphs(input: string[]): BoeDetails | null {
  const paragraphs = [...new Set(input.map(plainText).filter(Boolean))];
  if (!paragraphs.length) return null;
  const labelled = (pattern: RegExp) => paragraphs.find(p => pattern.test(p))?.replace(/^[^:]+:\s*/, "").replace(/\.$/, "") || null;
  const specialty = labelled(/^Área de conocimiento\s*:/i);
  const category = labelled(/^Categoría de la plaza\s*:/i);
  const positionId = labelled(/^(Identificador de la plaza|Código de la plaza)\s*:/i);
  const position = labelled(/^Denominación del puesto\s*:/i);
  const localPosition = paragraphs.find(p => /^(?:\d+|Una?|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho|Nueve|Diez|Once|Doce|Veinte)\s+plazas?\s+de\b/i.test(p)) || null;
  const applicationPeriod = paragraphs.find(p =>
    /(?:plazo|días|meses)/i.test(p) && /(?:presentaci[oó]n de solicitudes|instancias deber[aá]n presentarse|solicitudes (?:se presentar[aá]n|podr[aá]n presentarse))/i.test(p)
  ) || null;
  const headline = specialty ? [category, specialty].filter(Boolean).join(" · ")
    : position || localPosition?.split(/,\s*(?:perteneciente|de la plantilla|por el sistema)/i)[0].replace(/\.$/, "") || null;
  return { paragraphs, summary: paragraphs.join("\n\n"), specialty, category, positionId, applicationPeriod, headline };
}

export function parseBoeDetails(xml: string, externalId: string): BoeDetails | null {
  if (!/^BOE-A-\d{4}-\d+$/.test(externalId)) return null;
  if (xml.match(/<identificador>\s*([^<]+)\s*<\/identificador>/)?.[1].trim() !== externalId) return null;
  // <analisis> also has <texto> nodes for later amendments. Select the
  // publication body, not the first reference's text.
  const body = [...xml.matchAll(/<texto(?:\s[^>]*)?>([\s\S]*?)<\/texto>/g)]
    .find(match => /<p\b/i.test(match[1]))?.[1];
  if (!body) return null;
  // Do not reproduce selection-committee tables or unrelated legislative metadata.
  const withoutTables = body.replace(/<table\b[\s\S]*?<\/table>/gi, "");
  const all = [...withoutTables.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m => plainText(m[1]));
  const relevant = all.filter(p => p.length > 25 &&
    !/^(?:De conformidad|Visto|Contra |Los sucesivos anuncios|Nombrar a los miembros|La documentaci[oó]n se presentar[aá]|La presente resoluci[oó]n se publicar[aá])/i.test(p) &&
    /plaza|puesto|bases|solicitud|instancias|convocatoria|departamento:|[aá]rea de conocimiento:|perfil |asignatura |adscripci[oó]n:|localizaci[oó]n:|titulaci[oó]n|podr[aá]n tomar parte|requisito/i.test(p));
  // Keep the differentiating facts even when a long notice has much boilerplate.
  const priority = relevant.filter(p => /^(?:Categoría|Identificador|Código|Área de conocimiento|Perfil |Departamento:|Denominación|Número de puestos|Adscripción:|Localización:)/i.test(p));
  const selected = new Set([...priority, ...relevant].slice(0, 24));
  return detailsFromParagraphs(relevant.filter(p => selected.has(p)).map(p => p.slice(0, 3000)));
}
