import { cache } from "react";

// UrbiUni lee sus datos del proyecto EstUni de Supabase (organización Editorial EC Libros).
// Son datos públicos de solo lectura; la clave publicable solo permite leer.
const BASE = process.env.URBIUNI_SUPABASE_URL || "https://cgtpipmkjxdthyvqveah.supabase.co";
const KEY = process.env.URBIUNI_SUPABASE_KEY || "sb_publishable_CLytvxXBCBn5yoX4fkKgQw_uywpBSXt";

// Las respuestas se guardan un día en la caché de Vercel: así cada visita no consulta Supabase.
export const URBIUNI_REVALIDATE = 86400;

export type Etiqueta = "oficial" | "no_oficial" | "sin_fuente";

export type Universidad = {
  id: string;
  nombre: string;
  siglas: string | null;
  tipo: string | null;
  ccaa: string | null;
  provincia: string | null;
  municipio: string | null;
  modalidad: string | null;
  web: string | null;
  slug: string;
};

export type TituloLite = {
  id: string;
  slug: string;
  denominacion: string;
  universidad_id: string;
  tipo: string | null;
  rama: string | null;
  modalidad: string | null;
  ects: number | null;
  precio_credito: number | null;
  precio_credito_max: number | null;
  precio_primer_curso_privada: number | null;
  precio_etiqueta: Etiqueta | null;
  campus_ids: string | null;
};

export type Titulo = TituloLite & {
  centro: string | null;
  centro_adscrito: string | null;
  habilitante: string | null;
  codigo_ruct: string | null;
  fuente_url: string | null;
  fuente_etiqueta: Etiqueta | null;
  precio_texto: string | null;
};

export type Acceso = {
  id: string;
  titulo_id: string;
  curso: string | null;
  centro: string | null;
  nota_corte: number | null;
  plazas: number | null;
  solicitudes_1a: number | null;
  via: string | null;
  fuente_url: string | null;
  fuente_etiqueta: Etiqueta | null;
};

export type NivelDato = "universidad_ambito" | "ambito_general_universidad" | "media_nacional";

export type Empleabilidad = {
  id: string;
  titulo_id: string;
  ambito: string | null;
  parte: string | null;
  nivel_dato: NivelDato | null;
  cohorte: string | null;
  afiliacion: number | null;
  autonomos: number | null;
  base_cotizacion: number | null;
  indefinido: number | null;
  jornada_completa: number | null;
  empleo_acorde: number | null;
};

export type Indicadores = {
  id: string;
  titulo_id: string;
  ambito: string | null;
  parte: string | null;
  nivel_dato: NivelDato | null;
  curso: string | null;
  rendimiento: number | null;
  exito: number | null;
  abandono: number | null;
  abandono_1: number | null;
  graduacion: number | null;
  duracion_media: number | null;
  duracion_prevista_anos: number | null;
};

export type Campus = {
  id: string;
  universidad_id: string;
  nombre: string | null;
  municipio: string | null;
  provincia: string | null;
};

export type Alojamiento = {
  id: string;
  universidad_id: string;
  ciudad: string | null;
  nombre: string | null;
  tipo: string | null;
  regimen: string | null;
  precio_mes_desde: number | null;
  precio_mes_hasta: number | null;
  precio_curso: number | null;
  precio_curso_texto: string | null;
  url: string | null;
  curso: string | null;
};

export type Comedor = {
  id: string;
  universidad_id: string;
  campus: string | null;
  nombre: string | null;
  precio_menu: number | null;
  url: string | null;
  curso: string | null;
};

async function rest<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Accept: "application/json" },
    next: { revalidate: URBIUNI_REVALIDATE, tags: ["urbiuni"] },
  });
  if (!response.ok) throw new Error(`UrbiUni: error ${response.status} al leer ${path.split("?")[0]}`);
  return (await response.json()) as T;
}

// La API devuelve como máximo 1.000 filas por petición: se leen páginas ordenadas.
async function readAll<T>(table: string, select: string): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; offset < 20000; offset += 1000) {
    const page = await rest<T[]>(`${table}?select=${select}&order=id.asc&limit=1000&offset=${offset}`);
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

const LITE =
  "id,slug,denominacion,universidad_id,tipo,rama,modalidad,ects,precio_credito,precio_credito_max,precio_primer_curso_privada,precio_etiqueta,campus_ids";

export type UrbiIndex = {
  titulos: TituloLite[];
  universidades: Map<string, Universidad>;
  acceso: Map<string, Acceso>;
};

// Portales privados de orientación: aunque copien datos oficiales, no son la fuente oficial.
const NO_OFICIALES = /(^|\.)(educaweb\.com|elorienta\.com|la7tv\.es)$/i;

export function etiquetaFuente(url: string | null | undefined, etiqueta: Etiqueta | null | undefined): Etiqueta | null {
  if (!url) return etiqueta ?? null;
  try {
    if (NO_OFICIALES.test(new URL(url).hostname) && etiqueta === "oficial") return "no_oficial";
  } catch {
    return etiqueta ?? null;
  }
  return etiqueta ?? null;
}

function fixAcceso<T extends { fuente_url: string | null; fuente_etiqueta: Etiqueta | null }>(row: T): T {
  return { ...row, fuente_etiqueta: etiquetaFuente(row.fuente_url, row.fuente_etiqueta) };
}

export const getUrbiIndex = cache(async (): Promise<UrbiIndex> => {
  const [titulos, universidades, accesos] = await Promise.all([
    readAll<TituloLite>("urbiuni_titulos", LITE),
    readAll<Universidad>("urbiuni_universidades", "*"),
    readAll<Acceso>("urbiuni_acceso", "id,titulo_id,curso,nota_corte,plazas,solicitudes_1a,via,fuente_url,fuente_etiqueta,centro"),
  ]);
  const acceso = new Map<string, Acceso>();
  for (const raw of accesos) {
    const row = fixAcceso(raw);
    const current = acceso.get(row.titulo_id);
    if (!current || betterAcceso(row, current)) acceso.set(row.titulo_id, row);
  }
  return { titulos, universidades: new Map(universidades.map((u) => [u.id, u])), acceso };
});

function betterAcceso(a: Acceso, b: Acceso): boolean {
  if ((a.nota_corte != null) !== (b.nota_corte != null)) return a.nota_corte != null;
  return (a.curso || "") > (b.curso || "");
}

export const getTitulo = cache(async (slug: string) => {
  const rows = await rest<Titulo[]>(`urbiuni_titulos?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
  return rows[0] ? fixAcceso(rows[0]) : null;
});

export const getFicha = cache(async (slug: string) => {
  const titulo = await getTitulo(slug);
  if (!titulo) return null;
  const id = encodeURIComponent(titulo.id);
  const uni = encodeURIComponent(titulo.universidad_id);
  const campusIds = (titulo.campus_ids || "").split(";").map((c) => c.trim()).filter(Boolean);
  const [index, accesos, empleo, indicadores, campus, alojamiento, comedores] = await Promise.all([
    getUrbiIndex(),
    rest<Acceso[]>(`urbiuni_acceso?titulo_id=eq.${id}&select=*`),
    rest<Empleabilidad[]>(`urbiuni_empleabilidad?titulo_id=eq.${id}&select=*&order=id.asc`),
    rest<Indicadores[]>(`urbiuni_indicadores?titulo_id=eq.${id}&select=*&order=id.asc`),
    campusIds.length
      ? rest<Campus[]>(`urbiuni_campus?id=in.(${campusIds.map((c) => `"${encodeURIComponent(c)}"`).join(",")})&select=id,universidad_id,nombre,municipio,provincia`)
      : Promise.resolve([] as Campus[]),
    rest<Alojamiento[]>(`urbiuni_alojamiento?universidad_id=eq.${uni}&select=*&order=precio_mes_desde.asc.nullslast,precio_curso.asc.nullslast`),
    rest<Comedor[]>(`urbiuni_comedores?universidad_id=eq.${uni}&select=id,universidad_id,campus,nombre,precio_menu,url,curso&order=precio_menu.asc.nullslast`),
  ]);
  const universidad = index.universidades.get(titulo.universidad_id) ?? null;
  const acceso = accesos.map(fixAcceso).reduce<Acceso | null>((best, row) => (!best || betterAcceso(row, best) ? row : best), null);
  return { titulo, universidad, acceso, empleo, indicadores, campus, alojamiento, comedores, index };
});

// ---------- utilidades ----------

export function normalize(text: string | null | undefined): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const RAMAS = [
  "Ciencias",
  "Ciencias de la Salud",
  "Ingeniería y Arquitectura",
  "Ciencias Sociales y Jurídicas",
  "Artes y Humanidades",
] as const;

export const CCAA = [
  "Andalucía", "Aragón", "Canarias", "Cantabria", "Castilla y León", "Castilla-La Mancha", "Cataluña",
  "Comunidad de Madrid", "Comunitat Valenciana", "Extremadura", "Galicia", "Illes Balears", "La Rioja",
  "Navarra", "País Vasco", "Principado de Asturias", "Región de Murcia", "Estado",
];

export function shortName(denominacion: string): string {
  return denominacion.replace(/^(Grado|Grau) (en|de|in) /i, "").replace(/^Doble Grado (en|de)? ?/i, "Doble grado: ");
}

export type Precio = { valor: number | null; maximo: number | null; etiqueta: Etiqueta; texto: string | null };

// Precio del primer curso: en las públicas, precio del crédito por 60 créditos (un curso completo).
export function precioCurso(t: TituloLite & { precio_texto?: string | null }): Precio {
  const etiqueta: Etiqueta = t.precio_etiqueta || "sin_fuente";
  if (t.precio_primer_curso_privada != null) {
    return { valor: Math.round(t.precio_primer_curso_privada), maximo: null, etiqueta, texto: t.precio_texto ?? null };
  }
  if (t.precio_credito != null) {
    const valor = Math.round(t.precio_credito * 60);
    const maximo = t.precio_credito_max != null && t.precio_credito_max !== t.precio_credito ? Math.round(t.precio_credito_max * 60) : null;
    return { valor, maximo, etiqueta, texto: t.precio_texto ?? null };
  }
  return { valor: null, maximo: null, etiqueta: "sin_fuente", texto: t.precio_texto ?? null };
}

const euro = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
const dec = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 3 });
const pct = new Intl.NumberFormat("es-ES", { style: "percent", maximumFractionDigits: 0 });

export const fmt = {
  euros: (v: number | null | undefined) => (v == null ? "Sin dato" : `${euro.format(v)} €`),
  nota: (v: number | null | undefined) => (v == null ? "Sin dato" : dec.format(v)),
  pct: (v: number | null | undefined) => (v == null ? "Sin dato" : pct.format(v)),
  num: (v: number | null | undefined) => (v == null ? "Sin dato" : euro.format(v)),
};

export function precioLabel(p: Precio): string {
  if (p.valor == null) return "Sin dato";
  return p.maximo ? `${euro.format(p.valor)}–${euro.format(p.maximo)} €` : `${euro.format(p.valor)} €`;
}

export type Alcance = { label: string; tone: "ok" | "tight" | "hard" };

// Compara la nota del alumno con la última nota de corte publicada (sobre 14).
export function alcance(nota: number | null, corte: number | null): Alcance | null {
  if (nota == null || corte == null) return null;
  if (nota >= corte + 0.3) return { label: "A tu alcance", tone: "ok" };
  if (nota >= corte - 0.3) return { label: "Ajustada", tone: "tight" };
  return { label: "Difícil", tone: "hard" };
}

export function parseNota(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n <= 14 ? n : null;
}

export function esOnline(modalidad: string | null): boolean {
  const m = normalize(modalidad);
  return /online|distancia|virtual|no presencial|semipresencial/.test(m);
}

export const NIVEL_TEXTO: Record<NivelDato, (ambito: string) => string> = {
  universidad_ambito: (a) => `Dato de la universidad en el ámbito «${a}», no de este grado concreto.`,
  ambito_general_universidad: (a) => `Dato de la universidad en el ámbito general «${a}», no de este grado concreto: no hay dato publicado para su ámbito.`,
  media_nacional: (a) => `Media nacional del ámbito «${a}»: la universidad no tiene dato publicado para este ámbito.`,
};
