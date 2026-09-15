-- Promoción limitada y nominativa de B12 Tabla Periódica Interactiva.
-- Cada invitación reserva una plaza mientras siga vigente y solo puede
-- canjearla una cuenta cuyo correo coincida con el destinatario.

create table if not exists public.periodic_table_gift_campaigns (
  slug text primary key,
  name text not null,
  max_gifts integer not null check (max_gifts > 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.periodic_table_gift_invites (
  id uuid primary key default gen_random_uuid(),
  campaign_slug text not null references public.periodic_table_gift_campaigns(slug) on delete restrict,
  assigned_email text not null,
  code_hash text not null unique,
  code_hint text not null,
  expires_at timestamptz not null,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (assigned_email = lower(btrim(assigned_email)))
);

create index if not exists periodic_table_gift_invites_campaign_idx
  on public.periodic_table_gift_invites (campaign_slug, expires_at, redeemed_at);
create index if not exists periodic_table_gift_invites_email_idx
  on public.periodic_table_gift_invites (campaign_slug, assigned_email);

alter table public.periodic_table_gift_campaigns enable row level security;
alter table public.periodic_table_gift_invites enable row level security;
revoke all on table public.periodic_table_gift_campaigns from anon, authenticated;
revoke all on table public.periodic_table_gift_invites from anon, authenticated;
grant all on table public.periodic_table_gift_campaigns to service_role;
grant all on table public.periodic_table_gift_invites to service_role;

insert into public.periodic_table_gift_campaigns (slug, name, max_gifts, active)
values ('ciencias-50', '50 regalos para alumnos de Matemáticas Aplicadas y Física', 50, true)
on conflict (slug) do update
set name = excluded.name,
    max_gifts = excluded.max_gifts,
    updated_at = now();

create or replace function public.create_periodic_table_gift_invite(
  p_campaign_slug text,
  p_assigned_email text,
  p_code_hash text,
  p_code_hint text,
  p_expires_at timestamptz,
  p_created_by uuid
)
returns table (
  invite_id uuid,
  reserved_count integer,
  redeemed_count integer,
  remaining_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_campaign public.periodic_table_gift_campaigns%rowtype;
  v_email text := lower(btrim(p_assigned_email));
  v_reserved integer;
  v_redeemed integer;
  v_invite_id uuid;
begin
  select * into v_campaign
  from public.periodic_table_gift_campaigns
  where slug = p_campaign_slug
  for update;

  if not found or not v_campaign.active
     or (v_campaign.expires_at is not null and v_campaign.expires_at <= now()) then
    raise exception 'gift_campaign_unavailable';
  end if;

  if v_email = '' or position('@' in v_email) < 2 then
    raise exception 'gift_email_invalid';
  end if;

  if p_expires_at <= now() then
    raise exception 'gift_expiry_invalid';
  end if;

  if exists (
    select 1 from public.periodic_table_gift_invites
    where campaign_slug = p_campaign_slug
      and assigned_email = v_email
      and redeemed_at is null
      and expires_at > now()
  ) then
    raise exception 'gift_email_already_invited';
  end if;

  select count(*)::integer into v_reserved
  from public.periodic_table_gift_invites
  where campaign_slug = p_campaign_slug
    and (redeemed_at is not null or expires_at > now());

  if v_reserved >= v_campaign.max_gifts then
    raise exception 'gift_campaign_full';
  end if;

  insert into public.periodic_table_gift_invites (
    campaign_slug, assigned_email, code_hash, code_hint,
    expires_at, created_by
  ) values (
    p_campaign_slug, v_email, p_code_hash, p_code_hint,
    p_expires_at, p_created_by
  ) returning id into v_invite_id;

  v_reserved := v_reserved + 1;
  select count(*)::integer into v_redeemed
  from public.periodic_table_gift_invites
  where campaign_slug = p_campaign_slug and redeemed_at is not null;

  return query select
    v_invite_id,
    v_reserved,
    v_redeemed,
    greatest(v_campaign.max_gifts - v_reserved, 0);
end;
$$;

create or replace function public.redeem_periodic_table_gift(
  p_code_hash text,
  p_user_id uuid,
  p_user_email text,
  p_user_agent text default null
)
returns table (
  already_redeemed boolean,
  redeemed_count integer,
  remaining_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.periodic_table_gift_invites%rowtype;
  v_campaign public.periodic_table_gift_campaigns%rowtype;
  v_acceptance_id uuid;
  v_redeemed integer;
  v_reserved integer;
  v_order_id text;
begin
  select * into v_invite
  from public.periodic_table_gift_invites
  where code_hash = p_code_hash
  for update;

  if not found then
    raise exception 'gift_invite_invalid';
  end if;

  select * into v_campaign
  from public.periodic_table_gift_campaigns
  where slug = v_invite.campaign_slug
  for update;

  if not found or not v_campaign.active
     or (v_campaign.expires_at is not null and v_campaign.expires_at <= now()) then
    raise exception 'gift_campaign_unavailable';
  end if;

  if lower(btrim(p_user_email)) <> v_invite.assigned_email then
    raise exception 'gift_email_mismatch';
  end if;

  if v_invite.redeemed_at is not null then
    if v_invite.redeemed_by <> p_user_id then
      raise exception 'gift_invite_redeemed';
    end if;

    select count(*)::integer into v_redeemed
    from public.periodic_table_gift_invites
    where campaign_slug = v_invite.campaign_slug and redeemed_at is not null;
    select count(*)::integer into v_reserved
    from public.periodic_table_gift_invites
    where campaign_slug = v_invite.campaign_slug
      and (redeemed_at is not null or expires_at > now());

    return query select true, v_redeemed,
      greatest(v_campaign.max_gifts - v_reserved, 0);
    return;
  end if;

  if v_invite.expires_at <= now() then
    raise exception 'gift_invite_expired';
  end if;

  select count(*)::integer into v_redeemed
  from public.periodic_table_gift_invites
  where campaign_slug = v_invite.campaign_slug and redeemed_at is not null;

  if v_redeemed >= v_campaign.max_gifts then
    raise exception 'gift_campaign_full';
  end if;

  v_order_id := 'GIFT-' || v_invite.id::text;

  insert into public.contract_acceptances (
    user_id, order_id, catalog_slug, legal_version,
    terms_accepted, privacy_acknowledged,
    immediate_access_requested, withdrawal_acknowledged,
    marketing_consent, contract_snapshot, user_agent,
    payment_confirmed_at
  ) values (
    p_user_id, v_order_id, 'tabla-periodica-licencia', '2026-09-15',
    true, true, true, false,
    false,
    jsonb_build_object(
      'accessType', 'periodic_table_gift',
      'campaignSlug', v_invite.campaign_slug,
      'codeHint', v_invite.code_hint,
      'priceCents', 0
    ),
    left(p_user_agent, 1000),
    now()
  )
  on conflict (order_id) do update
    set user_agent = excluded.user_agent
  returning id into v_acceptance_id;

  insert into public.course_enrollments (
    user_id, course_slug, plan_slug, status,
    starts_at, expires_at, payment_order_id,
    amount_cents, consent_id, metadata, updated_at
  ) values (
    p_user_id, 'tabla-periodica', 'licencia', 'active',
    now(), null, v_order_id,
    0, v_acceptance_id,
    jsonb_build_object(
      'accessType', 'periodic_table_gift',
      'campaignSlug', v_invite.campaign_slug,
      'inviteId', v_invite.id
    ),
    now()
  )
  on conflict (user_id, course_slug, plan_slug) do update
  set status = 'active',
      expires_at = null,
      payment_order_id = excluded.payment_order_id,
      amount_cents = 0,
      consent_id = excluded.consent_id,
      metadata = public.course_enrollments.metadata || excluded.metadata,
      updated_at = now();

  update public.periodic_table_gift_invites
  set redeemed_by = p_user_id, redeemed_at = now()
  where id = v_invite.id;

  select count(*)::integer into v_redeemed
  from public.periodic_table_gift_invites
  where campaign_slug = v_invite.campaign_slug and redeemed_at is not null;
  select count(*)::integer into v_reserved
  from public.periodic_table_gift_invites
  where campaign_slug = v_invite.campaign_slug
    and (redeemed_at is not null or expires_at > now());

  return query select false, v_redeemed,
    greatest(v_campaign.max_gifts - v_reserved, 0);
end;
$$;

revoke all on function public.create_periodic_table_gift_invite(text, text, text, text, timestamptz, uuid)
  from public, anon, authenticated;
revoke all on function public.redeem_periodic_table_gift(text, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.create_periodic_table_gift_invite(text, text, text, text, timestamptz, uuid)
  to service_role;
grant execute on function public.redeem_periodic_table_gift(text, uuid, text, text)
  to service_role;
