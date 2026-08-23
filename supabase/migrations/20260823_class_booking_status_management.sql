create or replace function public.set_class_booking_status(
  p_booking_id uuid,
  p_status text
)
returns public.class_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.class_bookings;
begin
  if p_status not in ('completed','no_show','cancelled_by_base12') then
    raise exception 'INVALID_CLASS_BOOKING_STATUS' using errcode = 'P0001';
  end if;

  select * into v_booking
  from public.class_bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_booking.status = p_status then
    return v_booking;
  end if;

  if v_booking.status <> 'confirmed' then
    raise exception 'BOOKING_ALREADY_CLOSED' using errcode = 'P0001';
  end if;

  if p_status = 'completed' and now() < v_booking.slot_end then
    raise exception 'CLASS_NOT_FINISHED' using errcode = 'P0001';
  end if;

  if p_status = 'no_show' and now() < v_booking.slot_start then
    raise exception 'CLASS_NOT_STARTED' using errcode = 'P0001';
  end if;

  update public.class_bookings
  set
    status = p_status,
    completed_at = case
      when p_status = 'completed' then coalesce(completed_at, now())
      else null
    end,
    cancelled_at = case
      when p_status = 'cancelled_by_base12' then coalesce(cancelled_at, now())
      else null
    end,
    updated_at = now()
  where id = p_booking_id
  returning * into v_booking;

  return v_booking;
end;
$$;

revoke all on function public.set_class_booking_status(uuid, text)
from public, anon, authenticated;

grant execute
on function public.set_class_booking_status(uuid, text)
to service_role;
