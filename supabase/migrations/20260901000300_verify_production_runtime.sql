do $$
declare
  active_rows bigint;
  stored_objects bigint;
begin
  select count(*) into active_rows
  from public.trop_visual_resources
  where active is true;

  if active_rows <> 3790 then
    raise exception 'Expected 3790 active visual resources, found %', active_rows;
  end if;

  select count(*) into stored_objects
  from storage.objects
  where bucket_id = 'trop-resources';

  if stored_objects <> 3790 then
    raise exception 'Expected 3790 stored visual resources, found %', stored_objects;
  end if;

  if not exists (
    select 1 from vault.secrets
    where name = 'base12_cron_secret'
  ) then
    raise exception 'Missing base12_cron_secret in Vault';
  end if;

  if not exists (
    select 1 from cron.job
    where jobname = 'base12-telegram-notifications'
      and schedule = '*/5 * * * *'
      and active is true
  ) then
    raise exception 'Telegram notification cron is not active';
  end if;
end
$$;
