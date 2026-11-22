create or replace function public.test_opo12_start(p_student uuid,p_course text,p_kind text,p_set text,p_request uuid)
returns uuid language plpgsql security invoker set search_path='' as $$
declare chosen public.test_opo12_sets; prior public.test_opo12_attempts; chosen_items jsonb; entitled boolean; draw integer; randomize boolean;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_student::text,341));
 select
  exists(select 1 from public.course_enrollments e where e.user_id=p_student and e.course_slug='test-opo12-'||p_course and e.plan_slug='mensual' and e.status='active' and e.starts_at<=now() and e.expires_at>now())
  or exists(select 1 from public.course_enrollments e where e.user_id=p_student and e.course_slug=p_course and e.plan_slug='premium' and e.status='active' and e.starts_at<=now() and (e.expires_at is null or e.expires_at>now()))
 into entitled;
 if not entitled then raise exception 'subscription_required'; end if;
 select * into prior from public.test_opo12_attempts where id=p_request;
 if found then
  if prior.student=p_student and prior.course=p_course and prior.kind=p_kind and prior.set_id=p_set then return prior.id; end if;
  raise exception 'invalid_request';
 end if;
 select * into chosen from public.test_opo12_sets where course=p_course and kind=p_kind and id=p_set;
 if not found then raise exception 'set_not_found'; end if;
 if p_kind='simulacro' and (select count(*) from public.test_opo12_attempts where student=p_student and kind='simulacro' and started_at>=((now() at time zone 'Europe/Madrid')::date::timestamp at time zone 'Europe/Madrid'))>=2 then raise exception 'daily_limit'; end if;
 randomize:=p_kind='test' or chosen.settings ? 'drawCount';
 draw:=case when p_kind='test' then least(20,jsonb_array_length(chosen.items))
            when chosen.settings ? 'drawCount' then least((chosen.settings->>'drawCount')::integer,jsonb_array_length(chosen.items))
            else jsonb_array_length(chosen.items) end;
 if draw not between 1 and 1000 then raise exception 'invalid_set_size'; end if;
 select jsonb_agg(jsonb_build_object('id',t.qid,'content',q.content) order by t.ord) into chosen_items from (
 select a.qid, case when randomize then random() else a.pos::double precision end ord from jsonb_array_elements_text(chosen.items) with ordinality a(qid,pos) order by ord limit draw
 )t join public.test_opo12_questions q on q.id=t.qid;
 if coalesce(jsonb_array_length(chosen_items),0)<>draw then raise exception 'incomplete_set'; end if;
 insert into public.test_opo12_attempts(id,student,course,kind,set_id,title,settings,items) values(p_request,p_student,p_course,p_kind,p_set,chosen.title,chosen.settings,chosen_items);
 return p_request;
end $$;

revoke all on function public.test_opo12_start(uuid,text,text,text,uuid) from public,anon,authenticated;
grant execute on function public.test_opo12_start(uuid,text,text,text,uuid) to service_role;
