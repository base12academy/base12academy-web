"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [telegramMessage, setTelegramMessage] = useState("");

  async function saveOnboardingStep(payload: Record<string, unknown>) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    throw new Error("Debes iniciar sesión para continuar.");
  }

  const response = await fetch("/api/onboarding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "No se pudieron guardar los datos.");
    }

    return data;
  }

  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [billing, setBilling] = useState({
    type: "particular",
    billingName: "",
    taxId: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    country: "España",
    billingEmail: "",
    nominativeInvoice: true,
  });

  const [planning, setPlanning] = useState({
    studyDays: "",
    studyTime: "",
    sessionDuration: "",
    examDate: "",
    examPlace: "",
    objective: "",
  });

  async function handlePersonalContinue() {
    try {
      setSaving(true);
      setPageError("");

      await saveOnboardingStep({
        step: "personal_data",
        fullName: personal.fullName,
        email: personal.email,
        phone: personal.phone,
      });

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los datos personales."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleBillingContinue() {
    try {
      setSaving(true);
      setPageError("");

      await saveOnboardingStep({
        step: "billing",
        billingType: billing.type,
        nominativeInvoice: billing.nominativeInvoice,
        billingName: billing.billingName,
        taxId: billing.taxId,
        address: billing.address,
        postalCode: billing.postalCode,
        city: billing.city,
        province: billing.province,
        country: billing.country,
        billingEmail: billing.billingEmail,
      });

      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los datos de facturación."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePlanningContinue() {
    try {
      setSaving(true);
      setPageError("");

      const durationMatch = planning.sessionDuration.match(/\d+/);
      const sessionDurationMinutes = durationMatch
        ? Number(durationMatch[0])
        : 0;

      if (!sessionDurationMinutes) {
        throw new Error(
          "Indica la duración habitual de las sesiones en minutos."
        );
      }

      await saveOnboardingStep({
        step: "planning",
        studyDays: planning.studyDays,
        studyTime: planning.studyTime,
        sessionDurationMinutes,
        examDate: planning.examDate || null,
        examPlace: planning.examPlace,
        objective: planning.objective,
      });

      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la planificación."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleTelegramCheck() {
    try {
      setSaving(true);
      setPageError("");
      setTelegramMessage("");

      const data = await saveOnboardingStep({
        step: "telegram",
      });

      if (data.linked) {
        setTelegramMessage(
          "Telegram está vinculado correctamente. El siguiente paso será la bienvenida al curso."
        );
      }
    } catch (error) {
      setTelegramMessage(
        error instanceof Error
          ? error.message
          : "Todavía no se ha podido comprobar la vinculación con Telegram."
      );
    } finally {
      setSaving(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #dbe5f3",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 4px 18px rgba(15, 49, 92, 0.04)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #cad7ea",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#102447",
    background: "#ffffff",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#16346b",
    marginBottom: "7px",
  };

  const primaryButton: React.CSSProperties = {
    border: "none",
    background: "#155eef",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "13px 22px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: saving ? "wait" : "pointer",
    opacity: saving ? 0.7 : 1,
  };

  const steps = [
    ["Datos personales", 1],
    ["Facturación", 2],
    ["Tu planificación con Fernando", 3],
    ["Vinculación con Telegram", 4],
  ] as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7faff",
        color: "#102447",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* CABECERA */}
      <header
        style={{
          height: "72px",
          background: "#ffffff",
          borderBottom: "1px solid #dfe7f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#0e2855",
          }}
        >
          B12 · Base12 Academy
        </div>

        <div
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <span>Buscar</span>
          <span>Plan de estudio</span>
          <span>Mi cuenta</span>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "235px minmax(0, 1fr) 285px",
          gap: "28px",
          padding: "32px 28px 70px",
        }}
      >
        {/* COLUMNA IZQUIERDA */}
        <aside>
          <div
            style={{
              fontWeight: 800,
              marginBottom: "12px",
            }}
          >
            Tu onboarding
          </div>

          <div
            style={{
              height: "6px",
              background: "#e2eaf5",
              borderRadius: "999px",
              marginBottom: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${step * 25}%`,
                height: "100%",
                background: "#155eef",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#607089",
              marginBottom: "28px",
            }}
          >
            Paso {step} de 4
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {steps.map(([name, number]) => (
              <div
                key={number}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  padding: "12px",
                  borderRadius: "13px",
                  background:
                    step === number ? "#eaf2ff" : "transparent",
                  color:
                    step === number ? "#155eef" : "#29436f",
                  fontWeight: step === number ? 800 : 600,
                  fontSize: "14px",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border:
                      step === number
                        ? "none"
                        : "1px solid #b9c7dc",
                    background:
                      step === number ? "#155eef" : "#ffffff",
                    color:
                      step === number ? "#ffffff" : "#29436f",
                    flexShrink: 0,
                  }}
                >
                  {number}
                </div>

                <span>{name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTRO */}
        <section>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "36px",
              margin: "0 0 8px",
              color: "#102d62",
            }}
          >
            Completa tu onboarding
          </h1>

          <p
            style={{
              margin: "0 0 20px",
              color: "#50617e",
            }}
          >
            Sigue estos pasos para empezar tu formación con buen pie.
          </p>

          {pageError && (
            <div
              role="alert"
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#9f1239",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              {pageError}
            </div>
          )}

          {/* PASO 1 */}
          <div
            style={{
              ...cardStyle,
              marginBottom: "18px",
              opacity: step === 1 ? 1 : 0.72,
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                marginTop: 0,
                color: "#102d62",
              }}
            >
              1. Datos personales
            </h2>

            <p style={{ color: "#607089" }}>
              Actualiza tu información para personalizar tu experiencia.
            </p>

            {step === 1 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "18px",
                    marginTop: "24px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Nombre y apellidos
                    </label>
                    <input
                      style={inputStyle}
                      value={personal.fullName}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Ej.: Ana Martín García"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      style={inputStyle}
                      value={personal.email}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          email: e.target.value,
                        })
                      }
                      placeholder="ana@correo.com"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Nº de móvil
                    </label>
                    <input
                      style={inputStyle}
                      value={personal.phone}
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+34 612 345 678"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "24px",
                  }}
                >
                  <button
                    type="button"
                    style={primaryButton}
                    disabled={saving}
                    onClick={handlePersonalContinue}
                  >
                    {saving ? "Guardando..." : "Guardar y continuar →"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* PASO 2 */}
          <div
            style={{
              ...cardStyle,
              marginBottom: "18px",
              opacity: step === 2 ? 1 : 0.72,
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                marginTop: 0,
                color: "#102d62",
              }}
            >
              2. Facturación
            </h2>

            <p style={{ color: "#607089" }}>
              Completa los datos necesarios para la emisión de tu factura.
            </p>

            {step === 2 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginTop: "22px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Tipo de facturación
                    </label>
                    <select
                      style={inputStyle}
                      value={billing.type}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="particular">
                        Particular
                      </option>
                      <option value="empresa">
                        Empresa o autónomo
                      </option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Nombre o razón social
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.billingName}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          billingName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      NIF / NIE
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.taxId}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          taxId: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Correo de facturación
                    </label>
                    <input
                      type="email"
                      style={inputStyle}
                      value={billing.billingEmail}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          billingEmail: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>
                      Dirección fiscal
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.address}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Código postal
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.postalCode}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Localidad
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.city}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Provincia
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.province}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          province: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      País
                    </label>
                    <input
                      style={inputStyle}
                      value={billing.country}
                      onChange={(e) =>
                        setBilling({
                          ...billing,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <label
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "20px",
                    color: "#29436f",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!billing.nominativeInvoice}
                    onChange={(e) =>
                      setBilling({
                        ...billing,
                        nominativeInvoice: !e.target.checked,
                      })
                    }
                  />
                  No necesito factura nominativa
                </label>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "24px",
                  }}
                >
                  <button
                    type="button"
                    style={primaryButton}
                    disabled={saving}
                    onClick={handleBillingContinue}
                  >
                    {saving ? "Guardando..." : "Guardar y continuar →"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* PASO 3 */}
          <div
            style={{
              ...cardStyle,
              marginBottom: "18px",
              opacity: step === 3 ? 1 : 0.72,
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                marginTop: 0,
                color: "#102d62",
              }}
            >
              3. Tu planificación con Fernando
            </h2>

            <p style={{ color: "#607089" }}>
              Define tu plan de estudio y tus objetivos con tu Tutor IA.
            </p>

            {step === 3 && (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "18px",
                    marginTop: "22px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Días de estudio
                    </label>
                    <input
                      style={inputStyle}
                      value={planning.studyDays}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          studyDays: e.target.value,
                        })
                      }
                      placeholder="Ej.: lunes, miércoles y viernes"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Horario habitual
                    </label>
                    <input
                      style={inputStyle}
                      value={planning.studyTime}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          studyTime: e.target.value,
                        })
                      }
                      placeholder="Ej.: 18:00 – 20:00"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Duración de las sesiones
                    </label>
                    <input
                      style={inputStyle}
                      value={planning.sessionDuration}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          sessionDuration: e.target.value,
                        })
                      }
                      placeholder="Ej.: 90 minutos"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Fecha del examen
                    </label>
                    <input
                      type="date"
                      style={inputStyle}
                      value={planning.examDate}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          examDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Lugar del examen, si lo conoces
                    </label>
                    <input
                      style={inputStyle}
                      value={planning.examPlace}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          examPlace: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Objetivo
                    </label>
                    <input
                      style={inputStyle}
                      value={planning.objective}
                      onChange={(e) =>
                        setPlanning({
                          ...planning,
                          objective: e.target.value,
                        })
                      }
                      placeholder="¿Qué quieres conseguir?"
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    background: "#f1f6ff",
                    padding: "15px",
                    borderRadius: "12px",
                    color: "#29436f",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  Fernando utilizará esta información para organizar tu
                  planificación y preparar tus recordatorios.
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "24px",
                  }}
                >
                  <button
                    type="button"
                    style={primaryButton}
                    disabled={saving}
                    onClick={handlePlanningContinue}
                  >
                    {saving ? "Guardando..." : "Guardar y continuar →"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* PASO 4 */}
          <div
            style={{
              ...cardStyle,
              opacity: step === 4 ? 1 : 0.72,
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                marginTop: 0,
                color: "#102d62",
              }}
            >
              4. Vinculación con Telegram
            </h2>

            <p style={{ color: "#607089", lineHeight: 1.6 }}>
              Vincula tu cuenta para recibir avisos, comunicaciones y
              seguimiento relacionado con tu formación.
            </p>

            {step === 4 && (
              <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "20px",
                  marginTop: "22px",
                  padding: "22px",
                  background: "#f1f6ff",
                  borderRadius: "14px",
                }}
              >
                <div>
                  <strong>Telegram Base12 Academy</strong>
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#607089",
                      fontSize: "14px",
                    }}
                  >
                    La vinculación quedará asociada a tu cuenta de alumno.
                  </p>
                </div>

                <button
                  type="button"
                  style={primaryButton}
                  disabled={saving}
                  onClick={handleTelegramCheck}
                >
                  {saving ? "Comprobando..." : "Vincular Telegram"}
                </button>
              </div>

              {telegramMessage && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "13px 15px",
                    background: "#ffffff",
                    border: "1px solid #dbe5f3",
                    borderRadius: "10px",
                    color: "#29436f",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {telegramMessage}
                </div>
              )}
              </>
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA */}
        <aside>
          <div style={cardStyle}>
            <h3
              style={{
                fontFamily: "Georgia, serif",
                marginTop: 0,
                color: "#102d62",
              }}
            >
              Te acompañamos en cada paso
            </h3>

            <p
              style={{
                color: "#607089",
                lineHeight: 1.6,
                fontSize: "14px",
              }}
            >
              Nuestros asistentes y servicios están disponibles durante tu
              formación.
            </p>

            {[
              ["Rocío", "Profesora IA", "Contenidos y explicaciones"],
              [
                "Fernando",
                "Tutor IA",
                "Progreso, planificación y organización",
              ],
              [
                "Secretaría",
                "Servicio virtual",
                "Pagos, facturas y cuestiones económicas",
              ],
              [
                "Jefe de Estudios",
                "Servicio virtual",
                "Organización general",
              ],
              [
                "Director Académico",
                "Atención humana",
                "Respuesta por correo hasta 24 h",
              ],
            ].map(([name, role, description]) => (
              <div
                key={name}
                style={{
                  borderTop: "1px solid #e3eaf4",
                  padding: "18px 0",
                }}
              >
                <strong>{name}</strong>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#155eef",
                    marginTop: "3px",
                  }}
                >
                  {role}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#607089",
                    marginTop: "7px",
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* BOT COMERCIAL REAL: espacio fijo inferior derecho */}
      <button
        aria-label="Bot comercial Base12"
        style={{
          position: "fixed",
          right: "28px",
          bottom: "24px",
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          border: "none",
          background: "#101a2c",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 10px 28px rgba(0,0,0,0.20)",
        }}
      >
        B12
        <span
          style={{
            position: "absolute",
            right: "2px",
            bottom: "3px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "#16a34a",
            border: "2px solid white",
          }}
        />
      </button>
    </main>
  );
}
