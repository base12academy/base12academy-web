"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  answerClara,
  elementCategories,
  elements,
  formatTrendValue,
  matchesElementSearch,
  periodicTable,
  trendDefinitions,
  trendValue,
  type ChemicalElement,
  type ElementCategory,
  type TrendKey,
} from "@/lib/chemistry/periodic-table";
import styles from "./periodic-table.module.css";

type AccessState = {
  status: "loading" | "ready" | "error";
  entitled: boolean;
  authenticated: boolean;
  access: "included" | "licensed" | "purchase_required" | "unavailable";
};

type ClaraMessage = {
  id: number;
  role: "assistant" | "user";
  title?: string;
  body: string;
  mode?: "openai" | "verified-local";
};

const categoryClass: Record<ElementCategory, string> = {
  "metal alcalino": styles.alkali,
  "metal alcalinotérreo": styles.alkaline,
  "metal de transición": styles.transition,
  "metal postransición": styles.postTransition,
  metaloide: styles.metalloid,
  "no metal": styles.nonmetal,
  halógeno: styles.halogen,
  "gas noble": styles.noble,
  lantánido: styles.lanthanide,
  actínido: styles.actinide,
};

const categoryLabels: Record<ElementCategory, string> = {
  "metal alcalino": "Metales alcalinos",
  "metal alcalinotérreo": "Alcalinotérreos",
  "metal de transición": "Metales de transición",
  "metal postransición": "Metales postransición",
  metaloide: "Metaloides",
  "no metal": "No metales",
  halógeno: "Halógenos",
  "gas noble": "Gases nobles",
  lantánido: "Lantánidos",
  actínido: "Actínidos",
};

const trendOptions = Object.entries(trendDefinitions) as [Exclude<TrendKey, "none">, (typeof trendDefinitions)[Exclude<TrendKey, "none">]][];

function ElementTile({
  element,
  trend,
  visible,
  selected,
  compared,
  range,
  onSelect,
}: {
  element: ChemicalElement;
  trend: TrendKey;
  visible: boolean;
  selected: boolean;
  compared: boolean;
  range: { min: number; max: number } | null;
  onSelect: (element: ChemicalElement) => void;
}) {
  const value = trendValue(element, trend);
  const heat = value != null && range
    ? (value - range.min) / Math.max(range.max - range.min, Number.EPSILON)
    : null;
  const ariaValue = trend !== "none" && value != null
    ? `, ${trendDefinitions[trend].label}: ${formatTrendValue(value, trend)}`
    : "";

  return (
    <button
      type="button"
      className={`${styles.element} ${categoryClass[element.category]} ${trend !== "none" && value == null ? styles.noTrendValue : ""} ${visible ? "" : styles.dimmed} ${selected ? styles.selected : ""} ${compared ? styles.compared : ""}`}
      style={{
        ...(element.group ? { gridColumn: element.group } : {}),
        gridRow: element.period,
        ...(heat == null ? {} : { background: `hsl(${48 + heat * 112} 58% ${88 - heat * 30}%)` }),
      }}
      onClick={() => onSelect(element)}
      aria-label={`${element.name}, ${element.symbol}, número atómico ${element.atomicNumber}${ariaValue}`}
      aria-pressed={selected}
    >
      <span className={styles.atomicNumber}>{element.atomicNumber}</span>
      <strong>{element.symbol}</strong>
      <span className={styles.elementName}>{element.name}</span>
      <span className={styles.mass}>{trend !== "none" && value != null ? formatTrendValue(value, trend).replace(` ${trendDefinitions[trend].unit}`, "") : element.atomicMass}</span>
    </button>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{value}</dd>
      {note && <small>{note}</small>}
    </div>
  );
}

export default function PeriodicTableApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ElementCategory | "all">("all");
  const [trend, setTrend] = useState<TrendKey>("none");
  const [selected, setSelected] = useState<ChemicalElement>(elements[5]);
  const [comparison, setComparison] = useState<ChemicalElement[]>([elements[10], elements[16]]);
  const [access, setAccess] = useState<AccessState>({ status: "loading", entitled: false, authenticated: false, access: "purchase_required" });
  const [developerPreview, setDeveloperPreview] = useState(false);
  const [claraInput, setClaraInput] = useState("");
  const [claraLoading, setClaraLoading] = useState(false);
  const [messages, setMessages] = useState<ClaraMessage[]>([
    { id: 1, role: "assistant", title: "Hola, soy Clara", body: "Pregúntame por un elemento o pídeme comparar una propiedad. Respondo con los datos verificados de esta tabla y señalo los valores que no están disponibles." },
  ]);
  const detailsRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setDeveloperPreview(process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).has("preview"));
    let cancelled = false;

    async function checkAccess() {
      try {
        let token = "";
        try {
          const { supabase } = await import("@/lib/supabaseClient");
          const { data } = await supabase.auth.getSession();
          token = data.session?.access_token ?? "";
        } catch {
          // La API devolverá el estado público si Supabase cliente no está configurado.
        }

        const response = await fetch("/api/apps/tabla-periodica/access", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          setAccess({ status: "error", entitled: false, authenticated: Boolean(token), access: "unavailable" });
          return;
        }
        setAccess({
          status: "ready",
          entitled: data.entitled === true,
          authenticated: data.authenticated === true,
          access: data.access,
        });
      } catch {
        if (!cancelled) setAccess({ status: "error", entitled: false, authenticated: false, access: "unavailable" });
      }
    }

    void checkAccess();
    return () => { cancelled = true; };
  }, []);

  const filteredNumbers = useMemo(() => new Set(
    elements
      .filter((element) => matchesElementSearch(element, query))
      .filter((element) => category === "all" || element.category === category)
      .map((element) => element.atomicNumber),
  ), [query, category]);

  const trendRange = useMemo(() => {
    if (trend === "none") return null;
    const values = elements.map((element) => trendValue(element, trend)).filter((value): value is number => value != null);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [trend]);

  const canUseApp = access.entitled || developerPreview;
  const mainElements = elements.filter((element) => element.group !== null);
  const lanthanides = elements.filter((element) => element.atomicNumber >= 57 && element.atomicNumber <= 71);
  const actinides = elements.filter((element) => element.atomicNumber >= 89 && element.atomicNumber <= 103);

  function openElement(element: ChemicalElement) {
    if (!canUseApp) return;
    setSelected(element);
    detailsRef.current?.showModal();
  }

  function toggleComparison(element: ChemicalElement) {
    setComparison((current) => {
      if (current.some((item) => item.atomicNumber === element.atomicNumber)) {
        return current.filter((item) => item.atomicNumber !== element.atomicNumber);
      }
      if (current.length >= 4) return [...current.slice(1), element];
      return [...current, element];
    });
  }

  async function askClara(prompt: string) {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || !canUseApp || claraLoading) return;
    const localAnswer = answerClara(cleanPrompt);
    const messageId = Date.now();
    setClaraLoading(true);
    setClaraInput("");
    setMessages((current) => [
      ...current,
      { id: messageId, role: "user", body: cleanPrompt },
    ]);

    let answer: {
      title: string;
      body: string;
      elementNumbers: number[];
      mode: "openai" | "verified-local";
    } = { ...localAnswer, mode: "verified-local" };
    try {
      if (!developerPreview) {
        const { supabase } = await import("@/lib/supabaseClient");
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) throw new Error("No hay una sesión activa");

        const response = await fetch("/api/apps/tabla-periodica/clara", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: cleanPrompt,
            selectedAtomicNumbers: comparison.map((element) => element.atomicNumber),
          }),
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok || typeof responseData.body !== "string") throw new Error(responseData.error || "Clara no está disponible");
        answer = {
          title: typeof responseData.title === "string" ? responseData.title : localAnswer.title,
          body: responseData.body,
          elementNumbers: Array.isArray(responseData.elementNumbers) ? responseData.elementNumbers : localAnswer.elementNumbers,
          mode: responseData.mode === "openai" ? "openai" : "verified-local",
        };
      }
    } catch {
      // La respuesta local mantiene Clara disponible si el proveedor de IA falla.
    }

    setMessages((current) => [
      ...current,
      { id: messageId + 1, role: "assistant", title: answer.title, body: answer.body, mode: answer.mode },
    ]);
    if (answer.elementNumbers.length) {
      setComparison(answer.elementNumbers.map((number) => elements[number - 1]).filter(Boolean));
    }
    setClaraLoading(false);
  }

  function submitClara(event: FormEvent) {
    event.preventDefault();
    void askClara(claraInput);
  }

  const accessText = developerPreview
    ? "Vista local de revisión"
    : access.status === "loading"
      ? "Comprobando tu acceso…"
      : access.access === "included"
        ? "Incluida en tu paquete de Química"
        : access.access === "licensed"
          ? "Licencia independiente activa"
          : access.access === "unavailable"
            ? "No se pudo comprobar el acceso"
            : "Necesitas una licencia independiente";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Volver a Base12 Academy">
          <Image src="/images/base12-logo.png" alt="Base12 Academy" width={128} height={46} priority />
        </Link>
        <nav aria-label="Secciones de la aplicación">
          <a href="#tabla">Tabla</a>
          <a href="#comparar">Comparar</a>
          <a href="#clara">Clara</a>
        </nav>
        <span className={`${styles.accessPill} ${canUseApp ? styles.accessGranted : ""}`}>{accessText}</span>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Base12 Labs · Química</p>
          <h1>La tabla periódica que explica, no solo ordena.</h1>
          <p className={styles.heroText}>Explora los 118 elementos, reconoce familias, visualiza tendencias y contrasta propiedades sin perder el contexto químico.</p>
        </div>
        <div className={styles.heroStats} aria-label="Resumen de la aplicación">
          <div><strong>118</strong><span>elementos</span></div>
          <div><strong>7</strong><span>periodos</span></div>
          <div><strong>18</strong><span>grupos</span></div>
        </div>
      </section>

      {!canUseApp && access.status !== "loading" && (
        <section className={styles.gate} aria-labelledby="access-title">
          <div>
            <p className={styles.eyebrow}>Tu acceso a la Tabla Periódica</p>
            <h2 id="access-title">{access.authenticated ? "Añade la Tabla Periódica Interactiva a tu cuenta" : "Explora, compara y comprende los 118 elementos"}</h2>
            <p>Si estudias Química con Base12 en los paquetes Esencial o Estándar, ya la tienes incluida. También puedes comprarla por separado con un único pago de 9,99 €.</p>
          </div>
          <div className={styles.gateActions}>
            {!access.authenticated && <Link href="/login?redirect=/apps/tabla-periodica" className={styles.secondaryButton}>Iniciar sesión</Link>}
            <Link href="/apps/tabla-periodica/licencia" className={styles.primaryButton}>Comprar aplicación</Link>
            <Link href="/bachillerato-pau#quimica" className={styles.secondaryButton}>Conocer Química Base12</Link>
          </div>
        </section>
      )}

      <section className={`${styles.workspace} ${canUseApp ? "" : styles.locked}`}>
        {!canUseApp && <div className={styles.lockVeil} aria-hidden="true" />}
        <section id="tabla" className={styles.tableSection}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Explorador</p><h2>Tabla periódica</h2></div>
            <p>{filteredNumbers.size} de 118 elementos visibles</p>
          </div>

          <div className={styles.controls}>
            <label className={styles.searchControl}>
              <span>Buscar elemento</span>
              <input disabled={!canUseApp} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, símbolo o Z" />
            </label>
            <label>
              <span>Familia</span>
              <select disabled={!canUseApp} value={category} onChange={(event) => setCategory(event.target.value as ElementCategory | "all")}>
                <option value="all">Todas las familias</option>
                {elementCategories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}
              </select>
            </label>
            <label>
              <span>Mapa de tendencia</span>
              <select disabled={!canUseApp} value={trend} onChange={(event) => setTrend(event.target.value as TrendKey)}>
                <option value="none">Color por familia</option>
                {trendOptions.map(([key, definition]) => <option key={key} value={key}>{definition.label}</option>)}
              </select>
            </label>
          </div>

          {trend !== "none" && <p className={styles.trendNote}><strong>{trendDefinitions[trend].label}.</strong> {trendDefinitions[trend].explanation}</p>}

          <div className={styles.tableScroll} tabIndex={0} aria-label="Tabla periódica desplazable">
            <div className={styles.groupLabels}>{Array.from({ length: 18 }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
            <div className={styles.periodicGrid}>
              {mainElements.map((element) => <ElementTile key={element.atomicNumber} element={element} trend={trend} range={trendRange} visible={filteredNumbers.has(element.atomicNumber)} selected={selected.atomicNumber === element.atomicNumber} compared={comparison.some((item) => item.atomicNumber === element.atomicNumber)} onSelect={openElement} />)}
              <div className={`${styles.seriesPlaceholder} ${styles.lanthanide}`} style={{ gridColumn: 3, gridRow: 6 }}>57–71<span>Lantánidos</span></div>
              <div className={`${styles.seriesPlaceholder} ${styles.actinide}`} style={{ gridColumn: 3, gridRow: 7 }}>89–103<span>Actínidos</span></div>
            </div>

            <div className={styles.fBlock}>
              <span className={styles.seriesLabel}>Lantánidos</span>
              {lanthanides.map((element) => <ElementTile key={element.atomicNumber} element={element} trend={trend} range={trendRange} visible={filteredNumbers.has(element.atomicNumber)} selected={selected.atomicNumber === element.atomicNumber} compared={comparison.some((item) => item.atomicNumber === element.atomicNumber)} onSelect={openElement} />)}
              <span className={styles.seriesLabel}>Actínidos</span>
              {actinides.map((element) => <ElementTile key={element.atomicNumber} element={element} trend={trend} range={trendRange} visible={filteredNumbers.has(element.atomicNumber)} selected={selected.atomicNumber === element.atomicNumber} compared={comparison.some((item) => item.atomicNumber === element.atomicNumber)} onSelect={openElement} />)}
            </div>
          </div>

          <div className={styles.legend} aria-label="Leyenda de familias">
            {elementCategories.map((item) => <button type="button" disabled={!canUseApp} key={item} onClick={() => setCategory(category === item ? "all" : item)} className={category === item ? styles.legendActive : ""}><i className={categoryClass[item]} />{categoryLabels[item]}</button>)}
          </div>
        </section>

        <section id="comparar" className={styles.compareSection}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Laboratorio de comparación</p><h2>Compara hasta cuatro elementos</h2></div>
            <button type="button" disabled={!canUseApp || comparison.length === 0} onClick={() => setComparison([])} className={styles.textButton}>Limpiar</button>
          </div>
          <div className={styles.comparePicker}>
            {comparison.map((element) => <button type="button" key={element.atomicNumber} onClick={() => toggleComparison(element)}><strong>{element.symbol}</strong><span>{element.name}</span><b aria-label={`Quitar ${element.name}`}>×</b></button>)}
            {comparison.length < 4 && <span>Abre la ficha de un elemento para añadirlo.</span>}
          </div>
          {comparison.length > 0 && (
            <div className={styles.compareTableWrap}>
              <table className={styles.compareTable}>
                <thead><tr><th>Propiedad</th>{comparison.map((element) => <th key={element.atomicNumber}>{element.symbol}<small>{element.name}</small></th>)}</tr></thead>
                <tbody>
                  <tr><th>Número atómico</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.atomicNumber}</td>)}</tr>
                  <tr><th>Masa atómica</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.atomicMass}</td>)}</tr>
                  <tr><th>Electronegatividad</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.electronegativity ?? "—"}</td>)}</tr>
                  <tr><th>Radio atómico</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.atomicRadiusPm ? `${element.atomicRadiusPm} pm` : "—"}</td>)}</tr>
                  <tr><th>1.ª ionización</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.ionizationEnergyEv ? `${element.ionizationEnergyEv} eV` : "—"}</td>)}</tr>
                  <tr><th>Estado estándar</th>{comparison.map((element) => <td key={element.atomicNumber}>{element.standardState}</td>)}</tr>
                  <tr><th>Configuración</th>{comparison.map((element) => <td className={styles.electronConfig} key={element.atomicNumber}>{element.electronConfiguration}</td>)}</tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section id="clara" className={styles.claraSection}>
          <div className={styles.claraIntro}>
            <span className={styles.claraAvatar}>Cl</span>
            <div><p className={styles.eyebrow}>Asistente de química con IA</p><h2>Clara razona con datos, no con conjeturas.</h2><p>La IA recibe el contexto químico verificado de esta tabla. Si el servicio externo no está disponible, Clara conserva una respuesta local basada en los mismos datos.</p></div>
          </div>
          <div className={styles.claraChat} aria-live="polite" aria-busy={claraLoading}>
            <div className={styles.messages}>{messages.slice(-6).map((message) => <article key={message.id} className={message.role === "user" ? styles.userMessage : styles.claraMessage}>{message.title && <strong>{message.title}</strong>}<p>{message.body}</p>{message.mode && <small>{message.mode === "openai" ? "IA · contexto verificado" : "Motor químico local"}</small>}</article>)}{claraLoading && <article className={styles.claraMessage}><p>Clara está razonando…</p></article>}</div>
            <div className={styles.promptChips}>
              {["Compara Na y Cl", "¿Qué estados de oxidación tiene el hierro?", "¿Cómo cambia el radio atómico?"].map((prompt) => <button disabled={!canUseApp || claraLoading} type="button" key={prompt} onClick={() => void askClara(prompt)}>{prompt}</button>)}
            </div>
            <form onSubmit={submitClara} className={styles.claraForm}>
              <label htmlFor="clara-question">Pregunta a Clara</label>
              <div><input id="clara-question" maxLength={600} disabled={!canUseApp || claraLoading} value={claraInput} onChange={(event) => setClaraInput(event.target.value)} placeholder="Ej.: compara el radio de K y Na" /><button disabled={!canUseApp || claraLoading || !claraInput.trim()} type="submit">{claraLoading ? "Pensando…" : "Preguntar"}</button></div>
            </form>
          </div>
        </section>
      </section>

      <section className={styles.sources}>
        <div><p className={styles.eyebrow}>Trazabilidad</p><h2>Fuentes y criterio químico</h2></div>
        <p>Los pesos atómicos estándar proceden de CIAAW 2024. Para elementos sin peso estándar se muestra entre corchetes el número másico del isótopo de referencia. Las propiedades restantes proceden de PubChem; “previsto” identifica predicciones, no medidas.</p>
        <ul>{periodicTable.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a><span>{source.fields}</span></li>)}</ul>
      </section>

      <footer className={styles.footer}><span>Base12 Academy · Tabla Periódica Interactiva</span><Link href="/privacidad">Privacidad</Link><Link href="/terminos-contratacion">Contratación</Link></footer>

      <dialog ref={detailsRef} className={styles.dialog} onClose={() => undefined}>
        <button className={styles.closeButton} type="button" onClick={() => detailsRef.current?.close()} aria-label="Cerrar ficha">×</button>
        <div className={styles.elementHero}>
          <div className={`${styles.largeSymbol} ${categoryClass[selected.category]}`}><small>{selected.atomicNumber}</small><strong>{selected.symbol}</strong></div>
          <div><p className={styles.eyebrow}>{categoryLabels[selected.category]} · bloque {selected.block}</p><h2>{selected.name}</h2><p>Periodo {selected.period} · {selected.group ? `grupo ${selected.group}` : "serie f"} · {selected.standardState}</p></div>
        </div>
        <dl className={styles.factGrid}>
          <Fact label={selected.atomicMassKind === "standard" ? "Peso atómico estándar" : "Número másico de referencia"} value={selected.atomicMass} note={selected.atomicMassKind === "standard" ? "CIAAW 2024, valor abreviado" : "Entre corchetes: no existe peso atómico estándar"} />
          <Fact label="Configuración electrónica" value={selected.electronConfiguration} />
          <Fact label="Electronegatividad" value={selected.electronegativity == null ? "Sin dato" : `${selected.electronegativity} (Pauling)`} />
          <Fact label="Radio atómico" value={selected.atomicRadiusPm == null ? "Sin dato" : `${selected.atomicRadiusPm} pm`} />
          <Fact label="1.ª energía de ionización" value={selected.ionizationEnergyEv == null ? "Sin dato" : `${selected.ionizationEnergyEv} eV`} />
          <Fact label="Afinidad electrónica" value={selected.electronAffinityEv == null ? "Sin dato" : `${selected.electronAffinityEv} eV`} />
          <Fact label="Punto de fusión" value={selected.meltingPointK == null ? "Sin dato" : `${selected.meltingPointK} K`} />
          <Fact label="Punto de ebullición" value={selected.boilingPointK == null ? "Sin dato" : `${selected.boilingPointK} K`} />
          <Fact label="Densidad" value={selected.densityGcm3 == null ? "Sin dato" : `${selected.densityGcm3} g/cm³`} note="Comparar gases solo en condiciones equivalentes" />
          <Fact label="Descubrimiento" value={selected.discovered} />
        </dl>
        <div className={styles.oxidation}><span>Estados de oxidación tabulados</span><div>{selected.oxidationStates.length ? selected.oxidationStates.map((state) => <b key={state}>{state}</b>) : <em>Sin dato</em>}</div></div>
        <button className={styles.compareButton} type="button" onClick={() => toggleComparison(selected)}>{comparison.some((item) => item.atomicNumber === selected.atomicNumber) ? "Quitar de la comparación" : "Añadir a la comparación"}</button>
      </dialog>
    </main>
  );
}
