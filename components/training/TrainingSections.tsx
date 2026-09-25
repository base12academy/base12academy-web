"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  formatTrainingValue,
  getBestTrainingValue,
  getOfficialTarget,
  getTrainingProgressState,
  nextTrainingTarget,
  TRAINING_ACCOUNT_URL,
  TRAINING_ACADEMIC_URL,
  TRAINING_OFFICIAL_VIDEO_URL,
  TRAINING_SALES_URL,
  trainingTests,
  type TrainingSex,
  type TrainingTest,
  type TrainingTestSlug,
} from "@/lib/training-config";
import styles from "./TrainingApp.module.css";
import headerStyles from "./TrainingHeader.module.css";

type Section = "plan" | "biblioteca" | "progreso";
type AccessState = "loading" | "login" | "locked" | "ready" | "error";
type ResultRow = { id: string; test_slug: TrainingTestSlug; result_value: number | string; performed_at: string };
type Recommendation = { message: string; target: number; exercises: { slug: string; name: string; dose: string }[]; sessionsBeforeControl: number };

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

function testStyle(test: TrainingTest) {
  return {
    "--accent": test.accent,
    "--accent-strong": test.accentStrong,
    "--accent-soft": test.accentSoft,
  } as CSSProperties;
}

function Header({ active }: { active: Section }) {
  return <header className={styles.header}><div className={`${styles.headerInner} ${headerStyles.compactHeader}`}><Link href="/apps/base12-training" className={`${styles.brand} ${headerStyles.compactBrand}`}><Image src="/images/banco-opositores/logo-base12-training.png" alt="Base12 Training" width={140} height={159} priority /><span>Training</span></Link><nav className={`${styles.nav} ${headerStyles.compactNav}`} aria-label="Navegación de Training"><Link className={headerStyles.academicLink} href={TRAINING_ACADEMIC_URL}>Preparación Tropa y Marinería</Link><Link href="/apps/base12-training">Inicio</Link><Link href="/apps/base12-training/plan" aria-current={active === "plan" ? "page" : undefined}>Plan</Link><Link href="/apps/base12-training/biblioteca" aria-current={active === "biblioteca" ? "page" : undefined}>Biblioteca</Link><Link href="/apps/base12-training/progreso" aria-current={active === "progreso" ? "page" : undefined}>Progreso</Link><Link href={TRAINING_ACCOUNT_URL}>Mi cuenta</Link></nav></div></header>;
}

export default function TrainingSections({ section }: { section: Section }) {
  const [access, setAccess] = useState<AccessState>("loading");
  const [sex, setSex] = useState<TrainingSex | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [recommendations, setRecommendations] = useState<Partial<Record<TrainingTestSlug, Recommendation>>>({});

  const load = useCallback(async () => {
    const accessCall = await authedFetch("/api/training/access");
    if (!accessCall.response) { setAccess("login"); return; }
    if (accessCall.response.status === 401) { setAccess("login"); return; }
    if (accessCall.response.status === 403) { setAccess("locked"); return; }
    if (!accessCall.response.ok) { setAccess("error"); return; }
    setAccess("ready");

    const [profileCall, resultsCall] = await Promise.all([
      authedFetch("/api/training/profile"),
      authedFetch("/api/training/results"),
    ]);
    const profileSex = profileCall.response?.ok && (profileCall.body?.sex === "male" || profileCall.body?.sex === "female") ? profileCall.body.sex as TrainingSex : null;
    setSex(profileSex);
    setResults(resultsCall.response?.ok && Array.isArray(resultsCall.body?.results) ? resultsCall.body.results : []);

    if (section === "plan" && profileSex) {
      const calls = await Promise.all(trainingTests.map((test) => authedFetch("/api/training/carlos", { method: "POST", body: JSON.stringify({ test: test.slug }) })));
      const mapped: Partial<Record<TrainingTestSlug, Recommendation>> = {};
      calls.forEach((call, index) => { if (call.response?.ok) mapped[trainingTests[index].slug] = call.body as Recommendation; });
      setRecommendations(mapped);
    }
  }, [section]);

  useEffect(() => { void load(); }, [load]);

  if (access === "loading") return <div className={styles.page}><Header active={section} /><div className={styles.loading}>Preparando Base12 Training…</div></div>;
  if (access === "login") return <Gate section={section} title="Accede a Base12 Training" text="Inicia sesión con la cuenta asociada a tu compra." href="/login?redirect=%2Fapps%2Fbase12-training" button="Iniciar sesión" />;
  if (access === "locked") return <Gate section={section} title="Base12 Training" text="Esta aplicación requiere una matrícula activa de Base12 Training." href={TRAINING_SALES_URL} button="Ver Base12 Training" />;
  if (access === "error") return <Gate section={section} title="No se ha podido comprobar el acceso" text="Inténtalo de nuevo dentro de unos minutos." href="/apps/base12-training" button="Volver al inicio" />;
  if (!sex && section !== "biblioteca") return <Gate section={section} title="Completa primero tu perfil" text="Entra en la pantalla principal de Training y selecciona la referencia oficial que corresponde a tu convocatoria." href="/apps/base12-training" button="Ir a Training" />;

  return <div className={styles.page}><Header active={section} /><main className={styles.main}>{section === "plan" && sex ? <Plan sex={sex} results={results} recommendations={recommendations} /> : null}{section === "biblioteca" ? <Library /> : null}{section === "progreso" && sex ? <Progress sex={sex} results={results} /> : null}</main></div>;
}

function Gate({ section, title, text, href, button }: { section: Section; title: string; text: string; href: string; button: string }) {
  return <div className={styles.page}><Header active={section} /><div className={styles.onboarding}><h1>{title}</h1><p>{text}</p><Link className={styles.primaryButton} href={href}>{button}</Link></div></div>;
}

function Plan({ sex, results, recommendations }: { sex: TrainingSex; results: ResultRow[]; recommendations: Partial<Record<TrainingTestSlug, Recommendation>> }) {
  const grouped = useMemo(() => Object.fromEntries(trainingTests.map((test) => [test.slug, results.filter((row) => row.test_slug === test.slug)])) as Record<TrainingTestSlug, ResultRow[]>, [results]);
  return <><section className={styles.testHero}><p className={styles.eyebrow}>Carlos · Plan adaptativo</p><h1>Tu plan actual</h1><p>El plan se actualiza con cada marca y cada sesión registrada. Aquí no se fijan días artificiales: Carlos decide el siguiente trabajo dentro del repertorio validado de cada prueba.</p></section><section className={styles.grid4}>{trainingTests.map((test) => { const rows = grouped[test.slug]; const latest = rows[0] ? Number(rows[0].result_value) : null; const recommendation = recommendations[test.slug]; const target = recommendation?.target ?? nextTrainingTarget(test, latest, sex); return <article key={test.slug} className={styles.testCard} style={testStyle(test)}><h3>{test.name}</h3><div className={styles.miniMetrics}><div><span>Última marca</span><strong>{formatTrainingValue(test, latest)}</strong></div><div><span>Siguiente objetivo</span><strong>{formatTrainingValue(test, target)}</strong></div></div><span className={styles.status}>{getTrainingProgressState(test, rows.map((row) => Number(row.result_value)), sex)}</span><p>{recommendation?.message ?? "Carlos está preparando la siguiente propuesta."}</p><div className={styles.exerciseList}>{(recommendation?.exercises ?? test.exercises.slice(0, 3).map((exercise) => ({ ...exercise, dose: exercise.defaultDose }))).slice(0, 3).map((exercise) => <div className={styles.exercise} key={exercise.slug}><strong>{exercise.name}</strong><span>{exercise.dose}</span></div>)}</div><p className={styles.small}>Control recomendado tras {recommendation?.sessionsBeforeControl ?? 2} sesiones específicas.</p><Link className={styles.secondaryButton} href={`/apps/base12-training/${test.slug}`}>Abrir prueba</Link></article>; })}</section></>;
}

function Library() {
  const warmupGeneral = ["Trote suave", "Carrera lateral", "Skipping bajo y medio", "Talones al glúteo", "Carrera hacia atrás", "Progresiones", "Movilidad de tobillo, rodilla y cadera", "Balanceos de pierna", "Movilidad de tronco y tórax", "Rotaciones de hombros y círculos de brazos", "Movilidad de muñeca"];
  return <>
    <section className={styles.testHero}>
      <p className={styles.eyebrow}>Repertorio validado</p>
      <h1>Biblioteca de ejercicios</h1>
      <p>Carlos solo puede seleccionar ejercicios de esta biblioteca. El calentamiento es transversal: se realiza antes del trabajo específico y no constituye una quinta prueba.</p>
    </section>
    <section className={styles.panel}>
      <h2>Calentamiento transversal</h2>
      <div className={styles.exerciseList}>{warmupGeneral.map((name) => <div className={styles.exercise} key={name}><strong>{name}</strong><span>Previo</span></div>)}</div>
    </section>
    <section className={styles.panel}>
      <h2>Referencia oficial del Ministerio de Defensa</h2>
      <p>Consulta la explicación oficial de las pruebas físicas. Complementa los vídeos prácticos de Base12 Training.</p>
      <div className={styles.videoBox}><iframe src={TRAINING_OFFICIAL_VIDEO_URL} title="Pruebas físicas de Tropa y Marinería · Ministerio de Defensa" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
    </section>
    {trainingTests.map((test) => <section className={styles.panel} style={testStyle(test)} key={test.slug}>
      <div className={styles.sectionTitle}><h2>{test.name}</h2><Link href={`/apps/base12-training/${test.slug}`}>Abrir prueba</Link></div>
      <div className={styles.videoBox}><iframe src={test.videoUrl} title={`Entrenamiento ${test.name}`} allowFullScreen /></div>
      <div className={styles.exerciseList}>{test.exercises.map((exercise) => <div className={styles.exercise} key={exercise.slug}><strong>{exercise.name}</strong><span>{exercise.defaultDose}</span></div>)}</div>
    </section>)}
  </>;
}

function Progress({ sex, results }: { sex: TrainingSex; results: ResultRow[] }) {
  const grouped = useMemo(() => Object.fromEntries(trainingTests.map((test) => [test.slug, results.filter((row) => row.test_slug === test.slug)])) as Record<TrainingTestSlug, ResultRow[]>, [results]);
  const consolidated = trainingTests.filter((test) => getTrainingProgressState(test, grouped[test.slug].map((row) => Number(row.result_value)), sex) === "Consolidada").length;
  return <><section className={styles.testHero}><p className={styles.eyebrow}>Evolución global</p><h1>Tu progreso</h1><p>{consolidated} de 4 pruebas consolidadas. Una prueba se considera consolidada cuando las tres últimas marcas registradas superan la referencia oficial.</p></section><section className={styles.grid4}>{trainingTests.map((test) => { const rows = grouped[test.slug]; const values = rows.map((row) => Number(row.result_value)); const latest = values[0] ?? null; const best = getBestTrainingValue(test, values); const official = getOfficialTarget(test, sex); const state = getTrainingProgressState(test, values, sex); return <Link key={test.slug} href={`/apps/base12-training/${test.slug}`} className={styles.testCard} style={testStyle(test)}><h3>{test.name}</h3><div className={styles.miniMetrics}><div><span>Última</span><strong>{formatTrainingValue(test, latest)}</strong></div><div><span>Mejor</span><strong>{formatTrainingValue(test, best)}</strong></div><div><span>Oficial</span><strong>{formatTrainingValue(test, official)}</strong></div><div><span>Controles</span><strong>{rows.length}</strong></div></div><span className={styles.status}>{state}</span></Link>; })}</section></>;
}
