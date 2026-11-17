import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const slug='administrativo-sanidad-valenciana';
const index=JSON.parse(fs.readFileSync(new URL('../lib/oppositions/'+slug+'/index.json',import.meta.url),'utf8'));
function harness(){
 const saved=[];
 const themes=index.themes.map(meta=>({...meta,blocks:[{type:'paragraph',text:'Contenido de estudio'}],glossary:[],rocio:[],rocioOpen:[{question:'Caso abierto',answer:'Respuesta orientativa'}],tests:Array.from({length:50},(_,i)=>({id:meta.id+'-Q'+i,question:'Pregunta '+i,options:['A','B','C','D'],answer:i%4,explanation:'Fundamento '+i}))}));
 function query(table){const filters={};const q={select(){return q},eq(k,v){filters[k]=v;return q},lte(){return q},or(){return q},like(){return q},order(){return q},limit(){return q},insert(value){saved.push(value);return q},maybeSingle(){return Promise.resolve({data:themes.some(t=>t.id===filters.resource_id)?{payload:themes.find(t=>t.id===filters.resource_id)}:null,error:null})},then(ok,bad){let data=[];if(table==='course_enrollments')data=[{id:'enrollment-'+filters.user_id,plan_slug:filters.user_id}];if(table==='opposition_materials')data=themes.map(payload=>({payload}));return Promise.resolve({data,error:null}).then(ok,bad)}};return q;}
 const db={auth:{getUser:async token=>({data:{user:{id:token,email:token+'@example.test'}},error:null})},from:query};
 const ctx={exports:{},require:id=>id==='server-only'?{}:id==='openai'?{default:class{}}:id==='next/server'?{NextResponse:{json:(body,opts={})=>({body,status:opts.status||200})}}:id==='@/lib/supabase/server'?{getSupabase:()=>db}:id==='@/lib/course-access'?{isCourseAdministrator:()=>false}:id==='@/lib/opposition-public-preview'?{}:(()=>{throw Error(id)})(),console,process:{env:{}}};
 vm.createContext(ctx);const source=fs.readFileSync(new URL('../lib/oppositions/shared-course/server.ts',import.meta.url),'utf8');vm.runInContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,ctx);
 const req=(query='',plan=null,body=null)=>({headers:{get:()=>plan?'Bearer '+plan:null},nextUrl:new URL('https://base12academy.es/?'+query),json:async()=>body});
 return {api:ctx.exports,req,themes,saved};
}
test('Sanidad valenciana define 48 temas, diez simulacros de 20 y tres modalidades de doce meses',()=>{
 assert.equal(index.themes.length,48);assert.equal(index.simulations.length,10);assert.ok(index.simulations.every(s=>s.count===20));assert.equal(index.durationMonths,12);assert.deepEqual(index.prices,{esencial:149,estandar:299,premium:499});assert.equal(index.enrollmentOpen,true);
});
test('la muestra entrega el tema 1 sin claves de corrección y bloquea el tema 2',async()=>{
 const h=harness();const publicTheme=await h.api.contentGET(h.req('theme=T01'),index);assert.equal(publicTheme.status,200);assert.equal(publicTheme.body.theme.tests.length,50);assert.ok(publicTheme.body.theme.tests.every(q=>!('answer'in q)&&!('explanation'in q)));const blocked=await h.api.contentGET(h.req('theme=T02'),index);assert.equal(blocked.status,401);
});
test('Esencial recibe diez preguntas y Estándar o Premium cincuenta',async()=>{
 const h=harness();for(const [plan,count] of [['esencial',10],['estandar',50],['premium',50]]){const r=await h.api.contentGET(h.req('theme=T43',plan),index);assert.equal(r.status,200);assert.equal(r.body.theme.tests.length,count);assert.equal(r.body.theme.rocioOpen.length,1);}
});
test('los simulacros exigen Estándar y seleccionan veinte temas diferentes',async()=>{
 const h=harness();assert.equal((await h.api.contentGET(h.req('mode=simulation','esencial'),index)).status,403);const r=await h.api.contentGET(h.req('mode=simulation','estandar'),index);assert.equal(r.status,200);assert.equal(r.body.questions.length,20);assert.equal(new Set(r.body.questions.map(q=>q.id.split('-')[0])).size,20);
});
test('la corrección guarda el resultado y rechaza preguntas duplicadas',async()=>{
 const h=harness();const answers=h.themes[0].tests.slice(0,10).map(q=>({id:q.id,selected:q.answer}));const r=await h.api.attemptPOST(h.req('','esencial',{mode:'theme',theme:'T01',answers}),index);assert.equal(r.status,200);assert.equal(r.body.correct,10);assert.equal(r.body.saved,true);assert.equal(h.saved.length,1);const invalid=await h.api.attemptPOST(h.req('','esencial',{mode:'theme',theme:'T01',answers:answers.map(()=>answers[0])}),index);assert.equal(invalid.status,400);
});
