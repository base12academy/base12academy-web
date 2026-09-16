create table if not exists public.trop_visual_resources (
  resource_key text primary key,
  source_id text not null,
  aptitude_slug text not null references public.trop_aptitudes(slug) on delete restrict,
  family_ref text,
  object_path text not null unique,
  mime_type text not null check (mime_type in ('image/png', 'image/svg+xml')),
  size_bytes integer not null check (size_bytes > 0),
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trop_visual_resources_lookup_idx
  on public.trop_visual_resources(aptitude_slug, source_id, active);
create index if not exists trop_visual_resources_family_idx
  on public.trop_visual_resources(aptitude_slug, family_ref, active);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trop-resources', 'trop-resources', false, 10485760, array['image/png', 'image/svg+xml'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.trop_visual_resources enable row level security;
revoke all on table public.trop_visual_resources from anon, authenticated;
grant all on table public.trop_visual_resources to service_role;

comment on table public.trop_visual_resources is
  'Repositorio maestro único de recursos visuales TROP; los productos acceden mediante grants y filtros.';
