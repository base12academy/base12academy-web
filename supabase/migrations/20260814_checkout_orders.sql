create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),

  order_id text not null unique,
  checkout_token_hash text not null unique,

  catalog_slug text not null,
  course_slug text not null,
  plan_slug text not null,

  access_months integer
    check (access_months is null or access_months > 0),

  amount_cents integer not null
    check (amount_cents >= 0),

  currency text not null default '978',

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'paid',
        'denied',
        'linked',
        'cancelled',
        'expired'
      )
    ),

  legal_version text not null,

  terms_accepted boolean not null default false,
  privacy_acknowledged boolean not null default false,
  immediate_access_requested boolean not null default false,
  withdrawal_acknowledged boolean not null default false,
  marketing_consent boolean not null default false,

  contract_snapshot jsonb not null default '{}'::jsonb,

  ip_hash text,
  user_agent text,

  redsys_response_code integer,
  redsys_raw jsonb,

  paid_at timestamptz,

  communications_video_completed_at timestamptz,

  linked_user_id uuid
    references auth.users(id)
    on delete set null,

  contract_acceptance_id uuid
    references public.contract_acceptances(id)
    on delete set null,

  linked_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checkout_orders_status_idx
on public.checkout_orders (status);

create index if not exists checkout_orders_linked_user_idx
on public.checkout_orders (linked_user_id);

alter table public.checkout_orders enable row level security;

revoke all
on table public.checkout_orders
from anon, authenticated;

grant all
on table public.checkout_orders
to service_role;

comment on table public.checkout_orders is
  'Pedidos Base12 creados antes del pago y vinculados al alumno después de la confirmación de Redsys.';