create table if not exists public.opposition_public_assistant_requests (
 id bigint generated always as identity primary key,
 course_slug text not null check(course_slug in ('auxiliar-administrativo-estado','administrativo-estado')),
 ip_hash text not null check(length(ip_hash)=64),
 created_at timestamptz not null default now()
);
create index if not exists opposition_public_assistant_rate_idx on public.opposition_public_assistant_requests(ip_hash,course_slug,created_at desc);
alter table public.opposition_public_assistant_requests enable row level security;
revoke all on public.opposition_public_assistant_requests from public,anon,authenticated;
grant select,insert,delete on public.opposition_public_assistant_requests to service_role;
grant usage,select on sequence public.opposition_public_assistant_requests_id_seq to service_role;
create or replace function public.claim_opposition_preview_turn(p_ip_hash text,p_course_slug text)
returns integer language plpgsql security invoker set search_path=public as $function$
declare recent_count integer; daily_count integer;
begin
 if length(p_ip_hash)<>64 or p_course_slug not in ('auxiliar-administrativo-estado','administrativo-estado') then raise exception 'invalid_preview'; end if;
 perform pg_advisory_xact_lock(hashtext(p_ip_hash)::bigint);
 select count(*) filter(where created_at>now()-interval '1 minute'),count(*) into recent_count,daily_count
 from public.opposition_public_assistant_requests where ip_hash=p_ip_hash and course_slug=p_course_slug and created_at>now()-interval '1 day';
 if daily_count>=20 then return 86400; end if;
 if recent_count>=3 then return 60; end if;
 delete from public.opposition_public_assistant_requests where ip_hash=p_ip_hash and created_at<now()-interval '2 days';
 insert into public.opposition_public_assistant_requests(course_slug,ip_hash) values(p_course_slug,p_ip_hash);
 return 0;
end
$function$;
revoke all on function public.claim_opposition_preview_turn(text,text) from public,anon,authenticated;
grant execute on function public.claim_opposition_preview_turn(text,text) to service_role;
select has_function_privilege('anon','public.claim_opposition_preview_turn(text,text)','execute') as anonymous_rpc,has_function_privilege('service_role','public.claim_opposition_preview_turn(text,text)','execute') as server_rpc;
