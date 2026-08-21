alter table public.student_profiles
  add column if not exists autonomous_community text;

alter table public.class_bookings
  add column if not exists book_publisher text;

comment on column public.student_profiles.autonomous_community is
  'Comunidad Autónoma del alumno. Requerida para Clases Online.';

comment on column public.class_bookings.book_publisher is
  'Editorial del libro utilizado en la clase, cuando exista.';
