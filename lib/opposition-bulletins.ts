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
    .replace(/&#(\d{1,7});/g, (full, value) => {
      const point = Number(value);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : full;
    })
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

function rssItems(xml: string, token: string) {
  if (!/<rss\b/.test(xml) || !xml.includes(token)) throw new Error("No se reconoció el RSS oficial");
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)].map(match => match[1]);
}

function rssField(item: string, field: "title" | "link" | "description" | "pubDate" | "guid") {
  return text(item.match(new RegExp(`<${field}(?:\\s[^>]*)?>([\\s\\S]*?)</${field}>`))?.[1] ?? "");
}

function rssDate(value: string) {
  const match = value.match(/(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})/);
  if (!match) return null;
  const month = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ").indexOf(match[2]) + 1;
  return `${match[3]}-${String(month).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

export function readBocFeed(xml: string): BulletinPublication[] {
  return rssItems(xml, "autoridades_personal_oposiciones.rss").map(item => {
    const title = rssField(item, "title");
    const url = rssField(item, "link");
    const reference = rssField(item, "guid");
    const date = rssDate(rssField(item, "pubDate"));
    const bulletin = reference.match(/^BOC-A-(\d{4})-(\d+)-\d+$/);
    const organisation = rssField(item, "description").match(/Oposiciones y concursos - (.+?) \d+ /)?.[1] ?? null;
    if (!bulletin || !date || !title || !/^https:\/\/www\.gobiernodecanarias\.org\/boc\/\d{4}\/\d+\/\d+\.html$/.test(url)) {
      throw new Error("Faltan referencias oficiales del BOC");
    }
    return { reference, bulletin: `BOC ${bulletin[1]}/${bulletin[2]}`, date, title, organisation, url, pdf: null };
  });
}

export function readDogFeed(xml: string): BulletinPublication[] {
  const items = rssItems(xml, "Diario Oficial de Galicia");
  const index = items.find(item => /^Sumario$/i.test(rssField(item, "title")));
  const bulletin = index && rssField(index, "link").match(/\/Indice(\d+)_[a-z]{2}\.pdf$/)?.[1];
  return items.flatMap(item => {
    const title = rssField(item, "title");
    if (/^Sumario$/i.test(title)) return [];
    const url = rssField(item, "link");
    const document = url.match(/^https:\/\/www\.xunta\.gal\/dog\/Publicados\/(\d{4})\/(\d{4})(\d{2})(\d{2})\/(Anuncio[A-Z0-9-]+)_[a-z]{2}\.html$/i);
    if (!bulletin || !document || !title) throw new Error("Faltan referencias oficiales del DOG");
    return [{ reference: document[5], bulletin: `DOG ${document[1]}/${bulletin}`,
      date: `${document[2]}-${document[3]}-${document[4]}`, title,
      organisation: null, url, pdf: null }];
  });
}

export function readAvilaFeed(xml: string): BulletinPublication[] {
  const heading = text(xml.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "");
  const issue = heading.match(/Número (\d+) \((\d{2})-(\d{2})-(\d{4})\)/i);
  if (!issue) throw new Error("Falta el número de boletín del BOP de Ávila");
  return rssItems(xml, "diputacionavila.es").flatMap(item => {
    const title = rssField(item, "description");
    if (!isSelectionNotice(title)) return [];
    const label = rssField(item, "title").match(/^(.*) - (\d+\/\d{2})$/);
    const url = rssField(item, "link");
    if (!label || !/^https:\/\/www\.diputacionavila\.es\/bops\/[0-9/_-]+\.pdf$/.test(url)) {
      throw new Error("Faltan referencias oficiales del BOP de Ávila");
    }
    return [{ reference: label[2], bulletin: `BOP Ávila ${issue[4]}/${issue[1]}`,
      date: `${issue[4]}-${issue[3]}-${issue[2]}`, title,
      organisation: label[1], url, pdf: url }];
  });
}

export function readBocylFeed(xml: string): BulletinPublication[] {
  const items = rssItems(xml, "COMUNIDAD DE CASTILLA Y LEÓN");
  return items.flatMap(item => {
    const issue = rssField(item, "title").match(/^Boletín del día (\d{2})\/(\d{2})\/(\d{4}) edición (\d+)$/);
    if (!issue) throw new Error("No se reconoció la edición oficial del BOCYL");
    const [, day, month, year, number] = issue;
    const html = (item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    if (!/<ul\b/.test(html)) throw new Error("Falta el sumario del BOCYL");
    return [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].flatMap(([, announcement]) => {
      const [heading, headline] = [...announcement.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(match => match[1]);
      const title = text(headline ?? "");
      if (!isSelectionNotice(title)) return [];
      const link = heading?.match(/href=["'](https:\/\/bocyl\.jcyl\.es\/boletines\/\d{4}\/\d{2}\/\d{2}\/pdf\/(BOCYL-D-\d{8}-\d+-\d+)\.pdf)["']/i);
      if (!link || !link[2].startsWith(`BOCYL-D-${day}${month}${year}-${number}-`)) {
        throw new Error("Falta la referencia de una disposición del BOCYL");
      }
      return [{ reference: link[2], bulletin: `BOCYL ${year}/${number}`, date: `${year}-${month}-${day}`,
        title, organisation: text(heading).split(" - ").at(-1) ?? null, url: link[1], pdf: link[1] }];
    });
  });
}

export function verifyBojaArticle(record: BulletinPublication, html: string): BulletinPublication {
  const heading = html.match(/<h1\b[^>]*>[\s\S]*?<span\s+class="nota">([\s\S]*?)<\/span>[\s\S]*?<\/h1>/i);
  const issue = text(heading?.[1] ?? "");
  const published = issue.match(/(\d{2})\/(\d{2})\/(\d{4})$/);
  const pdfName = record.pdf?.split("/").at(-1);
  if (!published || !pdfName || !html.includes(pdfName)) {
    throw new Error("No se pudo cotejar la fecha y la referencia con la edición oficial del BOJA");
  }
  return { ...record, bulletin: issue, date: `${published[3]}-${published[2]}-${published[1]}` };
}

export function ceutaIssueLinks(html: string) {
  const endpoints = new Map<string, { path: string; issue: string; date: string }>();
  for (const [, path, issue, day, month, year] of html.matchAll(
    /href="(\/ceuta\/component\/jdownloads\/viewdownload\/\d+\/\d+)\?Itemid=">\s*BOCCE_(Extra\d+|\d+)_(\d{2})-(\d{2})-(\d{4})/gi,
  )) {
    endpoints.set(path, { path, issue, date: `${year}-${month}-${day}` });
  }
  if (!endpoints.size) throw new Error("No se reconocieron las ediciones del BOCCE");
  return [...endpoints.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function ceutaPdfPath(html: string, issue: string, date: string) {
  const [year, month, day] = date.split("-");
  const suffix = `-bocce-${issue.toLowerCase()}-${day}-${month}-${year}?Itemid=0`;
  const paths = [...html.matchAll(/href="(\/ceuta\/component\/jdownloads\/finish\/[^"<>]+)"/g)];
  const linked = paths.map(match => match[1]).filter(path => path.toLowerCase().endsWith(suffix.toLowerCase()));
  if (new Set(linked).size !== 1) throw new Error("No se pudo identificar el PDF oficial del BOCCE");
  return linked[0];
}

export function readCeutaSummary(pages: string[], artifact: { issue: string; date: string; pdf: string }): BulletinPublication[] {
  const [year, month, day] = artifact.date.split("-");
  const dateLabel = `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
  const first = text(pages[0] ?? "");
  const marker = first.search(/\bSUMARIO\b/i);
  const label = first.slice(0, Math.max(0, marker) + 125).toLowerCase();
  if (marker < 0 || !label.includes(dateLabel) || !label.includes("bocce")) {
    throw new Error("El PDF del BOCCE no contiene el sumario fechado esperado");
  }
  const numericIssue = artifact.issue.replace(/^Extra/i, "");
  const issueLabel = label.replace(/[.\s]/g, "");
  if (!issueLabel.includes(numericIssue) || (/^extra/i.test(artifact.issue) && !issueLabel.includes("extraordinario"))) {
    throw new Error("El número de edición del BOCCE no coincide");
  }
  const sumario = text([first.slice(marker), ...pages.slice(1)].join(" ")).replace(/[\u00ad\u2010\u2011]/g, "-");
  const articles = [...sumario.matchAll(/\b(\d{1,5})\s*\.(?:\s*[-–]\s*|\s+)([A-ZÁÉÍÓÚÑ].{5,3499}?)\s+P[aá]g\.?\s*([\d.]+)/g)];
  if (!articles.length) throw new Error("El sumario del BOCCE no contiene anuncios identificables");
  return articles.flatMap(([, number, title]) => {
    if (!isSelectionNotice(title) && !/sistema selectivo de promoci[oó]n|convocatoria de \d+ puestos?/i.test(title)) return [];
    if (/subvenciones|de ayudas públicas/i.test(title)) return [];
    return [{
      reference: `${year}/${artifact.issue}/${number}`,
      bulletin: `BOCCE ${year}/${artifact.issue}`,
      date: artifact.date,
      title,
      organisation: null,
      url: artifact.pdf,
      pdf: artifact.pdf,
    }];
  });
}
