create extension if not exists pgcrypto;

create table if not exists public.opposition_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  territory text not null,
  base_url text not null,
  consultation_method text not null,
  active boolean not null default false,
  priority smallint not null default 100,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, territory)
);

create table if not exists public.opposition_calls (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.opposition_sources(id) on delete restrict,
  source_external_id text not null,
  related_external_ids text[] not null default '{}',
  slug text not null unique,
  title text not null,
  summary text,
  organisation text,
  administration text,
  territory text not null,
  province text,
  locality text,
  group_category text,
  specialty text,
  vacancies integer,
  access_system text,
  status text not null default 'publicada',
  publication_date date not null,
  application_start date,
  application_end date,
  exam_date date,
  official_syllabus_included boolean,
  official_url text not null,
  application_url text,
  bulletin_name text not null,
  bulletin_identifier text,
  base12_course_slug text,
  active boolean not null default true,
  last_official_update timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, source_external_id),
  check (vacancies is null or vacancies >= 0)
);

create table if not exists public.opposition_publications (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references public.opposition_calls(id) on delete cascade,
  source_id uuid not null references public.opposition_sources(id) on delete restrict,
  external_id text not null,
  publication_type text not null default 'publicacion',
  publication_date date not null,
  bulletin_name text not null,
  bulletin_identifier text,
  official_url text not null,
  official_pdf_url text,
  change_summary text not null,
  relevance text not null default 'informativa'
    check (relevance in ('informativa', 'relevante', 'critica')),
  detected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);

create table if not exists public.opposition_subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  management_token_hash text not null,
  email_verified_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opposition_alerts (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.opposition_subscribers(id) on delete cascade,
  alert_type text not null check (alert_type in ('general', 'convocatoria')),
  call_id uuid references public.opposition_calls(id) on delete cascade,
  criteria jsonb not null default '{}'::jsonb,
  email_enabled boolean not null default true,
  telegram_enabled boolean not null default false,
  service_consent_at timestamptz not null,
  telegram_consent_at timestamptz,
  commercial_consent_at timestamptz,
  active boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (alert_type = 'convocatoria' and call_id is not null)
    or (alert_type = 'general' and call_id is null)
  )
);

create table if not exists public.opposition_notification_log (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.opposition_alerts(id) on delete cascade,
  publication_id uuid references public.opposition_publications(id) on delete cascade,
  call_id uuid not null references public.opposition_calls(id) on delete cascade,
  channel text not null check (channel in ('email', 'telegram')),
  status text not null check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider_id text,
  error_message text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (alert_id, call_id, publication_id, channel)
);

create table if not exists public.opposition_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.opposition_sources(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running'
    check (status in ('running', 'success', 'partial', 'failed')),
  publications_detected integer not null default 0,
  calls_created integer not null default 0,
  calls_updated integer not null default 0,
  alerts_queued integer not null default 0,
  error_message text,
  details jsonb not null default '{}'::jsonb
);

create index if not exists opposition_calls_public_idx
  on public.opposition_calls (active, publication_date desc);
create index if not exists opposition_calls_territory_idx
  on public.opposition_calls (territory, status, publication_date desc);
create index if not exists opposition_calls_search_idx
  on public.opposition_calls using gin (
    to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(organisation, '') || ' ' || coalesce(specialty, ''))
  );
create index if not exists opposition_publications_call_idx
  on public.opposition_publications (call_id, publication_date desc, detected_at desc);
create index if not exists opposition_alerts_active_idx
  on public.opposition_alerts (active, alert_type, call_id);
create unique index if not exists opposition_subscribers_email_idx
  on public.opposition_subscribers (lower(email));
create index if not exists opposition_ingestion_runs_source_idx
  on public.opposition_ingestion_runs (source_id, started_at desc);

create or replace function public.set_opposition_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists opposition_sources_updated_at on public.opposition_sources;
create trigger opposition_sources_updated_at
before update on public.opposition_sources
for each row execute function public.set_opposition_updated_at();

drop trigger if exists opposition_calls_updated_at on public.opposition_calls;
create trigger opposition_calls_updated_at
before update on public.opposition_calls
for each row execute function public.set_opposition_updated_at();

drop trigger if exists opposition_subscribers_updated_at on public.opposition_subscribers;
create trigger opposition_subscribers_updated_at
before update on public.opposition_subscribers
for each row execute function public.set_opposition_updated_at();

drop trigger if exists opposition_alerts_updated_at on public.opposition_alerts;
create trigger opposition_alerts_updated_at
before update on public.opposition_alerts
for each row execute function public.set_opposition_updated_at();

alter table public.opposition_sources enable row level security;
alter table public.opposition_calls enable row level security;
alter table public.opposition_publications enable row level security;
alter table public.opposition_subscribers enable row level security;
alter table public.opposition_alerts enable row level security;
alter table public.opposition_notification_log enable row level security;
alter table public.opposition_ingestion_runs enable row level security;

drop policy if exists "Public can read active opposition sources" on public.opposition_sources;
create policy "Public can read active opposition sources"
on public.opposition_sources for select
using (active is true);

drop policy if exists "Public can read active opposition calls" on public.opposition_calls;
create policy "Public can read active opposition calls"
on public.opposition_calls for select
using (active is true);

drop policy if exists "Public can read opposition publications" on public.opposition_publications;
create policy "Public can read opposition publications"
on public.opposition_publications for select
using (
  exists (
    select 1 from public.opposition_calls c
    where c.id = call_id and c.active is true
  )
);

insert into public.opposition_sources (
  name, source_type, territory, base_url, consultation_method, active, priority
)
values
  ('Boletín Oficial del Estado', 'boletin_estatal', 'España', 'https://www.boe.es', 'boe_sumario_api', true, 1),
  ('Boletín Oficial de la Junta de Andalucía', 'boletin_autonomico', 'Andalucía', 'https://www.juntadeandalucia.es/eboja.html', 'boja_open_data_api', false, 2),
  ('Boletín Oficial de la Comunidad de Madrid', 'boletin_autonomico', 'Madrid', 'https://www.bocm.es', 'conector_pendiente', false, 3),
  ('Diari Oficial de la Generalitat Valenciana', 'boletin_autonomico', 'Comunitat Valenciana', 'https://dogv.gva.es', 'conector_pendiente', false, 4)
on conflict (name, territory) do update set
  source_type = excluded.source_type,
  base_url = excluded.base_url,
  consultation_method = excluded.consultation_method,
  priority = excluded.priority,
  updated_at = now();

comment on table public.opposition_calls is
  'Convocatorias factuales obtenidas de fuentes oficiales; los datos ausentes permanecen nulos.';
comment on table public.opposition_publications is
  'Historial cronológico de publicaciones oficiales asociadas a una misma convocatoria.';
comment on column public.opposition_alerts.commercial_consent_at is
  'Consentimiento comercial independiente del consentimiento obligatorio de alertas de servicio.';

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule(jobid)
    from cron.job
    where jobname = 'base12-opposition-ingestion';

    perform cron.schedule(
      'base12-opposition-ingestion',
      '20 6 * * *',
      $job$
      select net.http_post(
        url := 'https://base12academy.es/api/banco-opositores/ingest',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || coalesce(
            (select decrypted_secret from vault.decrypted_secrets where name = 'base12_cron_secret' limit 1),
            ''
          )
        ),
        body := jsonb_build_object('source', 'boe')
      );
      $job$
    );
  end if;
end
$$;
