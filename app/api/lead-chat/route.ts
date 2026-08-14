import { NextResponse } from "next/server";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function has(text: string, ...terms: string[]) {
  return terms.some((term) => text.includes(normalize(term)));
}

function answer(message: string, community: string) {
  const text = normalize(message);

  const asksInclude = has(
    text,
    "que incluye",
    "incluye",
    "contenido",
    "que tiene"
  );

  const asksPriceOrDuration = has(
    text,
    "precio",
    "cuesta",
    "cuanto cuesta",
    "duracion",
    "dura",
    "meses"
  );

  const asksCompare = has(
    text,
    "diferencia",
    "diferencias",
    "comparar",
    "comparacion"
  );

  const asksRecommendation = has(
    text,
    "cual me conviene",
    "cual elegir",
    "que me conviene",
    "que elegir",
    "recomienda",
    "recomiendas"
  );

  /*
   * CURSO: COMPETENCIAS, PRODUCTIVIDAD, OFIMÁTICA E IA
   * Estas respuestas se evalúan antes que las respuestas
   * genéricas de modalidades para evitar confusiones.
   */

  if (
    has(text, "competencias digitales") &&
    asksInclude &&
    !asksCompare
  ) {
    return (
      "Competencias Digitales es el acceso inicial de Competencias, Productividad, Ofimática e IA. " +
      "Cuesta 49 € y permite acceder durante 6 meses. " +
      "Trabaja el entorno digital y las herramientas de uso habitual: Word, Excel, PowerPoint, Outlook, archivos, Internet, nube y PDF, junto con prácticas, retos y comprobaciones de competencia. " +
      "Incluye el acompañamiento virtual de Rocío, Profesora IA, y Fernando, Tutor IA, y permite obtener el certificado Base12 de Competencias Digitales cuando se completa el itinerario y se demuestran las competencias exigidas."
    );
  }

  if (
    has(text, "productividad digital", "productividad e ia") &&
    asksInclude &&
    !asksCompare
  ) {
    return (
      "Productividad Digital e IA es el acceso más amplio de Competencias, Productividad, Ofimática e IA. " +
      "Cuesta 239 € y permite acceder durante 12 meses. " +
      "Incluye todo lo de Ofimática y, por tanto, también Competencias Digitales. " +
      "Añade publicación y distribución de Power BI, flujos, aprobaciones y control operativo, automatización avanzada e inteligencia artificial integrada en procesos profesionales. " +
      "Al completar el itinerario y demostrar las competencias exigidas permite obtener el certificado Base12 de Productividad Digital e IA."
    );
  }

  if (
    has(text, "ofimatica") &&
    asksInclude &&
    !asksCompare &&
    !has(text, "productividad digital", "productividad e ia")
  ) {
    return (
      "Ofimática es el acceso intermedio de Competencias, Productividad, Ofimática e IA. " +
      "Cuesta 119 € y permite acceder durante 9 meses. " +
      "Incluye todo lo de Competencias Digitales y amplía el recorrido con documentos y datos avanzados, formularios, Access, Power Query, Power BI funcional, colaboración estructurada, multimedia y automatizaciones sencillas. " +
      "Al completar el itinerario y demostrar las competencias exigidas permite obtener el certificado Base12 de Ofimática."
    );
  }

  if (
    asksCompare &&
    has(
      text,
      "competencias digitales",
      "ofimatica",
      "productividad digital",
      "productividad e ia"
    )
  ) {
    return (
      "Los tres accesos son acumulativos. " +
      "Competencias Digitales cuesta 49 € y dura 6 meses: construye la base de uso digital y ofimático habitual. " +
      "Ofimática cuesta 119 € y dura 9 meses: incluye Competencias Digitales y añade herramientas y procedimientos profesionales más avanzados. " +
      "Productividad Digital e IA cuesta 239 € y dura 12 meses: incluye Ofimática y Competencias Digitales y amplía el recorrido con automatización avanzada, Power BI, flujos, aprobaciones e inteligencia artificial aplicada a procesos profesionales."
    );
  }

  if (
    asksPriceOrDuration &&
    has(
      text,
      "competencias",
      "ofimatica",
      "productividad",
      "ia"
    )
  ) {
    return (
      "En Competencias, Productividad, Ofimática e IA hay tres accesos acumulativos: " +
      "Competencias Digitales, 49 € y 6 meses; " +
      "Ofimática, 119 € y 9 meses; " +
      "Productividad Digital e IA, 239 € y 12 meses. " +
      "Ofimática incluye Competencias Digitales y Productividad Digital e IA incluye también los dos accesos anteriores."
    );
  }

  if (
    asksRecommendation &&
    has(
      text,
      "competencias",
      "ofimatica",
      "productividad",
      "ia"
    )
  ) {
    return (
      "Depende de tu objetivo. " +
      "Elige Competencias Digitales si necesitas una base sólida para trabajar con seguridad con las herramientas digitales y ofimáticas habituales. " +
      "Elige Ofimática si además necesitas documentos, datos, colaboración y herramientas profesionales más avanzadas. " +
      "Elige Productividad Digital e IA si quieres el recorrido completo, incluyendo automatización avanzada, Power BI, flujos de trabajo e inteligencia artificial aplicada. " +
      "Como los accesos son acumulativos, no pierdes los contenidos de los niveles anteriores."
    );
  }

  if (
    has(
      text,
      "probar",
      "gratis",
      "gratuit",
      "antes de pagar",
      "antes de suscrib"
    ) &&
    has(
      text,
      "competencias",
      "ofimatica",
      "productividad",
      "ia",
      "curso"
    )
  ) {
    return (
      "Sí. Antes de suscribirte a Competencias, Productividad, Ofimática e IA puedes acceder gratuitamente al primer tema y al primer ejercicio. " +
      "Así puedes comprobar cómo se explica el contenido y cómo se trabaja en la plataforma antes de elegir uno de los tres accesos."
    );
  }

  /*
   * RESPUESTAS GENERALES DE BASE12
   */

  if (has(text, "como funciona", "que es base12")) {
    return (
      "Base12 Academy ofrece formación online estructurada por contenidos y competencias. " +
      "Puedes revisar los contenidos abiertos disponibles, elegir el acceso que corresponda a tu objetivo y avanzar con vídeos, explicaciones, prácticas, retos y comprobaciones. " +
      "Rocío enseña, Fernando acompaña el progreso, Jefatura organiza, Secretaría atiende la gestión económica y Comercial informa antes de contratar."
    );
  }

  if (
    has(
      text,
      "desist",
      "14 dias",
      "catorce dias",
      "acceso inmediato",
      "renuncia"
    )
  ) {
    return (
      "Antes de contratar se informa del derecho legal de desistimiento. " +
      "Si solicitas que el acceso comience antes de que finalicen los 14 días, debes pedir expresamente el inicio inmediato y aceptar las consecuencias legales que correspondan. " +
      "Estas aceptaciones se recogen mediante casillas separadas, voluntarias y no premarcadas."
    );
  }

  if (has(text, "factura", "pago", "cobro", "recibo")) {
    return (
      "Secretaría atiende pagos, facturas y cuestiones económicas. " +
      "Antes de pagar verás el precio total, el acceso seleccionado, su duración y las condiciones aplicables. " +
      "El pago online se realiza mediante el TPV seguro de Redsys. Después del pago se crea y vincula tu acceso de alumno durante el proceso de alta."
    );
  }

  if (
    has(
      text,
      "humano",
      "director",
      "direccion academica",
      "reclam",
      "queja"
    )
  ) {
    return (
      "La atención ordinaria la prestan los asistentes y los servicios responsables de cada área. " +
      "Las cuestiones que no puedan resolverse por esos canales, o cuya revisión solicites expresamente, pueden escalarse por correo diferido a Dirección Académica. " +
      "También están disponibles los canales de quejas y reclamaciones indicados en la web."
    );
  }

  if (has(text, "rocio", "profesora", "duda academica")) {
    return (
      "Rocío es la Profesora IA: explica los contenidos, utiliza el glosario oficial, propone ejemplos y preguntas de comprobación y orienta la recuperación. " +
      "Durante retos y evidencias no realiza la tarea ni revela la solución al alumno."
    );
  }

  if (has(text, "fernando", "tutor", "seguimiento", "despist")) {
    return (
      "Fernando es el Tutor IA: ayuda a organizar la planificación, realiza seguimiento del progreso, detecta interrupciones, recuerda próximos pasos y acompaña la recuperación del itinerario. " +
      "No sustituye la evaluación ni responde las actividades por el alumno."
    );
  }

  if (has(text, "secretaria")) {
    return (
      "Secretaría gestiona las cuestiones administrativas y económicas, especialmente pagos, matrículas, justificantes y facturas."
    );
  }

  if (has(text, "jefatura", "jefe de estudios", "organizacion")) {
    return (
      "Jefatura de Estudios coordina la organización académica, el itinerario, las incidencias de acceso y la distribución de la atención."
    );
  }

  if (has(text, "comercial", "contratar", "matricul")) {
    return (
      "El área Comercial informa antes de la contratación sobre cursos, accesos, precios, duración y funcionamiento. " +
      "Después del pago, Base12 crea o vincula la cuenta del alumno durante el proceso de alta."
    );
  }

  if (has(text, "clave", "familiar", "invitacion")) {
    return (
      "Administración puede emitir una clave personal gratuita vinculada a un único correo y a un curso concreto. " +
      "No es una clave común, no puede compartirse y solo activa la matrícula para la persona destinataria."
    );
  }

  if (has(text, "progreso", "registro", "avance")) {
    return (
      "La plataforma registra el progreso, los intentos y las evidencias necesarios para prestar el curso y acreditar el avance. " +
      "El tratamiento se realiza conforme a la política de privacidad."
    );
  }

  if (has(text, "certific")) {
    return (
      "Los cursos online incluyen certificado Base12 cuando así se indica en el acceso contratado. " +
      "Se emite a nombre del alumno cuando completa el itinerario y demuestra las competencias o requisitos exigidos, sin pagos pendientes. " +
      "El certificado identifica el curso y el acceso alcanzado."
    );
  }

  if (has(text, "precio", "cuesta", "descuento")) {
    return (
      "Los precios dependen del curso y del acceso elegido. " +
      "En Competencias, Productividad, Ofimática e IA: Competencias Digitales cuesta 49 €, Ofimática 119 € y Productividad Digital e IA 239 €. " +
      "Para Bachillerato, PAU y oposiciones consulta siempre la ficha correspondiente porque tienen precios y modalidades propios."
    );
  }

  if (has(text, "opos")) {
    const location = community
      ? ` Para ${community}, utiliza el filtro territorial del catálogo.`
      : "";

    return (
      `Base12 prepara oposiciones de Andalucía, Madrid, Comunidad Valenciana y Administración del Estado.${location}`
    );
  }

  if (has(text, "pau", "bachiller", "historia", "matem", "lengua")) {
    return (
      "En Bachillerato y PAU se ofrecen Historia de España, Historia de la Filosofía, Matemáticas II, Matemáticas Aplicadas a las CCSS y Lengua Castellana y Literatura. " +
      "Es posible combinar asignaturas con descuento automático cuando así se indique en la oferta."
    );
  }

  if (
    has(
      text,
      "curso online",
      "protocolo",
      "tiempo",
      "competencias productividad ofimatica ia"
    )
  ) {
    return (
      "Entre los cursos online publicados están Competencias, Productividad, Ofimática e IA; Protocolo Institucional; Protocolo Social y Empresarial; y Gestión Eficaz del Tiempo. " +
      "Consulta cada ficha para ver los accesos disponibles, duración, precio y certificado."
    );
  }

  if (has(text, "privacidad", "datos", "conversacion")) {
    return (
      "Se tratan únicamente los datos necesarios para gestionar la matrícula, prestar el servicio, registrar el progreso, atender incidencias y emitir certificados. " +
      "Las conversaciones con asistentes pueden utilizarse para mantener la continuidad y prestar ayuda, conforme a la política de privacidad."
    );
  }

  return (
    "Puedo orientarte sobre Competencias Digitales, Ofimática, Productividad Digital e IA, sus diferencias, precios y duración, además de otros cursos Base12, acceso gratuito, certificados, contratación, desistimiento y pagos. Dime qué necesitas."
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    mensaje?: string;
    comunidad?: string;
  };

  return NextResponse.json({
    respuesta: answer(
      body.mensaje || "",
      body.comunidad || ""
    ),
  });
}