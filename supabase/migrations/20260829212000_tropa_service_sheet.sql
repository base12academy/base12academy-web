create table if not exists public.trop_service_sheet_rules (
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

create index if not exists trop_service_sheet_rules_sheet_idx
  on public.trop_service_sheet_rules(sheet_name, row_order);

alter table public.trop_service_sheet_rules enable row level security;

revoke all on table public.trop_service_sheet_rules from anon, authenticated;
grant all on table public.trop_service_sheet_rules to service_role;

comment on table public.trop_service_sheet_rules is
  'Configuración funcional de la Hoja de Servicio Tropa: campos, indicadores, estados, hitos, refuerzo, Fernando, Parte, Pruebas de Mar, historial e implementación.';
