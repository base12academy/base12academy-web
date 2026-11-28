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
  education: string | null;
  fees: string | null;
  exemptions: string | null;
  documentation: string | null;
  payment: string | null;
  vacancies: number | null;
  group: string | null;
  accessSystem: string | null;
  applicationStart: string | null;
  applicationEnd: string | null;
  examDate: string | null;
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

export function isBoeCall(title: string) {
  const text = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /referente a la convocatoria para proveer|se publica la convocatoria del procedimiento selectivo|se convocan? (?:un |una |el |los |las )?(?:proceso|pruebas|concurso)|se convocan? (?:para proveer|la provision)/.test(text)
    && !/correccion|modifica|anula|deja sin efecto|recursos?/.test(text);
}

function explicitVacancies(paragraphs: string[]) {
  const total = paragraphs.map(p => p.match(/\bse convocan? (?:un total de )?(\d{1,7}) plazas?\b/i)?.[1]).filter(Boolean);
  const byPosition = paragraphs.map(p => p.match(/^n[uú]mero de (?:puestos|plazas)\s*:\s*(\d{1,7})[.]?$/i)?.[1]).filter(Boolean);
  if (new Set(total).size === 1) return Number(total[0]);
  if (byPosition.length === 1) return Number(byPosition[0]);
  const spelled = ["", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
  const local = paragraphs.flatMap(paragraph => {
    const value = paragraph.match(/^(\d{1,7}|[a-záéíóú]+) plazas? de\b/i)?.[1]?.toLowerCase();
    if (!value) return [];
    const count = /^\d+$/.test(value) ? Number(value) : spelled.indexOf(value);
    return count > 0 ? [count] : [];
  });
  return local.length === 1 ? local[0] : null;
}

const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function explicitDate(paragraphs: string[], marker: RegExp) {
  const dates = new Set(paragraphs.flatMap(paragraph => {
    const match = paragraph.match(marker);
    if (!match) return [];
    const [, day, month, year] = match;
    const monthNumber = months.indexOf(month.toLowerCase()) + 1;
    const result = `${year}-${String(monthNumber).padStart(2, "0")}-${day.padStart(2, "0")}`;
    const date = new Date(result);
    return monthNumber && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === result
      ? [result] : [];
  }));
  return dates.size === 1 ? [...dates][0] : null;
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
  const excerpt = (pattern: RegExp) => paragraphs.find(p => pattern.test(p)) || null;
  const education = excerpt(/(?:titulaci[oó]n (?:exigida|requerida|acad[eé]mica)|estar en posesi[oó]n del t[ií]tulo)/i);
  const fees = excerpt(/(?:tasa|derechos de examen).{0,180}(?:euros|€|importe)|(?:importe|euros|€).{0,180}(?:tasa|derechos de examen)/i);
  const exemptions = excerpt(/(?:exent[oa]s?|exenci[oó]n|bonificaci[oó]n).{0,180}(?:tasa|pago|derechos de examen)|(?:tasa|derechos de examen).{0,180}(?:exent|exenci[oó]n|bonificaci[oó]n)/i);
  const documentation = excerpt(/(?:deber[aá]n? (?:adjuntar|acompañar|aportar)|documentaci[oó]n (?:que debe|exigida|necesaria))/i);
  const payment = excerpt(/(?:pago|abono|ingreso) (?:de la tasa|de los derechos|electr[oó]nico|telem[aá]tico)/i);
  const groups = [...new Set(paragraphs.flatMap(p =>
    [...p.matchAll(/\bsubgrupo(?: de clasificaci[oó]n)?\s*[:(]?\s*(A[12]|C[12])\b/gi)].map(match => match[1].toUpperCase())
  ))];
  const vacancies = explicitVacancies(paragraphs);
  const group = groups.length === 1 ? groups[0] : null;
  const systems = new Set(paragraphs.flatMap(p =>
    [...p.matchAll(/\bsistema (?:selectivo )?de (concurso\s*[-–]\s*oposici[oó]n|oposici[oó]n|concurso)\b/gi)]
      .map(match => match[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s*[-–]\s*/g, "-"))
  ));
  const labels: Record<string, string> = { "concurso-oposicion": "Concurso-oposición", oposicion: "Oposición", concurso: "Concurso" };
  const accessSystem = systems.size === 1 ? labels[[...systems][0]] ?? null : null;
  const applicationStart = explicitDate(paragraphs, /(?:plazo de (?:presentaci[oó]n de (?:solicitudes|instancias)|inscripci[oó]n))[^.;]{0,70}?(?:desde el|comenzar[aá] el|se iniciar[aá] el) (?:d[ií]a )?(\d{1,2}) de ([a-z]+) de (20\d{2})/i);
  const applicationEnd = explicitDate(paragraphs, /(?:plazo de (?:presentaci[oó]n de (?:solicitudes|instancias)|inscripci[oó]n))[^.;]{0,110}?(?:hasta el|finalizar[aá] el|terminar[aá] el) (?:d[ií]a )?(\d{1,2}) de ([a-z]+) de (20\d{2})/i);
  const examAnnouncements = paragraphs.filter(p =>
    /convocar a .{0,220}celebraci[oó]n del (?:primer |ejercicio [uú]nico)/i.test(p)
  );
  const examDay = /\bd[ií]a (\d{1,2}) de ([a-z]+) de (20\d{2})\b/gi;
  const completeAnnouncements = examAnnouncements.length && examAnnouncements.every(p => Array.from(p.matchAll(examDay)).length === 1);
  const examDate = examAnnouncements.length
    ? completeAnnouncements ? explicitDate(examAnnouncements, /\bd[ií]a (\d{1,2}) de ([a-z]+) de (20\d{2})\b/i) : null
    : explicitDate(paragraphs, /(?:primer ejercicio|prueba [uú]nica|examen) (?:se celebrar[aá]|tendr[aá] lugar) el (?:d[ií]a )?(\d{1,2}) de ([a-z]+) de (20\d{2})/i);
  return { education, fees, exemptions, documentation, payment, vacancies, group, accessSystem, applicationStart, applicationEnd, examDate, paragraphs, summary: paragraphs.join("\n\n"), specialty, category, positionId, applicationPeriod, headline };
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
    /plaza|puesto|bases|solicitud|instancias|convocatoria|ejercicio|examen|departamento:|[aá]rea de conocimiento:|perfil |asignatura |adscripci[oó]n:|localizaci[oó]n:|titulaci[oó]n|podr[aá]n tomar parte|requisito|tasa|derechos de examen|exenci[oó]n|bonificaci[oó]n|documentaci[oó]n|abono|pago/i.test(p));
  // Keep the differentiating facts even when a long notice has much boilerplate.
  const priority = relevant.filter(p => /^(?:Categoría|Identificador|Código|Área de conocimiento|Perfil |Departamento:|Denominación|Número de puestos|Adscripción:|Localización:)/i.test(p) || /titulaci[oó]n exigida|derechos de examen|tasa|exenci[oó]n|bonificaci[oó]n|documentaci[oó]n|pago/i.test(p));
  const selected = new Set([...priority, ...relevant].slice(0, 24));
  const details = detailsFromParagraphs(relevant);
  if (!details) return null;
  const paragraphs = relevant.filter(p => selected.has(p)).map(p => p.slice(0, 3000));
  return { ...details, paragraphs, summary: paragraphs.join("\n\n") };
}
