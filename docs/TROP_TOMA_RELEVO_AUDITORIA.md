# TROP · Toma de relevo y auditoría técnica

Fecha: 2026-08-29
Base de trabajo recibida: checkpoint de Work/Codex `tropa-integracion-v4`
Estado de producción: **sin cambios**

## 1. Qué se ha conservado

No se ha alterado la interfaz ya preparada por Work ni se ha activado ningún producto, pago, matrícula, Vercel o Supabase.

Se conserva como base:

- esquema TROP de 7 aptitudes, 21 motores, familias y preguntas V4;
- importador V4 en modo lectura por defecto;
- aula `/dashboard/tropa-y-marineria`;
- acceso acumulativo Esencial / Operativa / Integral;
- productos todavía inactivos.

## 2. Fase 6 preparada

Se ha convertido en datos versionados el material pedagógico disponible:

- 147 talleres;
- 23 con recurso existente;
- 88 con ficha auxiliar y banco pendiente de comprobación;
- 36 transversales/especiales;
- 21 microtemarios auditados;
- 25 láminas maestras;
- 63 patrones de error (3 por microtemario);
- 9 reglas globales de feedback/recuperación;
- manifiesto de las 20 formas de simulación/operación del Punto 3.

Archivos:

- `data/trop/workshops_manifest_v1.json`
- `data/trop/pedagogy_manifest_v1.json`
- `data/trop/operations_manifest_v1.json`
- `supabase/migrations/20260829_tropa_pedagogy_resources.sql`
- rollback correspondiente.

### Decisión conservadora

La matriz de Punto 6 identifica 23 talleres como respaldados directamente, pero no asigna en todos ellos un ID exacto de microtemario/lámina. No se han inventado relaciones. La fase 6 guarda la cobertura documental y las relaciones que sí están explícitas (microtemario ↔ motor ↔ lámina).

## 3. Endurecimiento del importador V4

El importador original era prudente, pero había cuatro controles que convenía reforzar antes de cualquier `--apply`:

1. verificar que los 4.000 registros del CSV de auditoría correspondan exactamente a los mismos `question_id` del banco;
2. detectar duplicados de contenido y de `stimulus` entre los siete ZIP, no solo dentro de cada ZIP;
3. exigir y contrastar `TROP_28000_AUDITORIA_FINAL_V4.json`;
4. registrar lotes como `validated` → `importing` → `completed` o `failed`.

La versión incluida en este paquete implementa esos controles y mantiene `dry-run` como modo predeterminado.

También comprueba la distribución A/B/C/D (1.000 respuestas correctas por letra y aptitud), coherente con la auditoría final V4.

## 4. Integridad de base de datos

Se añade, como migración separada y reversible:

`supabase/migrations/20260829_tropa_core_integrity_hardening.sql`

Impide que una pregunta pueda quedar enlazada accidentalmente a un motor o familia de otra aptitud.

No se aplica automáticamente.

## 5. QA preparado para staging

`supabase/qa/20260829_tropa_verify_after_staging.sql` comprueba:

- 7 aptitudes;
- 21 motores;
- 108 familias activas;
- 28.000 preguntas;
- 4.000 por aptitud;
- 5.600 por cada nivel N1–N5;
- 14.000 / 7.000 / 7.000 por `access_min`;
- 7 / 14 / 21 motores por paquete;
- coherencia pregunta–motor–aptitud y pregunta–familia–aptitud;
- 28.000 firmas de contenido;
- 28.000 estímulos únicos;
- 147 talleres = 23 + 88 + 36;
- 21 microtemarios;
- 25 láminas;
- 63 patrones de error;
- 9 reglas de feedback.

Además genera una tabla con el número real de preguntas V4 de cada una de las 88 familias pendientes.

### Importante sobre las 88 familias

El QA puede demostrar que una familia tiene ejercicios y cuántos. No se fija un umbral arbitrario de “suficiencia”, porque las fuentes no establecen uno. La decisión pedagógica se tomará con los conteos reales del V4 tras la carga de prueba.

## 6. Qué NO se ha hecho

- No se ha aplicado ninguna migración.
- No se han cargado las 28.000 preguntas.
- No se ha conectado con Supabase de producción.
- No se ha desplegado en Vercel.
- No se han activado productos ni pagos.
- No se han modificado precios.
- No se han inventado URLs de vídeo.
- No se ha implementado aún la ruta de entrenamiento que entrega preguntas al alumno.

## 7. Bloqueo correcto antes del siguiente paso

Para ejecutar el `dry-run` reforzado hacen falta los siete ZIP `TROP_*_4000_DEFINITIVO_V4.zip` y el informe global V4 en el mismo directorio de origen.

Para aplicar en staging, además hacen falta las credenciales del entorno de prueba cargadas solo en memoria.

La siguiente acción segura es: **copiar estos archivos a la rama de trabajo, ejecutar el dry-run reforzado contra los V4 y, solo si pasa, preparar el staging de Supabase.**
