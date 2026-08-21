create or replace function public.finalize_class_bono_purchase(
  p_checkout_order_id uuid,
  p_user_id uuid,
  p_catalog_slug text,
  p_plan_slug text,
  p_class_service text,
  p_total_hours integer,
  p_subject text default null,
  p_academic_level text default null,
  p_topic text default null
)
returns table (
  bono_id uuid,
  booking_id uuid,
  bono_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_checkout public.checkout_orders;
  v_hold public.class_booking_holds;
  v_bono public.class_bonos;
  v_booking public.class_bookings;
  v_purchased_at timestamptz;
begin
  if p_total_hours not in (5, 10, 15, 20) then
    raise exception 'INVALID_CLASS_BONO_HOURS'
      using errcode = 'P0001';
  end if;

  if p_class_service not in (
    'universidad-historia',
    'eso-bach-historia-filosofia'
  ) then
    raise exception 'INVALID_CLASS_SERVICE'
      using errcode = 'P0001';
  end if;

  /*
   * Bloqueamos el pedido.
   */
  select *
  into v_checkout
  from public.checkout_orders
  where id = p_checkout_order_id
  for update;

  if not found then
    raise exception 'CHECKOUT_NOT_FOUND'
      using errcode = 'P0001';
  end if;

  if v_checkout.course_slug <> 'clases-online' then
    raise exception 'NOT_A_CLASS_BONO'
      using errcode = 'P0001';
  end if;

  if
    v_checkout.catalog_slug <> p_catalog_slug
    or v_checkout.plan_slug <> p_plan_slug
  then
    raise exception 'CLASS_BONO_PRODUCT_MISMATCH'
      using errcode = 'P0001';
  end if;

  if v_checkout.status not in ('paid', 'linked') then
    raise exception 'CHECKOUT_NOT_PAID'
      using errcode = 'P0001';
  end if;

  if
    v_checkout.linked_user_id is not null
    and v_checkout.linked_user_id <> p_user_id
  then
    raise exception 'CHECKOUT_LINKED_TO_OTHER_USER'
      using errcode = 'P0001';
  end if;

  /*
   * Idempotencia:
   * si este checkout ya generó el bono, devolvemos
   * los mismos registros sin duplicarlos.
   */
  select *
  into v_bono
  from public.class_bonos
  where checkout_order_id = p_checkout_order_id;

  if found then
    select *
    into v_booking
    from public.class_bookings
    where bono_id = v_bono.id
      and booking_hold_id is not null
    order by created_at
    limit 1;

    if not found then
      raise exception 'CLASS_BONO_WITHOUT_FIRST_BOOKING'
        using errcode = 'P0001';
    end if;

    return query
    select
      v_bono.id,
      v_booking.id,
      v_bono.expires_at;

    return;
  end if;

  /*
   * La hora debe haber quedado protegida por Redsys
   * mediante mark_class_booking_hold_paid().
   */
  select *
  into v_hold
  from public.class_booking_holds
  where checkout_order_id = p_checkout_order_id
  for update;

  if not found then
    raise exception 'CLASS_HOLD_NOT_FOUND'
      using errcode = 'P0001';
  end if;

  if v_hold.status <> 'paid' then
    raise exception 'CLASS_HOLD_NOT_PAID'
      using errcode = 'P0001';
  end if;

  v_purchased_at =
    coalesce(v_checkout.paid_at, now());

  /*
   * Bono: caduca exactamente dos meses después
   * del pago.
   */
  insert into public.class_bonos (
    user_id,
    checkout_order_id,
    catalog_slug,
    plan_slug,
    class_service,
    total_hours,
    status,
    purchased_at,
    expires_at
  )
  values (
    p_user_id,
    p_checkout_order_id,
    p_catalog_slug,
    p_plan_slug,
    p_class_service,
    p_total_hours,
    'active',
    v_purchased_at,
    v_purchased_at + interval '2 months'
  )
  returning *
  into v_bono;

  /*
   * La hora elegida antes del pago se convierte
   * automáticamente en la primera hora del bono.
   */
  insert into public.class_bookings (
    bono_id,
    user_id,
    booking_hold_id,
    slot_start,
    slot_end,
    status,
    subject,
    academic_level,
    topic
  )
  values (
    v_bono.id,
    p_user_id,
    v_hold.id,
    v_hold.slot_start,
    v_hold.slot_end,
    'confirmed',
    nullif(trim(p_subject), ''),
    nullif(trim(p_academic_level), ''),
    nullif(trim(p_topic), '')
  )
  returning *
  into v_booking;

  update public.class_booking_holds
  set
    status = 'converted',
    linked_user_id = p_user_id,
    updated_at = now()
  where id = v_hold.id;

  return query
  select
    v_bono.id,
    v_booking.id,
    v_bono.expires_at;
end;
$$;

revoke all
on function public.finalize_class_bono_purchase(
  uuid, uuid, text, text, text, integer, text, text, text
)
from public, anon, authenticated;

grant execute
on function public.finalize_class_bono_purchase(
  uuid, uuid, text, text, text, integer, text, text, text
)
to service_role;
