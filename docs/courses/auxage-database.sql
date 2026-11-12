begin;
create table public.opposition_materials (
 course_slug text not null,
 resource_id text not null,
 payload jsonb not null,
 updated_at timestamptz not null default now(),
 primary key(course_slug,resource_id)
);
alter table public.opposition_materials enable row level security;
revoke all on public.opposition_materials from public,anon,authenticated;
grant select,insert,update,delete on public.opposition_materials to service_role;
create table public.opposition_assistant_turns (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_slug text not null,
 assistant text not null check(assistant in ('rocio','fernando')),
 theme_id text not null,
 question text not null check(length(question) between 4 and 1800),
 answer text,
 created_at timestamptz not null default now()
);
create index opposition_assistant_user_created on public.opposition_assistant_turns(user_id,created_at desc);
alter table public.opposition_assistant_turns enable row level security;
revoke all on public.opposition_assistant_turns from public,anon,authenticated;
grant select,insert,update,delete on public.opposition_assistant_turns to service_role;
commit;
select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relname in ('opposition_materials','opposition_assistant_turns');
