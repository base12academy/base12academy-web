-- TROP · preflight de esquema en staging. Solo lectura.
select 'aptitudes' as objeto, count(*) as filas from public.trop_aptitudes
union all select 'motors', count(*) from public.trop_motors
union all select 'plan_motors', count(*) from public.trop_plan_motors;

select plan_slug, count(*) as motores
from public.trop_plan_motors
group by plan_slug
order by public.trop_plan_rank(plan_slug);

select
  to_regclass('public.trop_questions') is not null as questions_table,
  to_regclass('public.trop_import_batches') is not null as import_batches_table;
