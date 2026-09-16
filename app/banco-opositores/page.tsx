import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import OppositionExplorer from "@/components/banco-opositores/OppositionExplorer";
import { getLatestOppositionCalls } from "@/lib/oppositions";
import styles from "./banco.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banco de Opositores | Convocatorias oficiales de empleo público",
  description:
    "Busca convocatorias de oposiciones y empleo público de toda España, consulta su fuente oficial y crea alertas gratuitas por email o Telegram.",
  alternates: { canonical: "/banco-opositores" },
  openGraph: {
    title: "Banco de Opositores · Base12 Academy",
    description: "Convocatorias oficiales, seguimiento de cambios y alertas gratuitas.",
    url: "/banco-opositores",
    type: "website",
  },
};

export default async function BancoOpositoresPage() {
  const calls = await getLatestOppositionCalls();

  return (
    <div className={styles.bancoPage}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/banco-opositores" className={styles.brand}>
            <Image src="/images/banco-opositores/logo-banco-opositores.png" alt="B12 Banco de Opositores" width={56} height={56} priority />
            <span><b>Banco de Opositores</b><small>Convocatorias de oposiciones y empleo público</small></span>
          </Link>
          <nav aria-label="Banco de Opositores">
            <Link href="/">Base12 Academy</Link>
            <Link href="/banco-opositores/alertas">♧ Alertas</Link>
            <Link className={styles.headerButton} href="/banco-opositores#crear-alerta">Crear alerta gratuita</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <OppositionExplorer initialCalls={calls} />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/images/banco-opositores/logo-banco-opositores.png" alt="" width={48} height={48} />
          <span><b>Banco de Opositores</b><small>Un servicio de Base12 Academy</small></span>
        </div>
        <nav><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link><Link href="/">Base12 Academy</Link></nav>
        <p>La información debe verificarse siempre en la fuente oficial enlazada.</p>
      </footer>
    </div>
  );
}
