import Link from "next/link";
import {notFound} from "next/navigation";
import {getSupabase} from "@/lib/supabase/server";
import {TEST_PRICE,testProgram} from "@/lib/test-opo12/catalog";
import s from "@/components/TestOpo12.module.css";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{curso:string}>}){
 const {curso}=await params;const program=testProgram(curso);if(!program)notFound();
 const db=getSupabase();const {data,error}=await db.from("test_opo12_sets").select("id,kind,title").eq("course",curso).order("id");
 const themes=(data||[]).filter(r=>r.kind==="test" && /^T\d+$/.test(r.id));
 const models=(data||[]).filter(r=>r.kind==="simulacro");
 return <main className={s.page}><nav><Link href="/test-opo12">Todos los cursos de TEST OPO12</Link><Link href="/?familia=oposiciones#catalogo">Oposiciones - Test</Link></nav><p>TEST OPO12 · {program.region}</p><h1>{program.title}</h1><p className={s.price}>{TEST_PRICE}</p><p>Suscripción mensual por oposición, con renovación automática. Incluye test por temas, simulacros y revisión de respuestas.</p><p className={s.note}>Matrícula en preparación.</p>{!error&&themes.length>0&&<section className={s.card}><h2>Test por temas</h2><details><summary>Ver los {themes.length} temas</summary><ul>{themes.map(r=><li key={r.id}>{r.title}</li>)}</ul></details></section>}{!error&&models.length>0&&<section className={s.card}><h2>Simulacros</h2><p>{models.length} modelos de entrenamiento cargados.</p></section>}</main>
}
