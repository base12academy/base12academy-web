import index from "@/lib/oppositions/tecnico-auxiliar-informatica-estado/index.json";
import {NextRequest} from "next/server";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export async function POST(req:NextRequest){return attemptPOST(req,index)}
