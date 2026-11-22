import Link from "next/link";
import {notFound} from "next/navigation";
import {getSupabase} from "@/lib/supabase/server";
import {TEST_PRICE,testProgram} from "@/lib/test-opo12/catalog";
import Practice from "@/components/TestOpo12Practice";
import s from "@/components/TestOpo12.module.css";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{curso:string}>}){
 const {curso}=await params;const program=testProgram(curso);if(!program)notFound();
 const premiumIncludesSimulations=["administrativo-ja","auxiliar-administrativo-ja"].includes(curso);
 const db=getSupabase();const [availability,sets]=await Promise.all([db.from("test_opo12_courses").select("open").eq("slug",curso).maybeSingle(),db.from("test_opo12_sets").select("kind,id,title,settings").eq("course",curso).order("id")]);
 const failed=!!(availability.error||sets.error),open=!failed&&availability.data?.open===true;
 return <main className={s.page}><nav><Link href="/test-opo12">Todos los cursos de TEST OPO12</Link><Link href="/dashboard/mis-cursos">Mis cursos</Link></nav><p>TEST OPO12 · {program.region}</p><h1>{program.title}</h1><p className={s.price}>{premiumIncludesSimulations?"Incluido en Premium · acceso independiente "+TEST_PRICE:TEST_PRICE}</p><p>Test por temas, hasta dos simulacros nuevos al día e historial personal de resultados. {premiumIncludesSimulations?"El paquete Premium de esta oposición incluye acceso a sus 10 simulacros sin cuota adicional. También puedes contratar TEST OPO12 de forma independiente si no tienes esa matrícula.":"Paga un mes de acceso independiente a esta oposición. Puedes renovar manualmente desde tu cuenta."}</p><Practice slug={curso} open={open} failed={failed} sets={sets.data||[]}/></main>
}
