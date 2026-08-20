create table if not exists public.telegram_notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  source text not null
    check (
      source in (
        'fernando',
        'secretaria',
        'jefatura'
      )
    ),

  notification_type text not null,

  title text,
  message text not null,

  scheduled_for timestamptz not null,

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'processing',
        'sent',
        'failed',
        'cancelled'
      )
    ),

  sent_at timestamptz,
  failed_at timestamptz,
  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists
  telegram_notifications_pending_idx
on public.telegram_notifications (
  status,
  scheduled_for
);

create index if not exists
  telegram_notifications_user_idx
on public.telegram_notifications (
  user_id,
  scheduled_for desc
);

alter table public.telegram_notifications
enable row level security;

drop policy if exists
  "Users can read their Telegram notifications"
on public.telegram_notifications;

create policy
  "Users can read their Telegram notifications"
on public.telegram_notifications
for select
to authenticated
using (auth.uid() = user_id);

revoke all
on table public.telegram_notifications
from anon;

grant select
on table public.telegram_notifications
to authenticated;

grant all
on table public.telegram_notifications
to service_role;

comment on table public.telegram_notifications is
  'Cola de notificaciones Telegram de Fernando, Secretaría y Jefatura de Estudios.';