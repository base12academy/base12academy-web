import index from "@/lib/oppositions/celador-sermas/index.json";
import {NextRequest} from "next/server";
import {assistantPOST} from "@/lib/oppositions/shared-course/server";
export const dynamic="force-dynamic";
export async function POST(req:NextRequest){return assistantPOST(req,index)}
