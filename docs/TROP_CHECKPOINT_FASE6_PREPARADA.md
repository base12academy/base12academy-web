# TROP · Checkpoint · Fase 6 preparada

## Estado

- Producción: no modificada
- Vercel: no modificado
- Supabase: no modificado
- Redsys: no modificado
- Productos TROP: siguen inactivos
- Banco V4: no cargado

## Preparado

- Manifiesto 147 talleres.
- 88 talleres/familias marcados `review_required`.
- 21 microtemarios vinculados a los 21 motores.
- 25 láminas y 27 relaciones microtemario–lámina.
- 63 patrones de error.
- 9 reglas de feedback/recuperación.
- Manifiesto operativo de 20 formas.
- Migración pedagógica + rollback.
- Migración de integridad + rollback.
- QA preflight y QA posterior a staging.
- Importador V4 endurecido y comprobado sintácticamente.

## Pendiente antes de staging

1. Copiar paquete a la rama `tropa-integracion-v4`.
2. Ejecutar `python scripts/trop/import_v4.py --source "<carpeta V4>"` SIN `--apply`.
3. Resolver cualquier bloqueo de cruce banco/auditoría.
4. Crear/usar un entorno Supabase de prueba.
5. Aplicar core + hardening + recursos pedagógicos en staging.
6. Ejecutar carga V4 con `--apply` solo en staging.
7. Ejecutar `supabase/qa/20260829_tropa_verify_after_staging.sql`.
8. Auditar conteos de las 88 familias.
9. Solo después implementar ciclo de pregunta/respuesta/feedback.
10. Mantener producción y pagos cerrados hasta QA funcional final.
