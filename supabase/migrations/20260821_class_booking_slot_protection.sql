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
  perform pg_advisory_xact_lock(
    hashtextextended(p_slot_start::text, 0)
  );

  update public.class_booking_holds
  set
    status = 'expired',
    updated_at = now()
  where slot_start = p_slot_start
    and status = 'held'
    and expires_at <= now();

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
   * Una clase ya confirmada también bloquea
   * definitivamente la franja.
   */
  if exists (
    select 1
    from public.class_bookings
    where slot_start = p_slot_start
      and status in (
        'confirmed',
        'completed',
        'no_show'
      )
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
