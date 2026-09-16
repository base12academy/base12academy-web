-- Revierte solo las restricciones añadidas por el endurecimiento.
alter table if exists public.trop_questions drop constraint if exists trop_questions_family_same_aptitude_fk;
alter table if exists public.trop_questions drop constraint if exists trop_questions_motor_same_aptitude_fk;
alter table if exists public.trop_families drop constraint if exists trop_families_id_aptitude_key;
alter table if exists public.trop_motors drop constraint if exists trop_motors_code_aptitude_key;
