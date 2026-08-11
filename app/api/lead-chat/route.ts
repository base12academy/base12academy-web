import { NextResponse } from "next/server";

const normalize = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function has(text: string, ...terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function answer(message: string, community: string) {
  const text = normalize(message);

  if (has(text, "como funciona", "que es base12")) {
    return "Base12 Academy ofrece formación online estructurada por unidades. Puedes revisar la muestra gratuita, elegir una modalidad y avanzar con explicaciones, glosario, vídeos, prácticas y evaluación. Rocío enseña, Fernando acompaña el progreso, Jefatura organiza, Secretaría atiende la gestión económica y Comercial informa antes de contratar.";
  }
  if (has(text, "desist", "14 dias", "catorce dias", "acceso inmediato", "renuncia")) {
    return "Antes de activar el curso se informa del derecho legal de desistimiento. Si quieres comenzar antes de que terminen los 14 días, debes solicitar expresamente el acceso inmediato y reconocer que, una vez ejecutado completamente el contenido digital en los términos legales aplicables, puedes perder ese derecho. La aceptación se realiza mediante una casilla separada, voluntaria y no premarcada.";
  }
  if (has(text, "factura", "pago", "cobro", "recibo")) {
    return "Secretaría atiende pagos, facturas y cuestiones económicas. Antes de confirmar la matrícula verás el precio total, los impuestos aplicables, la modalidad, la duración y las condiciones. El pago online se habilitará cuando esté operativo el nuevo TPV; mientras tanto no se debe completar ningún cobro desde la plataforma.";
  }
  if (has(text, "humano", "director", "direccion academica", "reclam", "queja")) {
    return "La atención ordinaria la prestan los asistentes y el equipo responsable de cada área. Las dudas académicas que no puedan resolverse, o cuya revisión solicites expresamente, pueden escalarse por correo diferido a Dirección académica. También están disponibles los canales legales de quejas y reclamaciones indicados en la web.";
  }
  if (has(text, "rocio", "profesora", "duda academica")) {
    return "Rocío es la Profesora IA: explica los contenidos, utiliza el glosario oficial, propone ejemplos y preguntas de comprobación y orienta la recuperación. Durante retos y evidencias no realiza la tarea ni revela la solución al alumno.";
  }
  if (has(text, "fernando", "tutor", "seguimiento", "despist")) {
    return "Fernando es el Tutor IA: organiza el seguimiento, detecta interrupciones, recuerda los próximos pasos y ayuda a retomar el itinerario. No sustituye la evaluación ni responde las actividades por el alumno.";
  }
  if (has(text, "secretaria")) {
    return "Secretaría gestiona las cuestiones administrativas y económicas, especialmente pagos, matrículas, justificantes y facturas.";
  }
  if (has(text, "jefatura", "jefe de estudios", "organizacion")) {
    return "Jefatura de Estudios coordina la organización académica, el itinerario, las incidencias de acceso y la distribución de la atención.";
  }
  if (has(text, "comercial", "contratar", "matricul")) {
    return "El área Comercial informa antes de la contratación sobre cursos, modalidades, precios, duración y acceso. La matrícula queda vinculada al alumno, al correo utilizado y al curso elegido.";
  }
  if (has(text, "clave", "gratis", "gratuit", "familiar", "invitacion")) {
    return "Administración puede emitir una clave personal gratuita vinculada a un único correo y a un curso concreto. No es una clave común, no puede compartirse y solo activa la matrícula para la persona destinataria.";
  }
  if (has(text, "unidad abierta", "unidad 1", "probar", "muestra", "antes de pagar")) {
    return "Puedes consultar gratuitamente la primera unidad de Competencias y Productividad Digital, Ofimática e IA antes de matricularte, con su explicación, glosario, actividad y asistentes. El resto del curso requiere una matrícula o una clave personal válida.";
  }
  if (has(text, "progreso", "registro", "avance")) {
    return "La plataforma registra el progreso, los intentos y las evidencias necesarios para prestar el curso, emitir el certificado y acreditar cuándo comenzó el acceso al contenido. El tratamiento se realiza conforme a la política de privacidad.";
  }
  if (has(text, "certific")) {
    return "Los cursos online incluyen certificado Base12. Se emite a nombre del alumno cuando completa los requisitos de su modalidad, supera la evaluación o proyecto correspondiente y no mantiene pagos pendientes. El PDF incluye curso, modalidad, fecha y código único de verificación.";
  }
  if (has(text, "ofimatica", "competencias digitales", "productividad digital") && has(text, "precio", "cuesta", "modalidad", "paquete", "incluye", "duracion")) {
    return "Competencias y Productividad Digital, Ofimática e IA ofrece tres paquetes acumulativos: Competencias digitales, 49 € y 6 meses; Ofimática, 119 € y 9 meses; Productividad Digital e IA, 239 € y 12 meses. Ofimática incluye Competencias digitales y Productividad Digital e IA incluye Ofimática.";
  }
  if (has(text, "precio", "cuesta", "descuento")) {
    return "En Bachillerato los paquetes publicados son 249 € Esencial, 299 € Estándar y 399 € Premium; PAU, 199 €. Los descuentos por varias asignaturas son 10 % con 2, 15 % con 3 y 20 % desde 4. En oposiciones, las modalidades publicadas son 149 €, 299 € y 499 €. Consulta siempre la ficha antes de matricularte.";
  }
  if (has(text, "opos")) {
    const location = community ? ` Para ${community}, utiliza el filtro territorial del catálogo.` : "";
    return `Base12 prepara oposiciones de Andalucía, Madrid, Comunidad Valenciana y Administración del Estado, con modalidades Esencial, Estándar y Premium.${location}`;
  }
  if (has(text, "modalidad", "incluye")) {
    return "Esencial proporciona la base estructurada; Estándar añade práctica, diagnóstico y proyecto; Premium incorpora revisión y acompañamiento reforzado. Las modalidades son acumulativas, pero prevalece siempre el detalle de la ficha del curso elegido.";
  }
  if (has(text, "pau", "bachiller", "historia", "matem", "lengua")) {
    return "En Bachillerato y PAU se ofrecen Historia de España, Historia de la Filosofía, Matemáticas II, Matemáticas Aplicadas a las CCSS y Lengua Castellana y Literatura. Es posible combinar asignaturas con descuento automático.";
  }
  if (has(text, "curso online", "ofimatica", "protocolo", "tiempo")) {
    return "Los cursos online publicados son Competencias y Productividad Digital, Ofimática e IA; Protocolo Institucional; Protocolo Social y Empresarial; y Gestión Eficaz del Tiempo. Disponen de varios paquetes y certificado cuando se superan los requisitos correspondientes.";
  }
  if (has(text, "privacidad", "datos", "conversacion")) {
    return "Se tratan únicamente los datos necesarios para gestionar la matrícula, prestar el servicio, registrar el progreso, atender incidencias y emitir certificados. Las conversaciones con asistentes pueden utilizarse para mantener la continuidad y prestar ayuda, según la política de privacidad.";
  }
  return "Puedo orientarte sobre cursos, precios, modalidades, duración, acceso gratuito, certificados, contratación, desistimiento, pagos y funciones del equipo Base12. Dime qué necesitas y te dirigiré al área adecuada.";
}

export async function POST(request: Request) {
  const body = (await request.json()) as { mensaje?: string; comunidad?: string };
  return NextResponse.json({ respuesta: answer(body.mensaje || "", body.comunidad || "") });
}
