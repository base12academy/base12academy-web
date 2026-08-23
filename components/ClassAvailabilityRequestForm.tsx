"use client";

import TurnstileWidget from "@/components/TurnstileWidget";
import { FormEvent, useState } from "react";
import styles from "./ClassAvailabilityRequestForm.module.css";

const SUBJECTS = [
  "Matemáticas II",
  "Matemáticas Aplicadas a las CCSS",
  "Lengua y Literatura",
  "Física y Química",
  "Física",
  "Química",
];

const COMMUNITIES = [
  "Andalucía",
  "Aragón",
  "Asturias",
  "Illes Balears",
  "Canarias",
  "Cantabria",
  "Castilla-La Mancha",
  "Castilla y León",
  "Cataluña",
  "Comunidad de Madrid",
  "Comunitat Valenciana",
  "Extremadura",
  "Galicia",
  "La Rioja",
  "Región de Murcia",
  "Navarra",
  "País Vasco",
  "Ceuta",
  "Melilla",
];

export default function ClassAvailabilityRequestForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+34 ");
  const [
    autonomousCommunity,
    setAutonomousCommunity,
  ] = useState("");
  const [academicLevel, setAcademicLevel] =
    useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [bookPublisher, setBookPublisher] =
    useState("");
  const [notes, setNotes] = useState("");
  const [
    privacyAccepted,
    setPrivacyAccepted,
  ] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] =
    useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!turnstileToken) {
      setError("Completa la verificación anti-bots.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        "/api/classes/request-availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            autonomousCommunity,
            academicLevel,
            subject,
            topic,
            bookPublisher,
            notes,
            privacyAccepted,
            turnstileToken,
          }),
        }
      );

      const payload =
        await response.json().catch(() => ({}));

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error ||
            "No se pudo enviar la solicitud."
        );
      }

      setReference(
        typeof payload.reference === "string"
          ? payload.reference
          : ""
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar la solicitud."
      );
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setBusy(false);
    }
  }

  if (reference) {
    return (
      <section
        id="class-availability-request"
        className={styles.success}
      >
        <span>Solicitud registrada</span>
        <h3>
          Comprobaremos la disponibilidad
        </h3>
        <p>
          Referencia: <strong>{reference}</strong>
        </p>
        <p>
          No se ha realizado ningún pago. Base12 Academy
          revisará manualmente tu solicitud y se pondrá en
          contacto contigo antes de habilitar cualquier
          contratación.
        </p>
      </section>
    );
  }

  return (
    <section
      id="class-availability-request"
      className={styles.wrapper}
    >
      <div className={styles.heading}>
        <span>Solicitud previa</span>
        <h3>
          Consulta disponibilidad para otras asignaturas
        </h3>
        <p>
          Envíanos los datos académicos y de contacto.
          Comprobaremos manualmente si podemos atender la
          asignatura y el horario. Esta solicitud no implica
          contratación ni pago.
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={submit}
      >
        <div className={styles.grid}>
          <label>
            <span>Nombre y apellidos</span>
            <input
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              autoComplete="name"
              required
            />
          </label>

          <label>
            <span>Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Móvil con prefijo internacional</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              autoComplete="tel"
              placeholder="+34 600 000 000"
              required
            />
          </label>

          <label>
            <span>Comunidad autónoma</span>
            <select
              value={autonomousCommunity}
              onChange={(event) =>
                setAutonomousCommunity(
                  event.target.value
                )
              }
              required
            >
              <option value="">
                Selecciona una opción
              </option>
              {COMMUNITIES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Nivel o curso</span>
            <input
              value={academicLevel}
              onChange={(event) =>
                setAcademicLevel(
                  event.target.value
                )
              }
              placeholder="Ej.: 1.º Bachillerato"
              required
            />
          </label>

          <label>
            <span>Asignatura</span>
            <select
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              required
            >
              <option value="">
                Selecciona una asignatura
              </option>
              {SUBJECTS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span>
            Tema o contenido que necesitas trabajar
          </span>
          <input
            value={topic}
            onChange={(event) =>
              setTopic(event.target.value)
            }
            placeholder="Indica brevemente el tema"
            required
          />
        </label>

        <label>
          <span>
            Editorial del libro, si utilizas uno
          </span>
          <input
            value={bookPublisher}
            onChange={(event) =>
              setBookPublisher(
                event.target.value
              )
            }
            placeholder="Opcional"
          />
        </label>

        <label>
          <span>
            Observaciones sobre disponibilidad o necesidades
          </span>
          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            placeholder="Opcional"
          />
        </label>

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) =>
              setPrivacyAccepted(
                event.target.checked
              )
            }
            required
          />
          <span>
            He leído la Política de privacidad y autorizo el
            tratamiento de estos datos para gestionar esta
            solicitud de disponibilidad.
          </span>
        </label>

        <TurnstileWidget
          onTokenChange={setTurnstileToken}
          resetKey={turnstileResetKey}
        />

        {error && (
          <p
            className={styles.error}
            role="alert"
          >
            {error}
          </p>
        )}

        <div className={styles.footer}>
          <p>
            No se solicita tarjeta ni se realiza ningún
            cobro en este paso.
          </p>

          <button
            type="submit"
            disabled={busy}
          >
            {busy
              ? "Enviando solicitud…"
              : "Enviar solicitud de disponibilidad"}
          </button>
        </div>
      </form>
    </section>
  );
}
