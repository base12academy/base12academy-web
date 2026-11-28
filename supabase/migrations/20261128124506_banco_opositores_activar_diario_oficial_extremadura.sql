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
    and s.consultation_method in ('boja_atom','bocm_rss','boc_rss','dog_rss','bop_avila_rss','bome_sumario','bocce_sumario_pdf','doe_sumario')
    and secret.name='base12_opposition_territorial_worker';
$$;

update public.opposition_sources
set consultation_method = 'doe_sumario', active = true, base_url = 'https://doe.juntaex.es/'
where source_type = 'boletin_autonomico' and territory = 'Extremadura'
  and name = 'Diario Oficial de Extremadura (DOE)';
