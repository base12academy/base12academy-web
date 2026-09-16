do $$
declare
  active_call_count bigint;
  publication_count bigint;
  successful_run_count bigint;
  active_visual_count bigint;
begin
  if not exists (
    select 1
    from public.opposition_sources
    where consultation_method = 'boe_sumario_api'
      and active is true
  ) then
    raise exception 'The official BOE source is not active';
  end if;

  select count(*) into active_call_count
  from public.opposition_calls
  where active is true;

  if active_call_count < 125 then
    raise exception 'Expected at least 125 active official calls, found %', active_call_count;
  end if;

  select count(*) into publication_count
  from public.opposition_publications;

  if publication_count < 125 then
    raise exception 'Expected at least 125 official publications, found %', publication_count;
  end if;

  select count(*) into successful_run_count
  from public.opposition_ingestion_runs
  where status = 'success';

  if successful_run_count < 1 then
    raise exception 'No successful opposition ingestion run was recorded';
  end if;

  if not exists (
    select 1
    from cron.job
    where jobname = 'base12-opposition-ingestion'
      and schedule = '20 6 * * *'
      and active is true
  ) then
    raise exception 'The daily Banco de Opositores ingestion job is not active';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'opposition_alerts'
      and column_name = 'telegram_consent_at'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'opposition_alerts'
      and column_name = 'commercial_consent_at'
  ) then
    raise exception 'Alert consent fields are incomplete';
  end if;

  select count(*) into active_visual_count
  from public.trop_visual_resources
  where active is true;

  if active_visual_count <> 3790 then
    raise exception 'Tropa visual resources changed: expected 3790, found %', active_visual_count;
  end if;

  if not exists (
    select 1
    from cron.job
    where jobname = 'base12-telegram-notifications'
      and schedule = '*/5 * * * *'
      and active is true
  ) then
    raise exception 'The existing Telegram notification job is not active';
  end if;
end
$$;
