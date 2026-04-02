"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LeadChatBot from "@/components/LeadChatBot";
import { supabase } from "../../lib/supabaseClient";
import { temasHistoria } from "@/lib/temas";
import { introVideos } from "@/lib/intro-videos";
import { BADGES } from "@/lib/badges";
import { CONFIG_COMUNIDADES, type ComunidadId } from "@/lib/config-comunidades";

const COLORS = {
  muted: "#6b7280",
};

const cursos = [
  {
    titulo: "Historia de España",
    precio: "29 €",
    descripcion: "Temario, apoyo al estudio, test y preparación académica.",
  },
  {
    titulo: "Historia de la Filosofía",
    precio: "29 €",
    descripcion: "Curso estructurado por temas para repaso y comprensión de autores.",
  },
  {
    titulo: "Protocolo Social y Empresarial",
    precio: "39 €",
    descripcion: "Formación práctica para situaciones sociales y profesionales.",
  },
  {
    titulo: "Protocolo Institucional",
    precio: "39 €",
    descripcion: "Normas, ceremonial y organización en entornos institucionales.",
  },
  {
    titulo: "Gestión Eficaz del Tiempo para Profesionales",
    precio: "35 €",
    descripcion: "Mejora tu organización, productividad y planificación diaria.",
  },
];

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [temasActivos, setTemasActivos] = useState<string[]>([]);
  const [comunidad, setComunidad] = useState<string>("");
  
  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setHasAccess(false);
        setLoadingAccess(false);
        return;
      }

      const { data: perfil } = await supabase
  .from("perfiles")
  .select("acceso, comunidad, temas_activos")
  .eq("user_id", user.id)
  .maybeSingle();

if (perfil?.acceso) {
  setHasAccess(true);
}

if (perfil?.comunidad) {
  setComunidad(perfil.comunidad);
}

if (Array.isArray(perfil?.temas_activos)) {
  setTemasActivos(perfil.temas_activos);
}

if (perfil?.acceso && (!perfil?.temas_activos || perfil.temas_activos.length === 0)) {
  window.location.assign("/dashboard/seleccion-temas");
  return;
}

      setLoadingAccess(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const savedBadges = localStorage.getItem("historia-badges");
    if (savedBadges) {
      setEarnedBadges(JSON.parse(savedBadges));
    }

    const savedScores = localStorage.getItem("historia-best-scores");
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  const completedTopics = useMemo(() => {
    return Object.values(bestScores).filter((score) => score >= 80).length;
  }, [bestScores]);

  const totalTopics = temasHistoria.length;

  const temasVisibles =
  hasAccess && temasActivos.length > 0
    ? temasHistoria.filter((tema) => temasActivos.includes(tema.slug))
    : temasHistoria;

  const temasOrdenados = [...temasVisibles].sort((a, b) => {
    const aImportante = a.comunidadClave?.includes(comunidad);
    const bImportante = b.comunidadClave?.includes(comunidad);

    if (aImportante && !bImportante) return -1;
    if (!aImportante && bImportante) return 1;
    return 0;
  });

  const comunidadConfig =
    comunidad && CONFIG_COMUNIDADES[comunidad as ComunidadId]
      ? CONFIG_COMUNIDADES[comunidad as ComunidadId]
      : null;

  const guardarComunidad = async (valor: string) => {
    setComunidad(valor);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    await supabase
      .from("perfiles")
      .update({ comunidad: valor })
      .eq("user_id", user.id);
  };

  if (loadingAccess) {
    return <p style={{ padding: "40px" }}>Comprobando acceso...</p>;
  }


if (hasAccess && temasActivos.length === 0) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "48px 24px",
        color: "#111827",
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
            Elige tus 25 temas
          </h1>

          <p style={{ fontSize: "18px", lineHeight: "1.7", color: "#4b5563", marginBottom: "24px" }}>
            Tu acceso ya está activo. Antes de empezar, debes seleccionar tus 25 temas.
          </p>

          <Link
            href="/dashboard/seleccion-temas"
            style={{
              display: "inline-block",
              textAlign: "center",
              padding: "14px 20px",
              background: "#2563eb",
              color: "white",
              borderRadius: "14px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Elegir mis 25 temas
          </Link>
        </div>
      </section>
    </main>
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
          <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>Área de estudio</h1>

          <div style={{ marginTop: "20px", marginBottom: "24px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Tu comunidad autónoma
            </p>

            <select
              value={comunidad}
              onChange={(e) => guardarComunidad(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "260px",
              }}
            >
              <option value="">Selecciona tu comunidad</option>
              <option value="andalucia">Andalucía</option>
              <option value="madrid">Madrid</option>
              <option value="valencia">Comunidad Valenciana</option>
              <option value="castilla_leon">Castilla y León</option>
              <option value="galicia">Galicia</option>
              <option value="aragon">Aragón</option>
              <option value="navarra">Navarra</option>
              <option value="rioja">La Rioja</option>
              <option value="cantabria">Cantabria</option>
              <option value="murcia">Murcia</option>
              <option value="extremadura">Extremadura</option>
              <option value="ministerio">Modelo Ministerio</option>
            </select>
          </div>

          {comunidadConfig && (
            <section
              style={{
                marginBottom: "24px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
                Estrategia para {comunidadConfig.nombre}
              </h2>

              <p style={{ marginBottom: "10px", color: "#374151" }}>
                <strong>Tipo de examen:</strong> {comunidadConfig.tipoExamen}
              </p>

              <p style={{ marginBottom: "10px", color: "#374151" }}>
                <strong>Enfoque clave:</strong> {comunidadConfig.enfoque}
              </p>

              <div>
                <strong>Consejos:</strong>
                <ul style={{ marginTop: "10px", paddingLeft: "20px", color: "#4b5563" }}>
                  {comunidadConfig.consejos.map((consejo, i) => (
                    <li key={i} style={{ marginBottom: "6px" }}>
                      {consejo}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section style={{ marginTop: "32px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                  color: "white",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p>Progreso</p>
                <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                  {completedTopics}/{totalTopics}
                </p>
              </div>

              <div
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p>Medallas</p>
                <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                  {earnedBadges.length}
                </p>
              </div>

              <div
                style={{
                  background: hasAccess
                    ? "linear-gradient(135deg, #16a34a, #4ade80)"
                    : "#f3f4f6",
                  color: hasAccess ? "white" : "#374151",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <p>Estado</p>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {hasAccess ? "Activo" : "Pendiente"}
                </p>
              </div>
            </div>
          </section>

          <p style={{ marginTop: "12px", fontSize: "18px", color: "#4b5563" }}>
            Avanza por fases: comprende, fija en memoria y aplica como en la EBAU / PAU.
          </p>

<div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  }}
>
  <Link
    href="/dashboard/tema/tema-1"
    style={{
      textDecoration: "none",
      background: "#2563eb",
      color: "white",
      padding: "12px 16px",
      borderRadius: "12px",
      fontWeight: 600,
    }}
  >
    Empezar tema 1
  </Link>

  {!hasAccess ? (
    <Link
      href="/comprar"
      style={{
        textDecoration: "none",
        background: "#111827",
        color: "white",
        padding: "12px 16px",
        borderRadius: "12px",
        fontWeight: 600,
      }}
    >
      Activar acceso completo
    </Link>
  ) : null}
</div>

          <section style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              Medallas
            </h2>

            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              {earnedBadges.length === 0 ? (
                <p style={{ color: COLORS.muted }}>
                  Todavía no has conseguido medallas. Empieza por el test del Tema 1.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {earnedBadges.map((id) => {
                    const badge = BADGES[id as keyof typeof BADGES];
                    if (!badge) return null;

                    return (
                      <div
                        key={id}
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "16px",
                          background: "#fafafa",
                        }}
                      >
                        <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
                          🏅 {badge.title}
                        </p>
                        <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
                          {badge.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

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
                  <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>
                    {video.titulo}
                  </h3>

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

          <section style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              Cómo estudiar este curso
            </h2>

            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
                lineHeight: "1.8",
              }}
            >
              <p style={{ marginBottom: "16px" }}>
                Este curso está diseñado en tres fases para maximizar el aprendizaje y
                preparar la EBAU / PAU de forma eficaz:
              </p>

              <p>
                <strong>Fase 1 — Comprensión</strong>
                <br />
                Estudia el tema, revisa el índice y comprende el contenido.
              </p>

              <p>
                <strong>Fase 2 — Fijación</strong>
                <br />
                Realiza los test hasta alcanzar al menos un 80% de aciertos.
              </p>

              <p>
                <strong>Fase 3 — Dominio</strong>
                <br />
                Supera las preguntas cortas y las pruebas tipo EBAU / PAU.
              </p>
            </div>
          </section>

          <section id="cursos" style={{ marginTop: "40px" }}>
            <h2>Cursos</h2>

            <p style={{ marginBottom: "16px", color: "#4b5563" }}>
              Accede al curso completo y desbloquea todos los temas, pruebas y preparación
              progresiva para la EBAU / PAU.
            </p>

            {cursos.map((curso) => (
              <div key={curso.titulo} style={{ marginBottom: "20px" }}>
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>

                <p style={{ fontSize: "14px", color: COLORS.muted, marginTop: "8px" }}>
                  {curso.titulo === "Historia de España"
                    ? "Acceso online completo"
                    : "Temario en actualización"}
                </p>

                <p style={{ fontSize: "16px", fontWeight: "600", marginTop: "4px" }}>
                  Desde {curso.precio}
                </p>

                {curso.titulo === "Historia de España" ? (
                  <Link href="/comprar">🔓 Activar acceso completo</Link>
                ) : null}

                {curso.titulo === "Historia de la Filosofía" ? (
                  <>
                    <div>
                      <Link href="/dashboard/filosofia">Ver curso →</Link>
                    </div>
                    <p style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
                      Curso estructurado. Pruebas comparativas en desarrollo.
                    </p>
                  </>
                ) : null}
              </div>
            ))}
          </section>

          <section style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              Resultados
            </h2>

            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              {temasHistoria.map((tema) => {
                const score = bestScores[tema.slug] || 0;

                return (
                  <div key={tema.slug} style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "14px",
                      }}
                    >
                      <span>{tema.titulo}</span>
                      <span>{score}%</span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        background: "#e5e7eb",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(score, 5)}%`,
                          height: "100%",
                          background:
                            score >= 80 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#ef4444",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              Temario de Historia
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {temasOrdenados.map((tema) => {
                const best = bestScores[tema.slug] || 0;
                const completed = best >= 80;

                const index = temasOrdenados.findIndex((t) => t.slug === tema.slug);
                const prevTema = temasOrdenados[index - 1];
                const unlocked =
                  index === 0 || (bestScores[prevTema?.slug] || 0) >= 80;

                return (
                  <div
                    key={tema.slug}
                    style={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "18px",
                      padding: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      opacity: unlocked ? 1 : 0.4,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "18px" }}>{tema.titulo}</h3>

                      {tema.comunidadClave?.includes(comunidad) && (
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "999px",
                            background: "#dcfce7",
                            color: "#166534",
                            fontWeight: "500",
                            marginLeft: "8px",
                          }}
                        >
                          Importante en tu comunidad
                        </span>
                      )}

                      {completed ? (
                        <span
                          style={{
                            background: "#dcfce7",
                            color: "#166534",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✅ Superado
                        </span>
                      ) : best > 0 ? (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {best}%
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#f3f4f6",
                            color: "#6b7280",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Pendiente
                        </span>
                      )}
                    </div>

                    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
                      Accede al tema, repasa el contenido y completa sus pruebas.
                    </p>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  {unlocked && (hasAccess || tema.slug === "tema-1") ? (
    <Link
      href={`/dashboard/tema/${tema.slug}`}
      style={{
        textDecoration: "none",
        background: "#111827",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      Ver tema
    </Link>
  ) : (
    <span
      style={{
        background: "#f3f4f6",
        color: "#9ca3af",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      🔒 Bloqueado
    </span>
  )}

  {hasAccess || tema.slug === "tema-1" ? (
    <Link
      href={`/dashboard/test?tema=${tema.slug}`}
      style={{
        textDecoration: "none",
        background: "#2563eb",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      Test
    </Link>
  ) : (
    <span
      style={{
        background: "#dbeafe",
        color: "#93c5fd",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      🔒 Test
    </span>
  )}

  {hasAccess || tema.slug === "tema-1" ? (
    <Link
      href={`/dashboard/shorts?tema=${tema.slug}`}
      style={{
        textDecoration: "none",
        background: "#f3f4f6",
        color: "#111827",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid #e5e7eb",
      }}
    >
      Cortas
    </Link>
  ) : (
    <span
      style={{
        background: "#f3f4f6",
        color: "#9ca3af",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
        border: "1px solid #e5e7eb",
      }}
    >
      🔒 Cortas
    </span>
  )}
</div>

                    {!hasAccess && tema.slug !== "tema-1" ? (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "12px",
                          background: "#fff7ed",
                          border: "1px solid #fed7aa",
                          borderRadius: "12px",
                          fontSize: "14px",
                        }}
                      >
                        🔒 Activa el curso para acceder al contenido completo.
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
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
          <p style={{ marginBottom: "16px", fontWeight: "bold" }}>Base12 Academy</p>

          <p style={{ marginBottom: "8px", color: "#6b7280" }}>
            Imagen Digital Ménace, S. L. U.
          </p>
          <p style={{ marginBottom: "8px", color: "#6b7280" }}>CIF: B21746086</p>
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