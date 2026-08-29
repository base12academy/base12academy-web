-- ROLLBACK MANUAL — NO EJECUTAR EN PRODUCCIÓN SIN COPIA Y AUTORIZACIÓN.
-- Solo revierte los objetos nuevos de 20260829_tropa_core.sql.

begin;

drop table if exists public.trop_import_batches;
drop table if exists public.trop_questions;
drop table if exists public.trop_families;
drop table if exists public.trop_plan_motors;
drop table if exists public.trop_motors;
drop table if exists public.trop_aptitudes;
drop function if exists public.trop_plan_rank(text);

commit;
