export function getPrecioCurso(fechaExamen: string | null | undefined) {
  if (!fechaExamen) {
    return {
      tipo: "mensual",
      texto: "17 € / mes",
      importe: 17,
    };
  }

  const hoy = new Date();
  const examen = new Date(fechaExamen);

  const diffMs = examen.getTime() - hoy.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  if (diffDias <= 61) {
    return {
      tipo: "fijo",
      texto: "29 €",
      importe: 29,
    };
  }

  return {
    tipo: "mensual",
    texto: "17 € / mes",
    importe: 17,
  };
}