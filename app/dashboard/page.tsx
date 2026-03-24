"use client";

import { useEffect, useState } from "react";
import { BADGES, type BadgeId } from "../../lib/badges";
import { supabase } from "../../lib/supabaseClient";
import LeadChatBot from "@/components/LeadChatBot";
import Link from "next/link";
import { getTopicLockState } from "@/lib/topic-access";

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
import { temasHistoria } from "../../lib/temas";
export default function HomePage() {
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  
  const userBadges = earnedBadges as string[];

  useEffect(() => {
    const loadBadges = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setEarnedBadges([]);
        setLoadingBadges(false);
        return;
      }

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

    loadBadges();
  }, []);

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
          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            Base12 Academy
          </p>

          <h1
            style={{
              fontSize: "56px",
              lineHeight: "1.1",
              fontWeight: "bold",
              maxWidth: "900px",
              marginBottom: "20px",
            }}
          >
            Tu dashboard de estudio
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.7",
              maxWidth: "800px",
              color: "#4b5563",
              marginBottom: "28px",
            }}
          >
            Accede a tus pruebas, revisa tu progreso y consulta las insignias que
            ya has conseguido.
          </p>

          <section
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              marginBottom: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Tus insignias
            </h2>

            {loadingBadges ? (
              <p style={{ color: "#6b7280" }}>Cargando insignias...</p>
            ) : earnedBadges.length === 0 ? (
              <p style={{ color: "#6b7280" }}>
                Todavía no has conseguido insignias.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                {earnedBadges.map((badgeId) => (
                  <div
                    key={badgeId}
                    style={{
                      border: "1px solid #dbeafe",
                      background: "#eff6ff",
                      borderRadius: "14px",
                      padding: "16px",
                    }}
                  >
                    <p style={{ fontWeight: "bold", color: "#1d4ed8" }}>
                      {BADGES[badgeId]?.title}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      {BADGES[badgeId]?.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
<section
  style={{
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    marginBottom: "40px",
  }}
>
  <h2
    style={{
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "16px",
    }}
  >
    Temario de Historia
  </h2>

  <div
    style={{
      display: "grid",
      gap: "16px",
    }}
  >
    {temasHistoria.map((tema) => {
  const access = getTopicLockState(tema.slug, userBadges);

  return (
    <div
      key={tema.slug}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "16px",
        background:
          tema.estado === "completado"
            ? "#ecfdf5"
            : tema.estado === "en-progreso"
            ? "#eff6ff"
            : "#f9fafb",
        opacity: access.accessible ? 1 : 0.6,
      }}
    >
      <h3 style={{ fontWeight: "bold", marginBottom: "6px" }}>
        {tema.titulo}
      </h3>

      <p style={{ fontSize: "14px", marginBottom: "10px" }}>
        {tema.descripcion}
      </p>

      {access.accessible ? (
        <Link
          href={`/dashboard/tema/${tema.slug}`}
          style={{
            fontSize: "14px",
            color: "#2563eb",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Ver tema →
        </Link>
      ) : (
        <p
          style={{
            fontSize: "14px",
            color: "#9ca3af",
            fontWeight: "bold",
          }}
        >
          🔒 {access.reason}
        </p>
      )}
    </div>
  );
})}
  </div>
</section>
          <section
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Accesos rápidos
            </h2>

            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              <Link
                href="/dashboard/test"
                style={{
                  display: "block",
                  background: "#111827",
                  color: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  textDecoration: "none",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Test Tema 1
                </p>
                <p style={{ opacity: 0.9 }}>
                  Haz el test y consigue tus primeras insignias.
                </p>
              </Link>

              <Link
                href="/dashboard/cortas"
                style={{
                  display: "block",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  textDecoration: "none",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Cortas Tema 1
                </p>
                <p style={{ opacity: 0.9 }}>
                  Accede a las preguntas cortas cuando estén preparadas.
                </p>
              </Link>
            </div>
          </section>

          <section id="cursos">
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Cursos destacados
            </h2>

            <div
              style={{
                display: "grid",
                gap: "20px",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {cursos.map((curso) => (
                <article
                  key={curso.titulo}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    {curso.titulo}
                  </h3>

                  <p
                    style={{
                      color: "#4b5563",
                      lineHeight: "1.6",
                      marginBottom: "18px",
                    }}
                  >
                    {curso.descripcion}
                  </p>

                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#2563eb",
                      marginBottom: "18px",
                    }}
                  >
                    {curso.precio}
                  </p>

                  <button
                    style={{
                      padding: "12px 18px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#2563eb",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Más información
                  </button>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

<LeadChatBot />
</>
);
}