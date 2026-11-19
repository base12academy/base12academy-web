import type {NextRequest} from "next/server";
import index from "@/lib/oppositions/administrativos-universidades/index.json";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export function POST(request:NextRequest){return attemptPOST(request,index)}
