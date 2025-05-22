# Historia de Usuario: Gestionar Historial de Simulaciones

**Como** usuario recurrente,
**quiero** poder guardar y acceder a mis simulaciones anteriores,
**para** comparar diferentes escenarios y ver la evolución de mi modelo de negocio.

## Descripción

Como usuario que utiliza la herramienta de forma recurrente, necesito poder guardar las simulaciones que realizo para consultarlas posteriormente. Quiero poder nombrar cada simulación, ver un listado de todas las que he creado, acceder a sus detalles completos y poder compararlas de forma visual. No quiero tener que ingresar todos los datos nuevamente cada vez que quiero hacer una consulta o ajuste a un modelo existente.

## Criterios de Aceptación

- El sistema debe permitir guardar cada simulación con un nombre personalizado
- Debe existir una página o sección de "Historial" que muestre un listado de todas las simulaciones guardadas
- Cada entrada del historial debe mostrar información resumida (fecha, nombre, principales KPIs)
- El usuario debe poder abrir cualquier simulación anterior para ver todos sus detalles
- Debe ser posible duplicar una simulación existente para crear variaciones
- Las simulaciones deben persistir entre sesiones (guardado local o en base de datos)
- Debe haber una opción para eliminar simulaciones que ya no se necesiten

## Notas Adicionales

- Para el MVP, el almacenamiento puede ser local (localStorage) sin necesidad de registro de usuario
- Considerar agregar etiquetas o categorías para organizar mejor múltiples simulaciones
- Implementar una vista en forma de tarjetas o lista, con opción de ordenar por diferentes criterios (fecha, nombre, etc.)
- Para una versión futura, se podría implementar la comparación directa entre dos simulaciones
- Si se implementa sin login, considerar generar un ID único para cada dispositivo/navegador

## Historias de Usuario Relacionadas

- Ingresar Datos Financieros Básicos
- Visualizar Métricas de Viabilidad
