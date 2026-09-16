# Instrucciones de integración local (sin producción)

Este paquete está pensado para copiarse encima de la copia de trabajo:

`...\work\base12academy-tropa`

No debe copiarse sobre la rama/despliegue limpio de producción.

## Archivos que sustituyen/añaden

- `scripts/trop/import_v4.py` sustituye al importador anterior.
- `data/trop/*` añade manifiestos.
- `supabase/migrations/20260829_tropa_core_integrity_hardening.sql`
- `supabase/migrations/20260829_tropa_pedagogy_resources.sql`
- `supabase/rollback/*`
- `supabase/qa/*`
- `docs/*`

## Primer test permitido

Desde la copia de trabajo:

```powershell
python -m py_compile scripts\trop\import_v4.py
python scripts\trop\import_v4.py --source "D:\Escritorio\Agente IA\Tropa y Marinería"
```

El segundo comando es solo lectura porque no contiene `--apply`.

Debe localizar:

- los 7 `TROP_*_4000_DEFINITIVO_V4.zip`;
- `TROP_28000_AUDITORIA_FINAL_V4.json`.

Si el dry-run falla, no ejecutar ninguna migración ni `--apply`.

## Orden previsto en STAGING, no en producción

1. `20260829_tropa_core.sql`
2. `20260829_tropa_core_integrity_hardening.sql`
3. `20260829_tropa_pedagogy_resources.sql`
4. preflight SQL
5. importador con `--apply` apuntando al Supabase de prueba
6. QA posterior

La carga del banco no es transaccional a través de REST. Por eso el primer `--apply` debe hacerse en un entorno de prueba reversible, nunca directamente en producción.
