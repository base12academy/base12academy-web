export type PauProblem={id:string;block:string;statement:string;solution:string;rubric:string};
export type PauProfile={code:string;community:string;status:string;format:string;source:string};
export const MATEMATICAS_APLICADAS_PAU_PROBLEMS:PauProblem[]=[
  {
    "id": "MACS-ALG-01",
    "block": "Álgebra y modelización",
    "statement": "Una empresa fabrica dos productos A y B. Cada unidad de A consume 2 horas de montaje y 1 unidad de materia prima; cada unidad de B consume 1 hora y 2 unidades. Hay 14 horas de montaje y 16 unidades de materia prima. El beneficio es de 30 € por A y 20 € por B. Formula el problema de programación lineal, determina la región factible, calcula sus vértices y obtiene el beneficio máximo.",
    "solution": "Sean x e y las unidades de A y B. Restricciones: 2x+y≤14, x+2y≤16, x≥0, y≥0. Vértices: (0,0), (7,0), (4,6), (0,8). B=30x+20y toma 0, 210, 240 y 160. El máximo es 240 € en (4,6).",
    "rubric": "3 puntos: variables/restricciones 0,8; región/vértices 0,8; función objetivo 0,5; evaluación 0,5; interpretación 0,4."
  },
  {
    "id": "MACS-ALG-02",
    "block": "Álgebra y modelización",
    "statement": "Una asociación debe contratar dos tipos de servicios, X e Y. Debe disponer de al menos 8 unidades totales de servicio y, además, cumplir 2x+y≥10. Cada unidad de X cuesta 30 € y cada unidad de Y cuesta 20 €. Formula el problema de programación lineal y determina el coste mínimo.",
    "solution": "Sean x,y≥0. Restricciones: x+y≥8 y 2x+y≥10. Coste C=30x+20y. Los vértices relevantes de la frontera inferior son (0,10), (2,6) y (8,0). Costes: 200, 180 y 240. El mínimo es 180 € en (2,6).",
    "rubric": "3 puntos: variables/restricciones 0,8; región/vértices 0,8; función objetivo 0,5; evaluación 0,5; interpretación 0,4."
  },
  {
    "id": "MACS-ALG-03",
    "block": "Álgebra y modelización",
    "statement": "Dadas A=[[3,1],[1,2]] y B=[[7],[5]], resuelve la ecuación matricial A·X=B mediante la matriz inversa y comprueba la solución.",
    "solution": "det(A)=5≠0. A⁻¹=(1/5)[[2,−1],[−1,3]]. X=A⁻¹B=[[9/5],[8/5]]. Comprobación: A·X=[[7],[5]].",
    "rubric": "3 puntos: determinante/invertibilidad 0,5; inversa 1,0; solución 0,8; comprobación 0,7."
  },
  {
    "id": "MACS-ALG-04",
    "block": "Álgebra y modelización",
    "statement": "Sean A=[[1,2],[0,1]] y B=[[2,1],[3,0]]. Calcula A·B y B·A. Explica por qué los resultados muestran que el producto de matrices no es conmutativo.",
    "solution": "A·B=[[8,1],[3,0]]. B·A=[[2,5],[3,6]]. Como A·B≠B·A, el producto matricial no es conmutativo.",
    "rubric": "3 puntos: primer producto 1,0; segundo producto 1,0; comparación y conclusión 1,0."
  },
  {
    "id": "MACS-ALG-05",
    "block": "Álgebra y modelización",
    "statement": "Estudia para qué valores del parámetro a es invertible la matriz A=[[a,2],[1,a]]. Calcula la inversa cuando a=2.",
    "solution": "det(A)=a²−2. Es invertible si a≠±√2. Para a=2, det=2 y A⁻¹=(1/2)[[2,−2],[−1,2]]=[[1,−1],[-1/2,1]].",
    "rubric": "3 puntos: determinante 0,7; valores excluidos 0,8; inversa 1,0; comprobación 0,5."
  },
  {
    "id": "MACS-ALG-06",
    "block": "Álgebra y modelización",
    "statement": "Resuelve por Gauss el sistema x+y+z=6, 2x−y+z=3, x+2y−z=2 y comprueba la solución.",
    "solution": "La reducción conduce a x=1, y=2, z=3. La sustitución verifica las tres ecuaciones.",
    "rubric": "3 puntos: planteamiento 0,4; eliminación 1,5; solución 0,6; comprobación 0,5."
  },
  {
    "id": "MACS-ALG-07",
    "block": "Álgebra y modelización",
    "statement": "Clasifica y resuelve el sistema x+y+z=3, 2x+2y+2z=6, x−y=1.",
    "solution": "La segunda ecuación depende de la primera. x=y+1 y z=2−2y. Tomando y=t: x=t+1, y=t, z=2−2t. Es compatible indeterminado.",
    "rubric": "3 puntos: dependencia 0,7; clasificación 0,5; parametrización 1,3; comprobación 0,5."
  },
  {
    "id": "MACS-ALG-08",
    "block": "Álgebra y modelización",
    "statement": "Clasifica el sistema x+y=2, 2x+2y=5 utilizando reducción o Rouché-Frobenius.",
    "solution": "La reducción produce una contradicción 0=1. rg(A)=1 y rg(A*)=2; el sistema es incompatible.",
    "rubric": "3 puntos: reducción 1,0; rangos/contradicción 1,0; clasificación 0,6; justificación 0,4."
  },
  {
    "id": "MACS-ALG-09",
    "block": "Álgebra y modelización",
    "statement": "Discute según el parámetro a el sistema ax+y=1, x+ay=1. Indica cuándo tiene solución única y qué ocurre en los valores especiales.",
    "solution": "det=a²−1. Si a≠±1 hay solución única. Si a=1: x+y=1, infinitas soluciones. Si a=−1: aparece contradicción, sistema incompatible.",
    "rubric": "3 puntos: determinante 0,7; caso general 0,7; a=1 0,8; a=−1 0,8."
  },
  {
    "id": "MACS-ALG-10",
    "block": "Álgebra y modelización",
    "statement": "Discute el sistema (a−1)x+y=1, x+(a−1)y=1. Determina los valores del parámetro en los que cambia el tipo de solución.",
    "solution": "det=(a−1)²−1=a(a−2). Si a≠0,2 hay solución única. Si a=0 es incompatible. Si a=2 hay infinitas soluciones.",
    "rubric": "3 puntos: determinante/valores críticos 1,0; caso general 0,5; a=0 0,75; a=2 0,75."
  },
  {
    "id": "MACS-ALG-11",
    "block": "Álgebra y modelización",
    "statement": "Determina el rango de A=[[1,2,3],[2,4,6],[1,1,1]] mediante menores o reducción.",
    "solution": "La segunda fila es el doble de la primera. El menor [[1,2],[1,1]] tiene determinante −1≠0. Hay dos filas independientes; rg(A)=2.",
    "rubric": "3 puntos: dependencia 0,7; menor/reducción 1,0; rango 0,8; justificación 0,5."
  },
  {
    "id": "MACS-ALG-12",
    "block": "Álgebra y modelización",
    "statement": "Calcula el rango de A=[[1,2,1],[2,4,3],[0,0,1]] mediante Gauss.",
    "solution": "R2←R2−2R1 da [0,0,1]. R3 coincide con esa fila y se elimina. Quedan dos pivotes; rg(A)=2.",
    "rubric": "3 puntos: operaciones 1,4; forma escalonada 0,7; rango 0,5; claridad 0,4."
  },
  {
    "id": "MACS-ALG-13",
    "block": "Álgebra y modelización",
    "statement": "Se venden entradas de adulto a 12 € y de estudiante a 8 €. Se venden 250 entradas y se recaudan 2600 €. Determina cuántas entradas de cada tipo se vendieron.",
    "solution": "x+y=250, 12x+8y=2600. Resulta x=150 adultos e y=100 estudiantes.",
    "rubric": "3 puntos: variables 0,4; sistema 0,8; resolución 1,2; interpretación 0,6."
  },
  {
    "id": "MACS-ALG-14",
    "block": "Álgebra y modelización",
    "statement": "Una empresa compra 60 unidades de tres materiales A, B y C. A cuesta 5 €, B 8 € y C 10 €, el gasto es 420 € y compra el doble de A que de C. Plantea y resuelve el sistema.",
    "solution": "x+y+z=60, 5x+8y+10z=420, x=2z. Se obtiene z=15, x=30, y=15.",
    "rubric": "3 puntos: sistema 1,0; eliminación 1,2; solución 0,5; interpretación 0,3."
  },
  {
    "id": "MACS-ALG-15",
    "block": "Álgebra y modelización",
    "statement": "Sea A=[[1,a],[2,2a]]. Determina su rango según el parámetro a.",
    "solution": "La segunda fila es siempre el doble de la primera y la primera nunca es nula. rg(A)=1 para todo a real.",
    "rubric": "3 puntos: dependencia 1,3; excluir rango 0 0,6; conclusión 0,7; justificación 0,4."
  },
  {
    "id": "MACS-ALG-16",
    "block": "Álgebra y modelización",
    "statement": "Resuelve 2X+A=B, donde A=[[1,−1],[2,0]] y B=[[5,3],[0,4]].",
    "solution": "2X=B−A=[[4,4],[-2,4]]. X=[[2,2],[-1,2]].",
    "rubric": "3 puntos: aislar X 0,8; resta 0,9; división 0,8; comprobación 0,5."
  },
  {
    "id": "MACS-ANA-01",
    "block": "Análisis",
    "statement": "La demanda de un servicio se modela por f(x)=−x²+12x+20 en 0≤x≤10. Determina crecimiento, decrecimiento y valor máximo.",
    "solution": "f'(x)=−2x+12. Se anula en x=6. Crece en [0,6], decrece en [6,10] y f(6)=56 es el máximo.",
    "rubric": "3 puntos: derivada 0,6; crítico 0,5; signo 0,7; máximo 1,2."
  },
  {
    "id": "MACS-ANA-02",
    "block": "Análisis",
    "statement": "Estudia la continuidad de f(x)=(x²−9)/(x−3) para x≠3 y f(3)=k. Determina k.",
    "solution": "Para x≠3, f=x+3. El límite en 3 es 6. La continuidad exige k=6.",
    "rubric": "3 puntos: indeterminación 0,5; simplificación 0,8; límite 0,7; continuidad 1,0."
  },
  {
    "id": "MACS-ANA-03",
    "block": "Análisis",
    "statement": "Para f(x)=(2x−1)/(x−3), determina asíntotas vertical y horizontal y justifícalas.",
    "solution": "x=3 es vertical porque el denominador se anula y el numerador no. y=2 es horizontal por el cociente de coeficientes principales.",
    "rubric": "3 puntos: vertical 0,5; límite 0,8; horizontal 0,8; explicación 0,9."
  },
  {
    "id": "MACS-ANA-04",
    "block": "Análisis",
    "statement": "Halla la recta tangente a f(x)=x²−2x+3 en x=1.",
    "solution": "f(1)=2 y f'(1)=0. La tangente es y=2.",
    "rubric": "3 puntos: punto 0,6; derivada 0,7; pendiente 0,5; ecuación 1,2."
  },
  {
    "id": "MACS-ANA-05",
    "block": "Análisis",
    "statement": "Halla tangente y normal a f(x)=x² en x=1.",
    "solution": "Punto (1,1). Pendiente tangente 2: y=2x−1. Pendiente normal −1/2: y=−x/2+3/2.",
    "rubric": "3 puntos: punto 0,4; derivada 0,6; tangente 1,0; normal 1,0."
  },
  {
    "id": "MACS-ANA-06",
    "block": "Análisis",
    "statement": "Estudia crecimiento, decrecimiento y extremos de f(x)=x³−3x²−9x+5.",
    "solution": "f'=3(x−3)(x+1). Crece en (−∞,−1), decrece en (−1,3), crece en (3,∞). Máximo relativo (−1,10), mínimo relativo (3,−22).",
    "rubric": "3 puntos: derivada 0,8; críticos 0,4; signos 0,8; extremos 1,0."
  },
  {
    "id": "MACS-ANA-07",
    "block": "Análisis",
    "statement": "B(x)=−2x²+80x−300 para 0≤x≤30. Determina x que maximiza el beneficio y el máximo.",
    "solution": "B'=−4x+80=0 en x=20. B(20)=500 y es máximo.",
    "rubric": "3 puntos: derivada 0,6; crítico 0,5; máximo 0,7; valor/interpretación 1,2."
  },
  {
    "id": "MACS-ANA-08",
    "block": "Análisis",
    "statement": "Calcula ∫_0^4 (3x+2) dx e interpreta el resultado. Indica si coincide con el área geométrica.",
    "solution": "F=3x²/2+2x. F(4)−F(0)=32. Como la función es positiva, coincide con el área geométrica.",
    "rubric": "3 puntos: primitiva 0,8; Barrow 0,8; resultado 0,5; interpretación 0,9."
  },
  {
    "id": "MACS-ANA-09",
    "block": "Análisis",
    "statement": "Calcula ∫_{−1}^{2} x dx y distingue integral con signo y área geométrica.",
    "solution": "La integral es 3/2. El área geométrica separa en 0: 1/2+2=5/2.",
    "rubric": "3 puntos: integral 1,0; cambio de signo 0,7; área 0,9; interpretación 0,4."
  },
  {
    "id": "MACS-ANA-10",
    "block": "Análisis",
    "statement": "Calcula una primitiva de f(x)=6x²−4x+5 y compruébala derivando.",
    "solution": "F(x)=2x³−2x²+5x+C. Su derivada recupera f.",
    "rubric": "3 puntos: integración 1,8; C 0,4; comprobación 0,8."
  },
  {
    "id": "MACS-ANA-11",
    "block": "Análisis",
    "statement": "Sea f(x)=ax+1 si x<2 y f(x)=x²−1 si x≥2. Determina a para continuidad en x=2.",
    "solution": "Límite izquierdo 2a+1; derecho y valor 3. 2a+1=3, luego a=1.",
    "rubric": "3 puntos: izquierdo 0,8; derecho 0,8; condición 0,6; a 0,8."
  },
  {
    "id": "MACS-ANA-12",
    "block": "Análisis",
    "statement": "Calcula lim_{x→2}(x²−4)/(x−2) justificando el procedimiento.",
    "solution": "0/0. Factorizando se simplifica a x+2 para x≠2. El límite vale 4.",
    "rubric": "3 puntos: indeterminación 0,6; factorizar 0,9; simplificar 0,6; resultado 0,9."
  },
  {
    "id": "MACS-ANA-13",
    "block": "Análisis",
    "statement": "Calcula lim_{x→∞}(5x²−3x+1)/(2x²+x−4) y deduce la asíntota horizontal.",
    "solution": "El límite es 5/2. Asíntota horizontal y=5/2.",
    "rubric": "3 puntos: procedimiento 1,3; resultado 0,7; asíntota 0,6; justificación 0,4."
  },
  {
    "id": "MACS-ANA-14",
    "block": "Análisis",
    "statement": "Para f(x)=(x+1)/(x−1), estudia dominio, cortes, asíntotas y monotonía para realizar un esbozo razonado.",
    "solution": "Dominio R\\{1}; cortes (−1,0) y (0,−1); asíntotas x=1 e y=1; f'=−2/(x−1)²<0, decrece en ambos intervalos de su dominio.",
    "rubric": "3 puntos: dominio/cortes 0,8; asíntotas 0,8; monotonía 0,8; esbozo 0,6."
  },
  {
    "id": "MACS-ANA-15",
    "block": "Análisis",
    "statement": "Un apartado pide máximo en [0,5], otro área con el eje x y otro pendiente en x=2. Indica la herramienta principal y una comprobación básica para cada caso.",
    "solution": "Máximo: derivada, críticos y extremos. Área: integral definida separando cambios de signo. Pendiente: derivada en x=2. Comprobar dominio, signos y pertenencia al intervalo.",
    "rubric": "3 puntos: 1 punto por cada clasificación y comprobación."
  },
  {
    "id": "MACS-ANA-16",
    "block": "Análisis",
    "statement": "Se cerca un rectángulo adosado a un muro con 60 m de valla para los otros tres lados. Determina dimensiones que maximizan el área.",
    "solution": "2x+y=60. A=60x−2x². A'=60−4x=0 → x=15, y=30. Área máxima 450 m².",
    "rubric": "3 puntos: restricción 0,8; función 0,6; derivada 0,8; resultado 0,8."
  },
  {
    "id": "MACS-EST-01",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "El 55% usa transporte público. De quienes lo usan, el 40% llega antes de las 8:00; de quienes no, el 25%. Calcula P(llegar antes) y P(transporte | llegar antes).",
    "solution": "P(A)=0,55·0,40+0,45·0,25=0,3325. P(T|A)=0,22/0,3325≈0,6617.",
    "rubric": "3 puntos: partición 0,5; total 0,9; Bayes 1,0; interpretación 0,6."
  },
  {
    "id": "MACS-EST-02",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Una prueba tiene p=0,25 y se repite independientemente 8 veces. Calcula la probabilidad de exactamente 2 éxitos y justifica el modelo.",
    "solution": "X~B(8,0,25). P(X=2)=C(8,2)·0,25²·0,75^6≈0,3115.",
    "rubric": "3 puntos: condiciones 0,7; parámetros 0,4; fórmula 1,0; cálculo 0,9."
  },
  {
    "id": "MACS-EST-03",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Un dispositivo falla con probabilidad 0,10 en cada uso. En 10 usos independientes, calcula la probabilidad de al menos un fallo.",
    "solution": "1−P(0 fallos)=1−0,9^10≈0,6513.",
    "rubric": "3 puntos: modelo 0,6; complementario 0,8; cálculo 1,0; interpretación 0,6."
  },
  {
    "id": "MACS-EST-04",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "X~N(100,15²). Calcula P(85<X<115) mediante tipificación.",
    "solution": "Los extremos se tipifican como −1 y 1. P(−1<Z<1)≈0,6827.",
    "rubric": "3 puntos: tipificación 1,0; área 0,8; valor 0,8; interpretación 0,4."
  },
  {
    "id": "MACS-EST-05",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Las puntuaciones siguen N(70,8²). Calcula P(X>78).",
    "solution": "z=1. P(Z>1)=1−0,8413≈0,1587.",
    "rubric": "3 puntos: tipificación 1,0; cola 0,8; valor 0,8; interpretación 0,4."
  },
  {
    "id": "MACS-EST-06",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "De 200 personas, 120 usan una aplicación. Entre estas, 90 están satisfechas; entre las 80 que no la usan, 40 están satisfechas. Calcula P(S), P(S|A) y decide independencia.",
    "solution": "P(S)=130/200=0,65. P(S|A)=90/120=0,75. Como difieren, no son independientes.",
    "rubric": "3 puntos: P(S) 0,8; condicionada 0,8; criterio 0,8; conclusión 0,6."
  },
  {
    "id": "MACS-EST-07",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "P(A)=0,55, P(B)=0,40 y P(A∩B)=0,20. Calcula P(A∪B) y P(A^c).",
    "solution": "P(A∪B)=0,75. P(A^c)=0,45.",
    "rubric": "3 puntos: fórmula unión 0,8; cálculo 0,7; complementario 0,8; claridad 0,7."
  },
  {
    "id": "MACS-EST-08",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Una urna tiene 5 bolas rojas y 3 azules. Se extraen dos sin reemplazamiento. Calcula P(dos rojas) y P(al menos una azul).",
    "solution": "P(2R)=5/8·4/7=5/14≈0,3571. P(al menos una azul)=1−5/14=9/14≈0,6429.",
    "rubric": "3 puntos: modelo 0,7; dos rojas 0,9; complementario 0,8; interpretación 0,6."
  },
  {
    "id": "MACS-EST-09",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Una muestra de n=100 tiene media x̄=52 y σ=10 conocida. Construye un IC aproximado del 95% para μ.",
    "solution": "Error estándar=1; margen=1,96. IC95%=(50,04,53,96).",
    "rubric": "3 puntos: fórmula 0,8; error 0,6; margen 0,6; intervalo/interpretación 1,0."
  },
  {
    "id": "MACS-EST-10",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "En una muestra de 400 personas, 220 responden afirmativamente. Construye un IC aproximado del 95% para la proporción.",
    "solution": "p̂=0,55. Error≈0,02487; margen≈0,04875. IC≈(0,5013,0,5987).",
    "rubric": "3 puntos: p̂ 0,5; error 0,8; margen 0,6; intervalo/interpretación 1,1."
  },
  {
    "id": "MACS-EST-11",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Se desea estimar una proporción con error máximo 0,05 y confianza 95%. Usando p=0,5, calcula el tamaño muestral mínimo.",
    "solution": "n≥1,96²·0,25/0,05²=384,16. Se redondea a 385.",
    "rubric": "3 puntos: fórmula 1,0; sustitución 0,8; cálculo 0,6; redondeo 0,6."
  },
  {
    "id": "MACS-EST-12",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Contrasta H0:μ=50 frente a H1:μ>50. n=100, x̄=52, σ=10, α=0,05 y z crítico 1,645.",
    "solution": "Z=(52−50)/(10/10)=2. Como 2>1,645, se rechaza H0; hay evidencia de μ>50.",
    "rubric": "3 puntos: hipótesis 0,5; estadístico 1,0; comparación 0,7; conclusión 0,8."
  },
  {
    "id": "MACS-EST-13",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Contrasta H0:μ=100 frente a H1:μ≠100. n=64, x̄=96, σ=16, α=0,05, críticos ±1,96.",
    "solution": "Z=(96−100)/(16/8)=−2. |Z|>1,96, se rechaza H0; hay evidencia de que μ≠100.",
    "rubric": "3 puntos: hipótesis 0,5; estadístico 1,0; región 0,7; conclusión 0,8."
  },
  {
    "id": "MACS-EST-14",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "El 30% de clientes es del grupo A y el 70% del B. La probabilidad de compra es 0,60 en A y 0,20 en B. Calcula la probabilidad total de compra.",
    "solution": "P(C)=0,30·0,60+0,70·0,20=0,32.",
    "rubric": "3 puntos: partición 0,6; fórmula 0,8; cálculo 1,0; interpretación 0,6."
  },
  {
    "id": "MACS-EST-15",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "X~N(50,5²). Calcula P(X<45) y P(X>55) y explica su relación.",
    "solution": "Ambas tipificaciones dan z=−1 y z=1. Las probabilidades valen ≈0,1587 y son iguales por simetría.",
    "rubric": "3 puntos: tipificaciones 1,4; probabilidades 0,8; simetría 0,8."
  },
  {
    "id": "MACS-EST-16",
    "block": "Probabilidad, estadística e inferencia",
    "statement": "Indica qué procedimiento usarías: a) éxitos en 12 ensayos independientes con p constante; b) P(causa|efecto); c) estimar una proporción; d) decidir si una media supera un valor.",
    "solution": "a) Binomial. b) Bayes. c) Intervalo de confianza para proporción. d) Contraste unilateral para una media.",
    "rubric": "3 puntos: 0,75 por cada clasificación correcta."
  }
];
export const MATEMATICAS_APLICADAS_PAU_PROFILES:PauProfile[]=[
  {
    "code": "AND",
    "community": "Andalucía",
    "status": "2026 verificado; actualizar 2027",
    "format": "Bloques de Álgebra/programación lineal, Análisis y Probabilidad/Estadística con opcionalidad interna.",
    "source": "https://www.juntadeandalucia.es/economiaconocimientoempresasyuniversidad/sguit/"
  },
  {
    "code": "ARA",
    "community": "Aragón",
    "status": "2026 oficial verificado",
    "format": "4 preguntas de 2,5 puntos. Tres primeras obligatorias: Álgebra, Análisis y Estocástico. En la cuarta se responden 2 de 3 cuestiones.",
    "source": "https://academico.unizar.es/pau/modelos-orientativos-de-examen-pau-2026"
  },
  {
    "code": "AST",
    "community": "Principado de Asturias",
    "status": "2026 perfil armonizado provisional",
    "format": "Modelo Base12 provisional: 4 tareas cubriendo Álgebra/modelización, Análisis y Estocástico.",
    "source": "https://www.uniovi.es/estudia/grados/acceso/pau"
  },
  {
    "code": "BAL",
    "community": "Illes Balears",
    "status": "2026 oficial verificado",
    "format": "Sección 1 estocástico: 2 obligatorias =4; Sección 2 Álgebra+Análisis: elegir 1 de 2 =3; Sección 3 otro bloque: elegir 1 de 2 =3.",
    "source": "https://estudis.uib.es/estudis-de-grau/com-hi-pots-accedir/acces/batxiller/"
  },
  {
    "code": "CAN",
    "community": "Canarias",
    "status": "2026 oficial verificado",
    "format": "4 preguntas contextualizadas: 2 obligatorias y 2 con opciones. Pesos orientativos: Estocástico 40%, Análisis 30%, Álgebra 30%.",
    "source": "https://www.gobiernodecanarias.org/educacion/web/bachillerato/pau/"
  },
  {
    "code": "CNT",
    "community": "Cantabria",
    "status": "2026 estructura base 2025/26; revisar 2027",
    "format": "3 apartados obligatorios; cada apartado puede ofrecer una o dos opciones. Referencia 3+4+3 o equivalente.",
    "source": "https://web.unican.es/admision/Paginas/Materia-EBAU.aspx"
  },
  {
    "code": "CLM",
    "community": "Castilla-La Mancha",
    "status": "2026 oficial verificado",
    "format": "4 ejercicios; 2 obligatorios y 2 con dos opciones internas. Cobertura: Álgebra, Análisis y Estadística/Probabilidad.",
    "source": "https://www.uclm.es/perfiles/preuniversitario/acceso/pau"
  },
  {
    "code": "CYL",
    "community": "Castilla y León",
    "status": "2026 perfil oficial disponible; estructura fina provisional",
    "format": "Modelo único con Álgebra/modelización, Análisis y Estocástico; justificación explícita de operaciones no triviales.",
    "source": "https://www.educa.jcyl.es/universidad/es/pau"
  },
  {
    "code": "CAT",
    "community": "Cataluña",
    "status": "2026 oficial verificado",
    "format": "4 ejercicios de 2,5; los tres primeros cubren todos los bloques; ejercicio 4 transversal con alternativas A/B.",
    "source": "https://universitats.gencat.cat/ca/proves-acces-PAU-PAP/"
  },
  {
    "code": "CVA",
    "community": "Comunitat Valenciana",
    "status": "2026 perfil oficial; estructura fina provisional",
    "format": "Modelo único con Álgebra, Análisis y Estocástico, opcionalidad interna y enfoque competencial.",
    "source": "https://www.uv.es/pau/es"
  },
  {
    "code": "EXT",
    "community": "Extremadura",
    "status": "TRANSICIÓN: 2026-27 exige nueva comprobación",
    "format": "Perfil Base12 provisional: 4 tareas de 2–3 puntos, bloques entre 30–40%, con al menos 40% obligatorio.",
    "source": "https://www.unex.es/organizacion/servicios-universitarios/servicios/alumnado/funciones/selectividad"
  },
  {
    "code": "GAL",
    "community": "Galicia",
    "status": "2026 oficial verificado parcialmente",
    "format": "4 preguntas; Q1 y Q2 sin opcionalidad; Q3 y Q4 con elección interna. Q1 Estadística/Probabilidad 2 puntos.",
    "source": "https://ciug.gal/pau"
  },
  {
    "code": "MAD",
    "community": "Comunidad de Madrid",
    "status": "2026 oficial verificado MAT2; MACS según modelo 2026",
    "format": "Bloques de Álgebra, Análisis y Probabilidad/Estadística, con preguntas obligatorias y optativas internas.",
    "source": "https://www.uam.es/uam/estudios/modelos-examen-2026"
  },
  {
    "code": "MUR",
    "community": "Región de Murcia",
    "status": "2026 estructura pendiente de fuente oficial directa",
    "format": "Perfil Base12 usado: Álgebra, Cálculo diferencial/integral y Probabilidad/Estadística con elección interna.",
    "source": "https://www.um.es/web/estudios/contenido/acceso/pau"
  },
  {
    "code": "NAV",
    "community": "Navarra",
    "status": "2026 perfil armonizado provisional",
    "format": "4 tareas Base12 cubriendo Álgebra/modelización, Análisis y Estocástico con opcionalidad interna.",
    "source": "https://www.unavarra.es/estudios/acceso-y-admision/pau"
  },
  {
    "code": "PVA",
    "community": "País Vasco",
    "status": "2026 examen oficial disponible",
    "format": "4 problemas. P1=2, P2=3, P3=3 con elección, P4=2 con elección. Cobertura: programación lineal, probabilidad/normal, análisis y matrices/sistemas.",
    "source": "https://www.ehu.eus/es/web/unibertsitaterako-sarbidea/pau-2026"
  },
  {
    "code": "RIO",
    "community": "La Rioja",
    "status": "2026 oficial: misma estructura que 2025; detalle por materia revisable",
    "format": "Modelo único por bloques con opcionalidad interna; Base12 usa 4 tareas que cubren Álgebra/modelización, Análisis y Estocástico.",
    "source": "https://www.unirioja.es/administracion-y-servicios/oficina-de-estudiantes/pau/examenes-y-criterios/"
  }
];
export function getPauProblems(block?:string){return block?MATEMATICAS_APLICADAS_PAU_PROBLEMS.filter(p=>p.block===block):MATEMATICAS_APLICADAS_PAU_PROBLEMS;}
