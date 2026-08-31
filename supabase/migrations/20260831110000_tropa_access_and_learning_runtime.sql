-- Tropa y Marinería: grants de los productos actuales y progreso aislado.

create table if not exists public.trop_product_grants (
  product_slug text primary key,
  scope_kind text not null check (scope_kind in ('general', 'aptitude')),
  general_rank smallint check (general_rank between 1 and 3),
  aptitude_slug text references public.trop_aptitudes(slug) on delete restrict,
  questions_expected integer not null check (questions_expected > 0),
  motors_expected smallint not null check (motors_expected between 1 and 21),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (scope_kind = 'general' and general_rank is not null and aptitude_slug is null)
    or (scope_kind = 'aptitude' and general_rank is null and aptitude_slug is not null)
  )
);

insert into public.trop_product_grants
  (product_slug, scope_kind, general_rank, aptitude_slug, questions_expected, motors_expected)
values
  ('esencial', 'general', 1, null, 14000, 7),
  ('operativa', 'general', 2, null, 21000, 14),
  ('integral', 'general', 3, null, 28000, 21),
  ('aptitud-verbal', 'aptitude', null, 'verbal', 4000, 3),
  ('aptitud-numerica', 'aptitude', null, 'numerico', 4000, 3),
  ('aptitud-espacial', 'aptitude', null, 'espacial', 4000, 3),
  ('aptitud-mecanica', 'aptitude', null, 'mecanico', 4000, 3),
  ('aptitud-perceptiva', 'aptitude', null, 'perceptivo', 4000, 3),
  ('memoria', 'aptitude', null, 'memoria', 4000, 3),
  ('razonamiento-abstracto', 'aptitude', null, 'abstracto', 4000, 3)
on conflict (product_slug) do update set
  scope_kind = excluded.scope_kind,
  general_rank = excluded.general_rank,
  aptitude_slug = excluded.aptitude_slug,
  questions_expected = excluded.questions_expected,
  motors_expected = excluded.motors_expected,
  active = true,
  updated_at = now();

create or replace function public.trop_user_can_access_aptitude(requested_aptitude text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_enrollments enrollment
    join public.trop_product_grants grant_row
      on grant_row.product_slug = enrollment.plan_slug
     and grant_row.active
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
      and (
        grant_row.scope_kind = 'general'
        or grant_row.aptitude_slug = requested_aptitude
      )
  );
$$;

create or replace function public.trop_user_can_access_motor(
  requested_aptitude text,
  requested_minimum_plan text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_enrollments enrollment
    join public.trop_product_grants grant_row
      on grant_row.product_slug = enrollment.plan_slug
     and grant_row.active
    where enrollment.user_id = auth.uid()
      and enrollment.course_slug = 'tropa-y-marineria'
      and enrollment.status = 'active'
      and enrollment.starts_at <= now()
      and (enrollment.expires_at is null or enrollment.expires_at >= now())
      and (
        (grant_row.scope_kind = 'aptitude' and grant_row.aptitude_slug = requested_aptitude)
        or (grant_row.scope_kind = 'general' and grant_row.general_rank >= public.trop_plan_rank(requested_minimum_plan))
      )
  );
$$;

revoke all on function public.trop_user_can_access_aptitude(text) from public, anon;
revoke all on function public.trop_user_can_access_motor(text, text) from public, anon;
grant execute on function public.trop_user_can_access_aptitude(text) to authenticated, service_role;
grant execute on function public.trop_user_can_access_motor(text, text) to authenticated, service_role;

drop policy if exists "Enrolled students read TROP aptitudes" on public.trop_aptitudes;
create policy "Enrolled students read TROP aptitudes"
on public.trop_aptitudes for select to authenticated
using (public.trop_user_can_access_aptitude(slug));

drop policy if exists "Enrolled students read TROP motors" on public.trop_motors;
create policy "Enrolled students read TROP motors"
on public.trop_motors for select to authenticated
using (public.trop_user_can_access_motor(aptitude_slug, minimum_interactive_plan));

drop policy if exists "Enrolled students read TROP families" on public.trop_families;
create policy "Enrolled students read TROP families"
on public.trop_families for select to authenticated
using (public.trop_user_can_access_aptitude(aptitude_slug));

create table if not exists public.trop_question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.trop_questions(question_id) on delete restrict,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  motor_code text not null references public.trop_motors(code) on delete restrict,
  family_id text not null references public.trop_families(family_id) on delete restrict,
  level smallint not null check (level between 1 and 5),
  selected_option text not null check (selected_option in ('A', 'B', 'C', 'D')),
  correct boolean not null,
  error_code text,
  response_ms integer not null default 0 check (response_ms between 0 and 3600000),
  answered_at timestamptz not null default now()
);

create index if not exists trop_question_attempts_user_time_idx
  on public.trop_question_attempts(user_id, answered_at desc);
create index if not exists trop_question_attempts_user_aptitude_idx
  on public.trop_question_attempts(user_id, aptitude_slug, correct, answered_at desc);
create index if not exists trop_question_attempts_user_error_idx
  on public.trop_question_attempts(user_id, error_code, answered_at desc)
  where error_code is not null;

create table if not exists public.trop_simulacro_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulacro_id text not null references public.trop_simulacros(simulacro_id) on delete restrict,
  aptitude_scope text[] not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  score integer not null check (score >= 0),
  questions_total integer not null check (questions_total > 0 and score <= questions_total),
  completed_at timestamptz not null default now()
);

create index if not exists trop_simulacro_attempts_user_time_idx
  on public.trop_simulacro_attempts(user_id, completed_at desc);

create table if not exists public.trop_operation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_code text not null,
  usage_type text not null check (usage_type in ('PRUEBA_MAR', 'OPERACIONES')),
  aptitude_scope text[] not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  score integer not null check (score >= 0),
  questions_total integer not null check (questions_total > 0 and score <= questions_total),
  completed_at timestamptz not null default now()
);

create index if not exists trop_operation_attempts_user_time_idx
  on public.trop_operation_attempts(user_id, completed_at desc);

alter table public.trop_product_grants enable row level security;
alter table public.trop_question_attempts enable row level security;
alter table public.trop_simulacro_attempts enable row level security;
alter table public.trop_operation_attempts enable row level security;

revoke all on table public.trop_product_grants from anon, authenticated;
revoke all on table public.trop_question_attempts from anon, authenticated;
revoke all on table public.trop_simulacro_attempts from anon, authenticated;
revoke all on table public.trop_operation_attempts from anon, authenticated;
grant select on table public.trop_question_attempts to authenticated;
grant select on table public.trop_simulacro_attempts to authenticated;
grant select on table public.trop_operation_attempts to authenticated;
grant all on table public.trop_product_grants to service_role;
grant all on table public.trop_question_attempts to service_role;
grant all on table public.trop_simulacro_attempts to service_role;
grant all on table public.trop_operation_attempts to service_role;

drop policy if exists "Students read their TROP question attempts" on public.trop_question_attempts;
create policy "Students read their TROP question attempts"
on public.trop_question_attempts for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Students read their TROP simulacro attempts" on public.trop_simulacro_attempts;
create policy "Students read their TROP simulacro attempts"
on public.trop_simulacro_attempts for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Students read their TROP operation attempts" on public.trop_operation_attempts;
create policy "Students read their TROP operation attempts"
on public.trop_operation_attempts for select to authenticated
using (user_id = auth.uid());

comment on table public.trop_product_grants is
  'Fuente única de grants de los 3 paquetes generales y los 7 productos individuales TROP; no duplica contenido.';
