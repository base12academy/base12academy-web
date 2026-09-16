create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

do $$
declare
  existing_job bigint;
begin
  select jobid into existing_job
  from cron.job
  where jobname = 'base12-telegram-notifications'
  limit 1;

  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;
end
$$;

select cron.schedule(
  'base12-telegram-notifications',
  '*/5 * * * *',
  $job$
    select net.http_post(
      url := 'https://base12academy.es/api/telegram/process',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || decrypted_secret
      ),
      body := '{}'::jsonb
    )
    from vault.decrypted_secrets
    where name = 'base12_cron_secret'
    limit 1;
  $job$
);

comment on extension pg_cron is
  'Procesa cada cinco minutos los recordatorios de Fernando sin depender del plan de Vercel.';
