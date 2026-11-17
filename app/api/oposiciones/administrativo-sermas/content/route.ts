import index from "@/lib/oppositions/administrativo-sermas/index.json";
import {NextRequest} from "next/server";
import {contentGET} from "@/lib/oppositions/shared-course/server";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){return contentGET(req,index)}
