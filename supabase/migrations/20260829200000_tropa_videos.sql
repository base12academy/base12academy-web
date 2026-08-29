create table if not exists public.trop_videos (
  video_id text primary key,
  video_type text not null check (video_type in ('content','closing','welcome')),
  section_code text not null,
  source_name text not null,
  display_order integer not null,
  youtube_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (video_type, source_name)
);

create index if not exists trop_videos_order_idx
  on public.trop_videos (video_type, display_order);

alter table public.trop_videos enable row level security;

revoke all on table public.trop_videos from anon;
grant select on table public.trop_videos to authenticated;
grant all on table public.trop_videos to service_role;
