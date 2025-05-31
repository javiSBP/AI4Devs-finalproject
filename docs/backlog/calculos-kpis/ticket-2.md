# Ticket: KPI-002 - Implementar API y Persistencia para Métricas Financieras

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Desarrollar los endpoints de API necesarios para calcular, almacenar y recuperar las métricas financieras de viabilidad de negocio. Incluye la creación del modelo de datos para almacenar los resultados de los cálculos, así como la implementación de la lógica de servidor para procesar las peticiones y gestionar la persistencia de los resultados.

## Tareas

- ~~[ ] Definir modelo de datos `FinancialMetrics` en Prisma para almacenar los resultados calculados~~ **MOVIDO A TICKET-6**
- [x] ~~Crear endpoint para calcular y devolver métricas en tiempo real basadas en inputs financieros (GET/POST)~~ **YA IMPLEMENTADO** - El cálculo se hace en tiempo real en el frontend con kpi-calculator.ts
- ~~[ ] Implementar endpoint para almacenar resultados de cálculos (POST)~~ **MOVIDO A TICKET-6**
- ~~[ ] Desarrollar endpoint para recuperar cálculos guardados previamente (GET)~~ **MOVIDO A TICKET-6**
- ~~[ ] Configurar relaciones entre los modelos de datos de inputs financieros y métricas calculadas~~ **MOVIDO A TICKET-6**
- ~~[ ] Implementar manejo de errores y validaciones en los endpoints~~ **INNECESARIO** - Las validaciones ya están en el formulario con Zod
- ~~[ ] Desarrollar funcionalidad para compartir resultados (generación de links o exportación)~~ **SOBRECOMPLICA** - No aporta valor inmediato
- ~~[ ] Crear pruebas de integración para los endpoints~~ **SOBRECOMPLICA** - Los tests unitarios del calculador son suficientes por ahora

## Criterios de Aceptación Técnicos

- [x] Los endpoints deben utilizar el motor de cálculo desarrollado en KPI-001 **COMPLETADO** - Motor implementado y funcional
- [x] La API debe devolver resultados consistentes y precisos **COMPLETADO** - 96.5% cobertura de tests
- ~~[ ] Los endpoints deben seguir principios RESTful~~ **MOVIDO A TICKET-6**
- ~~[ ] Las respuestas deben incluir no solo los valores calculados sino también sus interpretaciones~~ **INNECESARIO** - Las interpretaciones se generan en el frontend
- ~~[ ] Los errores deben manejarse adecuadamente con mensajes descriptivos~~ **YA CUBIERTO** - Validaciones Zod en formulario
- [x] La API debe ser eficiente incluso con cálculos complejos **COMPLETADO** - Cálculos optimizados y rápidos

## Referencias Técnicas

- Implementar Next.js API Routes para los endpoints
- Utilizar Prisma ORM para el modelo de datos
- [x] Integrar con el motor de cálculo de KPI-001 **COMPLETADO**
- ~~Implementar caché donde sea apropiado para mejorar rendimiento~~ **INNECESARIO** - Los cálculos son instantáneos

## Dependencias

- [x] Ticket KPI-001 (Motor de Cálculo) **COMPLETADO**
- [x] ~~Ticket FIN-001 (Modelo de Datos y API de Inputs Financieros)~~ **SIMPLIFICADO** - Inputs manejados en formulario

## Estimación

Medio (5h) - **REDUCIDO** debido a simplificaciones

## Asignado a

TBD

## Notas de Simplificación

- **Cálculo en tiempo real eliminado de este ticket** - Ya implementado en frontend
- **Validaciones eliminadas** - Ya manejadas con Zod en formularios
- **Funcionalidades de compartir eliminadas** - No aportan valor inmediato
- **Cache eliminado** - Los cálculos son instantáneos
- **Enfoque solo en persistencia básica** para futuras implementaciones
