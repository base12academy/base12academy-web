import { notFound } from "next/navigation";
import { TropaPlanPage } from "@/components/TropaCommercialPage";
import { getTropaPlan, tropaPlans } from "@/lib/tropa-commercial";

export function generateStaticParams() { return tropaPlans.map(plan => ({ plan: plan.slug })); }
export default async function Page({ params }: { params: Promise<{ plan: string }> }) { const { plan: slug } = await params; const plan = getTropaPlan(slug); if (!plan) notFound(); return <TropaPlanPage plan={plan} />; }
