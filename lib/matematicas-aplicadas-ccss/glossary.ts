import glossary1 from "../matematicas-ii/glossary-1.json";
import glossary2 from "../matematicas-ii/glossary-2.json";

export type GlossaryTerm={term:string;definition:string;utility:string;error:string;example:string};
export type GlossarySection={section:number;title:string;terms:GlossaryTerm[]};

const common=[...(glossary1.sections as GlossarySection[]),...(glossary2.sections as GlossarySection[])];

const inference:GlossarySection={section:9,title:"Distribuciones e inferencia estadística",terms:[
{term:"Variable aleatoria",definition:"Función que asigna números a los resultados de un experimento aleatorio.",utility:"permite estudiar fenómenos inciertos con herramientas matemáticas.",error:"confundir variable aleatoria con dato observado.",example:"número de caras al lanzar tres monedas."},
{term:"Distribución binomial",definition:"Distribución de una variable que cuenta éxitos en varios ensayos independientes.",utility:"modeliza situaciones de éxito/fracaso repetidas.",error:"usar binomial cuando la probabilidad cambia en cada ensayo.",example:"número de aprobados en 10 alumnos si todos tienen la misma probabilidad de aprobar."},
{term:"Parámetros de la binomial",definition:"La binomial depende de n, número de ensayos, y p, probabilidad de éxito.",utility:"permite identificar correctamente el modelo.",error:"confundir p con el número de éxitos.",example:"X~B(10,0.3)."},
{term:"Distribución normal",definition:"Distribución continua con forma de campana.",utility:"modeliza muchos fenómenos reales y se usa en inferencia.",error:"no tipificar antes de consultar la tabla.",example:"alturas, notas o errores de medición."},
{term:"Media",definition:"Valor central esperado de una variable.",utility:"resume el centro de una distribución.",error:"confundir media con valor más frecuente.",example:"en una normal N(μ,σ), μ es la media."},
{term:"Desviación típica",definition:"Medida de dispersión respecto a la media.",utility:"indica cuánto se separan los datos del valor central.",error:"interpretar una desviación alta como error necesariamente.",example:"en N(100,15), la desviación típica es 15."},
{term:"Tipificación",definition:"Transformación de una normal cualquiera en una normal estándar.",utility:"permite usar tablas de la normal N(0,1).",error:"poner mal el signo al calcular Z.",example:"Z=(X−μ)/σ."},
{term:"Intervalo de confianza",definition:"Rango de valores que probablemente contiene un parámetro poblacional.",utility:"permite estimar medias o proporciones con margen de error.",error:"decir que el parámetro “se mueve”; el que varía es el intervalo.",example:"estimar la nota media de una población de estudiantes."},
{term:"Nivel de confianza",definition:"Probabilidad asociada al método de construcción del intervalo.",utility:"indica la fiabilidad del procedimiento.",error:"interpretarlo como probabilidad de que un intervalo concreto sea verdadero.",example:"95% de confianza."},
{term:"Contraste de hipótesis",definition:"Procedimiento para decidir si hay evidencia suficiente contra una hipótesis inicial.",utility:"permite tomar decisiones estadísticas.",error:"aceptar automáticamente la hipótesis nula; normalmente se “rechaza” o “no se rechaza”.",example:"comprobar si una media ha cambiado."}
]};

const programming:GlossarySection={section:10,title:"Programación lineal — Matemáticas Aplicadas CCSS",terms:[
{term:"Programación lineal",definition:"Método para optimizar una función con restricciones lineales.",utility:"permite maximizar beneficios o minimizar costes.",error:"resolver sin dibujar correctamente la región factible.",example:"decidir cuántos productos fabricar para obtener el máximo beneficio."},
{term:"Función objetivo",definition:"Función que se quiere maximizar o minimizar.",utility:"expresa matemáticamente el objetivo del problema.",error:"confundir restricciones con función objetivo.",example:"B=30x+20y, beneficio total."},
{term:"Restricción",definition:"Condición que limita los valores posibles de las variables.",utility:"representa recursos, tiempos, cantidades o condiciones del problema.",error:"cambiar el sentido de la desigualdad.",example:"x+y≤100."},
{term:"Región factible",definition:"Zona del plano que cumple todas las restricciones.",utility:"contiene todas las soluciones posibles.",error:"sombrear el lado equivocado de una recta.",example:"la intersección de varios semiplanos."},
{term:"Vértice",definition:"Punto extremo de la región factible.",utility:"en programación lineal, el óptimo suele alcanzarse en un vértice.",error:"probar puntos que no pertenecen a la región factible.",example:"intersección de dos rectas frontera."},
{term:"Recta frontera",definition:"Recta que delimita una restricción.",utility:"ayuda a dibujar la región factible.",error:"olvidar que la desigualdad determina uno de los dos lados.",example:"de x+y≤10 se dibuja primero x+y=10."},
{term:"Solución óptima",definition:"Punto donde la función objetivo alcanza el máximo o el mínimo.",utility:"responde al problema de optimización.",error:"elegir el vértice sin evaluar la función objetivo.",example:"si el beneficio máximo se da en (20,30), esa es la solución óptima."},
{term:"Variables de decisión",definition:"Variables que representan lo que se debe decidir.",utility:"traducen el problema real a lenguaje matemático.",error:"no definir qué significa x y qué significa y.",example:"x: unidades del producto A; y: unidades del producto B."}
]};

const order=[1,2,3,4,5,6,7,8];
export const MATEMATICAS_APLICADAS_GLOSSARY=[
 ...order.map(section=>common.find(item=>item.section===section)).filter((item):item is GlossarySection=>Boolean(item)),
 inference,programming
];
export const MATEMATICAS_APLICADAS_GLOSSARY_COUNT=MATEMATICAS_APLICADAS_GLOSSARY.reduce((n,s)=>n+s.terms.length,0);
