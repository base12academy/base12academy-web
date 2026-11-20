import index from "@/lib/oppositions/auxiliar-administrativo-chguv-co34-24/index.json";
import {NextRequest} from "next/server";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){return attemptPOST(req,index)}
