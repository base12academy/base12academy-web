import type { Metadata } from "next";
import { TropaLanding } from "@/components/TropaCommercialPage";

export const metadata: Metadata = {
  title: "Preparación online de Tropa y Marinería",
  description:
    "Prepara Tropa y Marinería con test, simulacros y preparación física mediante Base12 Training. Consulta las modalidades de Base12 Academy.",
};
export default function Page() { return <TropaLanding />; }
