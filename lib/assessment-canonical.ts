import { MATEMATICAS_APLICADAS_ROCIO_QUESTIONS, MATEMATICAS_APLICADAS_SHORT_QUESTIONS } from "@/lib/matematicas-aplicadas-ccss/evaluation";
import { MATEMATICAS_APLICADAS_PAU_PROBLEMS } from "@/lib/matematicas-aplicadas-ccss/pau";
import { getPauSimulation as getAplicadasSimulation } from "@/lib/matematicas-aplicadas-ccss/pau-simulations";
import { MATEMATICAS_II_ROCIO_QUESTIONS, MATEMATICAS_II_SHORT_QUESTIONS } from "@/lib/matematicas-ii/evaluation";
import { MATEMATICAS_II_PAU_PROBLEMS, getPauSimulation as getMat2Simulation } from "@/lib/matematicas-ii/pau";

import historiaTests from "@/data/historia/test.json";
import historiaShorts from "@/data/historia/short.json";
import historiaSources from "@/data/historia/sources.json";
import historiaDevelopments from "@/data/historia/developments.json";
import historiaErrors from "@/data/historia/errors.json";
import historiaChronology from "@/data/historia/chronology-exercises.json";
import historiaTerritorial from "@/data/historia/territorial.json";
import historiaRocio from "@/data/historia/rocio.json";

import filosofiaTests from "@/data/filosofia/test.json";
import filosofiaShorts from "@/data/filosofia/short.json";
import filosofiaLongs from "@/data/filosofia/long.json";
import filosofiaRocioAuthors from "@/data/filosofia/rocio-authors.json";
import filosofiaRocioPau from "@/data/filosofia/rocio-pau.json";

type JsonRecord=Record<string,unknown>;
export type CanonicalAssessment={
  kind:"closed"|"open";
  correctAnswer?:string;
  expectedAnswer?:string;
  rubric?:string;
  feedback?:string;
  recovery?:string;
};

function findById(rows:JsonRecord[],contentId:string){
  return rows.find(item=>String(item.ID||item.Corpus_ID||"")===contentId);
}

function optionLetterForAnswer(item:JsonRecord,answer:string){
  const direct=answer.trim().toUpperCase();
  if(/^[ABCD]$/.test(direct))return direct;
  const labels=["A","B","C","D"].map(letter=>({
    letter,
    text:String(item["Opción "+letter]||item[letter]||"").trim().toLocaleLowerCase("es"),
  }));
  return labels.find(option=>option.text&&option.text===answer.trim().toLocaleLowerCase("es"))?.letter||"";
}

function historyOpen(item:JsonRecord){
  const expected=String(item["Respuesta modelo"]||item["Respuesta modelo / correcta"]||item["Respuesta orientativa"]||item["Esquema de respuesta"]||item["Corrección correcta"]||item["Orden correcto"]||item["Letra correcta"]||"");
  const rubric=String(item["Feedback pedagógico"]||item["Feedback / rúbrica"]||item["Criterio de corrección"]||item["Explicación pedagógica"]||item["Explicación causal"]||item["Rúbrica Base12"]||item.Criterio||item["Criterio 1"]||"");
  return {kind:"open" as const,expectedAnswer:expected,rubric,feedback:rubric};
}

function filosofiaOpen(item:JsonRecord){
  const expected=String(item.Correcta||item["Respuesta correcta"]||item["Elementos esperados"]||"");
  const rubric=String(item.Feedback||item.Retroalimentación||item["Elementos esperados"]||item["Respuesta correcta"]||"");
  return {kind:"open" as const,expectedAnswer:expected,rubric,feedback:rubric};
}

export function resolveCanonicalAssessment(courseSlug:string,contentId:string):CanonicalAssessment|null{
  if(courseSlug==="matematicas-aplicadas-ccss"){
    const closed=MATEMATICAS_APLICADAS_ROCIO_QUESTIONS.find(item=>item.id===contentId);
    if(closed)return {kind:"closed",correctAnswer:closed.correct,feedback:closed.feedback,recovery:closed.recovery};
    const short=MATEMATICAS_APLICADAS_SHORT_QUESTIONS.find(item=>item.id===contentId);
    if(short)return {kind:"open",expectedAnswer:short.expectedAnswer,rubric:short.rubric};
    const problem=MATEMATICAS_APLICADAS_PAU_PROBLEMS.find(item=>item.id===contentId);
    if(problem)return {kind:"open",expectedAnswer:problem.solution,rubric:problem.rubric};
    const [code,problemId]=contentId.split(":");
    if(code&&problemId){
      const simulation=getAplicadasSimulation(code);
      const simProblem=simulation?.groups.flatMap(group=>group.problems).find(item=>item.id===problemId);
      if(simProblem)return {kind:"open",expectedAnswer:simProblem.solution,rubric:simProblem.rubric};
    }
    return null;
  }

  if(courseSlug==="matematicas-ii"){
    const closed=MATEMATICAS_II_ROCIO_QUESTIONS.find(item=>item.id===contentId);
    if(closed)return {kind:"closed",correctAnswer:closed.correct,feedback:closed.feedback,recovery:closed.recovery};
    const short=MATEMATICAS_II_SHORT_QUESTIONS.find(item=>item.id===contentId);
    if(short)return {kind:"open",expectedAnswer:short.expectedAnswer,rubric:short.rubric};
    const problem=MATEMATICAS_II_PAU_PROBLEMS.find(item=>item.id===contentId);
    if(problem)return {kind:"open",expectedAnswer:problem.solution,rubric:problem.rubric};
    const [code,indexRaw]=contentId.split(":");
    const index=Number(indexRaw)-1;
    const simulation=code?getMat2Simulation(code):null;
    if(simulation&&!Array.isArray(simulation)&&Number.isInteger(index)&&index>=0){
      const base=index*4;
      const expected=String(simulation.content[base+2]||"").replace(/^Solución docente:\s*/i,"");
      const rubric=String(simulation.content[base+3]||"").replace(/^Criterio Base12 ajustado:\s*/i,"");
      if(expected||rubric)return {kind:"open",expectedAnswer:expected,rubric};
    }
    return null;
  }

  if(courseSlug==="historia-espana"){
    const banks=[
      historiaTests,historiaShorts,historiaSources,historiaDevelopments,
      historiaErrors,historiaChronology,historiaTerritorial,historiaRocio,
    ] as JsonRecord[][];
    for(const rows of banks){
      const item=findById(rows,contentId);
      if(!item)continue;
      const answer=String(item.Correcta||item["Letra correcta"]||"");
      const letter=optionLetterForAnswer(item,answer);
      if(letter)return {kind:"closed",correctAnswer:letter,feedback:String(item["Feedback pedagógico"]||item["Explicación pedagógica"]||""),recovery:String(item["Feedback pedagógico"]||"")};
      return historyOpen(item);
    }
    return null;
  }

  if(courseSlug==="historia-filosofia"){
    const banks=[filosofiaTests,filosofiaShorts,filosofiaLongs,filosofiaRocioAuthors,filosofiaRocioPau] as JsonRecord[][];
    for(const rows of banks){
      const item=findById(rows,contentId);
      if(!item)continue;
      const answer=String(item.Correcta||item["Respuesta correcta"]||"");
      const letter=optionLetterForAnswer(item,answer);
      if(letter)return {kind:"closed",correctAnswer:letter,feedback:String(item.Feedback||item.Retroalimentación||""),recovery:String(item.Feedback||item.Retroalimentación||"")};
      return filosofiaOpen(item);
    }
  }
  return null;
}
