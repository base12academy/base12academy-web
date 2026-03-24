import OpenAI from "openai";
import { temasHistoria } from "@/lib/temas";
export async function POST(req: Request) {
    try {
    const { mensaje, ruta, tema } = await req.json();
    const temaData = temasHistoria.find((t) => t.slug === tema);
    const tituloTema = temaData?.titulo || "Tema no identificado";
    const contenidoTema = temaData?.contenido || "";
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        });
        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: `
                    Eres Tutor Base12.

                    El alumno está viendo la página ${ruta}.
                    El tema actual es: ${tituloTema}.

                    Usa este contenido como contexto principal:
                    ${contenidoTema}

                    Explica Historia de España de forma clara y didáctica.
                    Si el alumno pide ayuda para estudiar, puedes resumir o formular preguntas.
                    `,
                    },
                    {
                    role: "user",
                    content: mensaje,
                    },
                    ],
                    });
                    const texto = response.output_text;
                    return Response.json({ respuesta: texto });
                    } catch (error) {
                        return Response.json({ respuesta: "error conectando con la IA" });
                        }
                        }