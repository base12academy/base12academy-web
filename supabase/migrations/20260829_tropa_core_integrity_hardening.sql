-- TROP · endurecimiento de integridad relacional del banco.
-- PRECONDICIÓN: 20260829_tropa_core.sql aplicado.
-- Objetivo: impedir que una pregunta apunte a motor/familia de otra aptitud.

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'trop_motors_code_aptitude_key'
      and conrelid = 'public.trop_motors'::regclass
  ) then
    alter table public.trop_motors
      add constraint trop_motors_code_aptitude_key unique (code, aptitude_slug);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'trop_families_id_aptitude_key'
      and conrelid = 'public.trop_families'::regclass
  ) then
    alter table public.trop_families
      add constraint trop_families_id_aptitude_key unique (family_id, aptitude_slug);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'trop_questions_motor_same_aptitude_fk'
      and conrelid = 'public.trop_questions'::regclass
  ) then
    alter table public.trop_questions
      add constraint trop_questions_motor_same_aptitude_fk
      foreign key (motor_code, aptitude_slug)
      references public.trop_motors(code, aptitude_slug)
      on delete restrict
      not valid;
    alter table public.trop_questions validate constraint trop_questions_motor_same_aptitude_fk;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'trop_questions_family_same_aptitude_fk'
      and conrelid = 'public.trop_questions'::regclass
  ) then
    alter table public.trop_questions
      add constraint trop_questions_family_same_aptitude_fk
      foreign key (family_id, aptitude_slug)
      references public.trop_families(family_id, aptitude_slug)
      on delete restrict
      not valid;
    alter table public.trop_questions validate constraint trop_questions_family_same_aptitude_fk;
  end if;
end $$;
