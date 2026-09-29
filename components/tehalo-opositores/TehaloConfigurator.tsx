"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import TurnstileWidget from "@/components/TurnstileWidget";
import styles from "./TehaloConfigurator.module.css";

type OfficialCall = {
  id: string;
  title: string;
  organisation: string | null;
  administration: string | null;
  territory: string;
  province: string | null;
  group_category: string | null;
  specialty: string | null;
  publication_date: string;
  official_url: string;
  bulletin_name: string;
};

type MaterialId = "syllabus_glossary" | "explanations_ai" | "simulations" | "tests" | "complete";

const administrations = ["Estado", "Comunidad Autónoma", "Ayuntamiento", "Diputación", "Universidad", "Sanidad", "Justicia", "Seguridad Social", "Otra"];
const positions = ["Administrativo", "Auxiliar Administrativo", "Gestión", "Celador", "Técnico", "Personal laboral", "Otro"];
const levels = ["A1", "A2", "C1", "C2", "AP", "Personal laboral"];
const materials: { id: MaterialId; label: string; price: string; cents: number }[] = [
  { id: "syllabus_glossary", label: "Temario + Glosario", price: "desde 119 €", cents: 11900 },
  { id: "explanations_ai", label: "Explicaciones + asistente IA", price: "desde 159 €", cents: 15900 },
  { id: "simulations", label: "Simulacros", price: "desde 29 €", cents: 2900 },
  { id: "tests", label: "Test · 2.500 preguntas", price: "desde 49 €", cents: 4900 },
  { id: "complete", label: "Curso completo", price: "desde 319 €", cents: 31900 },
];

const stepTitles = [
  "¿Qué oposición preparas?",
  "¿A qué administración pertenece?",
  "¿Qué cuerpo o puesto es?",
  "¿Qué nivel tiene?",
  "¿En qué territorio se convoca?",
  "¿Qué convocatoria debemos tomar como referencia?",
  "¿Qué material necesitas?",
  "¿Dónde te enviamos tu propuesta personalizada?",
];

export default function TehaloConfigurator() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [opposition, setOpposition] = useState("");
  const [administration, setAdministration] = useState("");
  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [territory, setTerritory] = useState("");
  const [referenceKind, setReferenceKind] = useState<"current" | "bank" | "latest">("bank");
  const [officialUrl, setOfficialUrl] = useState("");
  const [latestAuthorization, setLatestAuthorization] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialId[]>([]);
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [selectedCall, setSelectedCall] = useState<OfficialCall | null>(null);
  const [calls, setCalls] = useState<OfficialCall[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const estimate = useMemo(() => {
    if (selectedMaterials.includes("complete")) return 31900;
    return materials.filter((item) => selectedMaterials.includes(item.id)).reduce((total, item) => total + item.cents, 0);
  }, [selectedMaterials]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, busy]);

  async function searchCalls() {
    if (opposition.trim().length < 3) {
      setSearchMessage("Escribe al menos tres caracteres para consultar el Banco de Opositores.");
      return;
    }
    setSearching(true);
    setSearchMessage("");
    try {
      const response = await fetch(`/api/banco-opositores/convocatorias?q=${encodeURIComponent(opposition.trim())}&limit=8`, { cache: "no-store" });
      const payload = await response.json() as { calls?: OfficialCall[]; pending?: boolean; error?: string };
      if (!response.ok) throw new Error(payload.error || "No se pudo consultar el Banco de Opositores.");
      setCalls(payload.calls || []);
      setSearchMessage(payload.calls?.length ? "Selecciona la convocatoria que corresponde a tu oposición." : "No aparece una coincidencia exacta. Puedes continuar para que la revisemos en el Banco de Opositores.");
    } catch (searchError) {
      setCalls([]);
      setSearchMessage(searchError instanceof Error ? searchError.message : "No se pudo completar la búsqueda.");
    } finally {
      setSearching(false);
    }
  }

  function chooseCall(call: OfficialCall) {
    setSelectedCall(call);
    setOpposition(call.title);
    setAdministration(call.administration || call.organisation || "");
    setPosition(call.specialty || "");
    setLevel(call.group_category || "");
    setTerritory([call.territory, call.province].filter(Boolean).join(" · "));
    setOfficialUrl(call.official_url);
    setReferenceKind("current");
    setSearchMessage("Convocatoria oficial seleccionada.");
  }

  function toggleMaterial(id: MaterialId) {
    if (id === "complete") {
      setSelectedMaterials((current) => current.includes("complete") ? [] : ["complete"]);
      return;
    }
    setSelectedMaterials((current) => {
      const withoutComplete = current.filter((item) => item !== "complete");
      return withoutComplete.includes(id) ? withoutComplete.filter((item) => item !== id) : [...withoutComplete, id];
    });
  }

  function canContinue() {
    if (step === 0) return opposition.trim().length >= 3;
    if (step === 1) return administration.trim().length >= 2;
    if (step === 2) return position.trim().length >= 2;
    if (step === 3) return level.trim().length >= 1;
    if (step === 4) return territory.trim().length >= 2;
    if (step === 5) return referenceKind !== "latest" || latestAuthorization;
    if (step === 6) return selectedMaterials.length > 0;
    return false;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!privacyAccepted) {
      setError("Acepta la privacidad para enviar la solicitud.");
      return;
    }
    if (!turnstileToken) {
      setError("Completa la verificación anti-bots.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/tehalo-opositores/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opposition,
          administration,
          position,
          level,
          territory,
          referenceKind,
          officialCallId: selectedCall?.id || null,
          officialUrl,
          latestAuthorization,
          materials: selectedMaterials,
          email,
          privacyAccepted,
          physicalPersonConfirmed: true,
          marketingAccepted: false,
          turnstileToken,
        }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; reference?: string; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "No se pudo registrar la solicitud.");
      setReference(payload.reference || "");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar la solicitud.");
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className={styles.launchButton} onClick={() => setOpen(true)}>
        Personalizar una oposición
      </button>

      {open && (
        <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && !busy && setOpen(false)}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="tehalo-config-title">
            <button type="button" className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Cerrar" disabled={busy}>×</button>

            {reference ? (
              <div className={styles.success}>
                <h2 id="tehalo-config-title">Propuesta personalizada</h2>
                <p>Referencia: <strong>{reference}</strong></p>
                <p>El usuario recibe una propuesta personalizada por correo.</p>
                <button type="button" className={styles.primary} onClick={() => setOpen(false)}>Cerrar</button>
              </div>
            ) : (
              <>
                <header className={styles.configHeader}>
                  <div>
                    <h2 id="tehalo-config-title">{stepTitles[step]}</h2>
                  </div>
                  <span>{step + 1} / {stepTitles.length}</span>
                </header>
                <div className={styles.progress}><span style={{ width: `${((step + 1) / stepTitles.length) * 100}%` }} /></div>

      {step === 0 && (
        <div className={styles.step}>
          <label className={styles.field}>
            <span>Nombre de la oposición o plaza</span>
            <div className={styles.searchRow}>
              <input value={opposition} onChange={(event) => { setOpposition(event.target.value); setSelectedCall(null); }} placeholder="Ej. Auxiliar Administrativo Universidad de Málaga" autoFocus />
              <button type="button" onClick={searchCalls} disabled={searching}>{searching ? "Buscando…" : "Buscar convocatoria"}</button>
            </div>
          </label>
          {searchMessage && <p className={styles.help}>{searchMessage}</p>}
          {calls.length > 0 && (
            <div className={styles.callList}>
              {calls.map((call) => (
                <button type="button" key={call.id} className={selectedCall?.id === call.id ? styles.callSelected : ""} onClick={() => chooseCall(call)}>
                  <strong>{call.title}</strong>
                  <span>{call.organisation || call.administration || "Administración no indicada"} · {call.territory}</span>
                  <small>{call.bulletin_name} · {call.publication_date}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 1 && <SelectOrOther label="Administración" value={administration} onChange={setAdministration} options={administrations} />}
      {step === 2 && <SelectOrOther label="Cuerpo o puesto" value={position} onChange={setPosition} options={positions} />}
      {step === 3 && <SelectOrOther label="Nivel o grupo" value={level} onChange={setLevel} options={levels} />}
      {step === 4 && (
        <div className={styles.step}><label className={styles.field}><span>Comunidad Autónoma y, cuando proceda, provincia o entidad</span><input value={territory} onChange={(event) => setTerritory(event.target.value)} placeholder="Ej. Andalucía · Málaga · Universidad de Málaga" autoFocus /></label></div>
      )}

      {step === 5 && (
        <div className={styles.step}>
          <div className={styles.optionList}>
            <label><input type="radio" name="reference" checked={referenceKind === "current"} onChange={() => setReferenceKind("current")} /><span><strong>Convocatoria vigente</strong></span></label>
            <label><input type="radio" name="reference" checked={referenceKind === "bank"} onChange={() => setReferenceKind("bank")} /><span><strong>Consultar Banco de Opositores</strong></span></label>
            <label><input type="radio" name="reference" checked={referenceKind === "latest"} onChange={() => setReferenceKind("latest")} /><span><strong>Última convocatoria oficial disponible</strong></span></label>
          </div>
          {referenceKind === "latest" && <label className={styles.check}><input type="checkbox" checked={latestAuthorization} onChange={(event) => setLatestAuthorization(event.target.checked)} /><span>Autorizo expresamente el uso de la última convocatoria oficial disponible mientras no exista una nueva.</span></label>}
        </div>
      )}

      {step === 6 && (
        <div className={styles.step}>
          <div className={styles.materialGrid}>
            {materials.map((item) => (
              <button type="button" key={item.id} className={selectedMaterials.includes(item.id) ? styles.materialSelected : ""} onClick={() => toggleMaterial(item.id)}>
                <span>{selectedMaterials.includes(item.id) ? "✓" : "+"}</span>
                <strong>{item.label}</strong>
                <b>{item.price}</b>
              </button>
            ))}
          </div>
          {estimate > 0 && <p className={styles.estimate}>Estimación mínima conjunta: <strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(estimate / 100)}</strong></p>}
          <p className={styles.officialNote}>Precio orientativo. La propuesta final dependerá del número de temas y del grado de personalización necesario.</p>
        </div>
      )}

      {step === 7 && (
        <form className={styles.step} onSubmit={submit}>
          <label className={styles.field}><span>Correo electrónico</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label className={styles.check}><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} required /><span>He leído la <Link href="/privacidad" target="_blank">Política de privacidad</Link> y autorizo el tratamiento necesario para preparar y enviar mi propuesta. <strong>Obligatorio</strong></span></label>
          <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.formActions}><button type="button" className={styles.secondary} onClick={() => setStep(6)}>Anterior</button><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Registrando…" : "Solicitar propuesta personalizada"}</button></div>
        </form>
      )}

      {step < 7 && (
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Anterior</button>
          <button type="button" className={styles.primary} onClick={() => setStep((value) => Math.min(7, value + 1))} disabled={!canContinue()}>Continuar</button>
        </div>
      )}
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

function SelectOrOther({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const standard = options.includes(value);
  return (
    <div className={styles.step}>
      <label className={styles.field}>
        <span>{label}</span>
        <select value={standard ? value : value ? "Otra" : ""} onChange={(event) => onChange(event.target.value === "Otra" ? "" : event.target.value)} autoFocus>
          <option value="">Selecciona una opción</option>
          {options.map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </label>
      {(!standard || value === "Otra") && <label className={styles.field}><span>Especifica la opción</span><input value={value === "Otra" ? "" : value} onChange={(event) => onChange(event.target.value)} placeholder={`Indica ${label.toLowerCase()}`} /></label>}
    </div>
  );
}
