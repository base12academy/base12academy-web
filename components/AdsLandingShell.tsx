import Image from "next/image";
import Link from "next/link";
import {
  type CampaignParams,
  withCampaignParams,
} from "@/lib/campaign-tracking";
import styles from "./AdsLandingShell.module.css";

type LandingKey = "tropa" | "clases" | "bachillerato" | "pau";

type LandingHeaderProps = {
  active: LandingKey;
  campaign: CampaignParams;
  ctaHref: string;
  ctaLabel: string;
};

const navigation: Array<{ key: LandingKey | "inicio"; href: string; label: string }> = [
  { key: "inicio", href: "/", label: "Inicio" },
  { key: "clases", href: "/lp/clases-online", label: "Clases online" },
  { key: "bachillerato", href: "/lp/bachillerato", label: "Bachillerato" },
  { key: "pau", href: "/lp/pau", label: "PAU" },
  { key: "tropa", href: "/lp/tropa-y-marineria", label: "Tropa y Marinería" },
];

export function LandingHeader({
  active,
  campaign,
  ctaHref,
  ctaLabel,
}: LandingHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          className={styles.brand}
          href={withCampaignParams("/", campaign)}
          aria-label="Base12 Academy, volver al inicio"
        >
          <Image
            className={styles.logo}
            src="/images/base12-logo.png"
            alt="Base12 Academy"
            width={170}
            height={76}
            priority
          />
        </Link>

        <nav className={styles.mainNav} aria-label="Navegación de las landings">
          {navigation.map((item) => (
            <Link
              className={item.key === active ? styles.activeNav : undefined}
              href={withCampaignParams(item.href, campaign)}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className={styles.headerCta}
          href={withCampaignParams(ctaHref, campaign)}
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}

export function LandingFooter({ campaign }: { campaign: CampaignParams }) {
  return (
    <footer className={styles.footer}>
      <Image
        className={styles.footerLogo}
        src="/images/base12-logo.png"
        alt="Base12 Academy"
        width={150}
        height={68}
      />

      <nav aria-label="Información legal">
        <Link href={withCampaignParams("/aviso-legal", campaign)}>Aviso legal</Link>
        <Link href={withCampaignParams("/privacidad", campaign)}>Privacidad</Link>
        <a href="mailto:base12academy@gmail.com">Contacto</a>
      </nav>
    </footer>
  );
}

export function CampaignLink({
  campaign,
  href,
  className,
  children,
}: {
  campaign: CampaignParams;
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link className={className} href={withCampaignParams(href, campaign)}>
      {children}
    </Link>
  );
}

export { styles as landingStyles };
