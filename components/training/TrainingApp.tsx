"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  formatTrainingValue,
  getOfficialTarget,
  isTrainingTestSlug,
  nextTrainingTarget,
  trainingTestMap,
  trainingTests,
  type TrainingSex,
  type TrainingTest,
  type TrainingTestSlug,
} from "@/lib/training-config";
import styles from "./TrainingApp.module.css";

type ResultRow = { id: string; test_slug: TrainingTestSlug; result_value: number | string; perceived_effort?: string | null; performed_at: string };
type Recommendation = { message: string; target: number; exercises: { slug: string; name: string; dose: string }[]; sessionsBeforeControl: number; status?: string; mode?: string };
type AccessState = "loading" | "login" | "locked" | "ready" | "error";

async function authedFetch(path: string, init?: RequestInit) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { response: null, body: null };
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

function numericResults(rows: ResultRow[]) {
  return rows.map((row) => ({ ...row, result_value: Number(row.result_value) }));
}

function testStyle(test: TrainingTest) {
  return {
    "--accent": test.accent,
    "--accent-strong": test.accentStrong,
    "--accent-soft": test.accentSoft,
  } as CSSProperties;
}

function testEmoji(slug: TrainingTestSlug) {
  return slug === "flexiones" ? "⚓" : slug === "plancha" ? "◆" : slug === "carrera-2000" ? "🥾" : "✈";
}

export default function TrainingApp({ testSlug }: { testSlug?: string }) {
  const validTestSlug = testSlug && isTrainingTestSlug(testSlug) ? testSlug : null;
  const [access, setAccess] = useState<AccessState>("loading");
  const [sex, setSex] = useState<TrainingSex | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setNotice("");
    const accessCall = await authedFetch("/api/training/access");
    if (!accessCall.response) { setAccess("login"); return; }
    if (accessCall.response.status === 401) { setAccess("login"); return; }
    if (accessCall.response.status === 403) { setAccess("locked"); return; }
    if (!accessCall.response.ok) { setAccess("error"); return; }
    setAccess("ready");

    const profileCall = await authedFetch("/api/training/profile");
    const profileSex = profileCall.response?.ok && (profileCall.body?.sex === "male" || profileCall.body?.sex === "female") ? profileCall.body.sex as TrainingSex : null;
    setSex(profileSex);

    const resultPath = validTestSlug ? `/api/training/results?test=${validTestSlug}` : "/api/training/results";
    const resultsCall = await authedFetch(resultPath);
    const loadedResults = resultsCall.response?.ok && Array.isArray(resultsCall.body?.results) ? numericResults(resultsCall.body.results) : [];
    setResults(loadedResults);

    if (validTestSlug && profileSex) {
      const carlosCall = await authedFetch("/api/training/carlos", { method: "POST", body: JSON.stringify({ test: validTestSlug }) });
      setRecommendation(carlosCall.response?.ok ? carlosCall.body as Recommendation : null);
    } else {
      setRecommendation(null);
    }
  }, [validTestSlug]);

  useEffect(() => { void load(); }, [load]);

  async function saveSex(nextSex: TrainingSex) {
    setSaving(true);
    const call = await authedFetch("/api/training/profile", { method: "POST", body: JSON.stringify({ sex: nextSex }) });
    setSaving(false);
    if (!call.response?.ok) { setNotice("No se ha podido guardar el perfil de Training."); return; }
    setSex(nextSex);
    await load();
  }

  if (access === "loading") return <TrainingFrame><div className={styles.loading}>Preparando Base12 Training…</div></TrainingFrame>;
  if (access === "login") return <TrainingFrame><div className={styles.onboarding}><h1>Accede a Base12 Training</h1><p>Inicia sesión con la cuenta asociada a tu compra.</p><Link className={styles.primaryButton} href="/login">Iniciar sesión</Link></div></TrainingFrame>;
  if (access === "locked") return <TrainingFrame><div className={styles.onboarding}><h1>Base12 Training</h1><p>Esta aplicación requiere una matrícula activa de Base12 Training.</p><Link className={styles.primaryButton} href="/tropa-y-marineria/base12-training">Ver Base12 Training</Link></div></TrainingFrame>;
  if (access === "error") return <TrainingFrame><div className={styles.onboarding}><h1>No se ha podido comprobar el acceso</h1><p>Inténtalo de nuevo dentro de unos minutos.</p><button className={styles.primaryButton} onClick={() => void load()}>Reintentar</button></div></TrainingFrame>;
  if (!sex) return <TrainingFrame><div className={styles.onboarding}><h1>Configura tus marcas oficiales</h1><p>Las referencias oficiales de algunas pruebas son diferentes para hombres y mujeres. Selecciona la opción que corresponde a tu convocatoria.</p><div className={styles.sexButtons}><button disabled={saving} className={styles.primaryButton} onClick={() => void saveSex("male")}>Hombre</button><button disabled={saving} className={styles.secondaryButton} onClick={() => void saveSex("female")}>Mujer</button></div>{notice && <p className={styles.error}>{notice}</p>}</div></TrainingFrame>;

  if (testSlug && !validTestSlug) return <TrainingFrame><div className={styles.onboarding}><h1>Prueba no encontrada</h1><Link className={styles.primaryButton} href="/apps/base12-training">Volver a Training</Link></div></TrainingFrame>;
  if (validTestSlug) return <TrainingTestView testSlug={validTestSlug} sex={sex} results={results} recommendation={recommendation} reload={load} notice={notice} setNotice={setNotice} saving={saving} setSaving={setSaving} />;
  return <TrainingDashboard sex={sex} results={results} />;
}

function TrainingFrame({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}><header className={styles.header}><div className={styles.headerInner}><Link href="/apps/base12-training" className={styles.brand}><Image src="/images/banco-opositores/logo-base12-training.png" alt="Base12 Training" width={70} height={70} priority /><span>Base12 Training</span></Link><nav className={styles.nav}><Link href="/apps/base12-training">Inicio</Link><Link href="/apps/base12-training#pruebas">Pruebas</Link><Link href="/dashboard/facturas">Mi cuenta</Link></nav></div></header>{children}</div>;
}

function TrainingDashboard({ sex, results }: { sex: TrainingSex; results: ResultRow[] }) {
  const byTest = useMemo(() => Object.fromEntries(trainingTests.map((test) => [test.slug, results.filter((row) => row.test_slug === test.slug)])) as Record<TrainingTestSlug, ResultRow[]>, [results]);
  const priority = useMemo(() => {
    return [...trainingTests].sort((a, b) => deficit(b, byTest[b.slug][0], sex) - deficit(a, byTest[a.slug][0], sex))[0];
  }, [byTest, sex]);
  const priorityLatest = byTest[priority.slug][0]?.result_value ?? null;
  const priorityTarget = nextTrainingTarget(priority, priorityLatest === null ? null : Number(priorityLatest), sex);

  return <TrainingFrame><main className={styles.main}><section className={styles.hero}><div className={styles.heroIntro}><p className={styles.eyebrow}>Preparación física · Tropa y Marinería</p><h1>Tu entrenamiento, prueba a prueba</h1><p>Registra tus marcas, sigue el plan y deja que Carlos ajuste el siguiente objetivo y los ejercicios de cada sesión.</p></div><div className={styles.carlosCard}><Image className={styles.carlosAvatar} src="/images/training/carlos.webp" alt="Carlos, entrenador IA de Base12 Training" width={220} height={220} /><div><h2>Carlos · Entrenador IA</h2><p>He revisado tus cuatro pruebas. Hoy priorizaría <strong>{priority.name}</strong> para acercarnos a {formatTrainingValue(priority, priorityTarget)}.</p></div></div></section><section id="pruebas" className={styles.grid4}>{trainingTests.map((test) => { const latest = byTest[test.slug][0]?.result_value; const target = nextTrainingTarget(test, latest === undefined ? null : Number(latest), sex); const official = getOfficialTarget(test, sex); return <Link key={test.slug} href={`/apps/base12-training/${test.slug}`} className={styles.testCard} style={testStyle(test)}><div className={styles.testIcon}>{testEmoji(test.slug)}</div><h3>{test.name}</h3><div className={styles.miniMetrics}><div><span>Última marca</span><strong>{formatTrainingValue(test, latest === undefined ? null : Number(latest))}</strong></div><div><span>Objetivo Carlos</span><strong>{formatTrainingValue(test, target)}</strong></div></div><span className={styles.status}>{latest === undefined ? "Sin marca inicial" : passed(test, Number(latest), official) ? "Marca oficial superada" : "En progreso"}</span></Link>; })}</section><section className={`${styles.panel} ${styles.today}`}><div className={styles.todayTop}><div><p className={styles.eyebrow}>Hoy te toca</p><h2>{priority.name}</h2><p>Calentamiento obligatorio + trabajo específico. Carlos ajustará la selección de ejercicios con tus resultados recientes.</p></div><Link className={styles.primaryButton} href={`/apps/base12-training/${priority.slug}`}>Comenzar entrenamiento →</Link></div></section></main></TrainingFrame>;
}

function TrainingTestView({ testSlug, sex, results, recommendation, reload, notice, setNotice, saving, setSaving }: { testSlug: TrainingTestSlug; sex: TrainingSex; results: ResultRow[]; recommendation: Recommendation | null; reload: () => Promise<void>; notice: string; setNotice: (value: string) => void; saving: boolean; setSaving: (value: boolean) => void }) {
  const test = trainingTestMap[testSlug];
  const latest = results[0]?.result_value === undefined ? null : Number(results[0].result_value);
  const official = getOfficialTarget(test, sex);
  const target = recommendation?.target ?? nextTrainingTarget(test, latest, sex);
  const exercises = recommendation?.exercises?.length ? recommendation.exercises : test.exercises.slice(0, 4).map((exercise) => ({ slug: exercise.slug, name: exercise.name, dose: exercise.defaultDose }));
  const [rawValue, setRawValue] = useState("");
  const [effort, setEffort] = useState("");
  const [sessionDone, setSessionDone] = useState(false);

  async function saveResult(event: FormEvent) {
    event.preventDefault(); setNotice("");
    const value = parseResult(test, rawValue);
    if (!value || value <= 0) { setNotice("Introduce una marca válida."); return; }
    setSaving(true);
    const call = await authedFetch("/api/training/results", { method: "POST", body: JSON.stringify({ test: test.slug, value, effort: effort || null }) });
    setSaving(false);
    if (!call.response?.ok) { setNotice("No se ha podido guardar la marca."); return; }
    setRawValue(""); setEffort(""); setNotice("Marca guardada. Carlos ha actualizado el siguiente objetivo.");
    await reload();
  }

  async function completeSession() {
    setSaving(true); setNotice("");
    const call = await authedFetch("/api/training/sessions", { method: "POST", body: JSON.stringify({ test: test.slug, exercises }) });
    setSaving(false);
    if (!call.response?.ok) { setNotice("No se ha podido registrar la sesión."); return; }
    setSessionDone(true); setNotice("Sesión registrada. Carlos tendrá en cuenta este trabajo antes del próximo control.");
    await reload();
  }

  return <TrainingFrame><main className={`${styles.main} ${styles.testPage}`} style={testStyle(test)}><section className={styles.testHero}><Link className={styles.back} href="/apps/base12-training">← Volver a Training</Link><div className={styles.testTitleRow}><div><p className={styles.eyebrow}>Prueba física</p><h1>{test.name}</h1><p>Mejora tu marca y llega a la prueba oficial con margen.</p></div><div className={styles.testIcon}>{testEmoji(test.slug)}</div></div></section><section className={styles.carlosTest}><Image src="/images/training/carlos.webp" alt="Carlos" width={330} height={330} /><div className={styles.carlosText}><h2>Carlos recomienda:</h2><p>{recommendation?.message || "Estoy revisando tu última marca y el trabajo acumulado para preparar la siguiente sesión."}</p><span className={styles.carlosMotto}>Progresión · constancia · margen</span></div></section><section className={styles.metrics}><Metric icon="🏆" label="Marca oficial" value={formatTrainingValue(test, official)} /><Metric icon="▥" label="Última prueba" value={formatTrainingValue(test, latest)} /><Metric icon="◎" label="Objetivo Carlos" value={formatTrainingValue(test, target)} /></section><section className={styles.panel}><div className={styles.warmup}><div className={styles.warmupLeft}><div className={styles.roundIcon}>🏃</div><div><h2>Calentamiento obligatorio</h2><p>Calentamiento general + activación específica antes del trabajo principal.</p></div></div><strong>1.º</strong></div></section><section className={styles.panel}><div className={styles.sectionTitle}><h2>Carlos te propone para esta sesión</h2><span className={styles.small}>{recommendation?.mode === "openai" ? "IA + reglas Base12" : "Plan Base12"}</span></div><div className={styles.exerciseList}>{exercises.map((exercise) => <div key={exercise.slug} className={styles.exercise}><strong>{exercise.name}</strong><span>{exercise.dose}</span></div>)}</div><div className={styles.actionRow} style={{ marginTop: 16 }}><p className={styles.small}>Próxima prueba de control: después de {recommendation?.sessionsBeforeControl ?? 2} sesiones específicas.</p><button className={sessionDone ? styles.secondaryButton : styles.primaryButton} disabled={saving || sessionDone} onClick={() => void completeSession()}>{sessionDone ? "Sesión registrada" : "Marcar sesión como completada"}</button></div></section><section className={styles.panel}><h2>Vídeo de entrenamiento</h2><div className={styles.videoBox}>{test.videoUrl ? <iframe src={test.videoUrl} title={`Entrenamiento ${test.name}`} allowFullScreen /> : <div className={styles.videoPlaceholder}><b>Vídeo preparado para YouTube</b><span>En cuanto publiques el MP4 definitivo, añadiremos aquí su enlace sin modificar la interfaz.</span></div>}</div></section><section className={styles.panel}><h2>Registrar nueva marca</h2><form className={styles.form} onSubmit={saveResult}><div className={styles.field}><label htmlFor="training-result">{inputLabel(test)}</label><input id="training-result" inputMode="decimal" placeholder={inputPlaceholder(test)} value={rawValue} onChange={(event) => setRawValue(event.target.value)} /></div><div className={styles.field}><label htmlFor="training-effort">Esfuerzo percibido (opcional)</label><select id="training-effort" value={effort} onChange={(event) => setEffort(event.target.value)}><option value="">Sin indicar</option><option value="easy">Fácil</option><option value="normal">Normal</option><option value="hard">Difícil</option><option value="max">Máximo</option></select></div><button className={styles.primaryButton} disabled={saving} type="submit">Guardar marca</button></form>{notice && <p className={notice.startsWith("Marca") || notice.startsWith("Sesión") ? styles.success : styles.error}>{notice}</p>}</section><section className={styles.panel}><div className={styles.sectionTitle}><h2>Evolución</h2><span className={styles.small}>Referencia oficial: {formatTrainingValue(test, official)}</span></div><ProgressChart test={test} results={results} official={official} /><div className={styles.history}>{results.slice(0, 5).map((row) => <div className={styles.historyRow} key={row.id}><span>{new Date(row.performed_at).toLocaleDateString("es-ES")}</span><strong>{formatTrainingValue(test, Number(row.result_value))}</strong><span>{passed(test, Number(row.result_value), official) ? "Superada" : "En progreso"}</span></div>)}</div></section><nav className={styles.bottomNav}><Link className={styles.active} href="/apps/base12-training">Inicio</Link>{trainingTests.map((item) => <Link key={item.slug} href={`/apps/base12-training/${item.slug}`}>{item.shortName}</Link>)}</nav></main></TrainingFrame>;
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className={styles.metric}><div className={styles.metricIcon}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function deficit(test: TrainingTest, row: ResultRow | undefined, sex: TrainingSex) {
  if (!row) return 10;
  const value = Number(row.result_value); const official = getOfficialTarget(test, sex);
  if (test.direction === "higher_is_better") return Math.max(0, (official - value) / Math.max(official, 1));
  return Math.max(0, (value - official) / Math.max(official, 1));
}

function passed(test: TrainingTest, value: number, official: number) {
  return test.direction === "higher_is_better" ? value >= official : value <= official;
}

function parseResult(test: TrainingTest, raw: string) {
  const normalized = raw.trim().replace(",", ".");
  if (test.slug === "carrera-2000" && normalized.includes(":")) {
    const [minutes, seconds] = normalized.split(":").map(Number);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || seconds < 0 || seconds >= 60) return null;
    return minutes * 60 + seconds;
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

function inputLabel(test: TrainingTest) {
  if (test.slug === "flexiones") return "¿Cuántas flexiones has realizado?";
  if (test.slug === "plancha") return "¿Cuántos segundos has mantenido la plancha?";
  if (test.slug === "carrera-2000") return "Tiempo de 2000 m";
  return "Tiempo del circuito de agilidad";
}

function inputPlaceholder(test: TrainingTest) {
  if (test.slug === "flexiones") return "Ej.: 8";
  if (test.slug === "plancha") return "Ej.: 45";
  if (test.slug === "carrera-2000") return "Ej.: 12:15";
  return "Ej.: 15,8";
}

function ProgressChart({ test, results, official }: { test: TrainingTest; results: ResultRow[]; official: number }) {
  const values = results.slice(0, 10).reverse().map((row) => Number(row.result_value));
  if (!values.length) return <div className={styles.notice}>Todavía no hay marcas registradas para construir la gráfica.</div>;
  const all = [...values, official];
  const min = Math.min(...all); const max = Math.max(...all); const range = Math.max(max - min, test.step || 1);
  const points = values.map((value, index) => { const x = values.length === 1 ? 50 : 6 + (index / (values.length - 1)) * 88; const y = 88 - ((value - min) / range) * 70; return `${x},${y}`; }).join(" ");
  const officialY = 88 - ((official - min) / range) * 70;
  return <div className={styles.chartWrap}><svg className={styles.chart} viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Evolución de ${test.name}`}><line x1="5" y1={officialY} x2="95" y2={officialY} stroke={test.accentStrong} strokeDasharray="2 2" strokeWidth=".8" opacity=".55" /><polyline points={points} fill="none" stroke={test.accentStrong} strokeWidth="2" vectorEffect="non-scaling-stroke" />{values.map((value, index) => { const [x, y] = points.split(" ")[index].split(",").map(Number); return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.5" fill={test.accentStrong} />; })}</svg></div>;
}
