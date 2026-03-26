"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LeadChatBot from "@/components/LeadChatBot";
import { supabase } from "../../lib/supabaseClient";
import { BADGES, type BadgeId } from "../../lib/badges";
import { getTopicLockState } from "@/lib/topic-access";
import { temasHistoria } from "@/lib/temas";
import { introVideos } from "@/lib/intro-videos";

const cursos = [
  {
    titulo: "Historia de España",
    precio: "29 €",
    descripcion:
      "Temario, apoyo al estudio, test y preparación académica.",
  },
  {
    titulo: "Historia de la Filosofía",
    precio: "29 €",
    descripcion:
      "Curso estructurado por temas para repaso y comprensión de autores.",
  },
  {
    titulo: "Protocolo Social y Empresarial",
    precio: "39 €",
    descripcion:
      "Formación práctica para situaciones sociales y profesionales.",
  },
  {
    titulo: "Protocolo Institucional",
    precio: "39 €",
    descripcion:
      "Normas, ceremonial y organización en entornos institucionales.",
  },
  {
    titulo: "Gestión Eficaz del Tiempo para Profesionales",
    precio: "35 €",
    descripcion:
      "Mejora tu organización, productividad y planificación diaria.",
  },
];

export default function HomePage() {
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);

  const userBadges = earnedBadges as string[];

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoadingAccess(false);
        setEarnedBadges([]);
        setLoadingBadges(false);
        return;
      }

      // 🔐 comprobar acceso
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("acceso")
        .eq("user_id", user.id)
        .maybeSingle();

      if (perfil?.acceso) {
        setHasAccess(true);
      }

      setLoadingAccess(false);

      // 🎖️ cargar insignias
      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      if (error || !data) {
        setEarnedBadges([]);
        setLoadingBadges(false);
        return;
      }

      const badgeIds = data
        .map((item: any) => item.badge_id)
        .filter((badgeId: string) => BADGES[badgeId as BadgeId]) as BadgeId[];

      setEarnedBadges(badgeIds);
      setLoadingBadges(false);
    };

    loadData();
  }, []);

  // ⏳ mientras carga
  if (loadingAccess) {
    return <p style={{ padding: "40px" }}>Comprobando acceso...</p>;
  }

  // 🔒 si no tiene acceso
  if (!hasAccess) {
    return (
      <>
        <main
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            color: "#111827",
            padding: "64px 24px",
          }}
        >
          <section
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
              Acceso bloqueado
            </h1>

            <p style={{ marginTop: "16px" }}>
              Debes iniciar sesión y tener acceso activo.
            </p>

            <Link href="/login" style={{ marginTop: "20px", display: "inline-block" }}>
              Ir a login →
            </Link>
          </section>
        </main>
        <LeadChatBot />
      </>
    );
  }

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          color: "#111827",
        }}
      >
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "64px 24px 32px",
          }}
        >
          <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
            Base12 Academy
          </h1>

          {/* VIDEOS */}
          <section style={{ marginTop: "40px" }}>
            <h2>Vídeos de introducción</h2>
            <div style={{ display: "grid", gap: "24px", marginTop: "20px" }}>
              {introVideos.map((video) => (
                <div key={video.slug}>
                  <h3>{video.titulo}</h3>
                  <iframe
                    width="100%"
                    height="220"
                    src={video.videoUrl}
                    title={video.titulo}
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>

          {/* TEMARIO */}
          <section style={{ marginTop: "40px" }}>
            <h2>Temario de Historia</h2>

            {temasHistoria.map((tema) => {
              const access = getTopicLockState(tema.slug, userBadges);

              return (
                <div key={tema.slug} style={{ marginBottom: "16px" }}>
                  <h3>{tema.titulo}</h3>

                  {access.accessible ? (
                    <Link href={`/dashboard/tema/${tema.slug}`}>
                      Ver tema →
                    </Link>
                  ) : (
                    <p>🔒 {access.reason}</p>
                  )}
                </div>
              );
            })}
          </section>

          {/* CURSOS */}
          <section id="cursos" style={{ marginTop: "40px" }}>
            <h2>Cursos</h2>

            {cursos.map((curso) => (
              <div key={curso.titulo} style={{ marginBottom: "20px" }}>
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>
                <p>{curso.precio}</p>
              </div>
            ))}
          </section>
        </section>
      </main>

      <LeadChatBot />
    </>
  );
}