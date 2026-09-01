"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { OppositionCall } from "@/lib/oppositions";
import OppositionAlertDialog from "./OppositionAlertDialog";
import styles from "@/app/banco-opositores/banco.module.css";

type FernandoRecommendation = {
  id: string;
  slug: string;
  title: string;
  organisation: string | null;
  territory: string;
  group: string | null;
  compatibility: number;
  reasons: string[];
  base12CourseSlug: string | null;
};

const initialFilters = {
  territory: "",
  administration: "",
  category: "",
  group: "",
  status: "",
  deadline: "",
  date: "",
};

function shortTitle(value: string) {
  return value.length > 125 ? `${value.slice(0, 122)}…` : value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${value}T12:00:00+02:00`));
}

function deadlineLabel(call: OppositionCall) {
  if (!call.application_start || !call.application_end) return "Plazo no indicado oficialmente";
  const today = new Date().toISOString().slice(0, 10);
  if (today < call.application_start) return `Abre el ${formatDate(call.application_start)}`;
  if (today > call.application_end) return "Plazo cerrado";
  return `Hasta el ${formatDate(call.application_end)}`;
}

export default function OppositionExplorer({
  initialCalls,
  initialTerritory = "",
}: {
  initialCalls: OppositionCall[];
  initialTerritory?: string;
}) {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ ...initialFilters, territory: initialTerritory });
  const [calls, setCalls] = useState(initialCalls);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<OppositionCall | null>(null);
  const [fernandoOpen, setFernandoOpen] = useState(false);
  const [preparation, setPreparation] = useState("");
  const [fernandoTerritory, setFernandoTerritory] = useState("");
  const [qualification, setQualification] = useState("");
  const [fernandoLoading, setFernandoLoading] = useState(false);
  const [fernandoAnswer, setFernandoAnswer] = useState("");
  const [recommendations, setRecommendations] = useState<FernandoRecommendation[]>([]);

  const activeCriteria = useMemo(() => ({ q, ...filters }), [q, filters]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchError("");
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });
        const response = await fetch(`/api/banco-opositores/convocatorias?${params.toString()}`);
        const result = (await response.json()) as { calls?: OppositionCall[]; error?: string };
        if (!response.ok) throw new Error(result.error || "No se pudo completar la búsqueda.");
        setCalls(result.calls ?? []);
      } catch (error) {
        setSearchError(error instanceof Error ? error.message : "No se pudo completar la búsqueda.");
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [q, filters]);

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  async function askFernando(event: React.FormEvent) {
    event.preventDefault();
    setFernandoLoading(true);
    setFernandoAnswer("");
    setRecommendations([]);
    try {
      const response = await fetch("/api/banco-opositores/fernando", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preparation, territory: fernandoTerritory, qualification }),
      });
      const result = (await response.json()) as {
        answer?: string;
        recommendations?: FernandoRecommendation[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "No se pudo consultar a Fernando.");
      setFernandoAnswer(result.answer ?? "");
      setRecommendations(result.recommendations ?? []);
    } catch (error) {
      setFernandoAnswer(error instanceof Error ? error.message : "No se pudo consultar a Fernando.");
    } finally {
      setFernandoLoading(false);
    }
  }

  return (
    <>
      <section className={styles.searchPanel} aria-labelledby="search-title">
        <p className={styles.eyebrow}>Información pública · Sin registro</p>
        <h1 id="search-title">Encuentra tu próxima oportunidad</h1>
        <p>Convocatorias y empleo público obtenidos de fuentes oficiales de toda España.</p>
        <div className={styles.searchRow}>
          <label className={styles.srOnly} htmlFor="opposition-search">Buscar convocatoria</label>
          <input
            id="opposition-search"
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="¿Qué oposición, plaza u organismo buscas?"
          />
          <button type="button" onClick={() => undefined}>⌕ <span>Buscar</span></button>
        </div>
        <p className={styles.searchExamples}>Ejemplos: Administrativo del Estado · Auxiliar administrativo · Tropa y Marinería · Policía Local · Jardinero · Electricista · Celador · Bombero</p>

        <div className={styles.filterGrid}>
          <label>Territorio<select value={filters.territory} onChange={(e) => updateFilter("territory", e.target.value)}><option value="">Todos</option><option>España</option><option>Andalucía</option><option>Madrid</option><option>Comunitat Valenciana</option></select></label>
          <label>Administración<select value={filters.administration} onChange={(e) => updateFilter("administration", e.target.value)}><option value="">Todas</option><option value="Administración Local">Administración local</option><option value="Ministerio">Estado / Ministerios</option><option value="Universidad">Universidades</option></select></label>
          <label>Tipo de plaza<input value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} placeholder="Cualquiera" /></label>
          <label>Grupo<select value={filters.group} onChange={(e) => updateFilter("group", e.target.value)}><option value="">Todos</option><option>C1</option><option>C2</option><option>A1</option><option>A2</option><option>AP</option></select></label>
          <label>Estado<select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="">Todos</option><option value="publicada">Publicada</option><option value="actualizada">Actualizada</option><option value="listas">Listas publicadas</option><option value="examen">Examen convocado</option><option value="anulada">Anulada</option></select></label>
          <label>Plazo de inscripción<select value={filters.deadline} onChange={(e) => updateFilter("deadline", e.target.value)}><option value="">Todos</option><option value="abierto">Abierto</option><option value="proximo">Próximo</option><option value="cerrado">Cerrado</option></select></label>
          <label>Fecha desde<input type="date" value={filters.date} onChange={(e) => updateFilter("date", e.target.value)} /></label>
        </div>
      </section>

      <section className={styles.fernandoBanner}>
        <Image src="/images/fernando-tutor-ia.png" alt="Fernando, asesor de oposiciones Base12" width={104} height={112} />
        <div><p className={styles.eyebrow}>Asesor estratégico</p><h2>Fernando · Asesor de oposiciones</h2><p>Dime qué estás preparando, dónde buscas y qué titulación tienes. Solo te mostrará compatibilidades respaldadas por convocatorias existentes.</p></div>
        <button className={styles.primaryButton} type="button" onClick={() => setFernandoOpen((value) => !value)}>{fernandoOpen ? "Cerrar consulta" : "Consultar a Fernando"}</button>
      </section>

      {fernandoOpen && (
        <section className={styles.fernandoPanel}>
          <form onSubmit={askFernando}>
            <label>¿Qué estás preparando?<input required value={preparation} onChange={(e) => setPreparation(e.target.value)} placeholder="Ej.: Administrativo del Estado C1" /></label>
            <label>¿Dónde buscas?<input value={fernandoTerritory} onChange={(e) => setFernandoTerritory(e.target.value)} placeholder="Ej.: Madrid" /></label>
            <label>¿Qué titulación tienes?<input value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="Ej.: Bachillerato" /></label>
            <button className={styles.primaryButton} type="submit" disabled={fernandoLoading}>{fernandoLoading ? "Comparando…" : "Buscar opciones compatibles"}</button>
          </form>
          {fernandoAnswer && <div className={styles.fernandoAnswer}><p>{fernandoAnswer}</p>{recommendations.map((item) => (
            <article key={item.id}>
              <div><b>{item.title}</b><span>{item.organisation || item.territory}</span>{item.reasons.map((reason) => <small key={reason}>{reason}</small>)}</div>
              <strong>{item.compatibility}%</strong>
              <Link href={`/banco-opositores/convocatoria/${item.slug}`}>Ver ficha</Link>
            </article>
          ))}</div>}
        </section>
      )}

      <section id="crear-alerta" className={styles.resultsSection} aria-live="polite">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>Actualización automática</p><h2>Convocatorias oficiales</h2></div>
          <button className={styles.outlineButton} type="button" onClick={() => { setSelectedCall(null); setAlertOpen(true); }}>＋ Crear alerta</button>
        </div>
        {searchError && <p className={styles.errorBox}>{searchError}</p>}
        {loading && <p className={styles.loadingText}>Consultando fuentes oficiales…</p>}
        {!loading && !calls.length && (
          <div className={styles.emptyState}><span aria-hidden="true">⌕</span><h3>No hay coincidencias publicadas</h3><p>Prueba otra búsqueda o crea una alerta. No mostraremos datos inventados ni completaremos información que no figure en la fuente oficial.</p></div>
        )}
        <div className={styles.callGrid}>
          {calls.map((call) => (
            <article className={styles.callCard} key={call.id}>
              <div className={styles.callCardTop}><span>{call.status}</span><time dateTime={call.publication_date}>{formatDate(call.publication_date)}</time></div>
              <h3>{shortTitle(call.title)}</h3>
              <p>{call.organisation || "Organismo no indicado en la publicación oficial"}</p>
              <dl><div><dt>Territorio</dt><dd>{call.territory}</dd></div><div><dt>Grupo</dt><dd>{call.group_category || "No indicado"}</dd></div><div><dt>Plazas</dt><dd>{call.vacancies ?? "No indicadas"}</dd></div></dl>
              <p className={styles.deadline}>◷ {deadlineLabel(call)}</p>
              <div className={styles.cardActions}>
                <Link className={styles.primaryButton} href={`/banco-opositores/convocatoria/${call.slug}`}>Ver convocatoria</Link>
                <button className={styles.outlineButton} type="button" onClick={() => { setSelectedCall(call); setAlertOpen(true); }}>Avísame</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.categorySection}>
        <h2>Explora por administración</h2>
        <div><Link href="/banco-opositores/estado">▣<span>Administración del Estado</span></Link><Link href="/banco-opositores/andalucia">⌂<span>Andalucía</span></Link><Link href="/banco-opositores/madrid">⌂<span>Madrid</span></Link><Link href="/banco-opositores/valencia">⌂<span>Comunitat Valenciana</span></Link><Link href="/banco-opositores?administration=Universidad">▥<span>Universidades</span></Link><Link href="/banco-opositores?administration=Local">▤<span>Entidades locales</span></Link></div>
      </section>

      <section className={styles.officialNotice}>
        <span aria-hidden="true">i</span><div><b>Información orientativa basada en fuentes oficiales</b><p>Los datos pueden cambiar. Consulta siempre la publicación oficial enlazada en cada ficha. Cuando un dato no conste, se indicará expresamente.</p></div>
      </section>

      <OppositionAlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        callId={selectedCall?.id}
        callTitle={selectedCall?.title}
        criteria={Object.fromEntries(Object.entries(activeCriteria).filter(([, value]) => value))}
      />
    </>
  );
}
