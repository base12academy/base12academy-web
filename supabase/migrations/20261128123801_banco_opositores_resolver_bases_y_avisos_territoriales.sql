-- Bases y seguimiento contrastados con las referencias oficiales del BOC y BOCYL.
-- Los registros históricos se publican sin encolar alertas.
create temporary table verified_roots (
  method text, ref text primary key, slug text, title text, summary text, organisation text,
  administration text, territory text, group_category text, vacancies integer, access_system text,
  publication_date date, official_url text, pdf_url text, application_url text,
  syllabus boolean, exam_date date, status text
) on commit drop;

insert into verified_roots values
  ('boc_rss', 'BOC-A-2026-208-3589', 'listas-extraordinarias-de-personal-docente-interino-del-servicio-canario-de-empleo-boc-a-2026-208-3589', 'Listas extraordinarias de personal docente interino del Servicio Canario de Empleo', 'Listas para proyectos de formación en alternancia con el empleo y otros programas formativos del Servicio Canario de Empleo. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Servicio Canario de Empleo', 'Administración autonómica', 'Canarias', null, null, 'Procedimiento extraordinario de listas de empleo', '2026-10-19', 'https://www.gobiernodecanarias.org/boc/2026/208/3589.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-208-3589.pdf', 'https://sede.gobiernodecanarias.org/sede/tramites/11110', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-215-3699', 'profesorado-permanente-laboral-de-la-universidad-de-la-laguna-boc-a-2026-215-3699', 'Profesorado Permanente Laboral de la Universidad de La Laguna', '24 plazas de profesorado permanente laboral. Los perfiles se publicaron en el anexo. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Universidad de La Laguna', 'Universidad', 'Canarias', null, 24, 'Concurso público', '2026-10-27', 'https://www.gobiernodecanarias.org/boc/2026/215/3699.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-215-3699.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/640', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-215-3700', 'profesorado-ayudante-doctor-de-la-universidad-de-la-laguna-convocatoria-de-octubre-boc-a-2026-215-3700', 'Profesorado Ayudante Doctor de la Universidad de La Laguna, convocatoria de octubre', 'Convocatoria del Programa de Incorporación de Talento Docente e Investigador. Se exige el título de Doctor o Doctora. Consultar el anexo para los perfiles. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Universidad de La Laguna', 'Universidad', 'Canarias', null, null, 'Concurso público', '2026-10-27', 'https://www.gobiernodecanarias.org/boc/2026/215/3700.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-215-3700.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/639', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-216-3712', 'profesorado-permanente-laboral-vinculado-de-la-universidad-de-la-laguna-resolucion-de-1-boc-a-2026-216-3712', 'Profesorado Permanente Laboral vinculado de la Universidad de La Laguna, resolución de 15 de octubre', '10 plazas de profesorado permanente laboral vinculadas al Servicio Canario de la Salud. Los puestos se identifican en el anexo. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Universidad de La Laguna y Servicio Canario de la Salud', 'Universidad', 'Canarias', null, 10, 'Concurso público', '2026-10-28', 'https://www.gobiernodecanarias.org/boc/2026/216/3712.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-216-3712.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/640', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-217-3727', 'profesorado-permanente-laboral-vinculado-de-la-universidad-de-la-laguna-resolucion-de-1-boc-a-2026-217-3727', 'Profesorado Permanente Laboral vinculado de la Universidad de La Laguna, resolución de 19 de octubre', '7 plazas de profesorado permanente laboral vinculadas a puestos asistenciales. Los puestos se identifican en el anexo. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Universidad de La Laguna y Servicio Canario de la Salud', 'Universidad', 'Canarias', null, 7, 'Concurso público', '2026-10-29', 'https://www.gobiernodecanarias.org/boc/2026/217/3727.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-217-3727.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/640', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-218-3737', 'cuerpo-de-gestion-escala-de-gestion-de-administracion-parlamentaria-de-canarias-boc-a-2026-218-3737', 'Cuerpo de Gestión, Escala de Gestión de Administración Parlamentaria de Canarias', '4 plazas: 2 de promoción interna, 1 de turno libre y 1 de turno libre reservada a personas con discapacidad. El plazo original fue de 20 días hábiles desde el día siguiente a la publicación en el BOC.', 'Parlamento de Canarias', 'Administración autonómica', 'Canarias', 'B', 4, 'Concurso-oposición', '2026-10-30', 'https://www.gobiernodecanarias.org/boc/2026/218/3737.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-218-3737.pdf', 'https://sede.parcan.es/sede/es/empleo-publico', true, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-223-3848', 'profesorado-ayudante-doctor-de-la-universidad-de-las-palmas-de-gran-canaria-boc-a-2026-223-3848', 'Profesorado Ayudante Doctor de la Universidad de Las Palmas de Gran Canaria', '2 plazas. El plazo original fue de 20 días naturales desde el día siguiente a la publicación. La corrección posterior cambió el número de uno de los concursos a 2608/9331.', 'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', null, 2, 'Concurso público', '2026-11-09', 'https://www.gobiernodecanarias.org/boc/2026/223/3848.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-223-3848.pdf', 'https://administracion.ulpgc.es', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-225-3896', 'profesorado-ayudante-doctor-de-la-universidad-de-la-laguna-convocatoria-de-noviembre-boc-a-2026-225-3896', 'Profesorado Ayudante Doctor de la Universidad de La Laguna, convocatoria de noviembre', '28 plazas, con 2 reservadas al cupo de discapacidad. La resolución de corrección amplió el plazo en 5 días hábiles a contar desde el día siguiente al cierre inicial del 25 de noviembre de 2026. Consultar los documentos exigidos al cupo de reserva en la corrección.', 'Universidad de La Laguna', 'Universidad', 'Canarias', null, 28, 'Concurso público', '2026-11-11', 'https://www.gobiernodecanarias.org/boc/2026/225/3896.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-225-3896.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/639', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-233-4036', 'profesorado-asociado-en-ciencias-de-la-salud-de-la-universidad-de-la-laguna-boc-a-2026-233-4036', 'Profesorado Asociado en Ciencias de la Salud de la Universidad de La Laguna', 'Plazas de profesorado asociado en Ciencias de la Salud que quedaron vacantes en convocatorias anteriores. El plazo original fue de 10 días hábiles desde el día siguiente a la publicación en el BOC.', 'Universidad de La Laguna', 'Universidad', 'Canarias', null, null, 'Concurso público', '2026-11-19', 'https://www.gobiernodecanarias.org/boc/2026/233/4036.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-233-4036.pdf', 'https://sede.ull.es/ecivilis-site/catalog/showProcedure/648', null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-076-1266', 'promocion-interna-de-los-cuerpos-superior-facultativo-administrativo-y-auxiliar-de-cana-boc-a-2026-076-1266', 'Promoción interna de los cuerpos Superior Facultativo, Administrativo y Auxiliar de Canarias', 'Convocatoria conjunta por promoción interna horizontal y vertical. Consultar el anexo para cada cuerpo.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2026-04-21', 'https://www.gobiernodecanarias.org/boc/2026/076/1266.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-076-1266.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-057-948', 'acceso-libre-a-cuerpos-escalas-y-especialidades-de-la-administracion-general-de-canaria-boc-a-2026-057-948', 'Acceso libre a cuerpos, escalas y especialidades de la Administración General de Canarias', 'Convocatoria de acceso libre para varios cuerpos, escalas y especialidades de la Administración General.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2026-03-24', 'https://www.gobiernodecanarias.org/boc/2026/057/948.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-057-948.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-153-2746', 'personal-subalterno-de-canarias-reserva-para-personas-con-discapacidad-intelectual-boc-a-2026-153-2746', 'Personal Subalterno de Canarias, reserva para personas con discapacidad intelectual', 'Turno libre en la reserva específica para personas con discapacidad intelectual leve, moderada o límite. El ejercicio único se reprogramó para el 15 de noviembre de 2026.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2026-07-31', 'https://www.gobiernodecanarias.org/boc/2026/153/2746.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-153-2746.pdf', null, null, '2026-11-15', 'publicada'),
  ('boc_rss', 'BOC-A-2026-117-2024', 'escala-de-agentes-de-tributos-c1-de-la-agencia-tributaria-canaria-boc-a-2026-117-2024', 'Escala de Agentes de Tributos C1 de la Agencia Tributaria Canaria', 'Convocatoria de acceso libre y promoción interna. El historial incorpora la admisión definitiva y la modificación del tribunal.', 'Agencia Tributaria Canaria', 'Administración autonómica', 'Canarias', null, null, null, '2026-06-12', 'https://www.gobiernodecanarias.org/boc/2026/117/2024.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-117-2024.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-025-385', 'policia-canaria-escala-basica-empleo-policia-boc-a-2026-025-385', 'Policía Canaria, Escala Básica, Empleo Policía', 'Convocatoria de acceso libre de la Escala Básica. El historial recoge la admisión definitiva y las rectificaciones.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2026-02-06', 'https://www.gobiernodecanarias.org/boc/2026/025/385.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-025-385.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-204-3514', 'personal-tecnico-tcp4-para-movilidad-de-educacion-superior-boc-a-2026-204-3514', 'Personal técnico TCP4 para movilidad de Educación Superior', '1 plaza de personal técnico para el convenio 2025-1-ESO1-K131-HED-000308597. Consultar las bases y la modificación.', 'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', null, 1, null, '2026-10-13', 'https://www.gobiernodecanarias.org/boc/2026/204/3514.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-204-3514.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-203-3497', 'profesorado-asociado-a-tiempo-parcial-de-la-ulpgc-boc-a-2026-203-3497', 'Profesorado asociado a tiempo parcial de la ULPGC', 'Concurso público de profesorado asociado mediante contrato indefinido a tiempo parcial.', 'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', null, null, null, '2026-10-09', 'https://www.gobiernodecanarias.org/boc/2026/203/3497.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-203-3497.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2025-062-1251', 'policia-canaria-escala-superior-empleo-subcomisario-por-promocion-interna-boc-a-2025-062-1251', 'Policía Canaria, Escala Superior, Empleo Subcomisario por promoción interna', 'Convocatoria por promoción interna al empleo de Subcomisario o Subcomisaria de la Escala Superior.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2025-03-28', 'https://www.gobiernodecanarias.org/boc/2025/062/1251.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2025-062-1251.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2023-136-2291', 'policia-canaria-escala-superior-empleo-subcomisario-boc-a-2023-136-2291', 'Policía Canaria, Escala Superior, Empleo Subcomisario', 'Convocatoria de acceso libre al empleo de Subcomisario o Subcomisaria de la Escala Superior.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2023-07-13', 'https://www.gobiernodecanarias.org/boc/2023/136/2291.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2023-136-2291.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-245-3831', 'agrupacion-profesional-de-subalternos-de-canarias-acceso-libre-boc-a-2022-245-3831', 'Agrupación Profesional de Subalternos de Canarias, acceso libre', 'Convocatoria de acceso libre de la Agrupación Profesional de Subalternos, Grupo E.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2022-12-15', 'https://www.gobiernodecanarias.org/boc/2022/245/3831.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-245-3831.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-245-3816', 'cuerpo-superior-de-administradores-generales-de-canarias-promocion-interna-boc-a-2022-245-3816', 'Cuerpo Superior de Administradores Generales de Canarias, promoción interna', 'Convocatoria por promoción interna horizontal y vertical. El historial recoge la pérdida de vigencia de la lista adicional.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2022-12-15', 'https://www.gobiernodecanarias.org/boc/2022/245/3816.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-245-3816.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-245-3819', 'cuerpo-superior-de-administradores-generales-de-canarias-acceso-libre-boc-a-2022-245-3819', 'Cuerpo Superior de Administradores Generales de Canarias, acceso libre', 'Convocatoria de acceso libre. El historial recoge la pérdida de vigencia de la lista adicional.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2022-12-15', 'https://www.gobiernodecanarias.org/boc/2022/245/3819.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-245-3819.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-245-3826', 'tecnico-de-prevencion-de-canarias-acceso-libre-boc-a-2022-245-3826', 'Técnico de Prevención de Canarias, acceso libre', 'Convocatoria de acceso libre en la especialidad de Técnico de Prevención. El historial recoge la pérdida de vigencia de la lista adicional.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2022-12-15', 'https://www.gobiernodecanarias.org/boc/2022/245/3826.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-245-3826.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2023-243-4138', 'cuerpos-superior-de-gestion-administrativo-y-auxiliar-de-canarias-acceso-libre-boc-a-2023-243-4138', 'Cuerpos Superior, de Gestión, Administrativo y Auxiliar de Canarias, acceso libre', 'Convocatoria de acceso libre a diversos cuerpos de la Administración General de Canarias.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2023-12-13', 'https://www.gobiernodecanarias.org/boc/2023/243/4138.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2023-243-4138.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2024-239-3968', 'cuerpo-superior-facultativo-y-cuerpo-facultativo-tecnico-de-grado-medio-de-canarias-boc-a-2024-239-3968', 'Cuerpo Superior Facultativo y Cuerpo Facultativo Técnico de Grado Medio de Canarias', 'Convocatoria de acceso libre correspondiente a la oferta de 2021. El historial identifica las especialidades afectadas por cada resolución.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2024-11-29', 'https://www.gobiernodecanarias.org/boc/2024/239/3968.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2024-239-3968.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2025-077-1483', 'cuerpo-de-maestros-de-canarias-oferta-de-2023-boc-a-2025-077-1483', 'Cuerpo de Maestros de Canarias, oferta de 2023', 'Procedimiento selectivo de ingreso en el Cuerpo de Maestros correspondiente a la oferta de 2023.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2025-04-21', 'https://www.gobiernodecanarias.org/boc/2025/077/1483.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2025-077-1483.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2025-077-1484', 'profesorado-de-secundaria-y-otros-cuerpos-docentes-de-canarias-boc-a-2025-077-1484', 'Profesorado de Secundaria y otros cuerpos docentes de Canarias', 'Convocatoria de ingreso y acceso en varios cuerpos docentes de Canarias, incluidos Secundaria y Escuelas Oficiales de Idiomas.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, null, '2025-04-21', 'https://www.gobiernodecanarias.org/boc/2025/077/1484.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2025-077-1484.pdf', null, null, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-17112026-222-10', 'tecnico-en-cocina-y-gastronomia-castilla-y-leon-bocyl-d-17112026-222-10', 'Técnico en Cocina y Gastronomía de Castilla y León', '14 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 14, 'Acceso libre', '2026-11-17', 'https://bocyl.jcyl.es/boletines/2026/11/17/pdf/BOCYL-D-17112026-222-10.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/17/pdf/BOCYL-D-17112026-222-10.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-18112026-223-2', 'auxiliar-de-carreteras-castilla-y-leon-bocyl-d-18112026-223-2', 'Auxiliar de Carreteras de Castilla y León', '15 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 15, 'Acceso libre', '2026-11-18', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-2.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-2.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-18112026-223-3', 'ayudante-de-cocina-castilla-y-leon-bocyl-d-18112026-223-3', 'Ayudante de Cocina de Castilla y León', '20 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 20, 'Acceso libre', '2026-11-18', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-3.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-3.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-18112026-223-4', 'personal-subalterno-castilla-y-leon-bocyl-d-18112026-223-4', 'Personal Subalterno de Castilla y León', '50 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 50, 'Acceso libre', '2026-11-18', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-4.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/18/pdf/BOCYL-D-18112026-223-4.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-20112026-225-5', 'peon-de-montes-y-extincion-castilla-y-leon-bocyl-d-20112026-225-5', 'Peón de Montes y Extinción de Castilla y León', '40 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 40, 'Acceso libre', '2026-11-20', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-5.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-5.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-20112026-225-6', 'personal-de-servicios-castilla-y-leon-bocyl-d-20112026-225-6', 'Personal de Servicios de Castilla y León', '395 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 395, 'Acceso libre', '2026-11-20', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-6.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-6.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-20112026-225-8', 'vigilante-de-incendios-castilla-y-leon-bocyl-d-20112026-225-8', 'Vigilante de Incendios de Castilla y León', '70 plazas de acceso libre. Plazo de presentación de 20 días hábiles desde el día siguiente al de la publicación en el BOCYL.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, 70, 'Acceso libre', '2026-11-20', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-8.pdf', 'https://bocyl.jcyl.es/boletines/2026/11/20/pdf/BOCYL-D-20112026-225-8.pdf', 'https://www.tramitacastillayleon.jcyl.es/', true, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-21072026-139-10', 'cuerpo-de-gestion-castilla-y-leon-bocyl-d-21072026-139-10', 'Cuerpo de Gestión de Castilla y León', 'Convocatoria de acceso libre. El primer ejercicio está anunciado para el 19 de diciembre de 2026 a las 9:30. Consulte en el anuncio la sede que le corresponda.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, null, 'Acceso libre', '2026-07-21', 'https://bocyl.jcyl.es/boletines/2026/07/21/pdf/BOCYL-D-21072026-139-10.pdf', 'https://bocyl.jcyl.es/boletines/2026/07/21/pdf/BOCYL-D-21072026-139-10.pdf', null, true, '2026-12-19', 'examen convocado');

create temporary table verified_followups (
  ref text primary key, parent_ref text references verified_roots(ref), kind text, summary text
) on commit drop;

insert into verified_followups values
  ('BOC-A-2026-207-3568', 'BOC-A-2026-076-1266', 'correccion', 'Se modifica la admisión definitiva y los datos del ejercicio del Cuerpo Administrativo por promoción interna.'),
  ('BOC-A-2026-209-3601', 'BOC-A-2024-239-3968', 'ampliacion', 'Ampliación del plazo para nombramientos y adjudicación de puestos en las especialidades indicadas en el anexo.'),
  ('BOC-A-2026-211-3634', 'BOC-A-2026-153-2746', 'fecha_examen', 'Anuncio inicial del ejercicio de Personal Subalterno. Consultar la fecha posterior, publicada en BOC-A-2026-228-3944.'),
  ('BOC-A-2026-211-3635', 'BOC-A-2026-117-2024', 'admitidos_definitivos', 'Publicación de la admisión definitiva para la Escala de Agentes de Tributos.'),
  ('BOC-A-2026-215-3701', 'BOC-A-2026-204-3514', 'correccion', 'Se modifica y aclara el apartado V del anexo II de las bases.'),
  ('BOC-A-2026-220-3780', 'BOC-A-2026-025-385', 'admitidos_definitivos', 'Admisión definitiva y convocatoria de la primera prueba de conocimiento e idiomas.'),
  ('BOC-A-2026-220-3781', 'BOC-A-2026-153-2746', 'admitidos_definitivos', 'Admisión definitiva de la convocatoria de Personal Subalterno por el cupo específico.'),
  ('BOC-A-2026-221-3797', 'BOC-A-2025-062-1251', 'seleccion', 'Publicación del resultado y trámite de comprobación de requisitos para el nombramiento en prácticas.'),
  ('BOC-A-2026-221-3798', 'BOC-A-2023-136-2291', 'seleccion', 'Publicación del resultado y trámite de comprobación de requisitos para el nombramiento en prácticas.'),
  ('BOC-A-2026-222-3826', 'BOC-A-2026-057-948', 'correccion', 'Corrección de la resolución de admisión definitiva y anuncio del ejercicio.'),
  ('BOC-A-2026-222-3827', 'BOC-A-2026-057-948', 'correccion', 'Corrección de la resolución de admisión definitiva y anuncio del ejercicio.'),
  ('BOC-A-2026-223-3847', 'BOC-A-2022-245-3831', 'adjudicacion', 'Oferta de puestos a personas aspirantes de la lista adicional.'),
  ('BOC-A-2026-225-3895', 'BOC-A-2026-117-2024', 'tribunal', 'Modificación del tribunal calificador de la Escala de Agentes de Tributos.'),
  ('BOC-A-2026-228-3932', 'BOC-A-2026-057-948', 'correccion', 'Corrección de la admisión definitiva y convocatoria del ejercicio.'),
  ('BOC-A-2026-228-3933', 'BOC-A-2022-245-3816', 'resolucion', 'Se declara la pérdida de vigencia de la lista adicional de promoción interna.'),
  ('BOC-A-2026-228-3934', 'BOC-A-2022-245-3819', 'resolucion', 'Se declara la pérdida de vigencia de la lista adicional del turno libre.'),
  ('BOC-A-2026-228-3935', 'BOC-A-2022-245-3826', 'resolucion', 'Se declara la pérdida de vigencia de la lista adicional de Técnico de Prevención.'),
  ('BOC-A-2026-228-3944', 'BOC-A-2026-153-2746', 'fecha_examen', 'Nueva fecha del ejercicio único en ambas provincias: 15 de noviembre de 2026.'),
  ('BOC-A-2026-229-3961', 'BOC-A-2023-243-4138', 'correccion', 'Se modifica el acto de selección y oferta de puestos del Cuerpo de Gestión, Escala de Gestión General.'),
  ('BOC-A-2026-233-4034', 'BOC-A-2026-025-385', 'correccion', 'Rectificación del anexo de la admisión definitiva.'),
  ('BOC-A-2026-233-4035', 'BOC-A-2026-025-385', 'correccion', 'Precisión sobre la base específica 8.1.A).'),
  ('BOC-A-2026-234-4060', 'BOC-A-2025-077-1484', 'seleccion', 'Relación de personas seleccionadas por especialidades de varios cuerpos docentes.'),
  ('BOC-A-2026-234-4064', 'BOC-A-2026-223-3848', 'correccion', 'La referencia de concurso 2608/9511 se corrige a 2608/9331.'),
  ('BOC-A-2026-235-4074', 'BOC-A-2025-077-1483', 'resolucion', 'Aprobación del expediente selectivo del Cuerpo de Maestros tras el periodo de prácticas.'),
  ('BOC-A-2026-235-4076', 'BOC-A-2026-203-3497', 'correccion', 'Corrección de la convocatoria de profesorado asociado a tiempo parcial.'),
  ('BOC-A-2026-236-4107', 'BOC-A-2026-225-3896', 'ampliacion', 'Corrección de requisitos y documentación del cupo de discapacidad y ampliación del plazo en 5 días hábiles.'),
  ('BOC-A-2026-237-4126', 'BOC-A-2024-239-3968', 'seleccion', 'Publicación del resultado y oferta de puestos de la especialidad de Archivo.'),
  ('BOC-A-2026-237-4127', 'BOC-A-2024-239-3968', 'seleccion', 'Publicación del resultado y oferta de puestos de Ciencias del Mar.'),
  ('BOC-A-2026-237-4128', 'BOC-A-2024-239-3968', 'seleccion', 'Publicación del resultado y oferta de puestos del Cuerpo Facultativo Técnico de Grado Medio.'),
  ('BOC-A-2026-239-4168', 'BOC-A-2024-239-3968', 'seleccion', 'Publicación del resultado y oferta de puestos de Ingeniería Industrial.'),
  ('BOC-A-2026-239-4169', 'BOC-A-2024-239-3968', 'seleccion', 'Publicación del resultado y oferta de puestos del Cuerpo Facultativo Técnico de Grado Medio.'),
  ('BOCYL-D-27112026-230-7', 'BOCYL-D-18112026-223-2', 'correccion', 'La tasa de examen de la base séptima se corrige a 9,05 €.'),
  ('BOCYL-D-27112026-230-8', 'BOCYL-D-18112026-223-3', 'correccion', 'La tasa de examen pasa a 9,05 € y se modifica la composición del tribunal.'),
  ('BOCYL-D-27112026-230-9', 'BOCYL-D-20112026-225-5', 'correccion', 'La tasa de examen de la base séptima se corrige a 9,05 €.'),
  ('BOCYL-D-27112026-230-10', 'BOCYL-D-20112026-225-6', 'correccion', 'La tasa de examen de la base séptima se corrige a 9,05 €.'),
  ('BOCYL-D-27112026-230-11', 'BOCYL-D-18112026-223-4', 'correccion', 'La tasa de examen pasa a 9,05 €. Se permite elegir Burgos, León, Salamanca o Valladolid como provincia de examen.'),
  ('BOCYL-D-27112026-230-12', 'BOCYL-D-20112026-225-8', 'correccion', 'La tasa de examen de la base séptima se corrige a 9,05 €.'),
  ('BOCYL-D-27112026-230-13', 'BOCYL-D-18112026-223-2', 'tribunal', 'Nombramiento del tribunal calificador.'),
  ('BOCYL-D-27112026-230-14', 'BOCYL-D-17112026-222-10', 'tribunal', 'Nombramiento del tribunal calificador.'),
  ('BOCYL-D-27112026-230-15', 'BOCYL-D-21072026-139-10', 'fecha_examen', 'Admisión definitiva y anuncio del primer ejercicio para el 19 de diciembre de 2026 a las 9:30.');

insert into public.opposition_calls (
  source_id, source_external_id, official_call_identifier_authority, official_call_identifier,
  slug, title, summary, organisation, administration, territory, group_category, vacancies,
  access_system, publication_date, official_url, application_url, official_syllabus_included,
  exam_date, status, bulletin_name, bulletin_identifier, last_official_update
)
select s.id, v.ref, case v.method when 'boc_rss' then 'BOC' else 'BOCYL' end, v.ref,
  v.slug, v.title, v.summary, v.organisation, v.administration, v.territory, v.group_category,
  v.vacancies, v.access_system, v.publication_date, v.official_url, v.application_url,
  v.syllabus, v.exam_date, v.status, s.name, v.ref,
  greatest(v.publication_date, (
    select max(i.publication_date)
    from verified_followups f
    join public.opposition_territorial_inbox i on i.source_id = s.id and i.external_id = f.ref
    where f.parent_ref = v.ref
  ))::timestamptz
from verified_roots v
join public.opposition_sources s on s.consultation_method = v.method
on conflict (source_id, source_external_id) do nothing;

insert into public.opposition_publications (
  call_id, source_id, external_id, publication_type, publication_date, bulletin_name,
  bulletin_identifier, official_url, official_pdf_url, change_summary, relevance
)
select c.id, s.id, v.ref, 'bases', v.publication_date, s.name, v.ref,
  v.official_url, v.pdf_url, 'Publicación de las bases de la convocatoria.', 'informativa'
from verified_roots v
join public.opposition_sources s on s.consultation_method = v.method
join public.opposition_calls c on c.source_id = s.id and c.source_external_id = v.ref
on conflict (source_id, external_id) do nothing;

insert into public.opposition_publications (
  call_id, source_id, external_id, publication_type, publication_date, bulletin_name,
  bulletin_identifier, official_url, official_pdf_url, change_summary, relevance
)
select c.id, i.source_id, i.external_id, f.kind, i.publication_date, c.bulletin_name,
  i.external_id, r.evidence_url, coalesce(r.official_pdf_url, i.official_pdf_url),
  f.summary, 'informativa'
from verified_followups f
join verified_roots v on v.ref = f.parent_ref
join public.opposition_sources s on s.consultation_method = v.method
join public.opposition_calls c on c.source_id = s.id and c.source_external_id = v.ref
join public.opposition_territorial_inbox i on i.source_id = s.id and i.external_id = f.ref
join opposition_worker_private.territorial_reviews r on r.source_id = i.source_id and r.external_id = i.external_id
on conflict (source_id, external_id) do nothing;

update opposition_worker_private.territorial_reviews r
set publication_type = 'bases',
  evidence_note = 'Bases identificadas y publicadas mediante su referencia oficial.'
from verified_roots v
join public.opposition_sources s on s.consultation_method = v.method
where r.source_id = s.id and r.external_id = v.ref and r.decision = 'bases_territoriales';

update opposition_worker_private.territorial_reviews r
set prior_reference = f.parent_ref, publication_type = f.kind, evidence_note = f.summary
from verified_followups f
join public.opposition_publications p on p.external_id = f.ref
join public.opposition_calls c on c.id = p.call_id and c.official_call_identifier = f.parent_ref
where r.source_id = p.source_id and r.external_id = p.external_id;

do $$
begin
  if exists (
    select 1 from verified_roots v
    join public.opposition_sources s on s.consultation_method = v.method
    where not exists (
      select 1 from public.opposition_publications p
      join public.opposition_calls c on c.id = p.call_id
      where p.source_id = s.id and p.external_id = v.ref and c.official_call_identifier = v.ref
    )
  ) or exists (
    select 1 from verified_followups f
    where not exists (
      select 1 from public.opposition_publications p
      join public.opposition_calls c on c.id = p.call_id
      where p.external_id = f.ref and c.official_call_identifier = f.parent_ref
    )
  ) then
    raise exception 'El cotejo de referencias territoriales quedó incompleto';
  end if;
end $$;
