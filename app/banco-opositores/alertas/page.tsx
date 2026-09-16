import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import OppositionAlertsManager from "@/components/banco-opositores/OppositionAlertsManager";
import styles from "../banco.module.css";

export const metadata: Metadata = {
  title: "Mis alertas | Banco de Opositores",
  robots: { index: false, follow: false },
};

export default async function AlertsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <div className={`${styles.bancoPage} ${styles.alertsPage}`}><header className={styles.header}><div className={styles.headerInner}><Link href="/banco-opositores" className={styles.brand}><Image src="/images/banco-opositores/logo-banco-opositores.png" alt="B12 Banco de Opositores" width={56} height={56} priority /><span><b>Banco de Opositores</b><small>Gestión de alertas</small></span></Link><nav><Link href="/banco-opositores">Volver al banco</Link></nav></div></header><main className={styles.main}><OppositionAlertsManager token={token} /></main></div>;
}
