"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
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
const materials: { id: MaterialId; label: string; price: string; cents: number; detail: string }[] = [
  { id: "syllabus_glossary", label: "Temario + Glosario", price: "desde 119 €", cents: 11900, detail: "Programa oficial organizado y vocabulario esencial." },
  { id: "explanations_ai", label: "Explicaciones + asistente IA", price: "desde 159 €", cents: 15900, detail: "Explicaciones construidas para comprender y relacionar contenidos." },
  { id: "simulations", label: "Simulacros", price: "desde 29 €", cents: 2900, detail: "Pruebas completas adaptadas al formato de la convocatoria." },
  { id: "tests", label: "Test · 2.500 preguntas", price: "desde 49 €", cents: 4900, detail: "Entrenamiento por bloques, repaso y control del progreso." },
  { id: "complete", label: "Curso completo", price: "desde 319 €", cents: 31900, detail: "Temario, glosario, explicaciones, test y simulacros." },
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [physicalPersonConfirmed, setPhysicalPersonConfirmed] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
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
    if (!privacyAccepted || !physicalPersonConfirmed) {
      setError("Acepta la privacidad y confirma que realizas la solicitud como persona física.");
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
          fullName,
          email,
          privacyAccepted,
          physicalPersonConfirmed,
          marketingAccepted,
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

  if (reference) {
    return (
      <section id="personalizar" className={styles.success}>
        <p className={styles.kicker}>Solicitud registrada</p>
        <h2>Vamos a preparar tu propuesta personalizada.</h2>
        <p>Referencia: <strong>{reference}</strong></p>
        <p>Revisaremos la convocatoria y los materiales solicitados. Recibirás por correo el precio final, el plazo y, si aceptas, el acceso al pago seguro mediante Redsys.</p>
        <p><strong>No se ha realizado ningún pago.</strong></p>
        <Link href="/">Volver a Base12 Academy</Link>
      </section>
    );
  }

  return (
    <section id="personalizar" className={styles.configurator}>
      <header className={styles.configHeader}>
        <div>
          <p className={styles.kicker}>Configurador personalizado</p>
          <h2>{stepTitles[step]}</h2>
        </div>
        <span>Paso {step + 1} de {stepTitles.length}</span>
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
          <p className={styles.officialNote}>No te pediremos documentos. Trabajamos con el Banco de Opositores, enlaces y fuentes oficiales.</p>
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
            <label><input type="radio" name="reference" checked={referenceKind === "current"} onChange={() => setReferenceKind("current")} /><span><strong>Convocatoria vigente</strong><small>{selectedCall ? "Usaremos la convocatoria oficial seleccionada." : "Indica el enlace oficial si no aparece en el Banco."}</small></span></label>
            <label><input type="radio" name="reference" checked={referenceKind === "bank"} onChange={() => setReferenceKind("bank")} /><span><strong>Consultar el Banco de Opositores</strong><small>Validaremos la convocatoria oficial antes de preparar el material.</small></span></label>
            <label><input type="radio" name="reference" checked={referenceKind === "latest"} onChange={() => setReferenceKind("latest")} /><span><strong>Última convocatoria oficial disponible</strong><small>Solo se utilizará con tu autorización expresa.</small></span></label>
          </div>
          <label className={styles.field}><span>Enlace oficial, si lo tienes</span><input type="url" value={officialUrl} onChange={(event) => setOfficialUrl(event.target.value)} placeholder="https://…" /></label>
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
                <small>{item.detail}</small>
              </button>
            ))}
          </div>
          {estimate > 0 && <p className={styles.estimate}>Estimación mínima conjunta: <strong>{new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(estimate / 100)}</strong></p>}
          <p className={styles.officialNote}>Precio orientativo. La propuesta final dependerá del número de temas y del grado de personalización necesario.</p>
        </div>
      )}

      {step === 7 && (
        <form className={styles.step} onSubmit={submit}>
          <div className={styles.contactGrid}>
            <label className={styles.field}><span>Nombre y apellidos</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required /></label>
            <label className={styles.field}><span>Correo electrónico</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          </div>
          <label className={styles.check}><input type="checkbox" checked={physicalPersonConfirmed} onChange={(event) => setPhysicalPersonConfirmed(event.target.checked)} required /><span>Confirmo que realizo esta solicitud como persona física.</span></label>
          <label className={styles.check}><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} required /><span>He leído la <Link href="/privacidad" target="_blank">Política de privacidad</Link> y autorizo el tratamiento necesario para preparar y enviar mi propuesta. <strong>Obligatorio</strong></span></label>
          <label className={styles.check}><input type="checkbox" checked={marketingAccepted} onChange={(event) => setMarketingAccepted(event.target.checked)} /><span>Quiero recibir novedades de Tehalo Pruebas. Opcional.</span></label>
          <TurnstileWidget onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.formActions}><button type="button" className={styles.secondary} onClick={() => setStep(6)}>Anterior</button><button type="submit" className={styles.primary} disabled={busy}>{busy ? "Registrando…" : "Solicitar propuesta personalizada"}</button></div>
          <p className={styles.officialNote}>No se solicita tarjeta ni se realiza ningún pago en este paso.</p>
        </form>
      )}

      {step < 7 && (
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>Anterior</button>
          <button type="button" className={styles.primary} onClick={() => setStep((value) => Math.min(7, value + 1))} disabled={!canContinue()}>Continuar</button>
        </div>
      )}
    </section>
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
