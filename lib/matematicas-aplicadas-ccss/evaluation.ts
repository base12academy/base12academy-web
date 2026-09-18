import evaluationSource from "./evaluation-source.json";

type Letter = "A" | "B" | "C" | "D";
type EvaluationSource = { unit:string; sourceUnit:string; scope:string; title:string; criterion:string; error:string; rocioCorrect:Letter[] };

export type RocioQuestion = { id:string; scope:string; unit:string; title:string; question:string; options:Record<Letter,string>; correct:Letter; feedback:string; recovery:string };
export type ShortQuestion = { id:string; scope:string; unit:string; title:string; question:string; expectedAnswer:string; rubric:string };

const LETTERS: Letter[]=["A","B","C","D"];
const SOURCE=evaluationSource as EvaluationSource[];

function placeCorrect(correct:Letter,answer:string,distractors:string[]):Record<Letter,string>{
  const values=[...distractors]; const result={} as Record<Letter,string>;
  for(const letter of LETTERS) result[letter]=letter===correct?answer:(values.shift()??"");
  return result;
}
function makeRocio(item:EvaluationSource):RocioQuestion[]{
  const [c1,c2,c3]=item.rocioCorrect;
  const verify=`Volver a los datos y condiciones y verificar que el resultado es coherente con el procedimiento: ${item.criterion}.`;
  return [
    {id:`${item.sourceUnit}-R01`,scope:item.scope,unit:item.unit,title:item.title,question:`¿Cuál es el criterio de trabajo más seguro en «${item.title}»?`,options:placeCorrect(c1,item.criterion,["Aplicar cualquier fórmula que contenga los mismos símbolos.","Dar el resultado sin justificar para ahorrar tiempo.","Sustituir números antes de identificar qué se pide."]),correct:c1,feedback:`La respuesta correcta resume el procedimiento Base12: ${item.criterion}.`,recovery:"Vuelve a identificar la pregunta, las condiciones del método y el primer paso. No empieces por la cuenta."},
    {id:`${item.sourceUnit}-R02`,scope:item.scope,unit:item.unit,title:item.title,question:`¿Qué error debe evitarse especialmente en «${item.title}»?`,options:placeCorrect(c2,item.error,["Escribir las unidades cuando existen.","Comprobar el resultado al final.","Separar casos si el procedimiento lo exige."]),correct:c2,feedback:`El error característico es ${item.error}.`,recovery:"Localiza qué condición o interpretación se está saltando. Un procedimiento correcto no depende solo de operar."},
    {id:`${item.sourceUnit}-R03`,scope:item.scope,unit:item.unit,title:item.title,question:`Después de resolver «${item.title}», ¿qué comprobación final es la más sólida?`,options:placeCorrect(c3,verify,["Aceptar el resultado si coincide con la calculadora, aunque no se ajuste a las condiciones.","Redondear la respuesta hasta que parezca razonable.","Eliminar cualquier caso que complique la solución."]),correct:c3,feedback:`La verificación debe volver al problema y al criterio usado en «${item.title}»; no basta con que la cuenta produzca un número.`,recovery:`Revisa las condiciones de «${item.title}» y comprueba el resultado por sustitución, propiedad independiente o interpretación, según corresponda.`}
  ];
}
function makeShort(item:EvaluationSource):ShortQuestion[]{return [
  {id:`${item.sourceUnit}-C01`,scope:item.scope,unit:item.unit,title:item.title,question:`Explica en 3–5 líneas cómo reconocerías que un ejercicio exige el procedimiento de «${item.title}» y cuál sería tu primer paso.`,expectedAnswer:`Debe identificar los datos/palabras matemáticas relevantes, verificar las condiciones del procedimiento y comenzar por: ${item.criterion}.`,rubric:"2 puntos: 0,75 reconocimiento; 0,75 primer paso correcto; 0,50 justificación/condiciones."},
  {id:`${item.sourceUnit}-C02`,scope:item.scope,unit:item.unit,title:item.title,question:`Indica un error frecuente en «${item.title}» y explica cómo comprobarías que no lo has cometido.`,expectedAnswer:`Error de referencia: ${item.error}. La comprobación debe volver a las condiciones, sustituir el resultado o contrastar con una propiedad independiente.`,rubric:"2 puntos: 0,75 error pertinente; 0,75 comprobación válida; 0,50 claridad matemática."}
];}
export const MATEMATICAS_APLICADAS_ROCIO_QUESTIONS=SOURCE.flatMap(makeRocio);
export const MATEMATICAS_APLICADAS_SHORT_QUESTIONS=SOURCE.flatMap(makeShort);
export function getRocioQuestions(unit?:string){return unit?MATEMATICAS_APLICADAS_ROCIO_QUESTIONS.filter(i=>i.unit===unit):MATEMATICAS_APLICADAS_ROCIO_QUESTIONS;}
export function getShortQuestions(unit?:string){return unit?MATEMATICAS_APLICADAS_SHORT_QUESTIONS.filter(i=>i.unit===unit):MATEMATICAS_APLICADAS_SHORT_QUESTIONS;}
