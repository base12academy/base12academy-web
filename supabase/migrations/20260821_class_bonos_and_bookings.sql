create table if not exists public.class_bonos (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  checkout_order_id uuid not null unique
    references public.checkout_orders(id)
    on delete restrict,

  catalog_slug text not null,
  plan_slug text not null,

  class_service text not null
    check (
      class_service in (
        'universidad-historia',
        'eso-bach-historia-filosofia'
      )
    ),

  total_hours integer not null
    check (total_hours in (5, 10, 15, 20)),

  status text not null default 'active'
    check (
      status in (
        'active',
        'exhausted',
        'expired',
        'cancelled'
      )
    ),

  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists class_bonos_user_idx
on public.class_bonos (user_id);

create index if not exists class_bonos_status_idx
on public.class_bonos (status);

alter table public.class_bonos enable row level security;

revoke all
on table public.class_bonos
from anon;

grant select
on table public.class_bonos
to authenticated;

grant all
on table public.class_bonos
to service_role;


create table if not exists public.class_bookings (
  id uuid primary key default gen_random_uuid(),

  bono_id uuid not null
    references public.class_bonos(id)
    on delete restrict,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  booking_hold_id uuid unique
    references public.class_booking_holds(id)
    on delete set null,

  slot_start timestamptz not null,
  slot_end timestamptz not null,

  status text not null default 'confirmed'
    check (
      status in (
        'confirmed',
        'completed',
        'no_show',
        'cancelled_by_base12'
      )
    ),

  subject text,
  academic_level text,
  topic text,

  google_event_id text unique,
  meet_url text,

  confirmed_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint class_bookings_one_hour_check
    check (slot_end = slot_start + interval '1 hour')
);

create unique index if not exists class_bookings_active_slot_idx
on public.class_bookings (slot_start)
where status = 'confirmed';

create index if not exists class_bookings_bono_idx
on public.class_bookings (bono_id);

create index if not exists class_bookings_user_idx
on public.class_bookings (user_id);

create index if not exists class_bookings_start_idx
on public.class_bookings (slot_start);

alter table public.class_bookings enable row level security;

revoke all
on table public.class_bookings
from anon;

grant select
on table public.class_bookings
to authenticated;

grant all
on table public.class_bookings
to service_role;


/*
 * El alumno solo puede leer sus propios bonos.
 */
create policy "class_bonos_select_own"
on public.class_bonos
for select
to authenticated
using (auth.uid() = user_id);

/*
 * El alumno solo puede leer sus propias reservas.
 * Altas, cambios y cancelaciones siempre pasan por servidor.
 */
create policy "class_bookings_select_own"
on public.class_bookings
for select
to authenticated
using (auth.uid() = user_id);


comment on table public.class_bonos is
  'Bonos de horas de Clases Online contratados mediante Redsys. Validez: dos meses desde la compra.';

comment on table public.class_bookings is
  'Clases individuales de una hora consumidas o reservadas contra un bono de Clases Online.';
