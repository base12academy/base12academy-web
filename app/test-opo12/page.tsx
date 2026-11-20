import Link from "next/link";
import {testPrograms,TEST_PRICE,testCoursePath} from "@/lib/test-opo12/catalog";
import {getSupabase} from "@/lib/supabase/server";
import s from "@/components/TestOpo12.module.css";
export const dynamic="force-dynamic";
export const metadata={title:"TEST OPO12 · Test y simulacros | Base12 Academy"};
export default async function TestCatalog(){
 const {data,error}=await getSupabase().from("test_opo12_courses").select("slug").eq("open",true);
 const open=new Set((data||[]).map(v=>v.slug));
 return <main className={s.page}><nav><Link href="/?familia=oposiciones#catalogo">Volver a Oposiciones - Test</Link><Link href="/dashboard/mis-cursos">Mis cursos</Link></nav><h1>TEST OPO12</h1><p>Elige tu oposición para practicar test por temas y simulacros. Cada oposición cuesta <b>{TEST_PRICE}</b>. Pagas un mes y decides cuándo renovar desde tu cuenta.</p>{error&&<p role="status">No se ha podido consultar la disponibilidad de matrícula.</p>}{[...new Set(testPrograms.map(c=>c.region))].map(region=><section key={region}><h2>{region}</h2><div className={s.grid}>{testPrograms.filter(c=>c.region===region).map(c=><article className={s.card} key={c.slug}><h3><Link href={testCoursePath(c.slug)}>{c.title}</Link></h3><p>{error?"Consultar disponibilidad":open.has(c.slug)?"Matrícula abierta":"En preparación"}</p></article>)}</div></section>)}</main>
}
