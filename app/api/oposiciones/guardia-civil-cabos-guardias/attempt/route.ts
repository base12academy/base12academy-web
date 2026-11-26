import index from "@/lib/oppositions/guardia-civil-cabos-guardias/index.json";
import {NextRequest} from "next/server";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export const dynamic = "force-dynamic";
export function POST(req: NextRequest) { return attemptPOST(req, index); }
