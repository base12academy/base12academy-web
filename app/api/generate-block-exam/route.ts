import { NextResponse } from "next/server";
import { generateBlockExam } from "@/lib/exams/generateBlockExam";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const blockId = body.blockId;
    const selectedTopicSlugs = body.selectedTopicSlugs || [];

    if (!blockId) {
      return NextResponse.json(
        { error: "Falta blockId" },
        { status: 400 }
      );
    }

    if (!Array.isArray(selectedTopicSlugs) || selectedTopicSlugs.length === 0) {
      return NextResponse.json(
        { error: "Faltan selectedTopicSlugs" },
        { status: 400 }
      );
    }

    const exam = await generateBlockExam({
      blockId,
      selectedTopicSlugs,
    });

    return NextResponse.json(exam);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}