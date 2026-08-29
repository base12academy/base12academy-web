create table if not exists public.trop_game_configs (
  motor_code text primary key references public.trop_motors(code) on delete cascade,
  micro_id text not null unique references public.trop_microtemarios(micro_id) on delete cascade,
  game_name text not null,
  config_json jsonb not null,
  source_file text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(config_json) = 'object')
);

alter table public.trop_game_configs enable row level security;

revoke all on table public.trop_game_configs from anon, authenticated;
grant all on table public.trop_game_configs to service_role;

comment on table public.trop_game_configs is
  'Configuración completa de los 21 juegos/motores interactivos de Tropa. Un juego por motor y microtemario.';
