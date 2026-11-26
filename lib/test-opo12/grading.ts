export type Content = {question:string;options?:string[];answer?:number;explanation:string;context?:string;responseType?:"written"};
export type Entry = {id:string;content:Content};
type ScoringSection = {label:string; count:number; credit:number; penalty:number};
export type Settings = {minutes?:number;reserve?:number;penalty?:number;rubric?:string;format?:string;scoringSections?:ScoringSection[]};
export function present(items:Entry[]) {
 return items.map(({content:q})=>({question:q.question,options:q.options,context:q.context,responseType:q.responseType}));
}
export function correct(items:Entry[],answers:unknown[],settings:Settings){
 if(!Array.isArray(answers)||answers.length!==items.length)throw Error("invalid_answers");
 let right=0,wrong=0,blank=0,written=0;
 const ordinary=items.length-(settings.reserve||0);
 const sections=(settings.scoringSections??[]).map(section=>({...section,score:0}));
 const objectiveCount=items.slice(0,ordinary).filter(item=>item.content.responseType!=="written").length;
 if(sections.length && sections.reduce((sum,section)=>sum+section.count,0)!==objectiveCount)throw Error("invalid_scoring_sections");
 let sectionIndex=0, usedInSection=0;
 const review=items.map(({content:q},i)=>{
  const value=answers[i],reserve=i>=ordinary;
  if(q.responseType==="written"){
   if(typeof value!=="string"||value.length>5000)throw Error("invalid_answers");
   written++;return {...present([items[i]])[0],selected:value,explanation:q.explanation,reserve};
  }
  if(value!==null&&(!Number.isInteger(value)||Number(value)<0||Number(value)>=Number(q.options?.length)))throw Error("invalid_answers");
  if(!reserve){
   if(value===null)blank++;
   else if(value===q.answer)right++;
   else wrong++;
   const section=sections[sectionIndex];
   if(section){
    if(value!==null)section.score+=value===q.answer?section.credit:-section.penalty;
    if(++usedInSection===section.count){sectionIndex++;usedInSection=0}
   }
  }
  return {...present([items[i]])[0],selected:value,correct:q.answer,explanation:q.explanation,reserve};
 });
 const sectionScores=sections.map(({label,score})=>({label,score:Math.round(score*100)/100}));
 const score=sectionScores.length?Math.round(sectionScores.reduce((sum,section)=>sum+section.score,0)*100)/100
  :written?null:Math.round((right-wrong*(settings.penalty||0))*100)/100;
 return {right,wrong,blank,written,ordinary,score,sectionScores,review};
}
