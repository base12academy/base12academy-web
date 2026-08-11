-- Matrículas y permisos de acceso por curso y modalidad.
create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  plan_slug text not null,
  status text not null default 'active'
    check (status in ('pending', 'active', 'expired', 'cancelled', 'refunded')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  payment_order_id text,
  amount_cents integer check (amount_cents is null or amount_cents >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug, plan_slug)
);

create index if not exists course_enrollments_user_course_idx
  on public.course_enrollments (user_id, course_slug);

create index if not exists course_enrollments_active_idx
  on public.course_enrollments (user_id, status, expires_at);

alter table public.course_enrollments enable row level security;

drop policy if exists "Users can read their enrollments" on public.course_enrollments;
create policy "Users can read their enrollments"
on public.course_enrollments
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.course_enrollments from anon;
grant select on table public.course_enrollments to authenticated;
grant all on table public.course_enrollments to service_role;

comment on table public.course_enrollments is
  'Matrículas individuales por curso y modalidad, con vigencia y referencia de pago.';

