create table if not exists public.test_opo12_subscriptions(
 id uuid primary key default gen_random_uuid(), student uuid not null references auth.users(id), course text not null references public.test_opo12_courses(slug),
 state text not null default 'pending' check(state in ('pending','active','ended','attention')), renew boolean not null default false,
 credential text, period_start timestamptz, period_end timestamptz, anchor timestamptz, cycle integer not null default 0, unique(student,course)
);
create sequence if not exists public.test_opo12_order_seq minvalue 1 maxvalue 99999999 no cycle;
create table if not exists public.test_opo12_payments(
 order_id text primary key default ('7912'||lpad(nextval('public.test_opo12_order_seq')::text,8,'0')),
 subscription_id uuid not null references public.test_opo12_subscriptions(id), kind text not null check(kind in ('first','renewal')),
 due_at timestamptz, status text not null default 'pending' check(status in ('pending','paid','declined','unknown')),
 immediate boolean not null default false, consent jsonb not null, created_at timestamptz default now(), settled_at timestamptz,
 unique(subscription_id,due_at)
);
create unique index if not exists test_opo12_one_first on public.test_opo12_payments(subscription_id) where kind='first' and status in ('pending','unknown');
alter table public.test_opo12_payments enable row level security;
alter table public.test_opo12_subscriptions enable row level security;
revoke all on public.test_opo12_payments,public.test_opo12_subscriptions from public,anon,authenticated;
revoke all on sequence public.test_opo12_order_seq from public,anon,authenticated;
grant select,insert,update on public.test_opo12_payments,public.test_opo12_subscriptions to service_role;
grant usage on sequence public.test_opo12_order_seq to service_role;

create or replace function public.test_opo12_checkout(p_student uuid,p_course text,p_immediate boolean,p_terms jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare sub public.test_opo12_subscriptions; ord text;
begin
 if not exists(select 1 from public.test_opo12_courses where slug=p_course and open) then raise exception 'course_closed'; end if;
 insert into public.test_opo12_subscriptions(student,course) values(p_student,p_course) on conflict do nothing;
 select * into strict sub from public.test_opo12_subscriptions where student=p_student and course=p_course for update;
 if sub.period_end>now() or sub.state='attention' then raise exception 'existing_subscription'; end if;
 select order_id into ord from public.test_opo12_payments where subscription_id=sub.id and kind='first' and status in ('pending','unknown');
 if found then
  if not exists(select 1 from public.test_opo12_payments where order_id=ord and status='pending' and immediate=p_immediate ) then raise exception 'pending_payment'; end if;
  return ord;
 end if;
 insert into public.test_opo12_payments(subscription_id,kind,immediate,consent) values(sub.id,'first',p_immediate,p_terms) returning order_id into ord;
 return ord;
end $$;
create or replace function public.test_opo12_reserve_renewal(p_sub uuid) returns text
language plpgsql security invoker set search_path='' as $$
declare s public.test_opo12_subscriptions; ord text;
begin
 select * into s from public.test_opo12_subscriptions where id=p_sub for update;
 if not found or not s.renew or s.state<>'active' or s.period_end>now() or s.credential is null then return null; end if;
 insert into public.test_opo12_payments(subscription_id,kind,due_at,consent)
 select s.id,'renewal',s.period_end,p.consent from public.test_opo12_payments p where p.subscription_id=s.id and kind='first' and status='paid' order by p.settled_at desc limit 1
 on conflict(subscription_id,due_at) do nothing returning order_id into ord;
 return ord;
end $$;
create or replace function public.test_opo12_cancel(p_student uuid,p_course text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare s public.test_opo12_subscriptions;
begin
 select * into s from public.test_opo12_subscriptions where student=p_student and course=p_course for update;
 if not found or s.period_end is null then return false; end if;
 update public.test_opo12_subscriptions set renew=false,credential=null where id=s.id;
 return true;
end $$;
create or replace function public.test_opo12_settle(p_order text,p_approved boolean,p_code integer,p_credential text) returns text
language plpgsql security invoker set search_path='' as $$
declare p public.test_opo12_payments; s public.test_opo12_subscriptions; st timestamptz; en timestamptz; cyc integer;
 prod text; aid uuid; eid uuid; snap jsonb;
begin
 select * into strict p from public.test_opo12_payments where order_id=p_order for update;
 select * into strict s from public.test_opo12_subscriptions where id=p.subscription_id for update;
 if p.status='paid' or (p.status='declined' and not p_approved) then return p.status; end if;
 if not p_approved then
  update public.test_opo12_payments set status='declined',settled_at=now() where order_id=p_order;
  if p.kind='renewal' then update public.test_opo12_subscriptions set state='ended',renew=false,credential=null where id=s.id; end if;
  return 'declined';
 end if;
 prod:='test-opo12-'||s.course;
 if p.kind='first' then
  st:=case when p.immediate then now() else now()+interval '14 days' end; cyc:=1; en:=st+interval '1 month';
 else
  if s.period_end is distinct from p.due_at then raise exception 'period_mismatch'; end if;
  st:=s.period_start;cyc:=s.cycle+1;en:=s.anchor+make_interval(months=>cyc);
 end if;
 snap:=p.consent||jsonb_build_object('priceInCents',990,'catalogSlug',prod,'recurring',true);
 insert into public.checkout_orders(order_id,checkout_token_hash,catalog_slug,course_slug,plan_slug,access_months,amount_cents,currency,status,legal_version,terms_accepted,privacy_acknowledged,immediate_access_requested,withdrawal_acknowledged,contract_snapshot,linked_user_id,linked_at,paid_at,redsys_response_code)
 values(p_order,gen_random_uuid()::text,prod,prod,'mensual',1,990,'978','linked','TEST-OPO12-2026-11',true,true,p.immediate,p.immediate,snap,s.student,now(),now(),p_code);
 insert into public.contract_acceptances(user_id,order_id,catalog_slug,legal_version,terms_accepted,privacy_acknowledged,immediate_access_requested,withdrawal_acknowledged,marketing_consent,contract_snapshot,accepted_at,payment_confirmed_at)
 values(s.student,p_order,prod,'TEST-OPO12-2026-11',true,true,p.immediate,p.immediate,false,snap,p.created_at,now()) returning id into aid;
 update public.checkout_orders set contract_acceptance_id=aid where order_id=p_order;
 insert into public.pagos(user_id,order_id,course_slug,amount,currency,status,response_code,paid_at) values(s.student,p_order,prod,990,'978','paid',p_code,now());
 insert into public.course_enrollments(user_id,course_slug,plan_slug,status,starts_at,expires_at,payment_order_id,amount_cents,consent_id,metadata)
 values(s.student,prod,'mensual','active',st,en,p_order,990,aid,jsonb_build_object('testOpo12',true))
 on conflict(user_id,course_slug,plan_slug) do update set status='active',starts_at=excluded.starts_at,expires_at=excluded.expires_at,payment_order_id=p_order,consent_id=aid,amount_cents=990,updated_at=now() returning id into eid;
 if exists(select 1 from public.billing_profiles where enrollment_id=eid and user_id=s.student and nominative_invoice and billing_name is not null and tax_id is not null and address is not null and postal_code is not null and city is not null and billing_email is not null) then perform public.issue_base12_invoice(s.student,eid,'TEST OPO12 · '||s.course||' · acceso mensual'); end if;
 update public.test_opo12_subscriptions set state=case when p.kind='first' and p_credential is null then 'attention' else 'active' end,
 renew=case when p.kind='first' then p_credential is not null else s.renew end,
 credential=case when p.kind='first' then p_credential else s.credential end,period_start=st,period_end=en,
 anchor=case when p.kind='first' then st else s.anchor end,cycle=cyc where id=s.id;
 update public.test_opo12_payments set status='paid',settled_at=now() where order_id=p_order; return 'paid';
end $$;
revoke all on function public.test_opo12_checkout(uuid,text,boolean,jsonb),public.test_opo12_reserve_renewal(uuid),public.test_opo12_cancel(uuid,text),public.test_opo12_settle(text,boolean,integer,text) from public,anon,authenticated;
grant execute on function public.test_opo12_checkout(uuid,text,boolean,jsonb),public.test_opo12_reserve_renewal(uuid),public.test_opo12_cancel(uuid,text),public.test_opo12_settle(text,boolean,integer,text) to service_role;

create or replace function public.test_opo12_due() returns table(id uuid)
language sql stable security invoker set search_path='' as $$
 select s.id from public.test_opo12_subscriptions s
 where s.renew and s.state='active' and s.period_end<=now() and s.credential is not null
 and not exists(select 1 from public.test_opo12_payments p where p.subscription_id=s.id and p.due_at=s.period_end)
 order by s.period_end,s.id limit 200
$$;
revoke all on function public.test_opo12_due() from public,anon,authenticated;
grant execute on function public.test_opo12_due() to service_role;
