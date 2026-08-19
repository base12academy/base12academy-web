create table if not exists public.opposition_open_questions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  course_slug text not null, theme_id text not null, question text not null,
  status text not null default 'pending' check (status in ('pending','answered','closed')),
  answer text, answered_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.opposition_open_questions enable row level security;
drop policy if exists "students read own opposition questions" on public.opposition_open_questions;
create policy "students read own opposition questions" on public.opposition_open_questions for select using (auth.uid() = user_id);

create table if not exists public.tutoring_slots (
  id uuid primary key default gen_random_uuid(), starts_at timestamptz not null, ends_at timestamptz not null,
  status text not null default 'available' check (status in ('available','blocked')),
  note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint tutoring_slot_duration check (ends_at = starts_at + interval '30 minutes'), unique(starts_at)
);
create table if not exists public.tutoring_bookings (
  id uuid primary key default gen_random_uuid(), slot_id uuid not null references public.tutoring_slots(id),
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, course_slug text not null,
  status text not null default 'booked' check (status in ('booked','cancelled','completed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index if not exists one_active_booking_per_slot on public.tutoring_bookings(slot_id) where status = 'booked';
alter table public.tutoring_slots enable row level security;
alter table public.tutoring_bookings enable row level security;
drop policy if exists "premium students read slots" on public.tutoring_slots;
create policy "premium students read slots" on public.tutoring_slots for select using (auth.uid() is not null);
drop policy if exists "students read own tutoring bookings" on public.tutoring_bookings;
create policy "students read own tutoring bookings" on public.tutoring_bookings for select using (auth.uid() = user_id);
