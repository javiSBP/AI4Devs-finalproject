# Ticket: HIST-001 - Implementar Modelo de Datos y API para Historial de Simulaciones

## Historia de Usuario Relacionada

Gestionar Historial de Simulaciones (@docs/backlog/historial-simulaciones/historia-usuario.md)

## Descripción

Desarrollar el modelo de datos y los endpoints de API necesarios para almacenar, recuperar y gestionar el historial de simulaciones financieras del usuario. Implementar la estructura para guardar simulaciones completas con nombre personalizado, fecha y permitir su recuperación posterior.

## Tareas

- [ ] Definir modelo de datos `Simulation` en Prisma con relaciones a inputs financieros y métricas calculadas
- [ ] Implementar campos para metadatos de la simulación (nombre, fecha, etiquetas, descripción)
- [ ] Crear endpoint para guardar una simulación completa (POST)
- [ ] Desarrollar endpoint para listar todas las simulaciones guardadas (GET)
- [ ] Implementar endpoint para recuperar una simulación específica por ID (GET)
- [ ] Crear endpoint para eliminar una simulación (DELETE)
- [ ] Desarrollar endpoint para duplicar una simulación existente (POST)
- [ ] Implementar manejo de identificadores únicos para usuarios sin login (localStorage)

## Criterios de Aceptación Técnicos

- El modelo de datos debe capturar todos los inputs financieros y resultados calculados
- Las simulaciones deben persistir incluso sin sistema de login (usando identificador único local)
- Los endpoints deben seguir principios RESTful
- La API debe soportar filtrado y ordenación del listado de simulaciones
- El sistema debe manejar correctamente grandes cantidades de simulaciones
- La duplicación de simulaciones debe crear una copia exacta con nombre modificado (ej. "Original - Copy")

## Referencias Técnicas

- Implementar Next.js API Routes para los endpoints
- Utilizar Prisma ORM para el modelo de datos
- Implementar manejo de ID único para usuario anónimo con crypto API del navegador
- Utilizar localStorage o indexedDB para persistencia local si es necesario

## Dependencias

- Ticket FIN-001 (Modelo de Datos de Inputs Financieros)
- Ticket KPI-001 (Motor de Cálculo)
- Ticket KPI-002 (API de Métricas)

## Estimación

Medio (6h)

## Asignado a

TBD
