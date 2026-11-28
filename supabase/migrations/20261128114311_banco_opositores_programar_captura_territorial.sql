create function opposition_worker_private.dispatch()
returns table(method text, request_id bigint)
language sql security invoker set search_path = ''
as $$
  select s.consultation_method, net.http_post(
    url := 'https://kishrzopzlmhgyxixefx.supabase.co/functions/v1/opposition-territorial',
    headers := jsonb_build_object('Content-Type','application/json','x-opposition-worker-token',secret.decrypted_secret),
    body := jsonb_build_object('method',s.consultation_method), timeout_milliseconds := 35000
  )
  from public.opposition_sources s
  cross join vault.decrypted_secrets secret
  where s.active and s.source_type <> 'boletin_estatal'
    and s.consultation_method in ('boja_atom','bocm_rss','boc_rss','dog_rss','bop_avila_rss','bome_sumario','bocyl_rss')
    and secret.name='base12_opposition_territorial_worker';
$$;

revoke all on function opposition_worker_private.dispatch() from public, anon, authenticated, service_role;

update public.opposition_sources set active=true
where source_type <> 'boletin_estatal'
and consultation_method in ('boja_atom','bocm_rss','boc_rss','dog_rss','bop_avila_rss','bome_sumario');

select cron.schedule('base12-opposition-territorial', '35 9,17 * * *',
  $job$ select * from opposition_worker_private.dispatch(); $job$);
