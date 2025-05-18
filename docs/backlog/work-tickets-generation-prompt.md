# Prompt para Generación de Tickets de Trabajo - LeanSim

## Contexto de la historia de la historia de Usuario

Pregúntame para qué historia de usuario vamos a crear los tickets de trabajo, y yo te devolveré algo como @/docs/backlog/[nombre-historia-usuario]/historia-usuario.md

## Contexto técnico y stack tecnológico

Obtenido a partir de @docs/technical

## Instrucciones para Crear Tickets de Trabajo

Para cada historia de usuario, descompón la funcionalidad en 2-4 tickets de trabajo técnicos y específicos, siguiendo este formato:

### Formato para Tickets de Trabajo:

```markdown
# Ticket: [Número] - [Título corto y descriptivo]

## Historia de Usuario Relacionada

[Referencia a la historia de usuario asociada]

## Descripción

[Descripción técnica de la tarea a realizar]

## Tareas

- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]
- ...

## Criterios de Aceptación Técnicos

- [Criterio técnico específico y verificable]
- [Criterio técnico específico y verificable]
- ...

## Dependencias

- [Referencias a otros tickets que deben completarse antes]
- [Referencias a componentes o tecnologías necesarias]

## Estimación

[Tiempo estimado: Bajo (2-4h) / Medio (4-8h) / Alto (8-16h)]

## Asignado a

[Nombre del desarrollador o TBD]
```

## Proceso de Generación

1. Para cada historia de usuario ya creada, desglosa 2-4 tickets de trabajo técnicos
   ```
   /docs/backlog/[nombre-historia-usuario]/
     - historia-usuario.md
     - ticket-1.md
     - ticket-2.md
     - ...
   ```

## Ejemplo de Ticket de Trabajo:

```markdown
# Ticket: LEAN-001 - Crear componente de formulario Lean Canvas

## Historia de Usuario Relacionada

Completar Lean Canvas Simplificado

## Descripción

Desarrollar el componente React para el formulario del Lean Canvas simplificado con los 5 campos clave, incluyendo validación y gestión de estado.

## Tareas

- [ ] Crear componente React con TypeScript para el formulario Lean Canvas
- [ ] Implementar estado local usando React hooks o Context API para gestionar los datos
- [ ] Implementar validación de campos requeridos
- [ ] Crear sistema de navegación entre campos (botones siguiente/anterior)
- [ ] Conectar con almacenamiento temporal para preservar datos entre navegaciones
- [ ] Implementar mensajes de error y feedback visual

## Criterios de Aceptación Técnicos

- El componente debe ser responsive siguiendo principios de TailwindCSS
- Debe implementar validación de campos en tiempo real
- Debe guardar el estado en localStorage o estado global de la aplicación
- Los campos deben aceptar texto con formato markdown simple para mejor estructura

## Dependencias

- Estructura inicial del proyecto Next.js
- Configuración de TailwindCSS

## Estimación

Medio (6h)

## Asignado a

TBD
```
