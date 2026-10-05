create table if not exists public.tehalo_opposition_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  email text not null,
  person_type text not null default 'physical' check (person_type = 'physical'),
  opposition_name text not null,
  official_call_id uuid,
  official_url text,
  administration text not null,
  position_name text not null,
  level text not null,
  territory text not null,
  reference_kind text not null check (reference_kind in ('current', 'bank', 'latest')),
  latest_authorization boolean not null default false,
  requested_materials text[] not null,
  indicative_minimum_cents integer not null check (indicative_minimum_cents >= 0),
  classification jsonb not null default '{}'::jsonb,
  supervision jsonb not null default '{}'::jsonb,
  status text not null default 'received' check (status in (
    'received', 'under_review', 'proposal_ready', 'proposal_sent',
    'awaiting_payment', 'paid', 'in_production', 'delivered', 'cancelled'
  )),
  privacy_consent_at timestamptz not null,
  marketing_consent_at timestamptz,
  ip_hash text,
  user_agent text,
  proposal jsonb,
  final_price_cents integer check (final_price_cents is null or final_price_cents >= 0),
  proposal_token_hash text,
  proposal_expires_at timestamptz,
  redsys_order_id text,
  invoice_number text,
  invoice_sent_at timestamptz,
  invoice_copy_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(requested_materials) > 0),
  check (reference_kind <> 'latest' or latest_authorization = true)
);

create index if not exists tehalo_opposition_requests_email_idx
  on public.tehalo_opposition_requests (lower(email), created_at desc);
create index if not exists tehalo_opposition_requests_status_idx
  on public.tehalo_opposition_requests (status, created_at desc);
create index if not exists tehalo_opposition_requests_ip_idx
  on public.tehalo_opposition_requests (ip_hash, created_at desc)
  where ip_hash is not null;

create or replace function public.set_tehalo_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tehalo_opposition_requests_updated_at on public.tehalo_opposition_requests;
create trigger set_tehalo_opposition_requests_updated_at
before update on public.tehalo_opposition_requests
for each row execute function public.set_tehalo_updated_at();

alter table public.tehalo_opposition_requests enable row level security;
revoke all on public.tehalo_opposition_requests from anon, authenticated;
grant select, insert, update, delete on public.tehalo_opposition_requests to service_role;
revoke execute on function public.set_tehalo_updated_at() from public, anon, authenticated;

comment on table public.tehalo_opposition_requests is
  'Solicitudes privadas de Tehalo Pruebas Opositores, propiedad de Editorial EC Libros, S. L.';
