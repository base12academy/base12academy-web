import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseCatalog from "@/components/CourseCatalog";
import { getOppositionPage, oppositionPages } from "@/lib/oppositions/public-pages";
import styles from "./oposiciones.module.css";

const standardPlans = [
  { slug:"esencial", name:"Esencial", price:"149 €", term:"12 meses", points:["Temario organizado, glosarios y recursos de estudio","Comprobaciones por temas y apoyo académico con Rocío"] },
  { slug:"estandar", name:"Estándar", price:"299 €", term:"12 meses", points:["Todo lo incluido en Esencial","Banco de preguntas, simulacros e historial según el curso"] },
  { slug:"premium", name:"Premium", price:"599 €", term:"12 meses", points:["Todo lo incluido en Estándar","Plan de estudio y seguimiento humano semanal según la modalidad"] },
];
const faqItems = [
  ["¿Dónde consulto la convocatoria más reciente?","En la fuente oficial que enlazamos. Revisa las bases, correcciones y acuerdos posteriores: son los documentos que determinan las condiciones."],
  ["¿Dónde se celebran las pruebas?","La sede, la fecha y la hora aparecen en las bases o en avisos posteriores del órgano de selección; a veces el llamamiento es individual."],
  ["¿Qué titulación necesito?","La titulación y sus equivalencias se fijan en las bases de cada convocatoria. Comprueba cuerpo, turno y categoría antes de inscribirte."],
  ["¿Qué ejercicios y condiciones tiene el examen?","Las bases concretas indican ejercicios, duración, puntuación, penalizaciones y nota mínima. Estos datos pueden cambiar entre convocatorias."],
];

export function generateStaticParams() { return oppositionPages.map(({slug})=>({slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params, item=getOppositionPage(slug);
  if(!item) return {};
  return {title:`${item.name} online | Base12 Academy`,description:`Consulta la convocatoria oficial, los requisitos, las pruebas y los precios para preparar ${item.name} con Base12 Academy.`,alternates:{canonical:`https://base12academy.es/oposiciones/${item.slug}`}};
}

export default async function OppositionPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{matricula?:string;modalidad?:string}>}){
  const [{slug},query]=await Promise.all([params,searchParams]), item=getOppositionPage(slug);
  if(!item) notFound();
  const isTropa=item.slug==="tropa-y-marineria";
  const plans=isTropa?[
    {slug:"esencial",name:"Esencial",price:"139 €",term:"14.000 preguntas",points:["Entrenamiento esencial","Itinerario de Tropa y Marinería","Rocío y Fernando"]},
    {slug:"operativa",name:"Operativa",price:"209 €",term:"21.000 preguntas",points:["Entrenamiento ampliado","Itinerario ampliado","Rocío y Fernando"]},
    {slug:"integral",name:"Integral",price:"279 €",term:"28.000 preguntas",points:["Preparación completa","Acceso completo al itinerario","Rocío y Fernando"]},
  ]:standardPlans;
  const canPurchase=!["telefonista-sas","celador-sermas"].includes(item.slug);
  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.headerInner}><Link href="/" className={styles.brand}><Image src="/images/base12-logo.png" width={1024} height={1024} alt="Base12 Academy" priority/><span>Base12 Academy</span></Link><Link className={styles.login} href="/login">Acceso alumnos</Link></div></header>
    <main className={styles.main}>
      <nav className={styles.breadcrumb} aria-label="Ruta"><Link href="/">Inicio</Link> / <Link href="/?familia=oposiciones#catalogo">Oposiciones</Link> / {item.name}</nav>
      <section className={styles.hero}><div><p className={styles.eyebrow}>{item.region} · {item.authority}</p><h1>{item.name}</h1><p className={styles.lede}>Consulta el proceso oficial, compara las modalidades y elige el tipo de preparación que se ajusta a tu objetivo.</p></div>
        <aside className={styles.heroAside}><Image src="/images/eduardo-base12.png" alt="Eduardo, Doctor en Historia y docente, director académico de Base12" width={507} height={356}/><div><strong>Dirección académica</strong><p>Eduardo · Doctor en Historia y docente</p><Link href="/#equipo">Conoce Base12</Link></div></aside>
      </section>
      <section className={styles.section} id="convocatoria"><p className={styles.eyebrow}>Convocatoria, pruebas y sede</p><h2>Información oficial para esta oposición</h2>
        {item.latestCall?<article className={styles.callCard}><small>Última convocatoria localizada · comprobación: 27 de noviembre de 2026</small><h3>{item.latestCall.title}</h3><p>{item.latestCall.details}</p><a href={item.latestCall.url} target="_blank" rel="noreferrer">Leer la convocatoria oficial</a></article>:<article className={styles.callCard}><small>La convocatoria depende del organismo y del turno</small><h3>Consulta el proceso vigente de {item.authority}</h3><p>Las plazas, los plazos y las condiciones se publican para cada proceso. Esta página enlaza la fuente oficial para que puedas comprobar la convocatoria más reciente, sus bases y sus correcciones sin mezclar datos de otra administración o universidad.</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel}</a></article>}
        <div className={styles.factGrid}>
          <article className={styles.fact}><h3>Ejercicios y condiciones</h3><p>{item.examConditions ?? "Los ejercicios, la duración, la puntuación y las penalizaciones se determinan en las bases de cada convocatoria. Consulta las condiciones del proceso oficial enlazado."}</p></article>
          <article className={styles.fact}><h3>Lugar de las pruebas</h3><p>{item.examLocation ?? "El órgano convocante publicará la sede, la fecha y la hora en el anuncio de llamamiento o en la resolución de personas admitidas."}</p></article>
          <article className={styles.fact}><h3>Título y requisitos</h3><p>{item.qualification}</p></article>
          {item.applicationInfo&&<article className={styles.fact}><h3>Inscripción y tasa</h3><p>{item.applicationInfo}</p></article>}
        </div>
      </section>
      <section className={styles.section} id="preparacion"><p className={styles.eyebrow}>Modalidades y precios</p><h2>Elige cómo preparar la oposición</h2><p className={styles.sectionIntro}>Precios visibles antes de iniciar la matrícula. La ficha final del paquete confirma los recursos incluidos en ese curso.</p>
        <div className={styles.planGrid}>{plans.map(plan=><article className={styles.plan} key={plan.slug}><h3>{plan.name}</h3><strong className={styles.planPrice}>{plan.price}</strong><small>{plan.term}</small><ul>{plan.points.map(point=><li key={point}>{point}</li>)}</ul>
          {isTropa?<Link className={styles.planLink} href="/tropa-y-marineria">Ver preparación</Link>:canPurchase?<Link className={styles.planLink} href={`/oposiciones/${item.slug}?matricula=1&modalidad=${plan.slug}#matricula`}>Elegir {plan.name}</Link>:<span className={styles.unavailable}>Matrícula no disponible</span>}
        </article>)}
          <article className={`${styles.plan} ${styles.opo12Plan}`}><h3>TEST OPO12</h3><strong className={styles.planPrice}>9,90 €/mes</strong><small>Acceso mensual independiente</small><ul><li>Test por temas y simulacros</li><li>Historial personal de resultados</li></ul><Link className={styles.planLink} href={`/test-opo12/${item.slug}`}>Ver TEST OPO12</Link></article>
        </div>
        <p className={styles.note}>El acceso a TEST OPO12 se contrata desde su propia ficha y se renueva manualmente cada mes.</p>
      </section>
      <section className={styles.section}><p className={styles.eyebrow}>Preparación Base12</p><h2>Contenido y forma de estudio</h2><div className={styles.factGrid}><article className={styles.fact}><h3>Temario y recursos</h3><p>Material organizado para trabajar los contenidos del programa específico de la oposición.</p></article><article className={styles.fact}><h3>Práctica y corrección</h3><p>La modalidad elegida concreta los test, simulacros, correcciones e historial disponibles en el aula.</p></article><article className={styles.fact}><h3>Acceso</h3><p>Tras formalizar la matrícula, los recursos contratados se consultan desde el campus del alumno.</p></article></div></section>
      <section className={styles.section} id="dudas"><p className={styles.eyebrow}>Preguntas frecuentes</p><h2>Antes de presentarte</h2><div className={styles.faq}>{faqItems.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
      {!isTropa&&<CourseCatalog purchaseOnlySlug={item.slug} autoOpenPurchase={query.matricula==="1"} purchasePlanSlug={query.modalidad}/>}
    </main>
    <footer className={styles.footer}><div className={styles.footerInner}><span>Base12 Academy · {item.name}</span><Link href="/aviso-legal">Información legal</Link><Link href="/terminos-contratacion">Condiciones de contratación</Link></div></footer>
  </div>;
}
