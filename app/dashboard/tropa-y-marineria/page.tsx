"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  motorIsAvailable,
  tropaAptitudes,
  tropaMotors,
  tropaPlanAccess,
  type TropaPlanSlug,
} from "@/lib/tropa-config";
import styles from "./tropa.module.css";

type AccessState =
  | { state: "loading" }
  | { state: "login" }
  | { state: "locked" }
  | { state: "error" }
  | { state: "ready"; planSlug: TropaPlanSlug; administrator: boolean };

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
      if (response.ok && body.allowed && body.planSlug in tropaPlanAccess) {
        setAccess({ state: "ready", planSlug: body.planSlug, administrator: body.access === "administrator" });
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

  const planSlug = access.state === "ready" ? access.planSlug : "esencial";
  const plan = tropaPlanAccess[planSlug];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={142} height={64} priority /></Link>
        <nav><Link href="/tropa-y-marineria">Modalidades</Link><Link href="/dashboard/facturas">Mis facturas</Link></nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Tropa y Marinería · Aula Base12</p>
            <h1>Centro de operaciones psicotécnicas</h1>
            <p>Comprende, practica, comprueba y recupera los ejercicios que necesitas reforzar.</p>
          </div>
          {access.state === "ready" && <aside><span>Paquete activo</span><strong>{plan.label}</strong><small>{plan.questionCount.toLocaleString("es-ES")} preguntas · {plan.motorCount} motores</small></aside>}
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
                  const available = access.state === "ready" && motorIsAvailable(code, planSlug);
                  return <li key={code} className={available ? styles.available : styles.unavailable}><b>{code}</b><span>{motor.name}</span><small>{available ? "Disponible" : `Desde ${tropaPlanAccess[motor.minimumPlan].label}`}</small></li>;
                })}
              </ul>
              <button type="button" disabled={access.state !== "ready"}>Entrenar esta aptitud</button>
            </article>
          ))}
        </section>

        <section className={styles.modules}>
          <article><span>01</span><div><h2>Operaciones</h2><p>Entrenamientos por factor, combinados y completos con dificultad controlada.</p></div><b>En preparación</b></article>
          <article><span>02</span><div><h2>Pruebas de Mar</h2><p>Siete controles de 105 preguntas, equilibrados y vinculados a tu progreso.</p></div><b>En preparación</b></article>
          <article><span>03</span><div><h2>Parte de Operaciones</h2><p>Fortalezas, prioridades y siguiente paso sin etiquetas de apto/no apto.</p></div><b>En preparación</b></article>
          <article><span>04</span><div><h2>Hoja de Servicio</h2><p>Tu evolución, hitos e historial de entrenamiento comparados contigo mismo.</p></div><b>En preparación</b></article>
        </section>

        <p className={styles.notice}><b>Integración segura en curso.</b> La interfaz ya respeta el acceso acumulativo; el banco V4 se activará únicamente después de completar la migración y la carga de prueba.</p>
      </main>
    </div>
  );
}

function AccessMessage({ title, href, action }: { title: string; href: string; action: string }) {
  return <section className={styles.accessMessage}><div><h2>{title}</h2><p>Tu progreso e historial se conservarán cuando amplíes de modalidad.</p></div><Link href={href}>{action}</Link></section>;
}
