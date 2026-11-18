import type { NextRequest } from "next/server";
import index from "@/lib/oppositions/administrativos-haciendas-locales/index.json";
import { assistantPOST } from "@/lib/oppositions/shared-course/server";

export function POST(request: NextRequest) {
  return assistantPOST(request, index);
}
