create or replace function public.mark_class_booking_hold_paid(
  p_checkout_order_id uuid
)
returns public.class_booking_holds
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot_start timestamptz;
  v_hold public.class_booking_holds;
begin
  /*
   * Localizamos primero la franja vinculada al pedido.
   */
  select slot_start
  into v_slot_start
  from public.class_booking_holds
  where checkout_order_id = p_checkout_order_id
  limit 1;

  if v_slot_start is null then
    raise exception 'CLASS_HOLD_NOT_FOUND'
      using errcode = 'P0001';
  end if;

  /*
   * Usa el mismo bloqueo que acquire_class_booking_hold().
   * Así pago y nueva reserva no pueden ganar simultáneamente.
   */
  perform pg_advisory_xact_lock(
    hashtextextended(v_slot_start::text, 0)
  );

  select *
  into v_hold
  from public.class_booking_holds
  where checkout_order_id = p_checkout_order_id
  for update;

  if not found then
    raise exception 'CLASS_HOLD_NOT_FOUND'
      using errcode = 'P0001';
  end if;

  /*
   * Idempotencia para posibles reintentos de Redsys.
   */
  if v_hold.status = 'paid' then
    return v_hold;
  end if;

  /*
   * Si ya fue convertida en clase, también consideramos
   * procesado correctamente el pago.
   */
  if v_hold.status = 'converted' then
    return v_hold;
  end if;

  /*
   * Solo una retención que continúa siendo held puede
   * protegerse mediante el pago.
   */
  if v_hold.status <> 'held' then
    raise exception 'CLASS_HOLD_NO_LONGER_AVAILABLE'
      using errcode = 'P0001';
  end if;

  update public.class_booking_holds
  set
    status = 'paid',
    updated_at = now()
  where id = v_hold.id
  returning *
  into v_hold;

  return v_hold;
end;
$$;

revoke all
on function public.mark_class_booking_hold_paid(uuid)
from public, anon, authenticated;

grant execute
on function public.mark_class_booking_hold_paid(uuid)
to service_role;
