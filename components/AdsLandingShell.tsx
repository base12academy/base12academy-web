import Image from "next/image";
import Link from "next/link";
import {
  type CampaignParams,
  withCampaignParams,
} from "@/lib/campaign-tracking";
import styles from "./AdsLandingShell.module.css";

type LandingHeaderProps = {
  campaign: CampaignParams;
  ctaHref: string;
  ctaLabel: string;
};

export function LandingHeader({
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
            width={150}
            height={68}
            priority
          />
        </Link>

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
      <div>
        <Image
          className={styles.footerLogo}
          src="/images/base12-logo.png"
          alt="Base12 Academy"
          width={130}
          height={58}
        />
        <p>Formación online con método, práctica y acompañamiento.</p>
      </div>

      <nav aria-label="Información legal">
        <Link href={withCampaignParams("/aviso-legal", campaign)}>Aviso legal</Link>
        <Link href={withCampaignParams("/privacidad", campaign)}>Privacidad</Link>
        <Link href={withCampaignParams("/cookies", campaign)}>Cookies</Link>
        <Link href={withCampaignParams("/terminos-contratacion", campaign)}>
          Contratación
        </Link>
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
