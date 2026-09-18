import { MATEMATICAS_APLICADAS_PAU_PROBLEMS, MATEMATICAS_APLICADAS_PAU_PROFILES, type PauProblem } from "./pau";

export type SimulationGroup={label:string;points:number;choose:number;problemIds:string[]};
export type PauSimulation={code:string;community:string;status:string;profile:string;groups:SimulationGroup[]};

const id=(block:"ALG"|"ANA"|"EST",n:number)=>`MACS-${block}-${String(((n-1)%16)+1).padStart(2,"0")}`;
const g=(label:string,points:number,choose:number,problemIds:string[]):SimulationGroup=>({label,points,choose,problemIds});
const profile=(code:string)=>MATEMATICAS_APLICADAS_PAU_PROFILES.find(p=>p.code===code)!;
const sim=(code:string,groups:SimulationGroup[]):PauSimulation=>{const p=profile(code);return{code,community:p.community,status:p.status,profile:p.format,groups}};

export const MATEMATICAS_APLICADAS_PAU_SIMULATIONS:PauSimulation[]=[
sim("AND",[g("P1 · Álgebra/modelización",2.5,1,[id("ALG",1)]),g("P2 · Análisis",2.5,1,[id("ANA",5)]),g("P3 · Probabilidad/Estadística",2.5,1,[id("EST",9)]),g("P4 · Opción interna",2.5,1,[id("ALG",8),id("ANA",12)])]),
sim("ARA",[g("P1 · Álgebra · obligatoria",2.5,1,[id("ALG",2)]),g("P2 · Análisis · obligatoria",2.5,1,[id("ANA",6)]),g("P3 · Estocástico · obligatoria",2.5,1,[id("EST",10)]),g("P4 · Responde 2 de 3 cuestiones",2.5,2,[id("ALG",9),id("ANA",13),id("EST",14)])]),
sim("AST",[g("Tarea 1 · Álgebra/modelización",2.5,1,[id("ALG",3)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",7)]),g("Tarea 3 · Estocástico",2.5,1,[id("EST",11)]),g("Tarea 4 · Transferencia",2.5,1,[id("ALG",10)])]),
sim("BAL",[g("Sección 1A · Estocástico · obligatoria",2,1,[id("EST",4)]),g("Sección 1B · Estocástico · obligatoria",2,1,[id("EST",5)]),g("Sección 2 · Elige 1 de 2",3,1,[id("ALG",4),id("ANA",8)]),g("Sección 3 · Elige 1 de 2",3,1,[id("ALG",11),id("ANA",15)])]),
sim("CAN",[g("Pregunta 1 · Estocástico · obligatoria",2,1,[id("EST",6)]),g("Pregunta 2 · Estocástico · obligatoria",2,1,[id("EST",7)]),g("Pregunta 3 · Análisis · elige A/B",3,1,[id("ANA",9),id("ANA",10)]),g("Pregunta 4 · Álgebra · elige A/B",3,1,[id("ALG",5),id("ALG",6)])]),
sim("CNT",[g("Apartado 1 · elige 1 de 2",3,1,[id("ALG",7),id("ALG",12)]),g("Apartado 2 · elige 1 de 2",4,1,[id("ANA",11),id("ANA",16)]),g("Apartado 3 · elige 1 de 2",3,1,[id("EST",8),id("EST",12)])]),
sim("CLM",[g("Ejercicio 1 · obligatorio",2.5,1,[id("ALG",8)]),g("Ejercicio 2 · obligatorio",2.5,1,[id("EST",13)]),g("Ejercicio 3 · elige A/B",2.5,1,[id("ANA",12),id("ANA",14)]),g("Ejercicio 4 · elige A/B",2.5,1,[id("ALG",13),id("EST",15)])]),
sim("CYL",[g("Tarea 1 · Álgebra/modelización",2.5,1,[id("ALG",14)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",1)]),g("Tarea 3 · Estocástico",2.5,1,[id("EST",16)]),g("Tarea 4 · Justificación",2.5,1,[id("ANA",6)])]),
sim("CAT",[g("Ejercicio 1 · Álgebra",2.5,1,[id("ALG",9)]),g("Ejercicio 2 · Análisis",2.5,1,[id("ANA",15)]),g("Ejercicio 3 · Estocástico",2.5,1,[id("EST",1)]),g("Ejercicio 4 · transversal · elige A/B",2.5,1,[id("ALG",16),id("EST",8)])]),
sim("CVA",[g("Tarea 1 · Álgebra",2.5,1,[id("ALG",10)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",2)]),g("Tarea 3 · opción interna",2.5,1,[id("EST",2),id("EST",9)]),g("Tarea 4 · opción interna",2.5,1,[id("ALG",15),id("ANA",7)])]),
sim("EXT",[g("Tarea 1 · Álgebra/modelización",2.5,1,[id("ALG",11)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",3)]),g("Tarea 3 · Estocástico",2.5,1,[id("EST",3)]),g("Tarea 4 · Transferencia",2.5,1,[id("EST",10)])]),
sim("GAL",[g("Q1 · Estadística/Probabilidad · obligatoria",2,1,[id("EST",4)]),g("Q2 · obligatoria",3,1,[id("ANA",4)]),g("Q3 · elección interna",2.5,1,[id("ALG",12),id("ALG",14)]),g("Q4 · elección interna",2.5,1,[id("ANA",8),id("EST",12)])]),
sim("MAD",[g("Bloque 1 · Álgebra",2.5,1,[id("ALG",13)]),g("Bloque 2 · Análisis · opción",2.5,1,[id("ANA",9),id("ANA",13)]),g("Bloque 3 · Probabilidad · opción",2.5,1,[id("EST",5),id("EST",11)]),g("Bloque 4 · Estadística/Inferencia · opción",2.5,1,[id("EST",6),id("EST",13)])]),
sim("MUR",[g("Álgebra · elige 1 de 2",3,1,[id("ALG",1),id("ALG",15)]),g("Cálculo · elige 1 de 2",4,1,[id("ANA",10),id("ANA",16)]),g("Probabilidad/Estadística · elige 1 de 2",3,1,[id("EST",7),id("EST",14)])]),
sim("NAV",[g("Tarea 1 · Álgebra/modelización",2.5,1,[id("ALG",2)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",11)]),g("Tarea 3 · Estocástico",2.5,1,[id("EST",8)]),g("Tarea 4 · Transferencia",2.5,1,[id("EST",15)])]),
sim("PVA",[g("P1 · 2 puntos",2,1,[id("ALG",3)]),g("P2 · 3 puntos",3,1,[id("EST",9)]),g("P3 · 3 puntos · elige A/B",3,1,[id("ANA",12),id("ANA",14)]),g("P4 · 2 puntos · elige A/B",2,1,[id("ALG",16),id("ALG",6)])]),
sim("RIO",[g("Tarea 1 · Álgebra/modelización",2.5,1,[id("ALG",4)]),g("Tarea 2 · Análisis",2.5,1,[id("ANA",13)]),g("Tarea 3 · opción interna",2.5,1,[id("EST",10),id("EST",16)]),g("Tarea 4 · opción interna",2.5,1,[id("ALG",7),id("ANA",5)])])
];

const byId=new Map(MATEMATICAS_APLICADAS_PAU_PROBLEMS.map(p=>[p.id,p]));
export function getPauSimulation(code:string){
 const simulation=MATEMATICAS_APLICADAS_PAU_SIMULATIONS.find(s=>s.code===code.toUpperCase());
 if(!simulation)return null;
 return {...simulation,groups:simulation.groups.map(group=>({...group,problems:group.problemIds.map(id=>byId.get(id)).filter((p):p is PauProblem=>Boolean(p))}))};
}
