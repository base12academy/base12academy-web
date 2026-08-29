create table if not exists public.trop_workshop_contents (
  workshop_id text primary key references public.trop_workshops(workshop_id) on delete cascade,
  objective text not null,
  key_idea text not null,
  procedure text not null,
  error_to_avoid text not null,
  practice text not null,
  record text not null,
  note text,
  source_document text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trop_workshop_contents enable row level security;

revoke all on table public.trop_workshop_contents from anon;
grant select on table public.trop_workshop_contents to authenticated;
grant all on table public.trop_workshop_contents to service_role;
