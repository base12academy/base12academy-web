"use client";

import { useMemo, useState } from "react";

type Family = "Bachillerato y PAU" | "Cursos online" | "Oposiciones";
type Course = { family: Family; name: string; region?: string };
type Plan = { name: string; price: string; detail: string };

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
      { name: "Esencial", price: "249 €", detail: "Apoyo completo para 2.º de Bachillerato" },
      { name: "Estándar", price: "299 €", detail: "Bachillerato y preparación PAU" },
      { name: "Premium", price: "399 €", detail: "Acompañamiento avanzado" },
      { name: "PAU", price: "199 €", detail: "Preparación específica para la prueba" },
    ];
  }
  if (course.name === "Ofimática") {
    return [
      { name: "Esencial", price: "39 €", detail: "Acceso durante 6 meses" },
      { name: "Estándar", price: "99 €", detail: "Acceso durante 9 meses" },
      { name: "Premium", price: "199 €", detail: "Acceso durante 12 meses" },
    ];
  }
  if (course.family === "Cursos online") {
    return [
      { name: "Esencial", price: "69,90 €", detail: "Bases y aplicación práctica" },
      { name: "Estándar", price: "119,90 €", detail: "Práctica ampliada y proyecto" },
      { name: "Premium", price: "249,90 €", detail: "Revisión y acompañamiento" },
    ];
  }
  return [
    { name: "Esencial", price: "149 €", detail: "Preparación completa a tu ritmo" },
    { name: "Estándar", price: "299 €", detail: "Más práctica y acompañamiento" },
    { name: "Premium", price: "499 €", detail: "Seguimiento prioritario" },
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
        <p>Oferta formativa y precios</p>
        <h2>Elige el curso que corresponde a tu objetivo</h2>
        <span>La nueva oferta se integra en la experiencia original de Base12, con sus colores, su método y su acompañamiento.</span>
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

            <div className="original-legal">
              <h3>Información contractual</h3>
              <details>
                <summary>Condiciones de contratación</summary>
                <p>La matrícula da acceso al curso y modalidad seleccionados durante el periodo indicado. Antes del pago se informará del contenido, duración, soporte, medios de pago, impuestos aplicables y derecho de desistimiento.</p>
              </details>
              <details>
                <summary>Privacidad y tratamiento de datos</summary>
                <p>Imagen Digital Ménace, S. L. U. tratará los datos necesarios para gestionar la matrícula, prestar el servicio, verificar el progreso académico, emitir certificados y cumplir sus obligaciones legales.</p>
              </details>
              <details>
                <summary>Aviso legal y normas de uso</summary>
                <p>Los materiales y credenciales son personales. No se permite reproducir, distribuir o compartir los contenidos sin autorización. La normativa de convocatorias debe contrastarse con la publicación oficial.</p>
              </details>
              {course.family === "Cursos online" && (
                <details>
                  <summary>Condiciones del certificado</summary>
                  <p>El certificado se genera únicamente si el alumno ha completado los requisitos de su modalidad, ha superado la evaluación o proyecto correspondiente y no mantiene pagos pendientes. Incluirá nombre completo, curso, fecha, modalidad y código único de verificación.</p>
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
              <button disabled={!terms || !privacy}>Continuar con la matrícula</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
