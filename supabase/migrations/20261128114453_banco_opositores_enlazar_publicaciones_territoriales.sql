create table opposition_worker_private.verified_publications (
  source_id uuid not null references public.opposition_sources(id),
  external_id text not null,
  boe_reference text not null check (boe_reference ~ '^BOE-A-[0-9]{4}-[0-9]+$'),
  publication_type text not null,
  evidence_url text not null,
  primary key (source_id, external_id)
);

revoke all on opposition_worker_private.verified_publications from public, anon, authenticated;
grant select on opposition_worker_private.verified_publications to service_role;

create function opposition_worker_private.publish_verified_publication()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  insert into public.opposition_publications (
    call_id,source_id,external_id,publication_type,publication_date,bulletin_name,
    bulletin_identifier,official_url,official_pdf_url,change_summary,relevance
  )
  select c.id,new.source_id,new.external_id,v.publication_type,new.publication_date,
    s.name,new.bulletin_identifier,new.official_url,new.official_pdf_url,new.title,'informativa'
  from opposition_worker_private.verified_publications v
  join public.opposition_sources s on s.id=v.source_id
  join public.opposition_calls c on c.official_call_identifier=v.boe_reference
    and c.official_call_identifier_authority='BOE' and c.active
  where v.source_id=new.source_id and v.external_id=new.external_id
    and v.evidence_url=new.official_url
  on conflict (source_id,external_id) do nothing;
  return new;
end;
$$;
revoke all on function opposition_worker_private.publish_verified_publication() from public, anon, authenticated;

create trigger opposition_territorial_verified_publication
after insert or update on public.opposition_territorial_inbox
for each row execute function opposition_worker_private.publish_verified_publication();

-- BOE-A-2026-24757 cites the bases in BOME 6431. BOME 6435 cites the same
-- BOE issue and repeats the position, vacancy count and access system.
insert into opposition_worker_private.verified_publications
  (source_id,external_id,boe_reference,publication_type,evidence_url)
select s.id,v.external_id,'BOE-A-2026-24757',v.kind,v.url
from public.opposition_sources s
cross join (values
  ('BOME-A-2026-1262','bases','https://bomemelilla.es/bome/BOME-B-2026-6431/articulo/1262'),
  ('BOME-A-2026-1333','publicacion','https://bomemelilla.es/bome/BOME-B-2026-6435/articulo/1333')
) v(external_id,kind,url)
where s.consultation_method='bome_sumario';

insert into public.opposition_territorial_inbox
  (source_id,external_id,bulletin_identifier,publication_date,title,official_url,official_pdf_url)
select s.id,'BOME-A-2026-1262','BOME-B-2026-6431',date '2026-11-13','Orden nº 5123, de fecha 5 de noviembre de 2026, relativa a convocatoria para la provisión en propiedad de tres plazas de Veterinario de Salud Pública, perteneciente a la Escala de Administración Especial, Subescala Técnica, por el procedimiento de oposición libre.','https://bomemelilla.es/bome/BOME-B-2026-6431/articulo/1262','https://bomemelilla.es/bome/descargar/BOME-A-2026-1262.pdf'
from public.opposition_sources s where s.consultation_method='bome_sumario'
on conflict (source_id,external_id) do update set official_url=excluded.official_url;

-- Reprocess the already captured exact match through the same trigger.
update public.opposition_territorial_inbox i set official_url=i.official_url
from opposition_worker_private.verified_publications v
where v.source_id=i.source_id and v.external_id=i.external_id
and i.external_id='BOME-A-2026-1333';
