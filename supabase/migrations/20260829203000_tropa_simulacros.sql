create table if not exists public.trop_simulacros (
  simulacro_id text primary key,
  display_order integer not null unique,
  title text not null,
  questions_total integer not null default 105 check (questions_total = 105),
  active boolean not null default true,
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trop_simulacro_questions (
  simulacro_id text not null references public.trop_simulacros(simulacro_id) on delete cascade,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  factor_position smallint not null check (factor_position between 1 and 15),
  question_id text not null,
  level smallint not null check (level between 1 and 5),
  motor_code text not null references public.trop_motors(code) on delete restrict,
  correct_option text not null check (correct_option in ('A','B','C','D')),
  target_time_seconds integer not null check (target_time_seconds > 0),
  prompt text not null,
  options jsonb not null,
  explanation text not null,
  stimulus jsonb not null,
  audit_data jsonb not null default '{}'::jsonb,
  source_row_hash text not null check (source_row_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (simulacro_id, aptitude_slug, factor_position),
  unique (question_id),
  check (jsonb_typeof(options) = 'object'),
  check (options ?& array['A','B','C','D']),
  check (jsonb_typeof(stimulus) = 'object'),
  check (jsonb_typeof(audit_data) = 'object')
);

create index if not exists trop_simulacro_questions_sim_idx
  on public.trop_simulacro_questions(simulacro_id, aptitude_slug, factor_position);

create index if not exists trop_simulacro_questions_motor_idx
  on public.trop_simulacro_questions(motor_code, level);

alter table public.trop_simulacros enable row level security;
alter table public.trop_simulacro_questions enable row level security;

revoke all on table public.trop_simulacros from anon, authenticated;
revoke all on table public.trop_simulacro_questions from anon, authenticated;

grant all on table public.trop_simulacros to service_role;
grant all on table public.trop_simulacro_questions to service_role;

comment on table public.trop_simulacro_questions is
  'Corpus independiente de 2100 preguntas de los 20 simulacros Base12 Tropa 7x15. Solo service_role puede leer preguntas, soluciones y explicaciones.';
