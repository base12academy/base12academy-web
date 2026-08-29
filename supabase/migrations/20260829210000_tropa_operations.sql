create table if not exists public.trop_sea_trials (
  trial_code text primary key,
  trial_name text not null,
  source_simulacro text not null,
  access_min text not null check (access_min in ('esencial','operativa','integral')),
  stage text not null,
  difficulty text not null,
  variant text not null,
  average_level numeric not null,
  level_distribution text not null,
  official_attempt integer not null,
  function_text text not null,
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trop_operations (
  operation_code text primary key,
  source_simulacro text not null,
  difficulty text not null,
  variant text not null,
  average_level numeric not null,
  questions_total integer not null,
  factors_total integer not null,
  motors_per_factor text not null,
  strict_time text not null,
  destination text not null,
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trop_operations_rules (
  rule_id text primary key,
  sheet_name text not null,
  row_order integer not null,
  data_json jsonb not null,
  source_file text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sheet_name, row_order),
  check (jsonb_typeof(data_json) = 'object')
);

alter table public.trop_sea_trials enable row level security;
alter table public.trop_operations enable row level security;
alter table public.trop_operations_rules enable row level security;

revoke all on table public.trop_sea_trials from anon, authenticated;
revoke all on table public.trop_operations from anon, authenticated;
revoke all on table public.trop_operations_rules from anon, authenticated;

grant all on table public.trop_sea_trials to service_role;
grant all on table public.trop_operations to service_role;
grant all on table public.trop_operations_rules to service_role;

comment on table public.trop_sea_trials is
  'Configuración de las 7 Pruebas de Mar oficiales de Tropa.';
comment on table public.trop_operations is
  'Configuración de las Operaciones preconfiguradas de entrenamiento Tropa.';
comment on table public.trop_operations_rules is
  'Definiciones del Parte de Operaciones: campos, cálculos, diagnóstico, recomendaciones y salidas.';
