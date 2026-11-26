import index from "@/lib/oppositions/guardia-civil-cabos-guardias/index.json";
import {NextRequest} from "next/server";
import {assistantPOST} from "@/lib/oppositions/shared-course/server";
export const dynamic = "force-dynamic";
export function POST(req: NextRequest) { return assistantPOST(req, index); }
