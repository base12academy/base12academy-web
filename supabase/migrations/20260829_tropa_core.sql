-- Tropa y Marinería: catálogo psicotécnico y banco V4.
-- Esta migración reutiliza auth.users, course_enrollments, checkout_orders,
-- course_learning_events, billing_profiles, study_plans y base12_invoices.

create or replace function public.trop_plan_rank(plan_slug text)
returns smallint
language sql
immutable
strict
as $$
  select case lower(plan_slug)
    when 'esencial' then 1
    when 'operativa' then 2
    when 'integral' then 3
    else 0
  end::smallint;
$$;

revoke all on function public.trop_plan_rank(text) from public, anon;
grant execute on function public.trop_plan_rank(text) to authenticated, service_role;

create table if not exists public.trop_aptitudes (
  slug text primary key,
  code text not null unique,
  name text not null unique,
  display_order smallint not null unique check (display_order between 1 and 7),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slug in ('verbal', 'numerico', 'espacial', 'mecanico', 'perceptivo', 'memoria', 'abstracto'))
);

create table if not exists public.trop_motors (
  code text primary key,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  name text not null,
  display_order smallint not null check (display_order between 1 and 3),
  minimum_interactive_plan text not null
    check (minimum_interactive_plan in ('esencial', 'operativa', 'integral')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aptitude_slug, display_order),
  unique (aptitude_slug, name)
);

create table if not exists public.trop_plan_motors (
  plan_slug text not null check (plan_slug in ('esencial', 'operativa', 'integral')),
  motor_code text not null references public.trop_motors(code) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (plan_slug, motor_code)
);

create table if not exists public.trop_families (
  family_id text primary key,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  name text not null,
  evaluable boolean not null default true,
  transverse boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aptitude_slug, name)
);

create index if not exists trop_families_aptitude_idx
  on public.trop_families (aptitude_slug, active, family_id);

create table if not exists public.trop_questions (
  question_id text primary key,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  motor_code text not null references public.trop_motors(code) on delete restrict,
  family_id text not null references public.trop_families(family_id) on delete restrict,
  level smallint not null check (level between 1 and 5),
  access_min text not null check (access_min in ('esencial', 'operativa', 'integral')),
  usage text not null default 'general' check (usage in ('general', 'prueba_mar', 'simulacro', 'entrenamiento')),
  prompt text not null check (length(btrim(prompt)) > 0),
  options jsonb not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null check (length(btrim(explanation)) > 0),
  feedback jsonb not null,
  error_codes jsonb not null,
  stimulus jsonb not null,
  audit_status text not null,
  audit_version text not null,
  source_archive text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_row_hash text not null check (source_row_hash ~ '^[0-9a-f]{64}$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(options) = 'object'),
  check (options ?& array['A', 'B', 'C', 'D']),
  check (jsonb_typeof(feedback) = 'object'),
  check (feedback ?& array['A', 'B', 'C', 'D']),
  check (jsonb_typeof(error_codes) = 'object'),
  check (error_codes ?& array['A', 'B', 'C', 'D']),
  check (jsonb_typeof(stimulus) = 'object')
);

create index if not exists trop_questions_selector_idx
  on public.trop_questions (active, access_min, usage, aptitude_slug, level);
create index if not exists trop_questions_motor_idx
  on public.trop_questions (motor_code, level, active);
create index if not exists trop_questions_family_idx
  on public.trop_questions (family_id, level, active);
create index if not exists trop_questions_audit_idx
  on public.trop_questions (audit_version, audit_status);

create table if not exists public.trop_import_batches (
  id uuid primary key default gen_random_uuid(),
  source_archive text not null,
  source_sha256 text not null unique check (source_sha256 ~ '^[0-9a-f]{64}$'),
  audit_version text not null,
  question_count integer not null check (question_count > 0),
  status text not null check (status in ('validated', 'importing', 'completed', 'failed')),
  summary jsonb not null default '{}'::jsonb,
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.trop_aptitudes (slug, code, name, display_order)
values
  ('verbal', 'VER', 'Verbal', 1),
  ('numerico', 'NUM', 'Numérico', 2),
  ('espacial', 'ESP', 'Espacial', 3),
  ('mecanico', 'MEC', 'Mecánico', 4),
  ('perceptivo', 'PER', 'Perceptivo', 5),
  ('memoria', 'MEM', 'Memoria', 6),
  ('abstracto', 'ABS', 'Razonamiento Abstracto', 7)
on conflict (slug) do update set
  code = excluded.code,
  name = excluded.name,
  display_order = excluded.display_order,
  active = true,
  updated_at = now();

insert into public.trop_motors
  (code, aptitude_slug, name, display_order, minimum_interactive_plan)
values
  ('VB01', 'verbal', 'Intruso semántico', 1, 'esencial'),
  ('VB02', 'verbal', 'Parejas relámpago', 2, 'operativa'),
  ('VB03', 'verbal', 'Analogía táctica', 3, 'integral'),
  ('NU01', 'numerico', 'Número objetivo', 1, 'esencial'),
  ('NU02', 'numerico', 'Estimación rápida', 2, 'operativa'),
  ('NU03', 'numerico', 'Caza la serie', 3, 'integral'),
  ('ES01', 'espacial', 'Giro mental', 1, 'esencial'),
  ('ES02', 'espacial', 'Espejo o giro', 2, 'operativa'),
  ('ES03', 'espacial', 'Cierra el cubo', 3, 'integral'),
  ('ME01', 'mecanico', 'Cadena de engranajes', 1, 'esencial'),
  ('ME03', 'mecanico', 'Equilibra la palanca', 2, 'operativa'),
  ('ME05', 'mecanico', '¿Qué ocurrirá?', 3, 'integral'),
  ('PE01', 'perceptivo', 'Radar', 1, 'esencial'),
  ('PE02', 'perceptivo', 'El infiltrado', 2, 'operativa'),
  ('PE03', 'perceptivo', 'Comparación flash', 3, 'integral'),
  ('MEM01', 'memoria', 'Kim Base12', 1, 'esencial'),
  ('MEM03', 'memoria', '¿Qué cambió?', 2, 'operativa'),
  ('MEM04', 'memoria', 'Mapa de memoria', 3, 'integral'),
  ('AB01', 'abstracto', 'Regla oculta', 1, 'esencial'),
  ('AB04', 'abstracto', 'Matriz incompleta', 2, 'operativa'),
  ('AB05', 'abstracto', 'Cazador de hipótesis', 3, 'integral')
on conflict (code) do update set
  aptitude_slug = excluded.aptitude_slug,
  name = excluded.name,
  display_order = excluded.display_order,
  minimum_interactive_plan = excluded.minimum_interactive_plan,
  active = true,
  updated_at = now();

insert into public.trop_plan_motors (plan_slug, motor_code)
select plan_slug, code
from public.trop_motors
cross join lateral (
  values ('esencial'::text, 1), ('operativa'::text, 2), ('integral'::text, 3)
) as plans(plan_slug, maximum_order)
where display_order <= maximum_order
on conflict (plan_slug, motor_code) do nothing;

alter table public.trop_aptitudes enable row level security;
alter table public.trop_motors enable row level security;
alter table public.trop_plan_motors enable row level security;
alter table public.trop_families enable row level security;
alter table public.trop_questions enable row level security;
alter table public.trop_import_batches enable row level security;

revoke all on table public.trop_aptitudes from anon;
revoke all on table public.trop_motors from anon;
revoke all on table public.trop_plan_motors from anon;
revoke all on table public.trop_families from anon;
revoke all on table public.trop_questions from anon, authenticated;
revoke all on table public.trop_import_batches from anon, authenticated;

grant select on table public.trop_aptitudes to authenticated;
grant select on table public.trop_motors to authenticated;
grant select on table public.trop_plan_motors to authenticated;
grant select on table public.trop_families to authenticated;
grant all on table public.trop_aptitudes to service_role;
grant all on table public.trop_motors to service_role;
grant all on table public.trop_plan_motors to service_role;
grant all on table public.trop_families to service_role;
grant all on table public.trop_questions to service_role;
grant all on table public.trop_import_batches to service_role;

drop policy if exists "Enrolled students read TROP aptitudes" on public.trop_aptitudes;
create policy "Enrolled students read TROP aptitudes"
on public.trop_aptitudes for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
  )
);

drop policy if exists "Enrolled students read TROP motors" on public.trop_motors;
create policy "Enrolled students read TROP motors"
on public.trop_motors for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
      and public.trop_plan_rank(enrollment.plan_slug) >= public.trop_plan_rank(minimum_interactive_plan)
  )
);

drop policy if exists "Enrolled students read TROP plan motors" on public.trop_plan_motors;
create policy "Enrolled students read TROP plan motors"
on public.trop_plan_motors for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
      and public.trop_plan_rank(enrollment.plan_slug) >= public.trop_plan_rank(trop_plan_motors.plan_slug)
  )
);

drop policy if exists "Enrolled students read TROP families" on public.trop_families;
create policy "Enrolled students read TROP families"
on public.trop_families for select to authenticated
using (
  exists (
    select 1 from public.course_enrollments enrollment
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
  )
);

comment on table public.trop_questions is
  'Banco psicotécnico TROP V4. Solo service_role puede leer respuestas y retroalimentación completas.';
comment on column public.trop_questions.access_min is
  'Acceso mínimo de la pregunta según el banco V4; independiente del desbloqueo de motores interactivos.';
comment on table public.trop_plan_motors is
  'Desbloqueo acumulativo de motores interactivos: 7 Esencial, 14 Operativa y 21 Integral.';
