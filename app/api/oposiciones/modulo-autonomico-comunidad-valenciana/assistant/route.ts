import type {NextRequest} from "next/server";
import index from "@/lib/oppositions/modulo-autonomico-comunidad-valenciana/index.json";
import {assistantPOST} from "@/lib/oppositions/shared-course/server";
export function POST(request:NextRequest){return assistantPOST(request,index)}
