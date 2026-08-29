-- Rollback de la fase 6 pedagógica. No toca banco V4, usuarios, matrículas, pagos ni progreso.
drop table if exists public.trop_error_patterns cascade;
drop table if exists public.trop_microtemario_laminas cascade;
drop table if exists public.trop_laminas cascade;
drop table if exists public.trop_microtemarios cascade;
drop table if exists public.trop_feedback_rules cascade;
drop table if exists public.trop_workshops cascade;
