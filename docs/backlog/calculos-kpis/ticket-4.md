# Ticket: KPI-004 - Desarrollar Sistema de Explicaciones y Ayudas Contextuales para Métricas

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Implementar un sistema de explicaciones y ayudas contextuales para cada métrica financiera, que permita a los usuarios sin experiencia en finanzas entender el significado e importancia de cada indicador. Desarrollar el contenido explicativo en lenguaje sencillo y los componentes necesarios para mostrar esta información de manera accesible.

## Tareas

- [ ] Redactar explicaciones claras y concisas para cada métrica (beneficio mensual, punto de equilibrio, LTV, etc.)
- [ ] Crear contenido para la interpretación de cada nivel de salud (qué significa que una métrica esté en rojo, amarillo o verde)
- [ ] Desarrollar textos para recomendaciones basadas en los valores calculados
- [ ] Implementar componentes de tooltip/popover para mostrar explicaciones detalladas
- [ ] Crear sistema para mostrar/ocultar explicaciones adicionales a demanda del usuario
- [ ] Desarrollar recursos visuales complementarios que ayuden a entender cada concepto
- [ ] Estructurar el contenido en archivos separados para facilitar su mantenimiento
- [ ] Crear tests de usabilidad para verificar la claridad de las explicaciones

## Criterios de Aceptación Técnicos

- Las explicaciones deben usar lenguaje sencillo, sin jerga financiera compleja
- Las ayudas contextuales deben ser accesibles mediante clic o hover
- El sistema debe permitir mostrar tanto explicaciones breves como detalladas
- Las recomendaciones deben ser relevantes y adaptadas a los valores específicos del usuario
- El contenido debe estar estructurado para facilitar actualizaciones futuras
- Las explicaciones deben incluir ejemplos prácticos cuando sea apropiado

## Referencias Técnicas

- Implementar componentes de tooltip/popover accesibles
- Organizar el contenido explicativo en archivos JSON/MDX
- Utilizar TailwindCSS para estilos consistentes
- Seguir estándares de accesibilidad WCAG

## Dependencias

- Ticket KPI-003 (Componentes UI para Visualización)

## Estimación

Medio (5h)

## Asignado a

TBD
