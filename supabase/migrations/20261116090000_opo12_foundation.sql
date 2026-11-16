-- Opo12: suscripciones independientes, versiones de examen, intentos y auditoría.
-- Solo se aplica en el entorno de pruebas hasta aprobar expresamente el despliegue.

create schema if not exists opo12_private;
revoke all on schema opo12_private from public, anon, authenticated;
grant usage on schema opo12_private to service_role;

create table public.opo12_oppositions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opo12_exam_versions (
  id uuid primary key default gen_random_uuid(),
  opposition_id uuid not null references public.opo12_oppositions(id) on delete restrict,
  version_label text not null,
  status text not null default 'draft' check (status in ('draft','auditing','ready','retired')),
  official_source_url text not null,
  official_source_published_on date not null,
  duration_minutes integer not null check (duration_minutes > 0),
  options_per_question integer not null default 4 check (options_per_question between 2 and 6),
  rules jsonb not null,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (opposition_id, version_label)
);

create unique index opo12_one_ready_exam_per_opposition
  on public.opo12_exam_versions(opposition_id)
  where status = 'ready';

create table public.opo12_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  opposition_id uuid not null references public.opo12_oppositions(id) on delete restrict,
  checkout_order_id uuid references public.checkout_orders(id) on delete set null,
  status text not null check (status in ('active','payment_failed','cancelled')),
  paid_through date not null,
  failed_at timestamptz,
  access_blocked_at timestamptz,
  purge_due_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opposition_id)
);

comment on column public.opo12_subscriptions.purge_due_at is
  'Fin del día 10 en Europe/Madrid. El proceso programado cancela y elimina el historial de forma auditada.';

create index opo12_failed_subscriptions_cutoff
  on public.opo12_subscriptions(paid_through)
  where status = 'payment_failed';

create table public.opo12_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opposition_id uuid not null references public.opo12_oppositions(id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  reason text not null,
  granted_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create index opo12_access_grants_lookup
  on public.opo12_access_grants(user_id, opposition_id, starts_at, ends_at)
  where revoked_at is null;

create table public.opo12_question_versions (
  id uuid primary key default gen_random_uuid(),
  opposition_id uuid not null references public.opo12_oppositions(id) on delete restrict,
  source_key text not null,
  version integer not null default 1,
  block text not null check (block in ('theory','practical')),
  topic_code text not null,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  correct_option text not null check (correct_option in ('A','B','C','D')),
  explanation text not null,
  official_reference text not null,
  reviewed_on date not null,
  difficulty text not null default 'medium_high' check (difficulty in ('medium','medium_high','high')),
  audit_status text not null default 'quarantine' check (audit_status in ('quarantine','review','approved','retired')),
  audit_report jsonb not null default '{}'::jsonb,
  content_hash text not null,
  created_at timestamptz not null default now(),
  unique (opposition_id, source_key, version)
);

create index opo12_approved_question_pool
  on public.opo12_question_versions(opposition_id, block, topic_code)
  where audit_status = 'approved';

create table public.opo12_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opposition_id uuid not null references public.opo12_oppositions(id) on delete restrict,
  exam_version_id uuid not null references public.opo12_exam_versions(id) on delete restrict,
  mode text not null default 'simulation' check (mode in ('simulation','topic','review')),
  configuration jsonb not null default '{}'::jsonb,
  status text not null default 'preparing' check (status in ('preparing','in_progress','submitted','expired','invalidated','abandoned')),
  madrid_day date not null,
  started_at timestamptz not null default now(),
  deadline_at timestamptz,
  submitted_at timestamptz,
  elapsed_seconds integer,
  score numeric(7,3),
  score_snapshot jsonb,
  rules_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create unique index opo12_one_open_attempt
  on public.opo12_attempts(user_id, opposition_id)
  where status in ('preparing', 'in_progress');

create index opo12_attempt_history
  on public.opo12_attempts(user_id, opposition_id, started_at desc);

create index opo12_stale_preparing_attempts
  on public.opo12_attempts(created_at)
  where status = 'preparing';

create table public.opo12_attempt_questions (
  attempt_id uuid not null references public.opo12_attempts(id) on delete cascade,
  position integer not null check (position > 0),
  question_version_id uuid not null references public.opo12_question_versions(id) on delete restrict,
  block text not null check (block in ('theory','practical')),
  is_reserve boolean not null default false,
  reserve_order integer,
  topic_code text not null,
  prompt text not null,
  options jsonb not null,
  primary key (attempt_id, position),
  unique (attempt_id, question_version_id)
);

create table public.opo12_attempt_solutions (
  attempt_id uuid not null,
  position integer not null,
  correct_option text not null check (correct_option in ('A','B','C','D')),
  explanation text not null,
  official_reference text not null,
  reviewed_on date not null,
  annulled boolean not null default false,
  primary key (attempt_id, position),
  foreign key (attempt_id, position)
    references public.opo12_attempt_questions(attempt_id, position) on delete cascade
);

create table public.opo12_answers (
  attempt_id uuid not null references public.opo12_attempts(id) on delete cascade,
  position integer not null,
  selected_option text check (selected_option in ('A','B','C','D')),
  flagged boolean not null default false,
  saved_at timestamptz not null default now(),
  primary key (attempt_id, position),
  foreign key (attempt_id, position)
    references public.opo12_attempt_questions(attempt_id, position) on delete cascade
);

create table public.opo12_incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  opposition_id uuid not null references public.opo12_oppositions(id) on delete restrict,
  attempt_id uuid references public.opo12_attempts(id) on delete set null,
  position integer,
  category text not null check (category in ('question','technical','subscription','other')),
  description text not null check (char_length(description) between 10 and 3000),
  status text not null default 'received' check (status in ('received','automatic_review','human_review','resolved','dismissed')),
  resolution text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table opo12_private.opo12_audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid,
  event_type text not null,
  entity_type text not null,
  entity_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.opo12_oppositions enable row level security;
alter table public.opo12_exam_versions enable row level security;
alter table public.opo12_subscriptions enable row level security;
alter table public.opo12_access_grants enable row level security;
alter table public.opo12_question_versions enable row level security;
alter table public.opo12_attempts enable row level security;
alter table public.opo12_attempt_questions enable row level security;
alter table public.opo12_attempt_solutions enable row level security;
alter table public.opo12_answers enable row level security;
alter table public.opo12_incidents enable row level security;

revoke all on table public.opo12_subscriptions from anon, authenticated;
revoke all on table public.opo12_access_grants from anon, authenticated;
revoke all on table public.opo12_question_versions from anon, authenticated;
revoke all on table public.opo12_attempts from anon, authenticated;
revoke all on table public.opo12_attempt_questions from anon, authenticated;
revoke all on table public.opo12_attempt_solutions from anon, authenticated;
revoke all on table public.opo12_answers from anon, authenticated;
revoke all on table public.opo12_incidents from anon, authenticated;
grant all on table
  public.opo12_oppositions,
  public.opo12_exam_versions,
  public.opo12_subscriptions,
  public.opo12_access_grants,
  public.opo12_question_versions,
  public.opo12_attempts,
  public.opo12_attempt_questions,
  public.opo12_attempt_solutions,
  public.opo12_answers,
  public.opo12_incidents
to service_role;
grant all on table opo12_private.opo12_audit_log to service_role;
grant usage, select on sequence opo12_private.opo12_audit_log_id_seq to service_role;

create or replace function opo12_private.opo12_has_active_access(
  p_user_id uuid,
  p_opposition_id uuid,
  p_at timestamptz default now()
) returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, opo12_private
as $$
  select exists (
    select 1
    from public.opo12_subscriptions subscription
    where subscription.user_id = p_user_id
      and subscription.opposition_id = p_opposition_id
      and subscription.status in ('active', 'payment_failed')
      and subscription.paid_through >= (p_at at time zone 'Europe/Madrid')::date
  ) or exists (
    select 1
    from public.opo12_access_grants access_grant
    where access_grant.user_id = p_user_id
      and access_grant.opposition_id = p_opposition_id
      and access_grant.revoked_at is null
      and access_grant.starts_at <= p_at
      and (access_grant.ends_at is null or access_grant.ends_at > p_at)
  );
$$;

create or replace function opo12_private.opo12_start_or_resume(
  p_user_id uuid,
  p_opposition_slug text,
  p_mode text,
  p_configuration jsonb default '{}'::jsonb,
  p_duration_minutes integer default null
) returns table(attempt_id uuid, resumed boolean, attempt_mode text, deadline_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public, opo12_private
as $$
declare
  v_opposition_id uuid;
  v_exam public.opo12_exam_versions%rowtype;
  v_attempt public.opo12_attempts%rowtype;
  v_day date := (now() at time zone 'Europe/Madrid')::date;
begin
  if p_mode not in ('simulation', 'topic', 'review') then
    raise exception using errcode = 'P0001', message = 'invalid_attempt_mode';
  end if;
  if p_duration_minutes is not null and p_duration_minutes <= 0 then
    raise exception using errcode = 'P0001', message = 'invalid_attempt_duration';
  end if;
  select id into v_opposition_id
  from public.opo12_oppositions
  where slug = p_opposition_slug and active = true;
  if v_opposition_id is null then raise exception using errcode = 'P0001', message = 'opposition_unavailable'; end if;

  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':' || v_opposition_id::text, 0));

  select * into v_attempt
  from public.opo12_attempts
  where user_id = p_user_id
    and opposition_id = v_opposition_id
    and status in ('preparing', 'in_progress')
  order by started_at desc limit 1 for update;
  if found then
    return query select v_attempt.id, true, v_attempt.mode, v_attempt.deadline_at;
    return;
  end if;

  if not opo12_private.opo12_has_active_access(p_user_id, v_opposition_id, now()) then
    raise exception using errcode = 'P0001', message = 'subscription_required';
  end if;

  select * into v_exam
  from public.opo12_exam_versions
  where opposition_id = v_opposition_id and status = 'ready'
  limit 1;
  if not found then raise exception using errcode = 'P0001', message = 'exam_not_ready'; end if;

  insert into public.opo12_attempts (
    user_id, opposition_id, exam_version_id, mode, configuration, madrid_day,
    deadline_at, rules_snapshot
  ) values (
    p_user_id, v_opposition_id, v_exam.id, p_mode, coalesce(p_configuration, '{}'::jsonb), v_day,
    case when p_duration_minutes is null then null else now() + make_interval(mins => p_duration_minutes) end,
    v_exam.rules || jsonb_build_object('mode', p_mode)
  ) returning * into v_attempt;

  insert into opo12_private.opo12_audit_log(actor_user_id, event_type, entity_type, entity_id, payload)
  values (p_user_id, 'attempt_started', 'attempt', v_attempt.id::text,
    jsonb_build_object('madrid_day', v_day, 'mode', p_mode, 'configuration', coalesce(p_configuration, '{}'::jsonb)));

  return query select v_attempt.id, false, v_attempt.mode, v_attempt.deadline_at;
end;
$$;

revoke all on function opo12_private.opo12_has_active_access(uuid, uuid, timestamptz) from public, anon, authenticated;
revoke all on function opo12_private.opo12_start_or_resume(uuid, text, text, jsonb, integer) from public, anon, authenticated;
grant execute on function opo12_private.opo12_has_active_access(uuid, uuid, timestamptz) to service_role;
grant execute on function opo12_private.opo12_start_or_resume(uuid, text, text, jsonb, integer) to service_role;

-- PostgREST solo expone public. Este envoltorio no eleva privilegios y únicamente
-- puede ejecutarlo service_role; la operación atómica permanece en opo12_private.
create or replace function public.opo12_start_or_resume(
  p_user_id uuid,
  p_opposition_slug text,
  p_mode text,
  p_configuration jsonb default '{}'::jsonb,
  p_duration_minutes integer default null
) returns table(attempt_id uuid, resumed boolean, attempt_mode text, deadline_at timestamptz)
language sql
security invoker
set search_path = pg_catalog, public, opo12_private
as $$
  select * from opo12_private.opo12_start_or_resume(
    p_user_id, p_opposition_slug, p_mode, p_configuration, p_duration_minutes
  );
$$;

revoke all on function public.opo12_start_or_resume(uuid, text, text, jsonb, integer) from public, anon, authenticated;
grant execute on function public.opo12_start_or_resume(uuid, text, text, jsonb, integer) to service_role;

-- Aplica a las 23:59 de Europe/Madrid el bloqueo y la cancelacion por impago.
-- Se programa dos veces en UTC para cubrir CET y CEST; la ejecucion que no
-- coincide con las 23:59 locales termina sin modificar datos.
create or replace function opo12_private.opo12_run_subscription_lifecycle(
  p_at timestamptz default now()
) returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, opo12_private
as $$
declare
  v_local timestamp := p_at at time zone 'Europe/Madrid';
  v_local_day date := v_local::date;
  v_blocked integer := 0;
  v_cancelled integer := 0;
  v_deleted_attempts integer := 0;
  v_deleted_for_subscription integer;
  v_subscription record;
begin
  if extract(hour from v_local) <> 23 or extract(minute from v_local) <> 59 then
    return jsonb_build_object('skipped', true, 'reason', 'outside_madrid_cutoff');
  end if;

  update public.opo12_subscriptions
  set access_blocked_at = ((paid_through + 1)::timestamp at time zone 'Europe/Madrid'),
      purge_due_at = (((paid_through + 11)::timestamp at time zone 'Europe/Madrid') - interval '1 millisecond'),
      updated_at = p_at
  where status = 'payment_failed'
    and paid_through <= v_local_day
    and access_blocked_at is null;
  get diagnostics v_blocked = row_count;

  for v_subscription in
    select id, user_id, opposition_id
    from public.opo12_subscriptions
    where status = 'payment_failed'
      and paid_through + 10 <= v_local_day
    for update skip locked
  loop
    delete from public.opo12_attempts
    where user_id = v_subscription.user_id
      and opposition_id = v_subscription.opposition_id
      and status not in ('preparing', 'in_progress');
    get diagnostics v_deleted_for_subscription = row_count;
    v_deleted_attempts := v_deleted_attempts + v_deleted_for_subscription;

    update public.opo12_subscriptions
    set status = 'cancelled',
        cancelled_at = p_at,
        updated_at = p_at
    where id = v_subscription.id;

    insert into opo12_private.opo12_audit_log(
      actor_user_id, event_type, entity_type, entity_id, payload
    ) values (
      null,
      'subscription_cancelled_after_payment_failure',
      'subscription',
      v_subscription.id::text,
      jsonb_build_object(
        'user_id', v_subscription.user_id,
        'opposition_id', v_subscription.opposition_id,
        'deleted_attempts', v_deleted_for_subscription,
        'madrid_day', v_local_day
      )
    );
    v_cancelled := v_cancelled + 1;
  end loop;

  delete from public.opo12_attempts
  where status = 'preparing'
    and created_at < p_at - interval '15 minutes';

  return jsonb_build_object(
    'skipped', false,
    'madrid_day', v_local_day,
    'blocked', v_blocked,
    'cancelled', v_cancelled,
    'deleted_attempts', v_deleted_attempts
  );
end;
$$;

revoke all on function opo12_private.opo12_run_subscription_lifecycle(timestamptz)
from public, anon, authenticated;
grant execute on function opo12_private.opo12_run_subscription_lifecycle(timestamptz)
to service_role;

create extension if not exists pg_cron with schema pg_catalog;

do $cron$
declare
  v_job_id bigint;
begin
  for v_job_id in
    select jobid from cron.job
    where jobname in ('opo12-subscription-cutoff-cest', 'opo12-subscription-cutoff-cet')
  loop
    perform cron.unschedule(v_job_id);
  end loop;

  perform cron.schedule(
    'opo12-subscription-cutoff-cest',
    '59 21 * * *',
    $job$select opo12_private.opo12_run_subscription_lifecycle(now());$job$
  );
  perform cron.schedule(
    'opo12-subscription-cutoff-cet',
    '59 22 * * *',
    $job$select opo12_private.opo12_run_subscription_lifecycle(now());$job$
  );
end
$cron$;

insert into public.opo12_oppositions(slug, name, short_name, active)
values (
  'administrativos-junta-andalucia-c1-1000',
  'Cuerpo General de Administrativos de la Junta de Andalucía',
  'Administrativos Junta de Andalucía · C1.1000',
  true
) on conflict (slug) do nothing;

insert into public.opo12_exam_versions(
  opposition_id, version_label, status, official_source_url,
  official_source_published_on, duration_minutes, options_per_question, rules
)
select id, 'BOJA 191/2024 · acceso libre', 'auditing',
  'https://www.juntadeandalucia.es/boja/2024/191/25', '2024-10-01', 180, 4,
  '{"total_questions":107,"evaluable_questions":100,"blocks":[{"id":"theory","ordinary":75,"reserve":4,"points_per_correct":1.2,"wrong_divisor":3,"passing_points":36,"maximum_points":90},{"id":"practical","ordinary":25,"reserve":3,"points_per_correct":1.2,"wrong_divisor":3,"passing_points":12,"maximum_points":30}]}'::jsonb
from public.opo12_oppositions
where slug = 'administrativos-junta-andalucia-c1-1000'
on conflict (opposition_id, version_label) do nothing;
