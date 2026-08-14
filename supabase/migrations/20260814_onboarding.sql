-- Datos personales básicos del alumno.
create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  contact_email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_profiles enable row level security;

drop policy if exists "Users can read their student profile"
on public.student_profiles;

create policy "Users can read their student profile"
on public.student_profiles
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.student_profiles from anon;
grant select on table public.student_profiles to authenticated;
grant all on table public.student_profiles to service_role;


-- Datos de facturación asociados a la matrícula.
create table if not exists public.billing_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,

  billing_type text not null default 'particular'
    check (billing_type in ('particular', 'empresa_autonomo')),

  nominative_invoice boolean not null default true,

  billing_name text,
  tax_id text,
  address text,
  postal_code text,
  city text,
  province text,
  country text not null default 'España',
  billing_email text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, enrollment_id)
);

alter table public.billing_profiles enable row level security;

drop policy if exists "Users can read their billing profile"
on public.billing_profiles;

create policy "Users can read their billing profile"
on public.billing_profiles
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.billing_profiles from anon;
grant select on table public.billing_profiles to authenticated;
grant all on table public.billing_profiles to service_role;


-- Planificación que utilizará Fernando.
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  enrollment_id uuid not null references public.course_enrollments(id) on delete cascade,

  study_days jsonb not null default '[]'::jsonb,
  study_time text,
  session_duration_minutes integer
    check (
      session_duration_minutes is null
      or session_duration_minutes > 0
    ),

  exam_date date,
  exam_place text,
  objective text,

  timezone text not null default 'Europe/Madrid',

  reminder_30_minutes boolean not null default true,
  reminder_5_minutes boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, enrollment_id)
);

alter table public.study_plans enable row level security;

drop policy if exists "Users can read their study plan"
on public.study_plans;

create policy "Users can read their study plan"
on public.study_plans
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.study_plans from anon;
grant select on table public.study_plans to authenticated;
grant all on table public.study_plans to service_role;


-- Estado del recorrido post-suscripción.
create table if not exists public.onboarding_progress (
  enrollment_id uuid primary key
    references public.course_enrollments(id) on delete cascade,

  user_id uuid not null references auth.users(id) on delete cascade,

  current_step text not null default 'communications_video'
    check (
      current_step in (
        'communications_video',
        'personal_data',
        'billing',
        'planning',
        'telegram',
        'vb01',
        'vb02',
        'vb03',
        'completed'
      )
    ),

  communications_video_completed_at timestamptz,
  personal_data_completed_at timestamptz,
  billing_completed_at timestamptz,
  planning_completed_at timestamptz,
  telegram_linked_at timestamptz,

  vb01_completed_at timestamptz,
  vb02_completed_at timestamptz,
  vb03_completed_at timestamptz,

  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_progress_user_idx
on public.onboarding_progress (user_id, current_step);

alter table public.onboarding_progress enable row level security;

drop policy if exists "Users can read their onboarding progress"
on public.onboarding_progress;

create policy "Users can read their onboarding progress"
on public.onboarding_progress
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.onboarding_progress from anon;
grant select on table public.onboarding_progress to authenticated;
grant all on table public.onboarding_progress to service_role;
