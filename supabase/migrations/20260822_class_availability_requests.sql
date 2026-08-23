create table if not exists public.class_availability_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  autonomous_community text not null,
  academic_level text not null,
  subject text not null,
  topic text not null,
  book_publisher text,
  notes text,
  privacy_accepted boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'availability_confirmed', 'declined', 'contracted')),
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_availability_requests_status_created_idx
  on public.class_availability_requests (status, created_at desc);

create index if not exists class_availability_requests_email_created_idx
  on public.class_availability_requests (lower(email), created_at desc);

alter table public.class_availability_requests enable row level security;

revoke all on table public.class_availability_requests
  from public, anon, authenticated;

grant all on table public.class_availability_requests
  to service_role;

comment on table public.class_availability_requests is
  'Solicitudes previas de disponibilidad para Clases Online de otras asignaturas. No implican contratación ni pago.';
