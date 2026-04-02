import OpenAI from "openai";

type CursoInfo = {
  nombre: string;
  precio: string;
  descripcion: string;
  incluye: string[];
  enlace?: string;
  estado?: string;
};

const cursos: CursoInfo[] = [
  {
    nombre: "Historia de España",
    precio: "29 € pago único",
    descripcion:
      "Preparación completa para la PAU con temario por temas, apoyo al estudio, test, preguntas cortas, imágenes y textos históricos.",
    incluye: [
      "Temario estructurado por temas",
      "Índices de estudio",
      "Test por tema",
      "Preguntas cortas",
      "Imágenes y textos históricos por bloques",
      "Preparación orientada a PAU",
      "Acceso online",
      "Estrategia adaptada a la comunidad autónoma",
    ],
    enlace: "/comprar",
    estado: "activo",
  },
  {
    nombre: "Historia de la Filosofía",
    precio: "En actualización",
    descripcion:
      "Curso estructurado por temas para repaso, comprensión de autores y preparación de examen.",
    incluye: [
      "Temario estructurado",
      "Material de estudio",
      "Acceso online",
      "Adaptación progresiva por comunidad",
    ],
    enlace: "/dashboard/filosofia",
    estado: "en actualización",
  },
];

const comunidadesCubiertas = [
  "Andalucía",
  "Madrid",
  "Comunidad Valenciana",
  "Castilla y León",
  "Galicia",
  "Aragón",
  "Navarra",
  "La Rioja",
  "Cantabria",
  "Murcia",
  "Extremadura",
  "Modelo Ministerio / Exterior",
];

const comunidadesExcluidas = ["País Vasco", "Cataluña"];

function contiene(texto: string, lista: string[]) {
  return lista.some((item) => texto.includes(item));
}

function nombreComunidadBonito(comunidad: string) {
  const mapa: Record<string, string> = {
    andalucia: "Andalucía",
    madrid: "Madrid",
    valencia: "Comunidad Valenciana",
    castilla_leon: "Castilla y León",
    galicia: "Galicia",
    aragon: "Aragón",
    navarra: "Navarra",
    rioja: "La Rioja",
    cantabria: "Cantabria",
    murcia: "Murcia",
    extremadura: "Extremadura",
    ministerio: "Modelo Ministerio / Exterior",
  };

  return mapa[comunidad] || comunidad;
}

function respuestaPorComunidad(comunidad: string) {
  switch (comunidad) {
    case "andalucia":
      return `Si te examinas en Andalucía, lo más importante es la redacción. El examen se apoya mucho en temas de desarrollo y comentario de fuente. Debes dominar sobre todo los siglos XIX y XX y saber explicar bien procesos como el Sexenio Democrático o la Dictadura de Primo de Rivera.`;
    case "madrid":
      return `Si te examinas en Madrid, la clave es la precisión. El examen se apoya mucho en epígrafes concretos y vocabulario histórico técnico. Tienes que saber responder con exactitud, sin irte por las ramas.`;
    case "valencia":
      return `En la Comunidad Valenciana pesa mucho el análisis de fuentes. Es muy importante saber interpretar imágenes, caricaturas, mapas o textos y relacionarlos con su contexto histórico.`;
    case "castilla_leon":
      return `En Castilla y León suele funcionar muy bien una respuesta muy ordenada: causas, desarrollo y consecuencias. También conviene cuidar los temas cerrados y la estructura clásica de desarrollo.`;
    case "galicia":
      return `En Galicia conviene reforzar la historia contemporánea e incorporar bien el Rexurdimento y la emigración gallega cuando corresponda. Hay que conectar historia nacional e historia gallega.`;
    case "aragon":
      return `En Aragón es importante entender bien los Fueros y el impacto de los Decretos de Nueva Planta. Además, el análisis de fuentes suele tener bastante peso técnico.`;
    case "navarra":
      return `En Navarra es fundamental dominar el Carlismo y la evolución de los Fueros. Es una comunidad donde esas particularidades históricas importan mucho.`;
    case "rioja":
      return `En La Rioja conviene reforzar especialmente la reforma agraria y los movimientos sociales de la época contemporánea.`;
    case "cantabria":
      return `En Cantabria suele tener bastante importancia la Segunda República y la Guerra Civil dentro del enfoque contemporáneo.`;
    case "murcia":
      return `En Murcia conviene reforzar la Restauración y el impacto de la minería y la agricultura en el siglo XIX.`;
    case "extremadura":
      return `En Extremadura es importante dominar la reforma agraria en la Segunda República y el impacto del Plan Badajoz durante el franquismo.`;
    case "ministerio":
      return `En el modelo Ministerio / Exterior conviene dominar especialmente los bloques 5 al 12, desde 1808 hasta hoy. El peso fuerte suele recaer en comentario de texto y tema contemporáneo.`;
    default:
      return "";
  }
}

function respuestaLocal(mensaje: string, comunidad?: string) {
  const texto = mensaje.toLowerCase();
  const comunidadBonita = comunidad ? nombreComunidadBonito(comunidad) : "";
  const detalleComunidad = comunidad ? respuestaPorComunidad(comunidad) : "";

  if (
    contiene(texto, [
      "país vasco",
      "pais vasco",
      "euskadi",
      "cataluña",
      "cataluna",
      "¿está mi comunidad?",
      "esta mi comunidad",
      "qué comunidades",
      "que comunidades",
      "comunidades cubrís",
      "comunidades cubris",
    ])
  ) {
    return `Ahora mismo la preparación específica por comunidad está disponible para:

• ${comunidadesCubiertas.join("\n• ")}

Por ahora quedan fuera:
• ${comunidadesExcluidas.join("\n• ")}

Si me dices tu comunidad, te digo si te encaja y qué conviene priorizar.`;
  }

  if (
    contiene(texto, [
      "mi comunidad",
      "según mi comunidad",
      "segun mi comunidad",
      "cómo cambia",
      "como cambia",
      "estrategia",
      "cómo me examinan",
      "como me examinan",
    ])
  ) {
    if (!comunidad) {
      return `Sí, adaptamos la estrategia según comunidad autónoma. Dime tu comunidad y te explico qué conviene priorizar y cómo suele enfocarse el examen.`;
    }

    return `Tu comunidad seleccionada es ${comunidadBonita}.

${detalleComunidad}

Si quieres, puedes entrar ya en /comprar y activar el acceso para empezar hoy mismo.`;
  }

  if (
    contiene(texto, [
      "temario oficial",
      "oficial",
      "mi instituto da otro temario",
      "mi profesor da otro orden",
      "otro orden",
      "temas repetidos",
      "temas parecidos",
      "por qué se parecen",
      "por que se parecen",
    ])
  ) {
    return `Base12 sigue una lógica práctica y orientada a examen:

• Tomamos como referencia el enfoque oficial de la comunidad cuando es claro
• Mantenemos una estructura propia para que el alumno estudie con orden
• Si un instituto usa otro orden, sigue siendo útil como refuerzo
• Algunas partes pueden parecerse porque muchos exámenes reorganizan procesos históricos similares

Si tu objetivo es empezar ya, la ruta directa es:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "cómo funciona",
      "como funciona",
      "funciona el curso",
      "cómo se estudia",
      "como se estudia",
    ])
  ) {
    return `El curso de Historia de España funciona así:

1. Estudias el tema y su índice
2. Repasas el contenido explicado
3. Haces el test del tema
4. Trabajas preguntas cortas
5. Avanzas con orden

Además, la academia adapta la estrategia según tu comunidad autónoma. ${
      detalleComunidad ? `En tu caso: ${detalleComunidad}` : ""
    }

Si quieres empezar ya:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "qué incluye",
      "que incluye",
      "incluye",
      "qué trae",
      "que trae",
    ])
  ) {
    return `El curso de Historia de España incluye:

• Temario estructurado por temas
• Índices de estudio
• Test por tema
• Preguntas cortas
• Imágenes y textos históricos
• Preparación orientada a PAU
• Estrategia según comunidad autónoma
• Acceso online

Acceso actual:
👉 29 € pago único

Compra directa:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "precio",
      "precios",
      "cuánto cuesta",
      "cuanto cuesta",
      "vale",
      "coste",
      "mensual",
      "pago único",
      "pago unico",
    ])
  ) {
    return `Ahora mismo el acceso de Historia de España es:

👉 29 € pago único

Incluye acceso al contenido de preparación ya disponible.

Si quieres entrar directamente:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "acceso",
      "cómo accedo",
      "como accedo",
      "matrícula",
      "matricula",
      "comprar",
      "pagar",
      "empezar",
      "quiero empezar",
    ])
  ) {
    return `Para entrar en Historia de España:

1. Vas a /comprar
2. Realizas el pago
3. El acceso queda activado
4. Entras con tu usuario y empiezas a estudiar

Ruta directa:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "código",
      "codigo",
      "cupón",
      "cupon",
      "sin pagar",
    ])
  ) {
    return `Si la academia te ha facilitado un código, debes usar la vía de activación indicada por la academia.

Si lo que quieres es acceso directo ahora mismo:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "vídeos",
      "videos",
      "test",
      "pruebas",
      "preguntas cortas",
    ])
  ) {
    return `En Historia de España el enfoque incluye:

• Temario por temas
• Test por tema
• Preguntas cortas
• Imágenes y textos históricos
• Material de repaso
• Estrategia adaptada a comunidad

Si quieres acceder ya:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "historia de españa",
      "historia españa",
      "curso de historia",
    ])
  ) {
    return `Historia de España es ahora mismo el curso más completo y más operativo de la academia.

Incluye contenido estructurado, test, preguntas cortas, imágenes, textos históricos y una estrategia adaptada a la comunidad autónoma del alumno.

Precio actual:
👉 29 € pago único

Acceso:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "filosofía",
      "filosofia",
      "historia de la filosofía",
      "historia de la filosofia",
    ])
  ) {
    return `Historia de la Filosofía está en actualización. Ahora mismo, si buscas una opción ya operativa para preparar la PAU, la referencia principal es Historia de España.

Acceso disponible:
👉 /comprar`;
  }

  if (
    contiene(texto, [
      "qué cursos tenéis",
      "que cursos teneis",
      "cursos",
      "qué tenéis",
      "que teneis",
      "oferta",
    ])
  ) {
    return `Ahora mismo las dos líneas principales para PAU son:

• Historia de España
• Historia de la Filosofía

Si buscas una opción ya avanzada y lista para usar, ahora mismo la referencia principal es Historia de España.

Acceso:
👉 /comprar`;
  }

  return `Puedo ayudarte con:

• precio
• acceso
• qué incluye
• comunidades cubiertas
• estrategia según tu comunidad

Pregúntame por ejemplo:
“¿Cuánto cuesta?”
“¿Qué incluye?”
“¿Está mi comunidad?”
“Quiero empezar ahora”`;
}

export async function POST(req: Request) {
  try {
    const { mensaje, comunidad } = await req.json();

    const contextoComunidad = comunidad
      ? `El usuario pertenece a la comunidad autónoma de ${nombreComunidadBonito(comunidad)}.
Debes adaptar la respuesta a su tipo de examen, estrategia y prioridades.
${respuestaPorComunidad(comunidad)}`
      : "";

    const contextoCursos = cursos
      .map(
        (curso) =>
          `Curso: ${curso.nombre}
Precio: ${curso.precio}
Descripción: ${curso.descripcion}
Incluye: ${curso.incluye.join(", ")}
Estado: ${curso.estado ?? "activo"}
Enlace: ${curso.enlace ?? "sin enlace directo"}`
      )
      .join("\n\n");

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        respuesta: respuestaLocal(mensaje, comunidad),
      });
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `
Eres el asistente comercial de Base12 Academy.

Tu trabajo es ayudar a potenciales alumnos y a sus familias a entender la oferta y a dar el siguiente paso.
Responde SIEMPRE en español.
Tu tono debe ser cercano, claro, breve y orientado a conversión.
No inventes información.
No prometas funciones no confirmadas.
No hables de suscripciones mensuales si no están activas.
Da prioridad comercial al curso de Historia de España, porque es el más operativo ahora mismo.
Cuando tenga sentido, guía al usuario a esta ruta:
 /comprar

Información académica importante:
- Base12 adapta la estrategia de estudio según comunidad autónoma.
- No cubre por ahora País Vasco ni Cataluña.
- Sí cubre: Andalucía, Madrid, Comunidad Valenciana, Castilla y León, Galicia, Aragón, Navarra, La Rioja, Cantabria, Murcia, Extremadura y Modelo Ministerio / Exterior.
- Si el instituto sigue otro orden, Base12 puede seguir siendo útil como refuerzo orientado a examen.
- La academia intenta ser rigurosa con el enfoque oficial de cada comunidad, pero también flexible para reforzar carencias.
- El acceso actualmente disponible y operativo de Historia de España es de 29 € pago único.
- La compra se realiza en /comprar.

${contextoComunidad}

Contexto real de cursos:
${contextoCursos}

Normas:
- Si preguntan por precio, responde de forma directa y menciona 29 € pago único.
- Si preguntan por acceso, manda a /comprar.
- Si preguntan por qué incluye, enumera beneficios reales.
- Si preguntan por comunidad, responde de forma concreta y útil.
- Si preguntan por comunidades excluidas, dilo con naturalidad y honestidad.
- Si preguntan algo no cubierto por el contexto, responde con honestidad.
- Evita respuestas largas o abstractas.
- Siempre que encaje, termina con una invitación simple a entrar en /comprar.
- No uses tono agresivo.
- No uses emojis salvo una flecha puntual si ayuda.
`,
          },
          {
            role: "user",
            content: mensaje,
          },
        ],
      });

      return Response.json({
        respuesta: response.output_text || respuestaLocal(mensaje, comunidad),
      });
    } catch (error) {
      return Response.json({
        respuesta: respuestaLocal(mensaje, comunidad),
      });
    }
  } catch (error) {
    return Response.json({
      respuesta:
        "Ahora mismo no puedo procesar la consulta. Puedes preguntarme por precio, acceso, comunidades o contenidos.",
    });
  }
}