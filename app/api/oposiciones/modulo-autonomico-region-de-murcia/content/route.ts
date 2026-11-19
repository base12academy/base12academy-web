import type {NextRequest} from "next/server";
import index from "@/lib/oppositions/modulo-autonomico-region-de-murcia/index.json";
import {contentGET} from "@/lib/oppositions/shared-course/server";
export function GET(request:NextRequest){return contentGET(request,index)}
