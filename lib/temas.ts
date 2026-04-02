export type BloqueImagen = {
  titulo: string;
  imagen?: string;
  descripcion?: string;
  explicacion?: string;
};

export type BloqueTexto = {
  titulo: string;
  descripcion: string;
  texto: string;
  explicacion?: string;
};

export type Tema = {
  slug: string;
  titulo: string;
  descripcion: string;
  indice: string;
  contenido: string;
  estado: "bloqueado" | "en-progreso" | "completado";
  videoUrl: string;
  comunidadClave?: string[];
};
export const IMAGENES_BLOQUES: Record<string, BloqueImagen[]> = {
"bloque-1": [
 {
  titulo: "Dama de Elche",
  descripcion: "Escultura íbera en piedra caliza de los siglos V-IV a.C.",
  imagen: "/images/dama-elche.jpg",
  explicacion: `La Dama de Elche (Ficha de Análisis)

1. Definición y autoría
Es una escultura en bulto redondo tallada en piedra caliza que conserva restos de policromía. Representa el busto de una mujer con compleja ornamentación.

2. Ubicación y hallazgo
Fue hallada en La Alcudia (Elche, Alicante) en 1897. Actualmente se encuentra en el Museo Arqueológico Nacional.

3. Contexto histórico
Pertenece a la cultura ibérica (siglos V-IV a.C.), influida por fenicios y griegos.

4. Función
Probablemente urna cineraria o representación religiosa.

5. Significado
Es uno de los principales símbolos de la cultura ibérica en la Península.`,
},
  {
    titulo: "Arte rupestre de Altamira",
    descripcion: "Pinturas paleolíticas de bisontes en la cueva de Altamira (Cantabria).",
    imagen: "/images/altamira.jpg",
    explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura rupestre (paredes de cuevas).
•	Cronología: Pertenecen al periodo Paleolítico Superior, específicamente a la cultura Magdaleniense (aprox. hace 15.000 - 12.000 años).
•	Autor: Grupos de cazadores-recolectores (Homo sapiens). El artista es anónimo, aunque se observa una gran especialización técnica que sugiere la existencia de "maestros" dentro de la tribu.
•	Estilo: Escuela Franco-Cantábrica. Se caracteriza por el realismo, la policromía (uso de varios colores) y la representación de animales aislados.
2. Ubicación
Se encuentra en el municipio de Santillana del Mar (Cantabria). La cueva fue descubierta de forma científica por Marcelino Sanz de Sautuola en 1879, aunque inicialmente su autenticidad fue cuestionada por la comunidad científica europea debido a su asombrosa calidad.
3. Contexto histórico
•	El Paleolítico Superior: El ser humano vive en sociedades nómadas organizadas en bandas o clanes. La economía es depredadora (caza, pesca y recolección).
•	El medio físico: Coincide con la última glaciación (Würm), lo que obligaba a los grupos humanos a refugiarse en cuevas y abrigos naturales para protegerse del frío intenso.
•	Capacidad simbólica: El Homo sapiens ya posee un lenguaje complejo y un pensamiento abstracto que le permite crear mitos, ritos funerarios y representaciones artísticas.
4. Qué representa y contenido (Técnica y Simbolismo)
La estancia más famosa es el Gran Techo de los Policromos:
•	Temática: Aparecen principalmente bisontes, pero también ciervas, caballos y jabalíes. No forman escenas narrativas (no hay suelo ni paisaje), sino que los animales parecen flotar en la roca.
•	Técnica:
o	Policromía: Uso de pigmentos naturales como el ocre (rojo) y el dióxido de manganeso (negro), aglutinados con grasa animal o agua.
o	Tridimensionalidad: Aprovechaban los relieves y protuberancias naturales de la roca para dar volumen a los cuerpos de los animales, logrando un efecto casi escultórico.
o	Detallismo: Se dibujan los contornos con negro y se rellenan con degradados de rojo, marcando detalles como el pelaje o las pezuñas.
•	Interpretación: Existen varias teorías. La más aceptada tradicionalmente es la de la "magia propiciatoria" (pintar para facilitar la caza). Otras teorías sugieren que la cueva era un santuario donde se realizaban ritos de fertilidad o se representaban tótems de diferentes clanes.
5. Significado histórico
Altamira es conocida como la "Capilla Sixtina del Arte Cuaternario". Representa el primer gran hito de la historia del arte en España. A diferencia del Arte Levantino (más tardío, monocromo y con figuras humanas en escenas de caza), el arte de Altamira es puramente naturalista y animalista. Su conservación excepcional la ha convertido en Patrimonio de la Humanidad por la UNESCO, siendo un testimonio único de la capacidad intelectual y creativa de nuestros antepasados más remotos.`,  
},
],
  "bloque-2": [
    { titulo: "Acueducto de Segovia", 
      descripcion: "Obra de ingeniería civil romana del siglo II d.C.", 
      imagen: "/images/dama-elche.jpg",
      explicacion: `1. Definición, autoría y técnica
•	Tipo de obra: Arquitectura civil e ingeniería hidráulica. Es un puente-acueducto destinado a transportar agua desde la sierra hasta la ciudad de Segovia.
•	Autor: Anónimo. Es una obra del Estado romano, ejecutada por arquitectos y operarios militares o civiles bajo mando imperial.
•	Cronología: Su datación ha sido debatida, pero las investigaciones más recientes lo sitúan en la época de los Flavios (segunda mitad del siglo I d.C.) o principios del reinado de Trajano (siglo II d.C.).
•	Técnica: Está construido con sillares de granito asentados en seco, es decir, sin argamasa ni cemento (opus quadratum). El equilibrio se mantiene mediante un preciso cálculo de fuerzas y el propio peso de las piedras.
2. Ubicación
Se encuentra en la ciudad de Segovia (Castilla y León). El tramo más famoso y monumental es el que atraviesa la Plaza del Azoguejo, donde alcanza su máxima altura (unos 28 metros), pero la conducción completa tiene un recorrido de unos 15 kilómetros desde el manantial de la Fuenfría.
3. Contexto histórico
La construcción del acueducto se enmarca en el periodo de esplendor del Imperio Romano (el Alto Imperio).
•	Romanización: El acueducto no es solo una obra funcional, sino un símbolo de la presencia de Roma en la Meseta Norte. Las ciudades romanas en Hispania necesitaban abastecimiento de agua para sus termas, fuentes y consumos domésticos, lo cual era signo de civilización y estatus.
•	Urbanismo: Refleja la importancia de Segovia como núcleo urbano dentro de la provincia de la Tarraconense. Roma invertía en estas infraestructuras para integrar a las poblaciones locales en el modo de vida romano.
4. Qué representa y contenido (Análisis formal)
•	Estructura: El tramo monumental consta de una doble arquería de medio punto. La fila inferior de arcos sostiene la superior, lo que permite ganar altura manteniendo la ligereza visual y la resistencia al viento.
•	Funcionalidad: En la parte superior se encuentra el specus o canal por el que circulaba el agua con una pendiente muy ligera y constante (inferior al 1%) para que el flujo fuera continuo pero no erosivo.
•	Estética del poder: Su escala monumental buscaba impresionar. El uso del arco de medio punto es la firma arquitectónica de Roma, permitiendo salvar grandes desniveles con una eficiencia que no se superaría hasta muchos siglos después.
5. Significado histórico
Representa la pervivencia del legado romano en España. Ha estado en uso práctico hasta bien entrado el siglo XX, lo que demuestra la perfección de su diseño. En 1985 fue declarado Patrimonio de la Humanidad por la UNESCO. Para la Historia de España, es el mejor ejemplo de cómo la ingeniería romana logró la cohesión del territorio y la implantación de una cultura común en toda la Península.`,

  },
    { titulo: "Teatro Romano de Mérida", 
      descripcion: "Construcción para espectáculos del siglo I a.C.", 
      imagen: "teatro-romano-merida.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Arquitectura civil destinada al espectáculo (teatro).
•	Autor: Anónimo (arquitectos y constructores del Estado). El promotor fue Marco Vipsanio Agripa, yerno del emperador Augusto.
•	Cronología: Fue inaugurado entre los años 16 y 15 a. C. Posteriormente, sufrió remodelaciones importantes a finales del siglo I (época de Trajano) y en el siglo II (época de Adriano), que es cuando se levantó el actual frente de escena.
•	Técnica: Utiliza el opus caementicium (hormigón romano) para la estructura interna y el opus quadratum (sillares de granito) revestidos de mármol para las zonas nobles y el frente escénico.
2. Ubicación
Se encuentra en Mérida (Badajoz), Extremadura. En época romana, esta ciudad era la colonia Augusta Emerita, capital de la provincia de la Lusitania, fundada por orden de Augusto para los soldados licenciados (eméritos) de las guerras cántabras.
3. Contexto histórico
•	El esplendor de la Pax Augusta: Su construcción coincide con el periodo de consolidación del Imperio tras las guerras civiles. Roma utiliza el teatro no solo como diversión, sino como una herramienta de romanización y cohesión social.
•	Propaganda Imperial: El teatro era el lugar donde el pueblo veía representadas las virtudes romanas y el poder del emperador a través de las estatuas y la magnificencia del edificio.
•	Urbanismo de prestigio: Mérida fue diseñada como una "pequeña Roma" en el oeste peninsular, dotada de todos los servicios (puentes, acueductos, circo, anfiteatro) para demostrar la superioridad de la civilización romana.
4. Qué representa y contenido (Análisis formal)
El edificio sigue fielmente los cánones de Vitruvio para los teatros romanos:
•	La Cavea (graderío): Con capacidad para 6.000 espectadores, dividida en tres sectores según el estatus social (ima, media y summa cavea), reflejando la jerarquía de la sociedad romana.
•	La Orchestra: Espacio semicircular entre el graderío y la escena destinado a las autoridades.
•	El Frente de Escena (Scaenae Frons): Es la parte más espectacular. Consta de dos cuerpos de columnas de orden corintio, entablamentos de mármol y una serie de estatuas que representan a divinidades y emperadores divinizados.
•	Uso: En él se representaban tragedias y comedias. A diferencia de los teatros griegos, los romanos no necesitaban una colina para apoyar el graderío (aunque en Mérida se aprovechó el cerro de San Albín), ya que dominaban la técnica de los arcos y bóvedas para crear estructuras exentas.
5. Significado histórico
Representa la supervivencia de la cultura clásica en España. Tras siglos de abandono y estar enterrado (solo asomaban las partes superiores del graderío, llamadas "Las Siete Sillas"), fue excavado a partir de 1910. Hoy es el símbolo de la arqueología española y sigue cumpliendo su función original como sede del Festival Internacional de Teatro Clásico de Mérida.`, 
    }
  ],
  "bloque-3": [
    { titulo: "Planta de la Mezquita de Córdoba", 
      descripcion: "Diagrama arquitectónico del edificio Omeya (siglos VIII-X)", 
      imagen: "mezquita-cordoba.jpg",
      explicacion: `1. Definición y tipología
•	Tipo de obra: Arquitectura religiosa islámica (Mezquita aljama o principal).
•	Autor: Es una obra colectiva impulsada por diferentes emires y califas de la dinastía Omeya.
•	Cronología: Siglos VIII al X (etapa islámica) y siglo XVI (catedral cristiana).
•	Planta: De tipo basilical, orientada originalmente hacia el sur (no hacia La Meca, siguiendo la tradición omeya de Damasco).
2. Ubicación
Se encuentra en la ciudad de Córdoba (Andalucía), a orillas del río Guadalquivir. En su época de esplendor, fue el centro espiritual y político de la capital del Califato de Córdoba, la ciudad más avanzada de Occidente.
3. Contexto histórico y evolución (Las etapas en la planta)
La planta es el resultado de sucesivas ampliaciones que reflejan el crecimiento demográfico y el poder político de al-Ándalus:
1.	Abderramán I (785): Construye la mezquita fundacional sobre la antigua iglesia visigoda de San Vicente. Consta de 11 naves perpendiculares al muro de la qibla.
2.	Abderramán II (833-855): Ante el aumento de la población, derriba el muro de la qibla y alarga las naves hacia el sur.
3.	Al-Hakam II (961-976): Es la ampliación más rica y artística. Vuelve a alargar las naves y construye el Maqsura y el Mihrab con mosaicos bizantinos. Es el momento de máximo esplendor del Califato.
4.	Almanzor (987): Al no poder ampliar más hacia el sur por la cercanía del río, realiza una gran ampliación lateral hacia el este (8 naves más). Es la más extensa pero de menor calidad arquitectónica.
5.	Catedral Cristiana (s. XVI): Tras la conquista cristiana, se inserta una planta de cruz latina (Crucero) en el corazón del bosque de columnas, rompiendo la estructura horizontal islámica.
4. Qué representa y contenido (Elementos de la planta)
La planta se divide en dos áreas principales características de la mezquita árabe:
•	Sahn (Patio de los Naranjos): Espacio abierto donde se ubica el alminar (torre de llamada a la oración) y la fuente de las abluciones (sabil).
•	Haram (Sala de oración): Espacio cubierto formado por un "bosque de columnas". Utiliza materiales reutilizados (aprovechamiento de fustes y capiteles romanos y visigodos).
•	Qibla y Mihrab: El muro que cierra la sala y el nicho sagrado que indica la dirección de la oración.
•	Sistemas de soporte: Para ganar altura, se utilizó el ingenioso sistema de doble arco (inferior de herradura y superior de medio punto), inspirado en el Acueducto de los Milagros de Mérida.
5. Significado histórico
Representa el apogeo del arte emiral y califal y es el símbolo del poder de la dinastía Omeya en la Península. Es una obra única por su carácter "acumulativo", donde se funden la herencia romana, visigoda e islámica. Su transformación en catedral tras 1236 simboliza el triunfo de la cristiandad sobre el islam en la Reconquista, aunque manteniendo la estructura original, lo que la convierte en un monumento de valor universal (Patrimonio de la Humanidad por la UNESCO).`,
},
    { titulo: "Mapa de la expansión de los reinos cristianos", 
      descripcion: "Cartografía de la Península Ibérica entre los siglos VIII y XV.", 
      imagen: "conquista-cristianas.jpg",
      explicacion: `1. Definición y tipología
•	Tipo de obra: Mapa histórico-político de carácter evolutivo.
•	Contenido: Representa las distintas etapas de avance de los núcleos cristianos del norte hacia el sur peninsular, divididas generalmente por siglos o hitos militares.
•	Autor: Cartografía histórica moderna (reconstrucción científica basada en crónicas y tratados de límites).
2. Ubicación y Ámbito Geográfico
El mapa abarca la totalidad de la Península Ibérica. Se observa una progresión que nace en la cordillera Cantábrica y los Pirineos, avanzando hacia los valles de los grandes ríos (Duero, Tajo, Guadiana y Guadalquivir) hasta culminar en el extremo sur (Granada).
3. Contexto Histórico: Las Etapas de la Expansión
El mapa suele subdividirse en cuatro grandes fases que definen la Baja y Alta Edad Media en España:
1.	Siglos VIII-X (Formación): Creación de los núcleos de resistencia (Reino de Asturias y Marca Hispánica). El avance llega hasta la línea del Duero. Es una etapa de ocupación de tierras despobladas (presura).
2.	Siglos XI-XII (Consolidación): Tras la disolución del Califato en los Reinos de Taifas, los cristianos avanzan rápidamente. Hito clave: Conquista de Toledo (1085) por Alfonso VI, que sitúa la frontera en el Tajo. Aragón llega al Ebro (Zaragoza, 1118).
3.	Siglo XIII (La gran expansión): Tras la victoria en la batalla de Las Navas de Tolosa (1212), el poder almohade se hunde. Fernando III el Santo conquista el valle del Guadalquivir (Córdoba y Sevilla) y Jaime I el Conquistador toma Baleares y Valencia. Portugal finaliza su expansión en el Algarve.
4.	Siglos XIV-XV (Epílogo): El avance se ralentiza por crisis internas y la Peste Negra. Solo sobrevive el Reino Nazarí de Granada como vasallo de Castilla, hasta su caída en 1492 ante los Reyes Católicos.
4. Qué representa y contenido (Conceptos clave)
•	La Frontera: El mapa muestra una frontera móvil que no es solo militar, sino también un espacio de intercambio cultural y económico.
•	Modelos de Repoblación: Según la zona del mapa, se explican distintos modelos:
•	Norte: Pequeña propiedad campesina (presura).
•	Entre Duero y Tajo: Concejos con Fueros y Cartas Puebla.
•	Sur (La Mancha, Andalucía, Levante): Grandes latifundios entregados a las Órdenes Militares y a la nobleza (Repartimientos).
•	La Estructura Política: Muestra la evolución de cinco entidades: el Reino de Portugal, la Corona de Castilla, el Reino de Navarra, la Corona de Aragón y el territorio musulmán (Al-Ándalus).
5. Significado Histórico
Representa el proceso fundacional de la identidad política de España. La Reconquista no fue una guerra continua de ocho siglos, sino un proceso intermitente de conquista y repoblación que configuró la estructura agraria (latifundismo en el sur, minifundismo en el norte) y la diversidad lingüística y jurídica de la península. Es el preludio de la unión dinástica de los Reyes Católicos y la formación del Estado Moderno.`,

    }
  ],
  "bloque-4": [
    { titulo: "Rendición de Granada", 
      descripcion: "Óleo de Francisco Padilla sobre lienzo que representa la entrega de las llaves por Boabdil en 1492", 
      imagen: "rendicion-granada.jpg",
      explicacion: ` I. Identificación y Descripción de la Fuente
•	Tipo de fuente: Fuente secundaria (fuente histórico-artística). Se trata de una pintura de historia, un género pictórico fundamental del siglo XIX dedicado a recrear grandes eventos del pasado nacional con fines pedagógicos y políticos.
•	Título: "La rendición de Granada".
•	Autor: Francisco Pradilla Ortiz (1848-1921), uno de los máximos exponentes de la pintura de historia académica española.
•	Cronología de creación: Realizado entre 1878 y 1882. Es importante notar que la pintura se crea casi cuatro siglos después del evento que representa.
•	Ubicación original y actual: Fue un encargo del Senado de España. Actualmente se conserva y exhibe en el Palacio del Senado en Madrid, específicamente en la Sala de Pasos Perdidos.
•	Técnica: Óleo sobre lienzo de gran formato.
II. Contexto Histórico del Evento Representado
La obra representa un momento bisagra de la historia de España: la Capitulación de Granada y la subsiguiente entrega de la ciudad el 2 de enero de 1492. Este acto marca el final de la Guerra de Granada (1482-1492) y, por extensión, el fin de la Reconquista, el proceso de ocho siglos de avance de los reinos cristianos sobre el territorio andalusí.
•	Los protagonistas: A la derecha, montados sobre caballos blancos ricamente enjaezados, se encuentran los Reyes Católicos, Isabel I de Castilla y Fernando II de Aragón. A la izquierda, de pie y sosteniendo las riendas de un caballo negro, está Boabdil (Muhammad XII), el último sultán de la dinastía Nazarí de Granada.
•	El acto político: La pintura ilustra el momento simbólico en el que Boabdil, de forma deprimida pero noble, se aproxima a los reyes victoriosos para entregar las llaves de la ciudad de Granada y de la fortaleza de la Alhambra. Este acto oficializa la incorporación de Granada a la Corona de Castilla y el fin de la presencia política islámica soberana en la Península Ibérica.
•	Unificación y expansión: Este evento consolida el poder de la Monarquía Hispánica en construcción y es el preludio inmediato de la expansión atlántica (viaje de Colón en el mismo año 1492) y la política de uniformización religiosa (expulsión de los judíos también en 1492, y posterior decreto de conversión forzosa de los mudéjares granadinos).
III. Análisis Formal y Representación
Pradilla, fiel al academicismo de su tiempo, recrea la escena con un realismo detallado y una composición dramática cargada de simbolismo:
•	Composición dual: El cuadro se divide claramente en dos grupos. El grupo cristiano (victorioso) a la derecha, luminoso y ordenado, donde destaca la figura de la Reina Isabel con un manto blanco y corona (símbolo de pureza y triunfo real), y el Rey Fernando a su lado. El grupo granadino (vencido) a la izquierda, más oscuro y deprimido, con Boabdil en primer plano, mostrando su sumisión política mientras se despide de su ciudad.
•	Simbología del color: El blanco domina el lado cristiano (triunfo, fe); el oscuro domina a Boabdil (duelo, pérdida).
•	Detalles arquitectónicos y paisajísticos: Al fondo, en la colina, Pradilla representa la Alhambra con gran fidelidad, marcando el lugar exacto del evento (cerca de la Puerta de la Justicia o la Puerta de los Siete Suelos, según la tradición).
•	El gesto clave: Boabdil ofrece la llave. Fernando II extiende la mano para recibirla. Es la transición de poder. Pradilla evitó representar a Boabdil de rodillas o humillado, como aparecía en grabados anteriores, dotando al personaje de una nobleza que resalta la magnitud de la victoria cristiana.
IV. Significado Histórico y Político de la Pintura (Siglo XIX)
Es crucial analizar por qué esta obra se pintó en la España del siglo XIX (durante la Restauración borbónica):
•	Propaganda nacionalista: En el siglo XIX, los estados-nación europeos utilizaron la pintura de historia para construir una narrativa identitaria. El tema de la Reconquista y los Reyes Católicos era ideal para la España liberal-conservadora: simbolizaba la unidad nacional lograda mediante el esfuerzo de las coronas históricas y la fe católica.
•	Construcción del mito fundacional: Los Reyes Católicos se convirtieron en el modelo del "buen gobernante" que logró la esquiva unidad territorial, política y religiosa. La pintura de Pradilla monumentaliza este hito como el verdadero origen de la España moderna.
•	Consolidación de la Restauración: El encargo por parte del Senado, institución clave del nuevo régimen de Cánovas del Castillo, buscaba legitimar la nueva estabilidad política vinculándola a la época más gloriosa de la historia nacional.
V. Conclusión
En resumen, "La rendición de Granada" es mucho más que una escena histórica. Es un potente documento que nos habla tanto del evento del 1492 como de la ideología política de 1882. Representa visualmente el final de una era y el inicio de otra, y se convirtió en una de las imágenes más reconocibles y reproducidas en los manuales escolares de historia de España del siglo XX, configurando de forma duradera el imaginario nacional sobre la unión de los reinos peninsulares.`, 
    },
    { titulo: "Reyes Católicos", 
      descripcion: "Iconografía de Isabel I y Fernando II", 
      imagen: "reyes-catolicos.jpg",
      explicacion: `1. Identificación y autoría
•	Tipo de obra: Pintura al óleo sobre tabla (díptico o retrato doble).
•	Autor: Atribuido habitualmente a un autor Anónimo de la escuela hispano-flamenca. En ocasiones se ha relacionado con el círculo de Fernando del Rincón o maestros de la corte como Michel Sittow.
•	Cronología: Finales del siglo XV (hacia 1490).
•	Estilo: Realismo flamenco. Se caracteriza por el detallismo en las texturas (telas, joyas), el uso de la luz y una representación psicológica sobria de los personajes.
•	Ubicación: Existen diversas versiones y copias; la más destacada se encuentra en las Colecciones Reales del Palacio Real de Madrid (Patrimonio Nacional), aunque hay versiones similares en el Museo del Prado.
2. Contexto histórico
•	Unión Dinástica (1469-1479): El matrimonio entre Isabel I de Castilla y Fernando II de Aragón supuso la unión de las dos coronas más importantes de la Península, aunque cada reino mantuvo sus propias leyes, instituciones y monedas.
•	El Estado Moderno: Los reyes pusieron fin a la anarquía feudal, sometiendo a la nobleza y centralizando el poder a través de instituciones como la Santa Hermandad, los Corregidores y los Consejos.
•	La Unidad Religiosa: Su reinado se define por la búsqueda de la uniformidad espiritual, plasmada en la creación de la Inquisición (1478), la expulsión de los judíos (1492) y la conquista del Reino Nazarí de Granada.
•	1492: Este retrato coincide con el año clave de la historia de España: el fin de la Reconquista, el Descubrimiento de América y la publicación de la primera gramática castellana de Nebrija.
3. Qué representa y contenido (Simbología)
La imagen representa el concepto de la monarquía dual y la legitimación del poder:
•	Dualidad: Al aparecer ambos en el mismo plano o en tablas gemelas, se refuerza el lema "Tanto monta, monta tanto". Aunque Isabel era reina de Castilla y Fernando de Aragón, ambos actuaban conjuntamente en la política exterior y la justicia.
•	Soberanía: Los personajes aparecen con vestimentas ricas pero sobrias, alejadas de la ostentación excesiva, transmitiendo una imagen de autoridad, piedad y orden.
•	Fisonomía: Isabel suele ser representada con una mirada serena y piadosa, mientras que Fernando muestra un perfil más político y pragmático, reflejando el ideal de príncipe renacentista que más tarde inspiraría a Maquiavelo.
4. Significado histórico
Este retrato simboliza la transición de la Edad Media a la Edad Moderna. Representa la superación de la fragmentación medieval y la creación de una monarquía autoritaria que convirtió a España en la primera potencia europea. Su política exterior, basada en alianzas matrimoniales y la expansión atlántica y mediterránea, sentó las bases del futuro Imperio Español de los Austrias.`,

    },
    { titulo: "Mapa del Imperio de Carlos I", 
      descripcion: "Posesiones de los Habsburgo en el siglo XVI", 
      imagen: "carlos_v_imperio.jpg",
      explicacion: `1. Identificación y Descripción de la Fuente
•	Tipo de fuente: Fuente secundaria (reconstrucción cartográfica posterior) de carácter historico-político. El autor es anónimo, probablemente diseñado para fines didácticos o de referencia en libros de texto modernos (como Akal o Vicens Vives), pero su estilo simula la estética de la cartografía antigua con elementos adicionales como retratos y heráldica de la época.
•	Contenido: Se trata de un planisferio que representa la extensión global de los dominios territoriales acumulados por Carlos I de España (y V de Alemania) durante su reinado en la primera mitad del siglo XVI. El mapa utiliza códigos de color y una leyenda detallada para diferenciar el origen de cada territorio según las múltiples herencias recibidas por el monarca.
•	Ámbito Geográfico: Abarca Europa y el norte de África en el hemisferio izquierdo, y el continente americano ("Indias Occidentales") y partes de Asia (Filipinas) en el derecho.
2. Representación y Análisis de los Datos (Qué representa)
El mapa visualiza el concepto de "Monarquía Universal" o "Imperio de los Habsburgo". Siguiendo la leyenda, podemos desglosar el poder de Carlos I:
•	Herencia Hispánica (Castellana y Aragonesa) (Amarillo): Representa la base principal del poder del monarca. Incluye:
•	Península Ibérica: Los reinos de Castilla y la Corona de Aragón (Cataluña, Valencia, Mallorca).
•	Italia Meridional: Nápoles, Sicilia y Cerdeña (herencia aragonesa).
•	Norte de África: Plazas estratégicas.
•	América: Vastísimos territorios organizados en los virreinatos de Nueva España (centro y norte de América) y Perú (América del Sur), coloreados en amarillo por ser posesión directa de la Corona de Castilla.
•	Asia: Las islas Filipinas (fundamental para la conexión transpacífica indicada por los barcos).
•	Herencia Habsburgo/Imperial (Rojo): Incluye los territorios patrimoniales de los Habsburgo en Europa Central (Austria, Bohemia) y marca con una línea roja la frontera del Sacro Imperio Romano Germánico, del cual Carlos fue elegido Emperador en 1519.
•	Herencia Borgoñona (Azul): Los Países Bajos (Néerlande), Luxemburgo y el Franco Condado (Condado de Borgoña).
•	Adquisiciones Políticas (Verde): El Ducado de Milán ("Milanesado") en el norte de Italia, clave para conectar los dominios borgoñones con los napolitanos.
Los retratos de Carlos I en las esquinas, la doble águila imperial con el escudo de armas y los galeones ilustran la dimensión universal y marítima de esta hegemonía.
3. Contexto Histórico
El mapa se sitúa cronológicamente en el periodo que va desde la llegada de Carlos I a España en 1516 hasta su abdicación en Flandes en 1556. Este periodo marca el cénit de la hegemonía hispánica en Europa y el mundo.
El contexto se define por tres ejes fundamentales que explican la configuración del mapa:
1.	Idea Imperial: Carlos I buscó la "Universitas Christiana", una Europa unida bajo el catolicismo y su liderazgo imperial para luchar contra el infiel (los turcos otomanos, amenaza en el este y norte de África).
2.	Conflictos Geopolíticos: La geografía de sus dominios generó una "lucha en tres frentes":
•	Francia: Rodeada por las tierras azules y rojas de Carlos, luchó constantemente en Italia (ver Milanesado).
•	Imperio Otomano: Presión constante en Viena y el Mediterráneo.
•	Reforma Protestante: Conflicto interno dentro del Sacro Imperio (zonas rojas) que rompió la unidad religiosa perseguida por Carlos.
3.	Financiación: La inmensa riqueza generada en las zonas amarillas de América (coloreada en el mapa por el control hispánico de las minas de plata) fue esencial para sostener los enormes gastos militares requeridos para defender el resto de las herencias patrimoniales e imperiales en Europa. El mapa muestra las rutas marítimas transatlánticas y transpacíficas que hacían posible este flujo de riqueza.
4. Significado Histórico y Conclusión
Este mapa representa la visualización del primer gran imperio global de la historia moderna. Ilustra cómo una serie de alianzas matrimoniales previas (entre los Reyes Católicos y los Habsburgo-Borgoña) concentraron un poder sin precedentes en una sola persona.
Históricamente, el mapa simboliza el pico del poder político y militar de la Monarquía Hispánica en el siglo XVI, pero también revela su vulnerabilidad intrínseca: la dispersión geográfica y la constante necesidad de recursos para defender fronteras hostiles, lo que a la larga provocaría el agotamiento financiero de la Corona y la división definitiva del Imperio entre la rama española y la austriaca tras la abdicación de Carlos V.`,

    },
    { titulo: "Monasterio de El Escorial", 
      descripcion: "Complejo arquitectónico de Juan de Herrera" ,
      imagen: "monasterio_el_escorial.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Complejo arquitectónico que incluye palacio real, basílica, monasterio, biblioteca, colegio y panteón.
•	Autores: El proyecto fue iniciado por Juan Bautista de Toledo (formado en Italia) en 1563 y, tras su muerte, finalizado por Juan de Herrera en 1584.
•	Estilo: Renacimiento (Manierismo). Dio lugar al llamado estilo herreriano, caracterizado por la desnudez decorativa, el predominio de la línea recta, la simetría matemática y la monumentalidad.
2. Ubicación
Se encuentra en la localidad de San Lorenzo de El Escorial, en la Sierra de Guadarrama (Madrid). Su ubicación fue elegida por Felipe II por su cercanía a la nueva capital (Madrid, establecida en 1561) y por ser un lugar de retiro espiritual y cinegético.
3. Contexto histórico
•	El reinado de Felipe II (1556-1598): En este periodo, España era la mayor potencia mundial ("el imperio donde nunca se pone el sol"). Felipe II necesitaba un centro administrativo desde el cual gobernar sus vastos territorios.
•	La Contrarreforma: Tras el Concilio de Trento, la monarquía española se convirtió en el brazo armado del catolicismo frente al protestantismo. El Escorial es la plasmación en piedra de la ortodoxia católica.
•	La Batalla de San Quintín (1557): El monasterio se construyó para conmemorar la victoria española sobre los franceses, ocurrida el día de San Lorenzo. De ahí su planta en forma de parrilla, símbolo del martirio del santo.
4. Qué representa y contenido (Análisis formal)
•	La Estructura: Es un enorme rectángulo de granito gris. La fachada principal destaca por su sobriedad, con torres en las esquinas que refuerzan la idea de fortaleza.
•	La Basílica: Es el corazón del complejo. De planta de cruz griega, destaca su gran cúpula sobre el crucero, que simboliza el eje del mundo.
•	El Panteón Real: Ubicado bajo el altar mayor de la basílica, alberga los restos de casi todos los monarcas españoles desde Carlos I hasta la actualidad, consolidando la legitimidad de la dinastía de los Austrias.
•	La Biblioteca: Uno de los centros del humanismo renacentista más importantes de Europa, decorada con frescos de Pellegrino Tibaldi que representan las siete artes liberales.
5. Significado histórico
Representa el ideal de la Monarquía Autoritaria y la Cristiandad. El edificio refleja la personalidad de Felipe II: austero, trabajador y profundamente religioso.
•	Funcionalidad: Fue el centro neurálgico de la burocracia imperial.
•	Ideología: Simboliza el orden, la jerarquía y la estabilidad. La sobriedad del edificio (austereza) se oponía al lujo y la "decadencia" que los católicos atribuían a las cortes extranjeras. Es, en definitiva, la expresión arquitectónica del Estado Moderno en España.`,

    }
  ],
  "bloque-5": [
    { titulo: "La rendición de Breda", 
      descripcion: "Cuadro de Velázquez (1625)",
      imagen: "rendicion_breda.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de gran formato (307 cm x 367 cm).
•	Autor: Diego Silva y Velázquez, pintor de cámara de Felipe IV.
•	Cronología: Pintada entre 1634 y 1635.
•	Estilo: Barroco español. Destaca por el dominio de la perspectiva aérea, la pincelada suelta ("manchas" que cobran forma a distancia) y un naturalismo alejado de la épica violenta tradicional.
2. Ubicación
La obra se encuentra en el Museo del Prado, en Madrid. Originalmente fue concebida para decorar el Salón de Reinos del Palacio del Buen Retiro, un espacio destinado a exaltar los éxitos militares de los Austrias ante embajadores y mandatarios extranjeros.
3. Contexto histórico
•	La Guerra de los Treinta Años (1618-1648): España estaba inmersa en un conflicto europeo por la hegemonía y la defensa del catolicismo.
•	La Guerra de los Ochenta Años: Breda era una ciudad estratégica de los Países Bajos (actual Holanda) cuya toma era vital para el control del territorio rebelde.
•	El asedio de 1625: Tras un sitio de diez meses, la ciudad capituló ante las tropas españolas lideradas por el general genovés Ambrosio Spínola. Aunque la guerra acabaría con la independencia holandesa años después, esta victoria fue celebrada como un gran triunfo moral para el reinado de Felipe IV y su valido, el Conde-Duque de Olivares.
4. Qué representa y contenido (Análisis formal)
Velázquez rompe con la tradición de mostrar al vencedor a caballo y al vencido humillado en el suelo:
•	El gesto central: Justino de Nassau (el gobernador holandés) entrega las llaves de la ciudad a Spínola. El general español pone su mano sobre el hombro del vencido en un gesto de cortesía y respeto, evitando la humillación. Representa la clemencia cristiana.
•	Los dos bandos:
o	A la derecha (españoles): Aparecen las lanzas en posición vertical, ordenadas y numerosas, simbolizando el orden, la disciplina y el poder del ejército español (los Tercios).
o	A la izquierda (holandeses): Las alabardas están desordenadas y el humo de la ciudad incendiada al fondo sugiere la derrota, aunque sus rostros mantienen la dignidad.
•	La perspectiva aérea: El fondo del cuadro muestra el paisaje de Breda inundado y humeante, utilizando una técnica de degradación de colores (azules y grises) que crea una sensación de profundidad y atmósfera real.
5. Significado histórico
Representa el ideal del caballero español y la propaganda de una monarquía que, aunque empezaba a mostrar signos de agotamiento económico, quería proyectar una imagen de superioridad moral y militar. En la PAU, esta obra es fundamental para explicar el siglo XVII (los Austrias Menores), el papel de los validos en la política exterior y el uso del arte como herramienta de Estado para ocultar la incipiente decadencia del Imperio.`,
   
    },
    { titulo: "Mapa Decretos de Nueva Planta", 
      descripcion: "División administrativa borbónica", 
      imagen: "nueva-planta.jpg",
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político de carácter primario y fuente directa. Se trata del primer Decreto de Nueva Planta, promulgado por Felipe V en 1707 tras la batalla de Almansa. Su función es la abolición de los fueros e instituciones propias de los reinos de Aragón y Valencia, imponiendo en su lugar las leyes y el sistema administrativo de Castilla.
2. Contexto histórico
El documento se dicta en plena Guerra de Sucesión Española (1701-1713). Tras la muerte de Carlos II, los territorios de la Corona de Aragón (Aragón, Valencia, Cataluña y Mallorca) apoyaron mayoritariamente al Archiduque Carlos de Austria, temiendo que el centralismo borbónico eliminara sus privilegios. Por el contrario, Castilla apoyó a Felipe V.
Tras la victoria borbónica en la batalla de Almansa (1707), Felipe V ocupó los reinos de Valencia y Aragón. El rey utilizó el "derecho de conquista" para castigar a estos territorios por su "rebelión", cumpliendo así el viejo proyecto de centralización que ya había intentado el Conde-Duque de Olivares un siglo antes. Este decreto sería seguido años más tarde por otros similares para Mallorca (1715) y Cataluña (1716).
3. Explicación del contenido
El fragmento detalla la implantación del Absolutismo Centralista en España:
•	Abolición de los Fueros: El rey deroga todos los privilegios, libertades y leyes específicas de Aragón y Valencia como castigo directo por su falta de fidelidad. Esto supone la desaparición de sus Cortes y de sus instituciones de autogobierno (como la Generalitat).
•	Unificación Jurídica y Administrativa: Se impone el modelo de Castilla como ley única para todo el territorio ("reduzcan a las leyes de Castilla... sin diferencia alguna"). Es el paso previo a la creación de una administración común basada en provincias y capitanes generales.
•	Fin de la Extranjería Interna: Se permite que los castellanos ocupen cargos en Aragón y viceversa. Aunque parece una medida de igualdad, en la práctica facilitó que el rey nombrara a funcionarios castellanos leales en los territorios recién conquistados para asegurar el control político.
•	Soberanía Absoluta: El texto emana de la voluntad exclusiva del monarca ("mi voluntad"), reflejando el modelo de monarquía absoluta de derecho divino propio de los Borbones, donde el rey es la única fuente de ley.`,

    }
  ],
  "bloque-6": [
    { titulo: "Carlos III", 
      descripcion: "Retrato de Antón Rafael Mengs", 
      imagen: "carlos_iii.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Retrato oficial de aparato (óleo sobre lienzo).
•	Autor: Antón Rafael Mengs, pintor alemán de formación italiana que fue nombrado Primer Pintor de Cámara por el propio Carlos III. Fue el máximo exponente del Neoclasicismo en la corte.
•	Cronología: Realizado hacia 1761, poco después de la llegada del monarca a España desde Nápoles.
•	Estilo: Neoclasicismo. Se aleja de la excesiva ornamentación barroca para buscar una elegancia serena, una iluminación clara y un dibujo preciso que dignifica al modelo sin idealizarlo en exceso.
2. Ubicación
La obra original se conserva en el Museo del Prado en Madrid. Al ser el retrato oficial por excelencia, se realizaron numerosas réplicas y grabados que se distribuyeron por todas las instituciones del Estado y las colonias americanas para difundir la imagen del soberano.
3. Contexto histórico
•	El Despotismo Ilustrado: Carlos III (1759-1788) es el máximo representante de la fórmula "Todo para el pueblo, pero sin el pueblo". Su reinado supuso la modernización de España a través de las Reformas Borbónicas.
•	Reformismo y Modernización: Durante su gobierno se impulsaron las Sociedades Económicas de Amigos del País, se liberalizó el comercio con América, se colonizó Sierra Morena y se embelleció Madrid (el "mejor alcalde de Madrid") con obras como el Paseo del Prado, la Fuente de Cibeles o la Puerta de Alcalá.
•	Conflictos: Su política reformista, liderada por ministros como Esquilache, provocó tensiones con los estamentos privilegiados, desembocando en el Motín de Esquilache (1766) y la posterior expulsión de los Jesuitas.
4. Qué representa y contenido (Simbología)
El cuadro es un manifiesto visual del poder real bajo la óptica de la Ilustración:
•	Atuendo Militar: El rey aparece con media armadura y la bengala de capitán general, subrayando su papel como jefe supremo de los ejércitos y defensor del Estado.
•	Condecoraciones: Luce las bandas de las órdenes más importantes: la Orden del Toisón de Oro, la de San Jenaro y la de Carlos III (que él mismo fundó). Estas simbolizan la legitimidad dinástica y el mérito.
•	La Figura Real: Mengs capta el rostro del rey con un realismo notable (destacando su nariz prominente), pero le otorga una expresión de benevolencia y firmeza. No es un rey distante y divino (como los Austrias), sino un monarca trabajador y gestor del bien común.
•	Fondo: El cortinaje carmesí y la columna aluden a la tradición del retrato de corte europeo, aportando la solemnidad necesaria a la institución monárquica.
5. Significado histórico
Representa el cenit del poder borbónico en España antes del estallido de la Revolución Francesa. Bajo Carlos III, España recuperó peso en la política internacional (Pactos de Familia con Francia) y vivió un renacimiento cultural y científico. Esta imagen de Mengs fijó para la posteridad la figura del monarca que intentó sacar a España del atraso mediante la razón y el orden, pilares de la modernidad dieciochesca.`,
  },
    { titulo: "El quitasol", 
      descripcion: "Cartón para tapiz representativo de la sociedad del siglo XVIII", 
      imagen: "el_quitasol.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo. Se trata de un cartón para tapiz (un modelo a tamaño real que los tejedores de la Real Fábrica de Tapices de Santa Bárbara utilizaban como guía).
•	Autor: Francisco de Goya y Lucientes.
•	Cronología: Realizado en 1777.
•	Estilo: Rococó / Neoclasicismo temprano. Se caracteriza por la luminosidad, el uso de colores vivos y una temática amable y galante, alejada de la oscuridad que marcaría la obra posterior del pintor.
2. Ubicación
La obra original se conserva en el Museo del Prado, en Madrid. Fue diseñada originalmente para decorar el comedor del Palacio de El Pardo, concretamente para el comedor de los Príncipes de Asturias (el futuro Carlos IV y María Luisa de Parma).
3. Contexto histórico
•	El Madrid de los Borbones: La obra se enmarca en el reinado de Carlos III. Goya, recién llegado de Zaragoza, intenta consolidarse en la Corte a través de los encargos de la Real Fábrica de Tapices, dirigida entonces por su cuñado Francisco Bayeu.
•	El Pintoresquismo y el Majismo: La Ilustración española fomentó un interés por las costumbres populares. Las clases altas y la realeza gustaban de verse rodeadas de escenas que retrataran la vida de los "majos" y "majas" (personajes castizos madrileños), idealizando la alegría y el ocio del pueblo.
4. Qué representa y contenido (Análisis formal)
La escena muestra a una joven mujer sentada, vestida a la moda francesa (reflejando el estatus), acompañada por un joven "majo" que le resguarda del sol con un quitasol.
•	Composición piramidal: La estructura de la obra es clásica y equilibrada, con las figuras inscritas en un triángulo que aporta estabilidad.
•	El color y la luz: Goya utiliza colores primarios muy vivos (amarillo del corpiño, azul del cielo). La luz es el elemento central: el contraste entre la sombra proyectada por el quitasol en el rostro de la mujer y la claridad del fondo demuestra una técnica avanzada.
•	La mirada: La joven mira directamente al espectador, rompiendo la "cuarta pared" y creando una complicidad que otorga a la obra una modernidad inusual para su tiempo.
•	Simbolismo del perro: El pequeño perro faldero dormido en el regazo de la mujer es un símbolo tradicional de fidelidad y domesticidad.
5. Significado histórico
Representa la etapa de optimismo y juventud de Goya y de la propia monarquía ilustrada antes de las crisis de finales de siglo. Es un documento excepcional sobre la moda, las jerarquías sociales y el gusto estético de la España del XVIII. Además, permite observar cómo Goya, incluso en un encargo decorativo y "ligero", ya mostraba una maestría superior en el tratamiento de la luz y la psicología de los personajes que lo convertirían en el padre del arte moderno.`,
    },
    { titulo: "Familia de Carlos IV", 
      descripcion: "Retrato colectivo de la familia real en 1800",
      imagen: "familia_carlos_iv.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Retrato colectivo de aparato (óleo sobre lienzo).
•	Autor: Francisco de Goya y Lucientes, quien ostentaba el cargo de Primer Pintor de Cámara.
•	Cronología: Realizado entre 1800 y 1801.
•	Estilo: Neoclasicismo con transición al Romanticismo. Goya utiliza una técnica de pincelada más libre y deshecha que en sus etapas anteriores, priorizando la mancha de color y la luz sobre la línea rígida.
2. Ubicación
La obra original se conserva en el Museo del Prado, en Madrid. Fue pintada para el Palacio Real y se considera el retrato oficial definitivo de la familia de Carlos IV antes del desmoronamiento del Antiguo Régimen en España.
3. Contexto histórico
•	La crisis de la monarquía: El cuadro se sitúa en un momento de gran inestabilidad. España, bajo el reinado de Carlos IV, se encontraba supeditada a los intereses de la Francia de Napoleón (Tratado de San Ildefonso).
•	El poder a la sombra: La figura del valido Manuel Godoy (que no aparece en el cuadro pero cuya influencia se siente) dominaba la política, generando un fuerte rechazo en el príncipe heredero, el futuro Fernando VII.
•	Precedentes artísticos: Goya rinde un homenaje explícito a Velázquez y su cuadro Las Meninas, situándose él mismo frente al lienzo en la parte izquierda de la composición, en la penumbra.
4. Qué representa y contenido (Análisis formal y psicológico)
El cuadro presenta a los miembros de la familia real en un espacio interior sin excesiva decoración, para que toda la atención recaiga en los personajes y su fastuosa vestimenta:
•	La Reina María Luisa de Parma: Ocupa el centro de la composición, lo que refleja su verdadero papel dominante en las decisiones de la corte.
•	Carlos IV: Aparece a la derecha de la reina, ligeramente adelantado. Goya lo retrata con una expresión bondadosa pero algo ausente, reflejando su falta de interés por las tareas de gobierno.
•	Fernando VII: A la izquierda, vestido de azul, el joven príncipe de Asturias mira con altivez, simbolizando la división interna de la familia.
•	La mujer sin rostro: La joven que vuelve la cara es la futura esposa de Fernando VII, cuya identidad se desconocía en el momento de pintar el cuadro.
•	Luz y Color: Goya despliega una maestría absoluta en la captación de las calidades de las telas (sedas, terciopelos) y las condecoraciones (la banda de la Orden de Carlos III). La luz baña a los personajes de forma desigual, dotándolos de un realismo casi fotográfico que algunos críticos han interpretado como una sátira o "caricatura" de la fealdad y decadencia de la familia, aunque los reyes quedaron satisfechos con el resultado.
5. Significado histórico
Representa el final de una época. Pocos años después de terminarse este cuadro, se produciría el Motín de Aranjuez (1808), la abdicación de Carlos IV y el inicio de la Guerra de la Independencia. El cuadro es un testimonio excepcional de la "humanización" de la monarquía; Goya no retrata dioses, sino seres humanos con sus defectos, miedos y vanidades, marcando el inicio de la modernidad en el arte del retrato.`,
    },
    { titulo: "Carga de los Mamelucos", 
      descripcion: "Madrid el 2 de Mayo de 1808",
      imagen: "carga_mamelucos.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de gran formato.
•	Autor: Francisco de Goya y Lucientes.
•	Cronología: Pintado en 1814, al finalizar la contienda, por encargo de la Regencia para celebrar el levantamiento contra Napoleón.
•	Estilo: Romanticismo. Goya abandona el orden neoclásico para ofrecer una escena de caos, movimiento desenfrenado y violencia pasional.
2. Ubicación
Se encuentra en el Museo del Prado, en Madrid. Al igual que el cuadro de los fusilamientos, fue concebido para exaltar el patriotismo tras el regreso de Fernando VII, aunque la visión de Goya resultó ser mucho más cruda y menos idealizada de lo que la monarquía esperaba.
3. Contexto histórico
•	El levantamiento popular: El 2 de mayo de 1808, el pueblo de Madrid se alzó contra las tropas francesas al percatarse de que el resto de la familia real iba a ser trasladada a Francia (Abdicaciones de Bayona).
•	Los protagonistas: La lucha se centró en la Puerta del Sol. Goya retrata el enfrentamiento entre los madrileños (armados con navajas y herramientas) y los mamelucos, soldados egipcios de élite integrados en el ejército de Napoleón, cuya presencia resultaba especialmente ofensiva para el pueblo español por el recuerdo histórico de la presencia musulmana en la península.
4. Qué representa y contenido (Análisis formal)
A diferencia de la rigidez de los fusilamientos, aquí todo es dinamismo y confusión:
•	Composición centrífuga: La acción parece desbordar el cuadro. No hay un único protagonista; el héroe es el pueblo anónimo. Los cuerpos, caballos y soldados se entrelazan en una masa compacta de violencia.
•	El realismo de la violencia: Goya no oculta la brutalidad. Vemos a madrileños apuñalando a los caballos y derribando a los soldados, mientras estos intentan defenderse con sus cimitarras. El suelo está cubierto de sangre, anticipando el dramatismo de su obra posterior.
•	Color y pincelada: Predominan los tonos cálidos (rojos, ocres, amarillos), que aumentan la sensación de calor y conflicto. La pincelada es suelta y rápida, casi "impresionista" avant la lettre, lo que refuerza la sensación de una acción captada en un instante de furia.
•	El paisaje: Al fondo se distinguen las cúpulas de Madrid bajo un cielo turbio, situando la acción en el corazón de la capital.
5. Significado histórico
Representa el inicio de la Edad Contemporánea en España. Este cuadro es el símbolo de la nación en armas y de la soberanía popular que, ante el vacío de poder dejado por los reyes, toma las riendas de su destino. Artísticamente, supone una ruptura con la pintura de batallas tradicional (que solía ser ordenada y heroica) para mostrar la guerra como una tragedia humana de odio y desesperación.`,
    },
    { titulo: "Fusilamientos del 3 de mayo", 
      descripcion: "Cuadro sobre la represión napoleónica en Madrid en 1808",
      imagen: "tres_de_mayo.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de gran formato.
•	Autor: Francisco de Goya y Lucientes.
•	Cronología: Pintado en 1814, seis años después de los hechos que narra, una vez terminada la Guerra de la Independencia y regresado Fernando VII a España.
•	Estilo: Romanticismo. Goya rompe con el equilibrio neoclásico para centrarse en la expresión del sentimiento, el dramatismo y la violencia descarnada.
2. Ubicación
La obra se encuentra en el Museo del Prado, en Madrid. Fue un encargo del Consejo de Regencia (a petición del propio Goya) para conmemorar la heroica resistencia del pueblo madrileño contra las tropas de Napoleón.
3. Contexto histórico
•	La Guerra de la Independencia (1808-1814): Tras el Levantamiento del 2 de mayo en Madrid contra la ocupación francesa, el general Murat ordenó una represión sangrienta. Durante la madrugada del 3 de mayo, cientos de madrileños fueron fusilados en diversos puntos de la ciudad (el Retiro, el Prado y la montaña del Príncipe Pío).
•	La crisis del Antiguo Régimen: Goya pinta este cuadro en un momento de transición: el fin de la guerra y el inicio del reinado absolutista de Fernando VII. La obra sirve para exaltar el sacrificio del pueblo anónimo frente a la frialdad de los ejércitos invasores.
4. Qué representa y contenido (Análisis formal)
La composición se divide en dos grupos enfrentados que crean un contraste moral y visual:
•	El pelotón de ejecución (derecha): Los soldados franceses están representados de espaldas, sin rostro. Son una "máquina de matar" anónima y geométrica. La repetición de sus posturas y fusiles simboliza la deshumanización de la guerra y la disciplina ciega.
•	Las víctimas (izquierda): Goya dota de individualidad y emoción a los condenados. Se aprecian diversas reacciones: miedo, resignación, oración y desafío.
•	El "mártir" de la camisa blanca: Es el centro de atención. Su postura con los brazos en cruz recuerda a la Crucifixión de Cristo (presenta incluso un estigma en la mano). El color blanco simboliza la inocencia y la luz que emana de él ilumina la escena.
•	La luz y el color: Un gran farol en el suelo es la única fuente de luz, creando un claroscuro dramático que acentúa la tragedia. Los colores son terrosos y oscuros, rompiendo solo con el blanco de la camisa y el rojo intenso de la sangre en el primer plano.
•	El paisaje: Al fondo se recorta la silueta de Madrid bajo una noche cerrada, lo que acentúa la sensación de aislamiento y desesperanza de los ejecutados.
5. Significado histórico y artístico
Representa el nacimiento del reporterismo de guerra artístico. Por primera vez en la historia del arte, la guerra no se pinta como un acto de gloria o heroísmo militar, sino como una masacre cruel e injusta de civiles. Es una obra universal que ha influido en artistas posteriores (como Manet en El fusilamiento de Maximiliano o Picasso en el Guernica y Masacre en Corea) por su denuncia de la violencia política.`,
    },
    { titulo: "Constitución de 1812", 
      descripcion: "Pintura conmemorativa de La Pepa",
      imagen: "constitucion_1812.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de carácter alegórico y político.
•	Autor: Salvador Viniegra, pintor historicista gaditano.
•	Cronología: Fue pintada en 1912, con motivo del primer centenario de la Constitución. Aunque es una obra posterior a los hechos, es la imagen de referencia que mejor sintetiza el espíritu de las Cortes de Cádiz.
•	Estilo: Realismo decimonónico / Academicismo. Destaca por su composición grandilocuente, el uso de símbolos clásicos y una iluminación triunfalista.
2. Ubicación
La obra original se conserva en el Museo de las Cortes de Cádiz. Su ubicación es simbólica, ya que Cádiz fue el único reducto libre de la ocupación francesa donde se pudo gestar el primer texto constitucional de España.
3. Contexto histórico
•	La Guerra de la Independencia (1808-1814): Ante el vacío de poder causado por las abdicaciones de Bayona y la ocupación napoleónica, el pueblo español asumió la soberanía a través de las Juntas.
•	Las Cortes de Cádiz: Se convocaron Cortes generales y extraordinarias en 1810. En ellas se enfrentaron dos sectores: los absolutistas (partidarios del Antiguo Régimen) y los liberales (partidarios de reformas profundas).
•	La Constitución de 1812: Promulgada el 19 de marzo (día de San José, de ahí "La Pepa"), fue la primera constitución liberal de España. Estableció la soberanía nacional, la división de poderes, el sufragio universal masculino indirecto y la igualdad ante la ley.
4. Qué representa y contenido (Simbología)
La obra es un despliegue de símbolos que el alumno debe identificar:
•	La figura central: Una mujer joven que personifica a la Constitución (o a la propia España liberal). Viste túnica blanca (pureza) y sostiene en alto el texto constitucional con la inscripción "Constitución política de la Monarquía Española".
•	El León: A sus pies, símbolo de la fortaleza del pueblo español y de la monarquía hispánica, que rompe las cadenas del absolutismo y la opresión.
•	La Victoria: Una figura alada corona a la Constitución con laureles, simbolizando el éxito del pensamiento ilustrado sobre la tiranía.
•	Personajes secundarios: Alrededor se agrupan representantes de los distintos estamentos y ciudadanos que juran fidelidad al texto, reflejando la unión de la nación frente al invasor y el entusiasmo popular.
•	Ambiente: La escena ocurre al aire libre, con una luz brillante que despeja las nubes oscuras de la guerra, sugiriendo un nuevo amanecer para España.
5. Significado histórico
Representa el nacimiento del liberalismo en España. Aunque la Constitución de 1812 tuvo una vida corta (fue derogada por Fernando VII en 1814 a su regreso), se convirtió en el faro y mito de todo el liberalismo del siglo XIX, influyendo no solo en España, sino también en las constituciones de las nuevas repúblicas hispanoamericanas y de otros países europeos como Italia o Portugal. Es el símbolo del paso de "súbditos" a "ciudadanos".`,

    },
    { titulo: "Torrijos", 
      descripcion: "Pintura de Antonio Gisbertque representa la ejecución de los liberales en Málaga en 1831", 
      imagen: "fusilamiento_torrijos.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de gran formato.
•	Autor: Francisco de Goya y Lucientes.
•	Cronología: Pintado en 1814, seis años después de los hechos que narra, una vez terminada la Guerra de la Independencia y regresado Fernando VII a España.
•	Estilo: Romanticismo. Goya rompe con el equilibrio neoclásico para centrarse en la expresión del sentimiento, el dramatismo y la violencia descarnada.
2. Ubicación
La obra se encuentra en el Museo del Prado, en Madrid. Fue un encargo del Consejo de Regencia (a petición del propio Goya) para conmemorar la heroica resistencia del pueblo madrileño contra las tropas de Napoleón.
3. Contexto histórico
•	La Guerra de la Independencia (1808-1814): Tras el Levantamiento del 2 de mayo en Madrid contra la ocupación francesa, el general Murat ordenó una represión sangrienta. Durante la madrugada del 3 de mayo, cientos de madrileños fueron fusilados en diversos puntos de la ciudad (el Retiro, el Prado y la montaña del Príncipe Pío).
•	La crisis del Antiguo Régimen: Goya pinta este cuadro en un momento de transición: el fin de la guerra y el inicio del reinado absolutista de Fernando VII. La obra sirve para exaltar el sacrificio del pueblo anónimo frente a la frialdad de los ejércitos invasores.
4. Qué representa y contenido (Análisis formal)
La composición se divide en dos grupos enfrentados que crean un contraste moral y visual:
•	El pelotón de ejecución (derecha): Los soldados franceses están representados de espaldas, sin rostro. Son una "máquina de matar" anónima y geométrica. La repetición de sus posturas y fusiles simboliza la deshumanización de la guerra y la disciplina ciega.
•	Las víctimas (izquierda): Goya dota de individualidad y emoción a los condenados. Se aprecian diversas reacciones: miedo, resignación, oración y desafío.
•	El "mártir" de la camisa blanca: Es el centro de atención. Su postura con los brazos en cruz recuerda a la Crucifixión de Cristo (presenta incluso un estigma en la mano). El color blanco simboliza la inocencia y la luz que emana de él ilumina la escena.
•	La luz y el color: Un gran farol en el suelo es la única fuente de luz, creando un claroscuro dramático que acentúa la tragedia. Los colores son terrosos y oscuros, rompiendo solo con el blanco de la camisa y el rojo intenso de la sangre en el primer plano.
•	El paisaje: Al fondo se recorta la silueta de Madrid bajo una noche cerrada, lo que acentúa la sensación de aislamiento y desesperanza de los ejecutados.
5. Significado histórico y artístico
Representa el nacimiento del reporterismo de guerra artístico. Por primera vez en la historia del arte, la guerra no se pinta como un acto de gloria o heroísmo militar, sino como una masacre cruel e injusta de civiles. Es una obra universal que ha influido en artistas posteriores (como Manet en El fusilamiento de Maximiliano o Picasso en el Guernica y Masacre en Corea) por su denuncia de la violencia política.`,
    }
  ],
  "bloque-7": [
    { titulo: "Mapa Guerra Carlista", 
      descripcion: "Distribución territorial de los focos carlistas y cristinos (1833-1840)", 
      imagen: "primera-guerra-carlista.jpg",
      explicacion: `1. Definición y tipología
•	Tipo de obra: Mapa histórico-político de carácter militar y dinástico.
•	Contenido: Muestra la distribución geográfica de los bandos en conflicto, las zonas de predominio carlista, las expediciones militares y los principales focos de resistencia.
•	Autor: Cartografía histórica basada en el desarrollo del conflicto civil tras la muerte de Fernando VII.
2. Ubicación y Ámbito Geográfico
La guerra no afectó a toda España por igual, sino que se concentró en áreas con fueros propios o fuerte arraigo tradicional:
•	Focos Carlistas: País Vasco, Navarra, el Maestrazgo (Aragón y Valencia) y las zonas rurales de Cataluña. Eran áreas rurales, montañosas y de difícil acceso.
•	Zonas Liberales (Isabelinas): Las grandes ciudades (Madrid, Barcelona, Bilbao), las zonas costeras y el sur de la Península. El control de las capitales de provincia fue fundamental para el bando liberal.
3. Contexto Histórico
•	El Problema Sucesorio: Fernando VII muere en 1833 dejando como heredera a su hija Isabel (de tres años), gracias a la Pragmática Sanción. El hermano del rey, Carlos María Isidro, reclama el trono basándose en la Ley Sálica, iniciando la insurrección.
•	Dos modelos enfrentados:
•	Carlistas: Bajo el lema "Dios, Patria, Rey y Fueros". Defendían el absolutismo, la preeminencia de la Iglesia y el mantenimiento de los fueros tradicionales frente al centralismo liberal. Recibieron apoyo de la pequeña nobleza rural y el bajo clero.
•	Isabelinos (Cristinos): Agrupaban a la burguesía, las clases urbanas y la alta nobleza. Para defender el trono de Isabel II, la regente María Cristina tuvo que pactar con los liberales, lo que supuso el fin definitivo del Antiguo Régimen.
4. Qué representa y contenido (Etapas y elementos del mapa)
En el mapa se suelen distinguir varios elementos clave:
•	Las Expediciones: Flechas que indican los movimientos de las columnas carlistas (como la Expedición Real de 1837), que intentaron sin éxito tomar Madrid para decidir la guerra.
•	El papel de los militares: El mapa explica el ascenso de los "espadones". Por el bando carlista destaca el general Zumalacárregui (organizador del ejército carlista) y Cabrera (el "Tigre del Maestrazgo"). Por el liberal, el general Espartero.
•	El fin del conflicto: El mapa suele señalar Oñate o Vergara, donde en 1839 se firmó el Convenio de Vergara (el "Abrazo de Vergara") entre Espartero y Maroto, poniendo fin a la guerra en el norte, aunque el foco del Maestrazgo resistiría un año más.
5. Significado Histórico
Representa la consolidación del Estado Liberal en España a través de las armas. La victoria isabelina permitió el desarrollo de las reformas de Mendizábal y la Constitución de 1837. Sin embargo, el carlismo no desapareció; quedó como un movimiento latente que provocaría otras dos guerras civiles a lo largo del siglo XIX, reflejando la dificultad de España para integrar la tradición foral en el nuevo modelo de Estado centralizado.`,
    },
    { titulo: "La Flaca", 
      descripcion: "Caricatura La Flaca sobre la Gloriosa Constitución de 1868.", 
      imagen: "la_flaca.jpg",
      explicacion: `1. Identificación y Descripción de la Fuente
•	Tipo de fuente: Fuente primaria de carácter gráfico y periodístico. Se trata de la cabecera e ilustración principal de la portada del primer número de la revista satírico-política "La Flaca", publicada en Barcelona.
•	Autoría: Colectiva, aunque se asocia fuertemente a caricaturistas y artistas de la época como Tomás Padró Pedret. La revista era editada por sectores republicanos y demócratas.
•	Cronología: Fechada explícitamente en el texto inferior como del primer año de publicación, lo cual corresponde históricamente a 1869. (Aunque la Revolución ocurrió en 1868, la revista comenzó a publicarse a principios de 1869 durante los debates constitucionales).
•	Ubicación original y actual: Originalmente una publicación de prensa en Barcelona. Hoy en día, ejemplares se conservan en archivos históricos como la Biblioteca Nacional de España o el Arxiu Històric de la Ciutat de Barcelona.
2. Representación y Análisis de los Datos (Qué representa)
La imagen es una alegoría profundamente crítica y satírica sobre la situación política de España inmediatamente después de la Revolución de 1868 ("La Gloriosa").
•	El título, "LA FLACA": Las letras están construidas a base de huesos y calaveras, lo que ya establece el tono de "hambruna" y precariedad.
•	La figura central: Una mujer extremadamente demacrada y esquelética (la "Flaca") representa a la Nación Española. Viste una túnica clásica y una corona de laurel, símbolos tradicionales de la gloria y la república, pero su aspecto físico contradice cualquier noción de triunfo. Ella se apoya en un escudo que representa las armas de España (Castilla y León).
•	El León: A sus pies, el león español (tradicional símbolo de fuerza y de la nación) aparece igualmente flaco, demacrado y postrado en el suelo, con una mirada mansa y derrotada.
•	El significado alegórico: La caricatura representa la desilusión y el fracaso de las promesas revolucionarias. Aunque la Constitución de 1869 (derivada de la revolución de 1868) estableció amplias libertades democráticas y civiles, la realidad económica del país seguía siendo de pobreza y crisis. La imagen sugiere que la "Gloriosa Revolución" ha dejado al país en los huesos (literalmente "en la flaca"). La Constitución misma (derivada de la Revolución de 1868) no ha logrado "dar de comer" al pueblo ni restaurar la vitalidad de la nación.
3. Contexto Histórico
Esta caricatura se sitúa en el Sexenio Democrático (1868-1874), un período de intensos cambios políticos en España.
•	Antecedentes directos (La Gloriosa de 1868): En septiembre de 1868, la Revolución Gloriosa destronó a Isabel II tras años de autoritarismo y crisis económica. Un Gobierno Provisional (liderado por Prim y Serrano) asumió el poder y convocó Cortes Constituyentes.
•	La situación en 1869: El momento de publicación de la revista coincide con la redacción y aprobación de la Constitución de 1869, considerada la más liberal y democrática de la historia de España hasta entonces (estableció sufragio universal masculino, amplias libertades de prensa, asociación y culto). Sin embargo, esta avanzada ley no resolvió de inmediato la grave crisis económica, la inestabilidad política ni las tensiones sociales.
•	El papel de la prensa satírica: En este contexto de nueva libertad de prensa, florecieron revistas como "La Flaca". Como publicación republicana y federal, utilizaba la sátira para criticar al Gobierno Provisional monárquico y a la falta de reformas sociales profundas que mejoraran la vida de las clases populares. La caricatura es un grito de protesta contra la realidad de un pueblo hambriento frente a las abstracciones de los debates constitucionales.
4. Significado Histórico y Conclusión
Esta portada de "La Flaca" representa un documento histórico visual de primer orden para comprender la Transición Española del siglo XIX. Ilustra gráficamente la complejidad del Sexenio Democrático, donde los avances legislativos (como la Constitución de 1869) chocaban de frente con una realidad social y económica desastrosa. Es un testimonio de la rápida desilusión que siguió a la euforia revolucionaria y del uso de la prensa satírica como herramienta de movilización política y crítica social por parte de los sectores más radicales del liberalismo democrático y republicano en Cataluña y el resto de España.`,
    },
    { titulo: "Primera República", 
      descripcion: "Imagen de la matrona con gorro frigio y balanza", 
      imagen: "la-matrona.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Litografía satírica y alegórica de carácter político.
•	Publicación: Revista "La Flaca" (Barcelona), famosa por su oposición a la monarquía y su apoyo al republicanismo federal.
•	Cronología: 1873. Se publica coincidiendo con la proclamación de la República tras la abdicación de Amadeo I de Saboya.
•	Estilo: Pintura histórica-caricaturesca. Utiliza una estética neoclásica para la figura central pero cargada de simbolismo político contemporáneo.
2. Ubicación y contexto histórico
•	Contexto: Tras el fracaso de la monarquía democrática de Amadeo I (debido a la muerte de Prim, la Tercera Guerra Carlista y la guerra en Cuba), las Cortes proclaman la Primera República el 11 de febrero de 1873.
•	Inestabilidad: La República nace con escasos apoyos internacionales y una fuerte división interna entre unitarios (república centralizada) y federales (república basada en pactos entre regiones). En solo once meses se sucedieron cuatro presidentes: Figueras, Pi i Margall, Salmerón y Castelar.
3. Qué representa y contenido (Simbología)
La imagen es un complejo programa iconográfico que el alumno debe desglosar:
•	La Matrona Republicana: Una mujer majestuosa que personifica a España. Sus atributos son fundamentales:
o	Gorro Frigio: Símbolo universal de la libertad y el republicanismo (herencia de la Revolución Francesa).
o	La Balanza: Representa la justicia y la igualdad ante la ley, principios básicos del nuevo régimen.
o	El Triángulo Masónico o Nivel: Símbolo de la igualdad social y política.
o	La Bandera Tricolor: Aunque la oficial seguía siendo la roja y gualda, se popularizó el uso de colores que simbolizaran la ruptura con el pasado borbónico.
•	El Escudo: Suele aparecer el escudo de España pero sin la corona real, sustituida por una corona mural (en forma de muralla), indicando que la soberanía reside en el pueblo y no en una dinastía.
•	El León: Símbolo de la fuerza y la casta del pueblo español, que ahora custodia las tablas de la ley o la Constitución.
•	Tablas de la Ley / Constitución: En las que suele leerse "Reforma", "Libertad", o "Justicia", aludiendo al proyecto de Constitución Federal de 1873 (que no llegó a promulgarse).
4. Significado histórico
Representa el primer intento de organizar el Estado español como una República. Simboliza la llegada al poder de la burguesía democrática y las clases populares urbanas. Sin embargo, la imagen de orden y serenidad de la alegoría contrastó con la realidad histórica: el estallido de la insurrección cantonal (Cartagena), la continuación de la Tercera Guerra Carlista y la Guerra de los Diez Años en Cuba.
La República terminó en enero de 1874 con el golpe de Estado del general Pavía, abriendo paso a la dictadura de Serrano y, finalmente, a la Restauración Borbónica en la figura de Alfonso XII.`,
    }
  ],
  "bloque-8": [
    { titulo: "Cánovas y Sagasta", 
      descripcion: " Fotografías de los líderes del sistema del Turno de Partidos", 
      imagen: "canovas_sagasta.jpg",
      explicacion: ` I. Identificación y Descripción de la Fuente
•	Tipo de fuente: Fuente primaria de carácter gráfico e iconográfico. Se trata de un montaje fotográfico histórico que presenta, a la izquierda, el retrato de Antonio Cánovas del Castillo y, a la derecha, el de Práxedes Mateo Sagasta.
•	Cronología: Las fotografías individuales datan de finales del siglo XIX, periodo clave para la comprensión del sistema que representan. Cánovas (izq.) aparece con sus características gafas y Sagasta (der.) con su barba blanca, ambos en atuendo formal de la época.
•	Autoría y Fama: Como es habitual en los retratos de figuras públicas de la época, las fotografías individuales pueden no tener un autor específico famoso, pero es muy probable que fuesen obra de fotógrafos de la corte o de prensa de renombre (como Laurent, Kaulak o Martínez Sánchez). Sin embargo, el montaje que combina estas dos imágenes específicas es una iconografía extremadamente conocida y utilizada sistemáticamente en la historiografía y los manuales de historia de España. Es la representación visual definitiva y universal de la oligarquía y el poder del siglo XIX español.
•	Ubicación y Significado: Históricamente, estas figuras se ubican en el centro neurálgico del poder del Estado, en Madrid, turnándose en la presidencia del Consejo de Ministros y controlando las Cortes Generales. Su significado es fundamental como encarnación del sistema político de la Restauración borbónica.
II. Contexto Histórico: La Restauración y el Turnismo Pacífico
Esta imagen se enmarca en el periodo histórico conocido como la Restauración (1875-1923). Tras la inestabilidad del Sexenio Democrático, el general Martínez Campos proclama en Sagunto (1874) a Alfonso XII como rey, iniciando una fase de estabilización conservadora. Antonio Cánovas del Castillo es el artífice de este nuevo régimen, diseñado para garantizar el orden, consolidar la monarquía y evitar los pronunciamientos militares del pasado.
El núcleo central de este sistema, representado visualmente por estas dos figuras, fue el sistema de turnos de los partidos políticos o 'turnismo pacífico'. Este mecanismo consistía en la alternancia controlada en el poder entre los dos principales partidos dinásticos:
•	El Partido Liberal-Conservador, liderado por Cánovas.
•	El Partido Liberal Fusionista, liderado por Sagasta.
Este pacto político se consolidó con el Pacto del Pardo (1885), un acuerdo entre ambos líderes tras la muerte del rey Alfonso XII para garantizar la estabilidad de la regencia de María Cristina de Habsburgo-Lorena y asegurar la alternancia de poder de manera pacífica. El sistema funcionaba mediante una "farsa electoral" perfectamente orquestada:
1.	El rey convocaba elecciones tras el acuerdo previo.
2.	El Ministerio de la Gobernación elaboraba el 'encasillado', una lista con los diputados que debían ganar en cada distrito.
3.	Los 'caciques' locales (hombres influyentes que controlaban el voto en las zonas rurales mediante favores o coacciones) se aseguraban de que los resultados de las votaciones fuesen los previamente acordados, utilizando el fraude electoral generalizado.
Esta "España oficial", representada por Cánovas y Sagasta, operaba al margen de la "España real", marginando a amplios sectores de la población (obreros, republicanos, nacionalistas), lo que a la larga generó una profunda crisis social y política que eclosionaría tras el 'desastre del 98'.
III. Qué Representa y Significado Político
La imagen representa la esencia misma del mecanismo político de la Restauración. No son simplemente dos políticos, sino los personajes que personifican la oligarquía y el acuerdo entre las clases altas y la burguesía para mantener el control del Estado.
Su presencia conjunta en un montaje fotográfico simboliza el acuerdo de turnos pacífico y la naturaleza controlada y no democrática del sistema electoral. Es la imagen de la estabilidad oligárquica frente a la inestabilidad revolucionaria del pasado. Representa un periodo de aparente paz social pero de profunda desconexión con las bases de la sociedad española. Cánovas y Sagasta son la 'Constitución Cánovas-Sagasta' encarnada, el símbolo de la política de gabinete decimonónica que definió una época.`,
    },
    { titulo: "Desastre del 98", 
      descripcion: "Cartografía de las últimas colonias españolas (Cuba, Puerto Rico y Filipinas)", 
      imagen: "desastre_98.jpg",
      explicacion: `1. Definición y tipología
•	Tipo de obra: Mapa histórico-político y militar de carácter global.
•	Contenido: Muestra los escenarios de los conflictos bélicos de 1898, las rutas navales de las flotas española y estadounidense, y los territorios cedidos tras el Tratado de París.
•	Autor: Cartografía histórica basada en los tratados diplomáticos y crónicas militares de finales del siglo XIX.
2. Ubicación y Ámbito Geográfico
El mapa se divide en dos escenarios principales situados en hemisferios opuestos:
•	El Caribe: Las islas de Cuba y Puerto Rico. El conflicto naval se centró en la bahía de Santiago de Cuba.
•	El Pacífico: El archipiélago de las Filipinas y la isla de Guam (en las Marianas). El enfrentamiento clave ocurrió en la bahía de Cavite (Manila).
3. Contexto Histórico
•	Antecedentes: España mantenía un modelo colonial extractivo y centralista que chocaba con los deseos de autonomía locales y los intereses económicos de EE. UU. (azúcar en Cuba).
•	El estallido: Tras la insurrección cubana (Grito de Baire, 1895) y la filipina, la explosión del acorazado estadounidense Maine en el puerto de La Habana (febrero de 1898) sirvió de pretexto (casus belli) para que EE. UU. declarara la guerra a España.
•	La guerra: La superioridad técnica y numérica de la flota estadounidense provocó la rápida destrucción de la armada española liderada por el almirante Cervera en Cuba y Montojo en Filipinas.
4. Qué representa y contenido (El Tratado de París)
El mapa ilustra las consecuencias geopolíticas firmadas en el Tratado de París (diciembre de 1898):
•	Pérdidas territoriales: España reconoce la independencia de Cuba (bajo tutela de EE. UU.) y cede Filipinas, Puerto Rico y Guam a los Estados Unidos a cambio de 20 millones de dólares.
•	Liquidación del Imperio: Poco después, en 1899, España vendió a Alemania los últimos restos del Pacífico (islas Carolinas, Marianas y Palaos) por su incapacidad para defenderlas.
•	Movimientos navales: El mapa suele mostrar la trayectoria de la escuadra española, evidenciando el aislamiento logístico y la obsolescencia de sus naves frente a la tecnología moderna.
5. Significado Histórico
Representa el fin definitivo del Imperio Español iniciado en 1492. En el ámbito interno, provocó una profunda crisis moral, social y política conocida como el "Pesarismo".
•	Consecuencias políticas: El sistema de la Restauración entró en una fase de inestabilidad y crítica que dio paso al Regeneracionismo (liderado por figuras como Joaquín Costa), que pedía "despensa y escuela" y la modernización de las estructuras del país.
•	Consecuencias culturales: Surgió la Generación del 98 (Unamuno, Pío Baroja, Machado), que reflexionó sobre la identidad de España y su atraso respecto a Europa.`,
    },
    { titulo: "Proclamación Segunda República", 
      descripcion: "Fotografía histórica del 14 de abril de 1931",
      imagen: "segunda-republica.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Fotografía histórica / Documento periodístico.
•	Autor: Existen varias tomas famosas, destacando las de fotógrafos como Alfonso Sánchez Portela (Alfonso) o Campúa, que captaron el momento desde los balcones de la plaza.
•	Cronología: 14 de abril de 1831.
•	Estilo: Fotoperiodismo documental. La imagen destaca por su carácter espontáneo, la multitud que llena el encuadre y la presencia de la bandera tricolor como símbolo del cambio.
2. Ubicación
La escena tiene lugar en la Puerta del Sol de Madrid, frente al edificio de la Casa de Correos (entonces sede del Ministerio de la Gobernación y hoy de la Presidencia de la Comunidad de Madrid). Es el corazón simbólico y político de la capital de España.
3. Contexto histórico
•	El fin de la Dictablanda: Tras la dimisión de Primo de Rivera en 1930, los gobiernos de Berenguer y Aznar no lograron devolver la normalidad al sistema de la Restauración. La oposición se unió en el Pacto de San Sebastián para derrocar la monarquía.
•	Las Elecciones Municipales del 12 de abril: Convocadas como un plebiscito sobre la Corona, los partidos republicano-socialistas triunfaron en las grandes ciudades.
•	La caída de Alfonso XIII: Ante la falta de apoyo militar y el empuje popular en las calles, el rey decidió abandonar España hacia el exilio para evitar una guerra civil. La República fue proclamada primero en Éibar y Sahagún, y horas después en Madrid.
4. Qué representa y contenido (Elementos clave)
La fotografía ilustra varios conceptos fundamentales que se exigen en la PAU:
•	La Soberanía Popular: La masa compacta de ciudadanos de todas las clases sociales representa el apoyo civil al nuevo régimen.
•	La Bandera Tricolor: Es el elemento visual más potente. La incorporación de la franja morada (en alusión a los Comuneros de Castilla) simbolizaba la ruptura con la bandera roja y gualda de la monarquía borbónica.
•	El Ministerio de la Gobernación: Desde sus balcones, los miembros del Comité Revolucionario (convertido en Gobierno Provisional), liderados por Niceto Alcalá-Zamora, se asomaron para dirigirse a la multitud, asumiendo el poder de forma legítima pero revolucionaria.
•	Ausencia de violencia: La imagen transmite un clima de fiesta y esperanza ("la niña bonita"), reflejando que el cambio de régimen se produjo sin derramamiento de sangre inicial.
5. Significado histórico
Representa el inicio de la etapa más ambiciosa de modernización de la historia contemporánea de España. La Segunda República intentó resolver los problemas estructurales del país (reforma agraria, educación, cuestión regional y religiosa) a través de la Constitución de 1931. Sin embargo, este entusiasmo inicial daría paso a una fuerte polarización social y política que marcaría los cinco años siguientes hasta el estallido de la Guerra Civil en 1936.`,
    },
  ],
  "bloque-9": [
    { titulo: "Guernica de Picasso", 
      descripcion: "Mural que representa el bombardeo de la villa vasca en 1937",
      imagen: "el_guernica.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo de formato mural (3,49 x 7,77 metros).
•	Autor: Pablo Ruiz Picasso.
•	Cronología: Realizado entre mayo y junio de 1937.
•	Estilo: Cubismo y Expresionismo. Aunque utiliza la fragmentación de planos del cubismo, la carga emocional y la deformación de las figuras lo inscriben en un expresionismo trágico. El uso del blanco, negro y gris (monocromía) acentúa el carácter de noticia periodística y el luto.
2. Ubicación
Actualmente se encuentra en el Museo Nacional Centro de Arte Reina Sofía, en Madrid. Fue un encargo del Gobierno de la Segunda República para el Pabellón Español de la Exposición Internacional de París de 1937, con el fin de atraer la atención internacional hacia la causa republicana.
3. Contexto histórico
•	La Guerra Civil Española (1936-1939): El 26 de abril de 1937, la Legión Cóndor alemana y la aviación italiana, al servicio del bando franquista, bombardearon la villa foral de Guernica (Vizcaya). Fue uno de los primeros ataques indiscriminados contra población civil desde el aire.
•	El encargo: Picasso, que residía en París, aceptó el encargo de la República. El bombardeo le dio el tema definitivo para expresar su rechazo a la violencia y al fascismo.
4. Qué representa y contenido (Simbología)
Picasso no pintó aviones ni bombas, sino el sufrimiento de las víctimas a través de una simbología compleja y debatida:
•	El Toro: A la izquierda, representa la brutalidad o, según algunas interpretaciones, la propia España que contempla el horror con frialdad.
•	La Madre con el hijo muerto: Una clara referencia a la Pietà cristiana, simboliza el dolor desgarrador de la población civil.
•	El Guerrero caído: En la parte inferior, con una espada rota y una flor, representa la derrota militar pero también una pequeña esperanza de renacimiento.
•	El Caballo: En el centro, herido por una lanza, simboliza al pueblo español sufriente y víctima de la agresión.
•	La Lámpara/Ojo: En la parte superior, puede interpretarse como el "ojo de Dios" o la luz de la verdad y la tecnología (la bomba) que todo lo ve y destruye.
•	Las mujeres: Una mujer que clama al cielo, otra que sale de una casa en llamas y una tercera que se arrastra hacia la luz, reforzando la sensación de pánico y huida.
5. Significado histórico y legado
Representa el grito de denuncia contra la deshumanización. El cuadro viajó por todo el mundo para recaudar fondos para la República. Por deseo de Picasso, la obra no regresó a España hasta que se restablecieron las libertades democráticas (llegó en 1981 desde el MoMA de Nueva York). Es una obra que trasciende la Guerra Civil para convertirse en un icono contra cualquier conflicto bélico y la defensa de los Derechos Humanos.`,
     },
    { titulo: "Mapa Guerra Civil", 
      descripcion: "Cartografía de la evolución de las zonas nacional y republicana (1936-1939)",
      imagen: "guerra_civil.jpg",
      explicacion: `1. Definición y tipología
•	Tipo de obra: Mapa histórico-militar de carácter evolutivo.
•	Contenido: Muestra el avance de las líneas de frente, las principales batallas y la evolución de las "dos Españas" desde el golpe de Estado hasta el final de la contienda.
•	Autor: Cartografía histórica basada en los partes de guerra y las demarcaciones territoriales de 1936 a 1939.
2. Ubicación y Ámbito Geográfico
El mapa abarca toda la Península Ibérica, las Islas Baleares, Canarias y las posesiones en el norte de África. La clave del mapa es la división inicial:
•	Zona Sublevada: Galicia, Castilla y León, Navarra, parte de Aragón, Baleares (excepto Menorca) y el Protectorado de Marruecos.
•	Zona Republicana: Madrid, Cataluña, la Comunidad Valenciana, Murcia, casi toda Andalucía y la cornisa cantábrica (que quedó aislada).
3. Contexto Histórico
•	El golpe de Estado (julio de 1936): Tras el fracaso parcial del pronunciamiento militar contra la Segunda República, el país quedó dividido. El paso del Ejército de África a través del Estrecho (con ayuda alemana e italiana) fue decisivo para el avance inicial hacia Madrid.
•	Ayuda Internacional: El mapa refleja indirectamente la intervención extranjera (Comité de No Intervención vs. Legión Cóndor, CTV italiano y las Brigadas Internacionales).
4. Fases de la Guerra representadas
Un análisis completo de PAU debe desglosar las etapas que suelen marcarse con distintos colores o flechas en el mapa:
1.	Guerra de Columnas y Marcha sobre Madrid (1936): El avance desde el sur (Yagüe) y el norte (Mola). El fracaso en la toma de Madrid tras las batallas del Jarama y Guadalajara convierte la guerra de movimientos en una guerra de desgaste.
2.	La Campaña del Norte (1937): Los sublevados concentran su esfuerzo en la franja cantábrica (bombardeo de Guernica, caída de Bilbao y Santander). La República pierde sus recursos mineros e industriales del norte.
3.	La llegada al Mediterráneo (1938): Tras la Batalla de Teruel, las tropas de Franco llegan a Vinaroz (Castellón), cortando el territorio republicano en dos y aislando a Cataluña del resto de la zona fiel a la República.
4.	La Batalla del Ebro y el Fin de la Guerra (1938-1939): El último gran esfuerzo republicano acaba en derrota. Se produce la caída de Barcelona (enero 1939) y finalmente la entrada en Madrid (marzo 1939) tras el golpe de Casado.
5. Significado Histórico
El mapa representa el fracaso de la democracia y el inicio de una larga dictadura. Muestra cómo la superioridad militar, la unidad de mando en el bando nacional y el aislamiento internacional de la República determinaron el resultado. Históricamente, simboliza el drama de un país fracturado donde el control del territorio y los recursos (trigo en la zona nacional, industria en la republicana) fue tan determinante como las batallas en el frente.`,
     },
    { titulo: "Dibujo de la entrevista en Hendaya", 
      descripcion: "Encuentro entre Franco y Hitler en octubre de 1940",
      imagen: "franco_hitler.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Fotografía histórica (reportaje de prensa).
•	Autor: Heinrich Hoffmann (fotógrafo oficial de Hitler) y fotógrafos de la agencia EFE. Existe una famosa polémica sobre una versión retocada de la imagen para mejorar la apariencia de Franco.
•	Cronología: 23 de octubre de 1940.
•	Estilo: Fotografía documental de propaganda política. La imagen busca transmitir una sensación de igualdad y camaradería entre ambos dictadores.
2. Ubicación
El encuentro tuvo lugar en la estación de tren de Hendaya, en la Francia ocupada (zona bajo control alemán), justo en la frontera con España. Franco llegó en su tren blindado para reunirse con el Führer en el vagón de este.
3. Contexto histórico
•	La Segunda Guerra Mundial (1939-1945): En octubre de 1940, Alemania acababa de derrotar a Francia y dominaba Europa. España, agotada tras la Guerra Civil (finalizada solo un año antes), se declaraba "no beligerante", una posición de apoyo moral al Eje sin entrar directamente en combate.
•	El objetivo de la reunión: Hitler quería que España entrara en la guerra para ocupar Gibraltar (Operación Félix) y cerrar el Mediterráneo a los británicos. Franco, asesorado por su cuñado y ministro Ramón Serrano Suñer, pedía a cambio ambiciosas compensaciones territoriales en el norte de África (territorios coloniales franceses) y suministros de alimentos y combustible que Alemania no estaba dispuesta a dar.
4. Qué representa y contenido (La negociación)
La imagen muestra a Adolf Hitler y Francisco Franco saludando a las tropas o conversando en el andén:
•	Simbología del uniforme: Ambos visten uniformes militares, subrayando el carácter castrense y totalitario de sus regímenes. Franco viste el uniforme de la Falange con la boina roja carlista, simbolizando el partido único (FET y de las JONS).
•	El resultado del encuentro: La entrevista fue un fracaso diplomático. No se llegó a un acuerdo concreto para la entrada de España en la guerra. Hitler llegó a decir más tarde que prefería "que le arrancaran tres o cuatro muelas antes de volver a hablar con Franco".
•	El Protocolo de Hendaya: Se firmó un protocolo secreto donde España se comprometía a entrar en la guerra en una fecha sin determinar, lo que permitió a Franco mantener la amistad con el Eje sin arriesgarse a una invasión británica o al colapso por falta de recursos.
5. Significado histórico
Representa el periodo de tentación totalitaria del franquismo. Aunque España no entró oficialmente en la guerra, esta cercanía llevó al envío de la División Azul (1941) para luchar junto a los nazis en el frente ruso. Tras la derrota del Eje en 1945, el régimen de Franco intentó ocultar o restar importancia a esta imagen para sobrevivir al aislamiento internacional, presentándola como una "hábil prudencia" del dictador para evitar que España fuera arrastrada al conflicto mundial.`,
    },
    { titulo: "Bienvenido Mr Marshall", 
      descripcion: "Material publicitario del film de Berlanga sobre el Plan Marshall",
      imagen: "bienvenido_marshall.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Cartel cinematográfico (litografía publicitaria).
•	Autor: La película fue dirigida por Luis García Berlanga, con guion de Juan Antonio Bardem y Miguel Mihura. El diseño del cartel suele atribuirse a los talleres de artes gráficas que trabajaban para la productora UNINCI.
•	Cronología: 1953.
•	Estilo: Estética costumbrista y satírica. El cartel utiliza elementos folclóricos españoles (sombreros cordobeses, mantones) contrastados con la iconografía estadounidense (banderas de barras y estrellas, coches de lujo).
2. Ubicación y contexto histórico
•	El fin del Aislamiento (1951-1953): Tras años de autarquía y bloqueo internacional tras la Segunda Guerra Mundial, el régimen de Franco comienza a ser aceptado por el bloque occidental debido a la Guerra Fría.
•	Los Acuerdos con EE. UU. (1953): En el mismo año del estreno de la película, se firman los Pactos de Madrid, que permitieron la instalación de bases militares estadounidenses en suelo español a cambio de ayuda económica y militar.
•	El Plan Marshall: El título hace referencia al European Recovery Program (Plan Marshall), del cual España había sido excluida tras la guerra por el carácter fascista del régimen, lo que generó un sentimiento de agravio y una espera ansiosa de ayuda exterior.
3. Qué representa y contenido (La sátira del "mister")
El cartel y la película representan la "puesta en escena" de un pueblo castellano ficticio (Villar del Río) que se disfraza de tópico andaluz para agradar a los americanos:
•	El Estereotipo: La imagen de los personajes vestidos de "majos" y gitanos refleja cómo el régimen utilizaba el folclore como seña de identidad nacional frente al exterior.
•	La Ilusión Colectiva: Los habitantes del pueblo depositan sus sueños de prosperidad en la llegada de la delegación estadounidense, que finalmente pasa de largo sin detenerse, dejando al pueblo sumido en la misma pobreza y polvo que al principio.
•	Crítica Social: Bajo la apariencia de una comedia inofensiva, Berlanga critica la sumisión ante el poder extranjero, la hipocresía de las autoridades locales (el alcalde, el cura, el hidalgo) y la situación de atraso técnico y agrario de la España rural.
4. Significado histórico
Representa la "apertura" controlada del franquismo. La película logró burlar la censura de la época y llegó a ser premiada en el Festival de Cannes, aunque fue criticada por algunos sectores del régimen por mostrar una imagen de España demasiado "pueblerina". Históricamente, simboliza el inicio de la influencia cultural de EE. UU. en España (la "americanización") y el fracaso de la autarquía económica, dando paso a los años del desarrollismo que vendrían en la década siguiente.`,
    },
    { titulo: "Muerte de Franco", 
      descripcion: "Documento periodístico del 20 de noviembre de 1975",
      imagen: "franco-muerto.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Fuente primaria de carácter periodístico (prensa escrita).
•	Cabeceras: El diario "ABC" (monárquico y conservador) y el diario "Ya" (de inspiración católica, muy influyente durante el régimen).
•	Cronología: 20 de noviembre de 1975.
•	Titular: El famoso "FRANCO HA MUERTO", que ocupaba toda la anchura de la página, acompañado de una fotografía del dictador uniformado y, en ocasiones, de un crespón negro en señal de luto oficial.
2. Ubicación y difusión
Estos diarios se distribuían en toda España. La noticia fue comunicada oficialmente por el presidente del Gobierno, Carlos Arias Navarro, a través de Televisión Española con su célebre y emocionado "Españoles, Franco ha muerto". Las portadas de los periódicos aquel día se agotaron en los quioscos y hoy se conservan en la Hemeroteca Nacional.
3. Contexto histórico
•	El final del Franquismo: En 1975, el régimen se encontraba en una profunda crisis. Franco, anciano y enfermo (Parkinson y problemas cardíacos), llevaba semanas en agonía.
•	Tensiones finales: El país vivía un clima de violencia política (atentados de ETA y el FRAP), las últimas ejecuciones del régimen (septiembre de 1975), la Marcha Verde en el Sáhara Occidental y una fuerte oposición social y obrera.
•	La coincidencia de fechas: Franco murió el mismo día que José Antonio Primo de Rivera (fundador de la Falange), lo que otorgaba una carga simbólica añadida para los sectores más inmovilistas del régimen.
4. Qué representa y contenido (Análisis del mensaje)
La portada no es solo una esquela, sino un mensaje político:
•	Legitimidad Dinástica: Junto a la noticia de la muerte, estos diarios solían incluir referencias a la proclamación de Juan Carlos I como Rey de España, conforme a la Ley de Sucesión de 1947. Se buscaba transmitir una sensación de continuidad y orden ("atado y bien atado").
•	El Testamento Político: En las páginas interiores se reproducía el testamento de Franco, donde pedía perdón a sus enemigos y exhortaba a los españoles a mantenerse unidos en torno al futuro Rey y las instituciones del Movimiento Nacional.
•	Iconografía: La elección de una foto de Franco joven o en plenitud de mando (uniforme de Capitán General) buscaba dignificar la figura del "Caudillo" en el momento de su desaparición física.
5. Significado histórico
Representa el punto de inflexión definitivo en la historia contemporánea de España. La muerte biológica de Franco permitió la apertura de un proceso de reforma desde dentro de las instituciones (liderado por Adolfo Suárez y el Rey) que, mediante la Ley para la Reforma Política, conduciría a las primeras elecciones democráticas en junio de 1977.
Esta imagen simboliza el paso de la dictadura a la democracia, un proceso conocido como la Transición, que culminaría con la aprobación de la Constitución de 1978.`,
    },
    { titulo: "El Abrazo (Juan Genovés): ", 
      descripcion: "Pintura que simboliza la reconciliación durante la Transición Española",
      imagen: "el-abrazo.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Pintura al óleo sobre lienzo.
•	Autor: Juan Genovés, pintor valenciano vinculado al realismo social y al pop-art crítico.
•	Cronología: Pintado en 1976, un año después de la muerte de Franco y en pleno inicio del proceso de cambio político.
•	Estilo: Realismo Crítico. Genovés utiliza una estética deudora del cartelismo y la fotografía aérea, centrada en la multitud y el movimiento.
2. Ubicación
La obra original se encuentra en el Museo Nacional Centro de Arte Reina Sofía, en Madrid. Además, existe una famosa reproducción en forma de escultura de bronce (obra del propio Genovés) situada en la Plaza de Antón Martín (Madrid), que sirve como monumento a los Abogados de Atocha asesinados en 1977.
3. Contexto histórico
•	El inicio de la Transición (1975-1978): Tras la muerte del dictador, España vive un periodo de enorme tensión pero también de esperanza. El cuadro se pinta en el año en que Adolfo Suárez es nombrado presidente y comienza a desmantelar las estructuras del Movimiento Nacional.
•	La amnistía y la reconciliación: En ese momento, la principal reivindicación de la oposición democrática (izquierda y nacionalistas) era la amnistía para los presos políticos. El cuadro fue originalmente un cartel encargado por la Junta Democrática para pedir dicha libertad.
•	La violencia política: La obra surge en un contexto de gran inestabilidad, con huelgas, manifestaciones y el terrorismo de grupos como ETA o el GRAP, lo que otorga al mensaje de "abrazo" y unidad una urgencia histórica.
4. Qué representa y contenido (Análisis formal)
•	La composición: Vemos a un grupo de personas de espaldas, corriendo o caminando hacia un centro común para fundirse en un abrazo. La perspectiva elevada (vista de pájaro) es típica de Genovés, quien solía pintar multitudes como pequeñas hormigas.
•	El anonimato: Los personajes no tienen rostro definido; representan al pueblo español anónimo. Es un abrazo colectivo, no individual, lo que simboliza que la democracia fue un logro de toda la sociedad.
•	El uso del color: Predominan los tonos grises, ocres y apagados, propios de la estética de la época, pero el dinamismo de las figuras sugiere una explosión de energía y alivio contenida durante décadas.
•	El simbolismo: Las figuras parecen estar en un espacio vacío, lo que enfatiza el acto del encuentro humano por encima de cualquier escenario político específico. Es la imagen de la "paz sin victoria" que buscaba superar la herida de la Guerra Civil.
5. Significado histórico
Representa el espíritu del consenso. En el ámbito de la PAU, esta obra explica visualmente la voluntad de los españoles de "perdonar y olvidar" el enfrentamiento fratricida para construir un sistema democrático basado en el diálogo. Fue el cartel más difundido de la época (se imprimieron 500.000 copias que fueron incautadas por la policía en su momento) y hoy es el símbolo del éxito de la Transición y de la Constitución de 1978.`,
    },
    { titulo: "28.	Fotografía de la firma de la Constitución de 1978", 
      descripcion: "El rey Juan Carlos I sancionando la Carta Magna ante las Cortes",
      imagen: "firma-constitucion.jpg",
      explicacion: `1. Definición, autoría y cronología
•	Tipo de obra: Fotografía histórica / Documento institucional.
•	Autor: Fotógrafos de la Casa Real y de agencias de prensa (como EFE).
•	Cronología: 27 de diciembre de 1978.
•	Momento capturado: El acto solemne en el que el Rey sanciona (firma) el texto constitucional ante las Cortes Generales.
2. Ubicación
El acto tuvo lugar en el Palacio de las Cortes (sede del Congreso de los Diputados), en Madrid. Es el espacio que simboliza el poder legislativo y la representación de la nación española.
3. Contexto histórico
•	El proceso constituyente (1977-1978): Tras las primeras elecciones democráticas de junio de 1977, las nuevas Cortes asumieron el encargo de redactar una Carta Magna. Los llamados "Siete Padres de la Constitución" (representantes de casi todo el arco parlamentario) redactaron el texto bajo la política del consenso.
•	El Referéndum: El pueblo español ratificó el texto de forma masiva en el referéndum del 6 de diciembre de 1978 (con un 87,7% de votos afirmativos).
•	La Sanción Real: Diez días después del referéndum, el Rey procedió a la sanción y promulgación, paso previo a su publicación en el BOE el 29 de diciembre.
4. Qué representa y contenido (Análisis de la escena)
La imagen reúne a los protagonistas de la nueva arquitectura del Estado:
•	El Rey Juan Carlos I: Aparece firmando el documento. Con este acto, el monarca renuncia a los poderes absolutos heredados del franquismo para convertirse en un jefe de Estado constitucional con funciones representativas y arbitrales.
•	La Familia Real: Suele aparecer la Reina Sofía y, en ocasiones, el entonces Príncipe Felipe, simbolizando la continuidad dinástica dentro del nuevo marco democrático.
•	Los representantes de las Cortes: Figuras como Antonio Hernández Gil (Presidente de las Cortes), Fernando Álvarez de Miranda (Presidente del Congreso) y Antonio Fontán (Presidente del Senado), que representan la legalidad de la soberanía nacional.
•	El entorno: El salón de plenos, con su decoración solemne, refuerza la trascendencia del momento: España deja de ser una dictadura para convertirse legalmente en un Estado social y democrático de Derecho.
5. Significado histórico
Representa la "mayoría de edad" de la democracia española.
•	Punto final: Supone la derogación definitiva de las Leyes Fundamentales del Reino (el entramado jurídico del franquismo).
•	Nuevo modelo: Establece la unidad de España y el derecho a la autonomía de las nacionalidades y regiones, la aconfesionalidad del Estado y una amplia carta de derechos y libertades civiles.
•	Legitimidad: Es la primera constitución de la historia de España que no es impuesta por un partido sobre otro, sino que nace del acuerdo general, permitiendo la convivencia de ideologías opuestas bajo unas mismas reglas de juego.`,
    }
  ]
};
export const TEXTOS_BLOQUES: Record<string, BloqueTexto[]> = {
  "bloque-1": [],
  "bloque-2": [
    { titulo: "Edicto de Milán (313)", 
      descripcion: "Decreto de libertad religiosa en el Imperio Romano.",
      texto: `Yo, Constantino Augusto, y yo también, Licinio Augusto, reunidos felizmente en Milán [...] hemos juzgado que, entre todo lo que reporta provecho a la mayoría de los hombres, debíamos dictar sobre todo estas disposiciones: conceder a los cristianos y a todos los demás la libertad de practicar la religión que cada uno prefiera, para que cualquier divinidad que haya en el cielo sea propicia a nosotros y a todos los que viven bajo nuestro dominio. [...] Asimismo, por lo que toca a los cristianos, hemos decidido que les sean devueltos los lugares en los que antes solían reunirse.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político de carácter primario y fuente directa. Se trata de un edicto (ley con rango imperial) promulgado de forma conjunta por los emperadores Constantino I (Occidente) y Licinio (Oriente). Su naturaleza es pública y su contenido establece la libertad de culto en todo el Imperio Romano.
2. Contexto histórico
El texto data del año 313 d.C., un momento de profunda transformación en el Bajo Imperio Romano. Tras siglos de persecuciones contra los cristianos (como las de Nerón o, más recientemente, Diocleciano), el Imperio se encontraba en una crisis de unidad. Constantino, tras su victoria en la batalla del Puente Milvio, comprendió que el cristianismo era una fuerza social y política en ascenso que no podía ser erradicada.
Este edicto no convierte al cristianismo en religión oficial (eso ocurriría más tarde con el Edicto de Tesalónica en el 380 d.C. bajo Teodosio I), pero marca el fin de la era de las catacumbas y el inicio de la paz de la Iglesia. En Hispania, esto permitió la consolidación de las sedes episcopales ya existentes (como las de Elvira o Tarraco) y la expansión pública del culto.
3. Explicación del contenido
El contenido del fragmento se puede sintetizar en tres puntos fundamentales:
•	Libertad religiosa: Establece el principio de tolerancia, permitiendo que tanto cristianos como seguidores de otras religiones practiquen su fe sin temor a represalias legales.
•	Fundamentación política: Los emperadores justifican la medida buscando el favor divino ("para que cualquier divinidad... sea propicia") para garantizar la estabilidad y prosperidad del Estado.
•	Restitución de bienes: El texto ordena la devolución inmediata de las propiedades confiscadas a las comunidades cristianas (cementerios, lugares de reunión, basílicas), reconociendo por primera vez a la Iglesia como una institución con capacidad legal para poseer bienes.`,
    },
  ],
  "bloque-3": [
    { titulo: "Código de las Siete Partidas", 
      descripcion: "Cuerpo normativo del reino de Castilla redactado bajo Alfonso X.",
      texto: `Vicarios de Dios son los reyes, cada uno en su reino, puestos sobre las gentes para mantenerlas en justicia y en verdad en cuanto a lo temporal, bien así como el emperador en su imperio. [...] El rey debe ser amado de sus pueblos por tres razones: la primera, porque es su señor; la segunda, porque es su padre y su guardador; la tercera, porque es su hacedor de bien. [...] Ley es la enseñanza que se da para creer y para guardar la fe, y para mantener a los hombres en paz y en justicia. La ley debe ser ligera de entender, y provechosa, y no debe ser contraria a la razón ni a la ley de Dios.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica de carácter primario. Las Siete Partidas constituyen el cuerpo legislativo más importante de la Edad Media hispánica, redactado en la Corona de Castilla durante el reinado de Alfonso X el Sabio (segunda mitad del siglo XIII). Su objetivo fue unificar el derecho del reino mediante la recepción del Derecho Romano-Canónico (el Ius Commune).
2. Contexto histórico
El texto se enmarca en la Baja Edad Media (siglo XIII). Tras la gran expansión territorial de Fernando III, su hijo Alfonso X buscó consolidar el poder de la Corona frente a la nobleza y los fueros locales. En este periodo, las monarquías europeas iniciaban una transición hacia el autoritarismo regio, apoyándose en juristas formados en universidades que recuperaban el derecho del antiguo Imperio Romano.
Aunque las Partidas no entraron en vigor inmediatamente debido a la resistencia de la nobleza (que prefería sus privilegios tradicionales), fueron finalmente ratificadas como derecho supletorio por el Ordenamiento de Alcalá de 1348. Su influencia fue tal que se mantuvieron vigentes en España y sus territorios americanos hasta el siglo XIX.
3. Explicación del contenido
El fragmento seleccionado refleja la nueva concepción del poder político y la ley:
•	Legitimidad Divina y Soberanía: Define al rey como "vicario de Dios", lo que otorga una base religiosa al poder monárquico. Establece que el rey tiene en su reino la misma autoridad absoluta que el Emperador en el Imperio, sentando las bases del Estado Moderno.
•	Paternalismo Real: Describe la relación entre el rey y sus súbditos no solo como una jerarquía de señorío, sino como un vínculo de protección ("padre y guardador") y beneficio mutuo, buscando la cohesión social bajo el mando único.
•	Definición de Ley: Establece que la ley debe ser racional, comprensible ("ligera de entender") y estar subordinada a la moral cristiana, pero subraya que su función principal es mantener la paz y la justicia, fines supremos del monarca bajo esta nueva visión del derecho.`,
    },
    { titulo: "Tratado de Almizra (1244)", 
      descripcion: "Cuerpo normativo del reino de Castilla redactado bajo Alfonso X.",
      texto: `Sepan todos que, por el bien de la paz y de la concordia, el muy noble don Fernando, rey de Castilla, y el muy ilustre don Jaime, rey de Aragón, han convenido el reparto de las tierras de Murcia y de sus términos. [...] Que desde la ciudad de Biar hasta el puerto de Alicante, y de allí siguiendo la costa hasta el límite de Villajoyosa, quede para el rey de Aragón. Y que desde el castillo de Chinchilla y la ciudad de Murcia, con todos sus castillos y tierras hasta la mar, sea para el rey de Castilla. [...] Prometieron ambos reyes por sí y por sus sucesores que ninguno de ellos entrará en la parte del otro para conquistarla ni para tomarla contra la voluntad del otro.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y diplomática de carácter primario. Se trata de un tratado fronterizo internacional firmado en 1244 entre la Corona de Castilla (representada por el infante Alfonso, futuro Alfonso X) y la Corona de Aragón (representada por Jaime I el Conquistador). Su objetivo fue delimitar las áreas de expansión y conquista en el Reino de Murcia.
2. Contexto histórico
El tratado se firma en el siglo XIII, el periodo de máxima actividad de la Reconquista cristiana. Tras la victoria de las Navas de Tolosa (1212), las dos coronas avanzaron rápidamente hacia el sur. Aragón había completado la conquista de Valencia, mientras que Castilla avanzaba hacia Murcia y Andalucía.
Sin embargo, las imprecisiones de tratados anteriores (como el de Cazola de 1179) generaron tensiones. Jaime I de Aragón había ocupado plazas que Castilla reclamaba como suyas (como Játiva o Villena). Ante el riesgo de un enfrentamiento armado entre cristianos, ambos monarcas se reunieron en el campo de Almizra (Alicante) para fijar una frontera definitiva que evitara conflictos durante el reparto de las tierras andalusíes.
3. Explicación del contenido
El fragmento detalla los puntos fundamentales del acuerdo territorial:
•	Fijación de la frontera: Establece una línea divisoria clara. Aragón se quedaba con las tierras al norte de la línea Biar-Busot-Alicante (consolidando el Reino de Valencia), mientras que Castilla se aseguraba la soberanía sobre el Reino de Murcia, que incluía el estratégico puerto de Cartagena.
•	Compromiso de no agresión: Los monarcas juran respeto mutuo a los límites establecidos, renunciando a conquistar territorios asignados a la otra corona. Esto garantizó la estabilidad política entre Castilla y Aragón durante el resto del siglo XIII.
•	Consolidación del mapa peninsular: Este tratado es fundamental porque detuvo la expansión hacia el sur de la Corona de Aragón, dejando el camino expedito a Castilla para la conquista de la mayor parte de Andalucía y el Reino de Granada, configurando así el mapa político de la Baja Edad Media española.`,
  },
  ],
  "bloque-4": [
    { titulo: "Tratado de Alcaçovas (1479)", 
      descripcion: "Acuerdo de paz entre Castilla y Portugal.",
      texto: `Quede para siempre a los dichos rey y reina de Castilla y de León [...] las islas de Canaria, ganadas o por ganar. Y queden a los dichos rey y príncipe de Portugal [...] todas las tierras descubiertas y por descubrir, así las islas de la Madera, de Puerto Santo y Desierto, e todas las islas de los Azores e islas de las Flores, e todas las islas del Cabo Verde [...] y toda la costa de Guinea, con sus minas de oro [...] e cualesquier otras islas que se hallaren o ganaren de las islas de la Canaria para abajo contra el Sur e contra el Poniente, e que no se ha de poder descubrir por los dichos de Castilla más abajo de la Canaria.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y diplomática de carácter primario. Se trata de un tratado de paz internacional firmado en 1479 en la localidad portuguesa de Alcaçovas (y ratificado en Toledo en 1480) entre las embajadas de los Reyes Católicos (Isabel I de Castilla y Fernando II de Aragón) y el rey Alfonso V de Portugal.
2. Contexto histórico
El tratado se enmarca en la Baja Edad Media, al inicio del reinado de los Reyes Católicos. Tras la muerte de Enrique IV de Castilla, estalló una guerra civil por la sucesión al trono (1475-1479) entre los partidarios de su hija, Juana "la Beltraneja" (apoyada por Portugal), y los de su hermana Isabel.
La victoria militar de las tropas isabelinas en la batalla de Toro y el desgaste portugués llevaron a esta negociación. El tratado no solo resolvió la cuestión dinástica en Castilla, sino que también abordó la creciente rivalidad entre ambas potencias por la hegemonía en el Océano Atlántico y la costa africana, en plena era de los grandes descubrimientos geográficos.
3. Explicación del contenido
El fragmento destaca los dos pilares fundamentales del acuerdo:
•	Resolución sucesoria: Portugal reconoce a Isabel I como reina legítima de Castilla, renunciando Alfonso V a sus pretensiones al trono y al matrimonio con Juana la Beltraneja. Esto consolida definitivamente la unión dinástica entre Castilla y Aragón.
•	Reparto de áreas de influencia (Tratado de Límites): Se establece el primer gran reparto oceánico de la historia moderna. Castilla se asegura la soberanía sobre las Islas Canarias (punto clave para la futura ruta a América), mientras que Portugal obtiene el monopolio de la navegación, comercio y conquista en toda la costa de África (Guinea, Azores, Madeira y Cabo Verde).
•	La frontera del paralelo: Se fija el paralelo de las Canarias como frontera de expansión: hacia el sur de dichas islas, solo Portugal puede navegar y descubrir. Este límite fue el que obligó a Cristóbal Colón, años después, a defender que su ruta hacia el Oeste no vulneraba lo pactado en este tratado, lo que conduciría posteriormente a la firma del Tratado de Tordesillas en 1494.`,
    },
    { titulo: "Capitulaciones de Santa Fe (1492)", 
      descripcion: "Acuerdos entre los Reyes Católicos y Cristóbal Colón.",
      texto: `Las cosas suplicadas y que Vuestras Altezas dan y otorgan a don Cristóbal Colón, en alguna satisfacción de lo que ha descubierto en las Mares Océanas y del viaje que ahora, con el ayuda de Dios, ha de hacer por ellas en servicio de Vuestras Altezas, son las que se siguen:
Primeramente que Vuestras Altezas como Señores que son de las dichas Mares Océanas hacen desde ahora al dicho don Cristóbal Colón su Almirante en todas aquellas islas y tierras firmes que por su mano o industria se descubrirán o ganarán [...] Asimismo que Vuestras Altezas hacen al dicho don Cristóbal su Visorrey y Gobernador General en todas las dichas tierras firmes e islas [...] que de todas y cualesquiera mercaderías [...] ganare, haya y tome para sí la décima parte de todo ello.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y administrativo de carácter primario. Se trata de una capitulación (contrato o acuerdo de concesión) firmado el 17 de abril de 1492 en Santa Fe (Granada) entre los Reyes Católicos e Cristóbal Colón. Establece las condiciones económicas y los privilegios políticos para la expedición que pretendía llegar a las Indias por la ruta del Oeste.
2. Contexto histórico
El documento se redacta en un año clave, 1492, que marca el fin de la Edad Media en España. Tras la toma de Granada (enero de 1492), los Reyes Católicos disponen de los recursos y el tiempo necesarios para atender el proyecto de Colón, que había sido rechazado previamente por Portugal.
La caída de Constantinopla (1453) había bloqueado las rutas terrestres hacia las especias de Oriente, obligando a las potencias atlánticas a buscar nuevas vías marítimas. Mientras Portugal bordeaba África, Castilla aceptó la arriesgada propuesta de Colón. Este texto es el punto de partida legal de la Edad Moderna y de la creación del Imperio español en América, aunque en ese momento se pensaba que el destino era Extremo Oriente (Cipango y Catay).
3. Explicación del contenido
El fragmento detalla las extraordinarias concesiones otorgadas a Colón, que reflejan un modelo de colonización aún semifeudal:
•	Títulos y honores: Se le nombra Almirante, Virrey y Gobernador de todas las tierras que descubra. Estos cargos se otorgan con carácter vitalicio y hereditario, otorgando a Colón un poder político inmenso en los nuevos territorios.
•	Beneficios económicos: Se establece el derecho al "diezmo" (la décima parte) de todas las riquezas, metales preciosos y mercaderías que se obtengan en la expedición.
•	Soberanía de la Corona: A pesar de los privilegios de Colón, el texto deja claro que las tierras se ganan "en servicio de Vuestras Altezas", asegurando que la soberanía final y la propiedad de los nuevos dominios pertenecen a la Corona de Castilla.
•	Naturaleza contractual: El texto funciona como una apuesta de riesgo; la Corona apenas aporta capital directo (proporcionado en parte por particulares y la villa de Palos), pero cede grandes cuotas de poder a cambio del éxito de la misión.`,
    },
    { titulo: "Edicto de Granada (1492)", 
      descripcion: "Decreto de expulsión de los judíos.",
      texto: `Nosotros, con el consejo y parecer de algunos prelados y grandes caballeros de nuestros reinos [...] hemos decidido mandar salir a todos los judíos y judías de nuestros reinos y que jamás tornen ni vuelvan a ellos ni a alguno de ellos. [...] Que hasta el fin del mes de julio próximo de este presente año, salgan de todos los dichos nuestros reinos y señoríos con sus hijos e hijas, criados y criadas, familiares judíos, así grandes como pequeños [...] y que no osen tornar a ellos [...] so pena de que si no lo hicieren así y fueren hallados en nuestros dichos reinos, caigan en pena de muerte y confiscación de todos sus bienes para nuestra Cámara y Fisco.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político de carácter primario y fuente directa. Se trata de un Decreto Real promulgado el 31 de marzo de 1492 en la ciudad de Granada por los Reyes Católicos (Isabel I de Castilla y Fernando II de Aragón). Su contenido ordena la expulsión de los practicantes de la religión judía de todos los territorios de las Coronas de Castilla y Aragón.
2. Contexto histórico
El documento se sitúa en el año 1492, un momento de inflexión en el que los Reyes Católicos buscaban la unificación religiosa como base de la cohesión del Estado Moderno. Tras la finalización de la Reconquista con la Toma de Granada en enero de ese mismo año, el judaísmo y el islamismo eran vistos como obstáculos para la homogeneidad social y el control político de la monarquía.
La decisión estuvo influenciada por la presión del Santo Oficio de la Inquisición (creada en 1478), que argumentaba que la presencia de judíos "contaminaba" a los cristianos nuevos (conversos), incitándolos a la apostasía. Este edicto supuso el fin de la coexistencia de las "Tres Culturas" en la Península y provocó el exilio de miles de personas (sefardíes) hacia el norte de África, el Imperio Otomano y Europa.
3. Explicación del contenido
El fragmento detalla las condiciones de la expulsión y las consecuencias del incumplimiento:
•	Obligatoriedad y perpetuidad: Se ordena la salida de todos los judíos, sin distinción de edad o sexo, y se prohíbe su regreso de manera indefinida bajo pena de muerte.
•	Plazo temporal: Se establece un margen de cuatro meses (hasta finales de julio) para que liquiden sus asuntos y abandonen el territorio peninsular.
•	Confiscación de bienes: El texto amenaza con la pérdida de todas las posesiones a favor del Estado para quienes desobedezcan el plazo. Aunque el edicto original permitía a los judíos vender sus bienes y llevarse sus pertenencias, en la práctica se prohibió la salida de oro, plata y moneda, lo que supuso una enorme pérdida patrimonial para los expulsados.
•	Unidad de fe: El objetivo último no era solo la expulsión, sino forzar la conversión al cristianismo de aquellos que desearan permanecer en sus tierras, consolidando así el modelo de Estado católico que caracterizaría a la Monarquía Hispánica en los siglos siguientes.`,
    },
    { titulo: "Tratado de Tordesillas (1494)", 
      descripcion: "Reparto del Atlántico y el Nuevo Mundo.",
      texto: `Que se trace y señale por el dicho mar Océano una raya o línea derecha de polo a polo, del polo Ártico al polo Antártico, que es de norte a sur, la cual raya o línea e señal se haya de dar e dé derecha, como dicho es, a trescientas setenta leguas de las islas de Cabo Verde para la parte de poniente [...] y que todo lo que hasta aquí se ha hallado y descubierto, y de aquí adelante se hallare y descubriere por el dicho señor rey de Portugal y por sus navíos, así islas como tierra firme, yendo por la dicha parte del levante [...] quede y pertenezca al dicho señor rey de Portugal y a sus sucesores. Y que todo lo otro [...] que es hallado y descubierto, y se hallare y descubriere por los dichos señores rey y reina de Castilla y de Aragón [...] yendo por la dicha parte del poniente, sea y quede y pertenezca a los dichos señores rey y reina y a sus sucesores.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y diplomático de carácter primario y fuente directa. Se trata de un tratado internacional firmado el 7 de junio de 1494 en la villa de Tordesillas (Valladolid) entre los representantes de los Reyes Católicos y los de Juan II de Portugal. Su función fue el reparto de las zonas de navegación y conquista del Océano Atlántico y del "Nuevo Mundo".
2. Contexto histórico
El documento se enmarca en la era de los Grandes Descubrimientos. Tras el regreso de Colón de su primer viaje (1493), las tensiones entre las dos potencias ibéricas se dispararon. Portugal consideraba que las nuevas tierras pertenecían a su área de influencia según el Tratado de Alcaçovas (1479). Por su parte, los Reyes Católicos habían obtenido del papa Alejandro VI las Bulas Inter Caetera, que fijaban una línea de demarcación a solo 100 leguas de las Azores.
Juan II de Portugal, descontento con la cercanía de esa línea que limitaba sus rutas hacia África y el Índico, forzó una negociación directa con Castilla. El resultado fue este tratado, que desplazó la frontera imaginaria más hacia el oeste, permitiendo a Portugal una mayor libertad de movimientos en el Atlántico Sur y, de forma involuntaria en aquel momento, la futura colonización de Brasil.
3. Explicación del contenido
El fragmento destaca los acuerdos que configuraron la hegemonía colonial de los siglos siguientes:
•	Nueva Línea de Demarcación: El punto clave es el establecimiento de una línea situada a 370 leguas al oeste de las islas de Cabo Verde. Este cambio respecto a las 100 leguas papales fue una concesión de Castilla para evitar una guerra con Portugal.
•	Reparto Hemisférico: El mundo queda dividido en dos sectores: el Levante (Oriente) para Portugal, lo que le aseguraba la ruta de las especias bordeando África; y el Poniente (Occidente) para Castilla, otorgándole la práctica totalidad del continente americano.
•	Compromiso de Exclusividad: Ambas coronas se comprometen a respetar la zona de influencia de la otra y a no realizar descubrimientos en el área ajena. Este tratado representa el primer reparto del mundo entre dos naciones modernas, ignorando los derechos de las poblaciones indígenas y las pretensiones de otras potencias europeas.`,
    },
    { titulo: "Testamento de Isabel la Católica (1504)", 
      descripcion: "Documento sucesorio de Isabel I.",
      texto: `Y no consientan ni den lugar que los indios, vecinos y moradores de las dichas Islas y Tierra Firme, ganados y por ganar, reciban agravio alguno en sus personas ni bienes, mas manden que sean bien y justamente tratados, y si algún agravio han recibido, lo remedien [...] Otrosí, suplico al Rey mi señor muy afectuosamente, y encargo y mando a la dicha Princesa mi hija y al dicho Príncipe su marido, que como católicos príncipes tengan mucho cuidado de la población y pacificación de las dichas islas y Tierra Firme [...] y que siempre obedezcan los mandamientos de la Santa Madre Iglesia.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y político de carácter primario y fuente directa. Se trata de un fragmento del Testamento y Codicilo (última voluntad) dictado por la reina Isabel I de Castilla en noviembre de 1504. Tiene un valor constitucional y ético, ya que establece las directrices para la sucesión al trono y las normas morales que deben regir el gobierno de las Indias.
2. Contexto histórico
El documento se redacta en los últimos días de vida de la reina, en un momento de gran incertidumbre política. Tras la muerte de sus hijos mayores (Juan e Isabel) y de su nieto Miguel, la heredera legítima era su hija Juana I ("la Loca"), casada con Felipe el Hermoso. Ante los signos de inestabilidad mental de Juana y la desconfianza hacia Felipe, Isabel intenta asegurar la estabilidad de Castilla y la continuidad de su proyecto político.
Además, el texto se sitúa doce años después del Descubrimiento de América (1492). En este periodo, ya habían comenzado las denuncias sobre los abusos cometidos contra la población indígena bajo el sistema de encomiendas. Con este testamento, la reina intenta fijar una base moral para la colonización, considerando a los indios súbditos de la Corona de Castilla.
3. Explicación del contenido
El fragmento destaca tres puntos fundamentales que suelen analizarse en las pruebas de acceso:
•	Protección de los indígenas: Isabel expresa su voluntad de que los habitantes de las Indias no reciban "agravio alguno en sus personas ni bienes". Es considerado uno de los primeros precedentes del derecho de gentes y de los Derechos Humanos, al exigir un trato justo para los indios como súbditos de pleno derecho.
•	Sucesión y Unidad: Al dirigirse a su hija Juana y a su yerno Felipe, subraya que deben mantener la "pacificación" y el buen gobierno de los territorios americanos como parte integrante de la monarquía, reforzando la herencia isabelina frente a posibles desviaciones políticas.
•	Evangelización: Reitera el compromiso de la Corona con la "Santa Madre Iglesia", justificando la presencia española en América a través de la misión evangelizadora encomendada por las Bulas Papales de Alejandro VI.
•	Recomendación a Fernando: El texto también incluye una petición a su marido, Fernando el Católico, para que actúe como regente en caso de que Juana no pueda gobernar, intentando evitar que la nobleza castellana o el propio Felipe el Hermoso desestabilizaran el reino.`,
    },
    { titulo: "Leyes de Burgos (1512)", 
      descripcion: "Primeras leyes para la organización de la conquista.",
      texto: `Ordenamos y mandamos que de aquí adelante los dichos indios sean puestos en encomienda a las personas que Nos señalaremos [...] y que cada uno de los dichos encomenderos sea obligado a les hacer una casa de paja y madera, y que tengan sus camas de hamacas, y que no consientan que duerman en el suelo. [...] Asimismo, mandamos que los dichos encomenderos sean obligados a los traer a la enseñanza de las cosas de nuestra Santa Fe Católica. [...] Y porque nuestra voluntad es que los dichos indios trabajen en las minas y en otras cosas, mandamos que se les dé de comer bien, y que no se les dé carga excesiva, y que las mujeres preñadas no trabajen en las minas ni hagan trabajos pesados.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario y fuente directa. Se trata de un conjunto de ordenanzas (35 leyes) sancionadas por el rey Fernando el Católico (como regente de Castilla) en la ciudad de Burgos en 1512. Representan el primer cuerpo legal de carácter general dictado para el gobierno y la protección de los indígenas en el Nuevo Mundo.
2. Contexto histórico
El documento surge como respuesta a la crisis ética y jurídica provocada por los abusos de los conquistadores en las Antillas. El detonante directo fue el Sermón de Adviento de Fray Antonio de Montesinos (1511), quien denunció desde el púlpito en La Española el sistema de encomiendas y el maltrato a los indios, calificándolo de pecado mortal.
Ante la gravedad de las acusaciones, Fernando el Católico convocó una junta de teólogos y juristas en Burgos para debatir si los indios eran libres y si era lícito obligarlos a trabajar. El texto intenta conciliar dos intereses contrapuestos: la necesidad de mano de obra para la economía colonial (minas y agricultura) y la obligación moral de la Corona de evangelizar y proteger a los indígenas como súbditos libres, tal como había pedido Isabel la Católica en su testamento.
3. Explicación del contenido
El fragmento ilustra la naturaleza ambivalente de estas leyes, que buscaban humanizar la explotación sin suprimirla:
•	Institucionalización de la Encomienda: El texto ratifica el sistema por el cual se "encomendaba" un grupo de indios a un español para que trabajaran para él. A cambio, el encomendero debía protegerlos y alimentarlos.
•	Protección y Bienestar Material: Se establecen normas pioneras de "derecho laboral" para la época: la obligación de proporcionar vivienda adecuada (hamacas), una alimentación correcta y la exención de trabajos pesados para mujeres embarazadas y niños.
•	Prioridad de la Evangelización: Se subraya que la justificación última de la presencia española es la instrucción en la "Santa Fe Católica", obligando al encomendero a garantizar la formación religiosa de los indios.
•	Condición Jurídica del Indio: Las leyes parten de la premisa de que el indio es un hombre libre con derecho a tener bienes propios, pero que, debido a su supuesta "naturaleza inclinada a la ociosidad", debe ser obligado a trabajar bajo la tutela de los españoles para asegurar su progreso y cristianización.`,
    },
    { titulo: "Requerimiento (1513)", 
      descripcion: "Texto legal leído a los indígenas americanos.",
      texto: `De parte del rey don Fernando y de la reina doña Juana, su hija, domadores de las gentes bárbaras, nosotros sus criados os notificamos y hacemos saber, como mejor podemos, que Dios nuestro Señor, uno y eterno, creó el cielo y la tierra... De todas estas gentes Dios nuestro Señor dio cargo a uno, que fue llamado san Pedro, para que de todos los hombres del mundo fuese señor y superior a quien todos obedeciesen... Uno de los Pontífices pasados hizo donación de estas islas y tierra firme del mar Océano a los dichos Reyes y a sus sucesores.
Por ende, os ruego y requiero que entendáis bien esto que os he dicho... y reconozcáis a la Iglesia por señora y superiora del universo mundo, y al Sumo Pontífice, llamado Papa, en su nombre, y al Rey y reina doña Juana, nuestros señores, en su lugar... Si así lo hiciereis, haréis bien... y si no lo hiciereis, o en ello dilación maliciosamente pusiereis, certificoos que con la ayuda de Dios, nosotros entraremos poderosamente contra vosotros, y os haremos guerra por todas las partes y maneras que pudiéramos... y tomaremos vuestras personas y de vuestras mujeres e hijos y los haremos esclavos.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político y religioso de carácter primario. Se trata de una notificación legal o pregón redactado por el jurista Juan López de Palacios Rubios en 1513. Su función era ser leído en voz alta por los conquistadores españoles a las poblaciones indígenas para exigirles su sumisión a la Corona y su conversión al cristianismo antes de iniciar cualquier acción militar.
2. Contexto histórico
El documento surge en el marco de la conquista de América (siglo XVI), durante la regencia de Fernando el Católico. Tras las denuncias de abusos de los dominicos (Sermón de Montesinos) y la promulgación de las Leyes de Burgos (1512), la Corona necesitó una base legal que justificara la "guerra justa".
El Requerimiento intentaba resolver el dilema ético y jurídico de la ocupación: según la doctrina de la época, si los indios eran informados de la existencia de Dios y de la donación papal de sus tierras a Castilla, y aun así se negaban a someterse, se convertían en "rebeldes", lo que legitimaba su esclavitud y la confiscación de sus bienes mediante la guerra. En la práctica, el texto se leía a menudo en castellano y a grandes distancias, por lo que los indígenas no podían comprenderlo.
3. Explicación del contenido
El fragmento detalla la estructura lógica en la que se basaba la soberanía española:
•	Fundamento Teocrático: El texto comienza explicando la creación del mundo por Dios y la autoridad universal del Papa como sucesor de San Pedro. Se utiliza la donación pontificia (Bulas Inter Caetera) como título de propiedad legítimo sobre América.
•	Exigencia de Sumisión: Se "requiere" a los indígenas que reconozcan la superioridad de la Iglesia y el señorío de los Reyes de Castilla. Se les ofrece un trato pacífico y privilegios si aceptan el vasallaje voluntario.
•	La Amenaza de la Guerra: El punto más crítico es la advertencia final. Si los indígenas rechazan el requerimiento, la responsabilidad de la violencia recae sobre ellos ("la culpa de las muertes y daños que de ello se recrecieren sea vuestra"). Esto autorizaba a los españoles a hacerles la guerra, esclavizarlos y vender sus posesiones, proporcionando la cobertura legal necesaria para la expansión militar.`,
    },
    { titulo: "Leyes Nuevas (1542)", 
      descripcion: "Reforma del gobierno de Indias y protección de los naturales.",
      texto: `Ordenamos y mandamos que de aquí adelante, por ninguna causa de guerra ni otra alguna, aunque sea so título de rebelión [...] no se pueda hacer esclavo a indio alguno, y queremos que sean tratados como vasallos nuestros de la Corona de Castilla, pues lo son. [...] Asimismo, ordenamos y mandamos que de aquí adelante ningún visorrey, gobernador, ni otra persona alguna, pueda encomendar indios por nueva provisión [...] y muriendo la persona que tuviere los dichos indios, vuelvan a nuestra Corona Real. [...] Mandamos que se quiten todas las encomiendas que tienen los obispos, monasterios y hospitales, y las que tienen los gobernadores y oficiales nuestros.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de una recopilación de leyes (las Leyes y ordenanzas nuevamente hechas para la gobernación de las Indias) promulgadas por el emperador Carlos I (Carlos V de Alemania) en Barcelona en 1542. Su objetivo fue reformar la administración de los territorios americanos y mejorar las condiciones de vida de la población indígena.
2. Contexto histórico
El documento se sitúa en la mitad del siglo XVI, coincidiendo con la fase de consolidación del Imperio español tras las grandes conquistas de México y Perú. El texto es el resultado directo de la "Controversia de Valladolid" y de las incansables denuncias de Bartolomé de las Casas, quien expuso ante la Corte los horrores del sistema de encomiendas y la explotación de los nativos.
Carlos I, influido por las corrientes del humanismo cristiano y la Escuela de Salamanca (Francisco de Vitoria), buscaba no solo la salvación espiritual de sus súbditos, sino también frenar el creciente poder de los encomenderos. Estos se estaban convirtiendo en una aristocracia colonial que amenazaba la autoridad directa de la Corona sobre las nuevas tierras. La promulgación de estas leyes provocó graves rebeliones de colonos, especialmente en el Virreinato del Perú.
3. Explicación del contenido
El fragmento destaca las medidas más revolucionarias de la reforma:
•	Abolición de la esclavitud indígena: Se prohíbe taxativamente la esclavitud de los indios bajo cualquier pretexto (incluso el de "guerra justa"), reconociéndolos definitivamente como vasallos libres de la Corona de Castilla.
•	Extinción de la Encomienda: El texto establece el fin del carácter hereditario de las encomiendas. Al morir el titular, los indios no pasarían a sus hijos, sino que quedarían bajo control directo del Rey. Esto suponía la herida de muerte para el sistema de explotación feudal en América.
•	Recuperación de la soberanía real: Se ordena la retirada inmediata de encomiendas a funcionarios reales, clero y hospitales. Con esto, la monarquía buscaba centralizar el poder y asegurar que el beneficio del trabajo indígena fluyera hacia las arcas reales y no hacia los bolsillos de los colonos.
•	Reforma administrativa: Las Leyes Nuevas también crearon el Virreinato del Perú y reorganizaron las Audiencias, dotando al Imperio de una estructura burocrática más moderna y controlada desde la metrópoli.`,
    },
    { titulo: "Decreto de expulsión de los moriscos (1609)", 
      descripcion: "Orden de Felipe III.",
      texto: `Entendido el grave pecado que en nuestra santa fe cometen los moriscos de este Reino de Valencia [...] y que con sus juntas y conciliábulos intentan la ruina de la cristiandad y de estos nuestros reinos; hemos resuelto que todos los moriscos de este dicho reino, hombres, mujeres y niños, salgan de él y vayan a las partes que se les ordenaren dentro de tres días [...] so pena de muerte y confiscación de sus bienes. [...] Que los que no salieren dentro del dicho término puedan ser muertos por cualquiera persona que los hallare sin incurrir en pena alguna. [...] Y para que se conserven las casas, ingenios de azúcar y cosechas, permitimos que de cada cien familias queden seis con sus hijos pequeños para que den instrucción en el cultivo a los nuevos pobladores.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y político de carácter primario y fuente directa. Se trata del Real Decreto promulgado por el rey Felipe III en 1609 (específicamente el bando dictado por el Marqués de Caracena para el Reino de Valencia). Su función es ordenar el destierro forzoso y definitivo de la población morisca (cristianos de origen musulmán) de todos los territorios de la Monarquía Hispánica.
2. Contexto histórico
El documento se sitúa en el reinado de Felipe III, bajo la influencia de su valido, el Duque de Lerma. A pesar de la conversión forzosa de los mudéjares decretada por los Reyes Católicos y Carlos I un siglo antes, los moriscos mantenían su lengua, costumbres y, en muchos casos, su fe islámica en la clandestinidad.
La decisión fue motivada por varios factores: la presión de la Iglesia y de la Inquisición, el temor a una invasión turca o pirata berberisca apoyada por los moriscos (problema de seguridad nacional) y el deseo de la Corona de dar un golpe de efecto para reafirmar su prestigio católico tras las treguas en Europa (Tregua de los Doce Años). La expulsión comenzó en Valencia (donde la población morisca era más numerosa y suponía un tercio del total) y se extendió al resto de reinos hasta 1614.
3. Explicación del contenido
El fragmento destaca el rigor de la medida y sus consecuencias socioeconómicas:
•	Justificación religiosa y política: Se acusa a los moriscos de "herejía" y de conspirar contra la cristiandad ("conciliábulos"), presentándolos como una amenaza interna insostenible para el Estado.
•	Radicalidad de la medida: Se impone un plazo de solo tres días para abandonar el reino bajo pena de muerte. El texto incluso autoriza a cualquier ciudadano a matar a aquellos moriscos que permanezcan fuera de plazo, lo que refleja la extrema dureza del decreto.
•	Impacto económico: El fragmento revela la preocupación por el colapso agrícola. Los moriscos eran expertos en el regadío y cultivos específicos (como el azúcar). Por ello, el decreto permite que un pequeño porcentaje (6%) permanezca temporalmente para enseñar las técnicas de cultivo a los nuevos repobladores cristianos, intentando mitigar la ruina económica de los señores feudales que perdían su mano de obra.
•	Consecuencias demográficas: La expulsión de unos 300,000 moriscos provocó un vacío demográfico en zonas como Valencia y Aragón que tardó décadas en recuperarse, afectando gravemente a la producción agrícola y al sistema señorial.`,
    },
    { titulo: "Tratado de Westfalia (1648)", 
      descripcion: "Fin de la Guerra de los Treinta Años.",
      texto: `Habrá una paz cristiana, universal y perpetua, y una amistad verdadera y sincera entre Su Majestad Imperial y Su Majestad Cristianísima [el Rey de Francia], como también entre todos y cada uno de los aliados [...] Que cada uno sea libre de profesar la religión que quiera, ya sea la católica, la luterana o la calvinista, sin que por ello sea perseguido ni molestado en sus bienes. [...] Que los Países Bajos sean reconocidos como Estados libres y soberanos, y que el Rey de España renuncie a toda pretensión sobre ellos. [...] Que todos los Estados del Imperio disfruten de su derecho de soberanía, tanto en asuntos eclesiásticos como políticos, y que puedan concertar alianzas entre sí y con extranjeros para su preservación y seguridad.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político y diplomático de carácter primario. Se trata del conjunto de tratados (Münster y Osnabrück) que conforman la Paz de Westfalia de 1648. Su función fue poner fin a la Guerra de los Treinta Años en Alemania y a la Guerra de los Ochenta Años entre España y las Provincias Unidas (Países Bajos).
2. Contexto histórico
El documento se sitúa a mediados del siglo XVII, bajo el reinado de Felipe IV y el gobierno de sus validos tras la caída de Olivares. La Guerra de los Treinta Años (1618-1648), iniciada por motivos religiosos en el Imperio, se convirtió en una lucha por la hegemonía europea. España, aliada de los Habsburgo austríacos, se enfrentó a una coalición liderada por Francia (gobernada por el cardenal Richelieu y Mazarino), las potencias protestantes y los Países Bajos.
Westfalia certifica el declive definitivo de la Monarquía Hispánica como potencia hegemónica. Tras la derrota en la batalla de Rocroi (1643) y el agotamiento de los recursos de Castilla, España se vio obligada a aceptar un nuevo orden internacional donde el poder ya no residía en la unidad religiosa o imperial, sino en el equilibrio entre estados soberanos.
3. Explicación del contenido
El fragmento ilustra los principios del nuevo orden mundial (el "Sistema de Westfalia"):
•	Reconocimiento de la independencia de los Países Bajos: España renuncia definitivamente a su soberanía sobre las Provincias Unidas, poniendo fin a un conflicto de ocho décadas y reconociendo el nacimiento de una nueva potencia marítima.
•	Soberanía de los Estados: Se establece que los estados del Imperio tienen derecho a su propia política exterior y alianzas. Esto debilita definitivamente el poder del Emperador y de los Austrias, favoreciendo el ascenso de Francia.
•	Pluralismo religioso: A diferencia de la Paz de Augsburgo (1555), Westfalia incluye por primera vez al calvinismo como religión permitida. Se rompe el principio de unidad católica en Europa, aceptando la convivencia de diferentes confesiones dentro de un marco de paz internacional.
•	Equilibrio de Poder: El texto sienta las bases de la diplomacia moderna, donde ningún estado debe ser lo suficientemente fuerte como para dominar a los demás. Para España, esto significó el paso a una posición de potencia de segundo orden, confirmada poco después en la Paz de los Pirineos (1659).`,
    },
    { titulo: "Testamento de Carlos II (1700)", 
      descripcion: "Designación de Felipe de Anjou como heredero.",
      texto: `Reconociendo conforme a diversas consultas de ministros de Estado y Justicia que la razón en que se funda la renuncia de las señoras doña Ana y doña María Teresa, reinas de Francia, mi tía y mi hermana, a la sucesión de estos reinos, fue evitar el perjuicio de unirse a la Corona de Francia; y reconociendo que, faltando esta razón, el derecho de la sucesión subsiste en el pariente más próximo, conforme a las leyes de estos reinos [...] declaro mi sucesor al Duque de Anjou, hijo segundo del Delfín, y como tal le llamo a la sucesión de todos mis reinos y dominios, sin excepción de ninguna parte de ellos; mandando a todos mis vasallos y súbditos de todos mis reinos y señoríos que en el caso de que Dios me lleve sin dejar sucesión, le reconozcan por su rey y señor natural.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y política de carácter primario. Se trata de una cláusula del Testamento de Carlos II, último rey de la casa de Habsburgo (Austria) en España, dictado el 2 de octubre de 1700. Su función es designar un heredero universal para la Monarquía Hispánica ante la falta de descendencia directa del monarca.
2. Contexto histórico
El documento se sitúa al final del siglo XVII, en un momento de máxima tensión diplomática en Europa. Carlos II "el Hechizado", cuya salud era extremadamente frágil, iba a morir sin hijos, lo que convertía a la Corona española —que aún poseía vastos territorios en América, Italia y los Países Bajos— en el botín más deseado por las grandes potencias.
Existían dos candidatos principales: el Archiduque Carlos de Austria (de la línea de los Habsburgo) y Felipe de Anjou (nieto de Luis XIV de Francia, de la casa de Borbón). Las potencias europeas habían firmado incluso tratados de reparto para evitar que España cayera entera en manos de Francia o Austria. Sin embargo, Carlos II, asesorado por el Consejo de Estado y el Cardenal Portocarrero, decidió testar a favor del candidato francés para garantizar la integridad territorial del Imperio, creyendo que solo el poder militar de Luis XIV podría evitar el desmembramiento de las posesiones españolas.
3. Explicación del contenido
El fragmento detalla la lógica legal que cambió el destino dinástico de España:
•	Legitimidad del derecho de sangre: El texto argumenta que las renuncias previas de las infantas españolas al casarse con reyes franceses (como la de María Teresa en la Paz de los Pirineos) eran nulas o inválidas para este caso, por lo que el derecho sucesorio recaía legítimamente en la línea borbónica por ser el "pariente más próximo".
•	Designación de Felipe de Anjou: El rey nombra sucesor al duque de Anjou (futuro Felipe V). Esta elección supuso la llegada de la dinastía de los Borbones a España, introduciendo el modelo de absolutismo centralista francés.
•	Defensa de la integridad territorial: El testamento prohíbe explícitamente la división de la herencia ("sin excepción de ninguna parte de ellos"). Carlos II prefería cambiar de dinastía antes que ver sus reinos repartidos entre las potencias europeas.
•	Casus belli (Causa de guerra): Este nombramiento no fue aceptado por Austria, Inglaterra ni las Provincias Unidas, que temían la formación de un bloque franco-español hegemónico. El incumplimiento de los tratados de reparto previos llevó al estallido de la Guerra de Sucesión Española (1701-1713), que terminaría con el Tratado de Utrecht.`,
    }
  ],
  "bloque-5": [
    { titulo: "Tratado de Utrecht (1713)", 
      descripcion: "Acuerdo de paz tras la Guerra de Sucesión.",
      texto: `El Rey Católico, por sí y por sus herederos, cede por este Tratado a la Corona de la Gran Bretaña la plena y entera propiedad de la ciudad y castillo de Gibraltar, juntamente con su puerto, defensas y fortalezas que le pertenecen... Asimismo, el Rey Católico cede también a la Corona de la Gran Bretaña la isla de Menorca, traspasándola para siempre con todo el derecho y pleno dominio...
El Rey Católico concede a la Compañía de la Gran Bretaña la facultad de introducir esclavos negros en las Indias Occidentales de América, que llaman el navío de permiso, por espacio de treinta años... y que pueda la dicha Compañía enviar a las Indias un navío de quinientas toneladas en cada un año para comerciar en ellas.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y diplomático de carácter primario. Se trata de un conjunto de tratados de paz firmados en la ciudad holandesa de Utrecht en 1713 (completados con el Tratado de Rastatt en 1714). Estos acuerdos pusieron fin a la Guerra de Sucesión Española a nivel internacional, reconociendo a Felipe V como rey de España a cambio de importantes concesiones territoriales y comerciales.
2. Contexto histórico
El documento se sitúa tras la muerte sin descendencia de Carlos II (1700). El conflicto enfrentó a los partidarios de Felipe de Anjou (Borbón) y al Archiduque Carlos de Austria (Habsburgo). Lo que comenzó como una guerra civil española se convirtió en un conflicto europeo: Inglaterra, Holanda y Austria temían la unión de las coronas de Francia y España.
El cambio de rumbo se produjo en 1711, cuando el Archiduque Carlos heredó el Imperio Alemán. Inglaterra, al ver que su aliado podía acumular tanto poder como los Borbones, forzó la paz. España, agotada, tuvo que aceptar la pérdida de sus posesiones en Europa para que Felipe V fuera reconocido internacionalmente como monarca.
3. Explicación del contenido
El fragmento detalla las cláusulas que beneficiaron especialmente a Gran Bretaña, la gran triunfadora del conflicto:
•	Pérdidas territoriales en España: Se confirma la cesión de Gibraltar y Menorca (esta última recuperada definitivamente en 1802) a los británicos. Además, España perdió todos sus dominios europeos: Flandes, Milán, Nápoles y Cerdeña pasaron a Austria, y Sicilia al Ducado de Saboya.
•	Concesiones comerciales: Se rompe por primera vez el monopolio español en América con dos privilegios otorgados a Inglaterra:
o	El Asiento de Negros: El derecho exclusivo de suministrar esclavos africanos a las colonias españolas.
o	El Navío de Permiso: El derecho a enviar un barco anual de 500 toneladas para comerciar con las Indias.
•	Cláusula de no unión: Felipe V tuvo que renunciar a sus derechos sobre el trono de Francia para asegurar que ambas coronas nunca se unirían bajo un mismo monarca.
•	Nuevo orden internacional: Utrecht establece el principio del "Equilibrio de Poder" en Europa, donde ninguna potencia sería hegemónica, y Gran Bretaña se consolidaría como la dueña de los mares (inicio de la hegemonía británica).`,
    },
    { titulo: "Decreto de Nueva Planta para Aragón y Valencia (1707)", 
      descripcion: "Abolición de los fueros de la Corona de Aragón.",
      texto: `Considerando haber perdido los Reinos de Aragón y de Valencia, y todos sus habitadores por la rebelión que cometieron, faltando enteramente al juramento de fidelidad que me hicieron como a su legítimo Rey y Señor, todos los fueros, privilegios, exenciones y libertades que gozaban... he juzgado por conveniente abolir y derogar enteramente todos los referidos fueros, privilegios, práctica y costumbre hasta aquí observadas en los referidos reinos de Aragón y Valencia; siendo mi voluntad que estos se reduzcan a las leyes de Castilla, y al uso, práctica y forma de gobierno que se tiene y ha tenido en ella y en sus Tribunales sin diferencia alguna en nada; pudiendo obtener por esta razón mis fidelísimos vasallos los Castellanos oficios y empleos en Aragón y Valencia, de la misma manera que los Aragoneses y Valencianos han de poder en adelante gozarlos en Castilla sin ninguna distinción.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político de carácter primario y fuente directa. Se trata del primer Decreto de Nueva Planta, promulgado por Felipe V en 1707 tras la batalla de Almansa. Su función es la abolición de los fueros e instituciones propias de los reinos de Aragón y Valencia, imponiendo en su lugar las leyes y el sistema administrativo de Castilla.
2. Contexto histórico
El documento se dicta en plena Guerra de Sucesión Española (1701-1713). Tras la muerte de Carlos II, los territorios de la Corona de Aragón (Aragón, Valencia, Cataluña y Mallorca) apoyaron mayoritariamente al Archiduque Carlos de Austria, temiendo que el centralismo borbónico eliminara sus privilegios. Por el contrario, Castilla apoyó a Felipe V.
Tras la victoria borbónica en la batalla de Almansa (1707), Felipe V ocupó los reinos de Valencia y Aragón. El rey utilizó el "derecho de conquista" para castigar a estos territorios por su "rebelión", cumpliendo así el viejo proyecto de centralización que ya había intentado el Conde-Duque de Olivares un siglo antes. Este decreto sería seguido años más tarde por otros similares para Mallorca (1715) y Cataluña (1716).
3. Explicación del contenido
El fragmento detalla la implantación del Absolutismo Centralista en España:
•	Abolición de los Fueros: El rey deroga todos los privilegios, libertades y leyes específicas de Aragón y Valencia como castigo directo por su falta de fidelidad. Esto supone la desaparición de sus Cortes y de sus instituciones de autogobierno (como la Generalitat).
•	Unificación Jurídica y Administrativa: Se impone el modelo de Castilla como ley única para todo el territorio ("reduzcan a las leyes de Castilla... sin diferencia alguna"). Es el paso previo a la creación de una administración común basada en provincias y capitanes generales.
•	Fin de la Extranjería Interna: Se permite que los castellanos ocupen cargos en Aragón y viceversa. Aunque parece una medida de igualdad, en la práctica facilitó que el rey nombrara a funcionarios castellanos leales en los territorios recién conquistados para asegurar el control político.
•	Soberanía Absoluta: El texto emana de la voluntad exclusiva del monarca ("mi voluntad"), reflejando el modelo de monarquía absoluta de derecho divino propio de los Borbones, donde el rey es la única fuente de ley.`,
    }
  ],
  "bloque-6": [
    { titulo: "Tratado de la Tercera Unión de Familia (1761)", 
      descripcion: "Alianza militar entre España y Francia.",
      texto: `Los estrechos vínculos de la sangre que unen a los dos monarcas reinantes en España y Francia [...] les han inspirado la resolución de formar entre sí un Pacto de Familia, bajo el cual no se comprenda sino la Casa de Borbón. [...] En consecuencia de esta unión, los dos monarcas se declaran que mirarán de aquí en adelante como enemiga propia a la potencia que llegue a serlo de una de las dos Coronas.
S.M. Católica y S.M. Cristianísima se garantizan de la manera más absoluta y auténtica todos los Estados, Tierras, Islas y Plazas que poseen en cualquier parte del mundo, sin reserva alguna. [...] Siendo el objeto principal de este Tratado el de hacer a las dos Coronas tan poderosas y respetables que ninguna otra se atreva a intentar turbar su paz, se ha convenido que cuando una de ellas se halle en guerra, la otra suministrará los socorros necesarios.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y diplomática de carácter primario. Se trata del Tercer Pacto de Familia, firmado en París en 1761 entre los representantes de Carlos III de España y Luis XV de Francia. Su función es establecer una alianza militar y política permanente entre las dos ramas de la dinastía Borbón para defender sus intereses coloniales y dinásticos.
2. Contexto histórico
El documento se sitúa en pleno siglo de las Luces y en el marco de la Guerra de los Siete Años (1756-1763). Tras la política de neutralidad seguida por Fernando VI, Carlos III ascendió al trono preocupado por el creciente expansionismo de Gran Bretaña en el Atlántico, que amenazaba el monopolio comercial español en América.
Ante la agresividad británica y el riesgo de que Francia fuera derrotada totalmente, España decidió abandonar su neutralidad y reactivar los "Pactos de Familia" (hubo dos previos con Felipe V). Esta alianza buscaba equilibrar el poder naval británico y recuperar territorios perdidos en tratados anteriores, como Menorca y Gibraltar, integrando a España en el conflicto europeo y colonial.
3. Explicación del contenido
El fragmento detalla los principios de la solidaridad borbónica en Europa:
•	Unión Dinástica: El tratado se fundamenta en los "vínculos de sangre", convirtiendo una alianza política en un compromiso familiar. El concepto de "Pacto de Familia" implica que los intereses de una corona son indisociables de la otra.
•	Defensa Mutua y Ofensiva: Se establece que cualquier enemigo de Francia lo será también de España y viceversa. Esto obligaba a la asistencia militar recíproca en caso de guerra, lo que llevó a España a intervenir inmediatamente contra Inglaterra en la Guerra de los Siete Años y, años más tarde, en la Guerra de Independencia de los Estados Unidos.
•	Garantía Territorial: Ambas potencias se garantizan la integridad de sus posesiones en todo el mundo ("Estados, Tierras e Islas"). Para España, esto era vital para proteger el Imperio americano frente a las incursiones británicas.
•	Sistema de Contrapesos: El objetivo final es crear un bloque borbónico "respetable" que actúe como contrapunto a la hegemonía marítima de Gran Bretaña, marcando la política exterior española hasta el estallido de la Revolución Francesa en 1789.`,
    },
    { titulo: "Real Pragmática de Expulsión de los Jesuitas (1767)", 
      descripcion: "Orden de Carlos III.",
      texto: `Habiéndome conformado con el parecer de los de mi Consejo Real [...] y de lo que me han expuesto personas de la más elevada prudencia y celo; estimulado de gravísimas causas relativas al deber en que me hallo constituido de mantener en subordinación, tranquilidad y justicia mis pueblos, y otras urgentes, justas y necesarias que reservo en mi Real ánimo: usando de la suprema autoridad económica que el Todopoderoso ha depositado en mis manos para la protección de mis vasallos y respeto de mi Corona:
Vengo en mandar que se extraigan de todos mis dominios de España e Indias, Islas Filipinas y demás adyacentes, a los Religiosos de la Compañía, así Sacerdotes, como Coadjutores o Legos que hayan hecho la primera profesión, y a los Novicios que quisieren seguirles; y que se ocupen todas las temporalidades de la Compañía en mis dominios.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de una Pragmática Sanción promulgada por el rey Carlos III el 2 de abril de 1767. Su función es ordenar la expulsión inmediata de todos los miembros de la Compañía de Jesús (Jesuitas) de los territorios de la Monarquía Hispánica y la confiscación de todos sus bienes y propiedades ("temporalidades").
2. Contexto histórico
El documento se enmarca en el periodo del Reformismo Ilustrado. Carlos III, principal exponente del Despotismo Ilustrado en España, buscaba modernizar el país y fortalecer el poder del Estado frente a estamentos privilegiados. El detonante oficial de la expulsión fue la acusación contra los jesuitas de haber instigado el Motín de Esquilache (1766), una revuelta popular causada por el precio del pan y las reformas de vestimenta, pero que fue utilizada por los ministros ilustrados (como Aranda y Campomanes) para golpear a la Compañía.
En el fondo, el conflicto era una lucha por el Regalismo: la doctrina que defendía la superioridad del rey sobre la Iglesia en asuntos no espirituales. Los jesuitas, por su voto de obediencia directa al Papa y su inmenso control sobre la educación de las élites y las reducciones en América, eran vistos como un "Estado dentro del Estado" que obstaculizaba las reformas absolutistas.
3. Explicación del contenido
El fragmento destaca los fundamentos del poder real y las consecuencias de la orden:
•	Soberanía Absoluta y Reserva: El rey justifica la medida apelando a la "suprema autoridad" que Dios le ha dado para proteger a sus vasallos. Es muy relevante la mención a las "causas que reservo en mi Real ánimo", lo que indica que el monarca no se siente obligado a dar explicaciones públicas de sus motivos, actuando bajo el principio del absolutismo.
•	Ámbito Geográfico: La orden es total y afecta a todos los dominios de la Corona, incluyendo España, Filipinas y toda la América Hispana. En las colonias, la expulsión fue traumática, pues los jesuitas gestionaban misiones estratégicas y grandes centros educativos.
•	Confiscación de "Temporalidades": Se ordena la incautación de todos los bienes de la orden (tierras, colegios, bibliotecas). El Estado utilizó estos recursos para fundar nuevos centros de enseñanza y financiar proyectos de reforma ilustrada.
•	Consecuencias Culturales: La salida de miles de jesuitas (muchos de ellos intelectuales destacados) supuso un duro golpe para la educación y la cultura de la época, aunque permitió al Estado reformar los planes de estudio universitarios, restando influencia a la teología escolástica tradicional.`,
    },
    { titulo: "Informe sobre la Ley Agraria de Jovellanos (1795)", 
      descripcion: "Informe sobre la tierra y su explotación.",
      texto: `Cultivar la tierra dista mucho de la perfección donde no hay propiedad individual y absoluta. El derecho de propiedad es el primero y más sagrado de los derechos sociales, y la agricultura no puede florecer donde las leyes o las costumbres lo encadenan.
Tales son las tierras vinculadas a mayorazgos, las de manos muertas de la Iglesia y las de propiedad comunal de los pueblos. Estas tierras, por estar fuera del comercio, no pueden ser mejoradas ni divididas, y condenan a la nación a la miseria. Es necesario, pues, remover los estorbos que las leyes ponen a la libre circulación de la tierra, permitiendo que el interés individual sea el motor de la prosperidad pública. Que se vendan las tierras baldías, que se limiten los privilegios de la Mesta y que cada labrador pueda cercar sus heredades.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto económico y social de carácter primario. Se trata de un informe técnico redactado por Gaspar Melchor de Jovellanos en 1795, por encargo de la Sociedad Económica Matritense de Amigos del País. Su función era diagnosticar los problemas de la agricultura española y proponer una reforma legislativa profunda para modernizar el sector.
2. Contexto histórico
El documento se publica durante el reinado de Carlos IV, aunque es el resultado de un largo proceso de investigación iniciado bajo Carlos III. Se sitúa en la Ilustración española, un movimiento que buscaba el progreso del país mediante la razón y la reforma de las estructuras del Antiguo Régimen.
En el siglo XVIII, la agricultura era la base de la economía, pero sufría crisis de subsistencia debido a que la mayor parte de la tierra estaba "amortizada" o "vinculada" (fuera del mercado). Además, la influencia de la Fisiocracia (la tierra como fuente de riqueza) y del incipiente liberalismo económico de Adam Smith influyeron decisivamente en Jovellanos, quien consideraba que la falta de libertad económica impedía el crecimiento de la nación.
3. Explicación del contenido
El fragmento resume los "estorbos" que, según Jovellanos, impedían el desarrollo agrario:
•	Crítica a la propiedad vinculada: Jovellanos señala como principal obstáculo las tierras en "manos muertas" (Iglesia), los mayorazgos (nobleza) y los bienes comunales. Al no poder venderse ni dividirse, estas tierras no se modernizaban. Propone su desvinculación para que entren en el mercado libre.
•	Defensa del interés individual: Siguiendo los principios liberales, sostiene que el propietario privado es quien mejor cuida y mejora la tierra buscando su propio beneficio, lo que a la postre genera riqueza para todo el país.
•	Ataque a los privilegios ganaderos: Aboga por la supresión de los privilegios de la Mesta (el potente gremio de ganaderos trashumantes), permitiendo a los agricultores cercar sus tierras para proteger sus cultivos.
•	Reformas institucionales: Propone la instrucción de los labradores, la mejora de las infraestructuras (regadío, caminos) y la creación de un mercado nacional. Aunque Jovellanos no planteaba una revolución social, sus ideas pusieron las bases ideológicas de las futuras desamortizaciones del siglo XIX (como la de Mendizábal).`,
    },
    { titulo: "Tratado de Fontainebleau (1807)", 
      descripcion: "Acuerdo para invadir Portugal.",
      texto: `Art. 1. La provincia de Entre-Duero y Miño con la ciudad de Oporto se dará en toda propiedad y soberanía a S.M. el Rey de Etruria, con el título de Rey de la Lusitania Septentrional. [...]
Art. 2. La provincia de Alentejo y el reino de los Algarbes se darán en toda propiedad y soberanía al Príncipe de la Paz [Godoy], para que las disfrute con el título de Príncipe de los Algarbes. [...]
Art. 11. S.M. el Emperador de los franceses se obliga a reconocer a S.M. el Rey de España como Emperador de las Dos Américas cuando todo esté dispuesto para que S.M. pueda tomar este título. [...]
Art. 13. Se entiende que S.M. el Emperador de los franceses y S.M. el Rey de España se convienen en repartirse igualmente las islas, colonias y otras propiedades ultramarinas de Portugal. [...]
Art. 2 de la Convención secreta: Un cuerpo de tropas imperiales francesas de 25.000 hombres de infantería y 3.000 de caballería entrará en España y marchará en derechura a Lisboa.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y diplomático de carácter primario. Se trata de un tratado internacional firmado en la ciudad francesa de Fontainebleau en octubre de 1807 entre los representantes de Carlos IV de España (específicamente su valido Manuel Godoy) y Napoleón Bonaparte, emperador de los franceses. Su función es organizar una invasión conjunta y el posterior reparto del Reino de Portugal entre Francia y España.
2. Contexto histórico
El documento se sitúa en el marco de las Guerras Napoleónicas. Napoleón había decretado el Bloqueo Continental contra Gran Bretaña, pero Portugal, aliado histórico de los ingleses, se negó a cumplirlo. Para castigar a Portugal, Napoleón necesitaba atravesar la península ibérica.
En España, el reinado de Carlos IV atravesaba una profunda crisis de legitimidad. El poder estaba concentrado en Manuel Godoy, odiado por la nobleza y el pueblo, y enfrentado al príncipe heredero, el futuro Fernando VII (quien poco después protagonizaría el Proceso de El Escorial y el Motín de Aranjuez). Godoy, cegado por la ambición de poseer un reino propio en el sur de Portugal, aceptó las condiciones de Napoleón sin prever que el emperador planeaba en realidad ocupar también España.
3. Explicación del contenido
El fragmento detalla los términos del reparto y las condiciones militares que cambiarían la historia de España:
•	Reparto de Portugal: El tratado prevé la división de Portugal en tres partes: el norte para el Rey de Etruria, el centro para Francia (a cambio de futuras compensaciones) y el sur para el propio Godoy ("Príncipe de los Algarbes").
•	Compensaciones simbólicas: Se ofrece a Carlos IV el título pomposo de "Emperador de las Dos Américas", una maniobra de distracción para halagar la vanidad de la corona española mientras se preparaba la invasión.
•	La cláusula de invasión: Lo más relevante para el futuro de España es la convención secreta que permite la entrada de un cuerpo de ejército francés de unos 28.000 hombres.
•	Consecuencia inmediata: Bajo el pretexto de marchar hacia Lisboa, las tropas francesas ocuparon puntos estratégicos de España (Barcelona, Vitoria, Burgos, Madrid). Esto provocó la indignación popular, el estallido del Motín de Aranjuez en marzo de 1808, la caída de Godoy, la abdicación de Carlos IV y, finalmente, el levantamiento del 2 de mayo que dio inicio a la Guerra de la Independencia.`,
    },
    { titulo: "Abdicaciones de Bayona (1808)", 
      descripcion: "Renuncia al trono en favor de Napoleón.",
      texto: `He tenido a bien dar a mis amados vasallos la última prueba de mi paternal amor. [...] Así pues, por un tratado firmado el 5 de mayo, he cedido a mi aliado y caro amigo el Emperador de los franceses todos mis derechos a la corona de las Españas e Indias; habiendo pactado que la integridad de dicha corona se mantenga, y que la religión católica sea la única y exclusiva en todos los dominios de esta monarquía. [...]
He juzgado conveniente que el Rey mi padre me haya precedido en esta cesión, y que el Emperador de los franceses, usando de su poder y sabiduría, designe a la persona que deba reinar en España, para que esta nación se libre de las turbulencias y desgracias que la amenazan. [...] Por tanto, mando que se reconozca al Emperador de los franceses como árbitro de nuestro destino.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y político de carácter primario. Se trata de una serie de renuncias al trono de España firmadas en la ciudad francesa de Bayona en mayo de 1808. En ellas, Carlos IV y su hijo Fernando VII, bajo presión de Napoleón Bonaparte, ceden sucesivamente sus derechos dinásticos al emperador francés, quien posteriormente designaría a su hermano, José I Bonaparte, como rey de España.
2. Contexto histórico
El documento se sitúa en el inicio de la Crisis del Antiguo Régimen en España. Tras el Motín de Aranjuez (marzo de 1808), Carlos IV fue obligado a abdicar en su hijo Fernando VII. Sin embargo, Carlos protestó ante Napoleón alegando que su renuncia fue forzada.
Aprovechando la fractura interna de la familia real y la presencia de tropas francesas en España (según el Tratado de Fontainebleau), Napoleón atrajo a ambos a Bayona con la excusa de mediar en su disputa. Mientras la familia real estaba en Francia, el pueblo de Madrid se levantó el 2 de mayo contra la ocupación. Napoleón, utilizando los sucesos de Madrid para presionar a Fernando VII (amenazándolo de muerte si no devolvía la corona a su padre), logró que la corona pasara de Fernando a Carlos, y de Carlos a él mismo.
3. Explicación del contenido
El fragmento ilustra el traspaso de soberanía y las condiciones impuestas por Napoleón:
•	La doble abdicación: El texto muestra el mecanismo legal utilizado: Fernando devuelve la corona a Carlos IV, y este la cede a Napoleón. Se presenta falsamente como un acto de "paternal amor" y "amistad" para salvar a la nación de las "turbulencias".
•	Condiciones de la cesión: Napoleón se comprometió a dos puntos clave para evitar una resistencia mayor: mantener la integridad territorial de España (no desmembrarla) y el respeto absoluto a la religión católica, prohibiendo el culto protestante.
•	El papel de "Árbitro": Napoleón queda definido como el dueño del destino de España. Poco después, promulgaría el Estatuto de Bayona, una carta otorgada que pretendía modernizar el país bajo el modelo liberal-autoritario francés.
•	Consecuencia política: Estas abdicaciones fueron consideradas ilegales por la mayor parte del pueblo español, que las denominó "el engaño de Bayona". Al considerar que había un vacío de poder (pues el rey estaba "secuestrado" en Valençay), surgieron las Juntas locales y provinciales, que asumieron la soberanía en nombre de Fernando VII, dando inicio a la revolución liberal y a la guerra contra el invasor.`,
    },
    { titulo: "Proclama de la Junta Suprema de Sevilla (1808)", 
      descripcion: "Declaración de guerra a Francia.",
      texto: `Don Fernando VII, Rey de España y de las Indias, y en su nombre la Suprema Junta de Sevilla. Francia, o más bien su Emperador Napoleón I, ha violado con España los pactos más sagrados; le ha arrebatado sus Reyes y obligado a abdicar en Bayona contra toda justicia y derecho. [...] Ha declarado que va a transformar nuestra Monarquía y nuestras leyes, y que nos va a dar un Rey y una Constitución.
España no puede ser entregada a un extraño, ni la Nación española puede ser tratada como un rebaño de ovejas. No queremos el beneficio de leyes extranjeras; queremos nuestras leyes, nuestros usos y nuestra libertad. Por tanto, en nombre de nuestro Rey Fernando VII, declaramos la guerra por tierra y por mar al Emperador Napoleón y a la Francia, y mandamos que todos los españoles los miren como enemigos y los ataquen con todas sus fuerzas.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto circunstancial y político de carácter primario y fuente directa. Se trata de una proclama o manifiesto emitido por la Junta Suprema de Sevilla en junio de 1808. Su función es declarar formalmente la guerra a Francia, denunciar la ilegalidad de las Abdicaciones de Bayona y asumir la soberanía en nombre del rey cautivo, Fernando VII.
2. Contexto histórico
El documento se sitúa en el estallido de la Guerra de la Independencia (1808-1814). Tras el levantamiento del 2 de mayo en Madrid y las abdicaciones forzadas de Carlos IV y Fernando VII en favor de Napoleón, se produjo un vacío de poder. Al no aceptar las instituciones tradicionales (como el Consejo de Castilla) la autoridad del invasor, el pueblo y las élites locales crearon las Juntas Provinciales.
La de Sevilla, presidida por Francisco Saavedra, fue de las primeras en organizarse aprovechando que Andalucía no estaba aún ocupada por los franceses. Este texto es la respuesta jurídica a la imposición de José I Bonaparte y marca el inicio de la resistencia organizada que culminaría poco después en la batalla de Bailén, la primera derrota en campo abierto de un ejército napoleónico.
3. Explicación del contenido
El fragmento condensa el pensamiento de los patriotas en 1808 y los motivos del conflicto:
•	Denuncia de la traición de Napoleón: El texto subraya que el Emperador ha violado los tratados anteriores (como el de Fontainebleau) y ha secuestrado a la familia real. Califica lo ocurrido en Bayona como un acto "contra toda justicia".
•	Rechazo a la soberanía extranjera: Se niega la legitimidad de las leyes que Napoleón pretende imponer (el Estatuto de Bayona). La frase "la Nación española no puede ser tratada como un rebaño de ovejas" apela al orgullo nacional y a la identidad colectiva frente al invasor.
•	Asunción de la soberanía: Aunque la Junta dice actuar "en nombre de Fernando VII", en la práctica está ejerciendo un acto revolucionario al asumir el poder por sí misma. Es el germen de la soberanía nacional que se desarrollará en las Cortes de Cádiz.
•	Declaración de Guerra Total: El manifiesto hace un llamamiento a la resistencia armada de todos los españoles ("por tierra y por mar"), legitimando la lucha no solo de los ejércitos regulares, sino también de las guerrillas que caracterizarán este conflicto.`,
    },
    { titulo: "Constitución de 1812", 
      descripcion: "Primer texto constitucional español.",
      texto: `Art. 1. La Nación española es la reunión de todos los españoles de ambos hemisferios.
Art. 2. La Nación española es libre e independiente, y no es ni puede ser patrimonio de ninguna familia ni persona.
Art. 3. La soberanía reside esencialmente en la Nación, y por lo mismo pertenece a esta exclusivamente el derecho de establecer sus leyes fundamentales.
Art. 12. La religión de la Nación española es y será perpetuamente la católica, apostólica, romana, única verdadera. La Nación la protege por leyes sabias y justas, y prohíbe el ejercicio de cualquiera otra.
Art. 15. La potestad de hacer las leyes reside en las Cortes con el Rey.
Art. 16. La potestad de hacer ejecutar las leyes reside en el Rey.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la primera Constitución propiamente dicha de la historia de España, promulgada por las Cortes Generales y Extraordinarias en Cádiz el 19 de marzo de 1812. Es un texto de ideología liberal progresista que sienta las bases de la España moderna.
2. Contexto histórico
El documento surge durante la Guerra de la Independencia (1808-1814) contra la ocupación francesa de Napoleón. Ante el vacío de poder provocado por las Abdicaciones de Bayona, se crearon Juntas que finalmente derivaron en la formación de una Junta Suprema Central, la cual convocó Cortes en la ciudad de Cádiz, único punto de la península libre de la ocupación francesa gracias a la protección de la flota británica.
En Cádiz se reunieron diputados que representaban tres tendencias: los liberales (partidarios de reformas radicales), los absolutistas o "serviles" (partidarios del antiguo orden) y los jovellanistas (reformistas moderados). La mayoría liberal logró imponer un texto que rompía con el Antiguo Régimen mientras el rey legítimo, Fernando VII, permanecía cautivo en Francia.
3. Explicación del contenido
El fragmento recoge los pilares del nuevo orden liberal:
•	Soberanía Nacional: El artículo 3 es revolucionario al establecer que el poder emana de la Nación (ciudadanos) y no del Rey por derecho divino. España deja de ser "patrimonio" de una familia (los Borbones) para ser un Estado nacional.
•	Definición de la Nación: El artículo 1 incluye a los españoles de "ambos hemisferios", integrando jurídicamente a las colonias americanas como ciudadanos de pleno derecho, en un intento de frenar los movimientos independentistas.
•	División de Poderes: Se establece una monarquía parlamentaria donde el legislativo reside en las Cortes con el Rey, y el ejecutivo únicamente en el Rey. Esto limita drásticamente las facultades absolutistas del monarca.
•	Estado Confesional: El artículo 12 muestra el compromiso entre liberales y el clero ilustrado. A pesar del avance liberal, se mantiene el catolicismo como religión única y verdadera, prohibiendo cualquier otra, lo que refleja el peso de la tradición en la España de la época.
•	Derechos y Libertades: Aunque no aparecen en estos artículos, la Constitución garantizaba la libertad de imprenta, la igualdad ante la ley, el derecho a la propiedad y el sufragio universal masculino indirecto.`,
   },
    { titulo: "Manifiesto de los Persas (1814)", 
      descripcion: "Petición para restaurar el Antiguo Régimen.",
      texto: `Era costumbre en los antiguos persas pasar cinco días en anarquía después del fallecimiento de su rey, a fin de que la experiencia de los asesinatos, robos y otras desgracias les obligase a ser más fieles a los sucesores. Para serlo España a Vuestra Majestad, no necesitaba igual ensayo en los seis años de su cautividad. [...]
La monarquía absoluta es una obra de la razón y de la inteligencia; está establecida por la ley divina, por la cual los reyes son sus ministros y sus representantes en la tierra. [...] Es necesario que la potestad soberana sea una, para que el pueblo sea feliz. [...] Quisiéramos grabar en el corazón de todos que los que se llaman "diputados de la nación" en las Cortes de Cádiz han abusado de su poder, y que la Constitución que han formado es nula y de ningún valor. Por tanto, pedimos que se declare sin efecto la dicha Constitución y los decretos dictados en Cádiz.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto circunstancial y político de carácter primario. Se trata de un manifiesto firmado en abril de 1814 por 69 diputados de las Cortes de Cádiz de ideología absolutista. Su función es dar la bienvenida a Fernando VII tras su regreso de Francia y solicitarle formalmente la anulación de la obra legislativa de las Cortes de Cádiz y el restablecimiento del Antiguo Régimen.
2. Contexto histórico
El documento se redacta al finalizar la Guerra de la Independencia (1808-1814). Tras la firma del Tratado de Valençay, Napoleón devuelve el trono a Fernando VII ("el Deseado"). El rey regresa a una España que ha cambiado legalmente: existe la Constitución de 1812, que limita su poder y establece la soberanía nacional.
Mientras los liberales esperan que el rey jure la Constitución, los sectores más reaccionarios (nobleza y alto clero), que se sentían amenazados por las reformas gaditanas, se organizan. Aprovechan el viaje del rey desde la frontera hacia Madrid para presentarle este manifiesto en Valencia. El apoyo militar del general Elío y este respaldo político permitieron a Fernando VII promulgar el Decreto del 4 de mayo, restaurando el absolutismo y persiguiendo a los liberales.
3. Explicación del contenido
El fragmento utiliza una metáfora histórica para justificar el regreso al orden previo:
•	La analogía de los "Persas": Los firmantes comparan el periodo de la guerra y la labor de las Cortes de Cádiz con la anarquía de los antiguos persas. Para ellos, la ausencia del rey absoluto ha traído el caos, y la Constitución no es un avance, sino una desgracia.
•	Defensa de la Monarquía Absoluta: El texto argumenta que el absolutismo no es una tiranía, sino una "obra de la razón" y de origen divino. Sostiene que el rey es el único capaz de garantizar la felicidad y el orden del pueblo.
•	Ilegitimidad de las Cortes de Cádiz: Se ataca duramente a los diputados liberales, acusándolos de usurpar el poder del rey mientras este estaba cautivo. Declaran que la Constitución es "nula" porque no contaba con el consentimiento del monarca.
•	Petición de Restauración: El objetivo final es claro: piden la vuelta a las instituciones tradicionales (fueros, Inquisición, privilegios estamentales) y la anulación de toda la legislación liberal. Fue el pretexto "legal" que el rey necesitaba para dar su primer golpe de Estado.`,
    },
    { titulo: "Edicto de Valencia o Real Decreto de 4 de mayo (1814)", 
      descripcion: "Anulación de la Constitución de 1812.",
      texto: `Mi Real ánimo es no solamente no jurar ni acceder a dicha Constitución, ni a decreto alguno de las Cortes Generales y Extraordinarias, y de las ordinarias actualmente abiertas [...] sino a declarar aquella Constitución y tales decretos nulos y de ningún valor ni efecto, ahora ni en tiempo alguno, como si no hubiesen pasado jamás tales actos, y se quitasen de en medio del tiempo, y sin obligación en mis pueblos y súbditos, de cualquiera clase y condición, a cumplirlos ni guardarlos. [...] Y como el que quisiese sostenerlos [...] atentaría contra las prerrogativas de mi soberanía y la felicidad de la Nación, declaro reo de lesa majestad a quien tal osare o intentare, y que como a tal se le aplique la pena de la vida.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y político de carácter primario. Se trata de un Real Decreto promulgado por el rey Fernando VII el 4 de mayo de 1814 en Valencia. Su función es anular de forma radical toda la obra legislativa de las Cortes de Cádiz, incluyendo la Constitución de 1812, y restaurar las instituciones y el poder absoluto de la monarquía.
2. Contexto histórico
El texto se sitúa al finalizar la Guerra de la Independencia (1808-1814). Tras el Tratado de Valençay, Napoleón reconoce a Fernando VII como rey. A su regreso a España, el monarca es recibido con entusiasmo popular ("el Deseado"), pero se encuentra con un país dividido entre liberales, que esperan que jure la Constitución de 1812, y absolutistas, que desean la vuelta al Antiguo Régimen.
Fernando VII, antes de llegar a Madrid, recibe en Valencia el Manifiesto de los Persas, donde un grupo de diputados absolutistas le incita a restaurar el poder absoluto. Contando con este apoyo político y el respaldo militar del general Elío, el rey se siente con la fuerza suficiente para firmar este decreto, rompiendo sus promesas de convivencia y dando inicio al Sexenio Absolutista (1814-1820), caracterizado por el retorno a la Inquisición, los privilegios estamentales y la persecución de los liberales.
3. Explicación del contenido
El fragmento muestra la contundencia con la que el monarca reclama su soberanía absoluta:
•	Nulidad absoluta de la obra de Cádiz: El lenguaje es extremo; el rey no solo rechaza la Constitución, sino que pretende borrarla de la historia ("como si no hubiesen pasado jamás tales actos"). Esto implica la vuelta inmediata al estado de cosas anterior a 1808.
•	Restauración del Absolutismo: Al declarar nulos los decretos de las Cortes, se eliminan la soberanía nacional, la división de poderes y los derechos ciudadanos. El monarca vuelve a ser la única fuente de ley y autoridad.
•	Carácter punitivo y represivo: El texto termina con una amenaza directa: cualquier intento de defender la Constitución será considerado un "atentado contra la soberanía" y castigado con la pena de muerte ("pena de la vida"). Esto inaugura una etapa de exilio y represión para los liberales españoles.
•	Justificación ideológica: Fernando VII argumenta que lo hace por la "felicidad de la Nación", asumiendo que el bienestar del pueblo solo es posible bajo el mando de un rey por derecho divino, invalidando el concepto liberal de ciudadano.`,
    },
    { titulo: "Manifiesto de Riego (1820)", 
      descripcion: "Proclama que inicia el Trienio Liberal.",
      texto: `Soldados, mi amor hacia vosotros es grande. Por lo mismo yo no podía consentir, como jefe vuestro, que se os alejase de vuestra patria, en unos buques podridos, para llevaros a hacer una guerra injusta al nuevo mundo; ni que se os hiciese abandonar vuestros padres y hermanos, dejándolos sumidos en la miseria y la opresión. [...] España está viviendo a merced de un poder arbitrario y absoluto, ejercido sin el menor respeto a las leyes fundamentales de la nación. El rey, que debe ser nuestro padre, es nuestro verdugo. [...] La Constitución, sí, la Constitución, basta para hacernos felices. ¡Viva la Constitución!`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto político y circunstancial de carácter primario (fuente directa). Se trata del Manifiesto o Proclama de Rafael del Riego, emitido el 1 de enero de 1820 en Las Cabezas de San Juan (Sevilla). Su función es sublevar a las tropas acantonadas destinadas a América para restaurar la Constitución de 1812 y acabar con el absolutismo de Fernando VII.
2. Contexto histórico
El documento se sitúa en el inicio del Trienio Liberal (1820-1823). Tras el regreso de Fernando VII en 1814, este había restaurado el absolutismo, persiguiendo a los liberales y sumiendo al país en una crisis económica y política. Entre 1814 y 1820 hubo varios intentos fallidos de restaurar la Constitución mediante pronunciamientos (Espoz y Mina, Lacy, Porlier), una forma de intervención militar típica del siglo XIX español.
El éxito de Riego se debió al profundo malestar de las tropas destinadas a sofocar las rebeliones en las colonias americanas, que temían morir en una guerra lejana y se encontraban en condiciones deplorables. Tras el levantamiento en Andalucía, la insurrección se extendió por otras ciudades, obligando finalmente al rey a jurar la Constitución de Cádiz en marzo de 1820.
3. Explicación del contenido
El fragmento combina reivindicaciones militares con una profunda carga ideológica liberal:
•	Denuncia de la situación militar: Riego apela al sentimiento de los soldados, criticando el envío de tropas a América en "buques podridos" para una guerra que califica de "injusta". Esta estrategia le sirve para ganar el apoyo de la tropa antes de pasar a la política.
•	Ataque al Absolutismo: Describe el gobierno de Fernando VII como un "poder arbitrario" y tacha al monarca de "verdugo" de su propio pueblo. Es una crítica frontal al incumplimiento de las leyes y a la opresión del Sexenio Absolutista.
•	La Constitución como solución: El texto presenta la Constitución de 1812 no solo como un marco legal, sino como una receta para la felicidad y la libertad de la nación. El grito de "¡Viva la Constitución!" se convierte en el motor del cambio político.
•	Transversalidad del mensaje: Riego no solo habla de leyes, sino de la "miseria" de las familias de los soldados, vinculando el éxito del liberalismo con la mejora de las condiciones de vida de las clases populares y del ejército.`,
    },
    { titulo: "Decreto de 1 de octubre (1823)", 
      descripcion: "Anulación del gobierno constitucional.",
      texto: `Bien públicos y notorios fueron a todos mis vasallos los escandalosos sucesos que precedieron, acompañaron y siguieron al establecimiento de la democrática Constitución de Cádiz en el mes de marzo de 1820: la más criminal traición, la más vergonzosa cobardía de mi Real persona, y la violencia más inaudita, me obligaron a jurar aquella funesta carta. [...]
Sentado ya otra vez en el trono de S. Fernando por la mano omnipotente de los soberanos que dignamente rigen la Europa, y por los esfuerzos de mi amado ejército [...] he venido en declarar los siguiente: Son nulos y de ningún valor todos los actos del gobierno llamado constitucional (de cualquiera clase y naturaleza que fuesen) que ha dominado a mis pueblos desde el día 7 de marzo de 1820 hasta hoy 1 de octubre de 1823, declarando, como declaro, que en toda esta época he carecido de libertad, y que por consiguiente no he podido aprobar las leyes, órdenes ni decretos de aquel gobierno.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y político de carácter primario. Se trata de un Real Decreto promulgado por Fernando VII el 1 de octubre de 1823 en el Puerto de Santa María (Cádiz). Su función es derogar toda la legislación del Trienio Liberal, restaurar las instituciones absolutistas y declarar nulos todos los actos realizados por el gobierno constitucional desde el pronunciamiento de Riego.
2. Contexto histórico
El documento se sitúa en el fin del Trienio Liberal (1820-1823). Tras el éxito del pronunciamiento de Riego en 1820, Fernando VII se vio obligado a jurar la Constitución de 1812. Sin embargo, el monarca conspiró desde el primer momento para recuperar su poder absoluto, apelando a la Santa Alianza (coalición de potencias absolutistas europeas).
Tras el Congreso de Verona, Francia envió a los Cien Mil Hijos de San Luis, un ejército liderado por el Duque de Angulema, que atravesó la península sin apenas resistencia liberal. El gobierno y las Cortes se refugiaron en Cádiz llevando al rey consigo, pero tras el asedio de la ciudad y la capitulación de las fuerzas liberales, Fernando VII fue liberado y firmó este decreto, dando comienzo a la Década Ominosa (1823-1833).
3. Explicación del contenido
El fragmento refleja el espíritu de revancha y la justificación legal de la vuelta al absolutismo:
•	Deslegitimación del Trienio: El rey califica el periodo constitucional como una etapa de "criminal traición" y "violencia". Utiliza un lenguaje subjetivo para presentarse como una víctima que fue obligada a jurar la Constitución contra su voluntad.
•	Argumento de la falta de libertad: Para anular legalmente las leyes que él mismo firmó entre 1820 y 1823, alega que "ha carecido de libertad". Al declarar que actuó bajo coacción, invalida automáticamente toda la obra legislativa del periodo (reformas agrarias, supresión de la Inquisición, desamortizaciones, etc.).
•	Agradecimiento a la Santa Alianza: El monarca reconoce explícitamente que recupera el trono gracias a la "mano omnipotente de los soberanos" de Europa, confirmando la victoria del legitimismo absolutista sobre el liberalismo nacional.
•	Consecuencias políticas: Este decreto supuso el inicio de una represión feroz contra los liberales (ejecución de Riego, Mariana Pineda, Torrijos) y el exilio de miles de intelectuales. A diferencia de 1814, esta restauración del absolutismo sería más compleja, obligando al rey a introducir algunas reformas técnicas que terminarían dividiendo a los absolutistas entre "apostólicos" (ultras) y moderados.`,
    },
    { titulo: "Pragmática Sanción de 1830", 
      descripcion: "Permite la sucesión femenina.",
      texto: `Las Cortes generales de 1789 [...] hicieron a mi augusto Padre, que esté en gloria, la súplica de que, sin embargo de la ley establecida por el Rey Felipe V, su bisabuelo, se publicase la Pragmática-sanción [...] en que se establece la sucesión regular en la corona de estos reinos para los hijos varones, y en defecto de ellos para las hembras. [...] Habiendo ocurrido otras causas graves que suspendieron entonces la publicación de este soberano decreto, y deseando ahora yo el cumplimiento de lo acordado, he venido en mandar que se publique inmediatamente en la forma acostumbrada [...] restableciendo de esta forma la antigua costumbre de estos Reinos, observada antes de la llegada de la Casa de Borbón.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y política de carácter primario. Se trata de la Pragmática Sanción, publicada por el rey Fernando VII el 29 de marzo de 1830. Su función legal es anular el Auto Acordado de 1713 (la mal llamada "Ley Sálica") y restablecer las leyes de sucesión tradicionales de España (recogidas en las Partidas), permitiendo que las mujeres hereden el trono en ausencia de hermanos varones.
2. Contexto histórico
El documento se sitúa en la fase final del reinado de Fernando VII, la Década Ominosa (1823-1833). El monarca, tras tres matrimonios sin descendencia, se casó por cuarta vez con María Cristina de Borbón. Ante el embarazo de la reina en 1830, Fernando VII decidió publicar esta norma (que ya había sido aprobada secretamente por su padre Carlos IV en 1789, pero nunca promulgada) para asegurar que, si el bebé era una niña, pudiera reinar.
Esto supuso un golpe directo a las aspiraciones al trono del hermano del rey, el infante Carlos María Isidro, líder de los sectores más absolutistas y "ultras" (los apostólicos). El conflicto dinástico encubría un enfrentamiento ideológico: los partidarios de don Carlos (carlistas) defendían el absolutismo puro, mientras que los partidarios de la futura Isabel II (cristinos o isabelinos) se vieron forzados a buscar el apoyo de los liberales moderados para sostener los derechos de la princesa.
3. Explicación del contenido
El fragmento justifica el cambio sucesorio basándose en la tradición y en la legitimidad histórica:
•	Invocación a las Cortes de 1789: El texto recuerda que no es una invención caprichosa de Fernando VII, sino que ya fue aprobada por las Cortes de Carlos IV. Esto busca dar legitimidad legal a una medida que se sabía polémica.
•	Derogación de la Ley de 1713: Al restablecer la "antigua costumbre", se anula la norma introducida por Felipe V (el primer Borbón), que daba prioridad absoluta a los varones sobre las mujeres. El texto presenta la medida no como una innovación, sino como una vuelta a la tradición castellana de las Partidas de Alfonso X.
•	Consecuencia sucesoria inmediata: Tras su publicación y el nacimiento de Isabel II en octubre de 1830, la princesa se convirtió en la heredera legítima.
•	Inicio del conflicto carlista: La validez de este documento fue impugnada por los carlistas (especialmente durante los Sucesos de La Granja en 1832). A la muerte de Fernando VII en 1833, la negativa de Carlos María Isidro a reconocer la Pragmática Sanción dio inicio a la Primera Guerra Carlista, un conflicto civil que marcaría gran parte del siglo XIX español.`,
  }
  ],
  "bloque-7": [
    { titulo: "Estatuto Real (1834)", 
      descripcion: "Carta otorgada por María Cristina.",
      texto: `Art. 1. [...] Su Majestad la Reina Gobernadora, en nombre de su excelsa hija Doña Isabel II, ha resuelto convocar las Cortes generales del Reino.
Art. 2. Las Cortes generales se compondrán de dos Estamentos: el de Próceres del Reino y el de Procuradores del Reino.
Art. 24. Al Rey toca exclusivamente convocar, suspender y disolver las Cortes.
Art. 31. Las Cortes no podrán deliberar sobre ningún asunto que no se haya sometido expresamente a su examen por un Decreto Real.
Art. 33. Para que las resoluciones de las Cortes tengan fuerza de ley, se requiere que después de aprobadas por ambos Estamentos, obtengan la sanción del Rey.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico-político de carácter primario. Se trata de una Carta Otorgada promulgada por la regente María Cristina de Borbón en 1834, bajo el gobierno del liberal moderado Francisco Martínez de la Rosa. A diferencia de una Constitución, no emana de la voluntad del pueblo, sino de la soberanía del monarca, quien limita sus propios poderes voluntariamente.
2. Contexto histórico
El documento surge en los inicios de la Minoría de edad de Isabel II y el estallido de la Primera Guerra Carlista (1833-1840). Tras la muerte de Fernando VII, la regente María Cristina necesitaba apoyos para defender el trono de su hija frente a las pretensiones de Carlos María Isidro (apoyado por los absolutistas).
Al verse obligada a pactar con los liberales, la regente buscó una solución de compromiso: un reformismo desde arriba que contentara a los liberales moderados sin romper totalmente con la tradición monárquica. El Estatuto Real fue el puente entre el absolutismo de la "Década Ominosa" y el liberalismo pleno que llegaría con la Constitución de 1837.
3. Explicación del contenido
El fragmento refleja el carácter restrictivo y conservador de este marco legal:
•	Bicameralismo aristocrático: Se establecen dos cámaras llamadas "Estamentos". El de Próceres (Cámara Alta) estaba formado por la nobleza, el alto clero y las grandes fortunas, de designación real y carácter vitalicio. El de Procuradores (Cámara Baja) era elegido por un sufragio censitario muy restringido (apenas el 0,15% de la población).
•	Preeminencia de la Corona: El Rey (o la Regente en su nombre) mantiene el control total sobre las Cortes: tiene la potestad exclusiva de convocarlas, suspenderlas o disolverlas. Sin la "sanción real", ninguna decisión de las Cortes tenía validez.
•	Limitación del poder legislativo: Las Cortes no tienen iniciativa legislativa propia (art. 31); solo pueden discutir los asuntos que el monarca decida someterles. Funcionaban más como un órgano consultivo que como un parlamento soberano.
•	Soberanía compartida: El Estatuto niega el principio de soberanía nacional de Cádiz (1812). Aquí la soberanía reside en "el Rey con las Cortes", lo que supuso una decepción para los liberales progresistas, quienes poco después forzarían cambios más radicales en el Motín de los Sargentos de La Granja (1836).`,
    },
    { titulo: "Real Decreto de Desamortización de Mendizábal (1836)", 
      descripcion: "Venta de bienes del clero regular.",
      texto: `Atendiendo a la necesidad de poner en pronta ejecución la ley de 16 de enero último... vengo en decretar lo siguiente: Quedan declarados en venta desde ahora todos los bienes raíces de cualquier clase que hubiesen pertenecido a las comunidades y corporaciones religiosas extinguidas... El producto de todas las ventas que se verifiquen se aplicará a la amortización de la Deuda Pública.`,
      explicacion: `1. Clasificación y Naturaleza
Se trata de una fuente primaria de naturaleza jurídico-legal (un Real Decreto) y de contenido económico-social. El autor es Juan Álvarez Mendizábal, ministro de Hacienda y jefe de Gobierno, y el destinatario es la nación española, aunque formalmente se dirige a la regente María Cristina de Borbón.
2. Contexto Histórico
El texto se sitúa en 1836, durante la Minoría de Edad de Isabel II (Regencia de María Cristina). Es un momento crítico por dos razones:
•	La Primera Guerra Carlista (1833-1840): El bando cristino (liberal) necesita fondos urgentes para financiar el ejército frente a los partidarios del absolutismo (carlismo).
•	La Revolución Liberal: Tras el estallido de las revueltas de 1835, Mendizábal llega al poder para desmantelar definitivamente el Antiguo Régimen y establecer un sistema liberal progresista.
3. Definición del Proceso
La desamortización fue el proceso jurídico y político mediante el cual el Estado expropió tierras y bienes que estaban en "manos muertas" (Iglesia y municipios, que no podían venderse ni repartirse) para convertirlos en propiedad privada y sacarlos a pública subasta. La de Mendizábal (1836) fue específicamente eclesiástica (bienes del clero regular).
4. Explicación del Contenido y Objetivos
El texto establece el mecanismo de venta de los bienes del clero regular (monjes y frailes) cuyos conventos habían sido suprimidos. Los objetivos principales descritos en el decreto son:
•	Objetivo Financiero: El más urgente. Recaudar fondos para ganar la Guerra Carlista y, sobre todo, amortizar la asfixiante Deuda Pública del Estado para recuperar la confianza de los prestamistas internacionales.
•	Objetivo Político: Vincular a los compradores de tierras (burguesía y aristocracia) con la causa de Isabel II. Si los carlistas ganaban, los compradores perderían sus nuevas tierras; por tanto, se convertían en defensores del liberalismo por interés propio.
•	Objetivo Social y Económico: Crear una clase media de propietarios agrícolas que modernizaran la agricultura. (Cabe mencionar que este objetivo fracasó, ya que las tierras fueron compradas por la alta burguesía, consolidando el latifundismo en el sur de España y perjudicando al campesinado, que perdió el uso de las tierras comunales o eclesiásticas).`,
    },
    { titulo: "Constitución de 1837", 
      descripcion: "Texto constitucional progresista.",
      texto: `Art. 2. Todos los españoles pueden imprimir y publicar libremente sus ideas sin previa censura, con sujeción a las leyes. [...]
Art. 11. La Nación se obliga a mantener el culto y los ministros de la religión católica que profesan los españoles.
Art. 12. La potestad de hacer las leyes reside en las Cortes con el Rey.
Art. 13. Las Cortes se componen de dos cuerpos colegisladores, iguales en facultades: el Senado y el Congreso de los Diputados.
Art. 45. La potestad de hacer ejecutar las leyes reside en el Rey, cuya persona es sagrada e inviolable, y no está sujeta a responsabilidad. A los ministros corresponde la responsabilidad.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Constitución de 1812 revisada, aunque en la práctica fue una nueva carta magna promulgada en junio de 1837 durante la regencia de María Cristina. Es de ideología liberal progresista, pero con importantes concesiones al moderantismo para lograr un texto de consenso.
2. Contexto histórico
El documento surge en un momento de gran inestabilidad durante la Primera Guerra Carlista (1833-1840). El descontento con el limitado Estatuto Real de 1834 provocó el Motín de los Sargentos de La Granja (1836), que obligó a la regente a restablecer la Constitución de Cádiz y entregar el poder a los progresistas (Calatrava y Mendizábal).
Sin embargo, los progresistas comprendieron que la Constitución de 1812 era demasiado radical para la época y para la propia regente. Por ello, convocaron Cortes Constituyentes para redactar un nuevo texto que, manteniendo el espíritu liberal, introdujera elementos de orden que permitieran la alternancia política y el fin de la guerra civil.
3. Explicación del contenido
El texto es una síntesis de principios progresistas y mecanismos de control moderados:
•	Soberanía Nacional y Derechos: Se mantiene el principio de soberanía nacional (aunque en el preámbulo se menciona de forma ambigua) y se reconoce una amplia declaración de derechos, destacando la libertad de prensa sin censura previa (Art. 2) y la Milicia Nacional.
•	Bicameralismo: A diferencia de la cámara única de 1812, se establecen dos: el Congreso de los Diputados (electivo) y el Senado (cuyos miembros eran nombrados por el Rey a propuesta de una lista). Esto era una concesión conservadora para frenar los impulsos populares.
•	Reforzamiento del poder real: El Rey mantiene la potestad legislativa compartida con las Cortes y posee el derecho de veto absoluto y la capacidad de disolver el Parlamento. Se establece la figura de la "responsabilidad ministerial", separando la figura del Rey de sus actos políticos (Art. 45).
•	Cuestión Religiosa: El artículo 11 es una fórmula de compromiso tras la desamortización de Mendizábal. El Estado deja de ser confesional "por derecho", pero se compromete a mantener económicamente a la Iglesia Católica como compensación por los bienes incautados.
•	Sufragio Censitario: Aunque no se especifica en el texto constitucional, la ley electoral posterior estableció un sufragio censitario (solo votan quienes tienen cierto nivel de renta), aunque algo más amplio que el del Estatuto Real.`,
    },
    { titulo: "Constitución de 1845", 
      descripcion: "Texto constitucional moderado.",
      texto: `DOÑA ISABEL II, por la gracia de Dios y de la Constitución de la Monarquía española, Reina de las Españas... hemos venido, en unión y de acuerdo con las Cortes actualmente reunidas, en reformar la Constitución de 1837. [...]
Art. 11. La Religión de la Nación española es la Católica, Apostólica, Romana. El Estado se obliga a mantener el culto y sus ministros.
Art. 12. La potestad de hacer las leyes reside en las Cortes con el Rey.
Art. 14. El número de los Senadores es ilimitado: su nombramiento pertenece al Rey.
Art. 15. Solo podrán ser nombrados Senadores los españoles que [...] posean una renta propia de treinta mil reales.
Art. 22. Para ser Diputado se requiere [...] poseer una renta propia anual de doce mil reales, o pagar por contribuciones directas mil reales.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Constitución de 1845, promulgada en mayo de ese año durante la mayoría de edad de Isabel II. Es la expresión jurídica del Partido Moderado y se presenta formalmente como una reforma de la de 1837, aunque en la práctica establece un nuevo modelo político basado en el liberalismo doctrinario.
2. Contexto histórico
El documento se sitúa en el inicio de la Década Moderada (1844-1854). Tras la caída del regente Espartero y la proclamación de la mayoría de edad de Isabel II (con solo 13 años), el general Narváez asumió el liderazgo del gobierno.
Los moderados, representantes de la alta burguesía y la aristocracia, consideraban que la Revolución Liberal ya había cumplido sus objetivos y que ahora era necesario un periodo de "orden y libertad" (entendida esta última de forma restrictiva). Para ello, anularon la Constitución progresista de 1837 y redactaron esta nueva ley fundamental que rigió España durante la mayor parte del reinado de Isabel II, salvo breves paréntesis.
3. Explicación del contenido
El fragmento ilustra perfectamente el giro conservador del régimen isabelino:
•	Soberanía Compartida: A diferencia de la soberanía nacional de 1812 y 1837, el preámbulo establece que la soberanía reside en las Cortes con el Rey. Se elimina el principio de que el poder emana de la nación; ahora el Rey y las Cortes están al mismo nivel político.
•	Confesionalidad del Estado: El artículo 11 va más allá del compromiso económico de 1837 y declara explícitamente que la religión católica "es la de la nación española", lo que supuso una reconciliación con la Santa Sede que culminaría en el Concordato de 1851.
•	Senado de Nombramiento Real: El artículo 14 elimina el carácter electivo del Senado. A partir de ahora, los senadores son elegidos directamente por el Rey, tienen carácter vitalicio y deben pertenecer a las élites económicas (art. 15). Esto convertía a la Cámara Alta en un freno contra cualquier iniciativa progresista del Congreso.
•	Sufragio Censitario Extremadamente Restringido: Aunque no aparece en estos artículos, la ley electoral derivada de esta Constitución redujo el censo de votantes al 1% de la población (solo los "capaces" o grandes contribuyentes).
Supresión de la Milicia Nacional: Aunque el fragmento no lo menciona, la Constitución de 1845 eliminó esta institución progresista, sustituyéndola por la Guardia Civil (creada en 1844) para mantener el orden público en el ámbito rural.`,
    },
    { titulo: "Ley de Desamortización de Madoz (1855)", 
      descripcion: "Venta de bienes municipales.",
      texto: `Art. 1.º Se declaran en estado de venta, con arreglo a las prescripciones de la presente ley, y sin perjuicio de las cargas y servidumbres a que legítimamente estén sujetos, todos los bienes inmuebles de propiedad particular pertenecientes:
1.º Al Estado. 2.º Al clero. 3.º A las órdenes militares de Santiago, Alcántara, Calatrava, Montesa y San Juan de Jerusalén. [...] 5.º A las cofradías, obras pías y santuarios. 6.º A los propios y comunes de los pueblos. 7.º A la beneficencia. 8.º A la instrucción pública. Y cualesquiera otros pertenecientes a manos muertas, ya estén o no mandados vender por leyes anteriores. [...]
Art. 3.º Se procederá a la enajenación de todos y cada uno de los bienes mandados vender por esta ley, sacándolos a pública licitación.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y económico de carácter primario. Se trata de la Ley de Desamortización General, promulgada el 1 de mayo de 1855 por el ministro de Hacienda Pascual Madoz durante el reinado de Isabel II. Es conocida como la "desamortización civil" por afectar principalmente a los bienes de los municipios, completando el proceso iniciado décadas atrás por Mendizábal.
2. Contexto histórico
El documento se sitúa en el Bienio Progresista (1854-1856). Tras la Vicalvarada, los progresistas liderados por Espartero llegaron al poder con un programa de modernización económica. El Estado necesitaba fondos urgentemente por dos razones: reducir la asfixiante deuda pública y, sobre todo, financiar la Ley General de Ferrocarriles (1855).
A diferencia de 1836, esta ley no se justificaba por una guerra civil, sino por la necesidad de impulsar la revolución industrial en España. La burguesía progresista veía en los bienes comunales de los pueblos una "riqueza muerta" que debía pasar a manos privadas para ser productiva según los principios del liberalismo económico.
3. Explicación del contenido
El fragmento muestra la ambición universal de esta ley y sus mecanismos:
•	Carácter General (Art. 1): La ley afecta a todos los bienes de "manos muertas". Esto incluye lo que quedaba del clero (clero secular), pero su gran novedad es el punto 6.º: los bienes de propios y comunes de los ayuntamientos.
•	Venta en pública subasta (Art. 3): El método de enajenación sigue siendo la licitación pública. A diferencia de la de Mendizábal, en esta ocasión el pago se exigía mayoritariamente en metálico, lo que permitió al Estado obtener liquidez inmediata para invertir en infraestructuras (ferrocarril).
•	Impacto social en el campesinado: Fue la consecuencia más dramática. Al venderse los bienes comunales (tierras donde los campesinos pobres recogían leña o pastoreaban), el campesinado perdió su medio de subsistencia complementario. Esto aceleró el proceso de proletarización rural y aumentó el número de jornaleros desposeídos.
•	Consolidación de la burguesía: Al igual que en procesos anteriores, las tierras fueron compradas por la burguesía urbana y la nobleza, quienes consolidaron su poder como grandes terratenientes, frustrando de nuevo cualquier intento de reforma agraria redistributiva.`,
    },
    { titulo: "Manifiesto de Manzanares (1854)", 
      descripcion: "Documento del Bienio Progresista.",
      texto: `Nosotros queremos la conservación del Trono, pero sin la camarilla que lo deshonra; queremos la práctica rigurosa de las leyes fundamentales, mejorándolas, sobre todo, la electoral y la de imprenta; queremos la rebaja de los impuestos, fundada en una estricta economía [...]; queremos arrancar a los pueblos de la centralización que los devora, dándoles la independencia local necesaria para que conserven y aumenten sus intereses propios; y como garantía de todo esto queremos y plantearemos bajo sólidas bases la Milicia Nacional. [...] Tales son las ideas que expresamos de cara a la Nación y que estamos decididos a triunfar.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto político y circunstancial de carácter primario. Se trata de un manifiesto redactado por un joven Antonio Cánovas del Castillo y firmado por el general Leopoldo O’Donnell en Manzanares (Ciudad Real) el 7 de julio de 1854. Su función fue movilizar el apoyo popular y de los sectores progresistas tras el incierto resultado militar del levantamiento de la Vicalvarada.
2. Contexto histórico
El documento surge en la crisis final de la Década Moderada (1844-1854). El gobierno moderado se encontraba desprestigiado por la corrupción, el autoritarismo de sus últimos gabinetes y el excesivo peso de la "camarilla" (influjo de cortesanos y clérigos) sobre la reina Isabel II.
Tras el enfrentamiento militar de Vicálvaro entre las tropas de O'Donnell y las gubernamentales, que terminó en tablas, los sublevados necesitaban ensanchar su base de apoyo. El Manifiesto de Manzanares logró atraer a los liberales progresistas y a las masas populares. El éxito del manifiesto provocó levantamientos en las ciudades y la formación de Juntas revolucionarias, obligando a la reina a llamar al poder al general Espartero, iniciando así el Bienio Progresista (1854-1856).
3. Explicación del contenido
El fragmento detalla las promesas reformistas para convencer a la opinión pública progresista:
•	Mantenimiento del Trono pero sin "camarilla": Se declara lealtad a Isabel II, pero se exige la eliminación de su entorno corrupto. Es una crítica directa al modo de gobernar de los moderados.
•	Reformas liberales: El texto pide mejorar la ley electoral (ampliar el sufragio censitario) y la ley de imprenta (eliminar la censura), pilares de las libertades civiles que los moderados habían restringido.
•	Descentralización y fiscalidad: La mención a la "centralización que los devora" busca el apoyo de los ayuntamientos y las provincias, prometiendo mayor autonomía local y una rebaja de impuestos mediante la "estricta economía" (control del gasto público).
•	La Milicia Nacional: Es la petición clave del programa progresista. Reinstaurar este cuerpo de ciudadanos armados era la garantía de que los cambios políticos no serían revertidos por el ejército o la Corona.
•	Consecuencia política: Este texto es fundamental porque unió a militares moderados "aperturistas" con civiles progresistas, una coalición que más tarde daría lugar a la Unión Liberal, partido que dominaría la política española en los años siguientes.`,
    },
    { titulo: "Manifiesto España con honra (1868)", 
      descripcion: "Inicio de la Revolución Gloriosa.",
      texto: `¡Españoles!: La ciudad de Cádiz, puesta en armas con toda su provincia [...] niega su obediencia al gobierno que reside en Madrid, segura de que es leal intérprete de los ciudadanos [...]. Queremos que un Gobierno provisional que represente todas las fuerzas vivas del país asegure el orden, en tanto que el sufragio universal eche los cimientos de nuestra regeneración política. [...]
Hollada la ley fundamental; corrompido el sufragio por la amenaza y el soborno; dependiente la seguridad individual, no del derecho, sino de la irresponsable voluntad de cualquiera de las autoridades; muerto el Municipio; tiranizada la enseñanza; muda la prensa... ¡Españoles!, ¡Paz, liberalismo y orden! Queremos que el hombre libre sea respetado; que la familia dignificada no tenga que avergonzarse de sus gentes... ¡Viva España con honra!`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto circunstancial y político de carácter primario y fuente directa. Se trata de una proclama revolucionaria emitida en Cádiz el 19 de septiembre de 1868. El texto está firmado por las figuras militares que encabezaron el pronunciamiento: los generales Prim, Serrano y el almirante Topete, entre otros. Su función es justificar el levantamiento armado y llamar a la insurrección popular para derrocar a Isabel II.
2. Contexto histórico
El documento se sitúa en la crisis final del reinado de Isabel II. Tras años de autoritarismo del Partido Moderado, crisis económica (agraria, financiera y ferroviaria) y el desprestigio personal de la reina, la oposición se unió en el Pacto de Ostende (1866). En este pacto, progresistas y demócratas (a los que se unió más tarde la Unión Liberal) acordaron acabar con el sistema borbónico.
El pronunciamiento en Cádiz, tradicional cuna del liberalismo, desencadenó un movimiento de Juntas Revolucionarias por todo el país. Tras la derrota de las tropas leales a la reina en la batalla de Alcolea, Isabel II partió al exilio en Francia, abriendo una etapa de experimentación democrática inédita en España.
3. Explicación del contenido
El fragmento detalla los agravios acumulados y los objetivos de los revolucionarios:
•	Denuncia de la corrupción del sistema: El texto hace un diagnóstico demoledor de la etapa anterior: "sufragio corrompido", "prensa muda" y falta de seguridad jurídica. Se acusa al gobierno de Madrid de gobernar fuera de la ley y de espaldas a los ciudadanos.
•	Soberanía Nacional y Sufragio Universal: Es la gran novedad del texto. Se propone la creación de un Gobierno Provisional y la convocatoria de Cortes Constituyentes mediante sufragio universal masculino, rompiendo con el sufragio censitario de los moderados.
•	Regeneración Política: El lema "España con honra" alude no solo a la limpieza administrativa, sino a la dignidad de una nación que se sentía humillada por la política de la Corte y la camarilla de la reina.
•	Orden y Libertad: A pesar de ser un texto revolucionario, los firmantes insisten en el "orden" y la "paz". Buscaban tranquilizar a la burguesía y a las potencias extranjeras, asegurando que el cambio no derivaría en un caos social, sino en un sistema liberal democrático estable.
•	Consecuencias: Este manifiesto dio paso a la Constitución de 1869, la más liberal de la historia española del siglo XIX, que estableció la monarquía democrática, el sufragio universal y una amplia declaración de derechos civiles y religiosos.`,
    },
    { titulo: "Constitución de 1869", 
      descripcion: "Constitución democrática del Sexenio.",
      texto: `La Nación Española y en su nombre las Cortes Constituyentes, elegidas por sufragio universal, deseando establecer la justicia, la libertad y la seguridad [...] decretan y sancionan lo siguiente:
Art. 3º. Todo detenido será puesto en libertad o entregado a la autoridad judicial dentro de las veinticuatro horas siguientes al acto de la detención. [...]
Art. 17º. Tampoco podrá ser privado ningún español: Del derecho de emitir libremente sus ideas y opiniones [...]. Del derecho de reunirse pacíficamente. Del derecho de asociarse para todos los fines de la vida humana [...].
Art. 21º. La Nación se obliga a mantener el culto y los ministros de la religión católica. El ejercicio público o privado de cualquiera otro culto queda garantizado a todos los extranjeros residentes en España [...]. Si algunos españoles profesaren otra religión que la católica, es aplicable a los mismos todo lo dispuesto en el párrafo anterior.
Art. 32º. La soberanía reside esencialmente en la Nación, de la cual emanan todos los poderes.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Constitución de 1869, aprobada por las Cortes Constituyentes tras el triunfo de la Revolución de 1868 ("La Gloriosa"). Es una carta magna de ideología liberal democrática, la más avanzada de su siglo en España, que rompe con el modelo moderado del reinado de Isabel II.
2. Contexto histórico
El documento nace en el inicio del Sexenio Democrático (1868-1874). Tras el derrocamiento de Isabel II y el éxito del manifiesto "España con honra", se formó un Gobierno Provisional (liderado por Prim y Serrano) que convocó elecciones a Cortes Constituyentes por sufragio universal masculino.
Fue un periodo de gran efervescencia política donde progresistas, demócratas y la Unión Liberal debatieron el nuevo modelo de Estado. El principal desafío tras aprobar esta Constitución fue encontrar un monarca que aceptara este papel democrático, búsqueda que culminaría con la elección de Amadeo I de Saboya. El contexto estuvo marcado también por el inicio de la guerra en Cuba y la agitación social derivada de las aspiraciones de las clases populares.
3. Explicación del contenido
El fragmento destaca los pilares que hacen de este texto una constitución democrática:
•	Soberanía Nacional y Sufragio Universal: El artículo 32 proclama que la soberanía reside en la Nación. Por primera vez, el poder no es compartido con la Corona. Además, el preámbulo confirma que las Cortes han sido elegidas por sufragio universal (masculino), eliminando el restrictivo sufragio censitario anterior.
•	Declaración de Derechos y Libertades: Los artículos 3 y 17 muestran una protección inédita de los derechos individuales: seguridad jurídica (habeas corpus), libertad de expresión, y los derechos de reunión y asociación, fundamentales para el posterior desarrollo del movimiento obrero en España.
•	Libertad de Cultos: El artículo 21 es uno de los más innovadores y polémicos. Aunque el Estado mantiene económicamente a la Iglesia Católica, se garantiza por primera vez la libertad de culto (público y privado) tanto para extranjeros como para españoles, rompiendo con la unidad religiosa tradicional.
•	Monarquía Parlamentaria: Aunque el fragmento no detalla la figura del rey, la Constitución define a España como una monarquía donde el monarca tiene facultades muy limitadas. El poder legislativo reside exclusivamente en las Cortes (divididas en Congreso y Senado), y el Rey solo sanciona y promulga las leyes.`,
    },
    { titulo: "Abdicación de Amadeo de Saboya (1873)", 
      descripcion: "Renuncia oficial al trono.",
      texto: `Dos años largos ha que ciño la Corona de España, y la España vive en constante lucha, viendo cada día más lejana la era de paz y de ventura que tan ardientemente anhelo. Si fuesen extranjeros los enemigos de su dicha, entonces, al frente de estos soldados tan valientes como sufridos, sería el primero en combatirlos [...].
Pero todos los que con la espada, con la pluma, con la palabra agravan y perpetúan los males de la Nación son españoles; todos invocan el dulce nombre de la Patria, todos pelean y se agitan por su bien; y entre el fragor del combate, el estruendo de las armas y las contradicciones de la opinión, no es posible atinar cuál es la verdadera [...]. Nadie achacará a flaqueza de mi ánimo esta resolución. No habría peligro que me moviera a despojarme de la Corona si creyera que la llevaba en mis sienes para bien de los españoles.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto narrativo y político de carácter primario. Se trata del Manifiesto de Abdicación de Amadeo I de Saboya, leído ante las Cortes el 11 de febrero de 1873. Su función es comunicar la renuncia irrevocable al trono español, exponiendo los motivos de su decisión y devolviendo a la Nación los poderes que le fueron otorgados en 1870.
2. Contexto histórico
El documento se sitúa en la fase final de la monarquía del Sexenio Democrático (1868-1874). Tras la Revolución de 1868 y la aprobación de la Constitución de 1869, las Cortes eligieron a Amadeo de Saboya como rey. Sin embargo, su reinado nació muerto políticamente: su principal valedor, el general Prim, fue asesinado días antes de su llegada.
Amadeo se encontró con una oposición total: los carlistas (en guerra desde 1872), los alfonsinos (que querían la vuelta de los Borbones), los republicanos y el propio movimiento obrero. A esto se sumó la inestabilidad de los partidos que debían apoyarle (progresistas y unionistas) y el conflicto en Cuba. El detonante final fue un conflicto con el cuerpo de Artillería, que dejó al rey sin apoyos militares, llevándole a firmar este texto. Esa misma noche, el vacío de poder fue llenado con la proclamación de la Primera República.
3. Explicación del contenido
El fragmento destaca la amargura del monarca ante la situación de ingobernabilidad de España:
•	La imposibilidad de la paz: Amadeo lamenta que, tras dos años, la "paz y ventura" son inalcanzables. Reconoce que el problema de España no es una amenaza externa, sino el enfrentamiento fratricida entre los propios españoles.
•	La crítica a la clase política: El rey señala que tanto los que usan "la espada" (militares) como los que usan "la pluma y la palabra" (políticos y periodistas) son responsables de perpetuar los males de la nación. Describe un escenario de confusión donde todos dicen actuar por la "Patria", pero sus acciones solo generan caos.
•	Justificación de su salida: Amadeo aclara que su renuncia no se debe a cobardía o "flaqueza de ánimo", sino a una cuestión ética: al no poder ser útil para el "bien de los españoles", su permanencia en el trono carece de sentido.
•	Consecuencias: La abdicación dejó a las Cortes en una situación inédita. Al no haber un candidato alternativo al trono, la unión de radicales y republicanos desembocó en una solución de urgencia: la República, que heredaría todos los problemas (Guerra Carlista, Cuba, división interna) que Amadeo describe en su escrito.`,
    }
  ],
  "bloque-8": [
    { titulo: "Manifiesto de Sandhurst (1874)", 
      descripcion: "Programa político de Alfonso XII.",
      texto: `Cuantos me han escrito muestran igual convicción de que solo el restablecimiento de la monarquía constitucional puede poner término a la opresión, a la incertidumbre y a las crueles perturbaciones que experimenta España. [...]
Huérfana la nación ahora de todo derecho público e indefinidamente privada de sus libertades, natural es que vuelva los ojos a las instituciones acostumbradas. [...] No hay que esperar que decida yo nada de plano y arbitrariamente; sin Cortes no resolvieron los negocios arduos los Reyes antiguos de España, y jamás olvidaré que soy un Rey constitucional. [...] Sea la que sea mi propia suerte, ni dejaré de ser buen español, ni, como todos mis antepasados, buen católico, ni, como hombre del siglo, verdaderamente liberal.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto político y circunstancial de carácter primario. Se trata de un manifiesto firmado el 1 de diciembre de 1874 por el príncipe Alfonso de Borbón (futuro Alfonso XII) desde la academia militar de Sandhurst (Reino Unido). Aunque firmado por el príncipe, el autor intelectual fue Antonio Cánovas del Castillo, líder del partido alfonsino, quien buscaba preparar la opinión pública para el regreso de la dinastía borbónica.
2. Contexto histórico
El documento se sitúa en la fase final del Sexenio Democrático (1868-1874). Tras el fracaso de la monarquía de Amadeo de Saboya y la inestabilidad de la Primera República (marcada por el cantonalismo, la Tercera Guerra Carlista y la guerra en Cuba), el régimen republicano se encontraba en una dictadura transitoria bajo el general Serrano (República Presidencialista).
Cánovas quería evitar un nuevo pronunciamiento militar y prefería que la restauración de la monarquía fuera el resultado de un amplio consenso civil y político. Sin embargo, poco después de publicarse este manifiesto, el general Martínez Campos se adelantó en Sagunto, proclamando a Alfonso XII y acelerando el proceso que daría lugar al sistema de la Restauración y a la Constitución de 1876.
3. Explicación del contenido
El fragmento condensa los tres pilares sobre los que Cánovas quería edificar el nuevo régimen:
•	Monarquía Constitucional y Liberal: El príncipe se define como un "hombre del siglo, verdaderamente liberal". Con esto, busca tranquilizar a quienes temían una vuelta al absolutismo de su madre (Isabel II) o de su abuelo (Fernando VII). Promete gobernar con las Cortes, aceptando el sistema parlamentario.
•	Catolicismo: Al reafirmarse como "buen católico", el texto busca atraer a los sectores conservadores y a la Iglesia, que se habían sentido atacados durante el Sexenio (libertad de cultos, laicismo), intentando así desactivar el apoyo social al carlismo.
•	Tradición y Orden: Presenta a la Monarquía como la "institución acostumbrada" frente a la "incertidumbre" de los experimentos republicanos. Cánovas utiliza la figura del príncipe para ofrecer estabilidad a la burguesía y al ejército, cansados de las "crueles perturbaciones" (guerras y revueltas sociales).
•	Legitimidad histórica: El manifiesto apela al derecho histórico de la dinastía, pero adaptado a la realidad moderna. Es el punto de partida del turnismo pacífico y del sistema canovista que dominaría la política española hasta 1923.`,
    },
    { titulo: "Constitución de 1876", 
      descripcion: "Norma fundamental del sistema canovista.",
      texto: `Art. 11. La Religión Católica, Apostólica, Romana, es la del Estado. La Nación se obliga a mantener el culto y sus ministros. Nadie será molestado en el territorio español por sus opiniones religiosas, ni por el ejercicio de su respectivo culto, salvo el respeto debido a la moral cristiana. No se permitirán, sin embargo, otras ceremonias ni manifestaciones públicas que las de la religión del Estado. [...]
Art. 18. La potestad de hacer las leyes reside en las Cortes con el Rey.
Art. 19. Las Cortes se componen de dos Cuerpos Colegisladores, iguales en facultades: el Senado y el Congreso de los Diputados.
Art. 20. El Senado se compone: 1.º De senadores por derecho propio. 2.º De senadores vitalicios nombrados por la Corona. 3.º De senadores elegidos por las corporaciones del Estado y mayores contribuyentes... [...]
Art. 50. La potestad de hacer ejecutar las leyes reside en el Rey.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Constitución de 1876, la de mayor vigencia en la historia de España (hasta 1923). Fue promulgada por Alfonso XII y redactada bajo la dirección de Antonio Cánovas del Castillo. Su ideología es el liberalismo doctrinario (conservador), basado en la búsqueda de estabilidad y el rechazo a los excesos democráticos del Sexenio.
2. Contexto histórico
El documento nace tras el golpe de Estado de Martínez Campos en Sagunto (1874), que restaura a los Borbones en el trono. Cánovas del Castillo, el arquitecto del nuevo sistema, busca superar la inestabilidad del siglo XIX mediante el turnismo pacífico entre dos grandes partidos: el Conservador y el Liberal.
Para que este sistema funcionara, se necesitaba una Constitución flexible. El texto de 1876 sustituye a la democrática de 1869 y se sitúa en un punto medio entre la moderada de 1845 y la progresista de 1837, permitiendo que el partido en el poder desarrollara su política mediante leyes orgánicas sin romper el marco constitucional.
3. Explicación del contenido
El fragmento refleja los principios de la "Constitución interna" de Cánovas (Rey y Cortes):
•	Soberanía Compartida (Art. 18): Se niega la soberanía nacional. El poder legislativo reside en las "Cortes con el Rey". El monarca recupera amplias prerrogativas: derecho de veto, mando supremo del ejército y la facultad de convocar o disolver las Cortes.
•	Confesionalidad con tolerancia limitada (Art. 11): Es una solución de compromiso. El Estado es oficialmente católico y mantiene a la Iglesia, pero se permite el culto privado de otras religiones. Sin embargo, se prohíben las manifestaciones públicas no católicas, lo que satisfacía a los sectores conservadores sin romper totalmente con Europa.
•	Bicameralismo conservador (Art. 19 y 20): Se establece un Senado muy elitista, donde una gran parte de los miembros son elegidos por el Rey o pertenecen a la alta aristocracia por derecho propio. Esto aseguraba que las leyes aprobadas en el Congreso (más popular) pudieran ser frenadas por las élites.
•	Ambigüedad en los derechos: Aunque reconoce derechos similares a los de 1869 (imprenta, asociación), su ejercicio quedaba regulado por leyes posteriores. Esto permitió que, por ejemplo, el tipo de sufragio no figurara en la Constitución: los conservadores aplicaron el sufragio censitario y, más tarde, los liberales el sufragio universal masculino (1890) sin necesidad de cambiar la Constitución.
•	Estabilidad y fraude: Este marco legal permitió el funcionamiento del "caciquismo" y el "encasillado", asegurando que el partido que convocaba elecciones siempre las ganara, manteniendo la paz civil a costa de la pureza democrática.`,
    },
    { titulo: "Tratado de Zanjón (1878)", 
      descripcion: "Fin de la Guerra de los Diez Años en Cuba.",
      texto: `Art. 1.º Concesión a la isla de Cuba de las mismas condiciones políticas, orgánicas y administrativas de que disfruta la isla de Puerto Rico.
Art. 3.º Amnistía a los olvidados de delitos políticos cometidos desde el principio de la rebelión en 1868 hasta el presente. [...]
Art. 4.º Libertad a los esclavos y colonos asiáticos que se hallen en las filas de los insurrectos.
Art. 6.º El Gobierno de S.M. facilitará y proporcionará por los medios que estén a su alcance la salida de la Isla a todos los que quieran verificarlo. [...]
Art. 9.º La capitulación de las fuerzas insurrectas se verificará con las debidas honras de la guerra, entregando las armas ante los jefes y oficiales del Ejército español.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto de naturaleza jurídica y política de carácter primario. Se trata de una capitulación o acuerdo de paz firmado el 10 de febrero de 1878 entre el general español Arsenio Martínez Campos y el Comité del Centro (representantes de los insurgentes cubanos). Su función fue finalizar las hostilidades de la Primera Guerra de Cuba bajo condiciones de compromiso y perdón.
2. Contexto histórico
El documento se enmarca en los inicios de la Restauración borbónica. Tras el fin de la Tercera Guerra Carlista en la Península, el gobierno de Cánovas pudo enviar refuerzos masivos a Cuba. El general Martínez Campos, consciente de que una victoria puramente militar sería costosa y efímera, optó por una estrategia mixta: presión militar y negociación política.
La Guerra de los Diez Años había desgastado profundamente a ambos bandos. Los insurgentes cubanos (mambises) sufrían divisiones internas y falta de recursos. El Pacto de Zanjón logró desmovilizar a la mayoría de las fuerzas rebeldes, aunque líderes como Antonio Maceo se negaron a aceptarlo (Protesta de Baraguá), argumentando que no garantizaba ni la independencia total ni la abolición inmediata de la esclavitud.
3. Explicación del contenido
El fragmento detalla las concesiones que España otorgó para lograr la rendición de los rebeldes:
•	Asimilación administrativa (Art. 1): España prometía a Cuba el mismo estatus que Puerto Rico, lo que implicaba la representación en las Cortes españolas y cierta autonomía administrativa. Esto supuso el nacimiento del "partidismo" legal en la isla (Partido Liberal Autonomista).
•	Medidas de gracia y libertad (Arts. 3 y 4): Se concedió una amnistía general para los combatientes. Un punto clave fue la manumisión de los esclavos que hubieran luchado en el bando insurrecto. Aunque no era la abolición total de la esclavitud (que llegaría en 1886), fue un paso irreversible.
•	Honores de guerra (Art. 9): Para evitar la humillación de la derrota, se permitió una rendición con honores. Esto facilitó que los jefes militares cubanos aceptaran deponer las armas.
•	Consecuencias y fracaso a largo plazo: El pacto fue recibido en España como un éxito de la diplomacia de Martínez Campos. Sin embargo, el ala más conservadora de las Cortes frenó las reformas prometidas (especialmente la autonomía real). Este incumplimiento, sumado a la persistencia del proteccionismo económico español que asfixiaba el comercio cubano con EE. UU., condujo inevitablemente a la "Guerra Chiquita" y, finalmente, a la Guerra del 95.`,
    },
    { titulo: "Tratado de París (1898)", 
      descripcion: "Pérdida de las últimas colonias.",
      texto: `Art. 1.º España renuncia a todo derecho de soberanía y propiedad sobre Cuba. En atención a que dicha isla, cuando sea evacuada por España, va a ser ocupada por los Estados Unidos...
Art. 2.º España cede a los Estados Unidos la isla de Puerto Rico y las demás que están ahora bajo su soberanía en las Indias Occidentales, y la isla de Guam en el archipiélago de las Marianas o Ladrones.
Art. 3.º España cede a los Estados Unidos el archipiélago conocido por las Islas Filipinas [...]. Los Estados Unidos pagarán a España la suma de veinte millones de dólares ($20,000,000) dentro de los tres meses después del canje de las ratificaciones del presente Tratado.
Art. 6.º España pondrá en libertad a todos los prisioneros de guerra y a todos los detenidos por delitos políticos a consecuencia de las insurrecciones en Cuba y en Filipinas y de la guerra con los Estados Unidos.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y de relaciones internacionales de carácter primario. Se trata del tratado de paz firmado el 10 de diciembre de 1898 en París entre las delegaciones de España y Estados Unidos. Su función fue poner fin formal a la guerra hispano-estadounidense y establecer las condiciones de la rendición española tras las derrotas navales de Cavite y Santiago.
2. Contexto histórico
El documento es el resultado del conflicto iniciado en 1895 en Cuba (Grito de Baire) y Filipinas, al que se sumó la intervención de Estados Unidos en 1898 tras la explosión del acorazado Maine en el puerto de La Habana.
España, con una flota obsoleta y un ejército agotado por años de guerra de guerrillas, sufrió una derrota total y rápida. Las negociaciones de paz se llevaron a cabo en París sin la presencia de representantes cubanos o filipinos, evidenciando que el conflicto se había convertido en una disputa entre una potencia decadente y una emergente. La firma del tratado supuso el golpe final al sistema de la Restauración de Cánovas, sumiendo al país en el pesimismo del Regeneracionismo.
3. Explicación del contenido
El fragmento detalla las duras condiciones impuestas por los vencedores:
•	Pérdida de las Antillas (Arts. 1 y 2): España renuncia a la soberanía de Cuba (que quedaría bajo tutela estadounidense hasta 1902) y cede directamente Puerto Rico a los EE. UU. Esto supuso el fin de la presencia española en América, iniciada en 1492.
•	Cesión de Filipinas y el Pacífico (Art. 3): Se entrega el archipiélago filipino y la isla de Guam. A cambio, EE. UU. ofrece una compensación de 20 millones de dólares, una cifra simbólica que apenas cubría los gastos de la guerra y que se interpretó como una "compra" forzosa.
•	Liquidación del conflicto (Art. 6): Se establece la liberación de prisioneros de guerra y presos políticos, facilitando el regreso de los soldados (el "regreso de los repatriados") que poblarían las ciudades españolas con historias de abandono y miseria.
•	Consecuencias: El tratado provocó una crisis de identidad nacional conocida como el "Desastre del 98". Económicamente, aunque se perdieron mercados y materias primas, la repatriación de capitales ayudaría paradójicamente a la banca española. Políticamente, el sistema del "turno" sobrevivió, pero aparecieron movimientos críticos como el Regeneracionismo de Joaquín Costa y la Generación del 98 en la literatura.`,
    },
    { titulo: "Ley de Jurisdicciones (1906)", 
      descripcion: "Protección militar de patria y ejército.",
      texto: `Art. 2.º Los que de palabra, por escrito, por medio de la imprenta, grabado, estampas u otro medio de publicación, injuriaren u ofendieren clara o encubiertamente al Ejército o a la Armada o a instituciones, armas, clases o cuerpos determinados del mismo, serán castigados con la pena de prisión correccional [...].
Art. 3.º Los que de palabra, por escrito o por cualquier otro medio de los indicados en el artículo anterior, instigaren a la insubordinación o al incumplimiento de los deberes militares, o hiciesen la apología de hechos que la ley califica de delitos contra la disciplina de los Institutos armados, serán castigados con la de prisión mayor [...].
Art. 7.º Del conocimiento de los delitos expresados en los artículos anteriores serán competentes los Tribunales Militares.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Ley para la Represión de los Delitos contra la Patria y el Ejército, conocida popularmente como Ley de Jurisdicciones, sancionada en marzo de 1906 por el rey Alfonso XIII y aprobada por el gobierno liberal de Segismundo Moret. Su función es trasladar a la jurisdicción militar cualquier crítica u ofensa vertida contra las instituciones armadas o la unidad de España.
2. Contexto histórico
El documento surge en un clima de extrema tensión entre el ejército y la sociedad civil tras el Desastre del 98. El estamento militar, dolido por las críticas tras la pérdida de las colonias, reaccionó con violencia ante las burlas de la prensa satírica. El detonante directo fueron los sucesos del "¡Cu-Cut!" (1905), donde un grupo de oficiales asaltó la redacción de esta revista satírica catalana y del diario La Veu de Catalunya por una viñeta considerada ofensiva.
En lugar de castigar a los militares, el gobierno cedió a sus presiones y redactó esta ley. Este hecho marcó el inicio de la militarización de la vida política española y provocó una respuesta unitaria en Cataluña: la creación de la Solidaritat Catalana, una coalición que unió a casi todas las fuerzas políticas catalanas (desde carlistas a republicanos) contra la ley y en defensa de la autonomía.
3. Explicación del contenido
El fragmento ilustra la restricción de libertades que supuso esta norma:
•	Control de la libertad de expresión (Art. 2): Define como delito de injurias cualquier crítica "clara o encubierta" al ejército o la armada, extendiéndolo a cualquier medio de publicación. Esto instauró de facto una censura indirecta, ya que los periodistas temían ser juzgados por tribunales militares.
•	Castigo a la instigación (Art. 3): Se penaliza no solo la ofensa, sino cualquier discurso que pudiera interpretarse como un ataque a la disciplina militar o una apología de la insubordinación.
•	Preeminencia del poder militar (Art. 7): Es el punto más grave desde una perspectiva constitucional. Al establecer que los civiles fueran juzgados por Tribunales Militares (jurisdicción especial) por delitos de opinión, se quebró el principio de unidad jurisdiccional y se subordinó el poder civil al militar.
•	Consecuencias: La ley estuvo vigente hasta la llegada de la Segunda República en 1931. Su aplicación alimentó el sentimiento anticlerical y antimilitarista, y fue un factor determinante en el crecimiento del nacionalismo catalán, que vio en esta ley un ataque directo a su identidad y a la libertad de prensa.`,
    },
    { titulo: "Manifiesto de Primo de Rivera (1923)", 
      descripcion: "Justificación del golpe de Estado.",
      texto: `Españoles: Ha llegado para nosotros el momento más temido que esperado (porque hubiéramos querido vivir siempre en la legalidad y que ella hubiese regido sin interrupción la vida española) de recoger vuestras ansias, de atender vuestro respetuoso llamamiento de auxilio y de ofrecer nuestra vida a España, porque decíamos con amor: ¡Queremos un dictador y hacerlo por un procedimiento legítimo! [...]
Pues bien, vamos a desempeñar nosotros la misión a fuerza de paciencia y de serenidad; no tenemos que justificar nuestro acto, que el pueblo sano demanda y impone. Asesinatos de prelados, ex gobernadores, agentes de la autoridad, patronos y obreros; atracos y robos descarados; depreciación de la moneda; francachelas de millones de gastos reservados; sospechosa política arancelaria [...] rastreras intrigas políticas tomando por pretexto la tragedia de Marruecos... [...] No venimos a llorar lástimas y vergüenzas, sino a ponerles pronto remedio.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto político y circunstancial de carácter primario. Se trata de un manifiesto de pronunciamiento emitido el 13 de septiembre de 1923 por el Capitán General de Cataluña, Miguel Primo de Rivera. Su función es justificar el golpe de Estado ante la nación y el Rey, anunciando la suspensión de la Constitución de 1876 y la creación de un Directorio Militar.
2. Contexto histórico
El documento surge en un momento de crisis total del sistema de la Restauración. Desde 1917, España vivía una profunda inestabilidad marcada por el pistolerismo en Barcelona (conflictividad social), el auge del nacionalismo periférico y la fragmentación de los partidos dinásticos.
Sin embargo, el detonante inmediato fue el Desastre de Annual (1921) en Marruecos. La inminente publicación del Expediente Picasso, que apuntaba a responsabilidades de altos mandos militares y posiblemente del propio rey Alfonso XIII en la derrota, aceleró los planes de Primo de Rivera. El golpe contó con la pasividad del Gobierno y el apoyo explícito del monarca, quien nombró al dictador como ministro único.
3. Explicación del contenido
El fragmento detalla la retórica del "cirujano de hierro" (concepto de Joaquín Costa) que Primo de Rivera adopta para salvar a la nación:
•	Justificación del golpe: El dictador presenta su acto no como una ambición personal, sino como una respuesta al "llamamiento de auxilio" de un "pueblo sano". Se presenta como una intervención necesaria pero transitoria para limpiar la política.
•	Denuncia del caos social: Enumera los males que, según él, asolan España: el terrorismo (asesinatos de patronos y obreros), la inseguridad ciudadana (atracos) y la corrupción económica (gastos reservados). Es una crítica frontal al desgobierno del sistema parlamentario.
•	La cuestión de Marruecos: Califica de "rastreras intrigas" las investigaciones parlamentarias sobre el Desastre de Annual. El ejército quería evitar el juicio público por las negligencias en África, y la dictadura fue el mecanismo para cerrar el expediente.
•	Antipoliticismo: El texto rezuma un profundo desprecio por los políticos profesionales ("la vieja política"). Primo de Rivera propone un gobierno de militares que, con "paciencia y serenidad", ponga remedio a las "vergüenzas" nacionales sin las trabas de la democracia parlamentaria.
•	Consecuencias: El manifiesto dio paso a una dictadura de siete años dividida en dos etapas (Directorio Militar y Directorio Civil). Aunque logró pacificar Marruecos (Desembarco de Alhucemas) y un periodo de bonanza económica, su carácter autoritario y la falta de una salida constitucional acabaron por desprestigiar también a la monarquía de Alfonso XIII, abriendo el camino a la Segunda República.`,
    },
    { titulo: "Manifiesto de despedida de Alfonso XIII (1931)", 
      descripcion: "Renuncia al ejercicio del poder real.",
      texto: `Las elecciones celebradas el domingo me revelan claramente que no tengo hoy el amor de mi pueblo. Mi conciencia me dice que ese desvío no será definitivo [...]. Un Rey puede equivocarse, y sin duda erré yo alguna vez; pero sé que nuestra patria se mostró en todo tiempo generosa ante las culpas sin malicia.
Soy el Rey de todos los españoles, y también un español. Hallaría medios sobrados para mantener mis prerrogativas reales, en eficaz forcejeo con quienes las combaten. Pero, resueltamente, quiero apartarme de cuanto sea lanzar a un compatriota contra otro en fratricida guerra. No renuncio a ninguno de mis derechos, porque más que míos son depósito acumulado por la Historia [...]. Espero conocer la auténtica y adecuada expresión de la conciencia colectiva, y mientras habla la nación, suspendo deliberadamente el ejercicio del Poder Real y me alejo de España, reconociéndola así como única señora de sus destinos.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto político y circunstancial de carácter primario. Se trata del Manifiesto de despedida de Alfonso XIII, publicado en el diario ABC el 14 de abril de 1931 (aunque redactado la víspera). Su función es comunicar a la nación la decisión del monarca de suspender sus funciones y abandonar el país tras el triunfo de las candidaturas republicanas en las principales ciudades españolas.
2. Contexto histórico
El documento se sitúa tras el agotamiento de la Dictadura de Primo de Rivera (1923-1930) y el fracaso de la "Dictablanda" de Berenguer y el gobierno de Aznar. El rey había quedado desprestigiado por su apoyo al golpe militar de 1923, lo que llevó a la oposición a firmar el Pacto de San Sebastián (1930) para instaurar la República.
Las elecciones municipales del 12 de abril de 1931 se plantearon como un plebiscito sobre la monarquía. Aunque en el cómputo total de concejales ganaron los monárquicos (debido al peso del caciquismo rural), en las capitales de provincia y grandes núcleos urbanos la victoria republicano-socialista fue abrumadora. Ante la presión popular y la falta de apoyo de la Guardia Civil (general Sanjurjo), Alfonso XIII decidió marchar al exilio.
3. Explicación del contenido
El fragmento es una pieza de retórica política que busca salvar la figura histórica del rey ante un momento de ruptura:
•	Reconocimiento de la derrota: El rey admite que "no tengo hoy el amor de mi pueblo", basándose en los resultados electorales. Es una aceptación implícita de que la legitimidad monárquica se ha quebrado.
•	Evitación del conflicto civil: Alfonso XIII afirma que podría haber luchado por sus prerrogativas (lo que sugiere el uso de la fuerza militar), pero que prefiere apartarse para evitar una "fratricida guerra". Se presenta a sí mismo como un patriota que sacrifica su trono por la paz.
•	Suspensión, no abdicación: Un punto clave es que el rey dice: "No renuncio a ninguno de mis derechos" y "suspendo el ejercicio del Poder Real". Técnicamente, Alfonso XIII no abdicó en ese momento (lo haría años después en su hijo Juan de Borbón), sino que se retiró a la espera de un cambio en la opinión pública.
•	Soberanía Nacional: Por primera vez, un Borbón reconoce a España como "única señora de sus destinos", cediendo el testigo a la voluntad de la nación.
•	Consecuencias: Este manifiesto permitió una transición relativamente pacífica hacia la Segunda República. El mismo 14 de abril se formó un Gobierno Provisional compuesto por los firmantes del Pacto de San Sebastián, iniciándose un ambicioso periodo de reformas democráticas.`,
    },
    { titulo: "Constitución de 1931", 
      descripcion: "Constitución democrática y laica.",
      texto: `Art. 1.º España es una República democrática de trabajadores de toda clase, que se organiza en régimen de Libertad y de Justicia. Los poderes de todos sus órganos emanan del pueblo. La República constituye un Estado integral, compatible con la autonomía de los Municipios y las Regiones. [...]
Art. 3.º El Estado español no tiene religión oficial.
Art. 27.º La libertad de conciencia y el derecho de profesar y practicar libremente cualquier religión quedan garantizados en el territorio español [...]. Todas las confesiones podrán ejercer sus cultos privadamente. Las manifestaciones públicas del culto habrán de ser, en cada caso, autorizadas por el Gobierno.
Art. 36.º Los ciudadanos de uno y otro sexo, mayores de veintitrés años, tendrán los mismos derechos electorales conforme determinen las leyes.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario. Se trata de la Constitución de 1931, aprobada por las Cortes Constituyentes el 9 de diciembre de dicho año. Es una carta magna de ideología liberal democrática y progresista que establece por primera vez en España un régimen republicano de carácter marcadamente social y laico.
2. Contexto histórico
El documento nace tras la proclamación de la Segunda República el 14 de abril de 1931, provocada por el hundimiento de la monarquía de Alfonso XIII tras las elecciones municipales. El Gobierno Provisional convocó elecciones a Cortes Constituyentes en junio, que dieron una victoria abrumadora a la conjunción republicano-socialista.
El debate constitucional fue intenso, especialmente en los artículos referidos a la cuestión religiosa y la estructura del Estado. El texto final reflejó el deseo de las clases medias y trabajadoras de transformar profundamente las estructuras del país (reforma agraria, educativa, militar y territorial), en un contexto internacional de ascenso de los totalitarismos y crisis económica (Gran Depresión).
3. Explicación del contenido
El fragmento destaca las rupturas fundamentales que introdujo la República:
•	Definición del Estado (Art. 1): Define a España como una "República de trabajadores de toda clase", una fórmula de compromiso entre republicanos y socialistas. Establece la soberanía popular ("los poderes... emanan del pueblo") y el concepto de Estado integral, una vía intermedia entre el centralismo y el federalismo que permitía la creación de Estatutos de Autonomía (como el de Cataluña en 1932).
•	Laicismo y Libertad de Cultos (Arts. 3 y 27): Es uno de los puntos más revolucionarios. Se declara la no confesionalidad del Estado (separación Iglesia-Estado). Se garantiza la libertad de conciencia, pero se limita el culto público a la autorización gubernamental, lo que generó una fuerte oposición de los sectores católicos y conservadores.
•	Sufragio Universal Femenino (Art. 36): La Constitución otorga por primera vez en la historia de España el derecho de voto a las mujeres ("ciudadanos de uno y otro sexo"). Este avance democrático fue defendido ardientemente por figuras como Clara Campoamor.
•	Derechos Sociales y Propiedad: Aunque no aparece en este fragmento, el texto incluía la posibilidad de expropiación por "utilidad social" y una amplia carta de derechos sociales (educación, familia, trabajo), convirtiendo al Estado en un agente activo de la justicia social.
•	Unicameralismo: Se eliminó el Senado, dejando el poder legislativo en una sola cámara, las Cortes, para agilizar las reformas y evitar el bloqueo de las élites que representaba la antigua Cámara Alta.`,
    }
  ],
  "bloque-9": [
    { titulo: "Alocución de Franco en Las Palmas (1936)", 
      descripcion: "Proclama de sublevación militar.",
      texto: `Españoles!: La Nación convive en la anarquía, las pistolas de los sicarios mandados por los directores de las logias masónicas asesinan traidoramente a quienes representan la autoridad [...]. La Constitución, por todos suspendida y vulnerada, sufre un eclipse total: ni hay igualdad ante la ley, ni libertad, ni unidad, ni paz, ni justicia en los órdenes más fundamentales de la vida pública. [...]
En este momento es la España entera la que se levanta pidiendo paz, fraternidad y justicia; en todas las regiones, el Ejército, la Marina y las fuerzas de orden público se lanzan a defender la Patria. La energía en el sostenimiento del orden será en proporción a la magnitud de las resistencias que se ofrezcan. [...] ¡Viva España! ¡Viva el honrado pueblo español!`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto circunstancial y político de carácter primario. Se trata de un manifiesto de pronunciamiento militar, emitido por el general Francisco Franco el 18 de julio de 1936 desde Las Palmas de Gran Canaria. Su función es justificar el golpe de Estado contra la legalidad de la Segunda República y convencer a la opinión pública y al resto del ejército de la necesidad de la sublevación.
2. Contexto histórico
El documento se sitúa tras la victoria del Frente Popular en las elecciones de febrero de 1936. Durante esa primavera, España vivió un clima de fuerte polarización política, huelgas, desórdenes públicos y enfrentamientos violentos. La conspiración militar, liderada por el general Mola (el "Director"), se aceleró tras el asesinato del líder de la oposición conservadora, José Calvo Sotelo, el 13 de julio de 1936.
Franco, que había sido alejado por el gobierno a Canarias para vigilarlo, firma este manifiesto antes de volar a Marruecos en el Dragon Rapide para ponerse al frente del Ejército de África. Este texto marca el paso de un golpe de Estado fallido (al no triunfar en toda España) a una guerra civil de tres años.
3. Explicación del contenido
El fragmento utiliza una retórica de "salvación nacional" propia de los pronunciamientos clásicos, pero con tintes autoritarios:
•	Denuncia del desorden: Franco justifica el golpe afirmando que España vive en la "anarquía". Culpa a los "sicarios" y a las "logias masónicas", utilizando un lenguaje conspirativo que será recurrente durante su futura dictadura.
•	Ilegitimidad de la República: Alega que la Constitución de 1931 ha muerto y que no existe ni justicia ni igualdad. Para los sublevados, el gobierno ha dejado de ser legítimo al ser incapaz de mantener el orden público.
•	El papel del Ejército: Se presenta a las fuerzas armadas como las únicas instituciones capaces de "defender la Patria". Franco no habla de un golpe militar contra el pueblo, sino de un movimiento que el "pueblo sano" supuestamente demanda.
•	Amenaza de represión: Un punto clave es el aviso de que "la energía en el sostenimiento del orden será en proporción a las resistencias". Esto anuncia la dureza de la represión que se aplicaría en la zona sublevada contra cualquier oposición.
•	Consecuencias: Este manifiesto sirvió para cohesionar a los militares rebeldes y dio inicio a un conflicto que terminaría en 1939 con la victoria de Franco y la instauración de una dictadura personal de casi 40 años.`,
    },
    { titulo: "Constitución de 1978", 
      descripcion: "Norma suprema del Estado democrático español.",
      texto: `Art. 1. 1. España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político. 2. La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado. 3. La forma política del Estado español es la Monarquía parlamentaria.
Art. 2. La Constitución se fundamenta en la indisoluble unidad de la Nación española, patria común e indivisible de todos los españoles, y reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones que la integran y la solidaridad entre todas ellas.
Art. 6. Los partidos políticos expresan el pluralismo político, concurren a la formación y manifestación de la voluntad popular y son instrumento fundamental para la participación política.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y legislativo de carácter primario; es la Ley Fundamental del Estado. Fue aprobada por las Cortes el 31 de octubre de 1978, ratificada en referéndum por el pueblo español el 6 de diciembre y sancionada por el rey Juan Carlos I el 27 de diciembre. Define a España como una democracia moderna y es una constitución de "consenso", ambigua en ciertos puntos para permitir la alternancia política.
2. Contexto histórico
El documento surge durante la Transición (1975-1982), el proceso de desmantelamiento del régimen franquista tras la muerte del dictador. Tras las primeras elecciones democráticas de junio de 1977, las nuevas Cortes asumieron un carácter constituyente.
La redacción corrió a cargo de una ponencia de siete diputados (los "Padres de la Constitución") que representaban todo el arco parlamentario (desde la UCD de Adolfo Suárez hasta el PCE de Carrillo, pasando por el PSOE y Alianza Popular). El texto buscaba superar la "herida" de la Guerra Civil y evitar el modelo de constituciones de "partido" que había caracterizado el siglo XIX español.
3. Explicación del contenido
El fragmento seleccionado contiene las definiciones esenciales del nuevo régimen:
•	Estado Social y Democrático de Derecho (Art. 1.1): Establece que el Estado no solo garantiza libertades individuales (Democrático), sino que también interviene para asegurar el bienestar de los ciudadanos (Social) y está sometido al imperio de la ley (Derecho). El pluralismo político aparece como un valor superior para evitar el regreso al partido único.
•	Soberanía Popular (Art. 1.2): Se recupera el principio de que el poder emana del pueblo, rompiendo con la soberanía compartida de la Restauración o el poder personal de Franco.
•	Monarquía Parlamentaria (Art. 1.3): Se define la forma de Estado. El Rey es el Jefe del Estado, pero carece de poder legislativo o ejecutivo; sus funciones son representativas y de arbitraje ("El Rey reina, pero no gobierna").
•	El Modelo Territorial (Art. 2): Es el punto más complejo. Combina la "indisoluble unidad" de la Nación con el reconocimiento del derecho a la autonomía de nacionalidades y regiones. Este artículo permitió el paso del Estado centralista al Estado de las Autonomías, un modelo descentralizado único en Europa.
•	Derechos y Libertades: Aunque no aparece en este extracto, la Constitución incluye una amplísima declaración de derechos fundamentales, la abolición de la pena de muerte y la aconfesionalidad del Estado (con mención especial a la Iglesia Católica).`,
    },
    { titulo: "Tratado de Adhesión de España a la CEE (1985)", 
      descripcion: "Integración en la Comunidad Económica Europea.",
      texto: `S. M. el Rey de España, el Consejo de las Comunidades Europeas y los Estados miembros de la Comunidad Económica Europea y de la Comunidad Europea de la Energía Atómica...
Art. 2. A partir de la fecha de la adhesión, las disposiciones de los Tratados originarios y los actos adoptados por las instituciones de las Comunidades obligarán a los nuevos Estados miembros y se aplicarán en dichos Estados en las condiciones previstas en dichos Tratados y en el presente Acta. [...]
Art. 9. España participará en las instituciones de las Comunidades Europeas en las condiciones previstas en el Acta de Adhesión. [...]
Art. 31. Los derechos de aduana a la importación entre la Comunidad en su composición actual y el Reino de España quedarán progresivamente eliminados.`,
      explicacion: `1. Definición y naturaleza del texto
Es un texto jurídico y de relaciones internacionales de carácter primario. Se trata del Tratado de Adhesión de España a la Comunidad Económica Europea (CEE), firmado en el Palacio Real de Madrid el 12 de junio de 1985 (entrando en vigor el 1 de enero de 1986). Es el documento que formaliza la entrada de España, junto con Portugal, en el proyecto de integración europea.
2. Contexto histórico
El deseo de entrar en Europa se remontaba al "Contubernio de Múnich" (1962), pero la dictadura de Franco fue un impedimento insalvable. Tras la muerte del dictador, los gobiernos de la Transición (Suárez y Calvo-Sotelo) solicitaron formalmente la entrada, pero las negociaciones fueron largas y complejas debido a las reticencias de Francia (por la competencia agraria) y a la crisis económica.
Fue el gobierno socialista de Felipe González quien logró desbloquear las negociaciones. España tuvo que aceptar condiciones duras y periodos de transición largos para proteger a los países fundadores, pero la firma del tratado se vivió como un éxito histórico que consolidaba la joven democracia española frente a posibles involuciones militares.
3. Explicación del contenido
El fragmento describe la aceptación del "acervo comunitario" y las implicaciones económicas:
•	Cesión de Soberanía (Art. 2): España acepta que las leyes y tratados europeos sean vinculantes y tengan primacía sobre el derecho nacional en las materias de competencia comunitaria. Esto supuso un cambio radical en el ordenamiento jurídico español.
•	Integración Política (Art. 9): España pasa a formar parte de las instituciones (Parlamento, Comisión, Consejo), lo que le permite participar en la toma de decisiones que afectan al continente, dejando de ser un actor secundario en la política internacional.
•	Unión Aduanera y Mercado Único (Art. 31): Se establece la eliminación progresiva de los aranceles. Esto obligó a una profunda reconversión industrial en España para poder competir, pero también permitió la llegada masiva de Fondos Estructurales y de Cohesión que financiaron la modernización de las infraestructuras españolas.
•	Consecuencias: La adhesión trajo consigo el crecimiento económico de los años 80 y 90, la implantación del IVA y la modernización social. Además, actuó como un anclaje democrático definitivo, alineando a España con los estándares de bienestar y derechos sociales de la Europa occidental.`,
    }
  ]
};

export const temasHistoria: Tema[] = [
{
  slug: "tema-1",
  titulo: "Tema 1: LA PREHISTORIA EN LA PENINSULA IBERICA",
  descripcion: "Primeros pobladores, Paleolitico, Neolitico y Edad de los Metales.",
  indice: `Índice del tema 1
•	1. El Paleolítico y el proceso de hominización
•	2. Organización socioeconómica y cultura en el Paleolítico
•	3. El arte rupestre: Escuelas y simbolismo
•	4. La Revolución Neolítica
•	5. La Edad de los Metales
•	6. Protohistoria: Culturas indígenas y colonizadores`,
  contenido: `TEMA 1: LA PREHISTORIA EN LA PENÍNSULA IBÉRICA
1. El Paleolítico y el proceso de hominización
La historia de la Península Ibérica se inaugura con el extenso periodo de la Prehistoria, donde este territorio se consolidó como un escenario fundamental para el complejo proceso de hominización en el continente europeo.
•	Cronología y localización: Todo comenzó en el Paleolítico, en un arco temporal que se expande desde el año 1.300.000 hasta el 10.000 a.C. Los testimonios más remotos se encuentran en los hallazgos de la Sierra de Atapuerca (Burgos).
•	Evolución de las especies: El poblamiento peninsular dio sus primeros pasos hace aproximadamente 1,2 millones de años con la presencia del Homo antecessor. A este le seguirían cronológicamente el Homo heidelbergensis (hace unos 250.000 años), el Homo neanderthalensis durante el Paleolítico Medio y, finalmente, el Homo sapiens, quien hizo su aparición en el Paleolítico Superior hace unos 35.000 años.
2. Organización socioeconómica y cultura en el Paleolítico
Durante esta etapa, la supervivencia estuvo marcada por un modelo estrictamente depredador, donde la relación directa con el entorno era la clave.
•	Economía: La subsistencia dependía primordialmente de la caza de grandes herbívoros, las labores de pesca y la recolección de diversos frutos silvestres.
•	Sociedad: Se configuraba a través de grupos nómadas articulados en pequeñas bandas o hordas. Estos se desplazaban constantemente siguiendo las rutas de las manadas o buscando refugios climáticos. En este contexto, no existía la propiedad privada ni jerarquías complejas; la división del trabajo se fundamentaba únicamente en la capacidad física o la edad.
•	Espiritualidad y técnica: A pesar de su sencillez, aparecieron las primeras inquietudes espirituales. El Neandertal ya practicaba enterramientos (como en la Cueva de Morín, Cantabria), revelando un sentido trascendente de la vida. Paralelamente, la técnica evolucionó desde el uso de la piedra para bifaces y raederas hasta la diversificación de materiales como el hueso y el asta en el Paleolítico Superior.
3. El arte rupestre: Escuelas y simbolismo
El desarrollo cognitivo alcanzó su punto álgido con las manifestaciones del arte rupestre, vinculadas al Homo sapiens entre el 35.000 y el 10.000 a.C. Se distinguen dos grandes corrientes:
•	Escuela Franco-Cantábrica: Localizada en lo más profundo de las cuevas, destaca por su profundo realismo y policromía (negros, rojos, ocres). Representaban animales aislados (bisontes, caballos) sin formar escenas. Su máximo exponente es la cueva de Altamira, y su función se cree que era mágica-religiosa para favorecer la caza.
•	Escuela Levantina: Situada cronológicamente entre el Mesolítico y el Neolítico, se encuentra en abrigos rocosos al aire libre. Su estilo es monocromo y esquemático, donde la figura humana cobra protagonismo en escenas de danza, recolección o caza.
•	Trascendencia: Este arte supuso el origen del pensamiento simbólico y la capacidad de abstracción, permitiendo la cohesión del grupo a través de ritos compartidos.
4. La Revolución Neolítica (6.000 - 3.000 a.C.)
Este periodo supuso la transición trascendental de una economía depredadora a una productora. El cambio penetró por las costas del Mediterráneo y se expandió hacia el interior.
•	Transformación económica: Se descubrió la agricultura (trigo y cebada) y la domesticación ganadera (ovejas y cabras), lo que permitió la producción de excedentes.
•	Cambios sociales: El ser humano se volvió sedentario y estableció los primeros poblados estables. La acumulación de excedentes y la especialización del trabajo (cerámica, cestería, tejidos) dieron lugar a la propiedad privada y a una incipiente jerarquización social.
•	Cultura: Destacó la cerámica cardial (decorada con conchas), el uso de la piedra pulimentada y el desarrollo de cultos a la fertilidad representados en la Diosa Madre.
5. La Edad de los Metales (3.000 - 800 a.C.)
Esta etapa se divide en tres fases según el metal dominante:
1.	Edad del Cobre o Calcolítico (3.000 a.C.): Destaca la cultura de Los Millares (Almería), con poblados amurallados que indican necesidad de defensa. Es la época del megalitismo (dólmenes) y el vaso campaniforme.
2.	Edad del Bronce (1.700 a.C.): Aparece la cultura de El Argar, con una sociedad fuertemente jerarquizada y control político centralizado. En las Baleares surge la cultura talayótica.
3.	Edad del Hierro: La metalurgia mejoró herramientas y armas. El comercio de metales estratégicos (oro, plata, cobre, estaño) conectó la Península con rutas de larga distancia, incrementando la riqueza y la desigualdad social.
6. Protohistoria: Culturas indígenas y colonizadores
A partir del 800 a.C., los pueblos indígenas entraron en contacto con colonizadores mediterráneos (fenicios, griegos y cartagineses).
•	Tartessos: Considerado el primer Estado organizado (valle del Guadalquivir), su poder emanaba del comercio de metales con los fenicios. Su máximo esplendor se vincula al rey Argantonio.
•	Íberos y Celtas: Los íberos (sur y este) desarrollaron ciudades-estado gobernadas por élites aristocráticas y destacaron en escultura (Dama de Elche). Los celtas (centro y norte) se organizaban en tribus y habitaban en castros.
•	Legado colonial y fin del periodo: Los colonizadores introdujeron la moneda, el torno de alfarero, la escritura (alfabetos fenicio y griego) y cultivos como el olivo y la vid. Este crisol de pueblos marcó el fin de la Prehistoria y preparó el terreno para la romanización.`,
estado: "completado",
videoUrl: "https://www.youtube.com/embed/Q4B2Cpf453k",
},
  {
    slug: "tema-2",
    titulo: "Tema 2: PUEBLOS PRERROMANOS Y COLONIZACIONES HISTÓRICAS",
    descripcion: "Íberos, celtas, celtíberos y primeros contactos coloniales.",
    indice: `Índice tema 2
1.	Tartessos: La primera civilización del Suroeste
2.	Los Pueblos Íberos: El refinamiento del Mediterráneo
3.	Los Pueblos Celtas: El área indoeuropea del Norte y Oeste
4.	Celtíberos y Pueblos del Interior: El crisol de la Meseta
5.	Síntesis Económica y Social antes de la Romanización`,
    contenido: `TEMA 2: PUEBLOS PRERROMANOS Y COLONIZACIONES HISTÓRICAS
1. Tartessos: La primera civilización del Suroeste
La historia de la Península Ibérica antes de Roma se despliega como un complejo tapiz de culturas. En el suroeste, específicamente en los valles del Guadalquivir y el Guadiana, se asentó Tartessos, la primera civilización con constancia escrita en estas tierras.
•	Periodo de esplendor: Su apogeo se sitúa entre los siglos VIII y VI a.C., coincidiendo con la llegada de los fenicios.
•	Organización Política: Se configuró como el primer Estado organizado del territorio. Las fuentes griegas mencionan monarquías míticas, destacando al rey Argantonio, símbolo de longevidad y riqueza, quien mantuvo relaciones comerciales con los griegos.
•	Economía y Sociedad:
o	Minería intensiva: La base de su prosperidad fue la extracción de oro, plata y cobre, exportados a través de los fenicios de Gadir (Cádiz).
o	Actividades complementarias: Una agricultura y ganadería desarrolladas sostenían a una sociedad fuertemente estratificada, donde una aristocracia controlaba los recursos y el comercio exterior.
•	Cultura e Influencia Orientalizante: Recibieron una profunda influencia fenicia, visible en:
o	El uso del torno de alfarero.
o	Joyería de gran finura, como el Tesoro del Carambolo.
o	Religiosidad con santuarios a divinidades semíticas como Astarté.
•	Final de la civilización: Hacia el siglo VI a.C., desapareció misteriosamente, posiblemente por el agotamiento de las minas o una crisis económica, dejando un vacío que ocuparía la cultura íbera.
2. Los Pueblos Íberos: El refinamiento del Mediterráneo
Entre los siglos VI y II a.C., los pueblos íberos se establecieron en la franja costera mediterránea y el sur peninsular. Son pueblos autóctonos que evolucionaron por el contacto con colonizadores mediterráneos.
•	Estructura Política: A diferencia de Tartessos, no formaron una unidad, sino ciudades-estado independientes con sus propios sistemas de gobierno.
•	Economía Diversificada:
o	Agricultura: Basada en la triada mediterránea (cereal, vid y olivo).
o	Industria y Comercio: Destacaron en minería, metalurgia y un comercio activo que incluía el uso de la moneda.
•	Sociedad y Cultura:
o	Jerarquización: Comunidades aristocráticas lideradas por régulos o jefes militares, con una casta guerrera de gran prestigio.
o	Legado Cultural: Poseían una escritura propia (no descifrada totalmente) y un arte escultórico refinado con iconos como la Dama de Elche o la Dama de Baza.
o	Ritos Funerarios: Practicaban la incineración, guardando las cenizas en urnas.
3. Los Pueblos Celtas: El área indoeuropea del Norte y Oeste
Ubicados en Galicia, Asturias y Cantabria, estos grupos de origen indoeuropeo llegaron en oleadas desde el norte de Europa, adaptándose a un entorno geográfico que definió su idiosincrasia.
•	Organización Social y Política: No conocieron el Estado centralizado. Se organizaban en tribus o clanes federados basados en lazos de parentesco. Su estructura era menos jerarquizada, destacando en algunas zonas el papel relevante de la mujer.
•	El Hábitat: Vivían en castros, que eran poblados fortificados situados en lugares elevados para facilitar la defensa.
•	Economía y Tecnología:
o	Ganadería: Actividad fundamental (ganado vacuno y porcino) complementada con la recolección. La agricultura era secundaria.
o	Metalurgia: Eran maestros en el trabajo del hierro y la orfebrería, creando piezas como los torques.
•	Cultura y Resistencia: No conocieron la escritura ni la moneda hasta la llegada de Roma. Adoraban elementos naturales (bosques, ríos) y ofrecieron una resistencia feroz, especialmente en las Guerras Cántabras.
4. Celtíberos y Pueblos del Interior: El crisol de la Meseta
En el corazón de la Meseta y el Sistema Ibérico habitaban pueblos como los arévacos o los vacceos, que fusionaban la herencia celta con elementos íberos.
•	Modo de Vida: Poseían una economía de subsistencia basada en la agricultura y la ganadería. Sus hombres eran famosos como mercenarios debido a su valor militar.
•	Estructura Social: Organizados en clanes con vínculos sagrados como la hospitalidad y la "devotio" (clientela militar).
•	Urbanismo y Arte:
o	Resistencia: Ciudades como Numancia se convirtieron en símbolos de resistencia ante el invasor.
o	Escultura: Crearon los Verracos (como los Toros de Guisando), esculturas de piedra de toros o cerdos con funciones funerarias o de protección del ganado.
5. Síntesis Económica y Social antes de la Romanización
La Península presentaba un fuerte contraste entre un sur/este desarrollado y un centro/norte más rudimentario.
•	Motores de cambio: Las colonizaciones de fenicios, griegos y cartagineses introdujeron innovaciones clave: el torno de alfarero, la moneda, las salazones de pescado y los cultivos de vid y olivo.
•	Modelos sociales: * En el sur, sociedad fracturada entre élite acaudalada y pueblo trabajador.
•	En el centro y norte, predominio de la estructura comunitaria.
•	Consecuencias históricas: Este mosaico de ritos, técnicas y lenguas creó una realidad única que dificultó la conquista romana, prolongándola durante doscientos años debido a la necesidad de negociar o combatir con cientos de sistemas políticos distintos. `,

    estado: "completado",
    videoUrl: "https://www.youtube.com/embed/wJRHxOSp4Ok",
  },
  {
    slug: "tema-3",
    titulo: "Tema 3: COLONIZACIONES MEDITERRÁNEAS",
    descripcion: "Fenicios, griegos y cartagineses en la Península Ibérica.",
    indice: `Índice del tema 3
1.	La colonización fenicia: El inicio del periodo orientalizante
2.	La presencia griega: Comercio, moneda y urbanismo
3.	La hegemonía cartaginesa y el conflicto militar
4.	Balance final: El periodo orientalizante y sus consecuencias`,
    contenido: `TEMA 3: COLONIZACIONES MEDITERRÁNEAS
1. La colonización fenicia: El inicio del periodo orientalizante
La historia de la Península Ibérica dio un giro definitivo con la llegada de las colonizaciones mediterráneas. Los fenicios, procedentes del actual Líbano (ciudades de Tiro y Sidón), fueron los primeros en alcanzar estas costas hacia el siglo IX a.C. (aprox. 800 a.C.). Su llegada estuvo motivada por un interés estratégico en la riqueza minera de plata y cobre de la zona de Tartessos.
1.1. Modelo de asentamiento y principales colonias
A diferencia de otros pueblos, los fenicios no buscaban una conquista territorial expansiva, sino el establecimiento de factorías o colonias comerciales en puntos estratégicos de la costa.
•	Gadir (Cádiz): Fundada como el enclave principal, es hoy la ciudad más antigua de Occidente.
•	Otros enclaves: Destacaron Malaka (Málaga), Abdera (Adra) y Sexi (Almuñécar).
1.2. Economía, sociedad y legado cultural
La economía fenicia se basaba en el intercambio de manufacturas de lujo (telas de púrpura y vidrio) por metales peninsulares.
•	Innovaciones económicas: Introdujeron las salazones de pescado y el cultivo del olivo, transformando la producción local.
•	Organización social: Eran sociedades urbanas lideradas por una élite de comerciantes, que convivían pacíficamente con los indígenas sin imponer control político.
•	Aportaciones culturales: Su legado más revolucionario fue el alfabeto fenicio (base de los alfabetos modernos) y el torno de alfarero. Esta influencia fue el motor que impulsó el desarrollo de Tartessos y la evolución de los pueblos íberos.

2. La presencia griega: Comercio, moneda y urbanismo
Hacia el siglo VI a.C., los griegos foceos continuaron la expansión, concentrándose en el noreste y el levante peninsular bajo un modelo de colonias que funcionaban como centros neurálgicos de intercambio.
2.1. Las fundaciones coloniales
Los griegos establecieron asentamientos con una organización urbana planificada similar a las polis griegas.
•	Emporion (Ampurias): Situada en la actual Girona, fue la colonia más importante.
•	Mainake: Ubicada cerca de la actual Málaga.
2.2. Innovaciones y repercusión social
La sociedad griega era eminentemente urbana y mercantilista, fomentando la colaboración con los íberos a través del prestigio de su arte.
•	Agricultura y comercio: Introdujeron el cultivo de la vid y la producción de vino. Su hito más disruptivo fue la introducción de la moneda, que permitió la acumulación de riqueza.
•	Influencia cultural: Aportaron su filosofía, su arte y un urbanismo avanzado. La cerámica griega se convirtió en un objeto de lujo muy demandado por las élites locales, acelerando la jerarquización social indígena.

3. La hegemonía cartaginesa y el conflicto militar
Los cartagineses, procedentes de Cartago (norte de África), eran antiguos colonos fenicios independientes. Su presencia se intensificó a partir del siglo VI a.C. tras la caída de Tiro, cambiando el enfoque comercial por uno de dominación militar.
3.1. La expansión de los Bárcidas
Bajo la dirección de la familia de los Bárcidas (Amílcar, Asdrúbal y Aníbal), los cartagineses fundaron colonias estratégicas como Qart Hadasht (la actual Cartagena).
•	Explotación económica: Se centraron en la minería masiva de plata en Cartagena para financiar sus guerras contra Roma, manteniendo un monopolio comercial en el sur.
•	Estructura social militarizada: Utilizaron a los pueblos indígenas (íberos y celtíberos) como mercenarios. Impusieron un trato rígido mediante el cobro de tributos y levas militares.
3.2. El fin de las colonizaciones
La rivalidad con Roma por el control del Mediterráneo convirtió a la Península en el escenario de la Segunda Guerra Púnica. Este enfrentamiento fue el detonante de la intervención de las legiones romanas y el inicio de la conquista de Hispania.

4. Balance final: El periodo orientalizante y sus consecuencias
El contacto entre civilizaciones orientales y pueblos indígenas transformó radicalmente la estructura de la Península, rescatándola del aislamiento prehistórico.
•	Transformación económica: Paso de la subsistencia a una economía monetaria con generación de excedentes (aceite, vino, salazones) y una minería industrial.
•	Diferenciación social: El control del comercio exterior consolidó una aristocracia guerrera y aumentó el poder de los jefes locales.
•	Evolución cultural e ideológica:
•	Adopción de técnicas constructivas en piedra y murallas.
•	Uso generalizado del alfabeto y la escritura.
•	Enriquecimiento del arte autóctono con el naturalismo y la orfebrería mediterránea. `,

    estado: "en-progreso",
    videoUrl: "https://www.youtube.com/embed/ZLQ0YtOYhg0",
  },
  {
    slug: "tema-4",
    titulo: "Tema 4: LA CONQUISTA ROMANA DE HISPANIA",
    descripcion: "Conquista, fases y organización del territorio hispano.",
    indice: `Índice del tema 4
1.	Contexto Geopolítico: La Rivalidad entre Roma y Cartago
2.	El Inicio del Conflicto: La Segunda Guerra Púnica
3.	Las Fases de la Conquista (218 a.C. – 19 a.C.)
4.	Los Focos de Resistencia Indígena
5.	El Final de la Conquista: Octavio Augusto y la Pax Romana
6.	El Legado de la Romanización`,
    contenido: `TEMA 4: LA CONQUISTA ROMANA DE HISPANIA
1. Contexto Geopolítico: La Rivalidad entre Roma y Cartago
A finales del siglo III a.C., el Mediterráneo occidental fue el escenario de una lucha titánica entre Roma y Cartago. Tras la Primera Guerra Púnica, los cartagineses buscaron en la Península Ibérica una base para recuperar su poderío.
•	La Estrategia de los Bárcidas: Liderados por esta influyente familia, Cartago vio en la Península un motor económico y militar. El objetivo era compensar las pérdidas previas y obtener recursos para financiar su ejército y pagar los tributos exigidos por Roma.
•	Explotación de Recursos: Se centró especialmente en las minas de plata de Cartagena.
•	El papel de los indígenas: Los pueblos íberos se vieron arrastrados al conflicto, actuando como mercenarios o aliados en una guerra ajena a sus intereses.
2. El Inicio del Conflicto: La Segunda Guerra Púnica
El destino de Hispania cambió definitivamente en el año 218 a.C. debido al estallido de la Segunda Guerra Púnica.
•	El Detonante: La ruptura del Tratado del Ebro tras el ataque de Aníbal a la ciudad de Sagunto (aliada de los romanos).
•	El desembarco en Ampurias: Inicialmente, Roma no buscaba la conquista total. Su objetivo táctico era cortar los suministros y refuerzos que recibía Aníbal desde suelo hispano para su avance hacia Italia.
•	Consecuencia Histórica: Lo que comenzó como una maniobra de interrupción derivó en una presencia permanente de siete siglos, eliminando la hegemonía cartaginesa.
3. Las Fases de la Conquista (218 a.C. – 19 a.C.)
La conquista no fue un proceso breve, sino una ocupación dilatada de aproximadamente doscientos años, dividida en tres etapas geográficas y políticas:
1.	Primera Fase (218 – 197 a.C.): Ocupación rápida de la costa mediterránea y los valles del Guadalquivir y el Ebro tras la expulsión de los cartagineses.
2.	Segunda Fase (197 – 29 a.C.): Avance hacia el interior por la Meseta. Fue el periodo más cruento debido al choque con celtíberos y lusitanos. En las zonas pacificadas se fundaron colonias como Itálica y se introdujeron el latín y el derecho romano.
3.	Tercera Fase (29 – 19 a.C.): Etapa final centrada en el sometimiento del norte peninsular.
4. Los Focos de Resistencia Indígena
La resistencia de los pueblos del interior y el norte fue feroz, basada en estructuras tribales guerreras y una ideología de libertad.
•	Viriato y los lusitanos: En el oeste, Viriato utilizó la guerra de guerrillas para desgastar a las legiones romanas. Se convirtió en un símbolo de resistencia hasta que murió víctima de una traición.
•	El sitio de Numancia: El mundo celtíbero resistió en Numancia, bajo el asedio de Escipión Emiliano. En el año 133 a.C., sus habitantes optaron por el suicidio colectivo antes que la rendición.
•	Conceptos Clave de la Resistencia:
o	La "devotio": Juramento de lealtad absoluta y fidelidad hasta la muerte hacia el jefe.
o	Impacto en Roma: La tenacidad indígena obligó a mantener un contingente militar tan grande que aceleró la profesionalización del ejército romano.
5. El Final de la Conquista: Octavio Augusto y la Pax Romana
Con la llegada de Octavio Augusto y el nacimiento del Imperio, se buscó estabilizar las fronteras para alcanzar la paz definitiva en el frente hispano.
•	Las Guerras Cántabras (29 – 19 a.C.): Dirigidas personalmente por el emperador para someter a cántabros y astures en el norte.
•	Control Minero: Esta victoria aseguró el dominio sobre las ricas minas de oro del noroeste, destacando el enclave de Las Médulas.
•	Transformación Social: Los rebeldes fueron trasladados a los llanos para su vigilancia y las élites locales se integraron en la administración imperial.
6. El Legado de la Romanización
Tras la conquista, Hispania se convirtió en una de las provincias más prósperas, actuando como el granero y despensa del Imperio.
•	Economía: Exportación masiva de aceite, trigo y metales hacia la capital del Imperio.
•	Cultura y Estructura:
o	Lengua y Ley: Adopción del latín y el derecho.
o	Urbanismo Monumental: Construcción de calzadas, puentes y teatros.
o	Religión: Llegada del cristianismo.
•	Trascendencia: Hispania aportó figuras clave como los emperadores Trajano y Adriano, dejando un legado cultural que es la base de la identidad española actual. `,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/adX5lmyP33g",
  },
  {
    slug: "tema-5",
    titulo: "Tema 5: LA ROMANIZACIÓN",
    descripcion: "Integración cultural, social, jurídica y económica en Roma.",
    indice: `Índice del tema 5
1.	Introducción y Cronología
2.	Etapas de la Conquista Militar
3.	Cultura e Identidad
4.	Organización Administrativa
5.	Estructura Económica
6.	Sociedad y Derecho
7.	Urbanismo e Infraestructuras`,
    contenido: `TEMA 5 — LA ROMANIZACIÓN
1. El Proceso de Romanización: Definición y Cronología
La Romanización no fue simplemente una conquista militar, sino una transformación profunda y multidimensional. Representó un proceso de aculturación que integró a la Península Ibérica en el mundo romano, dejando de ser un territorio periférico para convertirse en una parte vital del Imperio.
•	Inicio del proceso: Comenzó con el desembarco romano en Ampurias en el año 218 a.C., en el contexto de la Segunda Guerra Púnica.
•	Duración y término: Se extendió durante siete siglos, hasta la caída formal del Imperio Romano en el 476 d.C.
•	Naturaleza del cambio: Fue un camino no uniforme y a menudo violento, que implicó la asimilación de la lengua, el derecho y las costumbres de la metrópoli.

2. Conquista Militar y Etapas de Sumisión
Para lograr el control total del territorio, Roma tuvo que superar una resistencia tenaz a través de tres grandes etapas militares de intensidad creciente:
•	Primera Etapa (218 - 197 a.C.): Caracterizada por la lucha directa contra los cartagineses, centrada principalmente en el Levante y el Sur peninsular.
•	Segunda Etapa (hasta el 133 a.C.): Avance hacia el interior en guerras agotadoras contra celtíberos y lusitanos. Destacan hitos de resistencia como la tenacidad de Viriato y la caída heroica de Numancia en el 133 a.C. ante las legiones de Escipión Emiliano.
•	Tercera Etapa (29 - 19 a.C.): Las Guerras Cántabras, dirigidas personalmente por el emperador Augusto y su general Agripa, que supusieron la pacificación definitiva y el cierre del mapa de la conquista.

3. Unificación Cultural y Legado Histórico
Más allá de las armas, la identidad peninsular se fraguó mediante la adopción de los pilares culturales de Roma. Geógrafos como Estrabón relataron cómo en zonas permeables como la Bética, los indígenas olvidaron su lengua materna para adoptar el latín y vestir la toga romana.
3.1. Continuidad Visigoda
Esta base cultural fue tan sólida que los reyes visigodos, como Recaredo y Recesvinto, intentaron preservarla siglos después mediante:
•	Unificación religiosa: Bajo el catolicismo.
•	Codificación legal: A través del Fuero Juzgo.

4. Estructura Administrativa y Territorial
La gestión de Hispania evolucionó de un enfoque militar a una explotación civil organizada. El territorio se organizó en provincias cuya delimitación cambió según la época:
4.1. Evolución de las Provincias
1.	Época Republicana (197 a.C.): División en dos provincias: Hispania Citerior e Hispania Ulterior.
2.	Reforma de Augusto (27 a.C.): Reorganización en tres demarcaciones:
o	Tarraconensis: Capital en Tarraco.
o	Lusitania: Capital en Emerita Augusta.
o	Baetica: Capital en Corduba.
3.	Bajo Imperio (Siglo III d.C.): Bajo Diocleciano, se añadieron la Carthaginense, Gallaecia y Baleárica, integradas en la Diocesis Hispaniarum.
4.2. Administración Local
El gobierno recaía en las ciudades, gestionadas por magistrados y un senado local denominado curia, bajo la supervisión de legados imperiales o procónsules. Este sistema permitió el ascenso de hispanos al trono imperial, como Trajano y Adriano.

5. Economía: Hispania como "Despensa de Roma"
Hispania se convirtió en un pilar económico gracias a la introducción de técnicas avanzadas como el arado romano y sistemas de regadío.
•	Producción Agrícola: Basada en la trilogía mediterránea (cereal, vid y olivo). La Bética destacó por su exportación masiva de aceite de oliva en ánforas.
•	Recursos Mineros: Extracción de oro en Las Médulas, plata en Cartagena y mercurio en Almadén.
•	Industria Costera: Desarrollo del salazón y la producción del garum (salsa de pescado).
•	Sistema Monetario y Laboral: Uso del denario para el comercio a larga distancia y dependencia de un sistema esclavista controlado por una aristocracia ecuestre y senatorial.

6. Organización Social y Jurídica
La estructura tribal indígena fue sustituida por una pirámide social definida por la riqueza y el estatus jurídico, regulada por el Derecho Romano.
6.1. Jerarquía Social
•	Hombres Libres: Divididos entre ciudadanos romanos (plenos derechos) y peregrinos (no ciudadanos).
•	Libertos: Esclavos que habían alcanzado la libertad.
•	Esclavos: Propiedad de un amo y base de la mano de obra.
En cuanto a la distinción por clase, en la cúspide estaban los órdenes senatorial y ecuestre, seguidos por la burguesía urbana (honestiores) y el pueblo llano (humiliores).
6.2. Elementos de Cohesión
La unidad social se mantuvo gracias al Culto al Emperador y, posteriormente, al Cristianismo tras el Edicto de Milán. En la tardoantigüedad, figuras como San Isidoro de Sevilla simbolizaron el paso del control social hacia la nobleza y el clero.

7. Urbanismo e Infraestructuras
La ciudad (urbs) fue el corazón de la Romanización. Roma trasladó a la población de los castros elevados a los llanos para facilitar su control.
7.1. Tipología de Ciudades
•	Colonias: Fundadas por romanos (ej. Itálica).
•	Municipios: Ciudades indígenas con derecho latino o romano.
•	Ciudades Estipendiarias: Obligadas al pago de tributos.
7.2. Obras Públicas y Comunicaciones
Las ciudades seguían un plano hipodámico (ejes cardo y decumano) y estaban conectadas por una red de calzadas (como la Vía Augusta o la Vía de la Plata). Entre las construcciones monumentales destacan:
•	Ingeniería: El acueducto de Segovia y el puente de Alcántara.
•	Ocio y Cultura: El teatro de Mérida, circos y termas.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/XdSNz-d34xE",
  },
  {
    slug: "tema-6",
    titulo: "Tema 6: CRISIS DEL IMPERIO Y REINO VISIGODO",
    descripcion: "Fin del Imperio romano y configuración del reino visigodo.",
    indice: `Índice del tema 6
1.	El Ocaso de Roma y las Invasiones Germánicas
2.	El Proceso de Ruralización y Cambio Económico
3.	El Rol del Cristianismo y la Iglesia
4.	Consolidación del Reino de Toledo
5.	Instituciones de Gobierno y Administración
6.	Sociedad, Economía y Cultura Visigoda
7.	El Colapso del Reino (711 d.C.)`,
    contenido: `TEMA 6 — CRISIS DEL IMPERIO Y REINO VISIGODO
1. El Ocaso de Roma y las Invasiones Germánicas
A partir del siglo III d.C., el Imperio Romano comenzó a experimentar una fase de inestabilidad profunda. En Hispania, esta crisis se tradujo en una creciente incapacidad de las legiones para asegurar las fronteras y mantener el control administrativo frente a las presiones externas.
1.1. La Ruptura de las Fronteras (409 d.C.)
El colapso institucional alcanzó su punto crítico en el año 409, cuando las fronteras fueron perforadas por diversos pueblos germánicos. Para intentar gestionar el caos, Roma recurrió a la diplomacia de crisis:
•	Pueblos Invasores: El avance fue protagonizado por los suevos, vándalos y alanos, quienes se asentaron en el territorio peninsular.
•	Los Foedus (Pactos): Ante el agotamiento del Estado romano, se firmaron tratados conocidos como foedus. A través de estos, se llamó a los visigodos para restaurar el orden en nombre de Roma, actuando como el brazo armado de un imperio ya debilitado.

2. El Proceso de Ruralización y Cambio Económico
La inseguridad constante alteró radicalmente la vida cotidiana y la estructura económica de la península, marcando el fin del esplendor urbano romano.
2.1. El Éxodo Urbano y la Economía de Subsistencia
•	Abandono de las Ciudades: Las élites urbanas, temerosas ante la inseguridad, abandonaron sus cargos públicos y se refugiaron en sus villas rurales, buscando protección y autosuficiencia.
•	Crisis del Comercio y la Esclavitud: El comercio mediterráneo se paralizó y el sistema esclavista entró en una crisis terminal.
•	Ruralización: La economía se replegó sobre sí misma, convirtiéndose en una economía de subsistencia donde la agricultura de las grandes villas fue el motor principal.
En el año 476 d.C., con la desaparición definitiva de las estructuras estatales de Roma, se generó un vacío de poder que las monarquías germánicas ocuparon de forma total.

3. El Cristianismo como Eje Vertebrador
El cristianismo pasó de la clandestinidad a ser el pilar fundamental de la sociedad. Este ascenso fue posible gracias a hitos como el Edicto de Milán (313) y el Edicto de Tesalónica (380).
3.1. La Unificación Religiosa: El III Concilio de Toledo (589)
Bajo el dominio visigodo, la Iglesia se convirtió en una institución política clave para legitimar a los monarcas.
•	Conversión de Recaredo: En el año 589, el rey Recaredo abandonó el arrianismo (fe tradicional goda) y se convirtió al catolicismo.
•	Objetivo Político: Este acto buscaba la unidad religiosa entre la minoría visigoda gobernante y la mayoría de la población hispanorromana.
•	Funciones de los Obispos: Tras la conversión, los obispos asumieron funciones civiles, gestionando la moral pública y la asistencia social.
3.2. Preservación Cultural
La Iglesia actuó como guardiana del saber clásico. Destaca la figura de San Isidoro de Sevilla, quien mediante sus Etimologías rescató y preservó el conocimiento antiguo para las generaciones futuras.

4. Consolidación y Unificación del Reino Visigodo
Tras la derrota frente a los francos en la Batalla de Vouillé (507) en la Galia, los visigodos se asentaron definitivamente en la Península, estableciendo su capital en Toledo.
4.1. Unificación Territorial y Social
Bajo el liderazgo de reyes con visión de Estado, se logró transformar el territorio en una entidad política autónoma:
•	Leovigildo: Sometió al reino suevo del noroeste y contuvo a los bizantinos en el sur.
•	Fusión Étnica: Se produjo una lenta integración entre visigodos y la aristocracia hispanorromana, sellada con la abolición de la prohibición de los matrimonios mixtos.
•	Economía Agraria: El poder se medía a través de la posesión de la tierra, aunque persistían rutas comerciales mínimas en el Mediterráneo.

5. Instituciones y Gobierno Visigodo
El sistema político era un híbrido entre la monarquía electiva germánica y la administración centralizada romana.
5.1. El Aparato Administrativo
•	Aula Regia: Consejo asesor compuesto por altos nobles y funcionarios que colaboraban con el rey.
•	Officium Palatinum: Encargado de la gestión de palacio, donde destacaban:
o	Comes: Responsables del tesoro.
o	Duces: Gobernadores provinciales.
o	Gardingos: Jefes militares de confianza.
•	Concilios de Toledo: Asambleas político-religiosas donde la nobleza y el clero legislaban sobre asuntos de Estado.
•	Fuero Juzgo: Promulgado por Recesvinto, fue el código de leyes común que unificó jurídicamente a godos y romanos bajo una misma norma.

6. Estructura Social y Legado Cultural
La sociedad se fragmentó y se jerarquizó de forma estricta sobre los restos de la civilización romana, sentando las bases del futuro feudalismo.
6.1. La Jerarquía Social
1.	Cúspide: Nobleza militar y alto clero, controladores de la tierra.
2.	Base: Campesinos libres y siervos que trabajaban los latifundios en condiciones de dura servidumbre.
3.	Economía: Predominio del trueque debido a una moneda debilitada y la desaparición de la vida urbana.
6.2. Arte y Cultura
La cultura se refugió en los monasterios, produciendo testimonios artísticos singulares:
•	Arquitectura: Iglesias como San Juan de Baños.
•	Orfebrería: Piezas exquisitas como las coronas votivas del Tesoro de Guarrazar.
7. El Fin del Reino: La Invasión de 711
El modelo visigodo, debilitado por las guerras civiles constantes debido a su naturaleza electiva, colapsó a principios del siglo VIII. Bajo el reinado del rey Rodrigo, las tensiones sucesorias facilitaron la derrota final. En el año 711, tras la batalla de Guadalete, las fuerzas del califato omeya pusieron fin al reino de Toledo, iniciando una nueva era histórica.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/eK4R9Uqrzb4",
  },
  {
    slug: "tema-7",
    titulo: "Tema 7: LA CONQUISTA MUSULMANA",
    descripcion: "Invasión musulmana y primeros años de dominación.",
    indice: `Índice del Tema 7
1.	La Crisis Estructural de la Monarquía Visigoda
2.	La Invasión Musulmana y el Colapso de 711
3.	Modelos de Conquista y Expansión (711-718)
4.	Estructura Social y Religiosa en Al-Ándalus
5.	Organización Política: El Emirato Dependiente
6.	Transformación del Paisaje y Resistencia en el Norte`,
    contenido: `TEMA 7: LA CONQUISTA MUSULMANA
1. La Crisis Estructural de la Monarquía Visigoda
A principios del siglo VIII, el reino visigodo se encontraba en una situación de extrema fragilidad. El principal problema radicaba en su sistema de monarquía electiva, el cual generaba una inestabilidad política crónica debido a las luchas de poder entre las distintas facciones de la nobleza.
1.1. La Guerra Civil y la Fractura Dinástica
La muerte del rey Witiza supuso el punto de ruptura definitivo. El vacío de poder derivó en un conflicto armado entre dos bandos claramente diferenciados:
•	Los Witicianos: Partidarios de los hijos de Witiza, liderados por figuras como Agila II o Egila. Este grupo, en su afán por recuperar el trono, llegó a solicitar ayuda militar a las fuerzas musulmanas del norte de África.
•	Rodrigo (Roderico): Noble que había usurpado el trono y representaba a la facción opuesta, enfrentándose a una oposición interna que dejó las fronteras del reino totalmente vulnerables.
1.2. El Contexto Socioeconómico
La sociedad de la época se encontraba en un proceso avanzado de prefeudalización. La economía era esencialmente agraria y de subsistencia, lastrada por una fuerte jerarquización. La población, agotada por la presión fiscal y el descontento social, mostraba una notable indiferencia ante los cambios de gobierno, lo que facilitó la transición hacia un nuevo dominio extranjero.

2. La Invasión Musulmana y el Colapso de 711
Mientras la península se desangraba en luchas internas, el Islam se expandía rápidamente bajo el Califato Omeya de Damasco. Tras conquistar el Magreb en el año 707, el gobernador Muza (Musa ibn Nusair) vio en la crisis visigoda la oportunidad perfecta para la expansión hacia Europa.
2.1. El Hito de Guadalete
En el año 711, un ejército compuesto mayoritariamente por bereberes y liderado por Tarik cruzó el Estrecho de Gibraltar. El desenlace fue fulminante:
•	La Batalla de Guadalete: Las tropas de Rodrigo fueron derrotadas y el propio monarca perdió la vida en el combate.
•	Consecuencia inmediata: La muerte del rey provocó el colapso instantáneo de la administración visigoda, dando paso al nacimiento de Al-Ándalus y a una nueva cosmovisión lingüística y religiosa.

3. Modelos de Conquista y Expansión (711-718)
Resulta sorprendente que casi todo el territorio peninsular fuera ocupado en apenas siete años (711-718). Esto no se logró solo por las armas, sino mediante una estrategia de sumisión diferenciada:
•	Rendición Incondicional: Aplicada a aquellos núcleos que ofrecían resistencia armada. Conllevaba la pérdida total de bienes y derechos para los vencidos.
•	Rendición Pactada (Capitulaciones): Fue la fórmula más extendida. Los nobles visigodos conservaban sus tierras y su religión a cambio del pago de tributos.
o	Ejemplo clave: El Pacto de Teodomiro en el año 713, que permitió a este noble mantener su poder sobre las actuales zonas de Murcia y Alicante.

4. Estructura Social y Religiosa en Al-Ándalus
La rápida aceptación del nuevo orden se debió en gran medida a la tolerancia hacia los "pueblos del libro" (cristianos y judíos) y a una fiscalidad que, en ocasiones, resultaba menos gravosa que la visigoda.
4.1. El Mosaico Social Andalusí
La nueva sociedad se dividió en categorías basadas en la religión y el origen étnico:
•	Muladíes: Cristianos que se convirtieron al Islam para integrarse plenamente en el nuevo sistema social y económico.
•	Mozárabes: Cristianos que decidieron mantener su fe y sus costumbres viviendo en territorio musulmán.
•	Impuestos específicos: La estabilidad económica se sustentaba en tributos como la yizia (impuesto personal) y el jarach (impuesto territorial).

5. Organización Política: El Emirato Dependiente (711-756)
Durante sus primeras décadas, Al-Ándalus se configuró como una provincia administrativa del Califato Omeya, con su centro de poder en la ciudad de Córdoba.
5.1. El Gobierno del Walí
El territorio era gobernado por un walí, quien debía consolidar el control sobre las ciudades y las vías de comunicación. Sin embargo, la convivencia entre los conquistadores no estuvo exenta de problemas:
•	Minoría Árabe: Ostentaba el poder político y se reservó las tierras más ricas (valles del Guadalquivir y el Ebro).
•	Mayoría Bereber: Asentada en zonas serranas y menos productivas, lo que generó tensiones sociales desde fechas tempranas.

6. Transformación del Paisaje y Resistencia en el Norte
La llegada de los musulmanes no solo fue un cambio político, sino una revolución técnica. Se introdujeron avanzadas técnicas de regadío y nuevos cultivos que sentaron las bases de una civilización urbana muy avanzada.
6.1. El Núcleo de Resistencia Astur
A pesar del éxito de la invasión, las zonas montañosas del norte quedaron fuera del control efectivo de Córdoba.
•	Don Pelayo: Elegido líder en Asturias en el año 718.
•	Covadonga (722): Una escaramuza que, pese a su escala, marcó el inicio del núcleo de resistencia que daría origen a los reinos cristianos y al proceso de la Reconquista.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/xAsYpzvnPlM",
  },
  {
    slug: "tema-8",
    titulo: "Tema 8: EVOLUCIÓN POLÍTICA DE AL-ÁNDALUS",
    descripcion: "Emirato, califato, taifas e intervención norteafricana.",
    indice: `Índice del tema 8
1.	El Emirato Dependiente (711-756)
2.	El Emirato Independiente (756-929)
3.	El Califato de Córdoba (929-1031)
4.	Los Reinos de Taifas (Siglo XI)
5.	Los Imperios Norteafricanos (Almorávides y Almohades)
6.	El Reino Nazarí de Granada (1238-1492)`,
    contenido: `TEMA 8: EVOLUCIÓN POLÍTICA DE AL-ÁNDALUS
1. El Emirato Dependiente (711-756)
Tras la victoria en la batalla de Guadalete en el año 711, el territorio peninsular inició su andadura como una provincia periférica del Califato Omeya de Damasco. Durante este periodo, la gestión política recaía en la figura del walí, un gobernador nombrado directamente desde Damasco o Kairuán. Esta etapa se caracterizó por una profunda inestabilidad interna debido a la lejanía del centro de poder califal y a las disputas entre los propios conquistadores.
1.1. Organización y Sociedad Inicial
•	División Étnica: La sociedad presentaba una jerarquía rígida. Los árabes ostentaban el poder político y se repartieron las tierras más fértiles, mientras que los bereberes fueron desplazados a zonas montañosas, provocando revueltas constantes.
•	Sistema Económico: Se sustentó inicialmente en el botín de guerra y en la exacción de impuestos a la población sometida: la yizia (impuesto personal) y el jarach (impuesto territorial).
•	Estatus Religioso: Se inició un proceso de islamización y arabización, aunque se mantuvo el respeto a cristianos y judíos bajo la condición de dimmíes (protegidos).
1.2. Límites y Resistencias
La expansión musulmana hacia el resto de Europa encontró su fin tras la derrota en la batalla de Poitiers en el 732. Simultáneamente, en el norte peninsular, la crisis del emirato permitió la aparición de los primeros focos de resistencia cristiana tras los sucesos de Covadonga en el 722.

2. El Emirato Independiente (756-929)
La caída de la dinastía Omeya en Damasco ante los Abbasíes provocó la huida del príncipe Abderramán I hacia la península. En el año 756, se proclamó emir, estableciendo la independencia política de Bagdad, aunque se mantuvo la subordinación religiosa. Bajo su mandato, se vertebró un Estado con administración centralizada y un ejército profesional.
2.1. Conflictos y Crecimiento
•	Tensiones Sociales: Surgió la figura de los muladíes (cristianos conversos al Islam), quienes protagonizaron rebeliones al denunciar discriminación frente a la élite árabe. Un ejemplo destacado fue la revuelta del Arrabal en Córdoba.
•	Economía y Símbolos: Se produjo un despegue agrícola gracias a nuevas técnicas de regadío y se consolidó la moneda andalusí. En este periodo comenzó la construcción de la Mezquita de Córdoba.
•	Crisis de Autoridad: El emirato logró sobrevivir a desafíos internos extremos, como la gran rebelión liderada por Umar ibn Hafsun, asentando las bases del futuro califato.

3. El Califato de Córdoba (929-1031)
Esta etapa representa el cénit del poder andalusí. En el año 929, Abderramán III asumió el título de Califa, rompiendo definitivamente la dependencia religiosa y asumiendo la autoridad suprema. Fue la época de mayor hegemonía militar, convirtiendo a los núcleos cristianos del norte en vasallos que pagaban tributos.
3.1. El Esplendor de la "Perla de Occidente"
•	Administración y Urbanismo: Córdoba se convirtió en la principal ciudad de Europa, dotada de una burocracia eficiente y una sociedad urbana sofisticada. El brillo artístico se materializó en la ciudad palatina de Medina Azahara.
•	Prosperidad Económica: Se controlaron las rutas comerciales transaharianas y floreció una artesanía de lujo basada en la seda y el marfil.
•	La Dictadura de Almanzor: A finales del siglo X, el poder efectivo pasó a manos de Almanzor, quien impuso una dictadura militar de gran agresividad externa.
Tras la muerte de los sucesores de Almanzor, el califato entró en una cruenta guerra civil o fitna, que derivó en su desintegración total en el año 1031.

4. Los Reinos de Taifas (1031-1085)
La desaparición del califato dio lugar a una fragmentación política en más de veinte pequeños estados independientes o taifas, como Sevilla, Toledo, Zaragoza o Granada.
4.1. Debilidad Militar y Brillo Cultural
•	Las Parias: La debilidad militar obligó a las taifas a pagar tributos o parias a los reinos cristianos para evitar ataques, lo que generó un descontento popular por la asfixiante presión fiscal.
•	Dinamismo Urbano: Paradójicamente, las ciudades mantuvieron un gran dinamismo comercial. Los reyes de taifa compitieron en prestigio fomentando la cultura, la filosofía y la arquitectura (ejemplo: el Palacio de la Aljafería de Zaragoza).
La caída de Toledo en 1085 ante Alfonso VI marcó un punto de inflexión, obligando a las taifas a solicitar ayuda externa.

5. Los Imperios Norteafricanos (1086-1212)
Dos grandes imperios bereberes cruzaron el Estrecho de Gibraltar para contener el avance cristiano, imponiendo su dominio sucesivo sobre Al-Ándalus.
5.1. Almorávides y Almohades
•	Los Almorávides (1086-1145): Impusieron una unificación basada en la ortodoxia religiosa y la fuerza militar.
•	Los Almohades (1147-1212): Establecieron su capital en Sevilla. Su etapa se caracterizó por una militarización social y un arte sobrio y monumental, dejando iconos como la Giralda y la Torre del Oro.
•	Economía y Religión: Unificaron los mercados con el Magreb, pero su rigorismo religioso provocó roces con la población local, más liberal.
Este dominio africano terminó tras la derrota almohade en la batalla de las Navas de Tolosa en 1212, abriendo el valle del Guadalquivir a la conquista cristiana.

6. El Reino Nazarí de Granada (1238-1492)
Fundado por Mohamed I, fue el último reducto islámico en la península. Sobrevivió durante dos siglos y medio gracias a su vasallaje a la Corona de Castilla, el pago de tributos y una hábil diplomacia.
6.1. Culmen Artístico y Final
•	Demografía y Economía: El reino se densificó con refugiados musulmanes. Su prosperidad se basó en la agricultura intensiva de su vega y el comercio de seda con Italia.
•	Arquitectura: Representó el máximo esplendor del arte andalusí con la Alhambra y el Generalife, donde destacaron las yeserías, el uso del agua y los mocárabes.
•	El Fin de Al-Ándalus: En 1492, tras la unión de los Reyes Católicos y la guerra de Granada, se produjo la rendición de Boabdil, cerrando el ciclo histórico de Al-Ándalus.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Tzo3U3KtJu0",
  },
  {
    slug: "tema-9",
    titulo: "Tema 9: SOCIEDAD Y ECONOMÍA DE AL-ÁNDALUS",
    descripcion: "Grupos sociales, agricultura, comercio y vida urbana.",
    indice: `Índice del tema 9
1.	Estructura Social y Estratificación Étnico-Religiosa
2.	La Revolución Agraria y Técnica
3.	Dinamismo Económico y Comercial
4.	Cultura y Ciencia en Al-Ándalus
5.	Manifestación Artística y Legado Arquitectónico`,
    contenido: `TEMA 9: SOCIEDAD Y ECONOMÍA DE AL-ÁNDALUS
1. Estructura Social y Estratificación Étnico-Religiosa
Tras la fragmentación del antiguo reino visigodo y la consolidación del dominio musulmán, la península experimentó una transformación social profunda. Se produjo el paso de una sociedad estamental de raíz germánica hacia una nueva estructura de base eminentemente urbana, cuya estratificación se definía por criterios étnico-religiosos.
1.1. El Grupo Dominante: Los Musulmanes
Dentro del bloque musulmán, que ocupaba la cúspide de la pirámide social, convivían tres grupos con roles y privilegios diferenciados:
•	Aristocracia árabe: Eran los poseedores de las tierras más fértiles y ostentaban el poder político principal.
•	Bereberes: Procedentes del norte de África, contaban con una influencia política menor y solían ocupar tierras menos productivas.
•	Muladíes: Se trataba de cristianos que optaron por convertirse al Islam, integrándose en la fe mayoritaria.
1.2. Los No Musulmanes: Dimmíes o "Pueblos del Libro"
Este grupo conservaba su fe a cambio del pago de tributos y gozaba de una protección legal específica:
•	Mozárabes: Cristianos que permanecían en territorio musulmán manteniendo su religión y leyes.
•	Judíos: Gozaban de una notable libertad administrativa y comercial, desempeñando roles clave en la economía y la cultura.
Nota técnica: Las tensiones entre árabes y bereberes, sumadas al descontento de los muladíes por la discriminación fiscal que sufrían, fueron fuentes constantes de inestabilidad que contribuyeron a las crisis del Emirato y el Califato.

2. La Revolución Agraria y Técnica
Al-Ándalus revitalizó el campo peninsular fusionando el legado romano con la sofisticada sabiduría agronómica traída de Oriente. La agricultura se erigió como el pilar fundamental del Estado, impulsada por una auténtica revolución técnica.
2.1. Innovaciones en el Regadío y Gestión del Agua
Los musulmanes introdujeron sistemas avanzados para optimizar el recurso hídrico:
•	Infraestructuras: Uso masivo de acequias, aljibes y norias.
•	Marco Legal: La gestión se regulaba bajo el derecho islámico, con un reparto minucioso del agua a través de instituciones especializadas como los tribunales de riego.
2.2. Introducción de Nuevos Cultivos
La mejora técnica permitió transformar el paisaje agrícola con la llegada de:
•	Arroz, Algodón y Caña de azúcar: Cultivos que requerían sistemas de riego constante.
•	Cítricos: Naranjas y limones.
•	Azafrán: Producto de alto valor comercial.

3. Dinamismo Económico y Comercial
Al-Ándalus se integró con éxito en el circuito comercial del Mediterráneo y en las vitales rutas transaharianas, posicionándose como puente entre el mundo oriental y el Occidente cristiano.
3.1. Organización del Mercado y Producción
•	Control Estatal: La actividad se centraba en los zocos (mercados), bajo la supervisión del almotacén, quien garantizaba el cumplimiento de pesos y medidas.
•	Manufacturas de Lujo: Destacaron los textiles de seda y lino, el trabajo del cuero (cordobanes), la cerámica vidriada y la orfebrería en marfil.
•	Sistema Monetario: El intercambio se facilitó mediante la acuñación de monedas fuertes: el Dinar de oro y el Dirhem de plata.
Esta riqueza permitió financiar el poder militar de figuras como Abderramán III o Almanzor, y el esplendor de las cortes de las Taifas.

4. El Faro Cultural de Europa (Siglos IX al XI)
Durante este periodo, Al-Ándalus asumió la labor de preservar y traducir el saber clásico griego y romano que se había perdido tras la caída de Roma. El árabe se consolidó como la lengua de la ciencia.
4.1. Avances en Disciplinas Científicas
•	Astronomía y Matemáticas: Introducción de la numeración arábiga y el concepto revolucionario del cero.
•	Medicina: Progresos en cirugía y farmacopea que superaban los conocimientos europeos contemporáneos.
•	Filosofía: Mentes como Averroes y Maimónides buscaron reconciliar la fe con la razón aristotélica.
La transmisión de estos conocimientos hacia el norte se realizó a través de centros fundamentales como el de Toledo.

5. Manifestación Artística y Arquitectónica
El arte andalusí integró elementos romanos (arco de medio punto) y visigodos (arco de herradura) dentro de un estilo oriental inconfundible.
5.1. Etapas Fundamentales de la Arquitectura
•	Etapa Omeya o Califal (Siglos VIII-X): Su cumbre es la Mezquita de Córdoba (bosque de columnas y doble arquería) y la ciudad de Medina Azahara.
•	Etapa Almohade (Siglos XI-XIII): Marcada por la sobriedad monumental. Ejemplos: la Giralda, la Torre del Oro y la Aljafería de Zaragoza (arte de taifas).
•	Etapa Nazarí (Siglos XIV-XV): Culmen estético representado por la Alhambra de Granada y el Generalife, con uso magistral del agua, yeserías y mocárabes.
5.2. Características Decorativas
Debido al aniconismo (prohibición de representar figuras humanas), la creatividad se volcó en:
•	Geometría y Caligrafía.
•	Ataurique: Motivos vegetales decorativos.
Este legado dio lugar posteriormente al estilo mudéjar, donde los alarifes musulmanes trabajaron para los nuevos reinos cristianos.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/W4EZQIn88_o",
  },
  {
    slug: "tema-10",
    titulo: "Tema 10: FORMACIÓN DE LOS REINOS CRISTIANOS",
    descripcion: "Orígenes y consolidación de los núcleos cristianos.",
    indice: `Índice del tema 10
1.	El Núcleo Astur-Leonés
2.	La Marca Hispánica
3.	El Condado y Reino de Aragón
4.	Castilla: Origen y Autonomía
5.	Navarra, Cataluña y el Impacto del Camino de Santiago`,
    contenido: `TEMA 10: FORMACIÓN DE LOS REINOS CRISTIANOS
1. El Núcleo Astur-Leonés: El Germen de la Resistencia
Tras el colapso del reino visigodo en el año 711, el relieve escarpado del norte peninsular se convirtió en el refugio natural de nobles visigodos y tribus locales (astures y cántabros). Este entorno, de difícil acceso para la caballería musulmana, permitió el nacimiento de un nuevo orden político.
1.1. Del Reino de Asturias al Reino de León
•	Don Pelayo y Covadonga (722): Tras la victoria en la batalla de Covadonga, Don Pelayo sentó las bases del Reino de Asturias.
•	Expansión Territorial: Bajo el mandato de Alfonso III, la frontera cristiana se desplazó hasta el río Duero.
•	Nacimiento del Reino de León: En el año 910, el traslado de la capital a León oficializó este nuevo estado.
1.2. Sociedad, Economía e Ideología
La vida en el norte se definía por una comunidad de hombres libres y una pequeña nobleza guerrera.
•	La Presura: Sistema de colonización basado en la ocupación y puesta en explotación de tierras yermas.
•	Economía de Frontera: Predominantemente ganadera y de subsistencia debido a la inestabilidad bélica.
•	Neogoticismo y Reconquista: Ideología que reclamaba la herencia de la tradición visigoda. Este sentimiento se reforzó en el siglo IX con el descubrimiento del sepulcro del apóstol Santiago.

2. La Marca Hispánica y los Núcleos Pirenaicos
En el sector oriental, el Imperio Carolingio de Carlomagno estableció una "franja tapón" para protegerse de las incursiones musulmanas tras la batalla de Poitiers. Esta zona defensiva se conoció como la Marca Hispánica.
2.1. Estructura y Autonomía
•	Organización Condal: Se estructuró en condados dependientes de los francos, desde Navarra hasta la actual Cataluña.
•	Evolución hacia la Independencia: Al aprovechar la debilidad de los sucesores de Carlomagno, los condes convirtieron sus cargos en hereditarios.
•	Diferenciación Cultural: Se basaban en una estructura feudal clásica, economía agraria de montaña y el seguimiento del rito romano, a diferencia del rito mozárabe de León.

3. Aragón: De Condado de Montaña a Potencia
En los valles centrales pirenaicos, los núcleos de Aragón, Sobrarbe y Ribagorza dependieron inicialmente de los francos o del reino de Pamplona.
3.1. Hegemonía y Sociedad Pastoril
•	Independencia (Siglo IX): El Condado de Aragón, centrado en el valle del río Aragón y la localidad de Jaca, se independizó bajo la dinastía de Aznar Galíndez.
•	Centros de Poder: Sociedad cerrada organizada en torno a castillos y monasterios defensivos, como el de San Juan de la Peña.
•	Economía: Fundamentada en la ganadería trashumante. Estos condados darían lugar al futuro Reino de Aragón.

4. Castilla: La Vanguardia Guerrera
En la frontera oriental del Reino de León surgió Castilla, denominada así por la proliferación de castillos defensivos contra los ataques musulmanes.
4.1. Unificación y Soberanía
•	Fernán González (Siglo X): El conde logró unificar los condados castellanos y obtener autonomía de facto de León.
•	Reino de Castilla (Siglo XI): Alcanzó la categoría de reino bajo el mandato de Fernando I.
•	Estratificación Social Única: Para atraer pobladores a una zona peligrosa, se ofrecieron libertades que crearon figuras como los caballeros villanos.
4.2. Derecho y Cultura
•	El Cid Campeador: Personificó el espíritu épico y combativo de la zona.
•	Derecho Consuetudinario: A diferencia del Liber Iudiciorum visigodo, Castilla se rigió por las costumbres y las fazañas (sentencias judiciales). Su economía se basó en la ganadería y el botín de guerra.

5. Evolución Hacia los Estados Soberanos y el Legado Cultural
El mapa político del norte terminó de definirse con la consolidación de las coronas y la apertura hacia Europa.
5.1. Navarra y los Condados Catalanes
•	Sancho III el Mayor (Siglo XI): Llevó al Reino de Navarra (antes de Pamplona) a su apogeo, unificando casi todos los núcleos cristianos. Tras su muerte, su hijo Ramiro I fue el primer rey de Aragón.
•	Wifredo el Velloso: Inició la unificación de los Condados Catalanes, logrando la independencia total de los francos a finales del siglo X.
5.2. El Camino de Santiago y la Unión de Coronas
El Camino de Santiago actuó como arteria vital para la península:
•	Impacto Cultural: Introducción del arte Románico y corrientes europeas.
•	Economía y Política: Impulsó el comercio en Navarra y Aragón, mientras Barcelona miraba al Mediterráneo.
•	Corona de Aragón (Siglo XII): La unión matrimonial de Petronila de Aragón y Ramón Berenguer IV (Barcelona) creó este ente político fundamental.`,


    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/SAzwGMBT05A",
  },
  {
    slug: "tema-11",
    titulo: "Tema 11: EXPANSIÓN CRISTIANA Y REPOBLACIÓN",
    descripcion: "Avance territorial cristiano y modelos de repoblación.",
    indice: `Índice del Tema 11
1.	El Avance de los Reinos Cristianos y la Expansión Territorial
2.	Modelos de Repoblación y Organización Social del Espacio
3.	Instituciones y Modelos Políticos Medievales
4.	Estructura Social y Crisis del Sistema Feudal`,
    contenido: `TEMA 11: EXPANSIÓN CRISTIANA Y REPOBLACIÓN
1. El Avance de los Reinos Cristianos y la Expansión Territorial
La expansión de los núcleos cristianos del norte hacia el sur fue el proceso que definió la configuración de la península en los siglos venideros. Este avance no fue lineal; dependió directamente de la fuerza militar cristiana y de la fragmentación política de Al-Ándalus, especialmente crítica durante el periodo de las taifas.
1.1. Fases Cronológicas de la Expansión
El proceso se divide en tres grandes etapas marcadas por hitos geográficos y victorias militares decisivas:
•	Siglos VIII al X (Consolidación en el Norte): Los Reinos de Asturias y León protagonizaron un avance hasta la línea del río Duero. Fue una etapa caracterizada por la ocupación de tierras que se encontraban prácticamente despobladas.
•	Siglos XI y XII (Los Valles Centrales): Los cristianos conquistaron los valles del Tajo y el Ebro. En este periodo destacan la toma de Toledo (1085) y la toma de Zaragoza (1118). Este avance enfrentó la feroz resistencia de los imperios norteafricanos: los almorávides y los almohades.
•	Siglo XIII (La Gran Expansión): Tras la victoria definitiva en la batalla de las Navas de Tolosa (1212), el escenario cambió drásticamente. Fernando III el Santo conquistó el valle del Guadalquivir (ciudades de Córdoba y Sevilla), mientras que Jaime I de Aragón ocupó Valencia y las islas Baleares. El dominio musulmán quedó reducido al Reino Nazarí de Granada.

2. Modelos de Repoblación y Organización Social del Espacio
La repoblación fue la necesidad imperativa de asegurar el control efectivo de las tierras mediante el asentamiento de población. Los modelos variaron según la época y la peligrosidad de la frontera, configurando la estructura de la propiedad actual en España.
2.1. Tipologías de Repoblación
•	Presura o Aprisio (Siglos VIII-X): Aplicada en el norte y el valle del Duero. Campesinos y hombres libres ocupaban tierras yermas, generando una estructura de pequeña propiedad.
•	Repoblación Concejil (Siglos XI-XII): Entre el Duero y el Tajo. El territorio se dividía en alfoces (ciudad y entorno rural) gestionados por un concejo. Se atraía a pobladores mediante fueros o cartas pueblas.
•	Órdenes Militares (Siglo XIII): En zonas peligrosas como La Mancha o Extremadura. Se entregaron grandes latifundios a órdenes como Santiago o Calatrava para la defensa y la ganadería.
•	Repartimientos (Siglo XIII): En Andalucía y Murcia. Las casas y tierras se distribuían entre los participantes de la campaña militar según su rango social, consolidando los grandes latifundios del sur.

3. Instituciones y Modelos Políticos Medievales
La monarquía medieval no era absoluta; el poder del rey estaba limitado por la nobleza y el clero mediante el vasallaje. Ideológicamente, el monarca era "rey por la gracia de Dios", con la misión de defender la fe y administrar justicia.
3.1. Dualidad de Modelos: Castilla vs. Aragón
•	Modelo de Castilla: De carácter más autoritario. El monarca gozaba de mayores atribuciones, aunque siempre respetando los fueros locales.
•	Modelo de Aragón: De carácter pactista. El rey debía jurar fidelidad a los fueros y pactar decisiones con los estamentos. Destaca la figura del Justicia de Aragón, encargado de proteger los derechos ante posibles abusos reales.
3.2. El Nacimiento de las Cortes
Entre los siglos XII y XIII nacieron las Cortes, asambleas convocadas por el rey donde participaban la nobleza, el clero y la burguesía (tercer estado).
•	Hito fundamental: Las Cortes de León de 1188 (Alfonso IX) son el primer testimonio de parlamentarismo en Europa.
•	Función Económica: La votación de "servicios" (impuestos extraordinarios para guerras). A cambio, el rey debía atender las quejas y peticiones de los estamentos.

4. Estructura Social y Crisis del Sistema Feudal
La sociedad era estamental, profundamente teocéntrica y dividida entre grupos con diferentes derechos y obligaciones.
4.1. División Estamental
•	Privilegiados: Incluía a la nobleza (bellatores, encargados de la guerra) y al clero (oratores, dedicados a la oración). Tenían jurisdicción propia y no pagaban impuestos.
•	No Privilegiados: Los laboratores (campesinos y artesanos). Sostenían el sistema mediante su trabajo y el pago de la renta feudal.
4.2. Dinámicas Económicas y Conflictividad
La economía se basaba en la entrega de parte de la cosecha al señor y la prestación de servicios personales o corveas. Aunque el sistema garantizó la defensa, las desigualdades provocaron tensiones que estallaron al final de la Edad Media en revueltas como:
1.	Irmandiños en Galicia.
2.	Remensas en Cataluña.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/j7ZV-sI3o0g",
  },
  {
    slug: "tema-12",
    titulo: "Tema 12: CRISIS DE LA BAJA EDAD MEDIA",
    descripcion: "Conflictos políticos, crisis demográfica y tensiones sociales.",
    indice: `Índice del tema 12
1.	El Límite del Crecimiento y el Contexto Pre-Crisis
2.	La Catástrofe Sanitaria: La Peste Negra de 1348
3.	Conflictividad Social y Revueltas Estamentales
4.	Crisis Política y el Ascenso de la Dinastía Trastámara`,
    contenido: `TEMA 12: CRISIS DE LA BAJA EDAD MEDIA
1. El Límite del Crecimiento y el Contexto Pre-Crisis
Tras varios siglos de expansión sostenida y un crecimiento agrícola sin precedentes entre los siglos XI y XIII, el sistema feudal peninsular alcanzó un límite de saturación. Este agotamiento estructural desencadenó la profunda crisis del siglo XIV, marcada por la ruptura del equilibrio entre la población y los recursos.
1.1. Factores Determinantes de la Crisis de Subsistencia
La crisis no fue un evento aislado, sino el resultado de una combinación de factores adversos:
•	Cambio Climático: Se produjo un fenómeno conocido como la Pequeña Edad de Hielo, que trajo consigo una sucesión de malas cosechas recurrentes.
•	Agotamiento de los Suelos: La producción disminuía debido al desgaste de las tierras menos fértiles que se habían roturado durante la época de expansión previa.
•	Inflación Alimentaria: La escasez de alimentos provocó que el precio de los cereales aumentara drásticamente, dificultando el acceso a productos básicos.
•	Vulnerabilidad Biológica: La población, debilitada por una desnutrición prolongada, se volvió extremadamente vulnerable ante las enfermedades, marcando el fin del optimismo medieval.

2. La Catástrofe Sanitaria: La Peste Negra de 1348
En un escenario de debilidad demográfica, la tragedia se materializó con la llegada de una pandemia sin precedentes que reestructuró totalmente la propiedad agraria y la mentalidad de la época hacia una visión pesimista y macabra.
2.1. Propagación y Consecuencias Inmediatas
•	Origen y Difusión: La Peste Negra llegó a la península en 1348, procedente de Oriente a través de las rutas comerciales, propagándose con rapidez desde las costas hacia el interior.
•	Mortalidad Masiva: Se estima una pérdida de entre el 30% y el 50% de la población en algunas zonas, siendo las ciudades las más afectadas por su alta densidad.
•	Impacto Económico: La falta de mano de obra provocó el abandono de campos de cultivo, denominados "despoblados", y una parálisis del comercio urbano. Aunque los salarios subieron por la escasez de trabajadores, la inflación se volvió incontrolable.
2.2. Respuesta Ideológica y Social
La sociedad interpretó la calamidad como un castigo divino, lo que derivó en:
•	Movimientos de flagelantes: Grupos que buscaban la redención mediante la autoinflicción de castigos físicos.
•	Aumento del fanatismo religioso: Se buscaron "chivos expiatorios" para explicar la tragedia, señalando frecuentemente a las comunidades judías.

3. Conflictividad Social y Revueltas Estamentales
Como respuesta a la asfixia económica y al intento de la nobleza por mantener sus ingresos mediante el aumento de la presión fiscal, estallaron violentos conflictos por toda la geografía peninsular.
3.1. Conflictos en el Ámbito Rural y Urbano
•	Revuelta de los Irmandiños (Galicia): Levantamiento campesino armado contra los abusos de la nobleza local.
•	Guerra de los Remensas (Cataluña): Lucha campesina contra los denominados "malos usos" señoriales que limitaban su libertad y economía.
•	Conflicto de Barcelona: Enfrentamiento por el poder municipal entre la Biga (alta burguesía) y la Busca (artesanos y pequeños comerciantes).
•	Pogromos de 1391: Estallidos de violencia extrema contra las juderías, alimentados por la tensión social y el fanatismo.
Históricamente, estos conflictos debilitaron el régimen señorial y fortalecieron la figura de la monarquía, que se posicionó como árbitro necesario entre los estamentos.

4. Crisis Política y el Ascenso de la Dinastía Trastámara
La Baja Edad Media estuvo marcada por el enfrentamiento entre el poder real, que buscaba centralizar el Estado, y una nobleza decidida a mantener sus privilegios feudales.
4.1. Transformaciones en Castilla y Aragón
•	Guerra Civil Castellana: Enfrentamiento cruento entre Pedro I "el Cruel" y su hermanastro Enrique de Trastámara. La victoria de Enrique instauró la dinastía Trastámara y aumentó el poder nobiliario mediante las "Mercedes enriqueñas".
•	Compromiso de Caspe (1412): Tras la muerte sin descendencia de Martín el Humano, se eligió como rey de Aragón a Fernando I, también de la casa Trastámara, uniendo dinásticamente a los dos grandes reinos.
4.2. Hacia el Estado Moderno
Bajo este nuevo marco, el derecho romano recuperó fuerza frente a las viejas costumbres feudales, favoreciendo el ideal de una monarquía autoritaria. Esta unificación dinástica facilitó la futura unión de los Reyes Católicos, culminando con la toma de Granada en 1492, hito que marca el inicio del Estado Moderno.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/ryatzFjWcDI",
  },
  {
    slug: "tema-13",
    titulo: "Tema 13: LOS REYES CATÓLICOS",
    descripcion: "Unión dinástica, política interior y expansión exterior.",
    indice: `Índice del tema 13
1.	El Tránsito hacia la Unión Dinástica (1469–1479)
2.	La Naturaleza del Nuevo Estado: Una Unión Personal
3.	Instituciones de la Monarquía Autoritaria
4.	La Guerra de Granada y la Finalización de la Reconquista
5.	Política de Uniformidad Religiosa
6.	Expansión Atlántica y el Nuevo Orden Mundial`,
    contenido: `TEMA 13: LOS REYES CATÓLICOS
1. El Tránsito hacia la Unión Dinástica (1469–1479)
A mediados del siglo XV, la Península Ibérica se encontraba dividida en cinco entidades soberanas: los reinos de Castilla, Aragón, Portugal y Navarra, junto al Reino Nazarí de Granada. Bajo el reinado de Enrique IV en Castilla, se vivió una etapa de inestabilidad sucesoria que enfrentó a su hija, Juana "la Beltraneja", con su hermana Isabel.
1.1. El Conflicto Sucesorio y el Tratado de Alcaçovas
El proceso de unificación se aceleró mediante hitos políticos y militares clave:
•	Matrimonio en Valladolid (1469): Contraído en secreto entre Isabel de Castilla y Fernando de Aragón, sentando las bases de la futura unión.
•	Guerra Civil Castellana (1474–1479): Tras la muerte de Enrique IV, estalló un conflicto donde Isabel recibió el apoyo de la Corona de Aragón, mientras que Juana fue auxiliada por Portugal.
•	Tratado de Alcaçovas (1479): Acuerdo definitivo que puso fin a la contienda, mediante el cual Portugal reconoció formalmente a Isabel como reina de Castilla.

2. La Naturaleza del Nuevo Estado: Una Unión Personal
Es imperativo subrayar que la unión de los Reyes Católicos no fue institucional, sino una unión dinástica de carácter estrictamente personal bajo la dinastía Trastámara. Aunque se utilizó la consigna de la "restauración de España" como justificación ideológica, la estructura interna permaneció fragmentada.
2.1. Persistencia de las Identidades de Reino
A pesar de compartir monarcas, se mantuvieron las siguientes diferencias:
•	Soberanía Jurídica: Cada reino conservó sus propias fronteras, leyes o fueros, lenguas y monedas.
•	Condición Ciudadana: Los habitantes de un reino seguían siendo considerados extranjeros en el otro.
•	Economía y Comercio: Se mantuvieron las aduanas interiores, lo que impidió un mercado único, aunque se impulsó la ganadería castellana mediante la Mesta.

3. Instituciones de la Monarquía Autoritaria
Para consolidar el Estado Moderno, los reyes limitaron la autonomía de la nobleza levantisca y de las ciudades, estableciendo una monarquía autoritaria. Si bien la nobleza y el clero mantuvieron su poder económico y social, quedaron sometidos políticamente a la Corona.
3.1. Reformas Administrativas y Judiciales
•	Santa Hermandad (1476): Creación de un cuerpo armado para vigilar caminos y asegurar el orden público en el territorio.
•	Consejo Real: Profesionalización de la institución mediante la inclusión de letrados, restando peso político a la alta aristocracia.
•	Corregidores: Funcionarios enviados como representantes directos del poder real para controlar los municipios.
•	Chancillerías: Establecimiento de altos tribunales de justicia en Valladolid y Granada para centralizar la aplicación de la ley.
•	Hacienda Real: Reorganización del sistema fiscal para recuperar rentas usurpadas por la nobleza y financiar el aparato estatal.

4. La Guerra de Granada y la Finalización de la Reconquista
El fortalecimiento del poder real permitió abordar el fin del Reino Nazarí de Granada, que funcionaba como tributario de Castilla pero generaba inestabilidad. La guerra, desarrollada entre 1482 y 1492, se basó en una estrategia de asedios y el aprovechamiento de las disputas internas entre el sultán y su hijo Boabdil.
4.1. Consecuencias del 2 de enero de 1492
•	Rendición y Capitulaciones: Tras diez años de campaña, la ciudad se rindió bajo promesas iniciales de libertad religiosa para la población, ahora llamada mudéjar.
•	Expansión Territorial: La victoria permitió incorporar la Vega de Granada y controlar las costas frente a la piratería.
•	Impacto Ideológico: Presentada como una cruzada religiosa, la toma de Granada permitió a Castilla proyectar sus recursos hacia el Océano Atlántico y el norte de África.

5. Política de Uniformidad Religiosa
Bajo el título concedido por el Papa en 1496, los monarcas impusieron la fe como elemento de cohesión nacional, generando una fractura social entre "cristianos viejos" y "cristianos nuevos".
5.1. Instrumentos de Control y Exclusión
•	Tribunal de la Inquisición (1478): Institución bajo control directo de la Corona para perseguir la herejía y vigilar a los conversos.
•	Expulsión de los Judíos (1492): Decreto que obligó al exilio a quienes no aceptaran el bautismo, provocando la pérdida de capital humano cualificado (médicos, banqueros y artesanos).
•	Decreto de 1502: Tras la rebelión de las Alpujarras, se obligó a los musulmanes a convertirse (pasando a ser llamados moriscos) o abandonar el reino.

6. Expansión Atlántica y el Nuevo Orden Mundial
La limitación de rutas impuesta por el Tratado de Alcaçovas obligó a buscar alternativas hacia las Indias por el oeste, desplazando el eje económico del Mediterráneo al Atlántico.
6.1. La Colonización y el Reparto de Influencia
•	Islas Canarias: Conquista finalizada en 1496 con la toma de Tenerife, sirviendo como laboratorio de colonización.
•	Capitulaciones de Santa Fe y Descubrimiento: Acuerdos con Cristóbal Colón que dieron inicio a la expansión americana.
•	Tratado de Tordesillas (1494): Acuerdo con Portugal para repartir las zonas de influencia en el Atlántico.
•	Administración Colonial: Creación de los Virreinatos de Nueva España y Perú (usando la encomienda y la mita) y de la Casa de Contratación en Sevilla para monopolizar metales preciosos (oro y plata) y productos como el cacao y el tabaco.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/4LOcyPkD0PI",
  },
  {
    slug: "tema-14",
    titulo: "Tema 14: CARLOS I (1516-1556)",
    descripcion: "Monarquía hispánica y conflictos internos y exteriores.",
    indice: `Índice del Tema 14
1.	La Formación del Imperio y la Herencia Territorial
2.	Organización Social, Economía e Ideología Imperial
3.	Conflictos Internos: Comunidades y Germanías (1520–1522)
4.	Política Exterior y Conflictos Europeos
5.	Estructura Económica y Debilidades del Modelo`,
    contenido: `TEMA 14: CARLOS I (1516-1556)
1. La Formación del Imperio y la Herencia Territorial
El año 1516 representó un punto de inflexión irreversible con la muerte de Fernando el Católico. Su nieto, Carlos de Habsburgo (hijo de Juana I de Castilla y Felipe el Hermoso), asumió el trono de un conglomerado de territorios inconexos. Esta acumulación de poder, sin precedentes en la historia, se basó en la herencia de sus cuatro abuelos:
•	Abuelos Maternos (Reyes Católicos): Recibió las Coronas de Castilla y Aragón, las posesiones en Italia (Nápoles, Sicilia y Cerdeña), el reino de Navarra y las tierras de América.
•	Abuelos Paternos (Maximiliano de Austria y María de Borgoña): Aportaron Austria, los Países Bajos, el Franco Condado y el derecho a la elección como Emperador del Sacro Imperio Romano Germánico, título que obtuvo en 1519 como Carlos V.

2. Organización Social, Economía e Ideología Imperial
La llegada del monarca a España generó un rechazo inicial debido a su entorno extranjero. Carlos I arribó con una corte de consejeros flamencos, entre los que destacaba Adriano de Utrecht, quienes desplazaron a la nobleza local de los cargos de gobierno.
2.1. El Proyecto de la "Universitas Christiana"
Ideológicamente, el emperador impulsó la "Universitas Christiana", una visión de Europa unida bajo el catolicismo y su liderazgo político. Este proyecto tenía dos objetivos primordiales:
1.	Frenar el avance del Imperio otomano.
2.	Combatir la reforma protestante.
2.2. La Carga Financiera de la Hegemonía
La estructura imperial demandaba sumas ingentes de dinero para sobornar a los príncipes electores alemanes y mantener una corte itinerante. Este peso recayó desproporcionadamente en los impuestos de Castilla, supeditando los recursos españoles a los intereses dinásticos de los Habsburgo.

3. Conflictos Internos: Comunidades y Germanías (1520–1522)
El descontento por la ausencia del rey, el gobierno de extranjeros y la presión fiscal detonó dos grandes revueltas que alteraron la organización social de la península.
3.1. Las Comunidades de Castilla
Fue un movimiento de carácter político liderado por ciudades como Toledo, Segovia y Salamanca. Reclamaban la residencia del rey en España y la limitación del poder flamenco.
•	Líderes principales: Padilla, Bravo y Zapata.
•	Desenlace: Fueron derrotados definitivamente en la Batalla de Villalar en 1521.
3.2. Las Germanías (Valencia y Mallorca)
A diferencia de las Comunidades, este fue un movimiento de corte social y antiseñorial. Consistió en una revuelta de artesanos y pequeña burguesía dirigida contra la nobleza local.
Consecuencia común: La alta nobleza apoyó al Rey para salvaguardar el orden estamental. La derrota rebelde permitió consolidar el autoritarismo real y convertir a Castilla en el pulmón financiero del Imperio, mientras la nobleza se convertía en aliada definitiva de la Corona.

4. Política Exterior y Conflictos Europeos
Carlos I pasó la mayor parte de su reinado fuera de España, gestionando una agenda exterior marcada por la defensa de la ortodoxia católica y la hegemonía militar de los Tercios.
4.1. Los Tres Desafíos Titánicos
•	Rivalidad con Francia: Enfrentamiento con Francisco I por Italia y Borgoña. La victoria en la Batalla de Pavía (1525) aseguró el control del Milanesado.
•	Amenaza Otomana: Defensa del Mediterráneo y de Viena frente a Solimán el Magnífico.
•	Lucha contra el Protestantismo: Conflicto iniciado por Martín Lutero. Pese a la victoria en Mühlberg (1547), el emperador debió aceptar la fragmentación religiosa en la Paz de Augsburgo (1555).
Impacto económico y final del reinado: El coste bélico obligó a depender de préstamos de banqueros como los Fugger (alemanes) e italianos, llevando a la monarquía al borde de la quiebra. En 1556, un Carlos I desgastado abdicó, dividiendo su imperio entre su hermano Fernando y su hijo Felipe II.

5. Estructura Económica y Debilidades del Modelo
La economía imperial fue de carácter extractivo y militarista, generando una dependencia estructural de las riquezas americanas que no se invirtieron en desarrollo interno.
5.1. Pilares y Consecuencias de la Economía Imperial
•	La Casa de Contratación (Sevilla): Institución encargada de centralizar el oro y la plata de América para financiar la política exterior.
•	La Revolución de los Precios: La entrada masiva de metales provocó una inflación galopante que empobreció a las clases bajas y restó competitividad a la industria.
•	Mentalidad Rentista: La riqueza no generó una burguesía productiva, sino que reforzó el rentismo de la nobleza y el clero.
•	Endeudamiento Crónico: Los gastos superaban los ingresos, obligando a emitir juros (títulos de deuda pública) que hipotecaron el futuro del reino.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/lwdTu3Pz0Rc",
  },
  {
    slug: "tema-15",
    titulo: "Tema 15: FELIPE II (1556-1598)",
    descripcion: "Apogeo y dificultades del imperio de Felipe II.",
    indice: `Índice del tema 15
1.	El Tránsito al Reinado de Felipe II y el Nuevo Modelo de Gobierno
2.	El Sistema Polisinodial y la Ideología de Estado
3.	Conflictos Internos y Cohesión Autoritaria
4.	Política Exterior: La Unión Ibérica y los Frentes Continentales
5.	Economía, Administración Colonial y Sociedad`,
    contenido: `TEMA 15: FELIPE II (1556-1598)
1. El Tránsito al Reinado de Felipe II y el Nuevo Modelo de Gobierno
Tras las abdicaciones de Bruselas, el mapa del poder global sufrió una transformación definitiva cuando Carlos I decidió dividir su herencia. En este reparto, Felipe II recibió la parte más sustancial y compleja del patrimonio de los Habsburgo: los reinos peninsulares al completo, las estratégicas posesiones italianas, los Países Bajos, el Franco Condado y el vasto Imperio Americano.
1.1. La Monarquía Sedentaria y la Capitalidad
A diferencia del carácter itinerante de su padre, Felipe II se reveló como un "rey burócrata" que prefería gobernar desde un centro fijo.
•	Establecimiento de la capital (1561): El monarca eligió Madrid por su posición geográfica central en la península.
•	San Lorenzo de El Escorial: Mandó construir este imponente monasterio-palacio, que funcionó como el centro neurálgico del imperio. Desde allí, el monarca dirigía personalmente la administración a través de una ingente cantidad de documentos o "papeles".

2. El Sistema Polisinodial y la Ideología de Estado
Para gestionar dominios en cinco continentes, se consolidó un sofisticado sistema de Consejos que actuaban como los ojos y oídos del rey. Bajo esta organización, se aplicó el concepto de Monarquía Hispánica, donde el soberano era el brazo armado de la Contrarreforma católica nacida del Concilio de Trento.
2.1. Tipología de Consejos
El entramado administrativo se dividía según su función o territorio:
•	Consejos Territoriales: Encargados de asuntos específicos de Castilla, Aragón, las Indias, Italia y Flandes. A este grupo se sumó Portugal tras la unión de 1580.
•	Consejos Temáticos: Dedicados a cuestiones transversales que afectaban a toda la monarquía, como el de Estado, Hacienda o la Inquisición.

3. Conflictos Internos y Cohesión Autoritaria
El anhelo de Felipe II por la unidad religiosa y política absoluta, destinada a evitar la penetración del protestantismo, derivó en una vigilancia social extrema y graves fracturas internas.
3.1. Sublevaciones y Crisis Institucionales
•	Rebelión de las Alpujarras (1568-1571): Los moriscos granadinos se sublevaron contra las presiones para abandonar sus costumbres. Fue sofocada por Juan de Austria y terminó con la dispersión forzosa de los moriscos por Castilla.
•	El caso de Antonio Pérez (1591): El secretario del rey huyó a Aragón tras ser acusado de asesinato. Su refugio en los fueros aragoneses provocó una crisis que terminó con la ejecución del Justicia Mayor de Aragón, Lanuza, y la limitación de los privilegios de dicho reino.
3.2. Mecanismos de Control Social
•	La Inquisición: Actuó con dureza eliminando focos protestantes en Valladolid y Sevilla mediante autos de fe.
•	Limpieza de sangre: Se impuso como requisito indispensable para cargos públicos, marginando a descendientes de judíos y moros.

4. Política Exterior: La Unión Ibérica y los Frentes Continentales
Bajo Felipe II, el imperio alcanzó su máxima expansión, aunque enfrentó una hostilidad creciente de las potencias europeas y el agotamiento de sus recursos.
4.1. La Expansión y la Defensa del Catolicismo
•	Unión Ibérica (1580): Al morir el rey de Portugal sin herederos, Felipe II hizo valer sus derechos sucesorios, sumando las costas de Brasil, África y Asia. Nació el imperio donde "nunca se ponía el sol".
•	Batalla de Lepanto (1571): La victoria de la Santa Liga frenó la expansión del Imperio otomano en el Mediterráneo.
•	Rebelión de Flandes: Conflicto desgastante motivado por el deseo de independencia y el avance del calvinismo.
•	La Armada Invencible (1588): Desastre naval derivado de la tensión con Inglaterra, que apoyaba a los rebeldes flamencos y practicaba la piratería.

5. Economía, Administración Colonial y Sociedad
A pesar de la llegada masiva de metales de las minas de Potosí y Zacatecas, la Hacienda real era deficitaria debido a las deudas heredadas y los gastos de los Tercios.
5.1. Gestión Económica y Colonial
•	Bancarrota de 1557: Fue la primera de varias declaraciones de insolvencia del reinado.
•	Revolución de los precios: La entrada de plata provocó una inflación que dañó la producción local.
•	Instituciones Coloniales: Se consolidaron los Virreinatos de Nueva España y Perú; el comercio fue monopolizado por la Casa de Contratación de Sevilla mediante el sistema de "Flotas y Galeones".
•	Legislación: La vida colonial se organizó a través de las Leyes de Indias.
5.2. Estructura Social y Cultural
•	Sociedad Peninsular: Dominada por la nobleza y el clero, con una "obsesión por la hidalguía" que despreciaba el trabajo manual.
•	Sociedad de Castas en las Indias: Liderada por peninsulares y criollos, sobre una base de población indígena sometida a la mita y esclavos africanos.
•	El Siglo de Oro: Paradójicamente, el dogmatismo convivió con un auge artístico representado por El Greco y un joven Cervantes. El reinado concluyó en 1598.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/mvgPJcWPgCQ",
  },
  {
    slug: "tema-16",
    titulo: "Tema 16: LOS AUSTRIAS MENORES",
    descripcion: "Valimiento, gobierno y decadencia política.",
    indice: `Índice del tema 16
1.	El Ocaso de una Dinastía: La Institución del Valimiento
2.	El Reinado de Felipe III (1598–1621)
3.	Felipe IV (1621–1665) y el Proyecto de Olivares
4.	Carlos II (1665–1700): El Fin de la Dinastía`,
    contenido: `TEMA 16 — LOS AUSTRIAS MENORES
1. El Ocaso de una Dinastía: La Institución del Valimiento
El siglo XVII español se caracterizó por un marcado declive definido por la debilidad de carácter de los últimos monarcas de la dinastía de los Austrias. Ante la incapacidad o desinterés de los reyes por las tareas de gobierno, surgió la figura del valido (también llamado privado o favorito), una práctica que se convirtió en rasgo permanente de la monarquía española y se extendió a otras cortes europeas.
1.1. Funcionamiento y Consecuencias Administrativas
El valimiento alteró profundamente la estructura del Estado de la siguiente manera:
•	Delegación de poder: El valido actuaba en la práctica como un primer ministro en quien el monarca delegaba todas las funciones de gobierno, a pesar de carecer de un cargo oficial.
•	Marginalidad institucional: Estos personajes operaron frecuentemente al margen de los órganos de gobierno tradicionales.
•	Corrupción y clientelismo: El sistema derivó en una grave corrupción social, donde los validos utilizaron su posición para el enriquecimiento personal y el favorecimiento de allegados, fortaleciendo a una nobleza oportunista.

2. El Reinado de Felipe III (1598–1621)
El reinado de Felipe III marcó el inicio formal de la delegación del poder real. Su gestión política se vio condicionada por una asfixiante precariedad económica, lo que obligó a mantener un equilibrio entre la corrupción interna y un pacifismo exterior forzado.
2.1. Los Validos y la Gestión Política
El poder real fue ejercido sucesivamente por dos figuras principales:
1.	Duque de Lerma (Francisco de Sandoval y Rojas): Su gestión fue mediocre y ambiciosa, destacando por la venta indiscriminada de cargos y títulos públicos.
2.	Duque de Uceda: Hijo del anterior, quien sustituyó a su padre en el favor real.
2.2. Hitos y Crisis de la Etapa
•	Expulsión de los moriscos (1609): Fue el hito interior más traumático. Supuso la salida de casi 300.000 moriscos, provocando una crisis demográfica y la pérdida de mano de obra cualificada en agricultura y artesanía, afectando especialmente a los reinos de Valencia y Aragón.
•	Pacifismo Exterior: Se firmó la paz con Inglaterra en 1604 y la Tregua de los Doce Años con Holanda en 1609.
•	Estructura Social: Se consolidó una sociedad de rentistas donde las clases altas invertían en juros (deuda pública) y compraban títulos nobiliarios en lugar de fomentar la producción.

3. Felipe IV (1621–1665) y el Proyecto de Olivares
Bajo Felipe IV, España intentó recuperar su prestigio internacional mediante reformas centralistas que buscaban fortalecer el Estado siguiendo el modelo francés, aunque terminaron provocando una fractura interna.
3.1. Las Reformas del Conde-Duque de Olivares
Gaspar de Guzmán, el Conde-Duque de Olivares, impulsó un proyecto basado en tres pilares:
•	Hacienda Nacional: Creación de erarios estatales para sanear las cuentas públicas.
•	Unificación Jurídica: Intento de imponer las leyes de Castilla al resto de los territorios.
•	Unión de Armas: Proyecto de creación de un ejército nacional costeado proporcionalmente por todos los reinos de la monarquía.
3.2. Economía de Guerra y Splendor Cultural
La realidad del reinado estuvo marcada por contrastes profundos:
•	Colapso Financiero: El Estado sufrió bancarrotas sucesivas por la Guerra de los Treinta Años. Se devaluó la moneda mediante la moneda de vellón (sustitución de plata por cobre).
•	Siglo de Oro: En plena crisis, la cultura alcanzó su cenit con Velázquez como pintor de cámara, quien aplicó un estilo naturalista inigualable.
•	Conflictos de 1640: Las reformas provocaron rebeliones en Portugal y en Cataluña (el Corpus de Sangre).
•	Pérdida de la Hegemonía: España cedió su dominio europeo tras la Paz de Westfalia (1648) y la Paz de los Pirineos (1659).

4. Carlos II (1665–1700): El Fin de la Dinastía
El último Austria, Carlos II, heredó el trono siendo un niño enfermizo. Su reinado fue una etapa de inestabilidad prolongada donde la regencia de su madre, Mariana de Austria, dependió de validos como Nithardt, Valenzuela y, más tarde, Juan José de Austria.
4.1. Depresión Interna y Debilidad Exterior
•	Dominio Francés: Bajo Luis XIV, Francia arrebató a España territorios como el Franco Condado en la Paz de Nimega (1678).
•	Crisis Demográfica y Social: Epidemias de peste, gripe y viruela sumieron a la población en la miseria. El campesinado, asfixiado por impuestos y malas cosechas, derivó hacia el bandolerismo y la mendicidad.
•	Arte Barroco: La ideología de la Contrarreforma se expresó en una religiosidad extrema y la arquitectura recargada de la familia Churriguera.
El fallecimiento de Carlos II sin descendencia en el año 1700 provocó una crisis sucesoria y una guerra por el trono, sellando el fin definitivo de los Austrias en España.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/2Tl86Qeo6VY",
  },
  {
    slug: "tema-17",
    titulo: "Tema 17: CRISIS DEL SIGLO XVII",
    descripcion: "Crisis económica, social y política de la monarquía hispánica.",
    indice: `Índice del tema 17
1.	El Marco de la Crisis: Depresión Económica y Monetaria
2.	El Ocaso de los Sectores Productivos y el Comercio
3.	Transformación y Fractura de la Organización Social
4.	Tensiones Políticas y las Rebeliones de 1640
5.	El Declive de la Hegemonía Europea
6.	Cultura y Demografía en el Siglo de Oro
7.	El Final de la Dinastía`,
    contenido: `TEMA 17 — CRISIS DEL SIGLO XVII
1. El Marco de la Crisis: Depresión Económica y Monetaria
El siglo XVII se desplegó sobre España y el resto del continente europeo como una sombra prolongada, definiéndose por una profunda depresión económica y demográfica. El Estado se vio atrapado en un laberinto de endeudamiento crónico, destinado a sufragar las incesantes guerras, lo que precipitó una serie de bancarrotas sucesivas arrastradas desde el reinado de Felipe II.
1.1. Alteraciones de la Moneda y sus Consecuencias
En un escenario de asfixia financiera, se optó por realizar agresivas alteraciones monetarias que agravaron la situación:
•	Moneda de vellón: Se sustituyó la valiosa plata por el humilde cobre, reduciendo el valor metálico de la moneda circulante.
•	Inflación galopante: Esta medida provocó un aumento descontrolado de los precios, desestabilizando todos los sectores del reino.

2. El Ocaso de los Sectores Productivos y el Comercio
La inestabilidad económica caló hondo en la estructura productiva, que se vio incapaz de sostener el peso de la corona.
2.1. Agricultura, Ganadería e Industria
•	Decadencia Agraria y Ganadera: Los campos sufrieron una caída en picado de la producción y las actividades ganaderas disminuyeron notablemente.
•	Crisis Textil: La industria textil castellana fue incapaz de competir con la pujante producción de los Países Bajos, hundiéndose definitivamente.
2.2. El Comercio Americano
El flujo comercial con las Indias no pudo actuar como salvavidas debido a dos factores principales:
•	Desvío de Recursos: Los ingresos se utilizaron para costear las guerras europeas en lugar de reinvertirse.
•	Corrupción: Un caldo de cultivo donde el contrabando y la corrupción campaban a sus anchas, mermando los ingresos reales.

3. Transformación y Fractura de la Organización Social
La sociedad del siglo XVII reflejó el descalabro económico, profundizando la brecha entre las clases sociales.
3.1. Clases Menores y Marginalidad
•	Campesinado asfixiado: Atrapados entre malas cosechas, subidas de precios e impuestos, muchos vendieron sus tierras y emigraron.
•	Fenómenos Sociales: Este éxodo rural alimentó el auge del bandolerismo y la mendicidad en caminos y ciudades.
3.2. Las Clases Altas y la Mentalidad Rentista
•	Auge de los Rentistas: Las clases altas urbanas se distanciaron de la producción para invertir en juros (títulos de deuda pública), buscando una seguridad financiera a menudo ilusoria.

4. Tensiones Políticas y las Rebeliones de 1640
Bajo la administración del Conde-Duque de Olivares, el todopoderoso valido de Felipe IV, la ambición centralista chocó con la realidad foral de los territorios peninsulares.
4.1. La Crisis en Cataluña
•	Origen: Malestar por la presión fiscal y los desmanes de los soldados castellanos en la frontera francesa durante la Guerra de los Treinta Años.
•	El "Corpus de Sangre": Sangriento motín en 1640 que incluyó el asesinato del virrey. Cataluña buscó protección en Francia, aunque se reintegró en la monarquía en 1652 manteniendo sus fueros.
4.2. La Independencia de Portugal
•	Causas: Falta de protección efectiva de España ante los ataques de Holanda a las colonias portuguesas en Brasil, Java y las Malucas.
•	Desenlace: Se proclamó rey al Duque de Braganza (Joao IV). España reconoció formalmente su independencia en 1668.

5. El Declive de la Hegemonía Europea
España pasó de ser la potencia indiscutible a presenciar el desmoronamiento de su imperio continental.
5.1. Conflictos y Tratados Decisivos
•	Guerra de los Treinta Años (1618-1648): Iniciada con Felipe III en política pacifista, pero radicalizada con Felipe IV. La intervención de Francia y Holanda cambió el rumbo de la contienda.
•	Paz de Westfalia (1648): Reconocimiento oficial de la independencia de Holanda tras derrotas amargas en Las Dunas y Rocroi.
•	Paz de los Pirineos (1659): Cesión a Francia de los territorios del Rosellón y la Cerdaña.
•	Paz de Nimega (1678): Entrega definitiva del Franco Condado a manos de Luis XIV.

6. Cultura y Demografía en el Siglo de Oro
Paradójicamente, la crisis política coincidió con el mayor esplendor cultural español.
6.1. El Barroco y la Contrarreforma
•	Función Ideológica: El arte Barroco utilizó el dramatismo y la teatralidad como herramientas de la Contrarreforma católica para conmover a un pueblo en crisis.
6.2. Catástrofe Demográfica
•	Causas del Descenso: Guerras, hambrunas y epidemias recurrentes de peste, gripe y viruela.
•	Expulsión de los moriscos (1609): Supuso la pérdida traumática de 300.000 habitantes, afectando gravemente a la economía.

7. El Final de la Dinastía
El siglo concluyó con el reinado agónico de Carlos II. Su falta de descendencia provocó una crisis sucesoria definitiva que desembocaría en una cruenta guerra por el trono español, cerrando la etapa de los Austrias.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Oy0P-8RBI7o",
  },
  {
    slug: "tema-18",
    titulo: "Tema 18: Guerra de Sucesión y Cambio Dinástico",
    descripcion: "Fin de los Austrias y llegada de los Borbones.",
    indice: `Índice del Tema 18
1.	El Fin de la Dinastía de los Austrias y la Crisis Sucesoria
2.	La Guerra de Sucesión (1701–14)
3.	El Cambio de Rumbo y la Resolución Diplomática
4.	El Nuevo Estado Borbónico: Absolutismo y Centralización`,
    contenido: `Tema 18 — Guerra de Sucesión y Cambio Dinástico
1. El Fin de la Dinastía de los Austrias y la Crisis Sucesoria
El año 1700 supuso un punto de no retorno para la monarquía española. El fallecimiento de Carlos II, último representante de la rama española de los Austrias, dejó un trono vacío y un país ante una incertidumbre sucesoria sin precedentes, al morir el monarca sin dejar descendencia.
1.1. Candidatos y Modelos de Estado en Conflicto
La disputa por el trono no fue solo una cuestión de linajes, sino un enfrentamiento entre dos visiones políticas opuestas:
•	Felipe de Anjou: Nieto del rey de Francia y miembro de la dinastía de los Borbones. Representaba el modelo de absolutismo francés, cuya prioridad era la unificación y centralización del territorio bajo una autoridad única.
•	Archiduque Carlos de Austria: Candidato de la Casa de Austria. Su modelo seguía la tradición pactista de los Habsburgo, basada en el respeto a los fueros, las leyes y las administraciones particulares de cada territorio.

2. La Guerra de Sucesión (1701–1714)
Aunque la declaración oficial de guerra se produjo en 1701, el conflicto armado comenzó formalmente en 1702. Esta contienda tuvo una doble vertiente: fue una guerra internacional por el equilibrio de poder en Europa y, simultáneamente, una guerra civil en suelo español.
2.1. El Escenario Internacional: La Gran Alianza
El temor a una hegemonía franco-española llevó a la formación de la Gran Alianza o Alianza de la Haya en 1701. Este bloque estaba integrado por:
•	Sacro Imperio Germánico, Inglaterra y Holanda: Los principales impulsores para frenar a los Borbones.
•	Portugal y Saboya: Reinos que se sumaron a la coalición para evitar el dominio francés en el continente.
2.2. El Escenario Nacional: La Fractura de la Península
En España, las lealtades se dividieron según los intereses y temores regionales:
•	Corona de Castilla: Apoyó mayoritariamente a Felipe V, percibiendo su llegada como una oportunidad de renovación necesaria para el reino.
•	Corona de Aragón: Compuesta por Aragón, Cataluña, Valencia y Mallorca, se decantó por el archiduque Carlos para proteger sus antiguos fueros frente al absolutismo.
•	Provincias Vascas y Navarra: Mantuvieron un apoyo firme a Felipe V, lo que les garantizaría la conservación de sus privilegios en el futuro.

3. El Cambio de Rumbo y la Resolución Diplomática
En 1711, un hecho fortuito cambió la geopolítica del conflicto: la muerte del hermano del archiduque Carlos, que lo convirtió en Emperador de Alemania. Ante el riesgo de un poder excesivo de los Habsburgo, Inglaterra forzó una paz negociada.
3.1. Los Tratados de Utrecht y Rastatt
Estos tratados supusieron el fin de las hostilidades a cambio de un desmembramiento de las posesiones españolas en Europa:
•	Cesiones territoriales a Austria: El ya emperador Carlos recibió Nápoles, Milán y Cerdeña.
•	Cesiones a Saboya: Este reino obtuvo la isla de Sicilia.
•	Ganancias de Inglaterra: Emergió como la gran beneficiada al obtener Menorca y Gibraltar, además de derechos comerciales estratégicos en el Mediterráneo.
Como resultado, Felipe V fue reconocido rey de España tras renunciar a sus derechos al trono francés, consolidando una nueva dinastía y el fin de la hegemonía española.

4. El Nuevo Estado Borbónico: Absolutismo y Centralización
Tras la victoria, se impuso un proceso de asimilación de los territorios rebeldes basándose en el derecho de conquista, aplicado como castigo por la rebelión contra el monarca.
4.1. Los Decretos de Nueva Planta
Estas medidas aplicadas en la Corona de Aragón transformaron la estructura del Estado:
•	Unificación Jurídica: Se eliminaron los consejos y leyes propias de los reinos aragoneses, estableciendo un solo derecho y unas Cortes únicas.
•	Nueva Administración Territorial: El reino se dividió en provincias controladas por Audiencias, Capitanes Generales e Intendentes, quienes aseguraban la ejecución de la voluntad real.
•	Reformas Económicas: Se unificó la Hacienda, se suprimieron las fronteras interiores y se implantó el catastro en Cataluña para equilibrar la contribución tributaria con Castilla.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/nlOgoDUs5_U",
  },
  {
    slug: "tema-18-bis",
    titulo: "Tema 18 bis: América en el siglo XVIII",
    descripcion: "Administración, economía y reformas en la América borbónica.",
    indice: `Índice del Tema 18 bis
1.	La Reorganización Administrativa y el Impulso Borbónico.
2.	El Reformismo de Carlos III y la Segunda Conquista
3.	Transformaciones Económicas y Comercio Atlántico
4.	Estructura Social y Conciencia Americanista
5.	El Camino hacia la Emancipación: Conflictos e Ideología`,
    contenido: `Tema 18 bis — América en el siglo XVIII
1. La Reorganización Administrativa y el Impulso Borbónico
El siglo XVIII representó para la América Hispana un periodo de profunda transformación, marcado por una intensa reactivación económica y administrativa bajo la nueva dinastía borbónica. Tras la Guerra de Sucesión, los Borbones aplicaron en las Indias los principios de centralización y racionalización para convertir el imperio en una maquinaria eficiente, aunque esto sembró el germen del descontento que conduciría a la emancipación.
1.1. Nuevas Entidades Territoriales y de Control
Dada la inmanejable extensión del Virreinato del Perú, se fragmentó el territorio para mejorar la defensa y administración:
•	Virreinato de Nueva Granada (1717): Creado para fortalecer la gestión en la zona norte de Sudamérica.
•	Virreinato del Río de la Plata (1776): Establecido para consolidar el control en el cono sur y proteger intereses comerciales.
•	Las Intendencias: Instituciones de origen francés diseñadas para recortar el poder excesivo de los virreyes y combatir la corrupción local que asfixiaba el sistema administrativo.

2. El Reformismo de Carlos III y la "Segunda Conquista"
Fue bajo el reinado de Carlos III cuando se impulsó con mayor fuerza el programa de modernización defensiva y administrativa, motivado por la presión de potencias rivales como británicos y portugueses. Este periodo es percibido históricamente como una "segunda conquista" debido a la asfixiante presión fiscal y el control administrativo.
2.1. Reformas Políticas, Militares y Religiosas
•	Visitadores generales: Funcionarios como el influyente José de Gálvez en Nueva España, enviados para asegurar el cumplimiento estricto de las leyes.
•	Militarización: Se reforzó el ejército colonial y se permitió, por primera vez, la creación de milicias locales y guarniciones fijas en las fronteras.
•	Regalismo y expulsión de los Jesuitas: La Corona afirmó su autoridad suprema sobre la Iglesia (Regalismo). En 1767, se decretó la expulsión de la Compañía de Jesús, desarticulando el sistema educativo de las élites y las misiones o reducciones.
•	Control Económico: La metrópoli buscó convertir a América en un mercado cautivo, prohibiendo el desarrollo de manufacturas locales para evitar la competencia con España.
2.2. La Ilustración Americana
La cultura se abrió a las nuevas corrientes intelectuales mediante hitos específicos:
•	Expediciones científicas: Investigaciones de gran calado lideradas por figuras como Mutis o Malaspina.
•	Sociedades de Amigos del País: Instituciones creadas para fomentar el desarrollo económico e intelectual bajo el prisma de las Luces.

3. Transformaciones Económicas y Comercio Atlántico
El rígido sistema de flotas y galeones y el monopolio de Sevilla y Cádiz resultaron insuficientes, fomentando el contrabando por parte de ingleses y holandeses. Esto obligó a una apertura comercial y un cambio en el modelo productivo.
3.1. Liberalización y Nuevos Actores Comerciales
•	Compañías Privilegiadas de Comercio: Como la Guipuzcoana de Caracas, destinadas a controlar zonas específicas y combatir el comercio ilícito.
•	Decreto de Libertad de Comercio (1778): Hito que permitió a puertos españoles como Barcelona, Málaga y Valencia comerciar directamente con América.
•	Nuevos Ejes Económicos: Auge de puertos como Buenos Aires o La Habana y el surgimiento de una burguesía comercial.
3.2. Producción y Dependencia
Aunque se mantuvo la minería de plata en Potosí y Zacatecas, ganaron importancia las grandes plantaciones de azúcar, cacao y tabaco. El incipiente liberalismo económico y la fisiocracia cuestionaron el monopolio, generando crecimiento pero aumentando la dependencia de España como mera intermediaria.

4. Estructura Social y Conciencia Americanista
A pesar de la movilidad económica, la sociedad colonial del siglo XVIII se mantuvo como una rígida sociedad de castas donde la mezcla étnica era imparable, pero la ley intentaba separar la "República de Españoles" de la "República de Indios".
4.1. La Pirámide Social de Castas
•	Peninsulares: Situados en la cúspide, ocupaban los altos cargos de Virreyes e Intendentes.
•	Criollos: Dueños de tierras y minas. Poseían el poder económico pero carecían de poder político real, lo que generó una "conciencia americanista" y un sentimiento de exclusión.
•	Mestizos y castas: Grupo creciente de trabajadores urbanos y rurales en el escalón intermedio.
•	Indígenas y esclavos africanos: Base de la pirámide, sujetos a trabajos forzados o esclavitud (especialmente en el Caribe).

5. El Camino hacia la Emancipación: Conflictos e Ideología
Al finalizar el siglo, el aumento de impuestos y el control férreo provocaron estallidos de violencia y la penetración de nuevas ideas revolucionarias.
5.1. Rebeliones y Modelos Inspiradores
•	Independencia de las trece colonias (1776): Sirvió como el primer modelo inspirador para la región.
•	Rebeliones antifiscales: Destacan los Comuneros de Socorro en Nueva Granada y el malestar por el estanco del tabaco.
•	Rebelión de Túpac Amaru II (1780): Levantamiento indígena masivo en el Perú contra los abusos de los corregidores.
5.2. Impacto Ideológico y Catalizador Final
La Revolución Francesa (1789) y la difusión de los Derechos del Hombre y del Ciudadano (traducidos por Antonio Nariño) radicalizaron a los intelectuales. El sistema, ya debilitado, solo necesitó el catalizador externo de la invasión napoleónica de España en 1808 para estallar en guerras abiertas de independencia.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/N90LgNskWcw",
  },
  {
    slug: "tema-19",
    titulo: "Tema 19: Reformas Borbónicas",
    descripcion: "Centralización, administración y modernización del Estado.",
    indice: `Índice del Tema 19
1.	La Transformación del Modelo Político y Administrativo
2.	Reformas Económicas del Despotismo Ilustrado
3.	Reorientación Militar y Defensa del Imperio
4.	Ordenación Territorial y Comercio Transatlántico`,
    contenido: `Tema 19 — Reformas Borbónicas
1. La Transformación del Modelo Político y Administrativo
Tras la convulsa Guerra de Sucesión, la llegada de Felipe V supuso un cambio radical en la gobernanza de España. Se impuso el modelo de absolutismo monárquico francés, donde el rey concentraba todos los poderes del Estado, rompiendo con el anterior modelo pactista de los Austrias. Esta unificación convirtió al Estado en una maquinaria centralizada y eficiente.
1.1. La Centralización del Poder
El hito fundamental de este proceso fue la eliminación de la soberanía compartida mediante herramientas jurídicas y administrativas:
•	Decretos de Nueva Planta: Supusieron la abolición de los fueros e instituciones de la Corona de Aragón como castigo por su rebelión. Únicamente Navarra y las provincias vascas mantuvieron sus derechos históricos por su apoyo al bando borbónico.
•	Secretarías de Despacho: Sustituyeron al antiguo sistema de Consejos. Se establecieron cinco áreas: Estado, Guerra, Marina e Indias, Gracia y Justicia, y Hacienda. Son los antecedentes de los actuales ministerios.
•	Junta Suprema de Estado: Creada a finales de siglo para coordinar a los secretarios, sentando las bases del actual Consejo de Ministros.
1.2. Base Cultural e Ideológica
Para sostener esta arquitectura política, se promovió una uniformidad basada en dos pilares:
•	Lingüística: Se impuso el castellano como lengua oficial en la administración de todo el territorio.
•	Religiosa: Se aplicó el regalismo, doctrina que buscaba el sometimiento de la Iglesia al poder real.

2. Reformas Económicas del Despotismo Ilustrado
La influencia de la Ilustración y el auge del "Despotismo Ilustrado" motivaron una serie de reformas para modernizar las estructuras agrarias y comerciales del país.
2.1. Fiscalidad e Infraestructuras
•	Unificación Fiscal: Se introdujeron impuestos como el Catastro en Cataluña para igualar la carga tributaria con Castilla.
•	Catastro de Ensenada: Ambicioso proyecto que buscaba crear un impuesto único proporcional a la riqueza, aunque no alcanzó un éxito total.
•	Trazado radial de caminos: Planificación de carreteras para conectar la periferia con el centro peninsular y fomentar el comercio interior.
2.2. Fomento Industrial y Financiero
•	Reales Fábricas: Instalaciones estatales (como las de tapices o tabacos) destinadas a producir bienes de lujo para el consumo interno y reducir las importaciones.
•	Banco de San Carlos: Institución fundada para gestionar la deuda pública del Estado.
•	Ley Agraria de Jovellanos: Documento esencial de la época que proponía una reforma profunda en la estructura de la propiedad y el trabajo en el campo español.

3. Reorientación Militar y Defensa del Imperio
La pérdida de posesiones europeas tras el Tratado de Utrecht obligó a España a centrar su estrategia militar en la protección del imperio americano.
3.1. Profesionalización de las Fuerzas Armadas
•	Ejército Permanente: Se estableció por primera vez una fuerza profesional mediante un sistema de cuotas para el servicio militar obligatorio.
•	Marina de Guerra: Recuperación de una flota eficaz para garantizar el comercio transatlántico frente a la piratería británica.
•	Cambio Social en América: La creación de un ejército regular permitió que los criollos accedieran a puestos de mando, alterando el equilibrio social en las colonias.
3.2. Éxitos Internacionales
Gracias al fortalecimiento bélico, España apoyó la independencia de las trece colonias americanas frente a Gran Bretaña, logrando recuperar territorios estratégicos como Menorca y Florida.

4. Ordenación Territorial y Comercio Transatlántico
Se aplicó un modelo de división racional del espacio para asegurar la gobernabilidad y el flujo de recursos.
4.1. El Sistema de Intendencias
El reino se dividió en provincias e intendencias, con tres figuras de autoridad rígidamente controladas por el centro:
1.	Audiencia: Responsable de los asuntos de carácter judicial.
2.	Capitán General: Máxima autoridad en asuntos militares.
3.	Intendente: Encargado de la gestión civil y económica de la demarcación. Nota: En el ámbito municipal, la Corona nombró corregidores para gobernar los ayuntamientos más importantes.
4.2. Reformas en las Indias y Repoblación
•	Nuevos Virreinatos: Creación de los virreinatos de Nueva Granada y del Río de la Plata para mejorar la gestión administrativa en América.
•	Decreto de Libre Comercio: Autorizó el intercambio directo desde trece puertos españoles, eliminando el monopolio de Cádiz y beneficiando a regiones como Cataluña.
•	Repoblación de Sierra Morena: Proyecto para asentar colonos europeos en zonas deshabitadas, destinado a fomentar la agricultura y combatir el bandolerismo en las rutas del sur.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/qsC3QshFVVo",
  },
  {
    slug: "tema-20",
    titulo: "Tema 20: La Ilustración en España",
    descripcion: "Ideas ilustradas, reformismo y cultura del siglo XVIII.",
    comunidadClave: ["navarra"],
    indice: `Índice del tema 20
1.	El Siglo de las Luces: Marco Teórico e Ideológico
2.	El Reformismo Ilustrado y el Modelo Político
3.	Transformaciones Económicas y Obstáculos Agrarios
4.	Sociedad: Fractura, Estamentos y Tensiones
5.	Cultura y Educación: El Instrumento de Cambio`,
    contenido: `Tema 20 — La Ilustración en España
1. El Siglo de las Luces: Marco Teórico e Ideológico
El siglo XVIII se introduce en la historia de España bajo la denominación del «Siglo de las Luces». Este periodo estuvo marcado por una corriente intelectual europea cuya determinación era sacar a la sociedad de las «tinieblas» mediante el uso de la luz de la razón.
Este movimiento, conocido como la Ilustración, se desarrolló con especial fuerza bajo los reinados de Fernando VI y, de manera más profunda, de Carlos III. En este escenario, la cultura y la ideología se reconfiguraron estableciendo los siguientes pilares:
•	La Razón como motor absoluto: El culto a la inteligencia y a la lógica se impuso frente a la superstición.
•	Búsqueda de la felicidad: Se defendió que la finalidad última del ser humano es la felicidad, meta alcanzable solo a través del conocimiento científico y la mejora de las condiciones de vida.
•	Particularismo Español: A diferencia de la corriente francesa, la Ilustración española se caracterizó por ser:
o	Moderada: Protegida por la propia monarquía.
o	Religiosa: Reacia a romper con la religión católica, buscando hacer compatible el racionalismo con las creencias cristianas.
•	Minoría Reformista: Surgió una élite intelectual conformada por figuras como Jovellanos, Campomanes y el padre Feijoo, cuyas ideas de reforma chocarían con las estructuras del Antiguo Régimen.

2. El Reformismo Ilustrado y el Modelo Político
El impulso transformador de la época se materializó en el Reformismo Ilustrado, ejecutado bajo el modelo del Despotismo Ilustrado. Este sistema se sintetiza en el célebre lema: «Todo para el pueblo, pero sin el pueblo».
2.1. El Reinado de Carlos III (1759-1788)
El monarca Carlos III fue el máximo representante de este modelo, utilizando su poder absoluto para modernizar el país. Para ello, se rodeó de ministros eficaces como Esquilache, Campomanes y Floridablanca.
2.2. El Regalismo y el Conflicto con la Iglesia
Una de las medidas políticas clave fue el regalismo, mediante el cual la Corona reafirmó su autoridad sobre la Iglesia. Este proceso tuvo sus hitos más relevantes en:
•	Expulsión de los Jesuitas (1767): Fueron expulsados tras ser acusados de instigar revueltas y de mantener una obediencia directa al Papa antes que al Rey.

3. Transformaciones Económicas y Obstáculos Agrarios
El objetivo central de las reformas económicas fue el progreso y la modernización de las estructuras productivas y comerciales del reino.
3.1. Comercio e Industria
•	Liberalización comercial (1778): Se rompió el monopolio que Cádiz mantenía con América, permitiendo el despegue económico de la periferia, especialmente de Cataluña.
•	Reales Fábricas: Creación de industrias nacionales para producir cristales, tapices y porcelana. Su fin era abastecer a la corte y reducir las importaciones extranjeras.
3.2. El Problema Agrario
A pesar de los avances en infraestructuras, las reformas agrarias proyectadas se detuvieron debido a:
•	La oposición de la nobleza y el clero.
•	La propiedad de la tierra, mayoritariamente inmovilizada en manos de estos estamentos privilegiados.

4. Sociedad: Fractura, Estamentos y Tensiones
La sociedad del siglo XVIII presentaba una división crítica entre una mayoría analfabeta y tradicional, y una élite preocupada por el atraso respecto a Europa.
•	Privilegios Estamentales: La nobleza y el clero mantenían sus privilegios, aunque fueron criticados por los ilustrados por su ociosidad y la acumulación de tierras en las llamadas «manos muertas».
•	Crisis de subsistencia: El pueblo llano sufría debido a la subida del precio del trigo, generando inestabilidad social.
4.1. Medidas de Transformación Social
Para modernizar la mentalidad productiva, se tomaron medidas drásticas:
•	Dignificación del trabajo: Carlos III promulgó un decreto declarando «honestos» los oficios manuales, eliminando la deshonra social que impedía a la nobleza participar en la economía.
•	Repoblación de Sierra Morena: Intento de crear una nueva clase de propietarios agrícolas trayendo colonos europeos para cultivar tierras baldías y asegurar los caminos.
4.2. El Motín de Esquilache (1766)
Fue el momento de mayor tensión, provocado por una mezcla de hambre generalizada y el rechazo a medidas de modernización (como la prohibición de las capas largas y los sombreros de ala ancha). Resultó en la destitución del ministro Esquilache y la bajada de precios de alimentos básicos.

5. Cultura y Educación: El Instrumento de Cambio
Para los ilustrados, la educación era el pilar esencial para transformar España y mejorar la productividad económica.
5.1. Instituciones y Academias
Bajo el patrocinio real, se impulsaron organismos para normalizar y difundir el conocimiento:
•	Instituciones Científicas: Destaca la expedición de Malaspina, un viaje científico y político por las posesiones de América y Asia.
•	Reales Academias: Se fundaron las de la Lengua, la Historia y las Bellas Artes.
•	Sociedades Económicas de Amigos del País: Grupos locales que proponían mejoras técnicas para la agricultura y la industria de sus provincias.
5.2. Reforma Universitaria y el Fin de la Era
Se intentó orientar la universidad hacia las ciencias útiles (matemáticas, física y náutica), alejándola del control eclesiástico. Sin embargo, este proceso se vio truncado:
•	Revolución Francesa (1789): El temor al contagio revolucionario provocó el cierre de fronteras, conocido como «cordón sanitario», paralizando las reformas ilustradas.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/gNWLphzTP5I",
  },
  {
    slug: "tema-21",
    titulo: "Tema 21: La Guerra de Independencia",
    descripcion: "Invasión napoleónica, resistencia y consecuencias.",
    indice: `Índice del Tema 21
1.	El Reinado de Carlos IV y el Impacto de la Revolución Francesa
2.	El Despotismo Ministerial y la Crisis de la Corona
3.	Contexto Socioeconómico y Cultural
4.	La Invasión Napoleónica y la Quiebra de la Soberanía
5.	El Levantamiento Popular y la Guerra de Independencia
6.	Desarrollo de la Guerra y Labor Legislativa
7.	Consecuencias y el Regreso al Absolutismo`,
    contenido: `Tema 21 — La Guerra de Independencia
1. El Reinado de Carlos IV y el Impacto de la Revolución Francesa
El reinado de Carlos IV, que se extendió entre 1788 y 1808, estuvo marcado por el estallido de la Revolución Francesa en 1789. Este evento obligó a la monarquía a realizar un giro drástico en su estrategia internacional, pasando de la prevención al conflicto abierto.
1.1. Evolución de la Política Exterior
La respuesta española ante los sucesos en Francia se dividió en tres fases críticas:
•	Prevención y Cierre: Inicialmente, el Estado aplicó un férreo cierre de fronteras para evitar el «contagio» revolucionario de los Pirineos.
•	Confrontación: España entró en guerra abierta contra la Francia convencional.
•	Alianza: Tras la derrota de las tropas españolas, se produjo un vuelco absoluto, buscando la alianza con Francia para enfrentar a Inglaterra, el enemigo común.

2. El Despotismo Ministerial y la Crisis de la Corona
Durante esta etapa, el poder no se ejerció de forma tradicional, sino mediante el valimiento. Aunque se mantuvieron ministros de la etapa anterior como Floridablanca y Aranda, el protagonismo recayó en una nueva figura.
2.1. El Ascenso de Manuel Godoy
El nombramiento de Manuel Godoy, un plebeyo, como hombre de confianza del rey, desató tensiones internas profundas:
•	Oposición Estamental: Generó el rechazo de la nobleza y el clero.
•	Conflicto Dinástico: El príncipe heredero, Fernando, encabezó la oposición a través del llamado «partido fernandino».
2.2. El Motín de Aranjuez
La debilidad de la Corona culminó en marzo de 1808 con el Motín de Aranjuez. Este levantamiento forzó dos hechos históricos:
1.	La destitución de Manuel Godoy.
2.	La abdicación de Carlos IV en favor de su hijo, Fernando VII.

3. Contexto Socioeconómico y Cultural
La organización social del periodo reflejaba un descontento generalizado. La aristocracia y el clero instrumentalizaron al pueblo para ensalzar a Fernando VII como «el Deseado», presentándolo como el único capaz de regenerar la nación.
3.1. La Crisis de la Hacienda Real
Las arcas públicas se encontraban en una situación de quiebra debido a las constantes guerras y la interrupción del comercio americano. Esto obligó a Godoy a tomar medidas desesperadas:
•	Aumento de impuestos: Incremento de la presión fiscal sobre la población.
•	Primeras desamortizaciones: Ventas de bienes eclesiásticos que le granjearon la enemistad de la Iglesia.
3.2. Dualidad Cultural
En el plano ideológico, convivían dos corrientes en conflicto: las luces de la Ilustración (que penetraban pese a la censura) y el inmovilismo tradicionalista. Esta decadencia y tensión social fueron retratadas magistralmente por Francisco de Goya.

4. La Invasión Napoleónica y la Quiebra de la Soberanía
La fractura en la familia real fue aprovechada por Napoleón Bonaparte para integrar a España en su sistema imperial.
4.1. El Camino a la Ocupación
•	Tratado de Fontainebleau (1807): Firmado entre Napoleón y Godoy, permitía el paso de tropas francesas por suelo español para castigar a Portugal por no respetar el bloqueo contra Gran Bretaña.
•	Abdicaciones de Bayona: Napoleón obtuvo la renuncia al trono de Carlos IV y Fernando VII, entregando la corona a su hermano, José I Bonaparte.
4.2. El Modelo de José I
El nuevo monarca intentó implantar un reformismo autoritario basado en el Estatuto de Bayona, una carta otorgada que buscaba eliminar privilegios, aunque su aplicación fue limitada por el conflicto bélico.

5. El Levantamiento Popular y la Guerra de Independencia
La sociedad se dividió ante la ocupación francesa en dos bandos irreconciliables: los afrancesados (minoría intelectual a favor de la modernización) y los patriotas (la mayoría, opuesta al invasor por religión y dinastía).
5.1. El Estallido del Conflicto
La presencia de 250.000 soldados franceses, mantenidos mediante requisas, agravó la miseria. El desprecio al «rey intruso» (Pepe Botella) y la brutalidad de la ocupación provocaron el levantamiento del 2 de mayo de 1808 en Madrid, extendiéndose por todo el país.
5.2. Formas de Resistencia y Organización Política
Ante el vacío de poder, surgió el concepto de Soberanía Nacional, articulado a través de:
•	Juntas Locales y Provinciales: El pueblo asumió la autoridad.
•	La Guerrilla: Civiles armados como «El Empecinado» desgastaban al enemigo mediante ataques sorpresa.
•	Los Sitios: Resistencia extrema de ciudades como Zaragoza y Gerona.

6. Desarrollo de la Guerra y Labor Legislativa
El conflicto se convirtió en una guerra internacional, enfrentando a Francia contra una coalición de españoles, portugueses y británicos (liderados por el general Wellington).
6.1. Fases de la Contienda
La guerra atravesó tres etapas diferenciadas:
1.	Éxitos iniciales: Marcada por la victoria española en la batalla de Bailén (1808).
2.	Hegemonía francesa: Intervención directa de la «Grande Armée» de Napoleón.
3.	Ofensiva final: Aprovechando el fracaso francés en Rusia (1812), la alianza anglo-española forzó la retirada gala, sellada en el Tratado de Valençay (1813).
6.2. Las Cortes de Cádiz
En el bando patriota, la Junta Suprema Central dio paso a una Regencia que convocó las Cortes de Cádiz. Su labor culminó en la Constitución de 1812 («La Pepa»), hito del liberalismo mundial.

7. Consecuencias y el Regreso al Absolutismo
El conflicto concluyó formalmente en 1814 con el regreso de Fernando VII, dejando tras de sí una nación devastada y una profunda crisis demográfica (cerca de medio millón de muertos).
7.1. Impacto de la Posguerra
•	Economía y Territorio: Destrucción de campos e industria, bancarrota absoluta y pérdida de los recursos de las colonias americanas, que iniciaron su independencia (completada hacia 1824).
•	Cultura: Un expolio artístico masivo, documentado en la serie «Los desastres de la guerra» de Goya.
•	Política: Restauración del absolutismo por parte de Fernando VII, quien traicionó el espíritu de Cádiz e inició una era de persecución y pronunciamientos militares.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/B-MlID3irTI",
  },
  {
    slug: "tema-22",
    titulo: "Tema 22: Las Cortes de Cádiz y la Constitución de 1812",
    descripcion: "Nacimiento del liberalismo político español.",
    indice: `Índice del tema 22
1.	El Vacío de Poder y la Convocatoria a Cortes
2.	Composición Social y Corrientes Ideológicas en Cádiz
3.	Pilares del Liberalismo Español
4.	La Constitución de 1812: La Pepa
5.	El Regreso de Fernando VII y el Legado de Cádiz`,
    contenido: `Tema 22 — Las Cortes de Cádiz y la Constitución de 1812
1. El Vacío de Poder y la Convocatoria a Cortes
Tras las abdicaciones de Bayona y el inicio de la Guerra de Independencia, España se sumergió en un profundo vacío de poder. Las instituciones del Antiguo Régimen se mostraron paralizadas e incapaces de gestionar la ocupación francesa, lo que forzó la aparición de nuevas formas de organización.
1.1. Evolución de la Autoridad (1808-1810)
La autoridad fue asumida de manera ascendente a través de las siguientes etapas:
•	Juntas locales y provinciales: Primeros órganos de resistencia que asumieron la soberanía ante la ausencia del monarca.
•	Junta Suprema Central (1808): Organismo que unificó el mando de las juntas provinciales para coordinar la guerra y el gobierno.
•	Refugio en Cádiz: Ante el imparable avance de las tropas de Napoleón, la Junta se refugió en Cádiz, ciudad protegida por la flota británica.
•	La Regencia: Tras mostrarse incapaz de dirigir el rumbo bélico, la Junta traspasó sus poderes a una Regencia, la cual tomó la decisión de convocar elecciones.
1.2. Un Nuevo Modelo de Cortes
En 1810, se produjo un hito jurídico fundamental: las Cortes no se articularon según el modelo tradicional por estamentos (nobleza, clero y estado llano), sino que se constituyeron como una asamblea única. En este nuevo formato, cada diputado poseía un voto, lo que representó un triunfo decisivo para los intereses de los liberales.

2. Composición Social y Corrientes Ideológicas en Cádiz
La ciudad de Cádiz se convirtió en un enclave comercial próspero y un laboratorio de ideas. Mientras el país estaba arruinado por la guerra, en este puerto la libertad de ideas empapó la mentalidad de los diputados.
2.1. Composición de las Cortes
La representación en las Cortes reflejó una realidad social emergente, destacando los siguientes grupos:
•	Burguesía: Actuó como el verdadero grupo motor del cambio y la modernización.
•	Clases Medias e Intelectuales: Abundaban los eclesiásticos, funcionarios, abogados, militares e intelectuales.
•	Nobleza y Alto Clero: Se vieron relegados a una representación mucho menor que en épocas pasadas, perdiendo su hegemonía tradicional.
2.2. Las Tres Corrientes Ideológicas
Dentro de las Cortes se enfrentaron tres visiones claramente diferenciadas sobre el futuro de España:
1.	Liberales: Defensores de reformas radicales y de un cambio estructural profundo.
2.	Absolutistas (apodados «serviles»): Partidarios de mantener intacto el antiguo orden y los privilegios.
3.	Jovellanistas: Seguidores de las ideas de Jovellanos, que abogaban por una reforma moderada basada en el modelo inglés.
La apertura oficial en septiembre de 1810 marcó el inicio de la revolución liberal al proclamar que la soberanía residía en la nación y no en el monarca.

3. Pilares del Liberalismo Español
El liberalismo nacido en Cádiz se nutrió de la Ilustración y el ejemplo de la Revolución Francesa, adaptándolos a la resistencia contra Napoleón. Este modelo transformó a los antiguos «súbditos» en «ciudadanos» legales.
3.1. Organización del Poder
Se establecieron principios fundamentales para desarticular el absolutismo:
•	Soberanía Nacional: El poder emana del pueblo y no de una concesión divina.
•	División de Poderes: Un sistema de contrapesos para evitar la tiranía:
o	Poder Legislativo: Reside en las Cortes junto con el Rey.
o	Poder Ejecutivo: Corresponde exclusivamente al Rey.
o	Poder Judicial: En manos de tribunales independientes.
3.2. Reformas Sociales y Económicas
•	Igualdad Jurídica: Eliminación de los privilegios estamentales de la nobleza y el clero; todos son iguales ante la ley.
•	Liberalización Económica: Defensa de la propiedad privada y libertad de empresa. Se buscó demoler trabas feudales como los gremios, las aduanas interiores y el régimen señorial.
•	Libertad de Imprenta (1810): Pilar ideológico clave para el debate político, aunque con el matiz de mantener la censura en temas religiosos para evitar la ruptura total con la Iglesia.

4. La Constitución de 1812: «La Pepa»
El fruto más brillante fue la Constitución de 1812, promulgada el 19 de marzo (festividad de San José). Fue una de las cartas magnas más extensas del mundo y estableció una monarquía moderna, hereditaria y parlamentaria.
4.1. Características Técnicas y Derechos
•	Limitación del Monarca: El Rey dejó de ser la fuente de poder para ser un órgano constitucional limitado por las leyes.
•	Sufragio: Se instauró el sufragio universal masculino indirecto para varones mayores de 25 años.
•	Unidad Territorial: Se unificaron los derechos de los españoles de ambos hemisferios (Península y América).
•	Confesionalidad: En un gesto hacia el clero, se declaró al Estado como confesionalmente católico, prohibiendo cualquier otra religión.
4.2. Medidas Rompedoras
•	Acceso al Empleo Público: Eliminación de las pruebas de nobleza para acceder a cargos.
•	Educación: Creación de una educación primaria pública y universal.
•	Fiscalidad y Mercado: Reforma fiscal y creación de un mercado nacional unificado.
•	Abolición de Instituciones: Fin de los señoríos jurisdiccionales y de la Inquisición.

5. El Regreso de Fernando VII y el Legado de Cádiz
La labor de Cádiz se desarrolló en una "burbuja" aislada por la guerra. Cuando Fernando VII regresó en 1814, la situación cambió drásticamente hacia una reacción absolutista.
5.1. El Retorno al Absolutismo (1814)
Mediante el Decreto de Valencia en mayo de 1814, el monarca:
•	Declaró nulos la Constitución y los decretos de las Cortes.
•	Restauró el modelo estamental y frenó las reformas económicas.
•	Inició una persecución que llevó a los liberales al encarcelamiento o al exilio (principalmente a Londres y París).
5.2. Consecuencias y Significado Histórico
A pesar de la represión y la agravada crisis de la Hacienda, el legado de Cádiz fue imparable:
•	Referente de libertad: La Constitución fue restablecida durante el Trienio Liberal (1820-1823).
•	Ruptura irreversible: La semilla del constitucionalismo marcó el rumbo del siglo XIX.
•	Impacto Exterior: Impulsó indirectamente la independencia de las colonias americanas, proceso que culminó hacia 1824.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/3id7T6-QpVg",
  },
  {
    slug: "tema-23",
    titulo: "Tema 23: Fernando VII y el absolutismo",
    descripcion: "Restauración absolutista, liberalismo y conflicto político.",
    indice: `Índice del tema 23
1.	El Retorno al Absolutismo (1814-1820)
2.	El Trienio Liberal (1820-1823)
3.	La Década Ominosa (1823-1833)
4.	La Crisis Sucesoria y el Nacimiento del Carlismo`,
    contenido: `Tema 23 — Fernando VII y el absolutismo
1. El Retorno al Absolutismo (1814-1820)
El proceso se inicia con la firma del Tratado de Valençay en 1813, documento mediante el cual un Napoleón debilitado reconoce a Fernando VII como monarca legítimo. A su regreso en 1814, el Rey se encuentra con un país dividido entre el constitucionalismo de Cádiz y el anhelo del Antiguo Régimen.
1.1. El Golpe de Estado de Mayo
Alentado por el Manifiesto de los Persas, presentado por diputados absolutistas, el monarca opta por la vía autoritaria:
•	Decreto de Valencia (4 de mayo de 1814): Acto legislativo que anula toda la obra de las Cortes de Cádiz.
•	Restauración Institucional: Se reinstauran el poder absoluto, las viejas instituciones y la Inquisición.
•	Represión: Inicio de una persecución sistemática contra los sectores liberales.
1.2. Crisis Económica y Social
La reconstrucción de la sociedad estamental permitió recuperar privilegios a la nobleza y al clero, pero el país se hallaba en una situación crítica:
•	Colapso Productivo: Agricultura e industria arrasadas por la guerra.
•	Quiebra de la Hacienda Real: Provocada por los gastos bélicos y el cese del flujo de metales preciosos debido a los movimientos independentistas en América.
•	Censura y Oposición: Se impuso una censura férrea contra ideas «heréticas», lo que derivó en constantes pronunciamientos militares liberales que fracasaron hasta el éxito de 1820.

2. El Trienio Liberal (1820-1823)
En 1820, el coronel Rafael del Riego se subleva en Cabezas de San Juan con las tropas destinadas a América. Este éxito obliga a Fernando VII a jurar la Constitución de 1812, iniciando un periodo de recuperación de libertades.
2.1. División del Liberalismo
La inestabilidad del periodo se vio agravada por la fractura interna del bando liberal:
•	Moderados (doceañistas): Partidarios de reformas suaves y de colaborar con la Corona.
•	Exaltados (veinteañistas): Defensores de la aplicación radical y rigurosa de la Constitución.
2.2. Obra Legislativa y Oposición
Durante estos tres años se intentó desmantelar el feudalismo mediante diversas medidas:
•	Reformas Socioeconómicas: Supresión de señoríos y gremios, expulsión de los jesuitas y desvinculación de los mayorazgos para dinamizar el mercado de tierras.
•	Desamortización y Fiscalidad: Se retomó la venta de bienes eclesiásticos y una reforma fiscal que, al exigir pagos en moneda, provocó la oposición del campesinado.
•	Fin del Periodo: Mientras las sociedades patrióticas debatían, el Rey conspiraba con la Santa Alianza. En 1823, la invasión de los Cien Mil Hijos de San Luis restauró el absolutismo.

3. La Década Ominosa (1823-1833)
Este periodo se caracteriza por una represión mucho más feroz que la de 1814, destinada a anular cualquier vestigio del Trienio Liberal.
3.1. Aparato Represivo y Ejecuciones
•	Juntas de Fe: Instituciones creadas para sustituir a la Inquisición en la vigilancia ideológica.
•	Mártires Liberales: Ejecución de figuras simbólicas como Rafael del Riego, Mariana Pineda y el general Torrijos (fusilado en Málaga en 1831).
•	Depuración y Exilio: Expulsión masiva de funcionarios y militares, generando un exilio hacia Londres y París que conectó a los intelectuales con el romanticismo europeo.
3.2. Reformas Técnicas y Conflictos Internos
A pesar del absolutismo, la bancarrota forzó al Rey a adoptar medidas de modernización administrativa:
•	Innovaciones Administrativas: Creación del Consejo de Ministros, el presupuesto general del Estado y el Código de Comercio.
•	Surgimiento de los "Apostólicos": Absolutistas radicales (ultras) que rechazaban estas reformas y se agruparon en torno al infante Carlos María Isidro.
•	Pérdida del Imperio: Tras la batalla de Ayacucho (1824), España pierde definitivamente sus colonias americanas.

4. La Crisis Sucesoria y el Nacimiento del Carlismo
El final del reinado estuvo marcado por la falta de descendencia masculina tras tres matrimonios, situación que cambió en 1829 al casar con María Cristina de Borbón.
4.1. El Conflicto Legal
•	Pragmática Sanción: Promulgada para anular la Ley Sálica, permitiendo que su hija, la futura Isabel II, pudiera reinar.
•	Apartamiento de Carlos: Esta medida privó de la sucesión al hermano del Rey, Carlos María Isidro, detonando la fractura del país.
4.2. Los Bandos en Conflicto
La disputa dinástica escondía una división social y profunda:
•	Carlistas: Defensores del absolutismo puro y la tradición bajo el lema «Dios, Patria y Rey». Apoyados mayoritariamente por el mundo rural.
•	Isabelinos (o cristinos): Partidarios de Isabel II que, por necesidad de supervivencia, se aliaron con los liberales moderados a cambio de promesas de reforma.
4.3. Final del Reinado (1833)
A la muerte de Fernando VII en 1833, el enfrentamiento entre Tradición y Progreso estalla en la Primera Guerra Carlista, marcando el fin definitivo del absolutismo y el inicio de la construcción del Estado liberal.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/dTRW3Ouplj4",
  },
  {
    slug: "tema-23-bis",
    titulo: "Tema 23 bis: La revolución industrial en España",
    descripcion: "Industrialización, transportes y cambios económicos.",
    indice: `Índice del tema 23 bis
1.	El Modelo de Industrialización Española: Un Proceso Singular
2.	Obstáculos Estructurales y Políticos
3.	Los Focos Periféricos: Cataluña y el País Vasco
4.	Minería, Energía y Dependencia Exterior
5.	El Ferrocarril: Símbolo de una Era
6.	Transformación Social y Nacimiento del Movimiento Obrero`,
    contenido: `Tema 23 bis — La revolución industrial en España
1. El Modelo de Industrialización Española: Un Proceso Singular
A diferencia de la efervescencia que sacudió al resto del continente, España se adentró en la Revolución Industrial a través de un camino marcado por una industrialización tardía, incompleta y profundamente desequilibrada en términos regionales. No fue un estallido uniforme, sino una transformación lastrada por la debilidad de un mercado interior raquítico y una crónica escasez de capitales.
1.1. Factores de Retraso Inicial
El inicio del siglo XIX fue crítico para el desarrollo económico debido a dos factores traumáticos:
•	Destrucción bélica: El país emergió de la Guerra de Independencia con su economía literalmente destruida.
•	Pérdida de las colonias americanas: Este suceso eliminó de raíz los ingresos y la inversión inicial que cualquier industria requiere para nacer.

2. Obstáculos Estructurales y Políticos
El desarrollo industrial se vio frenado por una inestabilidad constante que ahuyentaba los proyectos a largo plazo. Los elementos clave de este bloqueo fueron:
•	Inestabilidad política: Las Guerras Carlistas y los incesantes pronunciamientos militares sembraron una desconfianza generalizada en los inversores.
•	Fracaso de las reformas agrarias: Las Desamortizaciones de Mendizábal y Madoz no lograron crear una clase media. En su lugar, reforzaron el latifundismo tradicional, impidiendo que el campo generara capital para la industria.
•	Mentalidad de la oligarquía: La élite terrateniente mantenía una mentalidad rentista heredada del Antiguo Régimen, despreciando el riesgo empresarial y el trabajo manual en favor de la seguridad de la tierra.
•	Deficiencias del mercado: Un mercado nacional mal articulado por una orografía difícil y falta de transportes, lo que alimentó el debate entre el proteccionismo y el librecambismo.
Como consecuencia, la industria no fue un manto uniforme, sino un conjunto de «manchas de aceite»: puntos aislados de modernidad rodeados por un inmenso mar agrícola.

3. Los Focos Periféricos: Cataluña y el País Vasco
La modernización se concentró en los márgenes geográficos del país, donde el contacto con Europa y la tradición comercial permitieron liderar el cambio.
3.1. Cataluña y el Sector Textil
La burguesía industrial catalana fue el motor del cambio, caracterizándose por:
•	Presión política: Exigencia de aranceles proteccionistas al gobierno central para defender el sector textil algodonero de la competencia de las fábricas inglesas.
•	Colonias industriales: Establecimientos a orillas de los ríos para aprovechar la energía hidráulica, lo que propició la aparición del proletariado moderno.
3.2. El País Vasco y la Siderurgia
La especialización siderúrgica vasca se consolidó mediante un intercambio vital: exportar el hierro de sus minas a cambio del carbón de alta calidad de Gales.
Nota Histórica: Este dinamismo alimentó el surgimiento del catalanismo y el nacionalismo vasco como respuesta ideológica para defender sus intereses frente a un Estado central eminentemente agrario.

4. Minería, Energía y Dependencia Exterior
El subsuelo español era rico, pero su gestión profundizó la dependencia de potencias extranjeras.
4.1. La Desamortización del Subsuelo
Asfixiado por la deuda pública, el Estado promulgó la Ley de Minas de 1868, cediendo la explotación de yacimientos como Riotinto o Almadén a compañías inglesas y francesas.
•	Resultado: España se convirtió en exportadora de materias primas e importadora de manufacturas (economía dependiente).
•	Consecuencia social: Condiciones infrahumanas en las cuencas mineras y primeros focos de protesta obrera.
4.2. El Problema Energético
El desarrollo se vio frenado por la baja calidad del carbón nacional (principalmente de Asturias), que era caro de extraer, obligando a la siderurgia a depender de las importaciones.

5. El Ferrocarril: Símbolo de una Era
El ferrocarril fue la herramienta definitiva para civilizar el interior, aunque su implementación tuvo luces y sombras.
•	Marco Legal: La Ley de Ferrocarriles de 1855 permitió la entrada de capitales extranjeros de figuras como los hermanos Péreire o los Rothschild.
•	Estructura Radial: Se diseñó con centro en Madrid y un ancho de vía distinto al europeo, dificultando la conexión entre zonas industriales como el eje Bilbao-Barcelona.
•	Impacto Económico: Abarató el transporte masivo de trigo y minerales y facilitó las migraciones internas, aunque a menudo el tren llegó antes que la propia industria.

6. Transformación Social y Nacimiento del Movimiento Obrero
El paso de una sociedad estamental a una de clases fue traumático y generó una fractura social profunda.
6.1. Urbanización y Condiciones de Vida
•	Contraste Urbano: Los elegantes ensanches burgueses frente a barrios obreros marcados por el chabolismo y la falta de higiene.
•	Explotación Laboral: El trabajo infantil y femenino con salarios inferiores era la norma, mientras los beneficios se concentraban en pocas manos.
6.2. Organizaciones Obreras e Ideologías
Esta fractura propició el nacimiento del movimiento obrero organizado:
•	FTRE: Organización de corte anarquista, con gran calado en el campo andaluz y las fábricas catalanas.
•	PSOE y UGT: Fundados a finales de siglo bajo la ideología marxista.
6.3. Reflejo Cultural
El realismo y el naturalismo literario pusieron rostro a esta miseria social a través de autores como:
•	Benito Pérez Galdós.
•	Emilia Pardo Bazán.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/NEvGm-3PxNA",
  },
  {
    slug: "tema-24",
    titulo: "Tema 24: CONSTRUCCIÓN DEL ESTADO LIBERAL (1833-1868)",
    descripcion: "Reinado de Isabel II y consolidación del liberalismo.",
    comunidadClave: ["andalucia"],
    indice: `Índice del tema 24
1.	El Conflicto Sucesorio y la Ruptura Dinástica
2.	Bases Sociales y Consecuencias de la Guerra
3.	Las Reformas Agrarias: Desamortizaciones y Concordato
4.	Estructura Política y Modernización Administrativa
5.	Transformación Social y Fin de la Monarquía`,
    contenido: `TEMA 24 — CONSTRUCCIÓN DEL ESTADO LIBERAL (1833-1868)
1. El Conflicto Sucesorio y la Ruptura Dinástica
Tras la muerte de Fernando VII en 1833, España se enfrentó a un vacío de mando firme que derivó en una fractura nacional. El problema sucesorio fue el detonante de un choque ideológico entre dos visiones del Estado: el absolutismo recalcitrante y el liberalismo emergente.
1.1. La Primera Guerra Carlista (1833-1840)
El conflicto se originó cuando Carlos María Isidro reclamó el trono frente a la heredera Isabel II, invocando la antigua Ley Sálica. Esta guerra atravesó tres etapas fundamentales:
•	Fase de Estabilización: Bajo el mando del general Zumalacárregui, los focos insurgentes carlistas lograron consolidarse.
•	Fase de Expediciones: Destacan las incursiones carlistas hacia Madrid, siendo la más relevante la Expedición Real.
•	Fase de División y Finalización: La fractura interna en el bando carlista permitió la firma del Convenio de Vergara en 1839, poniendo fin al conflicto principal en 1840.
1.2. El Segundo Conflicto (1846-1849)
Años más tarde, se produjo una segunda guerra de menor escala centrada en Cataluña. El motivo fue el fracaso del proyecto matrimonial entre Isabel II y el pretendiente carlista de aquel momento.

2. Bases Sociales y Consecuencias de la Guerra
La guerra civil del siglo XIX no fue solo dinástica, sino que definió claramente los apoyos sociales y las estructuras de poder futuras.
2.1. Los Bandos en Conflicto
•	Isabelinos: Conformado por la alta nobleza, la burguesía, las clases medias urbanas y el ejército.
•	Carlistas: Respaldado por la pequeña nobleza rural, el bajo clero y el campesinado del norte (País Vasco, Navarra, Cataluña y Aragón), quienes veían en el centralismo liberal una amenaza a su estilo de vida.
2.2. Ideología y Legado Político
Bajo el lema «Dios, Patria, Fueros y Rey», los carlistas defendieron el absolutismo y los fueros territoriales. Como consecuencia de la intensidad de la guerra:
•	La economía se vio asfixiada, obligando a medidas fiscales extremas.
•	Surgieron los «espadones» (militares), quienes se convirtieron en los árbitros de la vida política española.

3. Las Reformas Agrarias: Desamortizaciones y Concordato
Para financiar la guerra contra el carlismo y modernizar la economía, el Estado liberal emprendió la desarticulación de las tierras en «manos muertas» (propiedades que no se podían vender ni comprar).
3.1. Hitos Legislativos
•	Desamortización de Mendizábal (1836): Dirigida contra los bienes del clero regular (monasterios) y el clero secular.
•	Desamortización General de Madoz (1855): Afectó a los bienes eclesiásticos restantes y, fundamentalmente, a los bienes propios y comunes de los municipios.
3.2. Impacto Socioeconómico
Estas medidas permitieron financiar infraestructuras como el ferrocarril y sanear la deuda, pero tuvieron efectos colaterales:
1.	Perjuicio al campesinado: Perdieron el uso de tierras comunales.
2.	Nueva clase terrateniente: La burguesía y la aristocracia compraron las tierras, reforzando su apoyo al régimen isabelino.
3.	Relación con la Iglesia: Se produjo una ruptura que solo se suavizó con el Concordato de 1851, donde el Estado se comprometió a sostener el culto y el clero.

4. Estructura Política y Modernización Administrativa
El reinado de Isabel II fue una transición viciada por el fraude electoral, el sufragio censitario (solo votaba entre el 0,15% y el 5% de la población) y los pronunciamientos militares.
4.1. Etapas del Reinado
La política isabelina se dividió en periodos de diferente signo ideológico:
•	Regencias iniciales.
•	Década Moderada.
•	Bienio Progresista.
•	Unión Liberal.
4.2. Dualidad de Modelos Políticos
Modelo Moderado:  Soberanía compartida (Rey y Cortes). Estado confesional y orden público. Creación de la Guardia Civil (1844).
Modelo Progresista: Soberanía nacional. Mayores libertades individuales. Apoyo en la Milicia Nacional.

4.3. Avances del Estado
En este periodo se impulsó la unificación y modernización del país mediante:
•	El sistema métrico decimal (unificación de pesos y medidas).
•	La reforma fiscal Mon-Santillán (1845) basada en la igualdad y proporcionalidad.
•	La Ley de Ferrocarriles de 1855.

5. Transformación Social y Fin de la Monarquía
La antigua sociedad estamental desapareció, dando paso a una sociedad de clases basada en la riqueza y no en el privilegio de nacimiento.
5.1. La Nueva Jerarquía Social
•	Élite: Burguesía de negocios y aristocracia terrateniente.
•	Clases Populares: Campesinos, artesanos y un incipiente proletariado industrial (fuerte en Barcelona).
•	Conflictividad: Surgieron tensiones por impuestos impopulares como el de «consumos» (sobre alimentos básicos) y por la censura hacia la libertad de prensa.
5.2. El Colapso del Régimen
El autoritarismo de la reina, el agotamiento del sistema y la aparición de nuevas fuerzas como el Partido Demócrata y la Unión Liberal llevaron al fin del reinado:
•	Pacto de Ostende: Acuerdo para derrocar a la soberana.
•	Revolución de 1868 («La Gloriosa»): Levantamiento que supuso el exilio de Isabel II y el inicio del Sexenio Democrático.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/3FHQpy4zOWM",
  },
  {
    slug: "tema-24-bis",
    titulo: "Tema 24 bis: El Sexenio Democrático (1868–1874)",
    descripcion: "Revolución, monarquía democrática, república y crisis.",
    indice: `Índice del Tema 24 bis
1.	El Ocaso de la Monarquía Isabelina y el Estallido Revolucionario
2.	El Gobierno Provisional y la Construcción del Nuevo Orden
3.	La Monarquía de Amadeo I de Saboya (1871-1873)
4.	La Primera República Española: Entre el Ideal y el Caos
5.	El Camino hacia la Restauración (1874)`,
    contenido: `Tema 24 bis — El Sexenio Democrático (1868–1874)
1. El Ocaso de la Monarquía Isabelina y el Estallido Revolucionario
El Sexenio Democrático representa una vibrante etapa de transición en la historia de España, situada entre el agotamiento del moderantismo isabelino y el advenimiento de la Restauración borbónica. Este periodo no fue un simple cambio de gobierno, sino una búsqueda profunda de legitimidad basada en principios democráticos.
1.1. Las Causas del Colapso
El régimen de Isabel II se vio asfixiado por una combinación de factores críticos que hicieron insostenible su continuidad:
•	Autoritarismo Político: El excesivo control de los últimos gabinetes moderados agotó las vías de diálogo con la oposición.
•	Crisis Económica de 1866: Un impacto financiero que empujó a los sectores descontentos a la acción.
•	El Pacto de Ostende: Acuerdo sellado por la oposición con el objetivo innegociable de derrocar a la reina.
1.2. «La Gloriosa» y el Exilio de la Corona
La chispa de la sublevación saltó en Cádiz con el pronunciamiento del almirante Topete, a quien se unieron los generales Prim y Serrano.
•	La Batalla de Alcolea: Enfrentamiento decisivo que provocó el fin de la resistencia isabelina.
•	Consecuencias Inmediatas: La soberana partió al exilio en Francia, mientras las Juntas Revolucionarias brotaban por todo el país.
•	Participación Popular: Las clases populares urbanas se organizaron en los «Voluntarios de la Libertad», exigiendo reformas sociales y políticas.

2. El Gobierno Provisional y la Construcción del Nuevo Orden
Con el triunfo de la revolución, se estableció un Gobierno Provisional presidido por el general Serrano, con el general Prim al frente del Ministerio de la Guerra. Este periodo se caracterizó por un ideario de liberalismo democrático basado en la soberanía nacional y el sufragio universal masculino.
2.1. La Constitución de 1869
Considerada la primera carta magna democrática de la nación, introdujo novedades radicales:
•	Monarquía Parlamentaria: Se mantenía la figura del rey, pero bajo el aforismo «el Rey reina pero no gobierna», limitando sus funciones a lo representativo.
•	Derechos Civiles: Defensa de los derechos individuales, incluyendo por primera vez la libertad de cultos y de enseñanza.
•	Libertad de Asociación: Permitió la organización legal del movimiento obrero y la llegada de las ideas de la Primera Internacional (AIT).
2.2. Reformas Económicas y Tensiones Culturales
El ministro Figuerola impulsó medidas para modernizar la estructura productiva y sanear la Hacienda:
•	La Peseta (1868): Creada como unidad monetaria nacional.
•	Aperturismo Económico: Aprobación de un arancel para reducir el proteccionismo.
•	Clima Intelectual: Auge del krausismo (defensa de la libertad de cátedra) y del republicanismo federal.

3. La Monarquía de Amadeo I de Saboya (1871-1873)
La búsqueda de un nuevo rey en las cortes europeas provocó tales tensiones que sirvió de pretexto para la guerra franco-prusiana. Finalmente, el elegido fue Amadeo de Saboya, cuyo reinado fue una crónica de inestabilidad constante.
3.1. Un Comienzo Trágico y Oposición Generalizada
Tres días antes del desembarco del monarca en 1871, su principal apoyo, el general Prim, fue asesinado. Amadeo, apodado el «Rey Caballero», se enfrentó a un aislamiento total por parte de:
•	Aristócratas alfonsinos: Partidarios del regreso de los Borbones.
•	Carlistas: Quienes reactivaron el conflicto en la Tercera Guerra Carlista.
•	Otros sectores: La Iglesia, los republicanos y los sectores que lo despreciaban por su origen extranjero.
3.2. Conflictos Bélicos y Crisis Social
El estado se vio incapaz de sostener el gasto militar de dos frentes abiertos:
•	Guerra de los Diez Años (Cuba): Iniciada tras el Grito de Yara, donde los intereses esclavistas se opusieron a las reformas.
•	Inestabilidad Presupuestaria: Las dificultades financieras se volvieron insostenibles. En febrero de 1873, agotado y declarando que los españoles eran «ingobernables», Amadeo I abdicó, dejando un vacío de poder que llevó a la proclamación de la Primera República.

4. La Primera República Española: Entre el Ideal y el Caos
La República nació en una sesión conjunta de Congreso y Senado con escaso apoyo real, votada por muchos monárquicos solo por necesidad. Su breve existencia estuvo marcada por la fractura interna entre federalistas y unitarios.
4.1. La Inestabilidad Presidencial
En menos de un año, se sucedieron cuatro presidentes, cada uno intentando gestionar el desorden de forma distinta:
1.	Figueras
2.	Pi y Margall
3.	Salmerón
4.	Castelar
4.2. Desafíos Sociales y Territoriales
El intento de redactar la Constitución de 1873 (que organizaba el estado de abajo arriba) nunca se materializó debido a:
•	Revolución Cantonal: Especialmente grave en Cartagena, con ciudades declarándose independientes.
•	Demandas Populares: Exigencia de reparto de tierras y abolición del sistema de quintas (servicio militar).
•	Colapso Hacendístico: Incapacidad de recaudar impuestos ante la insurrección y las guerras.

5. El Camino hacia la Restauración (1874)
El descontrol interno provocó un giro conservador en la República para intentar salvar la unidad nacional, lo que permitió el regreso del protagonismo militar.
5.1. El Fin del Experimento Democrático
•	Golpe de Pavía (enero de 1874): El general irrumpió en las Cortes disolviéndolas por la fuerza.
•	Dictadura de Serrano: Fase de República autoritaria que buscaba restablecer el orden.
•	Manifiesto de Sandhurst: Documento donde el joven Alfonso XII se presentaba como un rey liberal, moderno y católico bajo la dirección política de Cánovas del Castillo.
5.2. El Pronunciamiento de Sagunto
En diciembre de 1874, el general Martínez Campos proclamó a Alfonso XII en Sagunto. Este acto puso fin al Sexenio e inició la Restauración, volviendo a un sistema de soberanía compartida y al turno pacífico de partidos.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/bBaZD3qQpk4",
  },
  {
    slug: "tema-25",
    titulo: "Tema 25: El sistema de la Restauración",
    descripcion: "Constitución de 1876, turnismo y estabilidad aparente.",
    comunidadClave: ["andalucia"],
    indice: `ÍÍndice del tema 25
1.	El Nacimiento de la Restauración y el Pensamiento Canovista
2.	El Funcionamiento del Sistema: El Turno de Partidos
3.	El Marco Jurídico: La Constitución de 1876
4.	Oposición al Sistema y el Declive del Siglo XIX`,
    contenido: `Tema 25 — El sistema de la Restauración
1. El Nacimiento de la Restauración y el Pensamiento Canovista
Tras el turbulento periodo del Sexenio Democrático, caracterizado por la inestabilidad extrema de la Primera República (con su sucesión de cuatro presidentes), las guerras carlista y cubana, y la sublevación cantonal, España buscó un nuevo rumbo. El cambio se materializó en diciembre de 1874, cuando el general Martínez Campos proclamó a Alfonso XII como rey en Sagunto.
1.1. Antonio Cánovas del Castillo: El Arquitecto del Sistema
Aunque el inicio fue militar, el cerebro del nuevo orden fue el político Antonio Cánovas del Castillo. Su visión se alejaba del intervencionismo de las armas, apostando por una vuelta a la legalidad monárquica de carácter civil. Los pilares de su propuesta fueron:
•	La "Constitución Interna": Un concepto esencial que definía a la Monarquía borbónica y a las Cortes como las dos instituciones seculares depositarias de la soberanía nacional compartida.
•	Estabilidad y Orden: El objetivo era consolidar el Estado burgués frente al caos anterior, obteniendo un apoyo férreo de la aristocracia, la alta burguesía y los grandes propietarios de tierras.
•	Ideología Doctrinaria: Basada en el liberalismo doctrinario o conservador, defendía la adaptación prudente de las instituciones tradicionales a la modernidad, según lo expresado en el Manifiesto de Sandhurst.

2. El Funcionamiento del Sistema: El "Turno de Partidos"
Para garantizar una estabilidad duradera y evitar los constantes pronunciamientos militares, Cánovas se inspiró en el modelo parlamentario inglés para diseñar un sistema de bipartidismo o turno de partidos.
2.1. Los Partidos Dinásticos
El sistema se articulaba sobre la alternancia pacífica de dos grandes fuerzas:
1.	El Partido Conservador: Liderado por el propio Cánovas del Castillo.
2.	El Partido Liberal: Bajo la dirección de Práxedes Mateo Sagasta.
2.2. La Mecánica del Fraude Electoral
La alternancia no nacía del voto popular, sino de una inversión del proceso democrático: el Rey nombraba al presidente y este convocaba elecciones que ganaba invariablemente mediante diversas técnicas de manipulación:
•	El Caciquismo: Figura clave del engranaje social. El cacique era un individuo con enorme poder local, especialmente en zonas rurales con alto analfabetismo (como Andalusia), que ejercía presión directa sobre los votantes.
•	El Encasillado: Práctica consistente en el reparto previo de los escaños en las cámaras antes de realizarse la votación.
•	El Pucherazo: Método de falsificación de actas o manipulación directa de los votos para asegurar el resultado deseado.
•	Hitos de Estabilidad: Este sistema permitió una alternancia perfecta entre 1875 y 1902, destacando el Pacto del Pardo (1885), que aseguró la regencia de María Cristina tras la muerte de Alfonso XII.

3. El Marco Jurídico: La Constitución de 1876
La Constitución de 1876, redactada por una Asamblea convocada por Cánovas, buscaba un término medio entre los textos anteriores y se convirtió en la de mayor vigencia en la historia de España, rigiendo hasta el golpe de Primo de Rivera en 1923.
3.1. Organización del Estado y Sociedad
•	Soberanía Compartida: Establecía formalmente que el poder residía en las Cortes con el Rey.
•	Bicameralismo: Las Cortes se dividían en un Congreso de los Diputados y un Senado (compuesto por miembros por derecho propio, vitalicios y representantes de los grandes contribuyentes).
•	Protección de Élites: El texto velaba por los intereses de las "minorías propietarias e inteligentes", restringiendo el poder de las "muchedumbres" para evitar riesgos como el comunismo.
•	Propiedad y Religión: Se garantizaba la propiedad privada como principio básico. Además, se declaraba la religión católica como oficial, obligando al Estado a mantener el culto, aunque permitiendo la tolerancia religiosa en el ámbito privado.

4. Oposición al Sistema y el Declive del Siglo XIX
El carácter cerrado de los partidos dinásticos dejó fuera a amplios sectores sociales, creando un bloque de exclusión que minaría la legitimidad del régimen.
4.1. Fuerzas de Oposición
•	Carlistas: Situados en la extrema derecha, leales al pretendiente Carlos VII.
•	Republicanos: Debilitados y divididos tras el fracaso de la Primera República.
•	Movimiento Obrero: En constante crecimiento a través de las corrientes del anarquismo y el socialismo.
4.2. El Regeneracionismo y la Crisis Final
A finales del siglo XIX, la corrupción del sistema y las precarias condiciones de vida de la clase obrera y el campesinado de los latifundios propiciaron la aparición del Regeneracionismo. Figuras como Joaquín Costa o Ricardo Macías Picavea denunciaron el caciquismo como un mal urgente de extirpar. Finalmente, el impacto del desastre de 1898 terminó por socavar irremediablemente la legitimidad de la Restauración.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Wy4QH4zu8UQ",
  },
  {
    slug: "tema-26",
    titulo: "Tema 26: Crisis de la Restauración (1902–1930)",
    descripcion: "Inestabilidad política, conflictividad social y dictadura.",
    indice: `Índice del tema 26
1.	El Inicio del Reinado de Alfonso XIII y el Regeneracionismo
2.	Tensiones Sociales y la Crisis de 1917
3.	Descomposición del Sistema y el Problema de Marruecos
4.	La Dictadura de Miguel Primo de Rivera (1923-1930)
5.	El Fin de la Monarquía y el Camino a la República`,
    contenido: `Tema 26 — Crisis de la Restauración (1902–1930)
1. El Inicio del Reinado de Alfonso XIII y el Regeneracionismo
El siglo XX en España comenzó condicionado por el «Desastre del 98», la pérdida de las últimas colonias que sumió al país en una crisis de identidad. En este contexto de desasosiego, Alfonso XIII alcanzó su mayoría de edad en 1902, iniciando un reinado marcado por el intento de reformar el sistema desde las instituciones para evitar una revolución social.
1.1. La Corriente Regeneracionista
El regeneracionismo surgió como una respuesta intelectual y política que buscaba la modernización del país. Se fundamentaba en:
•	La «Revolución desde arriba»: El miedo de las élites a una insurrección popular impulsó la idea de transformar el Estado desde el poder.
•	Influencias Intelectuales: Destacó la figura de Joaquín Costa, con su lema «Escuela y Despensa», y el espíritu crítico de la Generación del 98, que anhelaba la europeización de España.
•	Reformas Económicas: El Estado impulsó el proteccionismo industrial y la modernización de infraestructuras agrícolas para paliar el atraso técnico nacional.
1.2. Los Intentos de Reforma de los Partidos Dinásticos
Los líderes del sistema intentaron oxigenar la Restauración mediante distintas leyes:
•	Antonio Maura (Bando Conservador): Durante su «gobierno largo», promovió la Ley de Administración Local bajo la bandera de su propia «Revolución desde arriba».
•	José Canalejas (Bando Liberal): Buscó una modernización laica con la «Ley del Candado» (que limitaba las órdenes religiosas) y la Ley de Mancomunidades para atender las demandas territoriales.
•	Fracaso de la Renovación: A pesar de estos esfuerzos, el caciquismo y el fraude electoral persistieron. El proceso de reforma recibió un golpe mortal con el asesinato de Canalejas en 1912, dejando al sistema sin líderes capaces.

2. Tensiones Sociales y la Crisis de 1917
Mientras el sistema político se agotaba, la sociedad española experimentaba una efervescencia sin precedentes debido al crecimiento del movimiento obrero (PSOE, UGT y la anarquista CNT).
2.1. El Impacto de la Gran Guerra (1914)
La neutralidad española en la Primera Guerra Mundial generó un escenario económico contradictorio:
•	Beneficios Extraordinarios: La burguesía acumuló grandes fortunas gracias a las exportaciones de guerra.
•	Crisis de Subsistencia: La inflación se disparó mientras los salarios quedaban estancados, condenando a las clases trabajadoras a la miseria.
2.2. El Triple Desafío de 1917
La tensión acumulada estalló en un momento crítico donde se solaparon tres conflictos contra el Estado:
•	Conflicto Militar: Protagonizado por las Juntas de Defensa.
•	Conflicto Político: Representado por la Asamblea de Parlamentarios en Barcelona.
•	Conflicto Social: Una Huelga General que paralizó el país y evidenció la fractura del orden público.

3. Descomposición del Sistema y el Problema de Marruecos
Tras 1917, el país entró en una espiral de violencia y desgobierno. Los gobiernos de concentración apenas lograban sostenerse unos meses en el poder ante una conflictividad creciente.
3.1. Radicalización y Violencia Social
El eco de la Revolución Rusa de 1917 radicalizó las posturas del marxismo y el anarquismo:
•	Pistolerismo en Barcelona: Guerra de sicarios de la patronal contra militantes anarcosindicalistas.
•	Trienio Bolchevique (1918-1920): Periodo de intensa agitación campesina en el campo andaluz.
3.2. El Desastre de Annual y sus Consecuencias
La cuestión colonial en el Rif (Marruecos) fue el detonante final de la monarquía:
•	Oposición Popular: La guerra era rechazada por las clases bajas, estallando en la Semana Trágica de Barcelona (1909) tras el desastre del Barranco del Lobo.
•	División Militar: Enfrentamiento entre militares «africanistas» y «peninsulares».
•	Desastre de Annual (1921): Más de 10.000 soldados murieron, provocando la apertura del Expediente Picasso. El temor a que la investigación salpicara al Rey precipitó el fin de la legalidad.

4. La Dictadura de Miguel Primo de Rivera (1923-1930)
El 13 de septiembre de 1923, el Capitán General de Cataluña, Miguel Primo de Rivera, dio un golpe de Estado con el consentimiento de Alfonso XIII.
4.1. Fases del Régimen
La dictadura se dividió en dos periodos diferenciados:
1.	Directorio Militar: Suspensión de la Constitución y represión del orden público. Su gran hito fue el Desembarco de Alhucemas, que finalizó el problema de Marruecos.
2.	Directorio Civil: Intento de institucionalización a través de la Unión Patriótica y el lema «País, Religión y Monarquía». Prohibió partidos de izquierda y reprimió nacionalismos, aunque colaboró inicialmente con la UGT.
4.2. Economía y Oposición
Aprovechando los «felices años 20», el Estado intervino activamente en la economía:
•	Monopolios Estatales: Creación de CAMPSA y Telefónica.
•	Obras Públicas: Construcción de embalses y una moderna red de carreteras.
•	Aumento de la Oposición: Intelectuales como Unamuno, estudiantes y republicanos se enfrentaron al régimen.

5. El Fin de la Monarquía y el Camino a la República
El agotamiento del régimen llevó a la dimisión de Primo de Rivera en 1930, dando paso a un periodo de transición fallida.
5.1. La «Dictablanda» y la Sentencia de la Corona
El general Berenguer intentó volver a la normalidad institucional mediante la llamada «Dictablanda», pero el prestigio de la corona estaba irremediablemente dañado. Al haberse vinculado a una dictadura ilegal, la monarquía perdió su legitimidad, facilitando que solo un año después, en 1931, se proclamara la Segunda República.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/GnCk7diHWqw",
  },
  {
    slug: "tema-26-bis",
    titulo: "Tema 26 bis: La guerra de Cuba (1895–1898)",
    descripcion: "Conflicto colonial y final del imperio ultramarino.",
    indice: `Índice del tema 26 bis
1.	Antecedentes y Contexto del Conflicto Cubano
2.	Causas Económicas y el Detonante Político
3.	Desarrollo de la Guerra: 1895-1897
4.	La Intervención de Estados Unidos y el Casus Belli
5.	El Desastre Militar y el Tratado de París
6.	Consecuencias del Desastre del 98`,
    contenido: `Tema 26 bis — La guerra de Cuba (1895–1898)
1. Antecedentes y Contexto del Conflicto Cubano
El conflicto en Cuba, desarrollado con especial intensidad entre 1895 y 1898, fue más que una guerra colonial; actuó como el catalizador que expuso las carencias del sistema de la Restauración y alteró el equilibrio geopolítico mundial en favor de Estados Unidos.
1.1. Las raíces de la insurrección
Para entender el estallido, es necesario analizar el legado de conflictos previos y la gestión política de la metrópoli:
•	La Guerra de los Diez Años y la Paz de Zanjón: Tras este periodo, las promesas de autonomía para la isla nunca se cumplieron plenamente, manteniendo una relación de subordinación constante.
•	Incumplimiento de Reformas: España garantizó cambios estructurales que no se materializaron, alimentando el caldo de cultivo revolucionario.
1.2. Fractura Social y el Partido Revolucionario Cubano
La organización de la resistencia se consolidó bajo liderazgos claros y una división social marcada:
•	José Martí: En 1892 fundó el Partido Revolucionario Cubano (PRC), logrando unificar a los diversos grupos independentistas.
•	División de la población: La sociedad se fracturó entre los «españoles» (peninsulares), que controlaban la administración y el comercio, y los «cubanos» (criollos y clases populares), que anhelaban la soberanía tras la abolición de la esclavitud en 1886.

2. Causas Económicas y el Detonante Político
La economía y la ideología nacionalista fueron los motores que impulsaron el paso de la queja a la confrontación armada.
2.1. El mercado cautivo y el factor estadounidense
La política económica de España hacia Cuba era rígidamente proteccionista:
•	Aranceles asfixiantes: España imponía fuertes gravámenes a productos no españoles, perjudicando el comercio de la isla con Estados Unidos, su cliente natural y principal comprador de tabaco y azúcar.
•	Nacionalismo e Ideales: Bajo el pensamiento de José Martí, el deseo de soberanía se fusionó con ideales democráticos y sociales.
2.2. El fracaso de la vía institucional
El agotamiento de la vía pacífica se produjo en las cámaras legislativas:
•	Rechazo a la Ley Maura (1893): Las Cortes españolas rechazaron la propuesta de autonomía de Antonio Maura, convenciendo a los cubanos de que la independencia solo se lograría mediante las armas.
3. Desarrollo de la Guerra: 1895-1897
La contienda comenzó formalmente en febrero de 1895 con el Grito de Baire, lo que obligó a España a enviar contingentes militares masivos.
3.1. Estrategias militares españolas
El gobierno español alternó dos métodos opuestos para intentar sofocar la rebelión:
•	Vía Negociadora de Martínez Campos: Un intento de solución dialogada que terminó en un rotundo fracaso.
•	Mano dura de Valeriano Weyler: Tras el fracaso inicial, se impuso una estrategia represiva.
•	Autonomía tardía (1897): Tras el asesinato de Cánovas del Castillo, el nuevo gobierno liberal concedió una autonomía que los rebeldes ya no aceptaron.
3.2. La Guerra de Guerrillas y la Reconcentración
El conflicto en el terreno fue brutal y tuvo un alto coste humanitario:
•	Los «mambises»: Insurrectos que impusieron una guerra de guerrillas desgastante.
•	La Reconcentración de Weyler: Política de encerrar a campesinos en poblados controlados para aislar a los rebeldes. Provocó miles de muertes por hambre y enfermedades.
•	Impacto Económico: La guerra arruinó las plantaciones y generó una deuda pública astronómica, además del «impuesto de sangre» que suponían las quintas para las clases populares.

4. La Intervención de Estados Unidos y el Casus Belli
La potencia norteamericana aprovechó el estancamiento militar y la crisis humanitaria para aplicar su agenda expansionista.
4.1. Intereses y Justificación Ideológica
La entrada de EE. UU. se basó en una mezcla de intereses estratégicos y propaganda:
•	Destino Manifiesto y Doctrina Monroe: Bajo el lema «América para los americanos», buscaban eliminar la presencia española y dominar el mercado del azúcar.
•	Prensa Sensacionalista: Figuras como Pulitzer y Hearst manipularon a la opinión pública estadounidense para fomentar la histeria bélica.
4.2. El incidente del Maine y el Ultimátum
•	El Acorazado Maine: Su explosión en el puerto de La Habana en febrero de 1898 fue el casus belli definitivo.
•	El Ultimátum de McKinley: El presidente estadounidense exigió la retirada española. España, por un malentendido concepto del «honor», rechazó la exigencia aun sabiendo que la derrota era probable.

5. El Desastre Militar y el Tratado de París
La guerra de 1898 fue breve y desigual, demostrando la superioridad tecnológica y económica de los Estados Unidos.
5.1. Operaciones Navales y Derrota
•	Batalla de Santiago de Cuba: Destrucción total de la escuadra del almirante Cervera.
•	Batalla de Cavite (Filipinas): Destrucción de la flota de Montojo.
•	Impacto Social: El regreso de soldados heridos y macilentos a la península reveló a la población la magnitud real de la tragedia.
5.2. El Tratado de París (Diciembre de 1898)
El acuerdo se negoció sin la presencia de cubanos ni filipinos, certificando el fin del imperio:
•	Cesiones territoriales: España entregó a EE. UU. los territorios de Puerto Rico, Filipinas y Guam.
•	Situación de Cuba: Quedó bajo ocupación militar estadounidense, condicionada posteriormente por la Enmienda Platt.

6. Consecuencias del "Desastre del 98"
El trauma de la derrota provocó una crisis existencial en España, aunque también impulsó movimientos de reforma.
6.1. Crisis Política y el Regeneracionismo
•	Pérdida de Legitimidad: El sistema de la Restauración sobrevivió, pero perdió su autoridad moral.
•	Joaquín Costa: Líder del Regeneracionismo, quien propuso una política de «escuela y despensa» contra el caciquismo.
•	Descontento Social: Malestar profundo por el sistema de quintas, que permitía a los ricos evitar el frente mediante pago.
6.2. Impacto Cultural y Económico
•	Generación del 98: Intelectuales como Unamuno, Maeztu y Machado reflexionaron sobre la decadencia y el «ser de España».
•	Repatriación de Capitales: Paradójicamente, el retorno de capitales coloniales ayudó a fundar bancos y modernizar la industria a largo plazo.
•	Giro hacia Marruecos: Tras dejar de ser potencia imperial, España volcó sus ambiciones hacia el Norte de África para intentar recuperar el prestigio perdido.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/D1s6Yhc_OUc",
  },
  {
    slug: "tema-26-ter",
    titulo: "Tema 26 ter: El desastre del 98 y el regeneracionismo",
    descripcion: "Crisis nacional y respuestas regeneracionistas.",
    indice: `Índice del tema 26 ter
1.	El Impacto del Tratado de París y el Fin del Imperio
2.	La Descomposición del Sistema de la Restauración
3.	El Regeneracionismo de Joaquín Costa
4.	La Respuesta Cultural: La Generación del 98
5.	El «Regeneracionismo desde Arriba» y el Fin de las Reformas`,
    contenido: `Tema 26 ter — El desastre del 98 y el regeneracionismo
1. El Impacto del Tratado de París y el Fin del Imperio
La firma del Tratado de París en 1898 no representó únicamente un trámite diplomático; fue el acta de defunción oficial del Imperio español, certificando la pérdida definitiva de Cuba, Puerto Rico y Filipinas. Este evento sumergió a la sociedad en un estado emocional complejo donde la indignación y la apatía iniciales mutaron en una crítica feroz contra las instituciones.
1.1. Consecuencias Políticas y Militares Inmediatas
El descalabro bélico tuvo repercusiones directas en las estructuras de poder de la época:
•	Caída del Gobierno: El gabinete liberal de Sagasta cayó fulminado por el peso del fracaso.
•	Desprestigio de los Partidos Dinásticos: Se les acusó de empujar a la nación a una "guerra suicida" basada en un concepto trasnochado del "honor".
•	Evolución del Estamento Militar: Al sentirse el "chivo expiatorio" de la sociedad civil, el ejército desarrolló un carácter corporativista y autoritario que marcaría el futuro del país.
1.2. Realidad Social y Resquicios Económicos
A pesar de la sensación de ser una "nación moribunda" frente a potencias tecnificadas como los Estados Unidos, el país experimentó procesos internos contradictorios:
•	El Malestar de las Quintas: El sistema de reclutamiento generó un resentimiento profundo, ya que las familias acomodadas eludían el frente mediante la redención en metálico.
•	Repatriación de Capitales: El dinero de las colonias regresó a la península, impulsando la modernización industrial y la fundación de entidades como el Banco Hispano Americano.

2. La Descomposición del Sistema de la Restauración
El sistema ideado por Cánovas empezó a resquebrajarse bajo el peso de sus propias vicios estructurales y la desaparición de sus figuras clave. Con las muertes de Cánovas (1897) y Sagasta (1903), la estabilidad del turno pacífico se dinamitó.
2.1. Crisis Institucional y Nuevas Fuerzas
El ascenso al trono de Alfonso XIII en 1902 coincidió con un sistema en fase terminal que cuestionaba incluso la validez de la Constitución de 1876. Los principales desafíos fueron:
•	El Caciquismo: Identificado unánimemente como la raíz de los males y el obstáculo para una democracia real.
•	Deuda Bélica: Una carga astronómica que limitaba la inversión en infraestructuras y servicios públicos.
•	Emergencia de Oposiciones: Los republicanos, los nacionalistas (destacando la Lliga Regionalista en Cataluña) y el movimiento obrero (PSOE/UGT y anarquismo) ganaron terreno.

3. El Regeneracionismo de Joaquín Costa
Surgido como la respuesta intelectual al desastre, el Regeneracionismo se convirtió en el "sentido común" de la época, proponiendo una reforma profunda de la estructura nacional.
3.1. Propuestas de Reforma Estructural
Joaquín Costa, líder intelectual del movimiento, defendía una intervención radical en la vida política y social:
•	El «Cirujano de Hierro»: Un líder de voluntad inquebrantable necesario para extirpar los males del sistema y el parlamentarismo ficticio.
•	Movilización de las «Clases Neutras»: Un llamamiento a la burguesía y profesionales liberales para arrebatar el poder a los caciques rurales.
•	«Escuela y Despensa»: Programa que combinaba la educación modernizadora con reformas agrarias e hidráulicas.
•	Europeización: La defensa de un pragmatismo centrado en problemas internos, abandonando la nostalgia imperial.

4. La Respuesta Cultural: La Generación del 98
Paralelamente a la política, un grupo de intelectuales ofreció una disección filosófica y literaria de la crisis nacional, diferenciando con amargura la "España oficial" de la "España real".
4.1. Integrantes y Pensamiento
Escritores como Unamuno, Machado, Azorín, Baroja y Maeztu marcaron esta etapa:
•	La Intrahistoria: Concepto de Unamuno para buscar la esencia nacional en la vida cotidiana de la gente común.
•	Identidad Castellana: El paisaje de Castilla se convirtió en el símbolo de la búsqueda de la esencia de España.
•	Evolución Ideológica: Los autores transitaron desde radicalismos juveniles hacia el pesimismo existencial o el conservadurismo espiritual.
"No es el desastre lo que nos duele, sino la conciencia de nuestra propia decadencia frente a un mundo que corre mientras nosotros nos arrastramos."

5. El «Regeneracionismo desde Arriba» y el Fin de las Reformas
Los propios líderes dinásticos intentaron salvar el sistema mediante reformas institucionales que, finalmente, no pudieron contener la presión social.
5.1. Los Intentos de Maura y Canalejas
•	Antonio Maura (Conservador): Impulsó una "revolución" mediante la reforma de la administración local para atraer a las "masas honestas".
•	José Canalejas (Liberal): Apostó por la democratización, la protección social y la limitación del poder eclesiástico mediante la Ley del Candado. Se promovieron también leyes de colonización agrícola y reformas fiscales.
5.2. El Fracaso de la Vía Reformista
La desconexión entre la élite y la ciudadanía se profundizó por dos eventos traumáticos:
•	La Semana Trágica de Barcelona (1909): Estallido social que aumentó la represión del sistema.
•	Asesinato de Canalejas (1912): Truncó definitivamente los procesos de reforma desde dentro, dejando vía libre a soluciones fuera del parlamento que desembocarían en el golpe de Estado de 1923.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/7JOCYiUSwPU",
  },
  {
    slug: "tema-27",
    titulo: "Tema 27: La Segunda República (1931–1936)",
    descripcion: "Reformas, conflictos y polarización política.",
    indice: `Índice del tema 27
1.	El Nacimiento de la Segunda República (1931)
2.	El Marco Legal y el Contexto Económico
3.	El Bienio Reformista (1931-1933)
4.	El Bienio Radical-Cedista o "Bienio Negro" (1933-1936)
5.	El Frente Popular y el Detonante de la Guerra (1936)`,
    contenido: `Tema 27 — La Segunda República (1931–1936)
1. El Nacimiento de la Segunda República (1931)
El 14 de abril de 1931 amaneció en España con la instauración de un régimen democrático que asumió la titánica tarea de modernizar el país de manera radical. Este cambio se produjo en un contexto internacional convulso, marcado por el auge de los totalitarismos y una resistencia interna feroz por parte de los sectores tradicionales.
1.1. Antecedentes y el Plebiscito de la Corona
El camino hacia la República se pavimentó tras el profundo desprestigio de la Monarquía después de los años de la Dictadura de Primo de Rivera. Este descontento llevó a las fuerzas de la oposición a sellar el Pacto de San Sebastián.
•	Elecciones municipales del 12 de abril de 1931: Estos comicios dejaron de ser un trámite administrativo para convertirse en un auténtico plebiscito sobre la permanencia de la Institución Monárquica.
•	Victoria Republicano-Socialista: El triunfo de estas candidaturas en las principales ciudades precipitó el exilio de Alfonso XIII.
•	Gobierno Provisional: Se formó bajo el liderazgo de Niceto Alcalá-Zamora, quien convocó de inmediato elecciones a Cortes Constituyentes.
•	Entusiasmo Popular: La República fue apodada cariñosamente "la niña bonita", representando la esperanza de alcanzar reformas agrarias y laborales esperadas durante décadas.

2. El Marco Legal y el Contexto Económico
La República no nació en un vacío; heredó problemas estructurales y coyunturales que condicionaron su estabilidad desde el primer momento.
2.1. Desafíos Económicos Heredados
El nuevo régimen tuvo que navegar en aguas turbulentas debido a:
•	Crisis de 1929: Aunque con cierto retraso, las consecuencias del crac financiero mundial impactaron en la economía nacional.
•	Fuga de Capitales: Alimentada por el miedo de las élites financieras ante el cariz del nuevo sistema político.
2.2. La Constitución de 1931
Se redactó una carta magna avanzada, laica y profundamente democrática que definió a España como una "República de trabajadores". Sus puntos clave fueron:
•	Sufragio Femenino: Reconocimiento del derecho al voto de las mujeres por primera vez en la historia de España.
•	Derechos Civiles: Reconocimiento del derecho al divorcio.
•	Ruptura Tradicional: Su marcado carácter laico supuso una fractura drástica con la tradición católica y monárquica, generando una división social persistente.

3. El Bienio Reformista (1931-1933)
Bajo el liderazgo de Manuel Azaña, el gobierno acometió una transformación profunda para extirpar los que consideraban los "males históricos" de la nación.
3.1. Las Grandes Reformas del Estado
El gobierno articuló su acción en diversos frentes para transformar la organización social y política:
•	Reforma Territorial: Aprobación del Estatuto de Autonomía de Cataluña en 1932.
•	Reforma Agraria: Impulsada mediante el Instituto de Reforma Agraria (IRA), buscaba la expropiación de grandes latifundios. Sin embargo, resultó un proceso lento y burocrático que descontentó tanto a campesinos como a propietarios.
•	Reforma Militar: Conocida como la Ley Azaña, profesionalizó el ejército para asegurar su lealtad al poder civil.
•	Reforma Laboral: Impulso de jurados mixtos de trabajo y leyes de protección laboral.
3.2. Educación y Conflicto Religioso
En el terreno cultural se vivió una auténtica revolución educativa:
•	Misiones Pedagógicas: Iniciativa para llevar la cultura y la educación a los rincones más olvidados del mundo rural, junto a la creación de miles de escuelas.
•	Enfrentamiento con la Iglesia: Simbolizado en la disolución de la Compañía de Jesús, lo que radicalizó a la oposición conservadora.
•	Resistencia Armada: En 1932 se produjo la "Sanjurjada", un golpe de Estado fallido que evidenció el rechazo de ciertos sectores militares a las reformas.

4. El Bienio Radical-Cedista o "Bienio Negro" (1933-1936)
El desgaste del gobierno y la crisis económica facilitaron el triunfo de la derecha y el centro en las elecciones de 1933.
4.1. Política de Rectificación
El nuevo gobierno, formado por la CEDA de Gil-Robles y el Partido Radical de Lerroux, se caracterizó por desmantelar la obra del bienio anterior:
•	Parálisis de Reformas: Frenazo a la reforma agraria y concesión de amnistía a los golpistas de 1932.
•	Aparición del Fascismo: Surgimiento de Falange Española como exponente del fascismo nacional.
4.2. La Revolución de Octubre de 1934
La tensión social alcanzó su punto crítico cuando la entrada de la CEDA en el gobierno fue vista por la izquierda como una amenaza fascista inminente.
•	Insurrección en Asturias: Una revuelta obrera especialmente violenta que fue reprimida con extrema dureza por el ejército.
•	Consecuencias: La represión rompió los puentes de diálogo, convirtiendo la política en un juego de "todo o nada" y agudizando el choque entre el catolicismo conservador y el laicismo republicano.

5. El Frente Popular y el Detonante de la Guerra (1936)
El último acto del régimen comenzó en febrero de 1936 con la victoria de la coalición de izquierdas denominada Frente Popular.
5.1. La "Primavera Trágica"
Mientras Manuel Azaña pasaba a ocupar la Presidencia de la República, el orden público comenzaba a desmoronarse:
•	Radicalización Social: Ocupaciones de tierras, quema de iglesias y enfrentamientos callejeros entre milicias.
•	Parálisis Económica: Pánico de inversores y huelgas generales constantes.
•	Avance Autonómico: Impulso a los estatutos de autonomía en el País Vasco y Galicia.
5.2. El Detonante Final
Dos asesinatos políticos cruzados sirvieron como justificación definitiva para la insurrección militar:
1.	Asesinato del teniente Castillo (ideología izquierdista).
2.	Asesinato de José Calvo Sotelo (líder de la derecha monárquica) como represalia inmediata.
Consecuentemente, el 17 de julio de 1936, la sublevación militar estalló en el protectorado de Marruecos, poniendo fin al sueño reformista e iniciando la Guerra Civil Española.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/GNZeQOJAbWc",
  },
  {
    slug: "tema-28",
    titulo: "Tema 28: La Guerra Civil (1936–1939)",
    descripcion: "Golpe militar, desarrollo del conflicto y consecuencias.",
    indice: `Índice tema 28
1.	El Estallido del Conflicto (1936-1939)
2.	Raíces y Causas del Enfrentamiento
3.	La España Dividida: Organización de las Zonas
4.	Internacionalización y Evolución Militar
5.	Consecuencias: El Inicio de la Dictadura`,
    contenido: `Tema 28 — La Guerra Civil (1936–1939)
1. El Estallido del Conflicto (1936-1939)
La Guerra Civil española no fue un evento aislado, sino una fractura interna trágica que sirvió como preludio y campo de pruebas definitivo para la Segunda Guerra Mundial. En este escenario colisionaron con extrema violencia dos visiones de España que se habían vuelto irreconciliables.
1.1. El fracaso del golpe y el inicio de la guerra de desgaste
El conflicto se originó tras el pronunciamiento militar de los días 17 y 18 de julio de 1936. La intención inicial de los sublevados era un golpe de Estado rápido; sin embargo, al fracasar en la toma de los centros neurálgicos del país, se transformó en una contienda prolongada:
•	Objetivos fallidos: Las fuerzas sublevadas no lograron controlar de forma rápida Madrid, Barcelona ni Bilbao.
•	Transformación del conflicto: Lo que debía ser un golpe relámpago derivó en una cruenta guerra de desgaste.
1.2. El contexto político previo
El estallido fue la culminación de la inestabilidad de la Segunda República, que no logró consolidar un centro democrático estable. La situación se vio agravada por:
•	La polarización extrema tras la victoria del Frente Popular en febrero de 1936.
•	El asesinato del líder derechista Calvo Sotelo, que actuó como detonante final.

2. Raíces y Causas del Enfrentamiento
El conflicto hundía sus raíces en problemas estructurales no resueltos y en un choque ideológico total, alimentado por el contexto de los totalitarismos europeos (el fascismo y el comunismo).
2.1. Desigualdades y resistencias sociales
•	Problema agrario: Existía una desigualdad estructural profunda en el campo que asfixiaba a los campesinos.
•	Oposición de las élites: La Iglesia, el Ejército y los grandes terratenientes ejercieron una resistencia feroz ante la pérdida de sus privilegios históricos.
•	Radicalización obrera: Sindicatos como la CNT y la UGT aumentaron su presión, lo que generó en las clases medias un pánico cerval a una revolución de corte soviético.
2.2. El choque ideológico
El enfrentamiento se definió por la oposición frontal entre dos modelos de sociedad:
•	Laicismo reformista republicano: El intento de modernización y separación Iglesia-Estado por parte de la República.
•	Nacional-catolicismo: La visión conservadora y religiosa que emergió con fuerza entre los sublevados.

3. La España Dividida: Organización de las Zonas
Tras el golpe, España quedó partida en dos zonas con modelos políticos, sociales y económicos contrapuestos.
3.1. La Zona Republicana (Lealtad a la legalidad)
Caracterizada por una lucha interna por el poder y una crisis de autoridad persistente.
•	Política: El poder se atomizó en comités obreros. Se sucedieron los gobiernos de Largo Caballero y, posteriormente, el de Juan Negrín, quien promovió la resistencia bajo el lema "resistir es vencer".
•	Sociedad y Economía: Se vivió una revolución inicial con colectivizaciones. No obstante, sufrieron un golpe letal al perder el acceso a las zonas productoras de trigo y carbón, provocando una inflación galopante.
3.2. La Zona Sublevada o "Nacional" (Mando militar)
Basada en el orden jerárquico y la unificación de esfuerzos bajo una sola figura.
•	Política: Se produjo una unificación total del mando tras el Decreto de Unificación de 1937, centrando el poder en Francisco Franco. Esto dio paso a un Estado totalitario.
•	Sociedad y Economía: Militarización absoluta y represión sistemática en la retaguardia. Contaron con el respaldo financiero de la banca y suministros regulares.
3.3. La Guerra de Propaganda
Ambos bandos utilizaron la comunicación como un arma estratégica:
•	República: Defendían la "libertad contra el fascismo".
•	Sublevados: Presentaban su avance como una "Cruzada contra el comunismo".

4. Internacionalización y Evolución Militar
Lo que comenzó como una guerra civil pronto se convirtió en un símbolo mundial, atrayendo el interés de potencias extranjeras e intelectuales.
4.1. El Pacto de No Intervención
A pesar de la creación de este pacto, su aplicación fue desigual:
•	Democracias (Francia y Gran Bretaña): Se mantuvieron neutrales por miedo a una guerra europea generalizada.
•	Efecto: Esta neutralidad perjudicó principalmente al bando legítimo de la República.
4.2. Apoyos Internacionales
Bando Republicano,	Unión Soviética (pagado con el oro del Banco de España). México (apoyo diplomático y material). Brigadas Internacionales (voluntarios antifascistas).
Bando Nacional, Alemania Nazi (Legión Cóndor). Italic (CTV). Respaldo masivo técnico y armamentístico.

4.3. Hitos Militares y Desenlace
La superioridad armamentística del Eje fue determinante en las fases finales del conflicto, que atrajo a figuras como Hemingway o George Orwell.
•	Batallas clave: La toma de Teruel, la decisiva Batalla del Ebro (1938) y la caída de Cataluña.
•	Fin de la guerra: El 1 de abril de 1939, Francisco Franco firmó el último parte de guerra, declarando su victoria.

5. Consecuencias: El Inicio de la Dictadura
La victoria nacional no supuso la paz, sino la imposición de un régimen que transformó radicalmente el país.
5.1. Consecuencias Políticas y Sociales
•	Supresión de libertades: Se eliminaron los partidos políticos, los sindicatos y los Estatutos de Autonomía.
•	Desastre demográfico: Pérdida aterradora de vidas por el combate, la represión de posguerra y el exilio masivo de 1939.
5.2. Consecuencias Económicas y Culturales
•	Ruina absoluta: Infraestructuras destruidas y producción bajo mínimos.
•	Autarquía: El sistema económico derivó en los llamados "años del hambre".
•	Erial cultural: El exilio de la mayoría de intelectuales, como los de la Generación del 27, permitió la hegemonía del nacional-catolicismo en la educación.
5.3. Aislamiento Internacional
España quedó fuera del proceso de reconstrucción europea y del Plan Marshall tras la Segunda Guerra Mundial, lo que prolongó el subdesarrollo y la falta de libertades durante casi cuarenta años.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Ci1D4rHjmkg",
  },
  {
    slug: "tema-29",
    titulo: "Tema 29: El franquismo (1939–1975)",
    descripcion: "Dictadura, autarquía, desarrollismo y oposición.",
    indice: `Índice del tema 29
1.	Naturaleza y Consolidación del Régimen (1939-1975)
2.	La Etapa de la Autarquía y el Aislamiento
3.	Apertura Exterior y el Cambio Tecnocrático
4.	Transformación Social y Desequilibrios
5.	La Crisis Final y el Fin del Régimen`,
    contenido: `Tema 29 — El franquismo (1939–1975)
1. Naturaleza y Consolidación del Régimen (1939-1975)
La dictadura del general Francisco Franco se extendió por casi cuatro décadas, configurándose como un sistema personalista, autoritario y profundamente nacional-catolicista. Su evolución política estuvo marcada por una metamorfosis gradual que la llevó desde el totalitarismo de la posguerra hacia un autoritarismo de corte tecnocrático.
1.1. Institucionalización política: La "Democracia Orgánica"
Tras la victoria en la Guerra Civil, el régimen se consolidó en un contexto internacional complejo (Segunda Guerra Mundial y Guerra Fría). Para legitimarse sin recurrir a una constitución democrática, se crearon las Leyes Fundamentales del Reino, bajo el eufemismo de "Democracia Orgánica". Los pilares legales iniciales fueron:
•	Fuero del Trabajo (1938): Norma que regulaba las relaciones laborales bajo la óptica corporativista del régimen.
•	Ley de Cortes (1942): Estableció una asamblea consultiva sin soberanía popular real.
1.2. Las "Familias del Régimen"
La organización social y el apoyo al dictador descansaban sobre tres grupos de poder principales, conocidos como las "familias":
1.	La Falange: El componente ideológico inicial, encargado del control de masas y la doctrina.
2.	El Ejército: El garante del orden público y la columna vertebral del sistema.
3.	La Iglesia Católica: Responsable de la legitimación moral y el control de la vida social.

2. La Etapa de la Autarquía y el Aislamiento
Durante los primeros años, el régimen impuso un modelo de autosuficiencia radical en un intento de sobrevivir al aislamiento internacional que sufrió España tras la derrota del Eje en 1945.
2.1. Intervencionismo Económico
El Estado tomó las riendas de la producción mediante la creación del Instituto Nacional de Industria (INI). Esta etapa se definió por:
•	Aislamiento y escasez: La falta de comercio exterior derivó en los "años del hambre" y el uso de cartillas de racionamiento.
•	Control Ideológico: Se impuso un nacional-catolicismo exacerbado con una censura previa asfixiante en prensa y literatura.
2.2. Represión y Control Social
Para sostener el orden, se articularon herramientas jurídicas de eliminación de la disidencia:
•	Ley de Responsabilidades Políticas (1939): Destinada a depurar a quienes apoyaron a la República.
•	Ley de Represión de la Masonería y el Comunismo: Para perseguir ideologías consideradas enemigas de la patria.
•	Costo Humano y Cultural: Miles de ejecuciones y encarcelamientos, sumados a un exilio intelectual que dejó a España sin su élite cultural, reduciendo la cultura a un "Pensamiento Único".

3. Apertura Exterior y el Cambio Tecnocrático
A partir de los años 50, la Guerra Fría permitió al régimen presentarse como un bastión anticomunista ante el bloque occidental.
3.1. Reconocimiento Internacional
•	Acuerdos de 1953: Pactos con los Estados Unidos que supusieron la aceptación internacional del régimen a cambio de bases militares.
•	Control Interior: A pesar del aperturismo exterior, se persiguió al movimiento obrero y a los nacionalismos, enfrentando la resistencia del Maquis (guerrilla antifranquista) y creando el Tribunal de Orden Público (TOP).
3.2. El Plan de Estabilización de 1959
Ante la quiebra inminente de la autarquía, los "tecnócratas" vinculados al Opus Dei tomaron la administración para modernizar el país. Esto dio inicio al "Milagro Económico" o Desarrollismo, apoyado en:
•	Turismo de masas: Gran afluencia de divisas de visitantes extranjeros.
•	Remesas de emigrantes: Dinero enviado por españoles que trabajaban en el exterior.
•	Inversión extranjera: Apertura definitiva al mercado internacional.

4. Transformación Social y Desequilibrios
El crecimiento económico alteró la estructura social de España, debilitando la moral rígida impuesta por la Sección Femenina y el Opus Dei mediante la influencia del cine, la moda y el consumismo.
4.1. El Gran Éxodo Rural
Millones de personas abandonaron el campo hacia:
•	Centros Industriales Nacionales: Madrid, Barcelona y Bilbao.
•	Destinos Europeos: Alemania, Francia y Suiza.
4.2. Consecuencias del Modelo Desarrollista
•	Urbanización descontrolada: Crecimiento rápido y sin planificación de las ciudades.
•	Desequilibrios regionales: Brecha profunda entre la periferia industrializada y un interior agrícola deprimido.
•	Educación segregada: El sistema educativo permaneció rígidamente controlado por sexos durante gran parte del periodo.

5. La Crisis Final y el Fin del Régimen
El declive se precipitó en la década de los 70 debido a la combinación de factores biológicos, económicos y políticos.
5.1. Descomposición Política y Oposición
•	Asesinato de Carrero Blanco (1973): Atentado de ETA que eliminó al sucesor clave para la continuidad del sistema.
•	Oposición organizada: Emergen con fuerza Comisiones Obreras, protestas estudiantiles, la Junta Democrática, la Plataforma de Convergencia y los llamados "curas obreros".
•	Inestabilidad de posguerra: El intento fallido de apertura de Carlos Arias Navarro, conocido como el "espíritu del 12 de febrero".
5.2. El Colapso de 1975
El régimen terminó en un escenario de extrema debilidad:
1.	Crisis Económica: Impacto de la crisis del petróleo de 1973 (inflación y paro).
2.	Conflicto del Sáhara: La humillación internacional de la "Marcha Verde" de Marruecos.
3.	Desenlace: La muerte de Francisco Franco el 20 de noviembre de 1975, dando paso a la jefatura del estado de Juan Carlos I y al inicio de la Transición Democrática.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/_U7hHKZz9DU",
  },
  {
    slug: "tema-30",
    titulo: "Tema 30: Transición y democracia (1975–Actualidad)",
    descripcion: "Transición, Constitución de 1978 y evolución democrática.",
    indice: `Índice tema 30
1.	El Inicio de la Transición: De la Dictadura a la Democracia
2.	El Contexto Social y el Espíritu del Consenso
3.	El Marco Constitucional de 1978
4.	Consolidación y Modernización (1979-1996)
5.	España en la Actualidad: Desafíos del Siglo XXI`,
    contenido: `Tema 30 — Transición y democracia (1975–Actualidad)
1. El Inicio de la Transición: De la Dictadura a la Democracia
El fallecimiento de Francisco Franco el 20 de noviembre de 1975 no solo cerró un régimen, sino que abrió un periodo de incertidumbre y transformación radical. La transición se articuló bajo la premisa "de la ley a la ley", una estrategia de reforma legal que buscaba el cambio institucional evitando una ruptura violenta con el pasado.
1.1. Los Motores del Cambio Político
El proceso contó con figuras e instituciones clave que permitieron el desmantelamiento del sistema anterior desde dentro:
•	La Corona: Con Juan Carlos I a la cabeza, la monarquía se convirtió en el motor fundamental de la transformación democrática.
•	Adolfo Suárez: Su nombramiento como presidente del Gobierno fue decisivo para acelerar las reformas.
•	Ley para la Reforma Política (1976): El hito legal que permitió pasar del sistema franquista a uno democrático, facilitando la legalización de los partidos políticos (destacando la del Partido Comunista de España - PCE) y la convocatoria de las primeras elecciones democráticas el 15 de junio de 1977.

2. El Contexto Social y el Espíritu del Consenso
Mientras los despachos legislaban, la sociedad civil se encontraba en un estado de ebullición constante. Este periodo combinó una esperanza desbordante con una amenaza latente de inestabilidad.
2.1. Movilización y Violencia
La organización social de la época estuvo marcada por dos fuerzas opuestas:
•	"La calle": Una ciudadanía movilizada que exigía con determinación libertad y amnistía.
•	La sombra del terrorismo: La transición convivió con la violencia de grupos como ETA, el GRAPO y diversas facciones de extrema derecha.
2.2. Los Pactos de la Moncloa (1977)
Para estabilizar el país, se alcanzó un compromiso histórico basado en la cultura del "Consenso". Estos pactos fueron vitales para:
•	Saneamiento Económico: España arrastraba las consecuencias de la crisis del petróleo de 1973, con una inflación superior al 26% y un aumento alarmante del paro.
•	Estabilidad Política: Representaron el acuerdo entre partidos y sindicatos para reconciliar a antiguos cuadros franquistas con la oposición democrática, permitiendo el desmantelamiento de las instituciones del Movimiento Nacional.

3. El Marco Constitucional de 1978
El espíritu de concordia alcanzó su cénit con la redacción de la Constitución de 1978, elaborada por los llamados "Padres de la Constitución" para integrar todas las sensibilidades del arco parlamentario.
3.1. Definición del Estado y Organización Política
El texto constitucional estableció los cimientos del nuevo sistema:
•	Forma Política: Define a España como una Monarquía Parlamentaria.
•	Naturaleza del Estado: Se constituye como un Estado social y democrático de derecho.
•	Poderes: Establece la separación de poderes y un sistema bicameral (Congreso y Senado).
•	Confesionalidad: Supone una ruptura ideológica al definir a España como un Estado no confesional, aunque mantiene una mención expresa a la Iglesia Católica.
3.2. Organización Social y Territorial
•	Derechos Civiles: Reconoce una amplia tabla de derechos y libertades.
•	Título VIII (Estado de las Autonomías): Respuesta a las demandas históricas de autogobierno en Cataluña, el País Vasco y Galicia.
•	Modelo Económico: Reconoce la libertad de empresa en una economía de mercado, con potestad estatal para intervenir por el interés general.
Su ratificación en referéndum el 6 de diciembre de 1978 la convirtió en el marco de convivencia más duradero de la historia del país.

4. Consolidación y Modernización (1979-1996)
Superada la fase constituyente, la democracia tuvo que demostrar su resiliencia ante desafíos internos y externos.
4.1. Desafíos a la Estabilidad
•	El 23-F (1981): Tras la dimisión de Adolfo Suárez, el sistema resistió un dramático intento de golpe de Estado militar, cuya derrota fortaleció la democracia.
•	Alternancia Política: Se produjo la plena normalización con el triunfo del PSOE de Felipe González (1982) y, posteriormente, la alternancia pacífica hacia la derecha con el PP de José María Aznar (1996).
4.2. Apertura Internacional y Progreso Social
•	Integración Europea: España entró en la Comunidad Económica Europea (CEE) en 1986 y se integró en la OTAN. La llegada de fondos estructurales permitió un crecimiento acelerado.
•	Modernización Social: Se reformó el ejército, se despenalizó el aborto y se universalizaron la sanidad y la educación.
•	Cultura: La "Movida Madrileña" simbolizó la explosión de libertad frente al conservadurismo previo.
•	Economía: Se realizó una necesaria reconversión industrial para superar el atraso técnico.

5. España en la Actualidad: Desafíos del Siglo XXI
La historia reciente está marcada por la alternancia política entre figuras como Zapatero, Rajoy y Sánchez, en un entorno de plena integración europea pero también de crisis profundas.
5.1. Evolución del Mapa Político y Social
•	Fin del Bipartidismo: Irrupción de nuevas fuerzas políticas como Podemos, Ciudadanos y Vox.
•	Hitos de Convivencia y Tensiones: El final del terrorismo de ETA en 2011 frente al desafío del proceso independentista en Cataluña en 2017.
•	Nuevos Derechos: Avances en matrimonio igualitario, la ley de dependencia y el auge de movimientos como el feminismo y el ecologismo.
5.2. Hitos Económicos y Retos Pendientes
•	El Euro: Adoptado en 2002 como moneda única.
•	Crisis Financieras: El fuerte impacto de la crisis de 2008 (sector inmobiliario y empleo juvenil) y la frenada económica por la crisis global del COVID-19.
•	Retos Estructurales: Persisten problemas como el envejecimiento poblacional, el control de la deuda pública y la necesidad de una vertebración territorial armónica.`,

    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/IdRksxYyhrs",
  },
];
export type Bloque = {
  id: string;
  titulo: string;
  temas: string[];
};

export const BLOQUES_HISTORIA: Bloque[] = [
  {
    id: "bloque-1",
    titulo: "Prehistoria y pueblos prerromanos",
    temas: ["tema-1", "tema-2", "tema-3", "tema-4"],
  },
  {
    id: "bloque-2",
    titulo: "Romanización y mundo visigodo",
    temas: ["tema-5", "tema-6", "tema-7", "tema-8"],
  },
  {
    id: "bloque-3",
    titulo: "Al-Ándalus y reinos cristianos",
    temas: ["tema-9", "tema-10", "tema-11", "tema-12"],
  },
  {
    id: "bloque-4",
    titulo: "Monarquía Hispánica",
    temas: ["tema-13", "tema-14", "tema-15", "tema-16"],
  },
  {
    id: "bloque-5",
    titulo: "Crisis del siglo XVII y cambio dinástico",
    temas: ["tema-17", "tema-18", "tema-18-bis", "tema-19"],
  },
  {
    id: "bloque-6",
    titulo: "Ilustración y crisis del Antiguo Régimen",
    temas: ["tema-20", "tema-21", "tema-22", "tema-23"],
  },
  {
    id: "bloque-7",
    titulo: "Estado liberal",
    temas: ["tema-23-bis", "tema-24", "tema-24-bis", "tema-25"],
  },
  {
    id: "bloque-8",
    titulo: "Restauración y crisis",
    temas: ["tema-26", "tema-26-bis", "tema-26-ter", "tema-27"],
  },
  {
    id: "bloque-9",
    titulo: "Siglo XX y democracia",
    temas: ["tema-28", "tema-29", "tema-30"],
  },
];
export type TestQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export type ShortQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  answer: string;
  keywords: string[];
};
export type BlockExam = {
  id: string;
  blockId: string;

  cuestiones: {
    question: string;
    answer: string;
    keywords: string[];
  }[];

  documento: {
    tipo: "texto" | "imagen";
    contenido: string;
    preguntas: {
      pregunta: string;
      answer: string;
      keywords: string[];
    }[];
  };

  tema: {
    titulo: string;
    answer: string;
    keywords: string[];
  };
};

export type FinalExam = BlockExam;
export type TopicProgress = {
  topicSlug: string;
  quizPassed: number;
  shortPassed: boolean;
};

export type BlockProgress = {
  blockId: string;
  examPassed: boolean;
};

export type CourseProgress = {
  topics: Record<string, TopicProgress>;
  blocks: Record<string, BlockProgress>;
  finalExamsPassed: number;
};
export const RULES = {
  QUIZ_TOTAL: 20,
  QUIZ_MIN_CORRECT: 16,

  SHORT_TOTAL: 5,
  SHORT_MIN_CORRECT: 4,

  QUIZ_REQUIRED: 5,

  BLOCK_EXAM_MIN: 80,
  FINAL_EXAM_MIN: 80,
};
export const canUnlockNextTopic = (
  progress: TopicProgress
): boolean => {
  return (
    progress.quizPassed >= RULES.QUIZ_REQUIRED &&
    progress.shortPassed === true
  );
};

export const isTopicCompleted = (progress: TopicProgress): boolean => {
  return canUnlockNextTopic(progress);
};

export const isBlockCompleted = (
  blockId: string,
  topics: TopicProgress[],
  blockProgress: BlockProgress
): boolean => {
  const block = BLOQUES_HISTORIA.find((b) => b.id === blockId);
  if (!block) return false;

  const allTopicsCompleted = block.temas.every((slug) =>
    topics.find((t) => t.topicSlug === slug && isTopicCompleted(t))
  );

  return allTopicsCompleted && blockProgress.examPassed;
};

export const isCourseCompleted = (
  blocks: BlockProgress[],
  course: CourseProgress
): boolean => {
  const allBlocksCompleted = BLOQUES_HISTORIA.every((b) =>
    blocks.find((bp) => bp.blockId === b.id && bp.examPassed)
  );

  return allBlocksCompleted && course.finalExamsPassed >= 3;
};
export const getNextTopic = (currentSlug: string): string | null => {
  const index = temasHistoria.findIndex((t) => t.slug === currentSlug);
  if (index === -1) return null;

  const next = temasHistoria[index + 1];
  return next ? next.slug : null;
};

export const getBlockByTopic = (topicSlug: string) => {
  return BLOQUES_HISTORIA.find((b) =>
    b.temas.includes(topicSlug)
  );
};

export const isLastTopicOfBlock = (topicSlug: string): boolean => {
  const block = getBlockByTopic(topicSlug);
  if (!block) return false;

  return block.temas[block.temas.length - 1] === topicSlug;
};
export const calculateQuizScore = (
  correct: number
): number => {
  return Math.round((correct / RULES.QUIZ_TOTAL) * 100);
};

export const calculateShortScore = (
  correct: number
): number => {
  return Math.round((correct / RULES.SHORT_TOTAL) * 100);
};

export const isQuizPassed = (correct: number): boolean => {
  return correct >= RULES.QUIZ_MIN_CORRECT;
};

export const isShortPassed = (correct: number): boolean => {
  return correct >= RULES.SHORT_MIN_CORRECT;
};

export const isExamPassed = (score: number): boolean => {
  return score >= RULES.BLOCK_EXAM_MIN;
};
export const INITIAL_PROGRESS: CourseProgress = {
  topics: {},
  blocks: {},
  finalExamsPassed: 0,
};
export const createEmptyTopicProgress = (
  topicSlug: string
): TopicProgress => ({
  topicSlug,
  quizPassed: 0,
  shortPassed: false,
});

export const createEmptyBlockProgress = (
  blockId: string
): BlockProgress => ({
  blockId,
  examPassed: false,
});
export const recordQuizResult = (
  progress: TopicProgress,
  correct: number
): TopicProgress => {
  if (isQuizPassed(correct)) {
    return {
      ...progress,
      quizPassed: progress.quizPassed + 1,
    };
  }
  return progress;
};

export const recordShortResult = (
  progress: TopicProgress,
  correct: number
): TopicProgress => {
  if (isShortPassed(correct)) {
    return {
      ...progress,
      shortPassed: true,
    };
  }
  return progress;
};
export const recordBlockExamResult = (
  progress: BlockProgress,
  score: number
): BlockProgress => {
  if (isExamPassed(score)) {
    return {
      ...progress,
      examPassed: true,
    };
  }
  return progress;
};

export const recordFinalExamResult = (
  currentPassed: number,
  score: number
): number => {
  if (isExamPassed(score)) {
    return currentPassed + 1;
  }
  return currentPassed;
};
export const getInitialTopicProgressMap = (): Record<string, TopicProgress> => {
  const map: Record<string, TopicProgress> = {};

  temasHistoria.forEach((tema) => {
    map[tema.slug] = createEmptyTopicProgress(tema.slug);
  });

  return map;
};

export const getInitialBlockProgressMap = (): Record<string, BlockProgress> => {
  const map: Record<string, BlockProgress> = {};

  BLOQUES_HISTORIA.forEach((bloque) => {
    map[bloque.id] = createEmptyBlockProgress(bloque.id);
  });

  return map;
};
export const isTopicUnlocked = (
  topicSlug: string,
  progressMap: Record<string, TopicProgress>
): boolean => {
  const topicIndex = temasHistoria.findIndex((t) => t.slug === topicSlug);

  if (topicIndex === 0) return true;

  const prevTopic = temasHistoria[topicIndex - 1];
  const prevProgress = progressMap[prevTopic.slug];

  if (!prevProgress) return false;

  return isTopicCompleted(prevProgress);
};
export const isBlockUnlocked = (
  blockId: string,
  topicProgressMap: Record<string, TopicProgress>,
  blockProgressMap: Record<string, BlockProgress>
): boolean => {
  const blockIndex = BLOQUES_HISTORIA.findIndex((b) => b.id === blockId);

  if (blockIndex === 0) return true;

  const prevBlock = BLOQUES_HISTORIA[blockIndex - 1];
  const prevBlockProgress = blockProgressMap[prevBlock.id];

  if (!prevBlockProgress) return false;

  return prevBlockProgress.examPassed;
};
export const isFinalUnlocked = (
  blockProgressMap: Record<string, BlockProgress>
): boolean => {
  return BLOQUES_HISTORIA.every(
    (b) => blockProgressMap[b.id]?.examPassed === true
  );
};
