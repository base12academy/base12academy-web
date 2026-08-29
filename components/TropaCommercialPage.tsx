import Link from "next/link";
import { tropaPlans, type TropaPlan } from "@/lib/tropa-commercial";
import styles from "./TropaCommercialPage.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/">
          <img className={styles.logo} src="/images/base12-logo.png" alt="Base12 Academy" />
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/#catalogo">Catálogo</Link>
          <Link className={styles.login} href="/login">Acceso alumnos</Link>
        </nav>
      </div>
    </header>
  );
}

function Price({ plan }: { plan: TropaPlan }) {
  return (
    <>
      <div className={styles.prices}>
        {"previousPrice" in plan && plan.previousPrice && (
          <span className={styles.previous}>{plan.previousPrice}</span>
        )}
        <strong className={styles.current}>{plan.currentPrice}</strong>
      </div>
      {"previousPrice" in plan && plan.previousPrice && (
        <span className={styles.discount}>40 € de descuento</span>
      )}
    </>
  );
}

function ProductCard({ plan }: { plan: TropaPlan }) {
  return (
    <article className={`${styles.card} ${plan.kind === "training" ? styles.trainingCard : ""}`}>
      <span className={styles.productType}>
        {plan.kind === "plan"
          ? "Preparación completa"
          : plan.kind === "aptitude"
            ? "Por aptitud"
            : "Aplicación de preparación física"}
      </span>

      <h2>{plan.name}</h2>
      <Price plan={plan} />
      <p>{plan.description}</p>

      <ul className={styles.compactList}>
        {plan.includes.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <Link className={styles.link} href={`/tropa-y-marineria/${plan.slug}`}>
        Ver contenido
      </Link>

      <button className={styles.closed} type="button" disabled>
        Contratación disponible próximamente
      </button>
    </article>
  );
}

export function TropaLanding() {
  const psychometricProducts = tropaPlans.filter((plan) => plan.kind !== "training");
  const training = tropaPlans.find((plan) => plan.kind === "training");

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Tropa y Marinería</p>
          <h1>Elige cómo quieres prepararte</h1>
          <p className={styles.intro}>
            Puedes elegir una preparación completa o entrenar únicamente la aptitud que necesites reforzar.
          </p>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Preparación psicotécnica</p>
            <h2>Paquetes y aptitudes</h2>
          </div>

          <div className={styles.plans} aria-label="Paquetes y aptitudes de Tropa y Marinería">
            {psychometricProducts.map((plan) => (
              <ProductCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </section>

        {training && (
          <section className={styles.trainingSection}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Preparación física</p>
              <h2>Base12 Training</h2>
            </div>
            <div className={styles.trainingGrid}>
              <ProductCard plan={training} />
            </div>
          </section>
        )}

        <p className={styles.notice}>
          <b>Contratación todavía cerrada.</b> Estas páginas presentan las modalidades comerciales.
          No habilitan pagos, pedidos ni matrículas.
        </p>
      </main>
    </div>
  );
}

export function TropaPlanPage({ plan }: { plan: TropaPlan }) {
  const others = tropaPlans.filter((item) => item.slug !== plan.slug);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <Link className={styles.back} href="/tropa-y-marineria">
          ← Ver todas las modalidades
        </Link>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            {plan.kind === "training"
              ? "Base12 Training · Preparación física"
              : plan.kind === "aptitude"
                ? "Tropa y Marinería · Aptitud"
                : "Tropa y Marinería · Paquete"}
          </p>

          <h1>{plan.name}</h1>
          <p className={styles.intro}>{plan.description}</p>
          <Price plan={plan} />
        </section>

        <div className={styles.detailGrid}>
          <section className={styles.panel}>
            <h2>Qué incluye</h2>
            <ul className={styles.list}>
              {plan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {"difference" in plan && plan.difference && (
              <>
                <h2>Diferencia principal</h2>
                <p>{plan.difference}</p>
              </>
            )}

            <button className={styles.closed} type="button" disabled>
              Contratación disponible próximamente
            </button>
          </section>

          <aside className={styles.panel}>
            <h2>Otras modalidades</h2>
            {others.map((item) => (
              <p key={item.slug}>
                <Link href={`/tropa-y-marineria/${item.slug}`}>
                  {item.name} · {item.currentPrice}
                </Link>
              </p>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
