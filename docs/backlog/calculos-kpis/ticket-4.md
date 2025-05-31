# Ticket: KPI-004 - Desarrollar Sistema de Explicaciones y Ayudas Contextuales para Métricas

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Implementar un sistema de explicaciones y ayudas contextuales para cada métrica financiera, que permita a los usuarios sin experiencia en finanzas entender el significado e importancia de cada indicador. Desarrollar el contenido explicativo en lenguaje sencillo y los componentes necesarios para mostrar esta información de manera accesible.

## Tareas

- ~~[ ] Redactar explicaciones claras y concisas para cada métrica (beneficio mensual, punto de equilibrio, LTV, etc.) **AÑADIR VALOR** - Mejoraría comprensión significativamente~~ **MOVIDO A TICKET-5**
- [x] ~~Crear contenido para la interpretación de cada nivel de salud (qué significa que una métrica esté en rojo, amarillo o verde)~~ **YA IMPLEMENTADO** - Recomendaciones del kpi-calculator.ts ya explican esto
- [x] ~~Desarrollar textos para recomendaciones basadas en los valores calculados~~ **YA IMPLEMENTADO** - Sistema de recomendaciones verbosas ya funciona
- [x] ~~Implementar componentes de tooltip/popover para mostrar explicaciones detalladas~~ **YA IMPLEMENTADO** - EnhancedInfoTooltip ya existe y funciona
- ~~[ ] Crear sistema para mostrar/ocultar explicaciones adicionales a demanda del usuario~~ **SOBRECOMPLICA** - Los tooltips ya permiten esto
- ~~[ ] Desarrollar recursos visuales complementarios que ayuden a entender cada concepto~~ **SOBRECOMPLICA** - Los iconos y colores actuales son suficientes
- [x] ~~Estructurar el contenido en archivos separados para facilitar su mantenimiento~~ **YA IMPLEMENTADO** - financial-inputs-help.ts ya existe como patrón
- ~~[ ] Crear tests de usabilidad para verificar la claridad de las explicaciones~~ **SOBRECOMPLICA** - Feedback directo de usuarios es más eficaz

## Criterios de Aceptación Técnicos

- ~~[ ] Las explicaciones deben usar lenguaje sencillo, sin jerga financiera compleja **PENDIENTE** - Crear contenido específico para métricas~~ **MOVIDO A TICKET-5**
- [x] Las ayudas contextuales deben ser accesibles mediante clic o hover **COMPLETADO** - EnhancedInfoTooltip ya implementado
- [x] El sistema debe permitir mostrar tanto explicaciones breves como detalladas **COMPLETADO** - Tooltips con content + example + tips
- [x] Las recomendaciones deben ser relevantes y adaptadas a los valores específicos del usuario **COMPLETADO** - Sistema dinámico implementado
- [x] El contenido debe estar estructurado para facilitar actualizaciones futuras **COMPLETADO** - Patrón de archivos de ayuda establecido
- ~~[ ] Las explicaciones deben incluir ejemplos prácticos cuando sea apropiado **PENDIENTE** - Añadir ejemplos específicos~~ **MOVIDO A TICKET-5**

## Referencias Técnicas

- [x] Implementar componentes de tooltip/popover accesibles **COMPLETADO** - EnhancedInfoTooltip implementado
- [x] Organizar el contenido explicativo en archivos JSON/MDX **COMPLETADO** - Patrón establecido en financial-inputs-help.ts
- [x] Utilizar TailwindCSS para estilos consistentes **COMPLETADO**
- [x] Seguir estándares de accesibilidad WCAG **COMPLETADO**

## Dependencias

- [x] Ticket KPI-003 (Componentes UI para Visualización) **COMPLETADO** - ResultsDisplay.tsx implementado

## Estimación

~~Medio (5h)~~ **REDUCIDO A 2-3h** - La infraestructura ya existe

## Asignado a

TBD

## Estado Actual

- ✅ **Componentes de ayuda**: EnhancedInfoTooltip completamente funcional
- ✅ **Patrón de contenido**: financial-inputs-help.ts como ejemplo a seguir
- ✅ **Sistema de recomendaciones**: Mensajes dinámicos y contextuales ya implementados
- ✅ **Infraestructura técnica**: Tooltips accesibles y responsive
- ✅ **Estructura de archivos**: Patrón establecido para contenido explicativo

## Trabajo Pendiente que Añade Valor

- [ ] **Crear financial-metrics-help.ts**: Archivo con explicaciones específicas para cada métrica (unitMargin, LTV, CAC, etc.)
- [ ] **Integrar tooltips en ResultsDisplay.tsx**: Añadir EnhancedInfoTooltip a cada tarjeta de métrica
- [ ] **Ejemplos prácticos**: Incluir casos de uso reales en las explicaciones

## Tareas Simplificadas

- **Contenido ya disponible**: Las recomendaciones del kpi-calculator.ts ya proporcionan interpretaciones contextuales
- **Componentes ya listos**: EnhancedInfoTooltip está probado y funcional en formularios
- **Solo falta aplicar**: Crear el contenido específico y conectarlo con la UI existente
