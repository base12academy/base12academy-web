"use client";

import { useMemo, useState } from "react";

type Family = "Bachillerato y PAU" | "Cursos online" | "Oposiciones";
type Course = { family: Family; name: string; region?: string };
type Plan = { name: string; price: string; detail: string; includes: string[] };

const bachillerato = [
  "Historia de España",
  "Historia de la Filosofía",
  "Matemáticas II",
  "Matemáticas Aplicadas a las CCSS",
  "Lengua y Literatura",
];

const online = [
  "Ofimática",
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
  if (course.name === "Ofimática") {
    return [
      { name: "Esencial", price: "49 €", detail: "Ofimática de uso habitual · Acceso durante 6 meses", includes: ["Entorno digital, Word, Excel, PowerPoint, Outlook, archivos, Internet, nube y PDF de uso habitual", "Prácticas, retos y comprobaciones para demostrar competencias", "Acompañamiento virtual con Profesora IA Rocío y Tutor IA Fernando", "Certificado Base12 de Ofimática Esencial tras completar el itinerario y demostrar las competencias exigidas"] },
      { name: "Estándar", price: "119 €", detail: "Datos y herramientas profesionales · Acceso durante 9 meses", includes: ["Todo lo incluido en Esencial", "Documentos y datos avanzados: formularios, Access, Power Query y Power BI funcional", "Colaboración estructurada, multimedia y automatizaciones sencillas", "Certificado Base12 de Ofimática Estándar tras completar el itinerario y demostrar las competencias exigidas"] },
      { name: "Premium", price: "239 €", detail: "Automatización e IA aplicada · Acceso durante 12 meses", includes: ["Todo lo incluido en Estándar", "Publicación y distribución de Power BI, flujos, aprobaciones y control operativo", "Automatización avanzada e inteligencia artificial integrada en procesos profesionales", "Certificado Base12 de Ofimática Premium tras completar el itinerario y demostrar las competencias exigidas"] },
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
    { name: "Esencial", price: "149 €", detail: "Preparación completa a tu ritmo", includes: ["Temario estructurado de la oposición", "Glosarios y cuadros de apoyo", "Fuentes oficiales vinculadas", "Test de comprobación", "Acceso online a tu ritmo"] },
    { name: "Estándar", price: "299 €", detail: "Más práctica y entrenamiento de examen", includes: ["Todo lo incluido en Esencial", "Banco ampliado de preguntas", "Textos de audio y vídeo cuando estén disponibles", "Simulacros de examen", "Seguimiento del progreso"] },
    { name: "Premium", price: "499 €", detail: "Seguimiento y apoyo prioritarios", includes: ["Todo lo incluido en Estándar", "Plan de estudio personalizado", "Revisión prioritaria del progreso", "Acompañamiento tutorial", "Resolución prioritaria de consultas"] },
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
            <small>{course.family}</small>
            <h2 id="modal-course-title">{course.name}</h2>
            <p>Selecciona una modalidad y revisa la información antes de continuar.</p>

            <div className="original-plan-grid">
              {plansFor(course).map((item) => (
                <button key={item.name} className={plan.name === item.name ? "active" : ""} onClick={() => setPlan(item)}>
                  <span><b>{item.name}</b><small>{item.detail}</small></span>
                  <strong>{item.price}</strong>
                </button>
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

            <div className="original-legal">
              <h3>Información contractual</h3>
              <details>
                <summary>Condiciones de contratación</summary>
                <p>La matrícula da acceso online al curso y modalidad seleccionados durante el periodo indicado. En Ofimática, Estándar incluye Esencial y Premium incluye Estándar. El acompañamiento ordinario es virtual mediante la plataforma y sus asistentes IA.</p>
              </details>
              <details>
                <summary>Privacidad y tratamiento de datos</summary>
                <p>Imagen Digital Ménace, S. L. U. tratará los datos necesarios para gestionar la matrícula, prestar el servicio, habilitar los asistentes IA, verificar el progreso académico, emitir certificados y cumplir sus obligaciones legales.</p>
              </details>
              <details>
                <summary>Aviso legal y normas de uso</summary>
                <p>Los materiales y credenciales son personales. No se permite reproducir, distribuir o compartir los contenidos sin autorización. La normativa de convocatorias debe contrastarse con la publicación oficial.</p>
              </details>
              {course.family === "Cursos online" && (
                <details>
                  <summary>Condiciones del certificado</summary>
                  <p>El certificado se genera únicamente tras finalizar el itinerario y demostrar las competencias y evidencias exigidas para la modalidad, sin pagos pendientes. No equivale por sí mismo a una titulación oficial ni a una certificación profesional regulada.</p>
                </details>
              )}
              {course.name === "Ofimática" && (
                <details>
                  <summary>Desistimiento e inicio inmediato</summary>
                  <p>Con carácter general, el plazo de desistimiento en contratos a distancia es de 14 días naturales, salvo excepción legal aplicable. Si solicita acceso inmediato, deberá prestar separadamente los consentimientos legalmente exigibles antes del inicio.</p>
                </details>
              )}
            </div>

            <div className="original-consents">
              <label><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /> <span>He leído y acepto las condiciones de contratación y las normas de uso. <b>Obligatorio</b></span></label>
              <label><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /> <span>He leído la política de privacidad y autorizo el tratamiento necesario para la matrícula. <b>Obligatorio</b></span></label>
              <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /> <span>Quiero recibir novedades y ofertas. <em>Opcional</em></span></label>
            </div>

            <div className="original-checkout">
              <span>Total <b>{plan.price}</b></span>
              <button disabled>Matriculación disponible próximamente</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
