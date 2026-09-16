create table if not exists public.trop_microtemario_contents (
  micro_id text primary key references public.trop_microtemarios(micro_id) on delete cascade,
  full_text text not null,
  content_json jsonb not null,
  source_document text not null,
  source_document_sha256 text not null check (source_document_sha256 ~ '^[0-9a-f]{64}$'),
  source_zip text not null,
  source_zip_sha256 text not null check (source_zip_sha256 ~ '^[0-9a-f]{64}$'),
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(content_json) = 'object')
);

alter table public.trop_microtemario_contents enable row level security;

revoke all on table public.trop_microtemario_contents from anon;
grant select on table public.trop_microtemario_contents to authenticated;
grant all on table public.trop_microtemario_contents to service_role;
