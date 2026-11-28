create or replace function opposition_worker_private.dispatch()
returns table(method text, request_id bigint)
language sql security invoker set search_path = ''
as $$
  select s.consultation_method, net.http_post(
    url := 'https://kishrzopzlmhgyxixefx.supabase.co/functions/v1/opposition-territorial',
    headers := jsonb_build_object('Content-Type','application/json','x-opposition-worker-token',secret.decrypted_secret),
    body := jsonb_build_object('method',s.consultation_method), timeout_milliseconds := 75000
  )
  from public.opposition_sources s
  cross join vault.decrypted_secrets secret
  where s.active and s.source_type <> 'boletin_estatal'
    and s.consultation_method in ('boja_atom','bocm_rss','boc_rss','dog_rss','bop_avila_rss','bome_sumario','bocce_sumario_pdf')
    and secret.name='base12_opposition_territorial_worker';
$$;

create table opposition_worker_private.bocyl_request (
  singleton boolean primary key default true check (singleton),
  fetch_id bigint not null,
  forwarded_at timestamptz
);

revoke all on opposition_worker_private.bocyl_request from public, anon, authenticated, service_role;

create function opposition_worker_private.request_bocyl()
returns bigint language sql security invoker set search_path = ''
as $$
  insert into opposition_worker_private.bocyl_request (singleton,fetch_id)
  select true,net.http_get(
    url:='https://bocyl.jcyl.es/rss.do?seccion=I',
    headers:=jsonb_build_object('Accept-Encoding','identity'),
    timeout_milliseconds:=30000
  )
  where exists (select 1 from public.opposition_sources where consultation_method='bocyl_rss' and active)
  on conflict (singleton) do update set fetch_id=excluded.fetch_id,forwarded_at=null
  returning fetch_id;
$$;

create function opposition_worker_private.forward_bocyl()
returns bigint language plpgsql security invoker set search_path = ''
as $$
declare
  pending bigint;
  outgoing bigint;
  incoming net._http_response%rowtype;
begin
  select fetch_id into pending from opposition_worker_private.bocyl_request
  where singleton and forwarded_at is null for update skip locked;
  if pending is null then return null; end if;

  select * into incoming from net._http_response where id=pending;
  if not found then return null; end if;

  if incoming.status_code is distinct from 200 or incoming.timed_out
    or coalesce(length(incoming.content),0) not between 20 and 1000000
    or position('<rss' in incoming.content)=0 then
    perform public.opposition_territorial_failure('bocyl_rss','No se recibió un RSS válido del BOCYL');
  else
    select net.http_post(
      url:='https://kishrzopzlmhgyxixefx.supabase.co/functions/v1/opposition-territorial',
      headers:=jsonb_build_object('Content-Type','application/json','x-opposition-worker-token',secret.decrypted_secret),
      body:=jsonb_build_object('method','bocyl_rss','officialFeed',incoming.content),
      timeout_milliseconds:=40000
    ) into strict outgoing
    from vault.decrypted_secrets secret where secret.name='base12_opposition_territorial_worker';
  end if;

  update opposition_worker_private.bocyl_request set forwarded_at=now() where singleton and fetch_id=pending;
  return outgoing;
end;
$$;

revoke all on function opposition_worker_private.request_bocyl(),opposition_worker_private.forward_bocyl()
from public, anon, authenticated, service_role;

update public.opposition_sources
set consultation_method=case territory when 'Ceuta' then 'bocce_sumario_pdf' else 'bocyl_rss' end,
    active=true
where source_type='boletin_autonomico'
and ((territory='Ceuta' and name like '%BOCCE%') or (territory='Castilla y León' and name like '%BOCYL%'));

select cron.schedule('base12-opposition-bocyl-download', '36 9,17 * * *',
  $job$ select opposition_worker_private.request_bocyl(); $job$);

select cron.schedule('base12-opposition-bocyl-process', '38 9,17 * * *',
  $job$ select opposition_worker_private.forward_bocyl(); $job$);
