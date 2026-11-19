import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const index=JSON.parse(fs.readFileSync(new URL('../lib/oppositions/administrativos-universidades/index.json',import.meta.url)));
function harness({plan='esencial',region='andalucia',enrolled=true}={}){
 const saved=[];
 const checks=Array.from({length:10},(_,i)=>({id:`CHECK${i}`,question:`Comprobación ${i}`,options:['A','B','C','D'],answer:i%4,explanation:`Fundamento ${i}`}));
 const bank=Array.from({length:50},(_,i)=>({id:`BANK${i}`,question:`Banco ${i}`,options:['A','B','C','D'],answer:(i+1)%4,explanation:`Razón ${i}`}));
 const theme={id:'T01',title:'Constitución',blocks:[],glossary:[],rocio:[],tests:bank,checkTests:checks};
 const enrollment={id:'test-enrollment',plan_slug:plan,metadata:{autonomousModule:region}};
 function from(table){const f={};const q={select(){return q},eq(k,v){f[k]=v;return q},lte(){return q},or(){return q},in(){return q},like(){return q},order(){return q},limit(){return q},insert(v){saved.push(v);return q},is(){return q},update(v){if(region)return q;region=v.metadata.autonomousModule;return q},maybeSingle:async()=>({data:table==='course_enrollments'?enrollment:table==='opposition_materials'?{payload:f.resource_id==='documents'?{documents:[{title:'Guía',minimumPlan:'esencial',blocks:[]},{title:'Simulacro',minimumPlan:'estandar',blocks:[]},{title:'Laboratorio',minimumPlan:'premium',blocks:[]}]}:theme}:null,error:null}),then(ok,bad){return Promise.resolve({data:table==='course_enrollments'&&enrolled?[enrollment]:[],error:null}).then(ok,bad)}};return q;}
 const db={auth:{getUser:async()=>({data:{user:{id:'student',email:'student@example.test'}},error:null})},from};
 class NextResponse{static json(body,opts={}){return Object.assign(new NextResponse(),{body,status:opts.status||200})}}
 const regions={andalucia:{label:'Andalucía'},galicia:{label:'Galicia'}};
 const requires={'server-only':{},openai:{default:class{}},'next/server':{NextResponse},'@/lib/supabase/server':{getSupabase:()=>db},'@/lib/course-access':{isCourseAdministrator:()=>false},'@/lib/opposition-public-preview':{},'@/lib/haciendas-universidades':{packageCourse:()=>({title:'Universidades'}),packageRegion:s=>regions[s],packageRegions:regions,plans:{esencial:'Esencial',estandar:'Estándar',premium:'Premium'}},'@/lib/haciendas-universidades-access':{getIncludedModuleEnrollment:async()=>null,getPackageEnrollment:async()=>enrolled?{enrollment,plan}:null,getPackageRegion:async()=>null}};
 const load=path=>{const ctx={exports:{},require:id=>{if(!(id in requires))throw Error(id);return requires[id]},console,process:{env:{}}};vm.createContext(ctx);vm.runInContext(ts.transpileModule(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,ctx);return ctx.exports};
 return {api:load('lib/oppositions/shared-course/server.ts'),packages:load('app/api/oposiciones/haciendas-universidades/[course]/route.ts'),saved,checks,bank,req:(query='',body=null)=>({headers:{get:()=> 'Bearer test'},nextUrl:new URL('https://base12academy.es/?'+query),json:async()=>body})};
}
test('ambos cursos conservan 54 y 42 temas y las matrículas cerradas hasta verificar',()=>{
 assert.equal(index.themes.length,54);
 const auxiliary=JSON.parse(fs.readFileSync(new URL('../lib/oppositions/auxiliares-universidades/index.json',import.meta.url)));
 assert.equal(auxiliary.themes.length,42);
});
test('las tres modalidades sirven bancos separados sin revelar claves',async()=>{
 for(const plan of ['esencial','estandar','premium']){
  const h=harness({plan});const r=await h.api.contentGET(h.req('theme=T01'),index);
  assert.equal(r.status,200);assert.equal(r.body.theme.tests.length,plan==='esencial'?10:50);
  assert.ok(r.body.theme.tests.every(q=>!('answer' in q)&&!('explanation' in q)));
  if(plan!=='esencial')assert.equal(r.body.theme.checkTests.length,10);
 }
});
test('la corrección respeta claves independientes y guarda las respuestas',async()=>{
 for(const plan of ['esencial','estandar','premium']){
  const h=harness({plan});for(const questions of plan==='esencial'?[h.checks]:[h.checks,h.bank]){
   const r=await h.api.attemptPOST(h.req('',{mode:'theme',theme:'T01',answers:questions.map(q=>({id:q.id,selected:q.answer}))}),index);
   assert.equal(r.status,200);assert.equal(r.body.correct,questions.length);assert.equal(r.body.saved,true);
  }
 }
});
test('sin comunidad elegida se bloquean temario y corrección del alumno',async()=>{
 const h=harness({region:null});assert.equal((await h.api.contentGET(h.req(),index)).status,403);
 assert.equal((await h.api.attemptPOST(h.req('',{answers:[{id:'CHECK0',selected:0}]}),index)).status,403);
});
test('otra comunidad no se obtiene como muestra pública sin matrícula del módulo',async()=>{
 const h=harness({enrolled:false});assert.equal((await h.api.contentGET(h.req(),{...index,courseSlug:'modulo-autonomico-galicia'})).status,403);
});
test('los endpoints antiguos de descarga no entregan archivos ni URLs',async()=>{
 const h=harness();for(const kind of ['core','region']){
  const r=await h.packages.GET(h.req('package='+kind),{params:Promise.resolve({course:index.courseSlug})});
  assert.equal(r.status,410);assert.equal(r.body.error,'downloads_disabled');assert.ok(!r.body.url);
 }
});
test('los recursos respetan el paquete contratado',async()=>{
 for(const [plan,count] of [['esencial',1],['estandar',2],['premium',3]]){
  const h=harness({plan});const r=await h.packages.GET(h.req(),{params:Promise.resolve({course:index.courseSlug})});
  assert.equal(r.status,200);assert.equal(r.body.documents.length,count);
 }
});
