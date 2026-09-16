create table if not exists public.trop_varadero_system (
  system_id text primary key,
  version text not null,
  config_json jsonb not null,
  source_file text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(config_json) = 'object')
);

create table if not exists public.trop_varadero_contents (
  varadero_id text primary key,
  aptitude_slug text not null unique references public.trop_aptitudes(slug) on delete restrict,
  varadero_code text not null unique,
  title text not null,
  full_text text not null,
  content_json jsonb not null,
  source_document text not null,
  source_document_sha256 text not null check (source_document_sha256 ~ '^[0-9a-f]{64}$'),
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(content_json) = 'object')
);

alter table public.trop_varadero_system enable row level security;
alter table public.trop_varadero_contents enable row level security;

revoke all on table public.trop_varadero_system from anon, authenticated;
revoke all on table public.trop_varadero_contents from anon, authenticated;

grant all on table public.trop_varadero_system to service_role;
grant all on table public.trop_varadero_contents to service_role;

comment on table public.trop_varadero_system is
  'Configuración global del sistema adaptativo Varaderos Tropa.';
comment on table public.trop_varadero_contents is
  'Contenido pedagógico completo de los 7 Varaderos de recuperación adaptativa Tropa.';
