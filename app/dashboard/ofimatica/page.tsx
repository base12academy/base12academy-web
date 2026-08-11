"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import course from "@/lib/ofimatica-content.json";
import { supabase } from "@/lib/supabaseClient";
import styles from "./ofimatica.module.css";

type Tab = "explicacion" | "glosario" | "rocio" | "fernando" | "actividad";

export default function OfimaticaPage() {
  return <Suspense fallback={<div className={styles.loading}>Preparando el aula de Ofimática…</div>}><OfimaticaCourse /></Suspense>;
}

function OfimaticaCourse() {
  const search = useSearchParams();
  const requested = (search.get("contenido") || "G01_V01").toUpperCase();
  const allLessons = useMemo(() => course.groups.flatMap((group) => group.lessons.map((lesson) => ({ ...lesson, group }))), []);
  const selected = allLessons.find((lesson) => lesson.id === requested) || allLessons[0];
  const [tab, setTab] = useState<Tab>("explicacion");
  const [allowed, setAllowed] = useState(selected.publicPreview);
  const [access, setAccess] = useState(selected.publicPreview ? "public_preview" : "checking");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      setShowVideo(false);
      const { data } = await supabase.auth.getSession();
      const response = await fetch(`/api/course-access?lesson=${encodeURIComponent(selected.id)}`, {
        headers: data.session?.access_token ? { Authorization: `Bearer ${data.session.access_token}` } : {},
      });
      const result = await response.json().catch(() => ({}));
      if (active) {
        setAllowed(Boolean(result.allowed));
        setAccess(result.access || "subscription_required");
      }
    };
    check();
    return () => { active = false; };
  }, [selected.id]);

  const videoBase = process.env.NEXT_PUBLIC_OFIMATICA_VIDEO_BASE_URL?.replace(/\/$/, "");
  const videoUrl = videoBase ? `${videoBase}/${selected.videoFile}` : "";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>B12 <span>Base12 Academy</span></Link>
        <p className={styles.eyebrow}>PROGRAMA</p>
        <h2>Curso de Ofimática</h2>
        <div className={styles.progress}><span /></div>
        <nav className={styles.index}>
          {course.groups.map((group) => (
            <details key={group.id} open={group.id === selected.group.id}>
              <summary>{group.id.slice(1)}. {group.title}</summary>
              {group.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/dashboard/ofimatica?contenido=${lesson.id}`} className={lesson.id === selected.id ? styles.active : ""}>
                  {lesson.id === "G01_V01" ? "● " : ""}{lesson.title}
                </Link>
              ))}
            </details>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topline}>
          <span>{selected.group.title} · {selected.id}</span>
          {access === "administrator" && <b>Vista completa de administrador</b>}
          {access === "public_preview" && <b>Unidad abierta</b>}
        </div>
        <h1>{selected.title}</h1>
        <p className={styles.subtitle}>Contenido práctico del programa de Ofimática de Base12 Academy.</p>

        {!allowed ? (
          <section className={styles.locked}>
            <h2>Este contenido requiere acceso al curso</h2>
            <p>La primera unidad está abierta. Para continuar, inicia sesión y activa una matrícula o una clave personal.</p>
            <div><Link href="/dashboard/ofimatica?contenido=G01_V01">Ver la unidad abierta</Link><Link href="/dashboard/comprar/ofimatica-esencial">Ver modalidades</Link></div>
          </section>
        ) : (
          <>
            <section className={styles.videoCard}>
              {!showVideo ? (
                <button onClick={() => setShowVideo(true)}>▶ Ver vídeo de este contenido</button>
              ) : videoUrl ? (
                <video controls autoPlay preload="metadata"><source src={videoUrl} type="video/mp4" /></video>
              ) : (
                <div className={styles.videoPending}>El vídeo está preparado y se mostrará aquí cuando termine la carga al alojamiento.</div>
              )}
            </section>

            <div className={styles.tabs}>
              {(["explicacion", "glosario", "rocio", "fernando", "actividad"] as Tab[]).map((name) => (
                <button key={name} onClick={() => setTab(name)} className={tab === name ? styles.selectedTab : ""}>
                  {name === "rocio" ? "Rocío · Profesora IA" : name === "fernando" ? "Fernando · Tutor IA" : name[0].toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>

            <section className={styles.contentCard}>
              {tab === "explicacion" && <TextContent title="Explicación del contenido" text={selected.explanation} />}
              {tab === "glosario" && <TextContent title="Glosario" text={selected.glossary} />}
              {tab === "actividad" && <TextContent title="Pruebas, retos y prácticas" text={selected.activities} />}
              {tab === "rocio" && <Assistant name="Rocío" role="Profesora IA" text="Te explica el contenido paso a paso, propone ejemplos y resuelve dudas académicas sobre esta unidad." />}
              {tab === "fernando" && <Assistant name="Fernando" role="Tutor IA" text="Te ayuda a organizar el estudio, comprueba tu avance y te orienta para retomar el curso si te has despistado." />}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function TextContent({ title, text }: { title: string; text: string }) {
  return <><h2>{title}</h2><div className={styles.pre}>{text || "Contenido en preparación."}</div></>;
}

function Assistant({ name, role, text }: { name: string; role: string; text: string }) {
  return <div className={styles.assistant}><div className={styles.avatar}>{name[0]}</div><div><p className={styles.eyebrow}>{role}</p><h2>{name}</h2><p>{text}</p><button>Preguntar sobre este contenido</button></div></div>;
}
