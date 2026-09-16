# Tabla Periódica Interactiva

Producto independiente en `/apps/tabla-periodica`.

La portada la muestra al final de **Servicios Base12**, debajo de las demás aplicaciones. El catálogo de Bachillerato y PAU la presenta junto a las modalidades de Química e indica que está incluida gratuitamente solo en Esencial y Estándar; la modalidad PAU no concede este acceso.

## Acceso

La API `/api/apps/tabla-periodica/access` consulta exclusivamente `course_enrollments`:

- Incluido: curso `quimica` o `quimica-bachillerato-pau`, plan activo `esencial`, `estandar` o el alias histórico `standard`.
- Licencia independiente: curso `tabla-periodica`, plan activo `licencia`.
- Cualquier otro caso: compra requerida.

No existen diferencias funcionales entre el acceso incluido y la licencia. La aplicación no consulta progreso, vídeos ni contenido de curso.

## Precio y pago

La licencia cuesta **9,99 €** (`999` céntimos), es una compra única, sin suscripción ni renovación, y se registra sin fecha de caducidad. El precio canónico vive en `PERIODIC_TABLE_LICENSE_PRICE_CENTS`; tanto la página como el pedido Redsys leen ese mismo valor del catálogo para impedir discrepancias.

Redsys crea el pedido con `DS_MERCHANT_AMOUNT=999`, moneda `978`, tipo de operación `0` y notificación servidor a servidor. La notificación solo acepta una firma válida y comprueba que producto e importe coinciden con el pedido previo antes de marcarlo como pagado.

Tras vincular el pago, el alta de este producto consta solo de datos personales y la decisión de factura:

- **Sin factura:** no se crea registro en `base12_invoices`; se comunica la venta y la decisión a `BASE12_BILLING_EMAIL` (por defecto `base12academy+facturacion@gmail.com`).
- **Con factura:** se solicitan los datos fiscales, se emite la factura exenta de IVA, se envía en PDF al correo de facturación y se incluye en copia oculta a Facturación Base12.

Los envíos usan claves de idempotencia de Resend para evitar duplicados inmediatos al reintentar. La factura conserva además el identificador de entrega de Resend en `email_resend_id`.

El alta de esta licencia omite de forma explícita el vídeo general de bienvenida y redirige a `/apps/tabla-periodica`. Este producto no tiene vídeo de bienvenida, comercial ni de uso.

## Clara

`/api/apps/tabla-periodica/clara` vuelve a comprobar el derecho de acceso antes de cada consulta. Usa la Responses API con `OPENAI_PERIODIC_TABLE_MODEL` (por defecto `gpt-6-astra`), `store: false`, salida limitada y únicamente los elementos pertinentes como contexto numérico. No existen cuotas temporales ni una fecha de fin para el comprador.

Si falta `OPENAI_API_KEY` o el proveedor devuelve un error, Clara responde con el motor químico local verificado; la aplicación no queda inutilizada. El modelo no se invoca en la vista pública ni en la previsualización local.

## Datos y actualización

- `npm run chemistry:validate`: auditoría local determinista de los 118 elementos.
- `npm run chemistry:sync`: regenera `data/chemistry/elements.json` desde PubChem y aplica pesos atómicos CIAAW 2024 y nombres españoles RSEQ.

La sincronización requiere red; la aplicación no. Las ausencias de datos se conservan como `null` y se presentan como “Sin dato”. Los números másicos de elementos sin peso atómico estándar aparecen entre corchetes.
