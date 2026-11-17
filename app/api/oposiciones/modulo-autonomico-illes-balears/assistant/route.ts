import index from "@/lib/oppositions/modulo-autonomico-illes-balears/index.json";
import {NextRequest} from "next/server";
import {assistantPOST} from "@/lib/oppositions/shared-course/server";
export const maxDuration=60;
export async function POST(req:NextRequest){return assistantPOST(req,index)}
