-- Corrección idempotente de la migración 20260823 ya aplicada en Supabase.
-- Conserva su esquema y corrige UTF-8, inmutabilidad e idempotencia concurrente.
update public.base12_invoices set
  issuer_name='Imagen Digital Ménace, S. L. U.',
  issuer_address='Calle Lanuza, 8 1º E · 29009 Málaga',
  vat_note='Operación exenta de IVA'
where issuer_tax_id='B21746086';

do $$ begin
  if not exists (select 1 from pg_constraint where conname='base12_invoice_number_format') then
    alter table public.base12_invoices add constraint base12_invoice_number_format
      check (invoice_number ~ '^05[0-9]{10}$') not valid;
  end if;
end $$;
alter table public.base12_invoices validate constraint base12_invoice_number_format;

create or replace function public.prevent_base12_invoice_mutation()
returns trigger language plpgsql as $$ begin
  if row(new.invoice_number,new.invoice_year,new.sequence_number,new.user_id,new.enrollment_id,
    new.payment_order_id,new.issuer_name,new.issuer_tax_id,new.issuer_address,new.customer_name,
    new.customer_tax_id,new.customer_address,new.customer_postal_code,new.customer_city,
    new.customer_country,new.operation_date,new.base_amount_cents,new.vat_status,new.vat_amount_cents,
    new.total_amount_cents,new.currency,new.vat_note)
    is distinct from
    row(old.invoice_number,old.invoice_year,old.sequence_number,old.user_id,old.enrollment_id,
    old.payment_order_id,old.issuer_name,old.issuer_tax_id,old.issuer_address,old.customer_name,
    old.customer_tax_id,old.customer_address,old.customer_postal_code,old.customer_city,
    old.customer_country,old.operation_date,old.base_amount_cents,old.vat_status,old.vat_amount_cents,
    old.total_amount_cents,old.currency,old.vat_note) then
    raise exception 'Los datos esenciales de una factura emitida son inmutables';
  end if; return new;
end $$;
drop trigger if exists base12_invoices_immutable on public.base12_invoices;
create trigger base12_invoices_immutable before update on public.base12_invoices
for each row execute function public.prevent_base12_invoice_mutation();

create or replace function public.issue_base12_invoice(p_user_id uuid,p_enrollment_id uuid,p_description text)
returns public.base12_invoices language plpgsql security definer set search_path=public as $$
declare v_e public.course_enrollments; v_o public.checkout_orders; v_b public.billing_profiles;
v_i public.base12_invoices; v_y integer; v_s integer;
begin
  select * into v_e from public.course_enrollments where id=p_enrollment_id and user_id=p_user_id;
  if not found then raise exception 'Enrollment not found'; end if;
  select * into v_o from public.checkout_orders where order_id=v_e.payment_order_id
    and linked_user_id=p_user_id and paid_at is not null and status in ('paid','linked') for update;
  if not found then raise exception 'Paid order not found'; end if;
  select * into v_i from public.base12_invoices where payment_order_id=v_o.order_id;
  if found then return v_i; end if;
  select * into v_b from public.billing_profiles where user_id=p_user_id and enrollment_id=p_enrollment_id;
  if not found or v_b.billing_name is null or v_b.tax_id is null or v_b.address is null
    or v_b.postal_code is null or v_b.city is null or v_b.billing_email is null
    then raise exception 'Billing profile incomplete'; end if;
  v_y:=extract(year from now() at time zone 'Europe/Madrid')::integer;
  insert into public.base12_invoice_sequences(invoice_year,last_number) values(v_y,1)
    on conflict(invoice_year) do update set last_number=public.base12_invoice_sequences.last_number+1
    returning last_number into v_s;
  if v_s>999999 then raise exception 'Secuencia anual agotada'; end if;
  insert into public.base12_invoices(invoice_number,invoice_year,sequence_number,user_id,enrollment_id,
    payment_order_id,catalog_slug,course_slug,plan_slug,description,issuer_name,issuer_tax_id,issuer_address,
    customer_name,customer_tax_id,customer_address,customer_postal_code,customer_city,customer_province,
    customer_country,customer_email,operation_date,base_amount_cents,vat_status,vat_amount_cents,
    total_amount_cents,currency,vat_note)
  values('05'||v_y||lpad(v_s::text,6,'0'),v_y,v_s,p_user_id,p_enrollment_id,v_o.order_id,
    v_o.catalog_slug,v_o.course_slug,v_o.plan_slug,p_description,'Imagen Digital Ménace, S. L. U.',
    'B21746086','Calle Lanuza, 8 1º E · 29009 Málaga',v_b.billing_name,v_b.tax_id,v_b.address,
    v_b.postal_code,v_b.city,v_b.province,v_b.country,v_b.billing_email,coalesce(v_o.paid_at,v_o.created_at),
    v_o.amount_cents,'exempt',0,v_o.amount_cents,v_o.currency,'Operación exenta de IVA') returning * into v_i;
  return v_i;
exception when unique_violation then
  select * into v_i from public.base12_invoices where payment_order_id=v_o.order_id;
  if found then return v_i; end if; raise;
end $$;
revoke all on function public.issue_base12_invoice(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.issue_base12_invoice(uuid,uuid,text) to service_role;
