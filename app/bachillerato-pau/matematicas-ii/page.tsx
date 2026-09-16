import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const plans = [
  {
    name: "Esencial",
    subtitle: "Bachillerato",
    price: "249 €",
    description: "Curso completo para comprender los procedimientos y dominar la asignatura durante 2.º de Bachillerato.",
    href: "/dashboard/comprar/matematicas-ii-esencial",
  },
  {
    name: "Estándar",
    subtitle: "Bachillerato + PAU",
    price: "299 €",
    description: "Todo el curso más entrenamiento específico para convertir lo aprendido en rendimiento de examen.",
    href: "/dashboard/comprar/matematicas-ii-estandar",
    recommended: true,
  },
  {
    name: "PAU",
    subtitle: "Solo entrenamiento PAU",
    price: "199 €",
    description: "Preparación específica para la prueba con problemas, preguntas y simulacros, sin el curso completo.",
    href: "/dashboard/comprar/matematicas-ii-pau",
  },
];

const features = [
  ["◉", "Procedimiento", "Entiende por qué se hace cada paso antes de repetirlo."],
  ["✎", "Práctica", "Resuelve ejercicios de dificultad creciente y comprueba el proceso."],
  ["✓", "Errores", "Detecta fallos típicos y aprende a corregirlos antes de consolidarlos."],
  ["⌁", "PAU", "Entrena problemas y simulacros cuando tu modalidad incluye PAU."],
];

export default function MatematicasIILanding() {
  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.logo}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority /></Link>
      <nav><Link href="/">Inicio</Link><Link href="/bachillerato-pau">Bachillerato y PAU</Link><a href="#modalidades">Modalidades</a><Link className={styles.headerButton} href="/dashboard/matematicas-ii">Entrar al aula</Link></nav>
    </header>

    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}>2.º de Bachillerato · PAU</span>
        <h1>No memorices fórmulas: aprende a resolver.</h1>
        <p>Procedimientos paso a paso, práctica graduada, errores típicos y entrenamiento PAU para saber qué hacer cuando cambia el ejercicio.</p>
        <div className={styles.price}>Desde <strong>199 €</strong> · pago único</div>
        <small>Curso completo desde 249 € · aprox. 1 €/hora de apoyo durante el curso.</small>
        <div className={styles.heroActions}><a className={styles.primary} href="#modalidades">Ver modalidades</a><Link className={styles.outline} href="/dashboard/matematicas-ii">Ver primera unidad</Link></div>
        <div className={styles.micro}><span>✓ 49 unidades operativas</span><span>✓ PAU por modalidad</span><span>✓ Rocío y Fernando</span></div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.formula}><span>A·x=b</span><b>∫ f(x) dx</b><em>u × v</em><i>P(A|B)</i></div>
        <div className={styles.subjectBadge}><span>√x</span><div><strong>Matemáticas II</strong><small>Bachillerato + PAU</small></div></div>
      </div>
    </section>

    <section className={styles.section}><h2>En Matemáticas, mirar soluciones no es practicar</h2><div className={styles.featureGrid}>{features.map(([icon,title,text]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className={`${styles.section} ${styles.soft}`}><h2>Cómo se estudia Matemáticas II en Base12</h2><div className={styles.steps}>{[["1","Comprende","Revisa el concepto, el origen de los datos y el procedimiento."],["2","Imita","Sigue un ejemplo resuelto entendiendo cada decisión."],["3","Resuelve","Trabaja un caso nuevo sin copiar la solución."],["4","Simula","Mezcla bloques y entrena con condiciones de examen."]].map(([n,t,x]) => <article key={n}><b>{n}</b><div><h3>{t}</h3><p>{x}</p></div></article>)}</div></section>

    <section className={styles.section}><h2>Qué incluye el entorno de aprendizaje</h2><div className={styles.includes}><article><span>▷</span><b>Vídeos</b><small>Explicaciones y procedimientos.</small></article><article><span>▤</span><b>Recursos</b><small>Fórmulas, ejemplos y apoyo.</small></article><article><span>✓</span><b>Comprobación</b><small>Preguntas y ejercicios.</small></article><article><span>▣</span><b>Simulacros</b><small>17 simulacros en el bloque PAU.</small></article><article><span>◎</span><b>Rocío</b><small>Profesora IA del curso.</small></article><article><span>◫</span><b>Fernando</b><small>Tutor IA para organizar el estudio.</small></article></div></section>

    <section className={`${styles.section} ${styles.soft}`} id="modalidades"><h2>Formas de prepararte</h2><div className={styles.planGrid}>{plans.map((plan) => <article key={plan.name} className={plan.recommended ? styles.recommended : ""}>{plan.recommended ? <span className={styles.tag}>Recomendado</span> : null}<h3>{plan.name}</h3><strong>{plan.subtitle}</strong><p>{plan.description}</p><div className={styles.planPrice}>{plan.price}</div><small>Pago único</small><Link href={plan.href}>{plan.recommended ? "Elegir Estándar" : `Elegir ${plan.name}`}</Link></article>)}</div></section>

    <section className={styles.support}><div className={styles.person}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024}/><div><h3>Rocío · Profesora IA</h3><p>Aclara conceptos, procedimientos y dudas de Matemáticas II.</p></div></div><div className={styles.person}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024}/><div><h3>Fernando · Tutor IA</h3><p>Organiza el estudio, el repaso y el progreso hasta la PAU.</p></div></div><div className={styles.pauBox}><span>▣</span><h3>Entrenamiento PAU</h3><p>Separado del curso para que estudies contenido y examen con objetivos claros.</p></div></section>

    <section className={styles.cta}><div><h2>Comprende. Practica. Domina.</h2><p>Matemáticas II con procedimientos, entrenamiento y una estructura clara de principio a fin.</p></div><a className={styles.primary} href="#modalidades">Elegir modalidad</a></section>
  </main>;
}
