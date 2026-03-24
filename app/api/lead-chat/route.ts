import OpenAI from "openai";

type CursoInfo = {
  nombre: string;
  precio: string;
  descripcion: string;
  incluye: string[];
};

const cursos: CursoInfo[] = [
  {
    nombre: "Historia de España",
    precio: "29 €",
    descripcion:
      "Curso orientado a oposiciones, PAU y preparación académica con temario, tutor y test.",
    incluye: [
      "Temario organizado por temas",
      "Tutor de apoyo",
      "Test de repaso",
      "Acceso online",
    ],
  },
  {
    nombre: "Historia de la Filosofía",
    precio: "29 €",
    descripcion:
      "Curso de apoyo para Filosofía con temario estructurado, explicaciones y autoevaluación.",
    incluye: [
      "Temario completo",
      "Tutor de apoyo",
      "Material de estudio",
      "Acceso online",
    ],
  },
  {
    nombre: "Protocolo Social y Empresarial",
    precio: "39 €",
    descripcion:
      "Formación práctica para desenvolverse con seguridad en contextos sociales y profesionales.",
    incluye: [
      "Contenidos prácticos",
      "Material de apoyo",
      "Acceso online",
    ],
  },
  {
    nombre: "Protocolo Institucional",
    precio: "39 €",
    descripcion:
      "Curso centrado en normas, organización y ceremonial en entornos institucionales.",
    incluye: [
      "Temario profesional",
      "Material de consulta",
      "Acceso online",
    ],
  },
  {
    nombre: "Gestión Eficaz del Tiempo para Profesionales",
    precio: "35 €",
    descripcion:
      "Curso práctico para mejorar productividad, planificación y organización personal.",
    incluye: [
      "Métodos de planificación",
      "Ejercicios prácticos",
      "Acceso online",
    ],
  },
];

function respuestaLocal(mensaje: string) {
  const texto = mensaje.toLowerCase();

  if (
    texto.includes("precio") ||
    texto.includes("cuánto cuesta") ||
    texto.includes("cuanto cuesta")
  ) {
    return `Estos son algunos precios actuales de referencia:
- Historia de España: 29 €
- Historia de la Filosofía: 29 €
- Protocolo Social y Empresarial: 39 €
- Protocolo Institucional: 39 €
- Gestión Eficaz del Tiempo para Profesionales: 35 €

Si quieres, puedo recomendarte cuál encaja mejor contigo.`;
  }

  if (
    texto.includes("curso") ||
    texto.includes("cursos") ||
    texto.includes("qué tenéis") ||
    texto.includes("que tenéis")
  ) {
    return `Actualmente trabajamos con estos cursos:
- Historia de España
- Historia de la Filosofía
- Protocolo Social y Empresarial
- Protocolo Institucional
- Gestión Eficaz del Tiempo para Profesionales

Dime cuál te interesa y te explico contenido, enfoque y precio.`;
  }

  if (
    texto.includes("vídeo") ||
    texto.includes("video") ||
    texto.includes("test") ||
    texto.includes("incluye")
  ) {
    return `Los cursos están planteados para ofrecer una experiencia práctica de estudio. Según el curso, pueden incluir:
- temario estructurado
- material de apoyo
- test de repaso
- tutor de ayuda
- acceso online
- vídeos cuando estén incorporados en la versión final del curso

Si me dices un curso concreto, te detallo lo que incluye.`;
  }

  if (
    texto.includes("matrícula") ||
    texto.includes("matricula") ||
    texto.includes("inscrib") ||
    texto.includes("comprar") ||
    texto.includes("pagar")
  ) {
    return `La matrícula se hará directamente desde la plataforma cuando el sistema de pago esté activo. El proceso será sencillo:
1. eliges el curso
2. ves el precio
3. completas el pago
4. accedes al contenido

Si quieres, puedo orientarte primero sobre qué curso elegir.`;
  }

  if (
    texto.includes("historia de españa") ||
    texto.includes("historia de españa")
  ) {
    return `El curso de Historia de España está pensado para estudio estructurado por temas, con apoyo para repaso y preparación académica. Precio orientativo actual: 29 €.`;
  }

  if (
    texto.includes("filosof") ||
    texto.includes("historia de la filosofía")
  ) {
    return `El curso de Historia de la Filosofía está orientado a estudio guiado por bloques temáticos, con apoyo al repaso y comprensión de autores y corrientes. Precio orientativo actual: 29 €.`;
  }

  return `Puedo ayudarte con:
- cursos disponibles
- precios
- qué incluye cada curso
- matrícula
- acceso
- vídeos y test

Por ejemplo, puedes preguntarme:
“¿Qué cursos tenéis?”
“¿Cuánto cuesta Historia de España?”
“¿Los cursos incluyen vídeos?”
“¿Cómo me matriculo?”`;
}

export async function POST(req: Request) {
  try {
    const { mensaje } = await req.json();

    const contextoCursos = cursos
      .map(
        (curso) =>
          `Curso: ${curso.nombre}
Precio: ${curso.precio}
Descripción: ${curso.descripcion}
Incluye: ${curso.incluye.join(", ")}`
      )
      .join("\n\n");

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        respuesta: respuestaLocal(mensaje),
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

Tu trabajo es ayudar a personas interesadas en los cursos.
Debes responder en español, de forma clara, breve, amable y orientada a conversión.
No inventes información que no aparezca en el contexto.

Contexto de cursos:
${contextoCursos}

Si te preguntan por precios, indícalos con claridad.
Si te preguntan por matrícula o acceso, explica el proceso de forma sencilla.
Si no sabes algo con seguridad, dilo de manera honesta.
`,
          },
          {
            role: "user",
            content: mensaje,
          },
        ],
      });

      return Response.json({
        respuesta: response.output_text || respuestaLocal(mensaje),
      });
    } catch (error: any) {
      return Response.json({
        respuesta: respuestaLocal(mensaje),
      });
    }
  } catch (error) {
    return Response.json({
      respuesta:
        "Ahora mismo no puedo procesar la consulta. Puedes preguntarme por cursos, precios o matrícula.",
    });
  }
}