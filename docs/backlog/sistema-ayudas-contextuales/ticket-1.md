# Ticket: HELP-001 - Desarrollar Framework Base para Ayudas Contextuales

## Historia de Usuario Relacionada

Recibir Ayudas Contextuales (@docs/backlog/sistema-ayudas-contextuales/historia-usuario.md)

## Descripción

Implementar el framework base y la arquitectura para el sistema de ayudas contextuales que se utilizará en toda la aplicación. Este framework proporcionará la estructura, los componentes reutilizables y la lógica para mostrar/ocultar tooltips, modales de ayuda y explicaciones en diferentes contextos de la aplicación.

## Tareas

- [ ] Diseñar la arquitectura general del sistema de ayudas contextuales
- [ ] Definir e implementar el modelo `ContextualHelp` en Prisma ORM con campos para id, fieldKey, description y example
- [ ] Crear componente base `ContextualHelp` reutilizable con diferentes variantes (tooltip, popover, modal)
- [ ] Implementar lógica para mostrar/ocultar ayudas (hover, clic, etc.)
- [ ] Desarrollar sistema para gestionar niveles de detalle (resumen, explicación detallada)
- [ ] Crear estructura de datos para almacenar contenidos de ayuda
- [ ] Implementar hook personalizado `useContextualHelp` para gestionar el estado de las ayudas
- [ ] Desarrollar sistema de posicionamiento automático de tooltips
- [ ] Crear componentes para iconos de ayuda consistentes (i, ?)
- [ ] Implementar endpoints básicos de API para acceder a las ayudas contextuales

## Criterios de Aceptación Técnicos

- El framework debe ser fácilmente reutilizable en toda la aplicación
- El modelo ContextualHelp debe estar correctamente implementado en el esquema de Prisma
- El modelo debe incluir todos los campos requeridos según el Data-Model.md
- Las ayudas deben ser accesibles según estándares WCAG (navegables por teclado, anunciables por lectores de pantalla)
- Los componentes deben ser responsivos y adaptarse a diferentes tamaños de pantalla
- El sistema debe permitir diferentes modos de activación (hover, clic, etc.)
- La arquitectura debe facilitar la adición de nuevo contenido sin modificar los componentes
- El rendimiento no debe verse afectado significativamente al añadir ayudas
- La tabla ContextualHelp debe poder consultarse eficientemente por fieldKey

## Referencias Técnicas

- Implementar componentes React con TypeScript
- Utilizar TailwindCSS para estilos consistentes
- Seguir patrones de accesibilidad WCAG 2.1
- Implementar técnicas de renderizado condicional eficiente
- Utilizar Prisma ORM para la definición y acceso al modelo ContextualHelp

## Dependencias

- Configuración inicial de Next.js y TailwindCSS
- Configuración de Prisma ORM

## Estimación

Medio (6h)

## Asignado a

TBD
