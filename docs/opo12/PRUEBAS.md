# Opo12 · C1.1000 · Guía del entorno de pruebas

## Alcance de esta rama

- Rama: `feature/opo12-c1-1000`.
- No se ha publicado ni conectado a producción.
- No activa cobros, renovaciones ni tareas programadas.
- La versión oficial de referencia es la convocatoria de acceso libre publicada en el BOJA núm. 191, de 1 de octubre de 2024.
- La OEP 2024 ordinaria de C1.1000 continúa pendiente de convocatoria. Cuando se publique, se creará una versión nueva sin alterar los intentos anteriores.

## Prueba de la interfaz

1. Instalar las dependencias del proyecto.
2. Ejecutar `npm run dev`.
3. Abrir `/opo12`.
4. Recorrer Inicio, Histórico, Suscripción e Incidencias.
5. Abrir **Simulacro oficial**, **Test por temas** y **Repasar errores** y comprobar que las tres modalidades figuran dentro de la misma suscripción.
6. En Test por temas, elegir 10, 20, 30 o 50 preguntas y comprobar la configuración de temas.
7. Comprobar respuesta, borrado, marcado, mapa, navegación, revisión, entrega, resultado y solucionario.
8. Repetir a 390 × 844 px y 360 × 800 px.
9. Instalar Opo12 desde el navegador y comprobar apertura independiente en móvil.

La interfaz visible usa tres preguntas ficticias y está rotulada como demostración. No usa el banco real.

## Pruebas automáticas

```text
npm run test:opo12
npm run opo12:audit
```

La primera orden comprueba formato, puntuación, reservas, mínimos por bloque, reparto temático, concurrencia y estados de impago. La segunda audita el banco heredado sin modificarlo.

## Pruebas con Supabase de pruebas

Aplicar exclusivamente la migración `20261116090000_opo12_foundation.sql` a un proyecto local o de pruebas y cargar preguntas aprobadas. No marcar la versión de examen como `ready` hasta disponer, como mínimo, de 79 preguntas teóricas y 28 prácticas validadas.

Comprobar después:

1. Dos peticiones simultáneas de inicio devuelven el mismo intento abierto.
2. Tras entregar un intento, se pueden iniciar nuevos simulacros sin límite diario.
3. Reabrir un intento devuelve el mismo intento y conserva respuestas y tiempo restante.
4. Solo puede existir un intento en curso por alumno y oposición.
   Al abandonar uno, queda registrado como `abandoned` y puede iniciarse otra modalidad.
5. La misma suscripción permite iniciar las modalidades `simulation`, `topic` y `review`; no existen permisos ni precios separados.
6. Los test temáticos solo seleccionan preguntas aprobadas de los temas solicitados.
7. El repaso solo selecciona preguntas anteriores falladas, en blanco o marcadas y nunca preguntas de reserva no evaluadas.
8. El vencimiento entrega y corrige el simulacro con las reglas guardadas en el intento.
9. Antes de entregar, ninguna respuesta correcta, explicación o referencia aparece en la respuesta de red.
10. Un pago rechazado mantiene acceso hasta el final del día cubierto; después bloquea nuevos intentos y solucionarios históricos durante diez días.
11. Un intento iniciado antes del bloqueo puede terminarse, evaluarse y mostrar su solucionario.
12. Al regularizar el pago dentro del plazo se recupera el acceso y el histórico.
13. Un acceso gratuito permite exactamente lo mismo que uno pagado y queda atribuido a quien lo concedió.

## Estado del banco

El banco contiene 2.100 preguntas, 50 por cada uno de 42 temas. La auditoría actual pone las 2.100 en cuarentena porque faltan referencia oficial, fecha de revisión, bloque de examen y dificultad. Además detecta 646 explicaciones insuficientes, 20 duplicados y 4 enunciados demasiado breves.

La selección real solo consulta preguntas con estado `approved`; prioriza inéditas, después las menos vistas y las menos recientes, y reparte por temas antes de repetirlos.
