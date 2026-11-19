import s from "@/components/OppositionCourse.module.css";

export type LearningGuideData={
 objectives:string[];
 method:string[];
 concepts?:string[][];
 workedCases?:{title:string;situation:string;steps:string[];answer:string;commonError:string;reference:string}[];
 checkpoints?:{question:string;answer:string;reference:string}[];
 reviewAdvice?:string;
};

export default function OppositionLearningGuide({value}:{value?:LearningGuideData}){
 if(!value)return null;
 return <section aria-label="Guía de aprendizaje del tema">
  <h3>Qué debes saber hacer al terminar</h3>
  <ul>{value.objectives.map(goal=><li key={goal}>{goal}</li>)}</ul>
  <details className={s.qa}><summary>Cómo trabajar este tema</summary><ol>{value.method.map(step=><li key={step}>{step}</li>)}</ol></details>
  {value.concepts&&<><h3>Conceptos que debes distinguir</h3><div style={{overflowX:"auto"}}><table className={s.supportTable}><thead><tr>{value.concepts[0].map(cell=><th scope="col" key={cell}>{cell}</th>)}</tr></thead><tbody>{value.concepts.slice(1).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></>}
  {value.workedCases?.length? <><h3>Aplicación razonada</h3><p>Intenta decidir qué harías y por qué antes de abrir la solución.</p>{value.workedCases.map(item=><article key={item.title} className={s.qa}>
   <h4>{item.title}</h4><p>{item.situation}</p>
   <details><summary>Ver el razonamiento y la solución</summary><ol>{item.steps.map(step=><li key={step}>{step}</li>)}</ol><p><strong>Decisión:</strong> {item.answer}</p><p><strong>Error que debes evitar:</strong> {item.commonError}</p><p><strong>Referencia:</strong> {item.reference}</p></details>
  </article>)}</>:null}
  {value.checkpoints?.length?<><h3>Explica lo que has comprendido</h3><p>Formula tu respuesta sin mirar el tema. Después, compárala con la orientación y localiza qué te ha faltado.</p>{value.checkpoints.map(item=><details key={item.question} className={s.qa}><summary>{item.question}</summary><p>{item.answer}</p><p>{item.reference}</p></details>)}</>:null}
  {value.reviewAdvice&&<p>{value.reviewAdvice}</p>}
 </section>;
}
