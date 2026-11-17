import index from "@/lib/oppositions/administrativo-generalitat-valenciana/index.json";
import {NextRequest} from "next/server";
import {attemptPOST} from "@/lib/oppositions/shared-course/server";
export async function POST(req:NextRequest){return attemptPOST(req,index)}
