create table public.opposition_territorial_inbox (
  source_id uuid not null references public.opposition_sources(id),
  external_id text not null,
  bulletin_identifier text not null,
  publication_date date not null,
  title text not null,
  organisation text,
  official_url text not null,
  official_pdf_url text,
  detected_at timestamptz not null default now(),
  primary key (source_id, external_id)
);

alter table public.opposition_territorial_inbox enable row level security;
revoke all on public.opposition_territorial_inbox from public, anon, authenticated;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'base12_opposition_territorial_worker') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'base12_opposition_territorial_worker'
    );
  end if;
end;
$$;

create schema opposition_worker_private;
revoke all on schema opposition_worker_private from public;
grant usage on schema opposition_worker_private to service_role;

create function opposition_worker_private.authorize(worker_token text)
returns boolean
language sql security definer set search_path = ''
as $$
  select exists (
    select 1 from vault.decrypted_secrets
    where name = 'base12_opposition_territorial_worker'
    and extensions.digest(decrypted_secret, 'sha256') = extensions.digest(worker_token, 'sha256')
  );
$$;

revoke all on function opposition_worker_private.authorize(text) from public, anon, authenticated;
grant execute on function opposition_worker_private.authorize(text) to service_role;

create function public.opposition_territorial_authorize(worker_token text)
returns boolean
language sql security invoker set search_path = ''
as $$
  select opposition_worker_private.authorize(worker_token);
$$;

create function public.opposition_territorial_capture(source_method text, records jsonb)
returns jsonb
language plpgsql security invoker set search_path = ''
as $$
declare
  source_row public.opposition_sources%rowtype;
  captured integer;
  total integer;
begin
  select * into strict source_row
  from public.opposition_sources s
  where s.consultation_method = source_method and s.source_type <> 'boletin_estatal' and s.active;

  total := jsonb_array_length(records);
  if total > 400 then
    raise exception 'Demasiadas publicaciones para una sola consulta';
  end if;

  insert into public.opposition_territorial_inbox (
    source_id, external_id, bulletin_identifier, publication_date, title, organisation, official_url, official_pdf_url
  )
  select source_row.id, item.reference, item.bulletin, item.date, item.title, item.organisation, item.url, item.pdf
  from jsonb_to_recordset(records) as item(reference text, bulletin text, date date, title text, organisation text, url text, pdf text)
  where item.reference ~ '^[a-zA-Z0-9/_-]{1,96}$'
    and item.date <= (now() at time zone 'Europe/Madrid')::date
    and item.date >= date '2000-01-01'
    and length(item.bulletin) between 1 and 300
    and length(item.title) between 1 and 4000
    and item.url ~ '^https://[a-zA-Z0-9.-]+(/|$)'
    and (item.pdf is null or item.pdf ~ '^https://[a-zA-Z0-9.-]+(/|$)')
  on conflict (source_id, external_id) do update set
    bulletin_identifier = excluded.bulletin_identifier,
    publication_date = excluded.publication_date,
    title = excluded.title,
    organisation = excluded.organisation,
    official_url = excluded.official_url,
    official_pdf_url = excluded.official_pdf_url;
  get diagnostics captured = row_count;

  if captured <> total then
    raise exception 'El lote contiene datos de identificación incompletos';
  end if;

  update public.opposition_sources set last_checked_at=now(),last_success_at=now(),last_error=null where id=source_row.id;
  insert into public.opposition_ingestion_runs (
    source_id, finished_at, status, publications_detected, details
  ) values (source_row.id, now(), 'success', captured, jsonb_build_object('mode','territorial_capture'));

  return jsonb_build_object('captured',captured);
end;
$$;

create function public.opposition_territorial_failure(source_method text, failure text)
returns void
language plpgsql security invoker set search_path = ''
as $$
declare
  source_key uuid;
begin
  update public.opposition_sources
  set last_checked_at=now(),last_error=left(failure,300)
  where consultation_method=source_method and source_type <> 'boletin_estatal'
  returning id into source_key;
  if source_key is not null then
    insert into public.opposition_ingestion_runs (source_id,finished_at,status,error_message,details)
    values (source_key,now(),'failed',left(failure,300),jsonb_build_object('mode','territorial_capture'));
  end if;
end;
$$;

revoke all on function public.opposition_territorial_authorize(text),
  public.opposition_territorial_capture(text,jsonb), public.opposition_territorial_failure(text,text)
  from public, anon, authenticated;
grant execute on function public.opposition_territorial_authorize(text),
  public.opposition_territorial_capture(text,jsonb), public.opposition_territorial_failure(text,text) to service_role;
grant select, insert, update on public.opposition_territorial_inbox to service_role;
