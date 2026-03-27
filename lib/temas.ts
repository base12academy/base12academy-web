export type BloqueRecurso = {
  titulo: string;
  descripcion: string;
  imagen?: string;
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
};
export const IMAGENES_BLOQUES: Record<string, BloqueRecurso[]> = {
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
    imagen: "/images/altamira.jpg"
  }
],
  "bloque-2": [
    { titulo: "Acueducto de Segovia", descripcion: "Obra de ingeniería civil romana del siglo II d.C." },
    { titulo: "Teatro Romano de Mérida", descripcion: "Construcción para espectáculos del siglo I a.C." }
  ],
  "bloque-3": [
    { titulo: "Planta de la Mezquita de Córdoba", descripcion: "Diagrama arquitectónico del edificio omeya (siglos VIII-X)." },
    { titulo: "Mapa de la expansión de los reinos cristianos", descripcion: "Cartografía de la Península Ibérica entre los siglos VIII y XV." }
  ],
  "bloque-4": [
    { titulo: "Rendición de Granada", descripcion: "Óleo de Francisco Pradilla sobre la entrega de 1492." },
    { titulo: "Reyes Católicos", descripcion: "Iconografía de Isabel I y Fernando II." },
    { titulo: "Mapa del Imperio de Carlos I", descripcion: "Posesiones de los Habsburgo en el siglo XVI." },
    { titulo: "Monasterio de El Escorial", descripcion: "Complejo arquitectónico de Juan de Herrera." }
  ],
  "bloque-5": [
    { titulo: "La rendición de Breda", descripcion: "Cuadro de Velázquez (1625)." },
    { titulo: "Mapa Decretos de Nueva Planta", descripcion: "División administrativa borbónica." }
  ],
  "bloque-6": [
    { titulo: "Carlos III", descripcion: "Retrato de Mengs." },
    { titulo: "El quitasol", descripcion: "Cartón de Goya." },
    { titulo: "Familia de Carlos IV", descripcion: "Retrato de Goya." },
    { titulo: "Carga de los Mamelucos", descripcion: "2 de mayo de 1808." },
    { titulo: "Fusilamientos del 3 de mayo", descripcion: "Represión napoleónica." },
    { titulo: "Constitución de 1812", descripcion: "Alegoría de 'La Pepa'." },
    { titulo: "Torrijos", descripcion: "Fusilamiento en Málaga." }
  ],
  "bloque-7": [
    { titulo: "Mapa Guerra Carlista", descripcion: "1833-1840." },
    { titulo: "La Flaca", descripcion: "Caricatura de 1868." },
    { titulo: "Primera República", descripcion: "Alegoría con gorro frigio." }
  ],
  "bloque-8": [
    { titulo: "Cánovas y Sagasta", descripcion: "Sistema del turno." },
    { titulo: "Desastre del 98", descripcion: "Últimas colonias." },
    { titulo: "Proclamación Segunda República", descripcion: "14 de abril de 1931." }
  ],
  "bloque-9": [
    { titulo: "Guernica", descripcion: "Picasso (1937)." },
    { titulo: "Mapa Guerra Civil", descripcion: "1936-1939." },
    { titulo: "Hendaya", descripcion: "Franco y Hitler (1940)." },
    { titulo: "Bienvenido Mr Marshall", descripcion: "Cartel cinematográfico." },
    { titulo: "Muerte de Franco", descripcion: "Portada prensa 1975." },
    { titulo: "El Abrazo", descripcion: "Transición." },
    { titulo: "Constitución 1978", descripcion: "Firma oficial." }
  ]
};
export const TEXTOS_BLOQUES: Record<string, BloqueRecurso[]> = {
  "bloque-1": [],
  "bloque-2": [
    { titulo: "Edicto de Milán (313)", descripcion: "Decreto de libertad religiosa en el Imperio Romano." }
  ],
  "bloque-3": [
    { titulo: "Código de las Siete Partidas", descripcion: "Cuerpo normativo del reino de Castilla redactado bajo Alfonso X." },
    { titulo: "Tratado de Almizra (1244)", descripcion: "Acuerdo fronterizo entre Castilla y Aragón para el reparto del Reino de Murcia." }
  ],
  "bloque-4": [
    { titulo: "Tratado de Alcaçovas (1479)", descripcion: "Acuerdo de paz entre Castilla y Portugal." },
    { titulo: "Capitulaciones de Santa Fe (1492)", descripcion: "Acuerdos entre los Reyes Católicos y Cristóbal Colón." },
    { titulo: "Edicto de Granada (1492)", descripcion: "Decreto de expulsión de los judíos." },
    { titulo: "Tratado de Tordesillas (1494)", descripcion: "Reparto del Atlántico y el Nuevo Mundo." },
    { titulo: "Testamento de Isabel la Católica (1504)", descripcion: "Documento sucesorio de Isabel I." },
    { titulo: "Leyes de Burgos (1512)", descripcion: "Primeras leyes para la organización de la conquista." },
    { titulo: "Requerimiento (1513)", descripcion: "Texto legal leído a los indígenas americanos." },
    { titulo: "Leyes Nuevas (1542)", descripcion: "Reforma del gobierno de Indias y protección de los naturales." },
    { titulo: "Decreto de expulsión de los moriscos (1609)", descripcion: "Orden de Felipe III." },
    { titulo: "Tratado de Westfalia (1648)", descripcion: "Fin de la Guerra de los Treinta Años." },
    { titulo: "Testamento de Carlos II (1700)", descripcion: "Designación de Felipe de Anjou como heredero." }
  ],
  "bloque-5": [
    { titulo: "Tratado de Utrecht (1713)", descripcion: "Acuerdo de paz tras la Guerra de Sucesión." },
    { titulo: "Decreto de Nueva Planta para Aragón y Valencia (1707)", descripcion: "Abolición de los fueros de la Corona de Aragón." }
  ],
  "bloque-6": [
    { titulo: "Tratado de la Tercera Unión de Familia (1761)", descripcion: "Alianza militar entre España y Francia." },
    { titulo: "Real Pragmática de Expulsión de los Jesuitas (1767)", descripcion: "Orden de Carlos III." },
    { titulo: "Informe sobre la Ley Agraria de Jovellanos (1795)", descripcion: "Informe sobre la tierra y su explotación." },
    { titulo: "Tratado de Fontainebleau (1807)", descripcion: "Acuerdo para invadir Portugal." },
    { titulo: "Abdicaciones de Bayona (1808)", descripcion: "Renuncia al trono en favor de Napoleón." },
    { titulo: "Proclama de la Junta Suprema de Sevilla (1808)", descripcion: "Declaración de guerra a Francia." },
    { titulo: "Constitución de 1812", descripcion: "Primer texto constitucional español." },
    { titulo: "Manifiesto de los Persas (1814)", descripcion: "Petición para restaurar el Antiguo Régimen." },
    { titulo: "Edicto de Valencia o Real Decreto de 4 de mayo (1814)", descripcion: "Anulación de la Constitución de 1812." },
    { titulo: "Manifiesto de Riego (1820)", descripcion: "Proclama que inicia el Trienio Liberal." },
    { titulo: "Decreto de 1 de octubre (1823)", descripcion: "Anulación del gobierno constitucional." },
    { titulo: "Pragmática Sanción de 1830", descripcion: "Permite la sucesión femenina." }
  ],
  "bloque-7": [
    { titulo: "Estatuto Real (1834)", descripcion: "Carta otorgada por María Cristina." },
    { titulo: "Real Decreto de Desamortización de Mendizábal (1836)", descripcion: "Venta de bienes del clero regular." },
    { titulo: "Constitución de 1837", descripcion: "Texto constitucional progresista." },
    { titulo: "Constitución de 1845", descripcion: "Texto constitucional moderado." },
    { titulo: "Ley de Desamortización de Madoz (1855)", descripcion: "Venta de bienes municipales." },
    { titulo: "Manifiesto de Manzanares (1854)", descripcion: "Documento del Bienio Progresista." },
    { titulo: "Manifiesto España con honra (1868)", descripcion: "Inicio de la Revolución Gloriosa." },
    { titulo: "Constitución de 1869", descripcion: "Constitución democrática del Sexenio." },
    { titulo: "Abdicación de Amadeo de Saboya (1873)", descripcion: "Renuncia oficial al trono." }
  ],
  "bloque-8": [
    { titulo: "Manifiesto de Sandhurst (1874)", descripcion: "Programa político de Alfonso XII." },
    { titulo: "Constitución de 1876", descripcion: "Norma fundamental del sistema canovista." },
    { titulo: "Tratado de Zanjón (1878)", descripcion: "Fin de la Guerra de los Diez Años en Cuba." },
    { titulo: "Tratado de París (1898)", descripcion: "Pérdida de las últimas colonias." },
    { titulo: "Ley de Jurisdicciones (1906)", descripcion: "Protección militar de patria y ejército." },
    { titulo: "Manifiesto de Primo de Rivera (1923)", descripcion: "Justificación del golpe de Estado." },
    { titulo: "Manifiesto de despedida de Alfonso XIII (1931)", descripcion: "Renuncia al ejercicio del poder real." },
    { titulo: "Constitución de 1931", descripcion: "Constitución democrática y laica." }
  ],
  "bloque-9": [
    { titulo: "Alocución de Franco en Las Palmas (1936)", descripcion: "Proclama de sublevación militar." },
    { titulo: "Constitución de 1978", descripcion: "Norma suprema del Estado democrático español." },
    { titulo: "Tratado de Adhesión de España a la CEE (1985)", descripcion: "Integración en la Comunidad Económica Europea." }
  ]
};

export const temasHistoria: Tema[] = [
{
  slug: "tema-1",
  titulo: "Tema 1: LA PREHISTORIA EN LA PENINSULA IBERICA",
  descripcion: "Primeros pobladores, Paleolitico, Neolitico y Edad de los Metales.",
  indice: "1. El Paleolitico y el proceso de hominizacion.\n2. Organizacion socioeconomica y cultura en el Paleolitico.\n3. El arte rupestre: escuelas y simbolismo.\n4. La revolucion neolitica.\n5. La Edad de los Metales.\n6. Protohistoria: culturas indigenas y colonizadores.",
  contenido: `TEMA 1: LA PREHISTORIA EN LA PENINSULA IBERICA

I. EL PALEOLITICO EN LA PENINSULA (1300000 - 10000 a.C.)
Contexto histórico y desarrollo: La Peninsula Iberica fue un escenario clave en el proceso de hominizacion en Europa. Segun los hallazgos en la Sierra de Atapuerca, el poblamiento comenzo hace aproximadamente 1,2 millones de anos con Homo antecessor. Le siguieron Homo heidelbergensis, Homo neanderthalensis y, finalmente, Homo sapiens.

Organización social y economía:
- Economia: se basaba en un modelo depredador. La supervivencia dependia de la caza, la pesca y la recoleccion.
- Sociedad: eran grupos nomadas organizados en pequenas bandas.

Cultura e ideologia:
Aparecen las primeras manifestaciones espirituales y los primeros enterramientos.

II. ARTE RUPESTRE Y FORMAS DE VIDA

- Escuela franco-cantabrica: Altamira. Realismo, policromia y funcion magica.
- Escuela levantina: escenas humanas, monocroma y esquematica.

III. EL NEOLITICO (6000 - 3000 a.C.)

- Agricultura y ganaderia
- Sedentarismo
- Excedentes y jerarquia social
- Ceramica cardial

IV. EDAD DE LOS METALES (3000 - 800 a.C.)

- Cobre: Los Millares
- Bronce: El Argar
- Comercio de metales
- Aumento de la desigualdad social

V. CULTURAS PROTOHISTORICAS

- Tartessos
- Iberos y celtas
- Introduccion de la moneda y la escritura
- Dama de Elche

Consecuencia: fin de la Prehistoria y base para la posterior romanizacion.`,
  estado: "completado",
  videoUrl: "https://www.youtube.com/embed/Q4B2Cpf453k",
},
  {
    slug: "tema-2",
    titulo: "Tema 2: PUEBLOS PRERROMANOS Y COLONIZACIONES HISTÓRICAS",
    descripcion: "Íberos, celtas, celtíberos y primeros contactos coloniales.",
    indice: "",
    contenido: "Contenido del tema 2.",
    estado: "completado",
    videoUrl: "https://www.youtube.com/embed/wJRHxOSp4Ok",
  },
  {
    slug: "tema-3",
    titulo: "Tema 3: COLONIZACIONES MEDITERRÁNEAS",
    descripcion: "Fenicios, griegos y cartagineses en la Península Ibérica.",
    indice: "",
    contenido: "Contenido del tema 3.",
    estado: "en-progreso",
    videoUrl: "https://www.youtube.com/embed/ZLQ0YtOYhg0",
  },
  {
    slug: "tema-4",
    titulo: "Tema 4: LA CONQUISTA ROMANA DE HISPANIA",
    descripcion: "Conquista, fases y organización del territorio hispano.",
    indice: "",
    contenido: "Contenido del tema 4.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/adX5lmyP33g",
  },
  {
    slug: "tema-5",
    titulo: "Tema 5: LA ROMANIZACIÓN",
    descripcion: "Integración cultural, social, jurídica y económica en Roma.",
    indice: "",
    contenido: "Contenido del tema 5.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/XdSNz-d34xE",
  },
  {
    slug: "tema-6",
    titulo: "Tema 6: CRISIS DEL IMPERIO Y REINO VISIGODO",
    descripcion: "Fin del Imperio romano y configuración del reino visigodo.",
    indice: "",
    contenido: "Contenido del tema 6.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/eK4R9Uqrzb4",
  },
  {
    slug: "tema-7",
    titulo: "Tema 7: LA CONQUISTA MUSULMANA",
    descripcion: "Invasión musulmana y primeros años de dominación.",
    indice: "",
    contenido: "Contenido del tema 7.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/xAsYpzvnPlM",
  },
  {
    slug: "tema-8",
    titulo: "Tema 8: EVOLUCIÓN POLÍTICA DE AL-ÁNDALUS",
    descripcion: "Emirato, califato, taifas e intervención norteafricana.",
    indice: "",
    contenido: "Contenido del tema 8.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Tzo3U3KtJu0",
  },
  {
    slug: "tema-9",
    titulo: "Tema 9: SOCIEDAD Y ECONOMÍA DE AL-ÁNDALUS",
    descripcion: "Grupos sociales, agricultura, comercio y vida urbana.",
    indice: "",
    contenido: "Contenido del tema 9.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/W4EZQIn88_o",
  },
  {
    slug: "tema-10",
    titulo: "Tema 10: FORMACIÓN DE LOS REINOS CRISTIANOS",
    descripcion: "Orígenes y consolidación de los núcleos cristianos.",
    indice: "",
    contenido: "Contenido del tema 10.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/SAzwGMBT05A",
  },
  {
    slug: "tema-11",
    titulo: "Tema 11: EXPANSIÓN CRISTIANA Y REPOBLACIÓN",
    descripcion: "Avance territorial cristiano y modelos de repoblación.",
    indice: "",
    contenido: "Contenido del tema 11.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/j7ZV-sI3o0g",
  },
  {
    slug: "tema-12",
    titulo: "Tema 12: CRISIS DE LA BAJA EDAD MEDIA",
    descripcion: "Conflictos políticos, crisis demográfica y tensiones sociales.",
    indice: "",
    contenido: "Contenido del tema 12.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/ryatzFjWcDI",
  },
  {
    slug: "tema-13",
    titulo: "Tema 13: LOS REYES CATÓLICOS",
    descripcion: "Unión dinástica, política interior y expansión exterior.",
    indice: "",
    contenido: "Contenido del tema 13.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/4LOcyPkD0PI",
  },
  {
    slug: "tema-14",
    titulo: "Tema 14: CARLOS I (1516-1556)",
    descripcion: "Monarquía hispánica y conflictos internos y exteriores.",
    indice: "",
    contenido: "Contenido del tema 14.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/lwdTu3Pz0Rc",
  },
  {
    slug: "tema-15",
    titulo: "Tema 15: FELIPE II (1556-1598)",
    descripcion: "Apogeo y dificultades del imperio de Felipe II.",
    indice: "",
    contenido: "Contenido del tema 15.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/mvgPJcWPgCQ",
  },
  {
    slug: "tema-16",
    titulo: "Tema 16: LOS AUSTRIAS MENORES",
    descripcion: "Valimiento, gobierno y decadencia política.",
    indice: "",
    contenido: "Contenido del tema 16.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/2Tl86Qeo6VY",
  },
  {
    slug: "tema-17",
    titulo: "Tema 17: CRISIS DEL SIGLO XVII",
    descripcion: "Crisis económica, social y política de la monarquía hispánica.",
    indice: "",
    contenido: "Contenido del tema 17.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Oy0P-8RBI7o",
  },
  {
    slug: "tema-18",
    titulo: "Tema 18: Guerra de Sucesión y Cambio Dinástico",
    descripcion: "Fin de los Austrias y llegada de los Borbones.",
    indice: "",
    contenido: "Contenido del tema 18.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/nlOgoDUs5_U",
  },
  {
    slug: "tema-18-bis",
    titulo: "Tema 18 bis: América en el siglo XVIII",
    descripcion: "Administración, economía y reformas en la América borbónica.",
    indice: "",
    contenido: "Contenido del tema 18 bis.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/N90LgNskWcw",
  },
  {
    slug: "tema-19",
    titulo: "Tema 19: Reformas Borbónicas",
    descripcion: "Centralización, administración y modernización del Estado.",
    indice: "",
    contenido: "Contenido del tema 19.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/qsC3QshFVVo",
  },
  {
    slug: "tema-20",
    titulo: "Tema 20: La Ilustración en España",
    descripcion: "Ideas ilustradas, reformismo y cultura del siglo XVIII.",
    indice: "",
    contenido: "Contenido del tema 20.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/gNWLphzTP5I",
  },
  {
    slug: "tema-21",
    titulo: "Tema 21: La Guerra de Independencia",
    descripcion: "Invasión napoleónica, resistencia y consecuencias.",
    indice: "",
    contenido: "Contenido del tema 21.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/B-MlID3irTI",
  },
  {
    slug: "tema-22",
    titulo: "Tema 22: Las Cortes de Cádiz y la Constitución de 1812",
    descripcion: "Nacimiento del liberalismo político español.",
    indice: "",
    contenido: "Contenido del tema 22.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/3id7T6-QpVg",
  },
  {
    slug: "tema-23",
    titulo: "Tema 23: Fernando VII y el absolutismo",
    descripcion: "Restauración absolutista, liberalismo y conflicto político.",
    indice: "",
    contenido: "Contenido del tema 23.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/dTRW3Ouplj4",
  },
  {
    slug: "tema-23-bis",
    titulo: "Tema 23 bis: La revolución industrial en España",
    descripcion: "Industrialización, transportes y cambios económicos.",
    indice: "",
    contenido: "Contenido del tema 23 bis.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/NEvGm-3PxNA",
  },
  {
    slug: "tema-24",
    titulo: "Tema 24: CONSTRUCCIÓN DEL ESTADO LIBERAL (1833-1868)",
    descripcion: "Reinado de Isabel II y consolidación del liberalismo.",
    indice: "",
    contenido: "Contenido del tema 24.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/3FHQpy4zOWM",
  },
  {
    slug: "tema-24-bis",
    titulo: "Tema 24 bis: El Sexenio Democrático (1868–1874)",
    descripcion: "Revolución, monarquía democrática, república y crisis.",
    indice: "",
    contenido: "Contenido del tema 24 bis.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/bBaZD3qQpk4",
  },
  {
    slug: "tema-25",
    titulo: "Tema 25: El sistema de la Restauración",
    descripcion: "Constitución de 1876, turnismo y estabilidad aparente.",
    indice: "",
    contenido: "Contenido del tema 25.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Wy4QH4zu8UQ",
  },
  {
    slug: "tema-26",
    titulo: "Tema 26: Crisis de la Restauración (1902–1930)",
    descripcion: "Inestabilidad política, conflictividad social y dictadura.",
    indice: "",
    contenido: "Contenido del tema 26.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/GnCk7diHWqw",
  },
  {
    slug: "tema-26-bis",
    titulo: "Tema 26 bis: La guerra de Cuba (1895–1898)",
    descripcion: "Conflicto colonial y final del imperio ultramarino.",
    indice: "",
    contenido: "Contenido del tema 26 bis.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/D1s6Yhc_OUc",
  },
  {
    slug: "tema-26-ter",
    titulo: "Tema 26 ter: El desastre del 98 y el regeneracionismo",
    descripcion: "Crisis nacional y respuestas regeneracionistas.",
    indice: "",
    contenido: "Contenido del tema 26 ter.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/7JOCYiUSwPU",
  },
  {
    slug: "tema-27",
    titulo: "Tema 27: La Segunda República (1931–1936)",
    descripcion: "Reformas, conflictos y polarización política.",
    indice: "",
    contenido: "Contenido del tema 27.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/GNZeQOJAbWc",
  },
  {
    slug: "tema-28",
    titulo: "Tema 28: La Guerra Civil (1936–1939)",
    descripcion: "Golpe militar, desarrollo del conflicto y consecuencias.",
    indice: "",
    contenido: "Contenido del tema 28.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/Ci1D4rHjmkg",
  },
  {
    slug: "tema-29",
    titulo: "Tema 29: El franquismo (1939–1975)",
    descripcion: "Dictadura, autarquía, desarrollismo y oposición.",
    indice: "",
    contenido: "Contenido del tema 29.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/_U7hHKZz9DU",
  },
  {
    slug: "tema-30",
    titulo: "Tema 30: Transición y democracia (1975–Actualidad)",
    descripcion: "Transición, Constitución de 1978 y evolución democrática.",
    indice: "",
    contenido: "Contenido del tema 30.",
    estado: "bloqueado",
    videoUrl: "https://www.youtube.com/embed/IdRksxYyhrs",
  },
];