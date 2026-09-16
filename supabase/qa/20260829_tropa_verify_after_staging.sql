-- TROP · QA posterior a migración + carga V4 + fase 6.
-- Ejecutar SOLO en el entorno de prueba, después de:
--   1) 20260829_tropa_core.sql
--   2) 20260829_tropa_core_integrity_hardening.sql
--   3) carga V4 con scripts/trop/import_v4.py --apply
--   4) 20260829_tropa_pedagogy_resources.sql
--
-- Este archivo no modifica datos: únicamente comprueba y muestra resultados.

do $$
declare
  bad integer;
begin
  if (select count(*) from public.trop_aptitudes) <> 7 then
    raise exception 'TROP QA: trop_aptitudes debe contener 7 filas';
  end if;
  if (select count(*) from public.trop_motors) <> 21 then
    raise exception 'TROP QA: trop_motors debe contener 21 filas';
  end if;
  if (select count(*) from public.trop_families where active) <> 108 then
    raise exception 'TROP QA: trop_families activas debe contener 108 filas';
  end if;
  if (select count(*) from public.trop_questions where active) <> 28000 then
    raise exception 'TROP QA: trop_questions activas debe contener 28000 filas';
  end if;

  select count(*) into bad
  from (
    select aptitude_slug
    from public.trop_questions
    where active
    group by aptitude_slug
    having count(*) <> 4000
  ) x;
  if bad <> 0 then
    raise exception 'TROP QA: alguna aptitud no contiene exactamente 4000 preguntas';
  end if;

  select count(*) into bad
  from (
    select level
    from public.trop_questions
    where active
    group by level
    having count(*) <> 5600
  ) x;
  if bad <> 0 or (select count(distinct level) from public.trop_questions where active) <> 5 then
    raise exception 'TROP QA: distribución global N1-N5 incorrecta';
  end if;

  if (select count(*) from public.trop_questions where active and access_min='esencial') <> 14000
     or (select count(*) from public.trop_questions where active and access_min='operativa') <> 7000
     or (select count(*) from public.trop_questions where active and access_min='integral') <> 7000 then
    raise exception 'TROP QA: distribución de access_min incorrecta';
  end if;

  if (select count(*) from public.trop_plan_motors where plan_slug='esencial') <> 7
     or (select count(*) from public.trop_plan_motors where plan_slug='operativa') <> 14
     or (select count(*) from public.trop_plan_motors where plan_slug='integral') <> 21 then
    raise exception 'TROP QA: matriz acumulativa de motores 7/14/21 incorrecta';
  end if;

  select count(*) into bad
  from public.trop_questions q
  join public.trop_motors m on m.code=q.motor_code
  where q.aptitude_slug <> m.aptitude_slug;
  if bad <> 0 then
    raise exception 'TROP QA: hay preguntas enlazadas a motor de otra aptitud';
  end if;

  select count(*) into bad
  from public.trop_questions q
  join public.trop_families f on f.family_id=q.family_id
  where q.aptitude_slug <> f.aptitude_slug;
  if bad <> 0 then
    raise exception 'TROP QA: hay preguntas enlazadas a familia de otra aptitud';
  end if;

  if (select count(distinct md5(prompt || '|' || options::text || '|' || stimulus::text))
      from public.trop_questions where active) <> 28000 then
    raise exception 'TROP QA: se detectan firmas de contenido duplicadas';
  end if;

  if (select count(distinct stimulus) from public.trop_questions where active) <> 28000 then
    raise exception 'TROP QA: stimulus no es único en las 28000 preguntas';
  end if;

  if (select count(*) from public.trop_workshops where active) <> 147 then
    raise exception 'TROP QA: el manifiesto debe contener 147 talleres';
  end if;
  if (select count(*) from public.trop_workshops where resource_kind='existing') <> 23
     or (select count(*) from public.trop_workshops where resource_kind='auxiliary') <> 88
     or (select count(*) from public.trop_workshops where resource_kind='special') <> 36 then
    raise exception 'TROP QA: distribución 23/88/36 de talleres incorrecta';
  end if;

  if (select count(*) from public.trop_microtemarios where active) <> 21 then
    raise exception 'TROP QA: debe haber 21 microtemarios';
  end if;
  if (select count(*) from public.trop_laminas where active) <> 25 then
    raise exception 'TROP QA: debe haber 25 láminas';
  end if;
  if (select count(*) from public.trop_error_patterns) <> 63 then
    raise exception 'TROP QA: debe haber 63 patrones de error';
  end if;
  if (select count(*) from public.trop_feedback_rules) <> 9 then
    raise exception 'TROP QA: debe haber 9 reglas de feedback';
  end if;

  -- Cierre mínimo del Punto 8: ninguna de las 88 familias review_required puede quedar a cero.
  -- Esto comprueba presencia de ejercicios, no decide por sí solo que la cobertura sea pedagógicamente suficiente.
  select count(*) into bad
  from (
    select w.workshop_id
    from public.trop_workshops w
    left join public.trop_questions q
      on q.family_id = w.workshop_id and q.active
    where w.bank_coverage_status='review_required'
    group by w.workshop_id
    having count(q.question_id)=0
  ) missing;
  if bad <> 0 then
    raise exception 'TROP QA: una o más de las 88 familias pendientes no tiene ninguna pregunta V4';
  end if;
end $$;

-- Informe detallado de las 88 familias pendientes del Punto 8.
-- Revisar los conteos para decidir suficiencia pedagógica; no se fija un umbral que las fuentes no definan.
select
  w.workshop_id,
  w.block_name,
  w.title,
  count(q.question_id) as preguntas,
  count(distinct q.level) as niveles_presentes,
  count(distinct q.motor_code) as motores_presentes,
  count(*) filter (where q.access_min='esencial') as esencial,
  count(*) filter (where q.access_min='operativa') as operativa,
  count(*) filter (where q.access_min='integral') as integral
from public.trop_workshops w
left join public.trop_questions q
  on q.family_id = w.workshop_id and q.active
where w.bank_coverage_status='review_required'
group by w.workshop_id, w.block_name, w.title
order by preguntas asc, w.workshop_id;

-- Resumen por aptitud / nivel.
select aptitude_slug, level, count(*) as preguntas
from public.trop_questions
where active
group by aptitude_slug, level
order by aptitude_slug, level;

-- Resumen por plan.
select access_min, count(*) as preguntas
from public.trop_questions
where active
group by access_min
order by public.trop_plan_rank(access_min);
