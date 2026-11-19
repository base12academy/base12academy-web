import type {NextRequest} from "next/server";
import index from "@/lib/oppositions/modulo-autonomico-navarra/index.json";
import {assistantPOST} from "@/lib/oppositions/shared-course/server";
export function POST(request:NextRequest){return assistantPOST(request,index)}
