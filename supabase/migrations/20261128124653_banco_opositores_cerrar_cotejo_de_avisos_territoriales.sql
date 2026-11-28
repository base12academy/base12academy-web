-- Bases y seguimiento contrastados con las referencias oficiales del BOC y BOCYL.
-- Los registros históricos se publican sin encolar alertas.
create temporary table verified_roots (
  method text, ref text primary key, slug text, title text, summary text, organisation text,
  administration text, territory text, group_category text, vacancies integer, access_system text,
  publication_date date, official_url text, pdf_url text, application_url text,
  syllabus boolean, exam_date date, status text
) on commit drop;

insert into verified_roots values
  ('boc_rss', 'BOC-A-2022-255-4164', 'auxiliar-de-servicio-de-comedor-y-servicio-domestico-de-canarias-estabilizacion-boc-a-2022-255-4164', 'Auxiliar de Servicio de Comedor y Servicio Doméstico de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 115/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'V', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4164.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4164.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4186', 'auxiliar-administrativo-laboral-de-canarias-estabilizacion-boc-a-2022-255-4186', 'Auxiliar Administrativo laboral de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'IV', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4186.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4186.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4188', 'cocinero-y-oficial-i-de-cocina-de-canarias-estabilizacion-boc-a-2022-255-4188', 'Cocinero y Oficial I de Cocina de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'IV', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4188.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4188.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4189', 'cuidador-laboral-de-canarias-estabilizacion-boc-a-2022-255-4189', 'Cuidador laboral de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'IV', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4189.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4189.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4190', 'mantenimiento-guarda-y-mantenimiento-vigilancia-de-canarias-estabilizacion-boc-a-2022-255-4190', 'Mantenimiento Guarda y Mantenimiento-Vigilancia de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'IV', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4190.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4190.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4194', 'camarera-limpiadora-y-limpiadora-de-canarias-estabilizacion-boc-a-2022-255-4194', 'Camarera-Limpiadora y Limpiadora de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'V', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4194.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4194.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4196', 'servicio-domestico-de-canarias-estabilizacion-boc-a-2022-255-4196', 'Servicio Doméstico de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'V', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4196.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4196.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-255-4197', 'subalterno-y-ordenanza-laboral-de-canarias-estabilizacion-boc-a-2022-255-4197', 'Subalterno y Ordenanza laboral de Canarias, estabilización', 'Convocatoria de estabilización de personal laboral fijo conforme al anexo II del Decreto 114/2022.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', 'V', null, 'Acceso libre', '2022-12-29', 'https://www.gobiernodecanarias.org/boc/2022/255/4197.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-255-4197.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-174-3108', 'bolsas-de-profesorado-sustituto-de-la-universidad-de-las-palmas-de-gran-canaria-boc-a-2026-174-3108', 'Bolsas de profesorado sustituto de la Universidad de Las Palmas de Gran Canaria', 'Bolsas de sustitución para los perfiles del anexo I. El historial recoge las modificaciones posteriores.', 'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', null, null, 'Concurso público', '2026-08-31', 'https://www.gobiernodecanarias.org/boc/2026/174/3108.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-174-3108.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2026-058-970', 'cuerpo-de-maestros-de-canarias-convocatoria-de-marzo-de-2026-boc-a-2026-058-970', 'Cuerpo de Maestros de Canarias, convocatoria de marzo de 2026', '686 plazas correspondientes a las ofertas de 2023 y 2024. El portal de Educación publicó el periodo de solicitudes definitivo del 26 de marzo al 27 de abril de 2026.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, 686, 'Concurso-oposición', '2026-03-25', 'https://www.gobiernodecanarias.org/boc/2026/058/970.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2026-058-970.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2022-049-779', 'cuerpo-de-maestros-de-canarias-oferta-de-2021-boc-a-2022-049-779', 'Cuerpo de Maestros de Canarias, oferta de 2021', 'Convocatoria de 2 de marzo de 2022. La ampliación de plazas fue publicada en BOC-A-2022-089-1516.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, 'Concurso-oposición', '2022-03-10', 'https://www.gobiernodecanarias.org/boc/2022/049/003.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2022-049-779.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2025-128-2407', 'titulado-superior-de-informatica-de-la-ulpgc-concurso-oposicion-restringido-boc-a-2025-128-2407', 'Titulado Superior de Informática de la ULPGC, concurso-oposición restringido', 'Dos puestos de personal laboral del grupo Titulado Superior, especialidad Informática, nivel retributivo 1.', 'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', null, 2, 'Concurso-oposición restringido', '2025-06-30', 'https://www.gobiernodecanarias.org/boc/2025/128/2407.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2025-128-2407.pdf', null, null, null, 'publicada'),
  ('boc_rss', 'BOC-A-2018-183-4270', 'jefaturas-de-seccion-de-medicina-interna-del-hospital-universitario-de-gran-canaria-dr-boc-a-2018-183-4270', 'Jefaturas de Sección de Medicina Interna del Hospital Universitario de Gran Canaria Dr. Negrín', 'Convocatoria de dos jefaturas temporales declarada caducada por la resolución publicada el 22 de octubre de 2026.', 'Servicio Canario de la Salud', 'Administración autonómica', 'Canarias', null, 2, 'Provisión temporal', '2018-09-20', 'https://sede.gobiernodecanarias.org/boc/boc-a-2018-183-4270.pdf', 'https://sede.gobiernodecanarias.org/boc/boc-a-2018-183-4270.pdf', null, null, null, 'caducada'),
  ('boc_rss', 'BOC-A-2023-243-4138', 'cuerpos-superior-de-gestion-administrativo-y-auxiliar-de-canarias-acceso-libre-boc-a-2023-243-4138', 'Cuerpos Superior, de Gestión, Administrativo y Auxiliar de Canarias, acceso libre', 'Convocatoria de acceso libre a diversos cuerpos de la Administración General de Canarias.', 'Gobierno de Canarias', 'Administración autonómica', 'Canarias', null, null, 'Acceso libre', '2023-12-13', 'https://www.gobiernodecanarias.org/boc/2023/243/4138.html', 'https://sede.gobiernodecanarias.org/boc/boc-a-2023-243-4138.pdf', null, null, null, 'publicada'),
  ('bocyl_rss', 'BOCYL-D-11122025-4', 'seguridad-e-higiene-en-el-trabajo-tecnicos-y-diplomados-especialistas-de-castilla-y-le-bocyl-d-11122025-4', 'Seguridad e Higiene en el Trabajo, Técnicos y Diplomados Especialistas de Castilla y León', 'Proceso de promoción interna declarado desierto por la Orden PRE/1280/2026.', 'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null, null, 'Concurso-oposición por promoción interna', '2025-12-11', 'https://bocyl.jcyl.es/boletines/2025/12/11/pdf/BOCYL-D-11122025-4.pdf', 'https://bocyl.jcyl.es/boletines/2025/12/11/pdf/BOCYL-D-11122025-4.pdf', null, true, null, 'desierta'),
  ('bocce_sumario_pdf', '2026/Extra31/71', 'conductores-perceptores-de-autobus-de-amgevicesa-promocion-interna-2026-extra31-71', 'Conductores perceptores de autobús de AMGEVICESA, promoción interna', '5 plazas del Grupo V del servicio de autobuses urbanos, oferta de empleo de 2025.', 'AMGEVICESA', 'Administración Local', 'Ceuta', 'V', 5, 'Concurso-oposición por promoción interna', '2026-07-07', 'https://www.ceuta.es/ceuta/component/jdownloads/finish/1978-julio/23203-bocce-extra31-07-07-2026?Itemid=0', 'https://www.ceuta.es/ceuta/component/jdownloads/finish/1978-julio/23203-bocce-extra31-07-07-2026?Itemid=0', null, null, null, 'publicada'),
  ('bocce_sumario_pdf', '2026/6671/780', 'plazas-de-obimace-de-ceuta-ofertas-de-empleo-de-2021-a-2023-2026-6671-780', 'Plazas de OBIMACE de Ceuta, ofertas de empleo de 2021 a 2023', '15 plazas en 10 perfiles. El aviso posterior incorpora las bases de una plaza de oficial de primera soldador y corrige la duplicación de las bases de pintura.', 'OBIMACE, S.L.U.', 'Administración Local', 'Ceuta', null, 15, 'Promoción libre según las bases de cada perfil', '2026-11-20', 'https://www.ceuta.es/ceuta/component/jdownloads/finish/1983-noviembre/23329-bocce-6671-20-11-2026?Itemid=0', 'https://www.ceuta.es/ceuta/component/jdownloads/finish/1983-noviembre/23329-bocce-6671-20-11-2026?Itemid=0', null, null, null, 'publicada'),
  ('boe_sumario_api', 'BOE-A-2025-664', 'auxiliar-administrativo-y-administrativo-de-melilla-oposicion-libre-boe-a-2025-664', 'Auxiliar Administrativo y Administrativo de Melilla, oposición libre', 'Las bases rectificadas elevaron la convocatoria a 30 plazas de Auxiliar Administrativo (4 reservadas) y 16 de Administrativo. Se reabrió el plazo del 13 de abril al 11 de mayo de 2026.', 'Ciudad Autónoma de Melilla', 'Administración Local', 'Melilla', null, 46, 'Oposición libre', '2025-01-16', 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-664', 'https://www.boe.es/boe/dias/2025/01/16/pdfs/BOE-A-2025-664.pdf', null, null, null, 'publicada');

create temporary table verified_followups (
  ref text primary key, parent_ref text references verified_roots(ref), kind text, summary text, method text
) on commit drop;

insert into verified_followups values
  ('BOC-A-2026-228-3936', 'BOC-A-2022-255-4164', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3937', 'BOC-A-2022-255-4186', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3938', 'BOC-A-2022-255-4188', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3939', 'BOC-A-2022-255-4189', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3940', 'BOC-A-2022-255-4190', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3941', 'BOC-A-2022-255-4194', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3942', 'BOC-A-2022-255-4196', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-228-3943', 'BOC-A-2022-255-4197', 'seleccion', 'Relación complementaria de personas seleccionadas y oferta de puestos de trabajo.', 'boc_rss'),
  ('BOC-A-2026-211-3636', 'BOC-A-2026-174-3108', 'correccion', 'Modificación del concurso 2607/2781.', 'boc_rss'),
  ('BOC-A-2026-231-4005', 'BOC-A-2026-058-970', 'seleccion', 'Relación de personas seleccionadas por especialidad.', 'boc_rss'),
  ('BOC-A-2026-229-3959', 'BOC-A-2022-049-779', 'resolucion', 'Propuesta de nombramiento por ejecución de sentencia, tras superar el periodo de prácticas.', 'boc_rss'),
  ('BOC-A-2026-233-4037', 'BOC-A-2025-128-2407', 'seleccion', 'Publicación de la resolución con las personas que superaron el proceso.', 'boc_rss'),
  ('BOC-A-2026-211-3632', 'BOC-A-2018-183-4270', 'resolucion', 'Se declara la caducidad del procedimiento de provisión temporal.', 'boc_rss'),
  ('BOC-A-2026-209-3600', 'BOC-A-2023-243-4138', 'ampliacion', 'Adición de plazas en cuerpos y escalas del turno libre especificados en el anexo.', 'boc_rss'),
  ('BOC-A-2026-228-3945', 'BOC-A-2026-174-3108', 'correccion', 'Modificación de los concursos 2607/2451, 2607/2452 y 2607/2453.', 'boc_rss'),
  ('BOCYL-D-27112026-230-2', 'BOCYL-D-11122025-4', 'resolucion', 'La Orden PRE/1280/2026 declara desierto el proceso selectivo.', 'bocyl_rss'),
  ('2026/Extra58/117', '2026/Extra31/71', 'admitidos_definitivos', 'Publicación de la admisión definitiva del turno de promoción interna.', 'bocce_sumario_pdf'),
  ('2026/6673/796', '2026/6671/780', 'correccion', 'Se incorporan las bases de oficial de primera soldador y se elimina la sección duplicada de las bases de pintura.', 'bocce_sumario_pdf'),
  ('BOME-A-2026-1313', 'BOE-A-2025-664', 'fecha_examen', 'Información para el segundo ejercicio de las 30 plazas de Auxiliar Administrativo.', 'bome_sumario');

insert into public.opposition_calls (
  source_id, source_external_id, official_call_identifier_authority, official_call_identifier,
  slug, title, summary, organisation, administration, territory, group_category, vacancies,
  access_system, publication_date, official_url, application_url, official_syllabus_included,
  exam_date, status, bulletin_name, bulletin_identifier, last_official_update
)
select s.id, v.ref, case v.method when 'boc_rss' then 'BOC' when 'bocyl_rss' then 'BOCYL' when 'bocce_sumario_pdf' then 'BOCCE' else 'BOE' end, v.ref,
  v.slug, v.title, v.summary, v.organisation, v.administration, v.territory, v.group_category,
  v.vacancies, v.access_system, v.publication_date, v.official_url, v.application_url,
  v.syllabus, v.exam_date, v.status, s.name, v.ref,
  greatest(v.publication_date, (
    select max(i.publication_date)
    from verified_followups f
    join public.opposition_territorial_inbox i on i.source_id = (select id from public.opposition_sources where consultation_method=f.method) and i.external_id = f.ref
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
select c.id, i.source_id, i.external_id, f.kind, i.publication_date, (select name from public.opposition_sources where id=i.source_id),
  i.external_id, r.evidence_url, coalesce(r.official_pdf_url, i.official_pdf_url),
  f.summary, 'informativa'
from verified_followups f
join verified_roots v on v.ref = f.parent_ref
join public.opposition_sources s on s.consultation_method = v.method
join public.opposition_calls c on c.source_id = s.id and c.source_external_id = v.ref
join public.opposition_territorial_inbox i on i.source_id = (select id from public.opposition_sources where consultation_method=f.method) and i.external_id = f.ref
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

-- Estas publicaciones nombran conjuntamente a personas de varias convocatorias.
-- Se conservan las referencias de origen sin atribuir todo el documento a un expediente.
update opposition_worker_private.territorial_reviews r
set decision = 'antecedente_territorial', prior_reference = v.refs,
  publication_type = 'nombramiento',
  evidence_note = 'Nombramiento conjunto de varias convocatorias. Los documentos originales y los turnos constan en las ediciones indicadas.'
from (values
  ('AnuncioG0597-241126-0002','AnuncioG0597-161222-0007; AnuncioG0597-191222-0006; AnuncioG0597-180124-0012'),
  ('AnuncioG0597-241126-0003','AnuncioG0597-161222-0007; AnuncioG0597-191222-0006')
) v(ref, refs)
join public.opposition_sources s on s.consultation_method = 'dog_rss'
where r.source_id = s.id and r.external_id = v.ref;

insert into public.opposition_publications (
  call_id, source_id, external_id, publication_type, publication_date, bulletin_name,
  bulletin_identifier, official_url, official_pdf_url, change_summary, relevance
)
select c.id, s.id, v.ref, v.kind, v.published, s.name, v.ref, v.url, v.pdf, v.summary, 'informativa'
from public.opposition_calls c
cross join (values
  ('boe_sumario_api', 'BOE-A-2026-8107', 'rectificacion', date '2026-04-11',
   'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-8107', 'https://www.boe.es/boe/dias/2026/04/11/pdfs/BOE-A-2026-8107.pdf',
   'Rectificación de las bases y reapertura del plazo de solicitudes.'),
  ('bome_sumario', 'BOME-A-2026-367', 'rectificacion', date '2026-04-07',
   'https://bomemelilla.es/bome/BOME-B-2026-6368/articulo/367', 'https://bomemelilla.es/bome/descargar/BOME-A-2026-367.pdf',
   'Modificación del proceso de Auxiliar Administrativo a 30 plazas, con 4 del cupo de discapacidad.'),
  ('bome_sumario', 'BOME-AX-2026-23', 'ampliacion', date '2026-04-13',
   'https://bomemelilla.es/bome/BOME-BX-2026-12/articulo/23', 'https://bomemelilla.es/bome/descargar/BOME-AX-2026-23.pdf',
   'Nuevo plazo de presentación del 13 de abril al 11 de mayo de 2026, inclusive.'),
  ('bome_sumario', 'BOME-A-2026-858', 'resolucion', date '2026-07-24',
   'https://bomemelilla.es/bome/BOME-B-2026-6399/articulo/858', 'https://bomemelilla.es/bome/descargar/BOME-A-2026-858.pdf',
   'Tramitación urgente del procedimiento de Auxiliar Administrativo.')
) v(method,ref,kind,published,url,pdf,summary)
join public.opposition_sources s on s.consultation_method=v.method
where c.official_call_identifier_authority='BOE' and c.official_call_identifier='BOE-A-2025-664'
on conflict (source_id, external_id) do nothing;

update public.opposition_calls
set application_start = date '2026-04-13', application_end = date '2026-05-11'
where official_call_identifier_authority='BOE' and official_call_identifier='BOE-A-2025-664';

update public.opposition_calls c
set last_official_update = greatest(c.last_official_update, p.latest::timestamptz)
from (
  select p.call_id, max(p.publication_date) as latest
  from public.opposition_publications p
  join verified_followups f on f.ref=p.external_id
  group by p.call_id
) p
where c.id=p.call_id;
