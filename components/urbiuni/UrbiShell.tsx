import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ListLink } from "@/components/urbiuni/UrbiList";
import type { Etiqueta } from "@/lib/urbiuni";
import styles from "@/app/urbiuni/urbiuni.module.css";

export function UrbiShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/urbiuni" className={styles.brand}>
            <Image src="/images/urbiuni/logo-urbiuni.png" alt="UrbiUni" width={52} height={52} priority />
            <span><b>UrbiUni</b><small>de Base12 Academy</small></span>
          </Link>
          <nav className={styles.nav} aria-label="UrbiUni">
            <Link href="/urbiuni/buscar" className={styles.hideMobile}>Buscar grados</Link>
            <Link href="/" className={styles.hideMobile}>Base12 Academy</Link>
            <ListLink />
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <nav>
            <Link href="/urbiuni">UrbiUni</Link>
            <Link href="/bachillerato-pau">Bachillerato y PAU en Base12</Link>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/cookies">Cookies</Link>
          </nav>
          <p>UrbiUni es una herramienta gratuita de Base12 Academy. Los datos proceden de fuentes oficiales (Ministerio, RUCT, SIIU, distritos de acceso y universidades) y cada dato indica su fuente. Comprueba siempre la información en la fuente enlazada antes de tomar una decisión.</p>
        </div>
      </footer>
    </div>
  );
}

const TAG_TEXT: Record<Etiqueta, string> = { oficial: "Oficial", no_oficial: "No oficial", sin_fuente: "Sin fuente" };

export function Tag({ value }: { value: Etiqueta | null | undefined }) {
  const v: Etiqueta = value || "sin_fuente";
  return <span className={`${styles.tag} ${styles[`tag_${v}`]}`}>{TAG_TEXT[v]}</span>;
}
