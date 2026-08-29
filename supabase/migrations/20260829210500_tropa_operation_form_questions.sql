create table if not exists public.trop_operation_form_questions (
  form_code text not null,
  usage_type text not null check (usage_type in ('PRUEBA_MAR','OPERACIONES')),
  difficulty text not null,
  variant text not null,
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
  source_simulacro_origin text,
  sea_trial_code text,
  access_min text,
  destination_name text,
  stage text,
  operation_code text,
  source_row_hash text not null check (source_row_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (form_code, aptitude_slug, factor_position),
  unique (question_id),
  check (jsonb_typeof(options) = 'object'),
  check (options ?& array['A','B','C','D']),
  check (jsonb_typeof(stimulus) = 'object'),
  check (jsonb_typeof(audit_data) = 'object')
);

create index if not exists trop_operation_form_questions_form_idx
  on public.trop_operation_form_questions(form_code, aptitude_slug, factor_position);

create index if not exists trop_operation_form_questions_motor_idx
  on public.trop_operation_form_questions(motor_code, level);

alter table public.trop_operation_form_questions enable row level security;

revoke all on table public.trop_operation_form_questions from anon, authenticated;
grant all on table public.trop_operation_form_questions to service_role;

comment on table public.trop_operation_form_questions is
  'Corpus exacto de las 1575 preguntas de las 15 formas OP de Tropa: 7 Pruebas de Mar y 8 Operaciones.';
