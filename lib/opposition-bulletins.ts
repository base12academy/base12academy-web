export type BulletinPublication = {
  reference: string;
  bulletin: string;
  date: string;
  title: string;
  organisation: string | null;
  url: string;
  pdf: string | null;
};

function text(html: string) {
  return html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|#38);/g, "&")
    .replace(/&(?:nbsp|#160);/g, " ")
    .replace(/&(?:apos|#39);/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ").trim();
}

export function isSelectionNotice(value: string) {
  const normalized = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /proceso[s]? selectivo[s]?|procedimiento[s]? selectivo[s]?|concurso[-– ]oposici[oó]n|(?:sistema|turno) de oposicion|convocatoria[^.]{0,150}(?:plazas|cuerpo|escala|pruebas selectivas)|(?:lista|relacion)[^.]{0,100}admitid/.test(normalized)
    && !/nombramiento (?:como|de) (?:funcionari|personal)|se nombra (?:personal|funcionari)/.test(normalized);
}

export function readBojaFeed(xml: string): BulletinPublication[] {
  if (!/<feed\b[^>]*>/.test(xml) || !/<title>2\.2\./.test(xml)) {
    throw new Error("El BOJA no devolvió el canal de oposiciones esperado");
  }
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const title = text(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const date = entry.match(/<updated>(\d{4}-\d{2}-\d{2})T/)?.[1];
    const path = entry.match(/<link\s+href="https?:\/\/www\.juntadeandalucia\.es(\/boja\/\d{4}\/\d+\/\d+\.html)"/)?.[1];
    const pdf = entry.match(/href="https?:\/\/www\.juntadeandalucia\.es(\/boja\/\d{4}\/\d+\/[^"]+_(\d+)\.pdf)"/);
    const bulletin = text(entry.match(/<strong>Boletín:\s*<\/strong>([^<]+)/)?.[1] ?? "");
    const organisation = text(entry.match(/<strong>Organismo:\s*<\/strong>([^<]+)/)?.[1] ?? "");
    if (!isSelectionNotice(title)) return [];
    if (!date || !path || !pdf || !bulletin) throw new Error("Faltan referencias oficiales en una publicación del BOJA");
    const base = "https://www.juntadeandalucia.es";
    return [{ reference: pdf[2], bulletin, date, title, organisation: organisation || null, url: base + path, pdf: base + pdf[1] }];
  });
}

export function readBocmFeed(xml: string): BulletinPublication[] {
  if (!xml.includes("<rss ") || !xml.includes("ordenes-ultimo-boletin")) {
    throw new Error("El BOCM no devolvió el canal esperado");
  }
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].flatMap(([, item]) => {
    const description = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
    const title = text(description.split(/&lt;\/p&gt;|<\/p>/)[0]);
    if (!isSelectionNotice(title)) return [];
    const ref = text(description).match(/\bCVE (BOCM-(\d{4})(\d{2})(\d{2})-\d+)\b/);
    const bulletin = text(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "").match(/Boletín Nº (\d+) año (\d{4})/i);
    const url = item.match(/<link>(https:\/\/www\.bocm\.es\/bocm-\d{8}-\d+)<\/link>/i)?.[1];
    if (!ref || !bulletin || !url) throw new Error("Faltan referencias oficiales en una publicación del BOCM");
    return [{ reference: ref[1], bulletin: `BOCM ${bulletin[2]}/${bulletin[1]}`, date: `${ref[2]}-${ref[3]}-${ref[4]}`,
      title, organisation: null, url, pdf: null }];
  });
}

export function bomeIssues(html: string) {
  const issues = [...new Set([...html.matchAll(/href=["'](\/bome\/BOME-B(?:X)?-\d{4}-\d+)["']/g)].map(match => match[1]))];
  if (!issues.length) throw new Error("El BOME no devolvió su índice de boletines");
  return issues;
}

const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function readBomeIssue(html: string, path: string): BulletinPublication[] {
  const base = "https://bomemelilla.es";
  const bulletin = path.split("/").at(-1) ?? "";
  const heading = text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const published = heading.match(/(\d{1,2}) de (\w+) de (\d{4})/i);
  const month = published ? months.indexOf(published[2].toLowerCase()) + 1 : 0;
  if (!published || !month || !/^BOME-BX?-\d{4}-\d+$/.test(bulletin) || !html.includes("articulo-list")) {
    throw new Error("El BOME no devolvió un sumario reconocible");
  }
  const date = `${published[3]}-${String(month).padStart(2, "0")}-${published[1].padStart(2, "0")}`;
  return [...html.matchAll(/\(CVE:\s*(BOME-A-\d{4}-\d+)\)([\s\S]*?)<\/li>/g)].flatMap(([, reference, entry]) => {
    const title = text(entry.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)?.[1] ?? "");
    if (!isSelectionNotice(title) && !/Apertura plazo de presentación de instancias para la provisión/i.test(title)) return [];
    const pdf = entry.match(/href=["'](\/bome\/descargar\/BOME-A-\d{4}-\d+\.pdf)["']/)?.[1];
    const url = entry.match(/href=["'](\/bome\/BOME-BX?-\d{4}-\d+\/articulo\/\d+)["']/)?.[1];
    if (!url || !pdf || !pdf.endsWith(`/${reference}.pdf`)) throw new Error("Faltan referencias oficiales en un artículo del BOME");
    return [{ reference, bulletin, date, title, organisation: null, url: base + url, pdf: base + pdf }];
  });
}
