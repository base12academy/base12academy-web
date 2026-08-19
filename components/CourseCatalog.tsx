"use client";

import { useMemo, useState } from "react";
import officeProgram from "../lib/ofimatica-content.json";

type Family = "Bachillerato y PAU" | "Cursos online" | "Oposiciones";
type Course = { family: Family; name: string; region?: string };
type Plan = { name: string; price: string; detail: string; includes: string[] };

const officePresentationMedia: Record<string, { videoUrl: string; videoPoster: string }> = {
  "Competencias digitales": {
    videoUrl: "/videos/competencias-digitales-presentacion.mp4",
    videoPoster: "/images/posters/competencias-digitales.png",
  },
  "Ofimática": {
    videoUrl: "/videos/ofimatica-presentacion.mp4",
    videoPoster: "/images/posters/ofimatica.png",
  },
  "Productividad Digital e IA": {
    videoUrl: "/videos/productividad-digital-ia-presentacion.mp4",
    videoPoster: "/images/posters/productividad-digital-ia.png",
  },
};

const bachillerato = [
  "Historia de España",
  "Historia de la Filosofía",
  "Matemáticas II",
  "Matemáticas Aplicadas a las CCSS",
  "Lengua y Literatura",
];

const online = [
  "Competencias y Productividad Digital, Ofimática e IA",
  "Protocolo Institucional",
  "Protocolo Social y Empresarial",
  "Gestión Eficaz del Tiempo para Profesionales y Empresarios",
];

const oposiciones = [
  ["Andalucía", "Administrativo de la Junta de Andalucía"],
  ["Andalucía", "Auxiliar Administrativo de la Junta de Andalucía"],
  ["Andalucía", "Administrativo del Servicio Andaluz de Salud"],
  ["Andalucía", "Auxiliar Administrativo del Servicio Andaluz de Salud"],
  ["Andalucía", "Celador del Servicio Andaluz de Salud"],
  ["Andalucía", "Telefonista del Servicio Andaluz de Salud"],
  ["Madrid", "Administrativo de la Comunidad de Madrid"],
  ["Madrid", "Auxiliar Administrativo de la Comunidad de Madrid"],
  ["Madrid", "Administrativo del SERMAS"],
  ["Madrid", "Auxiliar Administrativo del SERMAS"],
  ["Madrid", "Celador del SERMAS"],
  ["Comunidad Valenciana", "Administrativo de la Generalitat Valenciana"],
  ["Comunidad Valenciana", "Auxiliar Administrativo de la Generalitat Valenciana"],
  ["Comunidad Valenciana", "Administrativo del Sistema Valenciano de Salud"],
  ["Comunidad Valenciana", "Auxiliar Administrativo del Sistema Valenciano de Salud"],
  ["Comunidad Valenciana", "Celador del Sistema Valenciano de Salud"],
  ["Estado", "Administrativo del Estado"],
  ["Estado", "Auxiliar Administrativo del Estado"],
  ["Estado", "Administrativo de la Seguridad Social"],
  ["Estado", "Auxiliar Administrativo de la Seguridad Social"],
] as const;

const allCourses: Course[] = [
  ...bachillerato.map((name) => ({ family: "Bachillerato y PAU" as const, name })),
  ...online.map((name) => ({ family: "Cursos online" as const, name })),
  ...oposiciones.map(([region, name]) => ({ family: "Oposiciones" as const, name, region })),
];

function plansFor(course: Course): Plan[] {
  if (course.family === "Bachillerato y PAU") {
    return [
      { name: "Esencial", price: "249 €", detail: "Comprende y domina 2.º de Bachillerato", includes: ["Curso completo y temario estructurado", "Vídeos explicativos y texto de cada contenido", "Pruebas tipo test", "Banco de textos, imágenes y recursos", "Asistente virtual de apoyo", "Sin entrenamiento específico PAU"] },
      { name: "Estándar", price: "299 €", detail: "Bachillerato más entrenamiento PAU", includes: ["Todo lo incluido en Esencial", "Preparación específica para la PAU", "Pruebas tipo test y de desarrollo", "Banco de textos, imágenes y modelos PAU", "Comprobaciones para avanzar por el temario", "Entrenamiento con método y seguridad"] },
      { name: "Premium", price: "399 €", detail: "Preparación avanzada y acompañamiento", includes: ["Todo lo incluido en Estándar", "Preparación PAU avanzada", "Más pruebas de desarrollo y recursos didácticos", "Banco ampliado de textos e imágenes", "Mentoría de apoyo", "Mayor seguimiento y exigencia académica"] },
      { name: "PAU", price: "199 €", detail: "Entrenamiento exclusivo para la prueba", includes: ["Preparación específica para la PAU", "Pruebas y modelos tipo PAU", "Banco de textos, imágenes y ejercicios", "Entrenamiento de respuestas de desarrollo", "Asistente virtual", "Mentoría de apoyo"] },
    ];
  }
  if (course.name === "Competencias y Productividad Digital, Ofimática e IA") {
    return [
      { name: "Competencias digitales", price: "49 €", detail: "Competencias digitales de uso habitual · Acceso durante 6 meses", includes: ["Entorno digital, Word, Excel, PowerPoint, Outlook, archivos, Internet, nube y PDF de uso habitual", "Prácticas, retos y comprobaciones para demostrar competencias", "Acompañamiento virtual con Profesora IA Rocío y Tutor IA Fernando", "Certificado Base12 de Competencias digitales tras completar el itinerario y demostrar las competencias exigidas"] },
      { name: "Ofimática", price: "119 €", detail: "Ofimática y herramientas profesionales · Acceso durante 9 meses", includes: ["Todo lo incluido en Competencias digitales", "Documentos y datos avanzados: formularios, Access, Power Query y Power BI funcional", "Colaboración estructurada, multimedia y automatizaciones sencillas", "Certificado Base12 de Ofimática tras completar el itinerario y demostrar las competencias exigidas"] },
      { name: "Productividad Digital e IA", price: "239 €", detail: "Automatización, productividad e IA aplicada · Acceso durante 12 meses", includes: ["Todo lo incluido en Ofimática", "Publicación y distribución de Power BI, flujos, aprobaciones y control operativo", "Automatización avanzada e inteligencia artificial integrada en procesos profesionales", "Certificado Base12 de Productividad Digital e IA tras completar el itinerario y demostrar las competencias exigidas"] },
    ];
  }
  if (course.family === "Cursos online") {
    return [
      { name: "Esencial", price: "69,90 €", detail: "Comprender los contenidos esenciales", includes: ["Todos los vídeos del programa", "Síntesis, claves y 2 comprobaciones por contenido", "Glosario y Profesor IA básico", "Sin casos, diagnóstico, proyecto ni mentoría", "Certificado de realización"] },
      { name: "Estándar", price: "119,90 €", detail: "Aplicar lo aprendido de forma autónoma", includes: ["Todo lo incluido en Esencial", "Desarrollo aplicado completo", "4 comprobaciones explicadas por contenido", "Casos y aplicaciones prácticas", "Diagnóstico final con mínimo del 70 %", "Proyecto autoguiado con rúbrica", "Certificado de aprovechamiento"] },
      { name: "Premium", price: "249,90 €", detail: "Aplicar con revisión y acompañamiento", includes: ["Todo lo incluido en Estándar", "Revisión humana completa del proyecto", "Comprobación posterior de los ajustes", "Una mentoría individual de 45 minutos", "Hasta 3 consultas breves sobre el proyecto", "Informe de fortalezas y prioridades de mejora", "Certificado Premium"] },
    ];
  }
  return [
    { name: "Esencial", price: "149 €", detail: "Preparación completa a tu ritmo · 12 meses", includes: ["Temario estructurado de la oposición", "Glosarios y cuadros de apoyo", "Fuentes oficiales vinculadas", "Un test de comprobación por tema", "Preguntas cerradas y abiertas a Rocío"] },
    { name: "Estándar", price: "299 €", detail: "Más práctica y entrenamiento · 12 meses", includes: ["Todo lo incluido en Esencial", "Banco de 50 preguntas por tema", "Simulacros de 20 preguntas aleatorias", "Historial y progresión de resultados", "Acompañamiento de Rocío y Fernando"] },
    { name: "Premium", price: "499 €", detail: "Seguimiento humano semanal · 12 meses", includes: ["Todo lo incluido en Estándar", "Plan de estudio personalizado", "Revisión prioritaria del progreso", "Tutoría humana individual de 30 minutos cada semana", "Calendario de reserva modificable"] },
  ];
}

export default function CourseCatalog() {
  const [family, setFamily] = useState<Family>("Bachillerato y PAU");
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState<Course | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [immediateAccess, setImmediateAccess] = useState(false);
  const [withdrawalAcknowledged, setWithdrawalAcknowledged] = useState(false);
  const [presentationVideo, setPresentationVideo] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const filtered = useMemo(
    () => allCourses.filter((item) => item.family === family && item.name.toLowerCase().includes(search.toLowerCase())),
    [family, search],
  );

  function open(item: Course) {
    setCourse(item);
    setPlan(plansFor(item)[0]);
    setTerms(false);
    setPrivacy(false);
    setMarketing(false);
    setImmediateAccess(false);
    setWithdrawalAcknowledged(false);
  }

  async function checkout() {
    if (!course || !plan) return;

    const purchasableOpposition = course.name === "Administrativo de la Junta de Andalucía" || course.name === "Auxiliar Administrativo de la Junta de Andalucía";
    if (course.name !== "Competencias y Productividad Digital, Ofimática e IA" && !purchasableOpposition) {
      setCheckoutError("La matrícula online de este curso todavía no está disponible.");
      return;
    }

    if (!terms || !privacy || (immediateAccess && !withdrawalAcknowledged)) {
      setCheckoutError("Acepta primero los consentimientos obligatorios.");
      return;
    }

    const slugByPlan: Record<string, string> = {
      "Competencias digitales": "ofimatica-esencial",
      "Ofimática": "ofimatica-estandar",
      "Productividad Digital e IA": "ofimatica-premium",
    };

    const oppositionPrefix = course.name === "Administrativo de la Junta de Andalucía" ? "administrativo-ja" : course.name === "Auxiliar Administrativo de la Junta de Andalucía" ? "auxiliar-administrativo-ja" : "";
    const oppositionPlan = ({ Esencial: "esencial", "Estándar": "estandar", Premium: "premium" } as Record<string, string>)[plan.name];
    const courseSlug = slugByPlan[plan.name] || (oppositionPrefix && oppositionPlan ? `${oppositionPrefix}-${oppositionPlan}` : "");

    if (!courseSlug) {
      setCheckoutError("No se ha podido identificar la modalidad seleccionada.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/redsys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug,
          termsAccepted: terms,
          privacyAcknowledged: privacy,
          immediateAccess,
          withdrawalAcknowledged,
          marketingConsent: marketing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo preparar el pago.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.redsysUrl;

      const fields = {
        Ds_SignatureVersion: data.dsSignatureVersion,
        Ds_MerchantParameters: data.dsMerchantParameters,
        Ds_Signature: data.signature,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "No se pudo iniciar el pago."
      );
      setCheckoutLoading(false);
    }
  }
  return (
    <section id="catalogo" className="original-catalog">
      <div className="original-catalog-heading">
        <p>Tipos de cursos, paquetes y precios</p>
        <h2>Elige el aula que corresponde a tu objetivo</h2>
        <span>Consulta cada curso, compara lo que incluye cada modalidad y revisa el precio antes de matricularte.</span>
      </div>

      <div className="original-tabs" role="tablist" aria-label="Tipos de cursos">
        {(["Bachillerato y PAU", "Cursos online", "Oposiciones"] as Family[]).map((item) => (
          <button key={item} role="tab" aria-selected={family === item} className={family === item ? "active" : ""} onClick={() => { setFamily(item); setSearch(""); }}>
            {item}
          </button>
        ))}
      </div>

      <label className="original-search">
        <span>Buscar</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Escribe el nombre del curso" />
      </label>

      {family === "Bachillerato y PAU" && (
        <div className="original-discounts">
          <b>Descuento automático por varias asignaturas</b>
          <span>2 asignaturas: <strong>10%</strong></span>
          <span>3 asignaturas: <strong>15%</strong></span>
          <span>4 o más: <strong>20%</strong></span>
        </div>
      )}

      {family === "Cursos online" && (
        <div className="certificate-note">
          <div className="certificate-icon">✓</div>
          <div>
            <b>Certificado Base12 al superar el curso</b>
            <p>Se emitirá a nombre del alumno cuando haya cumplido los requisitos académicos y no tenga pagos pendientes. El PDF se enviará automáticamente a su correo y contará con código de verificación.</p>
          </div>
        </div>
      )}

      <div className="original-course-grid">
        {filtered.map((item) => (
          <article key={item.name}>
            <div>
              <small>{item.region || item.family}</small>
              <h3>{item.name}</h3>
              <p>Desde <b>{plansFor(item)[0].price}</b></p>
            </div>
            <button onClick={() => open(item)}>Ver modalidades</button>
          </article>
        ))}
      </div>

      {course && plan && (
        <div className="original-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCourse(null)}>
          <section className="original-modal" role="dialog" aria-modal="true" aria-labelledby="modal-course-title">
            <button className="original-modal-close" onClick={() => setCourse(null)} aria-label="Cerrar">×</button>
            {course.name === "Competencias y Productividad Digital, Ofimática e IA" ? (
              <div className="commercial-course-hero">
                <div className="commercial-course-copy">
                  <small>{course.family}</small>
                  <h2 id="modal-course-title">{plan.name}</h2>
                  <p>{plan.detail}</p>
                  <div className="commercial-course-value">
                    <span>Acceso online</span>
                    <span>Certificado Base12</span>
                  </div>
                  <strong className="commercial-course-price">{plan.price}</strong>
                  <div className="commercial-course-actions">
                    <a href="#course-checkout">Matricularme</a>
                    <a className="secondary" href="/dashboard/ofimatica?contenido=G01_V01">Probar la Unidad 1 gratis</a>
                  </div>
                </div>
                <div className="commercial-course-video">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    poster={officePresentationMedia[plan.name].videoPoster}
                    aria-label={`Vídeo de presentación de ${plan.name}`}
                  >
                    <source src={officePresentationMedia[plan.name].videoUrl} type="video/mp4" />
                    Tu navegador no permite reproducir este vídeo.
                  </video>
                </div>
              </div>
            ) : (
              <>
                <small>{course.family}</small>
                <h2 id="modal-course-title">{course.name}</h2>
                <p>Selecciona una modalidad y revisa la información antes de continuar.</p>
              </>
            )}
            {course.name === "Administrativo de la Junta de Andalucía" && (
              <p><a href="/dashboard/administrativo-ja?tema=T01" style={{ display: "inline-block", padding: "10px 14px", borderRadius: 999, background: "#e5f0e1", color: "#285b35", textDecoration: "none", fontWeight: 800 }}>Probar gratis el Tema 1</a></p>
            )}

            <div className="original-plan-grid">
              {plansFor(course).map((item) => (
                <div key={item.name} className={`original-plan-option ${plan.name === item.name ? "active" : ""}`}>
                  <button className="original-plan-select" onClick={() => setPlan(item)}>
                    <span><b>{item.name}</b><small>{item.detail}</small></span>
                  </button>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>

            <div className="original-plan-includes" aria-live="polite">
              <div className="original-plan-includes-heading">
                <div>
                  <small>Modalidad seleccionada</small>
                  <h3>Qué incluye {plan.name}</h3>
                </div>
                <strong>{plan.price}</strong>
              </div>
              <ul>
                {plan.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            {course.name === "Competencias y Productividad Digital, Ofimática e IA" && (
              <div className="commercial-course-details">
                <section>
                  <small>Programa completo</small>
                  <h3>Del entorno digital al proyecto integrado</h3>
                  <div className="commercial-course-program">
                    {officeProgram.groups.map((group) => (
                      <details key={group.id}>
                        <summary><span>{group.id}</span>{group.title}<b>{group.lessons.length} contenidos</b></summary>
                        <ul>{group.lessons.map((lesson) => <li key={lesson.id}>{lesson.title}</li>)}</ul>
                      </details>
                    ))}
                  </div>
                </section>

                <section>
                  <small>Competencias que adquirirás</small>
                  <h3>Un itinerario práctico y acumulativo</h3>
                  <ul className="commercial-course-competencies">
                    {officeProgram.groups.map((group) => <li key={group.id}>{group.title}</li>)}
                  </ul>
                </section>

                <section className="commercial-course-ai">
                  <div><span aria-hidden="true">R</span><p><b>Rocío · Profesora IA</b>Enseña y resuelve dudas académicas durante el itinerario.</p></div>
                  <div><span aria-hidden="true">F</span><p><b>Fernando · Tutor IA</b>Realiza seguimiento, recuperación y orientación del progreso.</p></div>
                </section>

                <section className="commercial-course-certificate">
                  <span aria-hidden="true">✓</span>
                  <div><small>Certificado</small><h3>Certificado Base12 de {plan.name}</h3><p>Se emite al completar el itinerario y demostrar las competencias exigidas, sin pagos pendientes.</p></div>
                </section>
              </div>
            )}

            <div className="original-legal">
              <h3>Información contractual</h3>
              <details>
                <summary>Condiciones de contratación</summary>
                <p>La matrícula da acceso personal y no transferible a {course.name} — paquete {plan.name}, por {plan.price}, durante el periodo indicado. El precio, los impuestos, el contenido incluido, los requisitos y la fecha de activación se mostrarán antes del pago. Ofimática incluye Competencias digitales y Productividad Digital e IA incluye Ofimática.</p>
                <p>El acompañamiento ordinario es virtual: Rocío enseña y resuelve dudas académicas; Fernando realiza seguimiento y recuperación; Jefatura organiza el itinerario; Secretaría atiende pagos y facturas; y Comercial informa sobre modalidades y contratación. No se incluye tutoría humana síncrona ni mentoría individual. Las dudas que los asistentes no resuelvan, o cuya revisión solicite expresamente el alumno, podrán escalarse por correo diferido a Dirección académica.</p>
                <p><a href="/terminos-contratacion" target="_blank" rel="noreferrer">Consultar las condiciones generales completas</a>.</p>
              </details>
              <details>
                <summary>Privacidad y tratamiento de datos</summary>
                <p>Imagen Digital Ménace, S. L. U. tratará los datos necesarios para atender la solicitud, gestionar matrícula, pago y factura, crear el acceso, prestar el servicio, habilitar los asistentes IA, registrar progreso y evidencias, emitir certificados, atender incidencias y cumplir obligaciones legales. Las comunicaciones comerciales requieren una base jurídica separada.</p>
                <p><a href="/privacidad" target="_blank" rel="noreferrer">Consultar la política de privacidad completa</a>.</p>
              </details>
              <details>
                <summary>Aviso legal y normas de uso</summary>
                <p>Las credenciales y los materiales son personales. No se permite compartir el acceso, reproducir, distribuir, revender o comunicar públicamente los contenidos sin autorización. Las convocatorias, normas y requisitos deben contrastarse con la publicación oficial vigente.</p>
                <p><a href="/aviso-legal" target="_blank" rel="noreferrer">Consultar el aviso legal completo</a>.</p>
              </details>
              {course.family === "Cursos online" && (
                <details>
                  <summary>Condiciones del certificado</summary>
                  <p>El certificado se genera únicamente tras finalizar el itinerario y demostrar las competencias y evidencias exigidas para la modalidad, sin pagos pendientes. No equivale por sí mismo a una titulación oficial ni a una certificación profesional regulada.</p>
                </details>
              )}
              {course.name === "Competencias y Productividad Digital, Ofimática e IA" && (
                <details>
                  <summary>Desistimiento e inicio inmediato</summary>
                  <p>Con carácter general, el consumidor dispone de 14 días naturales para desistir de un contrato a distancia, salvo excepción legal. Si solicita que un servicio comience durante ese plazo y desiste antes de su ejecución completa, podrá corresponder el pago proporcional de la parte efectivamente prestada. En contenido digital sin soporte material, la pérdida del derecho desde el inicio solo operará si concurren todos los consentimientos y confirmaciones exigidos por la ley.</p>
                  <p>La solicitud de inicio inmediato y el conocimiento de sus consecuencias se recogerán de manera expresa, separada y trazable, sin casillas premarcadas. La confirmación contractual se facilitará en soporte duradero.</p>
                </details>
              )}
              <details>
                <summary>Quejas, reclamaciones y contacto</summary>
                <p>Las incidencias técnicas se atienden en base12academy+soporte@gmail.com; pagos y facturas, en base12academy+facturacion@gmail.com; y desistimientos o reclamaciones, en base12academy+administracion@gmail.com. Las hojas oficiales de la Junta de Andalucía pueden solicitarse gratuitamente, <a href="https://www.juntadeandalucia.es/salud/hoja/" target="_blank" rel="noreferrer">presentarse mediante Hoj@</a> o <a href="https://www.juntadeandalucia.es/temas/vivienda-consumo/consumo/reclamaciones.html" target="_blank" rel="noreferrer">descargarse desde Consumo</a>.</p>
                <p><a href="https://www.juntadeandalucia.es/salud/hoja/" target="_blank" rel="noreferrer"><img src="/legal/hoja-qr-base12.png" width="120" height="120" alt="Código QR oficial de Hoj@ para Base12 Academy" /></a></p>
              </details>
            </div>

            <div className="original-consents">
              <label><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /> <span>He leído y acepto las condiciones de contratación y las normas de uso. <b>Obligatorio</b></span></label>
              <label><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /> <span>He leído la política de privacidad y confirmo que los datos facilitados pueden tratarse para gestionar la matrícula y prestar el servicio. <b>Obligatorio</b></span></label>
              {course.family === "Cursos online" && (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={immediateAccess}
                      onChange={(event) => {
                        setImmediateAccess(event.target.checked);
                        if (!event.target.checked) setWithdrawalAcknowledged(false);
                      }}
                    />
                    <span>Solicito expresamente que el acceso al curso y la prestación comiencen antes de que finalice el plazo de desistimiento de 14 días. <em>Opcional; necesario para acceso inmediato</em></span>
                  </label>
                  {immediateAccess && (
                    <label>
                      <input type="checkbox" checked={withdrawalAcknowledged} onChange={(event) => setWithdrawalAcknowledged(event.target.checked)} />
                      <span>Declaro que comprendo las consecuencias de comenzar: si desisto de una prestación de servicios ya iniciada, podrá corresponder el importe proporcional efectivamente prestado; y, respecto del contenido digital sin soporte material, perderé el derecho de desistimiento desde que comience su ejecución cuando concurran los requisitos legales. <b>Obligatorio para acceso inmediato</b></span>
                    </label>
                  )}
                  {!immediateAccess && <p>Si no solicita el inicio inmediato, el acceso se activará una vez finalizado el plazo legal de desistimiento.</p>}
                </>
              )}
              <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /> <span>Quiero recibir novedades y ofertas. <em>Opcional</em></span></label>
            </div>

            <div className="original-checkout" id="course-checkout">
              <span>Total <b>{plan.price}</b></span>
              {(course.name === "Competencias y Productividad Digital, Ofimática e IA" || course.name === "Administrativo de la Junta de Andalucía" || course.name === "Auxiliar Administrativo de la Junta de Andalucía") ? (
                <button
                  type="button"
                  onClick={checkout}
                  disabled={
                    checkoutLoading ||
                    !terms ||
                    !privacy ||
                    (immediateAccess && !withdrawalAcknowledged)
                  }
                >
                  {checkoutLoading ? "Conectando con el banco…" : "Continuar con la suscripción"}
                </button>
              ) : (
                <button disabled>Matriculación disponible próximamente</button>
              )}
            </div>
            {checkoutError && (
              <p className="original-checkout-error" role="alert">
                {checkoutError}
              </p>
            )}
          </section>

          {presentationVideo && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Vídeo de presentación de ${presentationVideo}`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setPresentationVideo(null);
                }
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                background: "rgba(3, 10, 25, 0.88)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "min(1100px, 96vw)",
                  background: "#000000",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPresentationVideo(null)}
                  aria-label="Cerrar vídeo"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 2,
                    width: "42px",
                    height: "42px",
                    border: "none",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.94)",
                    color: "#111827",
                    fontSize: "26px",
                    lineHeight: 1,
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  ×
                </button>

                <video
                  key={presentationVideo}
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                  style={{
                    width: "100%",
                    display: "block",
                    maxHeight: "86vh",
                    background: "#000000",
                  }}
                >
                  <source
                    src={officePresentationMedia[presentationVideo].videoUrl}
                    type="video/mp4"
                  />
                  Tu navegador no permite reproducir este vídeo.
                </video>
              </div>
            </div>
          )}

        </div>
      )}
    </section>
  );
}

