create extension if not exists pgcrypto;

create table if not exists public.training_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sex text not null check (sex in ('male','female')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_slug text not null check (test_slug in ('flexiones','plancha','carrera-2000','agilidad')),
  result_value numeric not null check (result_value > 0),
  perceived_effort text check (perceived_effort is null or perceived_effort in ('easy','normal','hard','max')),
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists training_results_user_test_date_idx
  on public.training_results (user_id, test_slug, performed_at desc);

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_slug text not null check (test_slug in ('flexiones','plancha','carrera-2000','agilidad')),
  exercises jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists training_sessions_user_test_date_idx
  on public.training_sessions (user_id, test_slug, completed_at desc);

alter table public.training_profiles enable row level security;
alter table public.training_results enable row level security;
alter table public.training_sessions enable row level security;

drop policy if exists "training_profiles_select_own" on public.training_profiles;
create policy "training_profiles_select_own"
  on public.training_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "training_profiles_insert_own" on public.training_profiles;
create policy "training_profiles_insert_own"
  on public.training_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "training_profiles_update_own" on public.training_profiles;
create policy "training_profiles_update_own"
  on public.training_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "training_results_select_own" on public.training_results;
create policy "training_results_select_own"
  on public.training_results for select
  using (auth.uid() = user_id);

drop policy if exists "training_results_insert_own" on public.training_results;
create policy "training_results_insert_own"
  on public.training_results for insert
  with check (auth.uid() = user_id);

drop policy if exists "training_sessions_select_own" on public.training_sessions;
create policy "training_sessions_select_own"
  on public.training_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "training_sessions_insert_own" on public.training_sessions;
create policy "training_sessions_insert_own"
  on public.training_sessions for insert
  with check (auth.uid() = user_id);
