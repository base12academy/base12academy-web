import { NextResponse } from "next/server";

function answer(message: string, community: string) {
  const text = message.toLowerCase();

  if (text.includes("certific")) {
    return "Los cursos online incluyen certificado Base12. Se emite a nombre del alumno cuando ha superado los requisitos académicos y no tiene pagos pendientes. Recibirá el PDF automáticamente por correo con fecha, modalidad y código de verificación.";
  }
  if (text.includes("precio") || text.includes("cuesta") || text.includes("descuento")) {
    return "En Bachillerato y PAU los precios son 249 € Esencial, 299 € Estándar, 399 € Premium y 199 € PAU. Hay un 10% de descuento con 2 asignaturas, 15% con 3 y 20% desde 4. En oposiciones: 149 €, 299 € y 499 €. Puedes ver el detalle de cada curso en Oferta formativa.";
  }
  if (text.includes("opos")) {
    const location = community ? ` Para la comunidad seleccionada (${community}) puedes usar el filtro del catálogo.` : "";
    return `Base12 prepara oposiciones de Andalucía, Madrid, Comunidad Valenciana y Administración del Estado, con modalidades Esencial, Estándar y Premium.${location}`;
  }
  if (text.includes("modalidad") || text.includes("incluye")) {
    return "Esencial ofrece la base estructurada para avanzar a tu ritmo; Estándar añade más práctica, diagnóstico y proyecto; Premium incorpora revisión y acompañamiento reforzado. Cada ficha muestra el contenido y precio exactos antes de matricularte.";
  }
  if (text.includes("pau") || text.includes("bachiller") || text.includes("historia") || text.includes("matem")) {
    return "En Bachillerato y PAU tienes Historia de España, Historia de la Filosofía, Matemáticas II, Matemáticas Aplicadas a las CCSS y Lengua y Literatura. Puedes combinar asignaturas con descuento automático.";
  }
  if (text.includes("curso online") || text.includes("ofimática") || text.includes("protocolo") || text.includes("tiempo")) {
    return "Los cursos online disponibles son Ofimática, Protocolo Institucional, Protocolo Social y Empresarial y Gestión Eficaz del Tiempo. Todos cuentan con tres modalidades y certificado al superar los requisitos.";
  }
  return "Base12 Academy reúne Bachillerato y PAU, cursos online y oposiciones. Dime qué objetivo tienes o pregúntame por precios, modalidades, certificados o tu comunidad y te orientaré.";
}

export async function POST(request: Request) {
  const body = (await request.json()) as { mensaje?: string; comunidad?: string };
  return NextResponse.json({
    respuesta: answer(body.mensaje || "", body.comunidad || ""),
  });
}
