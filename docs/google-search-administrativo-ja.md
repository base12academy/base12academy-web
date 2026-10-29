# Prueba Google Search: Administrativo Junta de Andalucía

Configuración revisada el 29/10/2026. Cuenta 905-906-4115.
Campaña 24412310309: `Search | Administrativo JA | Sin marca`.

- Estado comprobado: EN PAUSA. No habilitar hasta verificar medición y revisar fechas.
- Presupuesto total 150 EUR, no presupuesto diario ni renovación mensual.
- Fechas provisionales: 31/10/2026–28/11/2026, sujetas a la fecha de activación.
- Solo Búsqueda Google; socios, Display e IA Max desactivados.
- España, presencia física/habitual; idioma español.
- Maximizar clics con límite CPC 0,80 EUR.
- Seis palabras clave exactas/de frase orientadas al curso de Administrativo JA.
- Negativas a nivel campaña: base12, "base 12", "base doce", base12academy,
  "auxiliar administrativo", "pdf gratis", "descargar gratis", "temario gratis", "descarga gratuita".
- URL: https://www.base12academy.es/?curso=administrativo-ja#catalogo

## Medición

Etiqueta AW-18544997331. Acción Compra 7882131002.
Destino: AW-18544997331/1dPtCLqMv64dENPn-IpF.

Consentimiento básico: script bloqueado hasta aceptación; sin remarketing personalizado
ni conversiones mejoradas. Rechazo y aceptación con el mismo peso visual. Elección de
180 días, botón persistente para modificarla. Retirada elimina cookies propias _gcl_
y recarga para descargar la etiqueta. Las cookies de otros dominios las gestiona el proveedor.

La API de estado de checkout facilita referencia e importe solo después de paid/linked.
La página de confirmación envía la conversión desde esa respuesta, nunca solo por
visitar /pago-ok o pulsar Comprar. Referencia única para deduplicar en Google; protección
adicional contra repeticiones en la misma sesión de página. No se transmiten parámetros
ni fragmentos de URL (pueden contener tokens). El callback firmado de Redsys no cambia.

Verificación automática: `npm run test:ads`, `npx tsc --noEmit`, `npm run test:text`.
Pendiente antes de activar: verificar la etiqueta instalada y comprobar con una operación
controlada que Google recibe importe y referencia correctos sin duplicar. No se ha hecho
ningún pago de prueba ni enviado una conversión ficticia desde esta implementación.

Referencias:
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://support.google.com/google-ads/answer/6386790
- https://business.safety.google/adscookies/
