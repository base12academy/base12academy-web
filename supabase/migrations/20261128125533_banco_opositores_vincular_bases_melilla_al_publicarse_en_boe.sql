-- Enlaza las dos bases del BOME solo al llegar la referencia oficial que abre el plazo.
create function opposition_worker_private.link_verified_melilla_bases()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.official_call_identifier_authority is distinct from 'BOE'
    or new.official_call_identifier is null
    or not new.active
    or new.publication_date < date '2026-11-24'
    or coalesce(new.organisation,'') !~* '(^|[^[:alpha:]])Melilla([^[:alpha:]]|$)'
    or coalesce(new.summary,'') !~* '(Bolet[ií]n Oficial de la Ciudad( Aut[oó]noma)? de Melilla|BOME)[^0-9]{0,40}6434([^0-9]|$)'
  then
    return new;
  end if;

  with matched as (
    select i.*, r.evidence_url, s.name as bulletin_name
    from public.opposition_territorial_inbox i
    join public.opposition_sources s on s.id = i.source_id
    join opposition_worker_private.territorial_reviews r
      on r.source_id=i.source_id and r.external_id=i.external_id
    join (values
      ('BOME-A-2026-1318','(dos|2)[[:space:]]+plazas[[:space:]]+de[[:space:]]+m[eé]dico[[:space:]]+de[[:space:]]+salud[[:space:]]+p[uú]blica'),
      ('BOME-A-2026-1319','(una|1)[[:space:]]+plaza[[:space:]]+de[[:space:]]+farmac[eé]utico')
    ) as expected(ref, proof) on i.external_id=expected.ref
    where s.consultation_method='bome_sumario'
      and i.bulletin_identifier='BOME-B-2026-6434'
      and r.decision='bases_espera_boe'
      and i.official_url=r.evidence_url
      and new.summary ~* expected.proof
  ),
  published as (
    insert into public.opposition_publications (
      call_id,source_id,external_id,publication_type,publication_date,bulletin_name,
      bulletin_identifier,official_url,official_pdf_url,change_summary,relevance
    )
    select new.id,m.source_id,m.external_id,'bases',m.publication_date,m.bulletin_name,
      m.bulletin_identifier,m.official_url,m.official_pdf_url,m.title,'informativa'
    from matched m
    on conflict (source_id,external_id) do nothing
    returning source_id,external_id
  )
  update opposition_worker_private.territorial_reviews r
  set decision='vinculada', prior_reference=new.official_call_identifier, publication_type='bases',
    evidence_note='El anuncio del BOE cita el mismo número de BOME y coincide con la denominación y el número de plazas.'
  from published p
  where p.source_id=r.source_id and p.external_id=r.external_id;

  return new;
end
$$;

revoke all on function opposition_worker_private.link_verified_melilla_bases()
from public,anon,authenticated,service_role;

create trigger opposition_boe_link_melilla_bases
after insert or update of summary on public.opposition_calls
for each row execute function opposition_worker_private.link_verified_melilla_bases();
