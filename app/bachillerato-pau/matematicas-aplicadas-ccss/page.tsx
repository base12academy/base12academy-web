import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const plans = [
  {name:"Esencial",subtitle:"Bachillerato",price:"249 €",description:"44 explicaciones operativas, vídeos paso a paso, práctica y comprobación para reforzar lo que trabajas en tu centro.",href:"/dashboard/comprar/matematicas-aplicadas-ccss-esencial"},
  {name:"Estándar",subtitle:"Bachillerato + PAU",price:"299 €",description:"Todo el apoyo del curso más entrenamiento específico de problemas, modelos y simulacros PAU.",href:"/dashboard/comprar/matematicas-aplicadas-ccss-estandar",recommended:true},
  {name:"PAU",subtitle:"Solo entrenamiento PAU",price:"199 €",description:"Entrenamiento específico para la prueba, sin añadir un curso teórico paralelo al que ya has estudiado.",href:"/dashboard/comprar/matematicas-aplicadas-ccss-pau"}
];

export default function MatematicasAplicadasLanding(){
  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.logo}><Image src="/images/base12-logo.png" alt="Base12 Academy" width={1024} height={1024} priority/></Link>
      <nav><Link href="/">Inicio</Link><Link href="/bachillerato-pau">Bachillerato y PAU</Link><a href="#modalidades">Modalidades</a><Link className={styles.headerButton} href="/dashboard/matematicas-aplicadas-ccss">Entrar al aula</Link></nav>
    </header>

    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className={styles.eyebrow}>BACHILLERATO Y PAU</span>
        <h1>Matemáticas Aplicadas a las Ciencias Sociales II</h1>
        <p><strong>Las matemáticas que explican tu mundo.</strong> No te damos otro temario: te ayudamos a comprender y resolver los ejercicios que ya trabajas en clase, con procedimientos claros, práctica y entrenamiento para subir nota.</p>
        <div className={styles.price}>Desde <strong>199 €</strong> · pago único</div>
        <small>Curso completo desde 249 € · Estándar 299 € con entrenamiento PAU.</small>
        <div className={styles.heroActions}><a className={styles.primary} href="#modalidades">Empieza ahora</a><Link className={styles.outline} href="/dashboard/matematicas-aplicadas-ccss">Ver primera explicación</Link></div>
        <div className={styles.micro}><span>✓ 44 explicaciones</span><span>✓ Ejercicios y problemas</span><span>✓ PAU por modalidad</span></div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.formula}><span>P(A|B)</span><b>f′(x)</b><em>∫ f(x)dx</em><i>x̄ ± z·σ/√n</i></div>
        <div className={styles.subjectBadge}><span>Σ</span><div><strong>Matemáticas Aplicadas CCSS II</strong><small>Comprende · Entrena · Domina</small></div></div>
      </div>
    </section>

    <section className={styles.section}><h2>No necesitas más teoría. Necesitas saber resolver.</h2><div className={styles.featureGrid}>
      <article><span>◉</span><h3>Reconoce</h3><p>Identifica qué tipo de problema tienes delante y qué herramienta corresponde.</p></article>
      <article><span>✎</span><h3>Comprende</h3><p>Ve de dónde sale cada fórmula, condición, dato y decisión matemática.</p></article>
      <article><span>✓</span><h3>Resuelve</h3><p>Sigue el procedimiento completo y comprueba cada paso antes del resultado.</p></article>
      <article><span>⌁</span><h3>Transfiere</h3><p>Vuelve a resolver el mismo procedimiento con números y contextos distintos.</p></article>
    </div></section>

    <section className={`${styles.section} ${styles.soft}`}><h2>44 explicaciones construidas desde los ejercicios</h2><div className={styles.steps}>
      {[[1,"Álgebra","Matrices, determinantes y sistemas como procedimientos."],[2,"Programación lineal","Traducir restricciones, construir región y decidir óptimos."],[3,"Análisis","Límites, derivadas, optimización, representación e integrales."],[4,"Probabilidad e inferencia","Elegir el modelo, calcular y justificar la decisión."]].map(([n,t,x])=><article key={String(n)}><b>{n}</b><div><h3>{t}</h3><p>{x}</p></div></article>)}
    </div></section>

    <section className={styles.section}><h2>Apoyo inteligente, no sustitución del instituto</h2><div className={styles.includes}>
      <article><span>▷</span><b>Vídeos</b><small>44 explicaciones paso a paso.</small></article>
      <article><span>✎</span><b>Problemas</b><small>Práctica guiada y transferencia.</small></article>
      <article><span>✓</span><b>Comprobación</b><small>Errores y control de dominio.</small></article>
      <article><span>▣</span><b>PAU</b><small>Entrenamiento específico por modalidad.</small></article>
      <article><span>◎</span><b>Rocío</b><small>Profesora IA de apoyo.</small></article>
      <article><span>◫</span><b>Fernando</b><small>Tutor IA para organizar el estudio.</small></article>
    </div></section>

    <section className={`${styles.section} ${styles.soft}`} id="modalidades"><h2>Elige tu modalidad</h2><div className={styles.planGrid}>{plans.map(plan=><article key={plan.name} className={plan.recommended?styles.recommended:""}>{plan.recommended?<span className={styles.tag}>Recomendado</span>:null}<h3>{plan.name}</h3><strong>{plan.subtitle}</strong><p>{plan.description}</p><div className={styles.planPrice}>{plan.price}</div><small>Pago único</small><Link href={plan.href}>{plan.recommended?"Elegir Estándar":`Elegir ${plan.name}`}</Link></article>)}</div></section>

    <section className={styles.support}>
      <div className={styles.person}><Image src="/images/rocio-profesora-ia.png" alt="Rocío, profesora IA" width={1536} height={1024}/><div><h3>Rocío · Profesora IA</h3><p>Explica conceptos y procedimientos cuando necesitas otra forma de verlo.</p></div></div>
      <div className={styles.person}><Image src="/images/fernando-tutor-ia.png" alt="Fernando, tutor IA" width={1536} height={1024}/><div><h3>Fernando · Tutor IA</h3><p>Organiza el estudio y el entrenamiento según tu progreso.</p></div></div>
      <div className={styles.pauBox}><span>▣</span><h3>Entrenamiento PAU</h3><p>Separado del apoyo del curso para que sepas cuándo estás comprendiendo y cuándo estás entrenando examen.</p></div>
    </section>

    <section className={styles.cta}><div><h2>Comprende. Entrena. Sube nota.</h2><p>Refuerza lo que ya estudias en tu centro y conviértelo en capacidad para resolver problemas.</p></div><a className={styles.primary} href="#modalidades">Elegir modalidad</a></section>
  </main>;
}
