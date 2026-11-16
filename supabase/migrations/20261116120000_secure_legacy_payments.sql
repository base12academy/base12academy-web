-- Protege el registro contable heredado de pagos sin alterar sus filas.
-- Las escrituras de Redsys y la vinculacion posterior se realizan con service_role.

do $migration$
begin
  if to_regclass('public.pagos') is null then
    raise notice 'public.pagos no existe; no hay permisos que corregir';
    return;
  end if;

  execute 'alter table public.pagos enable row level security';
  execute 'revoke all privileges on table public.pagos from anon, authenticated';
  execute 'grant all privileges on table public.pagos to service_role';
  execute $comment$
    comment on table public.pagos is
      'Registro contable interno de intentos de pago. Acceso exclusivo del servidor.'
  $comment$;
end
$migration$;
