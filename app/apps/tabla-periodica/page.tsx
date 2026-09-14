import type { Metadata } from "next";
import PeriodicTableApp from "./PeriodicTableApp";

export const metadata: Metadata = {
  title: "Tabla Periódica Interactiva | Base12 Academy",
  description: "Explora los 118 elementos, compara propiedades periódicas y resuelve dudas con Clara.",
};

export default function PeriodicTablePage() {
  return <PeriodicTableApp />;
}
