create or replace function public.reserve_class_from_bono(
  p_bono_id uuid,
  p_slot_start timestamptz,
  p_subject text default null,
  p_academic_level text default null,
  p_topic text default null
)
returns public.class_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_bono public.class_bonos;
  v_used_hours integer;
  v_booking public.class_bookings;
begin
  /*
   * Bloqueamos el bono durante toda la operación.
   * Dos peticiones simultáneas no pueden consumir
   * la última hora a la vez.
   */
  select *
  into v_bono
  from public.class_bonos
  where id = p_bono_id
  for update;

  if not found then
    raise exception 'BONO_NOT_FOUND'
      using errcode = 'P0001';
  end if;

  if v_bono.status = 'cancelled' then
    raise exception 'BONO_CANCELLED'
      using errcode = 'P0001';
  end if;

  if v_bono.expires_at <= now() then
    update public.class_bonos
    set
      status = 'expired',
      updated_at = now()
    where id = p_bono_id;

    raise exception 'BONO_EXPIRED'
      using errcode = 'P0001';
  end if;

  /*
   * Bloqueamos también la franja concreta.
   */
  perform pg_advisory_xact_lock(
    hashtextextended(p_slot_start::text, 0)
  );

  /*
   * Limpiamos una posible retención caducada.
   */
  update public.class_booking_holds
  set
    status = 'expired',
    updated_at = now()
  where slot_start = p_slot_start
    and status = 'held'
    and expires_at <= now();

  /*
   * Una retención activa o ya pagada impide
   * reservar esa misma hora desde un bono.
   */
  if exists (
    select 1
    from public.class_booking_holds
    where slot_start = p_slot_start
      and (
        status = 'paid'
        or (
          status = 'held'
          and expires_at > now()
        )
      )
  ) then
    raise exception 'SLOT_NOT_AVAILABLE'
      using errcode = 'P0001';
  end if;

  /*
   * Tampoco puede existir ya una clase confirmada
   * en esa franja.
   */
  if exists (
    select 1
    from public.class_bookings
    where slot_start = p_slot_start
      and status = 'confirmed'
  ) then
    raise exception 'SLOT_NOT_AVAILABLE'
      using errcode = 'P0001';
  end if;

  /*
   * Consumen una hora:
   * confirmed  -> reservada
   * completed  -> realizada
   * no_show    -> ausencia del alumno
   *
   * cancelled_by_base12 NO consume.
   */
  select count(*)::integer
  into v_used_hours
  from public.class_bookings
  where bono_id = p_bono_id
    and status in (
      'confirmed',
      'completed',
      'no_show'
    );

  if v_used_hours >= v_bono.total_hours then
    raise exception 'BONO_EXHAUSTED'
      using errcode = 'P0001';
  end if;

  insert into public.class_bookings (
    bono_id,
    user_id,
    slot_start,
    slot_end,
    status,
    subject,
    academic_level,
    topic
  )
  values (
    v_bono.id,
    v_bono.user_id,
    p_slot_start,
    p_slot_start + interval '1 hour',
    'confirmed',
    nullif(trim(p_subject), ''),
    nullif(trim(p_academic_level), ''),
    nullif(trim(p_topic), '')
  )
  returning *
  into v_booking;

  return v_booking;
end;
$$;

revoke all
on function public.reserve_class_from_bono(
  uuid,
  timestamptz,
  text,
  text,
  text
)
from public, anon, authenticated;

grant execute
on function public.reserve_class_from_bono(
  uuid,
  timestamptz,
  text,
  text,
  text
)
to service_role;


/*
 * Vista de saldo: no guarda un contador duplicado.
 * Lo calcula siempre a partir de las clases reales.
 */
create or replace view public.class_bono_balances
with (security_invoker = true)
as
select
  b.id as bono_id,
  b.user_id,
  b.class_service,
  b.total_hours,

  count(bk.id) filter (
    where bk.status in (
      'confirmed',
      'completed',
      'no_show'
    )
  )::integer as committed_hours,

  greatest(
    b.total_hours -
    count(bk.id) filter (
      where bk.status in (
        'confirmed',
        'completed',
        'no_show'
      )
    )::integer,
    0
  ) as available_hours,

  b.status,
  b.purchased_at,
  b.expires_at

from public.class_bonos b

left join public.class_bookings bk
  on bk.bono_id = b.id

group by b.id;

grant select
on public.class_bono_balances
to authenticated, service_role;
