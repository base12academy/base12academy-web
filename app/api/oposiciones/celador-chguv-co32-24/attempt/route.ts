import index from "@/lib/oppositions/celador-chguv-co32-24/index.json";
import {NextRequest} from "next/server";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){return attemptPOST(req,index)}
