set lock_timeout = '60s';

create or replace function public.set_base12_cron_secret(p_secret text)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  secret_id uuid;
begin
  if p_secret is null or length(trim(p_secret)) < 24 then
    raise exception 'Invalid cron secret';
  end if;

  select id into secret_id
  from vault.secrets
  where name = 'base12_cron_secret'
  limit 1;

  if secret_id is null then
    perform vault.create_secret(
      p_secret,
      'base12_cron_secret',
      'Authorization token for the Base12 Telegram notification processor'
    );
  else
    perform vault.update_secret(
      secret_id,
      p_secret,
      'base12_cron_secret',
      'Authorization token for the Base12 Telegram notification processor'
    );
  end if;
end
$$;

revoke all on function public.set_base12_cron_secret(text)
from public, anon, authenticated;

grant execute on function public.set_base12_cron_secret(text)
to service_role;
