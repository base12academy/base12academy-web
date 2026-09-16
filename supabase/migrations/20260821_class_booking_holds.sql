create table if not exists public.class_booking_holds (
  id uuid primary key default gen_random_uuid(),

  slot_start timestamptz not null,
  slot_end timestamptz not null,

  status text not null default 'held'
    check (
      status in (
        'held',
        'converted',
        'expired',
        'cancelled'
      )
    ),

  hold_token_hash text not null unique,

  expires_at timestamptz not null,

  checkout_order_id uuid
    references public.checkout_orders(id)
    on delete set null,

  linked_user_id uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint class_booking_holds_one_hour_check
    check (slot_end = slot_start + interval '1 hour')
);

create unique index if not exists class_booking_holds_active_slot_idx
on public.class_booking_holds (slot_start)
where status = 'held';

create index if not exists class_booking_holds_expires_idx
on public.class_booking_holds (expires_at)
where status = 'held';

create index if not exists class_booking_holds_checkout_idx
on public.class_booking_holds (checkout_order_id);

alter table public.class_booking_holds enable row level security;

revoke all
on table public.class_booking_holds
from anon, authenticated;

grant all
on table public.class_booking_holds
to service_role;


create or replace function public.acquire_class_booking_hold(
  p_slot_start timestamptz,
  p_hold_token_hash text
)
returns public.class_booking_holds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hold public.class_booking_holds;
begin
  /*
   * Serializa los intentos sobre una misma franja.
   * Evita que dos alumnos consigan simultáneamente la misma hora.
   */
  perform pg_advisory_xact_lock(
    hashtextextended(p_slot_start::text, 0)
  );

  /*
   * Una retención caducada de esta franja deja de bloquearla.
   */
  update public.class_booking_holds
  set
    status = 'expired',
    updated_at = now()
  where slot_start = p_slot_start
    and status = 'held'
    and expires_at <= now();

  /*
   * Si todavía existe una reserva provisional activa,
   * la franja no puede volver a reservarse.
   */
  if exists (
    select 1
    from public.class_booking_holds
    where slot_start = p_slot_start
      and status = 'held'
      and expires_at > now()
  ) then
    raise exception 'SLOT_NOT_AVAILABLE'
      using errcode = 'P0001';
  end if;

  insert into public.class_booking_holds (
    slot_start,
    slot_end,
    status,
    hold_token_hash,
    expires_at
  )
  values (
    p_slot_start,
    p_slot_start + interval '1 hour',
    'held',
    p_hold_token_hash,
    now() + interval '60 minutes'
  )
  returning *
  into v_hold;

  return v_hold;
end;
$$;

revoke all
on function public.acquire_class_booking_hold(timestamptz, text)
from public, anon, authenticated;

grant execute
on function public.acquire_class_booking_hold(timestamptz, text)
to service_role;


comment on table public.class_booking_holds is
  'Retenciones provisionales de 60 minutos para las franjas de Clases Online antes de completar el pago.';

comment on column public.class_booking_holds.hold_token_hash is
  'Hash del token privado que identifica la reserva provisional sin almacenar el token original.';
