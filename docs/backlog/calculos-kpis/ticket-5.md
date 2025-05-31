# Ticket: KPI-005 - Mejoras Visuales y Explicaciones para Métricas Financieras

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Mejorar la experiencia de usuario añadiendo elementos visuales adicionales (iconos, mini-gráficos) y desarrollando un sistema completo de explicaciones contextuales para cada métrica financiera. El objetivo es hacer la información más accesible y comprensible para usuarios sin experiencia financiera.

## Tareas (Movidas desde Tickets 3 y 4)

### Mejoras Visuales (desde Ticket-3)

- [ ] Crear más iconos y mini-gráficos para representar cada métrica **AÑADIR VALOR** - Mejoraría la comprensión visual
- [ ] Añadir más tipos de gráficos para diferentes métricas **AÑADIR VALOR** - Podría mejorar comprensión (gráfico de ratios, progreso hacia break-even, etc.)
- [ ] Los componentes deben prepararse para mostrar tooltips/explicaciones **PENDIENTE** - Añadiría valor educativo

### Sistema de Explicaciones (desde Ticket-4)

- [ ] Redactar explicaciones claras y concisas para cada métrica (beneficio mensual, punto de equilibrio, LTV, etc.) **AÑADIR VALOR** - Mejoraría comprensión significativamente
- [ ] Las explicaciones deben usar lenguaje sencillo, sin jerga financiera compleja **PENDIENTE** - Crear contenido específico para métricas
- [ ] Las explicaciones deben incluir ejemplos prácticos cuando sea apropiado **PENDIENTE** - Añadir ejemplos específicos

## Criterios de Aceptación Técnicos

- Los iconos deben ser intuitivos y consistentes con el diseño actual
- Los mini-gráficos deben añadir valor real a la comprensión de la métrica
- Las explicaciones deben usar lenguaje sencillo y accesible
- Los tooltips deben integrarse perfectamente con EnhancedInfoTooltip existente
- Todos los elementos deben ser responsive y accesibles

## Referencias Técnicas

- Utilizar EnhancedInfoTooltip existente como base para las explicaciones
- Seguir el patrón de financial-inputs-help.ts para estructurar el contenido
- Usar Recharts para gráficos adicionales manteniendo consistencia
- Implementar iconos con Lucide React o similar
- Mantener paleta de colores del sistema de salud existente

## Dependencias

- ✅ Ticket KPI-001 (Motor de Cálculo) **COMPLETADO**
- ✅ ResultsDisplay.tsx implementado y funcional
- ✅ EnhancedInfoTooltip disponible

## Estimación

Medio (4-5h)

## Asignado a

TBD

## Tareas Específicas Detalladas

### Iconos y Visuales

- [ ] **Iconos para métricas**: 💰 ingresos, 📈 LTV, 🎯 CAC, ⚖️ margen, 📊 break-even
- [ ] **Gráfico de donut**: Para ratio LTV/CAC mostrando proporción visual
- [ ] **Barra de progreso**: Para break-even showing progress towards profitability
- [ ] **Mini trend indicators**: Flechas up/down para indicar si las métricas son positivas

### Sistema de Explicaciones

- [ ] **Crear financial-metrics-help.ts**: Archivo con explicaciones para cada métrica
- [ ] **Integrar tooltips en ResultsDisplay.tsx**: Añadir EnhancedInfoTooltip a cada tarjeta
- [ ] **Ejemplos prácticos**: Casos de uso reales para cada métrica
- [ ] **Glosario básico**: Términos financieros explicados en lenguaje simple
