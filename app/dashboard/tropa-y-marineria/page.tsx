"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  tropaAptitudes,
  tropaMotors,
  tropaPlanAccess,
  type TropaPlanSlug,
} from "@/lib/tropa-config";
import styles from "./tropa.module.css";
import classroom from "@/components/OppositionCourse.module.css";

type AccessState =
  | { state: "loading" }
  | { state: "login" }
  | { state: "locked" }
  | { state: "error" }
  | {
      state: "ready";
      planSlug: TropaPlanSlug | null;
      label: string;
      questionCount: number;
      motorCount: number;
      aptitudeSlugs: string[];
      availableMotors: string[];
      administrator: boolean;
    };

export default function TropaDashboardPage() {
  const [access, setAccess] = useState<AccessState>({ state: "loading" });

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        if (active) setAccess({ state: "login" });
        return;
      }
      const response = await fetch("/api/tropa/access", { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json().catch(() => ({}));
      if (!active) return;
      if (response.ok && body.allowed && Array.isArray(body.aptitudeSlugs)) {
        setAccess({
          state: "ready",
          planSlug: body.planSlug && body.planSlug in tropaPlanAccess ? body.planSlug : null,
          label: String(body.label || "Tropa y Marinería"),
          questionCount: Number(body.questionCount || 0),
          motorCount: Number(body.motorCount || 0),
          aptitudeSlugs: body.aptitudeSlugs.map(String),
          availableMotors: Array.isArray(body.availableMotors) ? body.availableMotors.map(String) : [],
          administrator: body.access === "administrator",
        });
      } else if (response.status === 401) {
        setAccess({ state: "login" });
      } else if (response.status === 403) {
        setAccess({ state: "locked" });
      } else {
        setAccess({ state: "error" });
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={90} height={90} priority /></Link>
        <nav><Link href="/tropa-y-marineria">Modalidades</Link><Link href="/dashboard/facturas">Mis facturas</Link></nav>
      </header>
      <div className={classroom.columns}>
      <aside className={classroom.sidebar}><Link className={classroom.back} href="/dashboard/mis-cursos">← Volver a Mis cursos</Link><h2>Aptitudes del curso</h2><div className={classroom.themes}>{tropaAptitudes.map((aptitude,index)=><Link key={aptitude.slug} href={`/dashboard/tropa-y-marineria/${aptitude.slug}`}><span>{index+1}</span><span>{aptitude.name}</span></Link>)}</div><h2>Recursos del curso</h2><Link className={classroom.sideLink} href="/dashboard/tropa-y-marineria/simulacros">Simulacros</Link><Link className={classroom.sideLink} href="/dashboard/tropa-y-marineria/operaciones#hoja">Mi progreso</Link></aside>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Tropa y Marinería · Aula Base12</p>
            <h1>Centro de operaciones psicotécnicas</h1>
            <p>Comprende, practica, comprueba y recupera los ejercicios que necesitas reforzar.</p>
          </div>
          {access.state === "ready" && <aside><span>Acceso activo</span><strong>{access.label}</strong><small>{access.questionCount.toLocaleString("es-ES")} preguntas · {access.motorCount} motores</small></aside>}
        </section>

        {access.state === "loading" && <section className={styles.notice}>Comprobando tu acceso al curso…</section>}
        {access.state === "login" && <AccessMessage title="Inicia sesión para entrar en el curso" href="/login" action="Iniciar sesión" />}
        {access.state === "locked" && <AccessMessage title="Todavía no tienes una matrícula activa de Tropa y Marinería" href="/tropa-y-marineria" action="Ver modalidades" />}
        {access.state === "error" && <section className={styles.notice}>No se ha podido comprobar el acceso. Inténtalo de nuevo dentro de unos minutos.</section>}

        <section className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>Siete aptitudes</p><h2>Elige el factor que vas a entrenar</h2></div>
          <span>Niveles N1–N5</span>
        </section>
        <section className={styles.aptitudes} aria-label="Aptitudes Tropa y Marinería">
          {tropaAptitudes.map((aptitude, index) => (
            <article key={aptitude.slug} className={styles.card}>
              <div className={styles.cardTop}><span>{String(index + 1).padStart(2, "0")}</span><b>{aptitude.code}</b></div>
              <h3>{aptitude.name}</h3>
              <ul>
                {aptitude.motors.map((code) => {
                  const motor = tropaMotors[code];
                  const available = access.state === "ready" && access.availableMotors.includes(code);
                  return <li key={code} className={available ? styles.available : styles.unavailable}><b>{code}</b><span>{motor.name}</span><small>{available ? "Disponible" : `Desde ${tropaPlanAccess[motor.minimumPlan].label}`}</small></li>;
                })}
              </ul>
              {access.state === "ready" && access.aptitudeSlugs.includes(aptitude.slug) ? (
                <Link className={styles.trainLink} href={`/dashboard/tropa-y-marineria/${aptitude.slug}`}>Entrenar esta aptitud</Link>
              ) : (
                <button type="button" disabled>Sin acceso a esta aptitud</button>
              )}
            </article>
          ))}
        </section>

        <section className={styles.modules}>
          <article><span>01</span><div><h2>Operaciones</h2><p>Entrenamientos por factor, combinados y completos con dificultad controlada.</p></div><Link href="/dashboard/tropa-y-marineria/operaciones">Abrir</Link></article>
          <article><span>02</span><div><h2>Simulacros y Pruebas de Mar</h2><p>Veinte simulacros auditados, equilibrados y vinculados a tu progreso.</p></div><Link href="/dashboard/tropa-y-marineria/simulacros">Abrir</Link></article>
          <article><span>03</span><div><h2>Parte de Operaciones</h2><p>Fortalezas, prioridades y siguiente paso sin etiquetas de apto/no apto.</p></div><Link href="/dashboard/tropa-y-marineria/operaciones#parte">Abrir</Link></article>
          <article><span>04</span><div><h2>Hoja de Servicio</h2><p>Tu evolución, hitos e historial de entrenamiento comparados contigo mismo.</p></div><Link href="/dashboard/tropa-y-marineria/operaciones#hoja">Abrir</Link></article>
        </section>

        <p className={styles.notice}><b>Contenido protegido.</b> El aula aplica los permisos de tu compra en cada consulta; las respuestas y explicaciones nunca se entregan antes de responder.</p>
      </main>
      <aside className={classroom.rail}><section className={classroom.help}><div><h2>¿Necesitas ayuda?</h2><p>Consulta tus dudas y organiza tu preparación.</p></div></section>{([['rocio','Rocío','Profesora IA','Comprende los procedimientos de los ejercicios.'],['fernando','Fernando','Tutor IA','Organiza tu entrenamiento y decide qué reforzar.']] as const).map(([role,name,label,description])=><section className={classroom.mentor} key={role}><Image src={`/images/${role==='rocio'?'rocio-profesora-ia':'fernando-tutor-ia'}.png?v=oficial-20261119`} alt={name} width={1536} height={1024}/><div><h3>{name} · {label}</h3><p>{description}</p></div><Link className={classroom.secondary} href={access.state==='ready'&&access.aptitudeSlugs.length?`/dashboard/tropa-y-marineria/${access.aptitudeSlugs[0]}?assistant=${role}`:'/login'}>Hablar con {name}</Link></section>)}</aside>
      </div>
    </div>
  );
}

function AccessMessage({ title, href, action }: { title: string; href: string; action: string }) {
  return <section className={styles.accessMessage}><div><h2>{title}</h2><p>Tu progreso e historial se conservarán cuando amplíes de modalidad.</p></div><Link href={href}>{action}</Link></section>;
}
