import { NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import ExamStrategyPDF from "@/lib/pdf/ExamStrategyPDF";

export const runtime = "nodejs";

export async function GET() {
  const stream = await renderToStream(React.createElement(ExamStrategyPDF));

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="estrategia-examen.pdf"',
    },
  });
}