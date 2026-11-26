"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TurnstileWidget from "@/components/TurnstileWidget";
import styles from "./WorkWithUsModal.module.css";

type Role =
  | "profesor-bachillerato"
  | "preparador-oposiciones"
  | "preparador-fisico";

const ROLES: Array<{ id: Role; label: string }> = [
  { id: "profesor-bachillerato", label: "Profesor de Bachillerato" },
  { id: "preparador-oposiciones", label: "Preparador Oposiciones" },
  { id: "preparador-fisico", label: "Preparador Físico" },
];

type Props = {
  className?: string;
  onOpen?: () => void;
};

export default function WorkWithUsModal({ className, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    setOpen(false);
    setRole(null);
    setToken("");
    setError("");
    setSubmitted(false);
  }

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    setToken("");
    setError("");
    setSubmitted(false);
    setResetKey((value) => value + 1);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!role) {
      setError("Selecciona una opción.");
      return;
    }
    if (!token) {
      setError("Completa la verificación anti-bots.");
      return;
    }

    setBusy(true);
    try {
      const form = new FormData(event.currentTarget);
      form.set("role", role);
      form.set("turnstileToken", token);

      const response = await fetch("/api/work-with-us", {
        method: "POST",
        body: form,
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "No se pudo enviar la candidatura.");
      }

      setSubmitted(true);
      setToken("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar la candidatura."
      );
    } finally {
      setBusy(false);
      setResetKey((value) => value + 1);
    }
  }

  return (
    <>
      <button
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(" ")}
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
      >
        Trabaja con nosotros
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="work-with-us-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDialog();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.top}>
            <div>
              <p className={styles.eyebrow}>Equipo Base12</p>
              <h2 id="work-with-us-title">Trabaja con nosotros</h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              aria-label="Cerrar ventana"
              onClick={closeDialog}
            >
              ×
            </button>
          </div>

          {submitted ? (
            <div className={styles.success} role="status" aria-live="polite">
              <span className={styles.successMark} aria-hidden="true">✓</span>
              <h3>Candidatura recibida</h3>
              <p>
                Hemos recibido tu candidatura. En poco tiempo recibirás
                información de nuestro Departamento de Recursos Humanos.
              </p>
              <button type="button" className={styles.primary} onClick={closeDialog}>
                Cerrar
              </button>
            </div>
          ) : (
            <>
              <p className={styles.intro}>
                Elige el tipo de colaboración que te interesa.
              </p>
              <div className={styles.options} role="group" aria-label="Tipo de colaboración">
                {ROLES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={role === item.id ? styles.optionSelected : styles.option}
                    aria-pressed={role === item.id}
                    onClick={() => selectRole(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {role && (
                <form className={styles.form} onSubmit={submit}>
                  {role === "profesor-bachillerato" && (
                    <>
                      <label>
                        <span>Especialidad</span>
                        <input name="specialty" autoComplete="organization-title" maxLength={180} required />
                      </label>
                      <ContactEmailField />
                      <label>
                        <span>Preferencia de alta en la Seguridad Social</span>
                        <select name="socialSecurityPreference" defaultValue="" required>
                          <option value="" disabled>Selecciona una opción</option>
                          <option value="cuenta-ajena">Alta por cuenta ajena</option>
                          <option value="autonomo">Alta como trabajador/a autónomo/a</option>
                          <option value="a-valorar">A valorar según la colaboración</option>
                        </select>
                      </label>
                      <CvField />
                    </>
                  )}

                  {role === "preparador-oposiciones" && (
                    <>
                      <label>
                        <span>Especialidad</span>
                        <input name="specialty" autoComplete="organization-title" maxLength={180} required />
                      </label>
                      <ContactEmailField />
                      <label>
                        <span>Preferencia de alta en la Seguridad Social</span>
                        <select name="socialSecurityPreference" defaultValue="" required>
                          <option value="" disabled>Selecciona una opción</option>
                          <option value="cuenta-ajena">Alta por cuenta ajena</option>
                          <option value="autonomo">Alta como trabajador/a autónomo/a</option>
                          <option value="a-valorar">A valorar según la colaboración</option>
                        </select>
                      </label>
                      <CvField />
                    </>
                  )}

                  {role === "preparador-fisico" && (
                    <>
                      <ContactEmailField />
                      <label>
                        <span>Titulación</span>
                        <input name="qualification" maxLength={180} required />
                      </label>
                      <div className={styles.twoColumns}>
                        <label>
                          <span>Localidad</span>
                          <input name="locality" autoComplete="address-level2" maxLength={120} required />
                        </label>
                        <label>
                          <span>Provincia</span>
                          <input name="province" autoComplete="address-level1" maxLength={120} required />
                        </label>
                      </div>
                      <label>
                        <span>Propuesta de colaboración</span>
                        <textarea name="proposal" rows={6} maxLength={5000} required />
                      </label>
                    </>
                  )}

                  <label className={styles.consent}>
                    <input type="checkbox" name="privacyAccepted" required />
                    <span>
                      Autorizo el envío de estos datos y, cuando corresponda, de mi
                      currículum a{" "}
                      <strong>profesionales@base12academy.es</strong> para valorar
                      esta candidatura. He leído la{" "}
                      <Link href="/privacidad" target="_blank">Política de privacidad</Link>.
                    </span>
                  </label>

                  <TurnstileWidget
                    onTokenChange={setToken}
                    resetKey={resetKey}
                  />

                  {error && <p className={styles.error} role="alert">{error}</p>}
                  <div className={styles.submitRow}>
                    <p>La candidatura se enviará directamente a Recursos Humanos.</p>
                    <button type="submit" className={styles.primary} disabled={busy || !token}>
                      {busy ? "Enviando…" : "Enviar candidatura"}
                    </button>
                  </div>
                </form>
              )}

              {!role && (
                <p className={styles.prompt}>Selecciona una opción para ver el formulario.</p>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

function ContactEmailField() {
  return (
    <label>
      <span>Correo electrónico de contacto</span>
      <input
        type="email"
        name="email"
        autoComplete="email"
        maxLength={254}
        required
      />
    </label>
  );
}

function CvField() {
  return (
    <label>
      <span>Currículum</span>
      <input
        type="file"
        name="cv"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        required
      />
      <small>PDF, DOC o DOCX. Tamaño máximo: 3 MB.</small>
    </label>
  );
}
