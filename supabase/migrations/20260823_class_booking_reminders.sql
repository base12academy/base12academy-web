alter table public.class_bookings
  add column if not exists reminder_60_email_id text,
  add column if not exists reminder_5_email_id text,
  add column if not exists reminders_for_slot_start timestamptz,
  add column if not exists reminder_60_handled boolean not null default false,
  add column if not exists reminder_5_handled boolean not null default false;

comment on column public.class_bookings.reminder_60_email_id is
  'ID de Resend del recordatorio programado para 60 minutos antes de la clase.';

comment on column public.class_bookings.reminder_5_email_id is
  'ID de Resend del recordatorio programado para 5 minutos antes de la clase.';

comment on column public.class_bookings.reminders_for_slot_start is
  'Hora de clase para la que se programaron o gestionaron los recordatorios actuales.';
