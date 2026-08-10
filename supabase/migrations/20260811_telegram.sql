create table if not exists public.telegram_users (
  telegram_user_id bigint primary key,
  chat_id bigint not null unique,
  user_id uuid unique references auth.users(id) on delete set null,
  username text,
  first_name text,
  last_name text,
  language_code text,
  notifications_enabled boolean not null default true,
  linked_at timestamptz,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.telegram_users enable row level security;

drop policy if exists "Users can read their Telegram link" on public.telegram_users;
create policy "Users can read their Telegram link"
on public.telegram_users
for select
to authenticated
using (auth.uid() = user_id);

revoke all on table public.telegram_users from anon;
grant select on table public.telegram_users to authenticated;
grant all on table public.telegram_users to service_role;

comment on table public.telegram_users is
  'Vinculaciones entre usuarios de Telegram y alumnos de Base12 Academy.';

