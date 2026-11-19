import type {NextRequest} from "next/server";
import index from "@/lib/oppositions/modulo-autonomico-pais-vasco/index.json";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export function POST(request:NextRequest){return attemptPOST(request,index)}
