-- Cotejo manual de bases y avisos vinculados. Esta operación no encola alertas.
create temporary table verified_territorial_calls (
  authority text, reference text, slug text, title text, summary text,
  organisation text, administration text, territory text, province text,
  group_category text, specialty text, vacancies integer, access_system text,
  publication_date date, application_start date, application_end date,
  exam_date date, has_syllabus boolean, official_url text, pdf_url text,
  application_url text, review_note text
) on commit drop;

insert into verified_territorial_calls values
  ('BOC', 'BOC-A-2026-234-4062', 'administracion-tributaria-a1-canarias-boc-a-2026-234-4062',
   'Escala de Administración Tributaria (A1) de la Agencia Tributaria Canaria',
   '6 plazas: 5 de acceso libre y 1 de promoción interna. Solicitudes del 28 de diciembre de 2026 al 27 de enero de 2027, según el portal de la Agencia Tributaria Canaria.',
   'Agencia Tributaria Canaria', 'Administración autonómica', 'Canarias', null,
   'A1', 'Administración Tributaria', 6, 'Oposición en acceso libre y concurso-oposición en promoción interna, con curso selectivo',
   '2026-11-20', '2026-12-28', '2027-01-27', null, true,
   'https://www.gobiernodecanarias.org/boc/2026/234/4062.html',
   'https://sede.gobiernodecanarias.org/boc/boc-a-2026-234-4062.pdf',
   'https://sede.gobiernodecanarias.org/tributos/ov/publico/procedimientos/tramite/8965',
   'Plazas según bases específicas. Las fechas exactas de inscripción están publicadas en el portal de la Agencia Tributaria Canaria.'),
  ('BOC', 'BOC-A-2026-234-4063', 'gestion-tributaria-a2-canarias-boc-a-2026-234-4063',
   'Escala de Gestión Tributaria (A2) de la Agencia Tributaria Canaria',
   '18 plazas según la tabla del anexo I: 8 de acceso libre y 10 de promoción interna, con 2 del cupo de discapacidad en cada turno. Solicitudes durante 20 días hábiles desde el 28 de diciembre de 2026, incluido.',
   'Agencia Tributaria Canaria', 'Administración autonómica', 'Canarias', null,
   'A2', 'Gestión Tributaria', 18, 'Oposición en acceso libre y concurso-oposición en promoción interna, con curso selectivo',
   '2026-11-20', '2026-12-28', null, null, true,
   'https://www.gobiernodecanarias.org/boc/2026/234/4063.html',
   'https://sede.gobiernodecanarias.org/boc/boc-a-2026-234-4063.pdf',
   'https://sede.gobiernodecanarias.org/tributos/ov/publico/procedimientos/tramite/8969',
   'Se comprobó el total en la tabla del anexo I y se recogió el plazo según la base específica de solicitudes.'),
  ('BOC', 'BOC-A-2026-238-4154', 'contratos-apoyo-investigacion-ulpgc-boc-a-2026-238-4154',
   'Contratos de personal técnico de apoyo y gestores de investigación de la ULPGC',
   'Convocatoria para los institutos IUMA, IUCES, IOCAG, IUSA y ECOAQUA. Solicitudes en la sede electrónica de la ULPGC durante 10 días hábiles a partir del día siguiente al de la publicación en el BOC.',
   'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', 'Las Palmas',
   null, null, null, 'Valoración de candidaturas conforme al anexo II',
   '2026-11-26', null, null, null, null,
   'https://www.gobiernodecanarias.org/boc/2026/238/4154.html',
   'https://sede.gobiernodecanarias.org/boc/boc-a-2026-238-4154.pdf',
   'https://administracion.ulpgc.es',
   'Objeto y plazo de la base 7.1 confirmados en la convocatoria. Sus perfiles y anexo corresponden a un proceso distinto de PACP3.'),
  ('BOC', 'BOC-A-2026-238-4155', 'apoyo-proyecto-pacp3-ulpgc-boc-a-2026-238-4155',
   'Contratación de personal de apoyo al proyecto PACP3 de la ULPGC',
   'Concurso público para personal de apoyo al proyecto PACP3. Solicitudes durante 10 días naturales desde el día siguiente al de la publicación en el BOC. En la sede electrónica, seleccionar Gestión de Proyectos de Cooperación (SIA 2889885).',
   'Universidad de Las Palmas de Gran Canaria', 'Universidad', 'Canarias', 'Las Palmas',
   null, 'Apoyo a proyectos de cooperación', null, 'Concurso público',
   '2026-11-26', null, null, null, null,
   'https://www.gobiernodecanarias.org/boc/2026/238/4155.html',
   'https://sede.gobiernodecanarias.org/boc/boc-a-2026-238-4155.pdf',
   'https://administracion.ulpgc.es',
   'Objeto, plazo y procedimiento de inscripción confirmados en las bases 8.1 y 8.2.'),
  ('BOCYL', 'BOCYL-D-27112026-230-23', 'bolsa-microscopia-electronica-uva-bocyl-d-27112026-230-23',
   'Bolsa de Técnico Especialista de Laboratorio de Microscopía Electrónica de la Universidad de Valladolid',
   'Bolsa de empleo temporal del Grupo III laboral. Solicitudes durante 7 días hábiles desde el día siguiente al de la publicación en el BOCYL, atendiendo a los periodos inhábiles que pueda declarar la Universidad.',
   'Universidad de Valladolid', 'Universidad', 'Castilla y León', 'Valladolid',
   'Grupo III laboral', 'Microscopía Electrónica', null, 'Concurso-oposición',
   '2026-11-27', null, null, null, true,
   'https://bocyl.jcyl.es/boletines/2026/11/27/pdf/BOCYL-D-27112026-230-23.pdf',
   'https://bocyl.jcyl.es/boletines/2026/11/27/pdf/BOCYL-D-27112026-230-23.pdf',
   'https://sede.uva.es',
   'Bolsa independiente confirmada en el tablón electrónico de la Universidad y base 3.1 del BOCYL.'),
  ('BOCYL', 'BOCYL-D-27052026-99-4', 'ingenieros-superiores-agronomos-promocion-interna-bocyl-d-27052026-99-4',
   'Ingenieros Superiores (Agrónomos) de Castilla y León por promoción interna',
   '32 plazas de promoción interna, 4 de ellas reservadas a personas con discapacidad. El primer ejercicio se celebrará el 19 de diciembre de 2026 a las 10:00 en el IES Vega del Prado, Plaza de la Cebada, 1, Valladolid.',
   'Junta de Castilla y León', 'Administración autonómica', 'Castilla y León', null,
   null, 'Agronomía', 32, 'Concurso-oposición por promoción interna',
   '2026-05-27', null, null, '2026-12-19', true,
   'https://bocyl.jcyl.es/boletines/2026/05/27/pdf/BOCYL-D-27052026-99-4.pdf',
   'https://bocyl.jcyl.es/boletines/2026/05/27/pdf/BOCYL-D-27052026-99-4.pdf',
   null, 'La resolución de 23 de noviembre remite a la convocatoria original publicada el 27 de mayo.');

insert into public.opposition_calls (
  source_id, source_external_id, official_call_identifier_authority, official_call_identifier,
  slug, title, summary, organisation, administration, territory, province,
  group_category, specialty, vacancies, access_system, publication_date,
  application_start, application_end, exam_date, official_syllabus_included,
  official_url, application_url, bulletin_name, bulletin_identifier,
  status, last_official_update
)
select s.id, v.reference, v.authority, v.reference, v.slug, v.title, v.summary,
  v.organisation, v.administration, v.territory, v.province, v.group_category,
  v.specialty, v.vacancies, v.access_system, v.publication_date,
  v.application_start, v.application_end, v.exam_date, v.has_syllabus,
  v.official_url, v.application_url, s.name, v.reference,
  case when v.exam_date is null then 'publicada' else 'examen convocado' end,
  coalesce(
    (select i.publication_date::timestamptz from public.opposition_territorial_inbox i
     where i.source_id = s.id and i.external_id = 'BOCYL-D-27112026-230-16'
       and v.reference = 'BOCYL-D-27052026-99-4'),
    v.publication_date::timestamptz
  )
from verified_territorial_calls v
join public.opposition_sources s
  on s.consultation_method = case v.authority when 'BOC' then 'boc_rss' else 'bocyl_rss' end
on conflict (source_id, source_external_id) do nothing;

insert into public.opposition_publications (
  call_id, source_id, external_id, publication_type, publication_date, bulletin_name,
  bulletin_identifier, official_url, official_pdf_url, change_summary, relevance
)
select c.id, c.source_id, v.reference, 'bases', v.publication_date, c.bulletin_name,
  v.reference, v.official_url, v.pdf_url, 'Publicación de las bases de la convocatoria.', 'informativa'
from verified_territorial_calls v
join public.opposition_calls c
  on c.official_call_identifier_authority = v.authority and c.official_call_identifier = v.reference
on conflict (source_id, external_id) do nothing;

insert into public.opposition_publications (
  call_id, source_id, external_id, publication_type, publication_date, bulletin_name,
  bulletin_identifier, official_url, official_pdf_url, change_summary, relevance
)
select c.id, i.source_id, i.external_id, 'fecha_examen', i.publication_date, c.bulletin_name,
  i.external_id, r.evidence_url, coalesce(r.official_pdf_url,r.evidence_url),
  'Admisión definitiva. Primer ejercicio el 19 de diciembre de 2026 a las 10:00 en el IES Vega del Prado, Valladolid.', 'informativa'
from public.opposition_calls c
join public.opposition_territorial_inbox i
  on i.source_id = c.source_id and i.external_id = 'BOCYL-D-27112026-230-16'
join opposition_worker_private.territorial_reviews r
  on r.source_id = i.source_id and r.external_id = i.external_id
where c.official_call_identifier_authority = 'BOCYL'
  and c.official_call_identifier = 'BOCYL-D-27052026-99-4'
on conflict (source_id, external_id) do nothing;

update opposition_worker_private.territorial_reviews r
set publication_type = 'bases', evidence_note = v.review_note
from verified_territorial_calls v
join public.opposition_calls c
  on c.official_call_identifier_authority = v.authority and c.official_call_identifier = v.reference
where r.source_id = c.source_id and r.external_id = v.reference;

update opposition_worker_private.territorial_reviews r
set prior_reference = 'BOCYL-D-27052026-99-4', publication_type = 'fecha_examen',
  confirmed_exam_date = '2026-12-19',
  evidence_note = 'Aviso incorporado al expediente original publicado el 27 de mayo de 2026, con referencia oficial BOCYL-D-27052026-99-4.'
from public.opposition_publications p
where r.source_id = p.source_id and r.external_id = p.external_id
  and p.external_id = 'BOCYL-D-27112026-230-16';

do $$
begin
  if (
    select count(*)
    from verified_territorial_calls v
    join public.opposition_calls c
      on c.official_call_identifier_authority = v.authority and c.official_call_identifier = v.reference
    join public.opposition_publications p
      on p.call_id = c.id and p.source_id = c.source_id and p.external_id = v.reference
  ) <> 6 or not exists (
    select 1 from public.opposition_publications p
    join public.opposition_calls c on c.id = p.call_id
    where p.external_id = 'BOCYL-D-27112026-230-16'
      and c.official_call_identifier = 'BOCYL-D-27052026-99-4'
      and c.exam_date = '2026-12-19'
  ) then
    raise exception 'No se han vinculado todas las publicaciones territoriales verificadas';
  end if;
end $$;
