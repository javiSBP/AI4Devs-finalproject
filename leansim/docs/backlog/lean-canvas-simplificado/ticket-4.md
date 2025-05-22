# Ticket: LEAN-004 - Desarrollar Sistema de Ayudas Contextuales y Ejemplos

## Historia de Usuario Relacionada

Completar Lean Canvas Simplificado (@docs/backlog/lean-canvas-simplificado/historia-usuario.md)

## Descripción

Crear el contenido y la implementación técnica del sistema de ayudas contextuales y ejemplos para cada uno de los 5 campos del Lean Canvas simplificado. Este sistema debe proporcionar información clara y concisa sobre qué debe incluirse en cada campo, junto con ejemplos ilustrativos que ayuden a usuarios sin experiencia previa.

## Tareas

- [ ] Redactar textos explicativos concisos para cada campo del Lean Canvas
- [ ] Crear ejemplos cortos y relevantes para cada sección basados en casos reales
- [ ] Desarrollar componente de tooltip/modal para mostrar las ayudas contextuales
- [ ] Implementar la lógica de visualización de ayudas (mostrar/ocultar al hacer hover/clic)
- [ ] Asegurar que las ayudas sean accesibles y funcionen en dispositivos táctiles
- [ ] Crear archivo de contenido separado para facilitar cambios futuros en los textos de ayuda
- [ ] Implementar tests de usabilidad para validar la claridad de las ayudas

## Criterios de Aceptación Técnicos

- Las ayudas contextuales deben ser claras, concisas y útiles para usuarios sin experiencia
- Los ejemplos deben ser relevantes y ayudar a entender mejor cada campo
- El sistema de tooltips debe ser accesible y compatible con dispositivos móviles
- Las ayudas no deben interrumpir el flujo de trabajo del usuario
- El contenido debe ser fácilmente modificable sin cambiar el código de la aplicación

## Referencias Técnicas

- Implementar tooltips/modales accesibles según estándares WCAG
- Organizar el contenido en archivos JSON/MDX separados para facilitar mantenimiento
- Utilizar TailwindCSS para estilos consistentes

## Dependencias

- Ticket LEAN-002 (Componentes UI)
- Ticket LEAN-003 (Gestión de Estado e Integración)

## Estimación

Bajo (4h)

## Asignado a

TBD
