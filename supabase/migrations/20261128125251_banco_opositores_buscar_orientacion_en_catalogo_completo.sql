-- Limita a convocatorias que coinciden con el objetivo, incluso fuera de la primera página.
create function public.opposition_orientation_candidates(search_terms text[])
returns setof public.opposition_calls
language sql
stable
security invoker
set search_path = ''
as $$
  with terms as (
    select pg_catalog.to_tsquery('pg_catalog.spanish', pg_catalog.string_agg(term, ' | ')) as query
    from (
      select distinct candidate as term
      from pg_catalog.unnest(search_terms) as input(candidate)
      where candidate ~ '^[a-z0-9]{3,50}$'
      limit 12
    ) as accepted
  )
  select c.*
  from public.opposition_calls c
  cross join terms
  where c.active
    and pg_catalog.to_tsvector('pg_catalog.spanish', coalesce(c.title, '') || ' ' || coalesce(c.organisation, '') || ' ' || coalesce(c.specialty, '')) @@ terms.query
  order by
    pg_catalog.ts_rank(pg_catalog.to_tsvector('pg_catalog.spanish', coalesce(c.title, '') || ' ' || coalesce(c.organisation, '') || ' ' || coalesce(c.specialty, '')), terms.query) desc,
    c.publication_date desc,
    c.id
  limit 120;
$$;

revoke all on function public.opposition_orientation_candidates(text[]) from public, anon, authenticated;
grant execute on function public.opposition_orientation_candidates(text[]) to service_role;
