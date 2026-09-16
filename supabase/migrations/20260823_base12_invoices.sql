create table if not exists public.base12_invoice_sequences (
  invoice_year integer primary key,
  last_number integer not null default 0 check (last_number >= 0)
);

create table if not exists public.base12_invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  invoice_year integer not null,
  sequence_number integer not null,
  user_id uuid not null references auth.users(id) on delete restrict,
  enrollment_id uuid not null references public.course_enrollments(id) on delete restrict,
  payment_order_id text not null unique,
  catalog_slug text not null,
  course_slug text not null,
  plan_slug text not null,
  description text not null,
  issuer_name text not null,
  issuer_tax_id text not null,
  issuer_address text not null,
  customer_name text not null,
  customer_tax_id text not null,
  customer_address text not null,
  customer_postal_code text not null,
  customer_city text not null,
  customer_province text,
  customer_country text not null,
  customer_email text not null,
  operation_date timestamptz not null,
  issued_at timestamptz not null default now(),
  base_amount_cents integer not null,
  vat_status text not null default 'exempt' check (vat_status = 'exempt'),
  vat_amount_cents integer not null default 0 check (vat_amount_cents = 0),
  total_amount_cents integer not null,
  currency text not null default '978',
  vat_note text not null default 'Operación exenta de IVA',
  email_sent_at timestamptz,
  email_resend_id text,
  created_at timestamptz not null default now(),
  unique (invoice_year, sequence_number)
);

alter table public.base12_invoice_sequences enable row level security;
alter table public.base12_invoices enable row level security;
revoke all on public.base12_invoice_sequences from anon, authenticated;
revoke all on public.base12_invoices from anon;
grant all on public.base12_invoice_sequences, public.base12_invoices to service_role;
grant select on public.base12_invoices to authenticated;
drop policy if exists "Users can read their invoices" on public.base12_invoices;
create policy "Users can read their invoices" on public.base12_invoices
for select to authenticated using (auth.uid() = user_id);
