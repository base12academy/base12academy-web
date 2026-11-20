-- Internal content importer. The outer archive retains editorial source IDs and the original answers.
create or replace function public.test_opo12_ingest(p_course text,p_kind text,p_id text,p_title text,p_questions jsonb,p_settings jsonb default '{}')
returns integer language plpgsql security invoker set search_path='' as $$
declare ids jsonb; count_valid integer;
begin
 if p_kind not in ('test','simulacro') or jsonb_typeof(p_questions)<>'array' or jsonb_array_length(p_questions)=0 then return 0; end if;
 with src as (select q,pos,case when q->>'responseType'='written' then jsonb_build_object('question',q->>'question','context',q->>'context','responseType','written','explanation',q->>'explanation') else jsonb_build_object('question',q->>'question','options',q->'options','answer',q->'answer','explanation',q->>'explanation') end c from jsonb_array_elements(p_questions) with ordinality t(q,pos)
 where length(btrim(q->>'question'))>2 and length(btrim(q->>'explanation'))>3 and (q->>'responseType'='written' or (jsonb_typeof(q->'options')='array' and jsonb_array_length(q->'options')=4 and (q->>'answer') ~ '^[0-3]$' and not exists(select 1 from jsonb_array_elements_text(q->'options') o where o is null or btrim(o)='') and (select count(distinct lower(btrim(o))) from jsonb_array_elements_text(q->'options') o)=4))),
 norm as (select c,pos,md5((c-'explanation')::text) qid from src),
 firsts as(select distinct on(qid) qid,c,pos from norm order by qid,pos),
 ins as(insert into public.test_opo12_questions(id,content) select qid,c from firsts on conflict(id) do nothing)
 select jsonb_agg(qid order by pos), count(*) into ids,count_valid from firsts;
 if count_valid=0 or (p_kind='simulacro' and count_valid<>jsonb_array_length(p_questions)) then return 0; end if;
 insert into public.test_opo12_courses(slug) values(p_course) on conflict do nothing;
 insert into public.test_opo12_sets(course,kind,id,title,items,settings) values(p_course,p_kind,p_id,p_title,ids,p_settings) on conflict(course,kind,id) do update set title=excluded.title,items=excluded.items,settings=excluded.settings;
 return count_valid;
end $$;
revoke all on function public.test_opo12_ingest(text,text,text,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.test_opo12_ingest(text,text,text,text,jsonb,jsonb) to service_role;
