import Link from "next/link";
import Image from "next/image";
import { tropaPlans, type TropaPlan, getTropaCatalogSlug } from "@/lib/tropa-commercial";
import type { CourseSlug } from "@/lib/courses";
import TropaCheckoutForm from "./TropaCheckoutForm";
import RecommendedBadge from "./RecommendedBadge";
import styles from "./TropaCommercialPage.module.css";

function Header({ showTropaAccess = false }: { showTropaAccess?: boolean }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/">
          <Image className={styles.logo} src="/images/base12-logo.png" alt="Base12 Academy" width={126} height={58} />
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          {showTropaAccess && (
            <Link className={styles.tropaAccess} href="/tropa-y-marineria">
              Preparación Tropa y Marinería
            </Link>
          )}
          <Link href="/#catalogo">Catálogo</Link>
          <Link className={styles.login} href="/login">Acceso alumnos</Link>
        </nav>
      </div>
    </header>
  );
}

function AptitudeCard({ plan }: { plan: TropaPlan }) {
  return (
    <article className={styles.aptitudeCard}>
      <div>
        <span className={styles.productType}>Aptitud concreta</span>
        <h3>{plan.name}</h3>
        <p>{plan.description}</p>
      </div>
      <div className={styles.aptitudeAction}>
        <strong>{plan.currentPrice}</strong>
        <Link href={`/tropa-y-marineria/${plan.slug}`}>
          Ver aptitud y contratar →
        </Link>
      </div>
    </article>
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
  const recommended = plan.slug === "operativa";

  return (
    <article className={`${styles.card} ${plan.kind === "training" ? styles.trainingCard : ""} ${recommended ? styles.recommendedCard : ""}`}>
      <div className={styles.cardTop}>
        <span className={styles.productType}>
          {plan.kind === "plan"
            ? "Preparación completa"
            : plan.kind === "aptitude"
              ? "Por aptitud"
              : "Aplicación de preparación física"}
        </span>
        {recommended && <RecommendedBadge />}
      </div>

      {plan.kind === "training" && (
        <Image className={styles.trainingLogo} src="/images/banco-opositores/logo-base12-training.png" alt="Base12 Training" width={180} height={180} />
      )}

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

      {plan.kind === "training" && (
        <Link className={styles.link} href="/apps/base12-training">
          Entrar en Base12 Training
        </Link>
      )}

      <Link className={styles.cardPurchase} href={`/tropa-y-marineria/${plan.slug}#contratar`}>
        Contratar ahora
      </Link>
    </article>
  );
}

export function TropaLanding() {
  const completePlans = tropaPlans.filter((plan) => plan.kind === "plan");
  const aptitudes = tropaPlans.filter((plan) => plan.kind === "aptitude");

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Tropa y Marinería</p>
          <h1>Elige cómo quieres prepararte</h1>
          <p className={styles.intro}>
            Compara los tres planes de preparación completa y elige el nivel de entrenamiento que mejor encaja contigo.
          </p>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Preparación psicotécnica</p>
            <h2>Tres planes para preparar las siete aptitudes</h2>
          </div>

          <div className={`${styles.plans} ${styles.primaryPlans}`} aria-label="Planes de preparación de Tropa y Marinería">
            {completePlans.map((plan) => (
              <ProductCard key={plan.slug} plan={plan} />
            ))}
          </div>

          <div className={styles.aptitudePrompt}>
            <div>
              <strong>¿Solo necesitas reforzar una parte del examen?</strong>
              <span>También puedes elegir una aptitud individual sin contratar un plan completo.</span>
            </div>
            <Link className={styles.aptitudeButton} href="#aptitudes-concretas">
              Entrenar aptitudes concretas
            </Link>
          </div>
        </section>

        <section className={`${styles.sectionBlock} ${styles.aptitudeSection}`} id="aptitudes-concretas">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Entrenamiento individual</p>
            <h2>Aptitudes concretas</h2>
            <p>Entra aquí solo si prefieres trabajar una aptitud específica por separado.</p>
          </div>

          <div className={styles.aptitudeGrid} aria-label="Aptitudes individuales de Tropa y Marinería">
            {aptitudes.map((plan) => (
              <AptitudeCard key={plan.slug} plan={plan} />
            ))}
          </div>
        </section>

        <p className={styles.notice}>
          <b>Pago seguro con Redsys.</b> Tras el pago completarás el alta, elegirás si necesitas
          factura y recibirás el acceso correspondiente a tu modalidad.
        </p>
      </main>
    </div>
  );
}

export function TropaPlanPage({ plan }: { plan: TropaPlan }) {
  const others = tropaPlans.filter((item) => {
    if (item.slug === plan.slug || item.kind === "training") return false;
    if (plan.kind === "aptitude") return item.kind === "aptitude";
    return item.kind === "plan";
  });

  return (
    <div className={styles.page}>
      <Header showTropaAccess={plan.kind === "training"} />

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
          {plan.kind === "training" && (
            <Image className={styles.trainingHeroLogo} src="/images/banco-opositores/logo-base12-training.png" alt="Base12 Training" width={240} height={240} priority />
          )}
          <p className={styles.intro}>{plan.description}</p>
          <Price plan={plan} />
          {plan.kind === "training" && (
            <p><Link className={styles.link} href="/apps/base12-training">Ya lo tengo · Entrar en Base12 Training</Link></p>
          )}
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

            <div id="contratar">
              <TropaCheckoutForm
                courseSlug={getTropaCatalogSlug(plan.slug) as CourseSlug}
                productName={plan.name}
              />
            </div>
          </section>

          <aside className={styles.panel}>
            <h2>{plan.kind === "training" ? "Preparación académica completa" : plan.kind === "aptitude" ? "Otras aptitudes" : "Otros planes"}</h2>
            {plan.kind === "training" && (
              <p className={styles.academicIntro}>
                Training prepara las pruebas físicas. Para los psicotécnicos, Base12 Academy ofrece estos tres planes completos de Tropa y Marinería.
              </p>
            )}
            {others.map((item) => (
              <Link className={styles.asideOption} href={`/tropa-y-marineria/${item.slug}`} key={item.slug}>
                <span>{item.name}</span>
                <strong>{item.currentPrice}</strong>
              </Link>
            ))}
            {plan.kind === "training" && (
              <Link className={styles.asideAllPlans} href="/tropa-y-marineria">
                Comparar los tres planes →
              </Link>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
