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

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginTop: "20px",
      alignItems: "start",
    }}
  >
    {introVideos.map((video) => (
      <div
        key={video.slug}
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>{video.titulo}</h3>

        <iframe
          width="100%"
          height="180"
          src={video.videoUrl}
          title={video.titulo}
          style={{ border: "none", borderRadius: "12px" }}
          allowFullScreen
        />
      </div>
    ))}
  </div>
</section>

                  {/* CURSOS */}
<section id="cursos" style={{ marginTop: "40px" }}>
  <h2>Cursos</h2>

  {cursos.map((curso) => (
    <div key={curso.titulo} style={{ marginBottom: "20px" }}>
      <h3>{curso.titulo}</h3>
      <p>{curso.descripcion}</p>
      <p style={{ color: "#6b7280", fontSize: "14px" }}>{curso.precio}</p>
    </div>
  ))}
</section>

  {/* TEMARIO */}
          <section style={{ marginTop: "40px" }}>
            <h2>Temario de Historia</h2>

            {temasHistoria.map((tema) => {
              const access = { accessible: hasAccess, reason: "Necesitas comprar el curso" };

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

        </section>
      </main>
<footer
  style={{
    marginTop: "64px",
    padding: "40px 24px",
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb",
  }}
>
  <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
    <p style={{ marginBottom: "16px", fontWeight: "bold" }}>
      Base12 Academy
    </p>

    <p style={{ marginBottom: "8px", color: "#6b7280" }}>
      Imagen Digital Ménace, S. L. U.
    </p>
    <p style={{ marginBottom: "8px", color: "#6b7280" }}>
      CIF: B21746086
    </p>
    <p style={{ marginBottom: "8px", color: "#6b7280" }}>
      Calle Lanuza, 8 · 29009 Málaga
    </p>
    <p style={{ marginBottom: "16px", color: "#6b7280" }}>
      Contacto técnico: base12academy@gmail.com
    </p>

    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <Link href="/aviso-legal">Aviso legal</Link>
      <Link href="/privacidad">Política de privacidad</Link>
      <Link href="/cookies">Política de cookies</Link>
      <Link href="/terminos-contratacion">Términos de contratación</Link>
    </div>

    <p style={{ marginTop: "16px", fontSize: "14px", color: "#9ca3af" }}>
      © 2026 Base12 Academy. Todos los derechos reservados.
    </p>
  </div>
</footer>
      <LeadChatBot /> 
    </> 
  ); 
}