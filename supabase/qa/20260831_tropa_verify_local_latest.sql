-- QA local del estado integrado más reciente de Tropa y Marinería.
-- Solo consulta; una desviación aborta con una excepción descriptiva.

do $$
declare
  actual integer;
begin
  select count(*) into actual from public.trop_questions where active;
  if actual <> 28000 then raise exception 'Preguntas activas: %, esperado 28000', actual; end if;

  select count(*) into actual
  from (
    select aptitude_slug
    from public.trop_questions
    where active
    group by aptitude_slug
    having count(*) = 4000
  ) exact_aptitudes;
  if actual <> 7 then raise exception 'Aptitudes con exactamente 4000 preguntas: %, esperado 7', actual; end if;

  select count(*) into actual
  from (
    select aptitude_slug, access_min
    from public.trop_questions
    where active
    group by aptitude_slug, access_min
    having count(*) = case access_min
      when 'esencial' then 2000
      when 'operativa' then 1000
      when 'integral' then 1000
    end
  ) exact_tiers;
  if actual <> 21 then raise exception 'Tramos exactos por aptitud: %, esperado 21', actual; end if;

  select count(*) into actual
  from public.trop_questions
  where active and aptitude_slug = 'numerico'
    and audit_version like '%NUM%V2%';
  if actual <> 4000 then raise exception 'Numérico V2 activo: %, esperado 4000', actual; end if;

  select count(*) into actual
  from public.trop_questions
  where active and aptitude_slug = 'numerico'
    and nullif(stimulus->>'resource_v5_reference', '') is not null;
  if actual <> 4000 then raise exception 'Referencias V5 de Numérico: %, esperado 4000', actual; end if;

  select count(*) into actual from public.trop_families where active;
  if actual <> 108 then raise exception 'Familias activas: %, esperado 108', actual; end if;

  select count(*) into actual from public.trop_product_grants where active;
  if actual <> 10 then raise exception 'Grants de producto: %, esperado 10', actual; end if;

  if not exists (
    select 1 from public.trop_motors
    where code = 'NU02' and display_order = 1 and minimum_interactive_plan = 'esencial'
  ) or not exists (
    select 1 from public.trop_motors
    where code = 'NU03' and display_order = 2 and minimum_interactive_plan = 'operativa'
  ) or not exists (
    select 1 from public.trop_motors
    where code = 'NU01' and display_order = 3 and minimum_interactive_plan = 'integral'
  ) then
    raise exception 'Orden o acceso de motores numéricos incorrecto';
  end if;

  select count(*) into actual from public.trop_visual_resources where active;
  if actual <> 3790 then raise exception 'Recursos visuales maestros vigentes: %, esperado 3790', actual; end if;

  select count(*) into actual
  from (
    values
      ('abstracto', 540), ('espacial', 450), ('mecanico', 840),
      ('memoria', 560), ('numerico', 541), ('perceptivo', 850), ('verbal', 9)
  ) expected(aptitude_slug, resources_expected)
  where (
    select count(*) from public.trop_visual_resources resource
    where resource.active and resource.aptitude_slug = expected.aptitude_slug
  ) = expected.resources_expected;
  if actual <> 7 then raise exception 'Alguna aptitud no conserva su conteo visual latest'; end if;

  select count(*) into actual from public.trop_simulacros where active;
  if actual <> 20 then raise exception 'Simulacros: %, esperado 20', actual; end if;

  select count(*) into actual
  from (select form_code from public.trop_operation_form_questions group by form_code) forms;
  if actual <> 15 then raise exception 'Formas operativas: %, esperado 15', actual; end if;

  if not exists (select 1 from public.trop_question_attempts)
    or not exists (select 1 from public.trop_simulacro_attempts)
    or not exists (select 1 from public.trop_operation_attempts) then
    raise exception 'Faltan evidencias de persistencia de alguno de los tres recorridos';
  end if;
end
$$;

select 'PASS: Tropa local latest' as result;
