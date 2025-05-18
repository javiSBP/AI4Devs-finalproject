# Ticket: LEAN-002 - Crear Componentes UI para Lean Canvas Simplificado

## Historia de Usuario Relacionada

Completar Lean Canvas Simplificado (@docs/backlog/lean-canvas-simplificado/historia-usuario.md)

## Descripción

Desarrollar los componentes React para el formulario del Lean Canvas simplificado con los 5 campos clave (Problema, Propuesta de Valor, Segmento de Clientes, Canales, y Estructura de ingresos/costes). Estos componentes deben ser intuitivos, seguir un diseño minimalista y prepararse para las ayudas contextuales.

## Tareas

- [ ] Crear componente contenedor `LeanCanvasForm` con estructura base
- [ ] Desarrollar componentes para cada uno de los 5 campos del Lean Canvas
- [ ] Crear indicador visual de progreso para mostrar la posición en el flujo
- [ ] Implementar validación básica de entrada para límite de 300 caracteres por campo
- [ ] Desarrollar navegación intuitiva entre campos (botones anterior/siguiente)
- [ ] Diseñar UI responsive siguiendo principios de TailwindCSS
- [ ] Preparar la estructura para tooltips/ayudas contextuales (implementación en ticket posterior)

## Criterios de Aceptación Técnicos

- Los componentes deben ser completamente responsive
- La interfaz debe seguir un diseño minimalista y amigable
- El formulario debe prepararse para mantener estado local básico
- El indicador de progreso debe mostrar claramente en qué parte del proceso está el usuario
- Los componentes deben permitir integración posterior con gestión de estado y API

## Referencias Técnicas

- Seguir patrones de componentes React con TypeScript
- Implementar estilos usando TailwindCSS
- Preparar estructura para React Hook Form (implementación completa en ticket posterior)

## Dependencias

- Configuración inicial del proyecto Next.js
- Configuración de TailwindCSS
- Ticket LEAN-001 (API y Backend) para comprender la estructura de datos

## Estimación

Medio (6h)

## Asignado a

TBD
