import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TropaPlanPage } from "@/components/TropaCommercialPage";
import { getTropaPlan, tropaPlans } from "@/lib/tropa-commercial";

export function generateStaticParams() { return tropaPlans.map(plan => ({ plan: plan.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ plan: string }> }): Promise<Metadata> {
  const { plan: slug } = await params;
  const plan = getTropaPlan(slug);
  if (!plan) return {};
  const title = plan.kind === "training" ? "Base12 Training · Preparación física Tropa y Marinería" : `${plan.name} · Tropa y Marinería`;
  const description = plan.description;
  const canonical = `/tropa-y-marineria/${plan.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: plan.kind === "training" ? [{ url: "/images/banco-opositores/logo-base12-training.png", alt: "Base12 Training" }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ plan: string }> }) { const { plan: slug } = await params; const plan = getTropaPlan(slug); if (!plan) notFound(); return <TropaPlanPage plan={plan} />; }
