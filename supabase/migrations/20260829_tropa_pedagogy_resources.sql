-- TROP · Fase 6 · Recursos pedagógicos y manifiesto de 147 talleres.
-- PRECONDICIÓN: aplicar después de 20260829_tropa_core.sql.
-- Esta migración es aditiva y no activa productos, pagos ni rutas públicas de entrenamiento.

create table if not exists public.trop_workshops (
  workshop_id text primary key,
  block_code text not null,
  block_name text not null,
  title text not null,
  origin_status text not null,
  written_coverage text not null,
  resource_final text not null,
  resource_kind text not null check (resource_kind in ('existing','auxiliary','special')),
  bank_status text not null,
  bank_coverage_status text not null check (bank_coverage_status in ('direct','review_required','not_applicable')),
  next_action text not null,
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trop_workshops_block_idx
  on public.trop_workshops (block_code, bank_coverage_status, workshop_id);

create table if not exists public.trop_microtemarios (
  micro_id text primary key,
  motor_code text not null unique references public.trop_motors(code) on delete restrict,
  factor_name text not null,
  game_name text not null,
  success_feedback text not null,
  correct_sequence text not null,
  main_tip text not null,
  action_after_success text not null,
  action_after_error text not null,
  audit_status text not null,
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trop_laminas (
  lamina_id text primary key,
  factor_name text not null,
  title text not null,
  priority text not null check (priority in ('A','B','C')),
  status text not null,
  format text not null,
  source_version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trop_microtemario_laminas (
  micro_id text not null references public.trop_microtemarios(micro_id) on delete cascade,
  lamina_id text not null references public.trop_laminas(lamina_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (micro_id, lamina_id)
);

create table if not exists public.trop_error_patterns (
  micro_id text not null references public.trop_microtemarios(micro_id) on delete cascade,
  error_code text not null,
  error_type text not null,
  detection_rule text not null,
  failure_feedback text not null,
  correction_sequence text not null,
  resource_codes jsonb not null default '[]'::jsonb,
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (micro_id, error_code),
  check (jsonb_typeof(resource_codes) = 'array')
);

create table if not exists public.trop_feedback_rules (
  code text primary key,
  state_name text not null,
  trigger_rule text not null,
  ui_template text not null,
  system_action text not null,
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.trop_workshops
(workshop_id, block_code, block_name, title, origin_status, written_coverage, resource_final,
 resource_kind, bank_status, bank_coverage_status, next_action, source_version)
values
('B0_T01', 'B0', 'Estrategia de prueba', 'Cómo funciona un psicotécnico', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T02', 'B0', 'Estrategia de prueba', 'Lectura de instrucciones y cambio de bloque', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T03', 'B0', 'Estrategia de prueba', 'Primera pasada / segunda pasada', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T04', 'B0', 'Estrategia de prueba', 'Cuándo abandonar una pregunta', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T05', 'B0', 'Estrategia de prueba', 'Eliminación de opciones', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T06', 'B0', 'Estrategia de prueba', 'Ritmo de 7 minutos', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T07', 'B0', 'Estrategia de prueba', 'Entrenamiento sin papel ni calculadora', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B0_T08', 'B0', 'Estrategia de prueba', 'Gestión de fatiga y recuperación tras error', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T01', 'B1', 'Aptitud verbal', 'Sinónimos y equivalencias', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T02', 'B1', 'Aptitud verbal', 'Antónimos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T03', 'B1', 'Aptitud verbal', 'Definiciones', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T04', 'B1', 'Aptitud verbal', 'Analogías verbales', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T05', 'B1', 'Aptitud verbal', 'Palabra intrusa', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T06', 'B1', 'Aptitud verbal', 'Familias semánticas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T07', 'B1', 'Aptitud verbal', 'Ortografía y acentuación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T08', 'B1', 'Aptitud verbal', 'Puntuación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T09', 'B1', 'Aptitud verbal', 'Orden alfabético', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T10', 'B1', 'Aptitud verbal', 'Comprensión breve', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T11', 'B1', 'Aptitud verbal', 'Inferencias', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T12', 'B1', 'Aptitud verbal', 'Vocabulario desconocido por contexto', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B1_T13', 'B1', 'Aptitud verbal', 'Velocidad verbal', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T01', 'B2', 'Aptitud numérica', 'Cálculo mental', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T02', 'B2', 'Aptitud numérica', 'Sumas/restas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T03', 'B2', 'Aptitud numérica', 'Multiplicación/división', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T04', 'B2', 'Aptitud numérica', 'Divisibilidad', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T05', 'B2', 'Aptitud numérica', 'Fracciones', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T06', 'B2', 'Aptitud numérica', 'Decimales', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T07', 'B2', 'Aptitud numérica', 'Porcentajes', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T08', 'B2', 'Aptitud numérica', 'Proporciones y regla de tres', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T09', 'B2', 'Aptitud numérica', 'Potencias y raíces sencillas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T10', 'B2', 'Aptitud numérica', 'Áreas y perímetros', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T11', 'B2', 'Aptitud numérica', 'Series simples', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T12', 'B2', 'Aptitud numérica', 'Series alternas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T13', 'B2', 'Aptitud numérica', 'Diferencias', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T14', 'B2', 'Aptitud numérica', 'Multiplicación/división', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T15', 'B2', 'Aptitud numérica', 'Series mixtas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T16', 'B2', 'Aptitud numérica', 'Matrices numéricas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T17', 'B2', 'Aptitud numérica', 'Estimación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B2_T18', 'B2', 'Aptitud numérica', 'Problemas rápidos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T01', 'B3', 'Aptitud espacial', 'Orientación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T02', 'B3', 'Aptitud espacial', 'Giros 90/180/270', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T03', 'B3', 'Aptitud espacial', 'Rotaciones parciales', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T04', 'B3', 'Aptitud espacial', 'Simetrías', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T05', 'B3', 'Aptitud espacial', 'Reflejos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T06', 'B3', 'Aptitud espacial', 'Superposición', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T07', 'B3', 'Aptitud espacial', 'Figuras ocultas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T08', 'B3', 'Aptitud espacial', 'Composición/descomposición', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T09', 'B3', 'Aptitud espacial', 'Cubos', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T10', 'B3', 'Aptitud espacial', 'Caras opuestas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T11', 'B3', 'Aptitud espacial', 'Desarrollos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T12', 'B3', 'Aptitud espacial', 'Plegados', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T13', 'B3', 'Aptitud espacial', 'Vistas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T14', 'B3', 'Aptitud espacial', 'Perspectiva', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B3_T15', 'B3', 'Aptitud espacial', 'Recorridos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T01', 'B4', 'Aptitud mecánica', 'Palancas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T02', 'B4', 'Aptitud mecánica', 'Equilibrio', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T03', 'B4', 'Aptitud mecánica', 'Centro de gravedad', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T04', 'B4', 'Aptitud mecánica', 'Poleas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T05', 'B4', 'Aptitud mecánica', 'Engranajes', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T06', 'B4', 'Aptitud mecánica', 'Ruedas y transmisión', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T07', 'B4', 'Aptitud mecánica', 'Correas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T08', 'B4', 'Aptitud mecánica', 'Fuerzas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T09', 'B4', 'Aptitud mecánica', 'Movimiento', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T10', 'B4', 'Aptitud mecánica', 'Velocidad', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T11', 'B4', 'Aptitud mecánica', 'Fricción', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T12', 'B4', 'Aptitud mecánica', 'Planos inclinados', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T13', 'B4', 'Aptitud mecánica', 'Presión', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T14', 'B4', 'Aptitud mecánica', 'Fluidos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T15', 'B4', 'Aptitud mecánica', 'Vasos comunicantes', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T16', 'B4', 'Aptitud mecánica', 'Máquinas simples', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T17', 'B4', 'Aptitud mecánica', 'Electricidad elemental', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B4_T18', 'B4', 'Aptitud mecánica', 'Sentido del movimiento', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T01', 'B5', 'Aptitud perceptiva', 'Igual/diferente', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T02', 'B5', 'Aptitud perceptiva', 'Cadenas numéricas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T03', 'B5', 'Aptitud perceptiva', 'Cadenas alfanuméricas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T04', 'B5', 'Aptitud perceptiva', 'Símbolos', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T05', 'B5', 'Aptitud perceptiva', 'Diferencias', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T06', 'B5', 'Aptitud perceptiva', 'Elemento intruso', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T07', 'B5', 'Aptitud perceptiva', 'Búsqueda visual', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T08', 'B5', 'Aptitud perceptiva', 'Figuras idénticas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T09', 'B5', 'Aptitud perceptiva', 'Codificación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T10', 'B5', 'Aptitud perceptiva', 'Tablas de correspondencia', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T11', 'B5', 'Aptitud perceptiva', 'Cancelación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T12', 'B5', 'Aptitud perceptiva', 'Recuento', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T13', 'B5', 'Aptitud perceptiva', 'Atención selectiva', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T14', 'B5', 'Aptitud perceptiva', 'Atención sostenida', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B5_T15', 'B5', 'Aptitud perceptiva', 'Velocidad perceptiva', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T01', 'B6', 'Memoria', 'Memoria de trabajo', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T02', 'B6', 'Memoria', 'Memoria visual', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T03', 'B6', 'Memoria', 'Memoria verbal', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T04', 'B6', 'Memoria', 'Memoria numérica', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T05', 'B6', 'Memoria', 'Series', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T06', 'B6', 'Memoria', 'Pares asociados', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T07', 'B6', 'Memoria', 'Figuras', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T08', 'B6', 'Memoria', 'Posiciones', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T09', 'B6', 'Memoria', 'Matrices', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T10', 'B6', 'Memoria', 'Orden de aparición', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T11', 'B6', 'Memoria', 'Cambios entre imágenes', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T12', 'B6', 'Memoria', 'Recuerdo inmediato', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T13', 'B6', 'Memoria', 'Chunking', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T14', 'B6', 'Memoria', 'Historias visuales', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B6_T15', 'B6', 'Memoria', 'Método de lugares', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T01', 'B7', 'Razonamiento abstracto', 'Series', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T02', 'B7', 'Razonamiento abstracto', 'Matrices 2×2', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T03', 'B7', 'Razonamiento abstracto', 'Matrices 3×3', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T04', 'B7', 'Razonamiento abstracto', 'Analogías gráficas', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T05', 'B7', 'Razonamiento abstracto', 'Movimiento', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T06', 'B7', 'Razonamiento abstracto', 'Rotación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T07', 'B7', 'Razonamiento abstracto', 'Alternancia', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T08', 'B7', 'Razonamiento abstracto', 'Adición/eliminación', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T09', 'B7', 'Razonamiento abstracto', 'Tamaño', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T10', 'B7', 'Razonamiento abstracto', 'Posición', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T11', 'B7', 'Razonamiento abstracto', 'Cantidad', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T12', 'B7', 'Razonamiento abstracto', 'Relleno', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T13', 'B7', 'Razonamiento abstracto', 'Superposición', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T14', 'B7', 'Razonamiento abstracto', 'Intersección', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T15', 'B7', 'Razonamiento abstracto', 'Simetría', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T16', 'B7', 'Razonamiento abstracto', 'Reglas simultáneas', 'RESPALDADO', 'CUBIERTO POR RECURSO EXISTENTE', 'Microtemario/lámina/recurso ya auditado', 'existing', 'RESPALDADO DIRECTAMENTE', 'direct', 'Conservar; no regenerar.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B7_T17', 'B7', 'Razonamiento abstracto', 'Eliminación lógica', 'SIN CORRESPONDENCIA DIRECTA', 'FICHA AUXILIAR NUEVA', 'Punto 6 · Ficha auxiliar de factor', 'auxiliary', 'REVISAR COBERTURA EN PUNTO 8', 'review_required', 'Contenido escrito cerrado; comprobar familia de ejercicios al auditar/importar el banco.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T01', 'B8', 'Pruebas psicológicas', 'Qué evalúan', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T02', 'B8', 'Pruebas psicológicas', 'Formato de inventarios', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T03', 'B8', 'Pruebas psicológicas', 'Escalas de respuesta', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T04', 'B8', 'Pruebas psicológicas', 'Consistencia', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T05', 'B8', 'Pruebas psicológicas', 'Ítems equivalentes', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T06', 'B8', 'Pruebas psicológicas', 'Deseabilidad social', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T07', 'B8', 'Pruebas psicológicas', 'Responder con naturalidad', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T08', 'B8', 'Pruebas psicológicas', 'Fatiga en cuestionarios largos', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T09', 'B8', 'Pruebas psicológicas', 'Qué no hacer', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B8_T10', 'B8', 'Pruebas psicológicas', 'Simulaciones no diagnósticas', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T01', 'B9', 'Entrenamiento combinado', 'Microtest 5 min', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T02', 'B9', 'Entrenamiento combinado', 'Velocidad', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T03', 'B9', 'Entrenamiento combinado', 'Precisión', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T04', 'B9', 'Entrenamiento combinado', 'Doble aptitud', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T05', 'B9', 'Entrenamiento combinado', 'Cambio rápido de factor', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T06', 'B9', 'Entrenamiento combinado', 'Bloques mixtos', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T07', 'B9', 'Entrenamiento combinado', 'Modo fatiga', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T08', 'B9', 'Entrenamiento combinado', 'Entrenamiento de errores', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B9_T09', 'B9', 'Entrenamiento combinado', 'Recuperación de puntos débiles', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T01', 'B10', 'Simulacros y día de prueba', 'Simulacro 7×15', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T02', 'B10', 'Simulacros y día de prueba', 'Simulacro diagnóstico', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T03', 'B10', 'Simulacros y día de prueba', 'Simulacro por nivel', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T04', 'B10', 'Simulacros y día de prueba', 'Simulacro de velocidad', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T05', 'B10', 'Simulacros y día de prueba', 'Simulacro de precisión', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T06', 'B10', 'Simulacros y día de prueba', 'Simulacro adaptativo', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T07', 'B10', 'Simulacros y día de prueba', 'Revisión de errores', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T08', 'B10', 'Simulacros y día de prueba', 'Plan últimas 72 h', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28'),
('B10_T09', 'B10', 'Simulacros y día de prueba', 'Rutina del día de examen', 'ESPECIAL', 'FICHA TRANSVERSAL NUEVA', 'Punto 6 · Ficha ESPECIAL', 'special', 'ACTIVIDAD ESPECIAL / NO BANCO DE FACTOR', 'not_applicable', 'Implementar como actividad/guía conectada con Fernando y plataforma.', 'TROP_PUNTO6_INVENTARIO_RECURSOS_ESCRITOS-2026-08-28')
on conflict (workshop_id) do update set
  block_code = excluded.block_code,
  block_name = excluded.block_name,
  title = excluded.title,
  origin_status = excluded.origin_status,
  written_coverage = excluded.written_coverage,
  resource_final = excluded.resource_final,
  resource_kind = excluded.resource_kind,
  bank_status = excluded.bank_status,
  bank_coverage_status = excluded.bank_coverage_status,
  next_action = excluded.next_action,
  source_version = excluded.source_version,
  active = true,
  updated_at = now();

insert into public.trop_microtemarios
(micro_id, motor_code, factor_name, game_name, success_feedback, correct_sequence, main_tip,
 action_after_success, action_after_error, audit_status, source_version)
values
('MEC-01', 'ME01', 'Mecánico', 'Cadena de engranajes', 'Correcto. Has separado el tipo de transmisión y el sentido antes de analizar la velocidad.', 'IDENTIFICA TRANSMISIÓN → CUENTA/TRACE GIRO → COMPRUEBA SENTIDO → ANALIZA VELOCIDAD SI SE PIDE', 'Cadena simple de engranajes exteriores: PAR de ruedas = cambia; IMPAR = conserva. Correa y mismo eje se tratan aparte.', 'Confirmar brevemente y mostrar la secuencia correcta.', 'Diagnosticar el error concreto, mostrar la secuencia correcta y enlazar la lámina si se repite.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-02', 'ME03', 'Mecánico', 'Equilibra la palanca', 'Correcto. Has comparado fuerza y distancia al fulcro, no solo los pesos.', 'LOCALIZA FULCRO → MIDE/COMPARA BRAZOS → FUERZA × BRAZO → DECIDE EQUILIBRIO O LADO QUE BAJA', 'Brazo doble necesita la mitad de fuerza para el mismo momento; fuerza aplicada en el fulcro no genera momento.', 'Confirmar la comparación de momentos.', 'Indicar si falló por fuerza, brazo o fulcro; mostrar la comparación correcta.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-03', 'ME05', 'Mecánico', '¿Qué ocurrirá?', 'Correcto. Has identificado la relación física y seguido la cadena causal hasta el resultado.', 'CLASIFICA MECANISMO → LOCALIZA ENTRADA → SIGUE TRANSMISIÓN → APLICA LEY → PREDICE SALIDA', 'En poleas cuenta solo los tramos que sostienen el bloque móvil; una polea fija sola cambia dirección.', 'Confirmar la ley activada y el efecto final.', 'Señalar la pieza o tramo mal interpretado y reconstruir la cadena causal.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-01', 'MEM01', 'Memoria', 'Kim Base12', 'Correcto. Has codificado la escena con un recorrido estable y agrupaciones útiles.', 'RECORRIDO FIJO → AGRUPA → ANCLA RARA → ETIQUETAS CORTAS → RECUPERA', 'Menos es más: guarda estructura y rasgos discriminantes, no una descripción completa.', 'Confirmar la estrategia de codificación.', 'Indicar si falló el recorrido, la agrupación o la recuperación; recomendar repetir con menos información verbal.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-02', 'MEM03', 'Memoria', '¿Qué cambió?', 'Correcto. Has comparado las dos escenas posición a posición.', 'MISMO RECORRIDO EN A Y B → COMPARA PAREJAS → CONFIRMA ESTABLE → CLASIFICA EL CAMBIO', 'No reconstruyas dos escenas completas: compara A1↔B1, A2↔B2…', 'Confirmar el tipo de cambio detectado.', 'Explicar si el cambio era aparición, posición o atributo y dónde se perdió la comparación.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-03', 'MEM04', 'Memoria', 'Mapa de memoria', 'Correcto. Has usado origen, dirección e hitos en vez de reconstruir toda la ruta.', 'FIJA ORIGEN → CODIFICA DIRECCIÓN → MARCA HITOS → USA RELACIONES LOCALES → RECUPERA', 'Reloj mental para dirección global; vecino más cercano para reconstrucción local.', 'Confirmar la relación espacial recuperada.', 'Señalar si falló orientación, hito o relación local y reconstruir desde el punto más cercano.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-01', 'NU01', 'Numérico', 'Número objetivo', 'Correcto. Has trabajado desde el objetivo hacia atrás con una operación corta y comprobable.', 'OBJETIVO → NÚMERO ANTERIOR → OPERACIÓN INVERSA → NÚMERO CÓMODO/FACTOR → VERIFICA', '25% = 1/4; 50% = mitad; usa factores, dobles, mitades y filtros antes de hacer cuentas largas.', 'Confirmar la ruta corta elegida.', 'Mostrar el primer paso útil hacia atrás y por qué la operación elegida no acercaba al objetivo.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-02', 'NU02', 'Numérico', 'Estimación rápida', 'Correcto. Has ajustado la precisión al espacio entre las opciones.', 'DECIDE PRECISIÓN → REDONDEA/COMPATIBILIZA → ACOTA → COMPARA OPCIONES → AFINA SOLO SI HACE FALTA', 'Opciones separadas: estima. Opciones cercanas: afina. Compensa redondeos cuando sea posible.', 'Confirmar que la aproximación era suficiente.', 'Indicar si hubo exceso de cálculo, redondeo sesgado o falta de ajuste final.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-03', 'NU03', 'Numérico', 'Caza la serie', 'Correcto. La regla elegida explica la serie completa, no solo un salto.', 'DIFERENCIAS → RAZONES → ALTERNANCIAS → COMBINACIONES → ESPECIALES → VERIFICA TODA LA SERIE', 'Empieza por la explicación más barata; si una regla falla, abandónala.', 'Confirmar la familia de patrón y el siguiente término.', 'Mostrar el salto que invalida la hipótesis elegida y la regla que sí explica todos los términos.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-01', 'PE01', 'Perceptivo', 'Radar', 'Correcto. Has mantenido un barrido estable sin saltar ni duplicar posiciones.', 'DEFINE RASGO → FIJA TRAYECTORIA → BLOQUES PEQUEÑOS → BARRIDO COMPLETO → RESPONDE', 'Misma ruta y mismo criterio hasta terminar; velocidad sin orden produce huecos.', 'Confirmar que el barrido fue completo.', 'Señalar si hubo salto, retroceso o cambio de criterio y repetir con una trayectoria fija.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-02', 'PE02', 'Perceptivo', 'El infiltrado', 'Correcto. Has encontrado la regla de la mayoría y confirmado el candidato con un segundo rasgo.', 'MAYORÍA → ATRIBUTO CLAVE → CANDIDATO → SEGUNDO CHEQUEO → RESPONDE', 'No elijas lo más llamativo; la mayoría orienta y el atributo decide.', 'Confirmar la regla común y la excepción.', 'Explicar qué atributo compartía la mayoría y por qué la opción elegida no era la excepción real.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-03', 'PE03', 'Perceptivo', 'Comparación flash', 'Correcto. Has alineado las cadenas y detenido la búsqueda en la primera diferencia segura.', 'LONGITUD → BLOQUES → ÍNDICES ALINEADOS → COMPARA → PRIMERA DIFERENCIA → DETENTE', 'No desplaces mentalmente una cadena; compara siempre posiciones homólogas.', 'Confirmar posición/bloque de la primera diferencia.', 'Mostrar dónde se produjo el desplazamiento o desalineación y rehacer solo desde el último índice seguro.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-01', 'VB01', 'Verbal', 'Intruso semántico', 'Correcto. Has construido una categoría precisa antes de buscar el intruso.', 'MAYORÍA → CATEGORÍA → AJUSTA NIVEL SEMÁNTICO → REVISA POLISEMIA → LOCALIZA INTRUSO', 'No busques la palabra más rara; busca la que queda fuera de la categoría que une a la mayoría.', 'Confirmar la categoría y el intruso.', 'Explicar si la categoría elegida era demasiado amplia/estrecha o si se tomó un sentido semántico inadecuado.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-02', 'VB02', 'Verbal', 'Parejas relámpago', 'Correcto. Has identificado la relación semántica antes de mirar las opciones.', 'IDENTIFICA SIN/ANT → PRODUCE RESPUESTA PROPIA → FILTRA CAMPO → INTENSIDAD → CONTEXTO', 'Un prefijo no garantiza antonimia; palabras relacionadas no son necesariamente sinónimas.', 'Confirmar relación y matiz semántico.', 'Indicar si falló campo, intensidad, contexto o tipo de relación y mostrar la pareja más precisa.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-03', 'VB03', 'Verbal', 'Analogía táctica', 'Correcto. Has conservado la misma frase puente y la misma dirección.', 'VERBALIZA A→B → NOMBRA RELACIÓN → APLICA A C → PRUEBA SUSTITUCIÓN → ELIGE D', 'Si tienes que cambiar la frase para que una opción encaje, la analogía no se conserva.', 'Confirmar la frase puente.', 'Mostrar qué relación/dirección se rompió y reconstruir la frase que debe repetirse.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-01', 'AB01', 'Abstracto', 'Regla oculta', 'Correcto. Has separado atributos y encontrado qué cambia y qué permanece.', 'ESCANEA ATRIBUTOS → SEPARA CAMBIOS/ESTABLES → PROPÓN REGLA → COMPRUEBA TODAS LAS TRANSICIONES', 'Cantidad, posición, orientación, tamaño, relleno y forma se revisan por separado.', 'Confirmar los atributos relevantes.', 'Indicar qué atributo se ignoró o mezcló y mostrar la regla mínima que explica toda la secuencia.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-02', 'AB04', 'Abstracto', 'Matriz incompleta', 'Correcto. La opción satisface simultáneamente la regla de fila y la de columna.', 'CUENTA → ANALIZA FILA → ANALIZA COLUMNA → INTERSECTA REQUISITOS → VERIFICA', 'No mezcles media fila con media columna; usa dos filtros separados.', 'Confirmar los dos filtros.', 'Mostrar cuál de las dos direcciones incumplía la opción y reconstruir el requisito faltante.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-03', 'AB05', 'Abstracto', 'Cazador de hipótesis', 'Correcto. Has intentado falsar la hipótesis antes de aceptarla.', 'HIPÓTESIS SIMPLE → PRUEBA TRANSICIÓN DIFÍCIL → CRUZA FILA/COLUMNA → DESCARTA SI FALLA → PREDICE', 'Una coincidencia local no basta; la regla debe sobrevivir en todo el tablero.', 'Confirmar dónde se verificó la hipótesis.', 'Señalar el punto que destruye la hipótesis elegida y proponer una alternativa más fuerte.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-01', 'ES01', 'Espacial', 'Giro mental', 'Correcto. Has seguido una referencia distintiva durante el giro.', 'ELIGE ANCLA MÓVIL → IDENTIFICA 1/2/3 CUARTOS → GIRA → FIJA ESTADO → COMPARA RELACIONES', 'El ancla se mueve con la figura; reduce giros a cuartos de vuelta.', 'Confirmar posición final del ancla.', 'Indicar si se fijó el ancla a la pantalla, se invirtió como espejo o se perdió el número de cuartos.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-02', 'ES02', 'Espacial', 'Espejo o giro', 'Correcto. Has comprobado la lateralidad interna del objeto.', 'BUSCA PARTE ASIMÉTRICA → FIJA RELACIÓN IZQ/DER → COMPARA → GIRO CONSERVA MANO / ESPEJO LA INVIERTE', 'Si cambia la mano del objeto, es espejo; un giro conserva las relaciones internas.', 'Confirmar la relación interna usada.', 'Explicar qué relación izquierda-derecha se invirtió o se conservó y descartar la transformación incorrecta.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-03', 'ES03', 'Espacial', 'Cierra el cubo', 'Correcto. Has usado relaciones invariantes antes de intentar plegar todo el cubo.', 'LOCALIZA CARA CENTRAL → VECINAS → OPUESTAS → ORIENTACIÓN DE ARISTAS → DESCARTA CONTRADICCIONES → PLIEGA SI HACE FALTA', 'Caras opuestas nunca comparten arista; elimina imposibles antes de visualizar el cubo completo.', 'Confirmar pareja opuesta/adyacente usada.', 'Mostrar la contradicción: cara opuesta colocada como vecina, orientación de arista incorrecta o pareja opuesta mal deducida.', 'AUDITADO_CORREGIDO', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25')
on conflict (micro_id) do update set
  motor_code = excluded.motor_code,
  factor_name = excluded.factor_name,
  game_name = excluded.game_name,
  success_feedback = excluded.success_feedback,
  correct_sequence = excluded.correct_sequence,
  main_tip = excluded.main_tip,
  action_after_success = excluded.action_after_success,
  action_after_error = excluded.action_after_error,
  audit_status = excluded.audit_status,
  source_version = excluded.source_version,
  active = true,
  updated_at = now();

insert into public.trop_laminas
(lamina_id, factor_name, title, priority, status, format, source_version)
values
('LAM-001', 'Mecánico', 'Paridad y tipo de transmisión', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-002', 'Mecánico', 'Sentido ≠ velocidad', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-003', 'Mecánico', 'Momento de palanca en una mirada', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-004', 'Mecánico', 'Poleas: tramos que sostienen y precio en recorrido', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-005', 'Mecánico', 'Mapa causal mecánico', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-006', 'Memoria', 'Codificación eficiente', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-007', 'Memoria', 'Comparar sin reconstruir dos escenas', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-008', 'Memoria', 'Reloj mental y relaciones locales', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-009', 'Numérico', 'Caja de herramientas para llegar al objetivo', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-010', 'Numérico', 'Estimación en cinco movimientos', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-011', 'Numérico', 'Árbol de búsqueda de series', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-012', 'Numérico', 'Verifica antes de responder', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-013', 'Perceptivo', 'Barrido que no pierde posición', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-014', 'Perceptivo', 'Mayoría → atributo → segundo chequeo', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-015', 'Perceptivo', 'Longitud, bloques e índice bloqueado', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-016', 'Verbal', 'Construye la categoría antes del intruso', 'C', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-017', 'Verbal', 'SIN / ANT y eje semántico', 'C', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-018', 'Verbal', 'Frase puente y dirección', 'C', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-019', 'Abstracto', 'Escáner de atributos', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-020', 'Abstracto', 'Dos direcciones, dos filtros', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-021', 'Abstracto', 'Hipótesis que intenta sobrevivir', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-022', 'Espacial', 'Ancla y giros por cuartos', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-023', 'Espacial', 'La «mano» del objeto', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-024', 'Espacial', 'Relaciones invariantes del cubo', 'A', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production'),
('LAM-025', 'Espacial', 'Transformaciones encadenadas sin pistas', 'B', 'CONSERVADA_AUDITADA', '16:9 · 1920×1080 recomendado', 'INVENTARIO_25_LAMINAS_MICROTEMARIOS_BASE12-production')
on conflict (lamina_id) do update set
  factor_name = excluded.factor_name,
  title = excluded.title,
  priority = excluded.priority,
  status = excluded.status,
  format = excluded.format,
  source_version = excluded.source_version,
  active = true,
  updated_at = now();

insert into public.trop_microtemario_laminas (micro_id, lamina_id)
values
('MEC-01', 'LAM-001'),
('MEC-01', 'LAM-002'),
('MEC-02', 'LAM-003'),
('MEC-03', 'LAM-004'),
('MEC-03', 'LAM-005'),
('MEM-01', 'LAM-006'),
('MEM-02', 'LAM-007'),
('MEM-03', 'LAM-008'),
('NUM-01', 'LAM-009'),
('NUM-02', 'LAM-010'),
('NUM-03', 'LAM-011'),
('NUM-03', 'LAM-012'),
('PER-01', 'LAM-013'),
('PER-02', 'LAM-014'),
('PER-03', 'LAM-015'),
('VER-01', 'LAM-016'),
('VER-02', 'LAM-017'),
('VER-03', 'LAM-018'),
('ABS-01', 'LAM-019'),
('ABS-02', 'LAM-020'),
('ABS-03', 'LAM-021'),
('ESP-01', 'LAM-022'),
('ESP-02', 'LAM-023'),
('ESP-03', 'LAM-024'),
('ESP-01', 'LAM-025'),
('ESP-02', 'LAM-025'),
('ESP-03', 'LAM-025')
on conflict (micro_id, lamina_id) do nothing;

insert into public.trop_error_patterns
(micro_id, error_code, error_type, detection_rule, failure_feedback, correction_sequence, resource_codes, source_version)
values
('MEC-01', 'E1', 'Paridad mal aplicada', 'Cuenta correa o eje como rueda, o usa paridad simple en un tren mixto.', 'Incorrecto. Has aplicado la paridad a elementos que no son engranajes exteriores de una cadena simple. La correa y el mismo eje se tratan aparte.', 'IDENTIFICA TRANSMISIÓN → aplica par/impar solo a la cadena simple → integra correas/ejes por su regla.', '["LAM-001", "LAM-002"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-01', 'E2', 'Sentido y velocidad mezclados', 'Elige una opción por el tamaño de la rueda aunque el sentido sea incorrecto.', 'Incorrecto. El tamaño determina velocidad, no la inversión del sentido. Primero resuelve el giro; después la velocidad.', 'SENTIDO PRIMERO → VELOCIDAD DESPUÉS.', '["LAM-001", "LAM-002"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-01', 'E3', 'Inversión omitida', 'Pierde un contacto o no invierte entre dos engranajes exteriores.', 'Incorrecto. Entre dos engranajes exteriores en contacto el sentido se invierte.', 'RECORRE CONTACTO A CONTACTO y comprueba la última rueda.', '["LAM-001", "LAM-002"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-02', 'E1', 'Solo mira la fuerza', 'Escoge el peso mayor sin considerar la distancia.', 'Incorrecto. Una fuerza menor puede ganar si actúa a mayor distancia del fulcro.', 'COMPARA F × BRAZO en ambos lados.', '["LAM-003"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-02', 'E2', 'Brazo medido desde punto incorrecto', 'Usa distancia entre pesos o longitud total.', 'Incorrecto. El brazo se mide desde el fulcro hasta la línea de acción de la fuerza.', 'FULCRO → DISTANCIA DE CADA FUERZA.', '["LAM-003"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-02', 'E3', 'Sentido de caída invertido', 'Calcula bien momentos pero elige el lado contrario.', 'Incorrecto. El lado con mayor momento es el que tiende a bajar.', 'MAYOR MOMENTO → ESE LADO BAJA.', '["LAM-003"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-03', 'E1', 'Cuenta tramo que no sostiene carga', 'Incluye extremo libre o tramo que solo redirige.', 'Incorrecto. Cuenta solo los tramos que tiran directamente del bloque móvil o la carga.', 'PARTE DE LA CARGA → identifica cada tramo sustentador.', '["LAM-004", "LAM-005"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-03', 'E2', 'Polea fija como multiplicadora', 'Supone ventaja mecánica con una sola polea fija.', 'Incorrecto. Una polea fija ideal cambia la dirección de la fuerza, no su magnitud.', 'FIJA = DIRECCIÓN; MÓVIL = posible ventaja.', '["LAM-004", "LAM-005"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEC-03', 'E3', 'Salto causal', 'Va de entrada a salida sin seguir piezas intermedias.', 'Incorrecto. Has omitido una etapa de transmisión; cualquier cambio intermedio puede alterar la salida.', 'ENTRADA → PIEZA 1 → PIEZA 2 → … → SALIDA.', '["LAM-004", "LAM-005"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-01', 'E1', 'Barrido aleatorio', 'Recuerda algunos objetos pero deja huecos sistemáticos.', 'Incorrecto. El problema no es solo memoria: tu recorrido ha sido irregular.', 'RECORRIDO FIJO → AGRUPA → RECUPERA.', '["LAM-006"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-01', 'E2', 'Sobrecodificación verbal', 'Intenta describir todo y pierde detalles.', 'Incorrecto. Estás almacenando demasiadas palabras. Conserva grupos y rasgos discriminantes.', 'GRUPOS PEQUEÑOS + ETIQUETAS CORTAS.', '["LAM-006"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-01', 'E3', 'Sin ancla distintiva', 'Confunde elementos similares.', 'Incorrecto. Te faltó una referencia rara o muy discriminante para organizar la escena.', 'BUSCA ANCLA RARA → sitúa lo demás respecto a ella.', '["LAM-006"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-02', 'E1', 'Reconstrucción global', 'Cree recordar una escena completa y compara por impresión.', 'Incorrecto. Comparar impresiones globales aumenta falsos cambios.', 'MISMO RECORRIDO → POSICIÓN A POSICIÓN.', '["LAM-007"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-02', 'E2', 'Tipo de cambio confundido', 'Detecta que algo cambió pero clasifica posición como atributo o viceversa.', 'Incorrecto. El cambio existe, pero es de otra familia.', 'CLASIFICA: aparición/desaparición, posición o atributo.', '["LAM-007"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-02', 'E3', 'Saliencia', 'Elige el elemento más llamativo aunque no sea el que cambió.', 'Incorrecto. Lo llamativo no es evidencia de cambio.', 'CONFIRMA A↔B en la misma posición.', '["LAM-007"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-03', 'E1', 'Posición absoluta', 'Intenta memorizar coordenadas sin origen ni hitos.', 'Incorrecto. Una posición aislada es frágil; relaciónala con un origen o un hito.', 'ORIGEN → DIRECCIÓN → HITO.', '["LAM-008"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-03', 'E2', 'Inversión izquierda/derecha', 'Recuerda la relación pero la invierte.', 'Incorrecto. Has cambiado la dirección relativa del elemento.', 'RECUPERA desde el hito más cercano y verbaliza la relación local.', '["LAM-008"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('MEM-03', 'E3', 'Reconstruye ruta completa', 'Falla al final por carga de memoria.', 'Incorrecto. No necesitas rehacer toda la ruta.', 'PARTE DEL HITO MÁS CERCANO → reconstruye solo el tramo necesario.', '["LAM-008"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-01', 'E1', 'Operación al azar', 'Empieza por combinar números sin mirar el objetivo.', 'Incorrecto. Has trabajado hacia delante sin una meta intermedia.', 'OBJETIVO → deshaz el último paso → busca el número anterior.', '["LAM-009"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-01', 'E2', 'No usa filtros', 'Calcula opciones que ya eran imposibles por signo, paridad o tamaño.', 'Incorrecto. Podías descartar antes de calcular.', 'FILTRO RÁPIDO → solo después opera.', '["LAM-009"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-01', 'E3', 'Ruta larga', 'Llega al resultado con demasiados pasos o se bloquea.', 'Incorrecto. La ruta es válida pero poco eficiente.', 'BUSCA factores, complementos, dobles o mitades.', '["LAM-009"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-02', 'E1', 'Exactitud innecesaria', 'Hace cálculo completo con opciones muy separadas.', 'Incorrecto por estrategia: has invertido más tiempo del necesario.', 'MIDE DISTANCIA ENTRE OPCIONES → estima primero.', '["LAM-010"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-02', 'E2', 'Redondeo sesgado', 'Redondea todos los términos en la misma dirección y exagera.', 'Incorrecto. El redondeo ha empujado el resultado demasiado lejos.', 'COMPENSA o ACOTA por arriba y por abajo.', '["LAM-010"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-02', 'E3', 'No afina cuando hace falta', 'Elige entre opciones muy próximas con una estimación gruesa.', 'Incorrecto. La estimación inicial no tenía precisión suficiente.', 'ESTIMA → si quedan dos opciones cercanas, AFINA.', '["LAM-010"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-03', 'E1', 'Patrón local', 'Regla funciona en 1–2 saltos pero no en toda la serie.', 'Incorrecto. Has aceptado una coincidencia local.', 'PRUEBA LA REGLA EN TODOS LOS SALTOS.', '["LAM-011", "LAM-012"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-03', 'E2', 'Fuerza primera hipótesis', 'Introduce excepciones para mantener una regla.', 'Incorrecto. Si una regla necesita parches, abandónala.', 'FALLA → CAMBIA DE FAMILIA DE PATRÓN.', '["LAM-011", "LAM-012"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('NUM-03', 'E3', 'Alternancia oculta', 'Analiza una sola serie cuando hay posiciones pares/impares.', 'Incorrecto. Puede haber dos subseries intercaladas.', 'SEPARA POSICIONES PARES E IMPARES y vuelve a comprobar.', '["LAM-011", "LAM-012"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-01', 'E1', 'Salto de posiciones', 'Deja huecos en el recorrido.', 'Incorrecto. Has perdido posiciones durante el barrido.', 'MISMA TRAYECTORIA hasta completar la matriz.', '["LAM-013"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-01', 'E2', 'Doble conteo', 'Vuelve atrás sin motivo y cuenta elementos dos veces.', 'Incorrecto. El retroceso ha duplicado información.', 'NO RETROCEDAS salvo duda real; usa bloques.', '["LAM-013"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-01', 'E3', 'Criterio cambiante', 'Empieza buscando forma y termina fijándose en color.', 'Incorrecto. Has cambiado el rasgo objetivo durante el barrido.', 'DEFINE EL RASGO ANTES de empezar.', '["LAM-013"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-02', 'E1', 'Saliencia', 'Escoge la figura más vistosa.', 'Incorrecto. El infiltrado no es necesariamente el más llamativo.', 'MAYORÍA → ATRIBUTO → CANDIDATO.', '["LAM-014"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-02', 'E2', 'Regla demasiado amplia', 'Propone una propiedad que también cumple el candidato.', 'Incorrecto. La regla no discrimina.', 'BUSCA QUÉ COMPARTEN EXACTAMENTE TRES.', '["LAM-014"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-02', 'E3', 'Sin segundo chequeo', 'El primer candidato parece distinto pero otro atributo lo integra.', 'Incorrecto. Faltó confirmar la excepción con otro rasgo.', 'CANDIDATO → SEGUNDO CHEQUEO.', '["LAM-014"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-03', 'E1', 'Desalineación', 'Compara carácter i con i+1.', 'Incorrecto. Las cadenas se han desplazado mentalmente.', 'ALINEA ÍNDICES antes de comparar.', '["LAM-015"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-03', 'E2', 'Reinicio constante', 'Vuelve al inicio tras cada duda.', 'Incorrecto. Reiniciar aumenta carga y favorece nuevas desalineaciones.', 'MARCA MENTALMENTE el último bloque seguro.', '["LAM-015"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('PER-03', 'E3', 'No comprueba longitud', 'Busca diferencias internas cuando las cadenas ya difieren en longitud.', 'Incorrecto. La longitud era el primer filtro.', 'LONGITUD → BLOQUES → ÍNDICES.', '["LAM-015"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-01', 'E1', 'Categoría demasiado amplia', 'Elige una clase que incluye las cuatro palabras.', 'Incorrecto. La categoría elegida no discrimina al intruso.', 'AJUSTA EL NIVEL: busca la categoría más precisa que una a la mayoría.', '["LAM-016"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-01', 'E2', 'Polisemia', 'Usa un sentido de una palabra que rompe artificialmente el grupo.', 'Incorrecto. Esa palabra tiene otro sentido que encaja con la relación dominante.', 'REVISA EL SIGNIFICADO EN CONTEXTO.', '["LAM-016"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-01', 'E3', 'Palabra rara = intruso', 'Selecciona por familiaridad léxica.', 'Incorrecto. Ser menos conocida no convierte una palabra en intrusa.', 'CATEGORÍA PRIMERO → INTRUSO DESPUÉS.', '["LAM-016"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-02', 'E1', 'Relacionado ≠ sinónimo', 'Elige palabra del mismo campo pero no equivalente.', 'Incorrecto. Pertenece al mismo campo semántico, pero no significa lo mismo.', 'PRUEBA SUSTITUCIÓN EN UNA FRASE.', '["LAM-017"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-02', 'E2', 'Intensidad distinta', 'Elige un término demasiado fuerte o débil.', 'Incorrecto. La dirección semántica es correcta, pero cambia el grado.', 'COMPARA INTENSIDAD y registro.', '["LAM-017"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-02', 'E3', 'Prefijo = antónimo', 'Asume oposición solo por forma morfológica.', 'Incorrecto. La forma de la palabra no garantiza que sea el contrario exacto.', 'DEFINE EL EJE SEMÁNTICO y busca el extremo opuesto.', '["LAM-017"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-03', 'E1', 'Dirección invertida', 'Usa B→A en vez de A→B.', 'Incorrecto. Has reconocido la relación, pero en dirección inversa.', 'ESCRIBE MENTALMENTE LA FRASE A→B y repítela con C→D.', '["LAM-018"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-03', 'E2', 'Mismo campo, relación distinta', 'Escoge una palabra relacionada pero con otra función.', 'Incorrecto. La opción pertenece al mismo tema, pero no reproduce la relación.', 'NOMBRA LA RELACIÓN: parte-todo, agente-acción, objeto-función, etc.', '["LAM-018"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('VER-03', 'E3', 'Cambia frase puente', 'Necesita otra frase para justificar la segunda pareja.', 'Incorrecto. Si cambias la frase, has cambiado la analogía.', 'UNA SOLA FRASE debe servir para ambas parejas.', '["LAM-018"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-01', 'E1', 'Impresión global', 'Describe figura completa sin aislar atributos.', 'Incorrecto. La regla se oculta en atributos concretos.', 'ESCANEA cantidad, posición, orientación, tamaño, relleno y forma.', '["LAM-019"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-01', 'E2', 'Mezcla atributos', 'Une dos cambios que en realidad son independientes.', 'Incorrecto. Has combinado variables antes de comprobarlas por separado.', 'UN ATRIBUTO CADA VEZ → luego combina si hace falta.', '["LAM-019"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-01', 'E3', 'Regla casi válida', 'Acepta una regla que falla en una transición.', 'Incorrecto. Una excepción basta para invalidar la regla propuesta.', 'COMPRUEBA TODAS LAS TRANSICIONES.', '["LAM-019"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-02', 'E1', 'Regla global única', 'Fuerza la misma transformación en filas y columnas.', 'Incorrecto. Fila y columna pueden usar reglas distintas.', 'FILTRO DE FILA + FILTRO DE COLUMNA.', '["LAM-020"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-02', 'E2', 'Mezcla fila/columna', 'Toma parte de una fila y parte de otra columna como una sola secuencia.', 'Incorrecto. Has mezclado direcciones de análisis.', 'TERMINA UNA DIRECCIÓN antes de pasar a la otra.', '["LAM-020"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-02', 'E3', 'Complejidad prematura', 'Busca superposición o rotación sin revisar cantidad/posición.', 'Incorrecto. Has empezado por una regla cara.', 'CUENTA Y POSICIÓN primero; reglas complejas solo después.', '["LAM-020"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-03', 'E1', 'Primera idea', 'Acepta hipótesis sin intentar falsarla.', 'Incorrecto. Has confirmado tu primera intuición sin someterla a prueba.', 'BUSCA EL CASO MÁS DIFÍCIL y trata de romper la hipótesis.', '["LAM-021"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-03', 'E2', 'Ajuste local', 'Hipótesis solo explica una fila o columna.', 'Incorrecto. Una buena regla debe sobrevivir en las dos direcciones relevantes.', 'CRUZA FILA Y COLUMNA.', '["LAM-021"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ABS-03', 'E3', 'Opciones dirigen la regla', 'Construye una explicación a partir de una alternativa atractiva.', 'Incorrecto. La opción no debe crear la regla.', 'FORMULA Y PREDICE ANTES de mirar las opciones.', '["LAM-021"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-01', 'E1', 'Ancla fija en pantalla', 'Espera que la marca quede en el mismo lugar absoluto.', 'Incorrecto. El ancla se mueve con la figura.', 'SIGUE LA REFERENCIA dentro de la figura tras cada cuarto de vuelta.', '["LAM-022", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-01', 'E2', 'Espejo por giro', 'Invierte lateralidad durante la rotación.', 'Incorrecto. Un giro cambia orientación, no la mano del objeto.', 'GIRO POR CUARTOS → conserva relaciones internas.', '["LAM-022", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-01', 'E3', 'Número de cuartos', 'Hace 90° cuando eran 180°/270°.', 'Incorrecto. La dirección puede ser correcta, pero el número de cuartos no.', 'CONVIERTE EL ÁNGULO a 1, 2 o 3 cuartos.', '["LAM-022", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-02', 'E1', 'Mira solo arriba/abajo', 'Decide por verticalidad sin lateralidad.', 'Incorrecto. Arriba/abajo puede cambiar por un giro.', 'SIGUE una relación izquierda-derecha interna.', '["LAM-023", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-02', 'E2', 'Punto de vista variable', 'Cambia mentalmente de observador.', 'Incorrecto. Has alterado el punto de vista además del objeto.', 'MANTÉN EL MISMO OBSERVADOR y compara la mano.', '["LAM-023", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-02', 'E3', 'Referencia simétrica', 'Usa un detalle que no distingue espejo de giro.', 'Incorrecto. Esa referencia es demasiado simétrica.', 'BUSCA un gancho, abertura, marca o secuencia asimétrica.', '["LAM-023", "LAM-025"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-03', 'E1', 'Opuestas como vecinas', 'Acepta una opción donde dos caras opuestas comparten arista.', 'Incorrecto. Las caras opuestas nunca pueden tocarse por una arista.', 'DEDUCE OPUESTAS primero y descarta la opción.', '["LAM-024"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-03', 'E2', 'Parejas opuestas mal deducidas', 'Construye una pareja opuesta incorrecta desde la red.', 'Incorrecto. La relación de oposición se ha deducido mal.', 'CARA CENTRAL → cuatro vecinas → cara restante opuesta; comprueba la red.', '["LAM-024"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('ESP-03', 'E3', 'Plegado total prematuro', 'Intenta visualizar todas las caras y pierde orientación.', 'Incorrecto por estrategia: has cargado demasiada información.', 'OPUESTAS/ADYACENTES → ORIENTACIÓN → solo pliega si aún quedan candidatas.', '["LAM-024"]'::jsonb, 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25')
on conflict (micro_id, error_code) do update set
  error_type = excluded.error_type,
  detection_rule = excluded.detection_rule,
  failure_feedback = excluded.failure_feedback,
  correction_sequence = excluded.correction_sequence,
  resource_codes = excluded.resource_codes,
  source_version = excluded.source_version,
  updated_at = now();

insert into public.trop_feedback_rules
(code, state_name, trigger_rule, ui_template, system_action, source_version)
values
('OK_1', 'Acierto normal', 'Respuesta correcta, sin patrón de error activo', 'Correcto. {justificación_breve} Secuencia: {secuencia}.', '1 frase de confirmación + secuencia; no abrir lámina automáticamente.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('OK_MASTERED', 'Acierto con dominio', '3 aciertos consecutivos del mismo tipo sin ayuda', 'Correcto. Secuencia: {secuencia}.', 'Reducir explicación para no sobrecargar; mantener solo la secuencia.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('WRONG_TYPED', 'Error diagnosticable', 'La opción elegida corresponde a un distractor etiquetado', 'Incorrecto. {diagnóstico}. Secuencia correcta: {secuencia}.', 'Mostrar diagnóstico específico + secuencia + truco; registrar código de error.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('WRONG_UNKNOWN', 'Error no diagnosticable', 'La opción no está asociada a un error semántico concreto', 'Incorrecto. La opción no cumple {regla_clave}. Secuencia correcta: {secuencia}.', 'No inventar causa; explicar solo por qué no encaja y mostrar el procedimiento.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('REPEAT_ERROR', 'Error recurrente', 'Mismo código de error aparece 2 veces en las últimas 5 preguntas de esa familia', 'Patrón de error detectado: {tipo_error}. Repasa {truco}.', 'Mostrar lámina vinculada y recomendar 2–3 ejercicios de nivel inferior o guiado.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('RECOVERY', 'Recuperación', 'Tras REPEAT_ERROR, 3 aciertos consecutivos del mismo tipo', 'Procedimiento recuperado. Mantén esta secuencia: {secuencia}.', 'Retirar ayuda automática y volver al nivel de dificultad previsto.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('TIME_PASS', 'Decisión de pasar', 'El alumno pasa por tiempo antes de responder', 'Has decidido pasar. No se registra como error conceptual. Si vuelve a repetirse, revisaremos la gestión de tiempo.', 'Registrar tiempo/abandono por separado; no asociar distractor ni lámina salvo patrón recurrente.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('TIME_OVER', 'Tiempo excesivo', 'Acierta pero supera de forma reiterada el umbral del nivel', 'Correcto, pero el procedimiento aún consume demasiado tiempo. Secuencia corta: {secuencia}.', 'Marcar necesidad de automatización; no bajar conocimiento, sí entrenar fluidez.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25'),
('HINT_USED', 'Acierto con ayuda', 'Respuesta correcta después de pista/lámina', 'Correcto con ayuda. La secuencia que debes automatizar es: {secuencia}.', 'No contar como dominio pleno; mantener práctica guiada hasta aciertos sin ayuda.', 'BASE12_TROP_RETROALIMENTACION_TESTS_MASTER-2026-08-25')
on conflict (code) do update set
  state_name = excluded.state_name,
  trigger_rule = excluded.trigger_rule,
  ui_template = excluded.ui_template,
  system_action = excluded.system_action,
  source_version = excluded.source_version,
  updated_at = now();


alter table public.trop_workshops enable row level security;
alter table public.trop_microtemarios enable row level security;
alter table public.trop_laminas enable row level security;
alter table public.trop_microtemario_laminas enable row level security;
alter table public.trop_error_patterns enable row level security;
alter table public.trop_feedback_rules enable row level security;

-- Por seguridad, la fase 6 queda inicialmente solo de servidor.
-- Las rutas API posteriores expondrán únicamente los campos necesarios al alumno.
revoke all on table public.trop_workshops from anon, authenticated;
revoke all on table public.trop_microtemarios from anon, authenticated;
revoke all on table public.trop_laminas from anon, authenticated;
revoke all on table public.trop_microtemario_laminas from anon, authenticated;
revoke all on table public.trop_error_patterns from anon, authenticated;
revoke all on table public.trop_feedback_rules from anon, authenticated;

grant all on table public.trop_workshops to service_role;
grant all on table public.trop_microtemarios to service_role;
grant all on table public.trop_laminas to service_role;
grant all on table public.trop_microtemario_laminas to service_role;
grant all on table public.trop_error_patterns to service_role;
grant all on table public.trop_feedback_rules to service_role;

comment on table public.trop_workshops is
  'Manifiesto de 147 talleres. Distingue cobertura escrita de cobertura del banco; 88 familias quedan review_required hasta comprobación contra V4.';
comment on table public.trop_microtemarios is
  '21 microtemarios auditados vinculados uno a uno a los 21 motores interactivos.';
comment on table public.trop_laminas is
  '25 láminas maestras conservadas; metadatos de consulta y retroalimentación.';
comment on table public.trop_error_patterns is
  '63 patrones pedagógicos de error (3 por microtemario/motor). Solo servidor.';
comment on table public.trop_feedback_rules is
  '9 estados globales del ciclo de feedback y recuperación. Solo servidor.';
