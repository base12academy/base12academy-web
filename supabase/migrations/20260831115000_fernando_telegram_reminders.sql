alter table public.telegram_notifications
  add column if not exists enrollment_id uuid
    references public.course_enrollments(id)
    on delete cascade;

alter table public.telegram_notifications
  add column if not exists dedupe_key text;

create unique index if not exists
  telegram_notifications_dedupe_key_idx
on public.telegram_notifications (dedupe_key)
where dedupe_key is not null;

create index if not exists
  telegram_notifications_enrollment_idx
on public.telegram_notifications (enrollment_id, scheduled_for desc);

comment on column public.telegram_notifications.enrollment_id is
  'Matrícula concreta a la que pertenece el aviso, para no mezclar cursos ni paquetes.';

comment on column public.telegram_notifications.dedupe_key is
  'Clave idempotente que evita duplicar recordatorios de Fernando.';
