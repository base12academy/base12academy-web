import type { Metadata } from "next";
import { TropaLanding } from "@/components/TropaCommercialPage";

export const metadata: Metadata = { title: "Tropa y Marinería | Base12 Academy", description: "Paquetes comerciales de preparación de Tropa y Marinería." };
export default function Page() { return <TropaLanding />; }
