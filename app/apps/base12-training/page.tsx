import type { Metadata } from "next";
import TrainingApp from "@/components/training/TrainingApp";

export const metadata: Metadata = {
  title: "Base12 Training | Base12 Academy",
  description: "Entrena las cuatro pruebas físicas de Tropa y Marinería, registra tus marcas y progresa con Carlos IA.",
  applicationName: "Base12 Training",
};

export default function Base12TrainingAppPage() {
  return <TrainingApp />;
}
