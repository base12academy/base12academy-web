import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import OppositionExplorer from "@/components/banco-opositores/OppositionExplorer";
import { getTerritoryOppositionCalls, territoryPages } from "@/lib/oppositions";
import styles from "../banco.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ territory: string }> };

function territoryConfig(slug: string) {
  return territoryPages.find((territory) => territory.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { territory } = await params;
  const config = territoryConfig(territory);
  if (!config) return {};
  return {
    title: `Oposiciones en ${config.label} | Banco de Opositores`,
    description: `Convocatorias oficiales de oposiciones y empleo público en ${config.label}, con fuentes oficiales, seguimiento y alertas gratuitas.`,
    alternates: { canonical: `/banco-opositores/${config.slug}` },
  };
}

export default async function TerritoryPage({ params }: Props) {
  const { territory } = await params;
  const config = territoryConfig(territory);
  if (!config) notFound();
  const calls = await getTerritoryOppositionCalls(config.values);

  return (
    <div className={styles.bancoPage}>
      <header className={styles.header}><div className={styles.headerInner}><Link href="/banco-opositores" className={styles.brand}><Image src="/images/banco-opositores/logo-banco-opositores.png" alt="B12 Banco de Opositores" width={56} height={56} priority /><span><b>Banco de Opositores</b><small>Convocatorias oficiales en {config.label}</small></span></Link><nav><Link href="/banco-opositores">Toda España</Link><Link href="/banco-opositores/alertas">♧ Alertas</Link></nav></div></header>
      <main className={styles.main}>
        <nav className={styles.breadcrumbs}><Link href="/banco-opositores">Banco de Opositores</Link><span>›</span><span>{config.label}</span></nav>
        <OppositionExplorer initialCalls={calls} initialTerritory={config.values[0]} />
      </main>
    </div>
  );
}
