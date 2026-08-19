alter table public.tutoring_bookings
  add column if not exists student_name text,
  add column if not exists theme_id text,
  add column if not exists subject text;

alter table public.tutoring_bookings
  drop constraint if exists tutoring_booking_student_name_length,
  add constraint tutoring_booking_student_name_length check (student_name is null or char_length(student_name) between 2 and 120),
  drop constraint if exists tutoring_booking_subject_length,
  add constraint tutoring_booking_subject_length check (subject is null or char_length(subject) between 5 and 1000);
