# Prompt para Generación de Tickets de Trabajo - LeanSim

## Instrucciones de Uso Dinámico

Para utilizar este prompt:

1. Indica la historia de usuario para la que necesitas crear tickets de trabajo
2. Puedes especificar aspectos técnicos particulares que quieras enfatizar en los tickets
3. Este prompt automáticamente considerará toda la documentación técnica relevante para generar tickets precisos y alineados con la arquitectura del proyecto

## Contexto de la Historia de Usuario

**INSTRUCCIÓN**: Por favor, especifica para qué historia de usuario deseas crear tickets de trabajo. Si ya existe una historia documentada, proporciona su ruta (ej. `@docs/backlog/[nombre-historia-usuario]/historia-usuario.md`).

## Contexto Técnico y Stack Tecnológico

Este prompt utilizará automáticamente la documentación técnica ubicada en `@docs/technical`, incluyendo específicamente:

- **Arquitectura**: `@docs/technical/High-Level-Architecture.md` - Patrón de capas, organización y responsabilidades
- **API**: `@docs/technical/api.md` - Endpoints, validaciones y seguridad
- **Modelo de datos**: `@docs/technical/Data-Model.md` - Entidades, relaciones y restricciones
- **Infraestructura**: `@docs/technical/infrastructure.md` - Plataforma de despliegue y consideraciones operativas
- **Seguridad**: `@docs/technical/security.md` - Prácticas de seguridad y consideraciones

**Stack tecnológico principal**:

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (API RESTful)
- **Base de datos**: Prisma ORM con SQLite (desarrollo) y PostgreSQL (producción)
- **Validación**: Zod para validación con TypeScript
- **Despliegue**: Vercel

## Instrucciones para Crear Tickets de Trabajo

Para cada historia de usuario, descompón la funcionalidad en 2-4 tickets de trabajo técnicos y específicos, siguiendo este formato:

### Formato para Tickets de Trabajo:

```markdown
# Ticket: [Número] - [Título corto y descriptivo]

## Historia de Usuario Relacionada

[Referencia a la historia de usuario asociada]

## Descripción

[Descripción técnica de la tarea a realizar, haciendo referencia a la documentación técnica relevante]

## Tareas

- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]
- ...

## Criterios de Aceptación Técnicos

- [Criterio técnico específico y verificable]
- [Criterio técnico específico y verificable]
- ...

## Referencias Técnicas

- [Referencias específicas a secciones de la documentación técnica]
- [Referencias a modelos, APIs o componentes específicos]

## Dependencias

- [Referencias a otros tickets que deben completarse antes]
- [Referencias a componentes o tecnologías necesarias]

## Estimación

[Tiempo estimado: Bajo (2-4h) / Medio (4-8h) / Alto (8-16h)]

## Asignado a

[Nombre del desarrollador o TBD]
```

## Directrices para la Descomposición de Tickets

1. **Alineación con Capas de Arquitectura**:

   - Crear tickets separados para distintas capas (UI, lógica de negocio, API, almacenamiento)
   - Considerar la arquitectura de componentes definida en `High-Level-Architecture.md`

2. **Integración con API**:

   - Si el ticket requiere integración con la API, referir específicamente a los endpoints documentados en `api.md`
   - Asegurar que se respetan los formatos de solicitud/respuesta definidos

3. **Modelo de Datos**:

   - Para tickets relacionados con persistencia, referenciar las entidades y relaciones en `Data-Model.md`
   - Considerar las restricciones y validaciones a nivel de modelo

4. **Seguridad y Validación**:

   - Incluir tareas específicas para implementar validaciones según las prácticas en `security.md`
   - Utilizar Zod para validación de inputs en concordancia con las especificaciones

5. **Organización de Archivos**:
   - Seguir la estructura de carpetas documentada para añadir/modificar componentes
   - Mantener la separación de responsabilidades según la arquitectura

## Estructura de Carpetas Esperada

Para cada historia de usuario, los tickets deben guardarse en la siguiente estructura:

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

Desarrollar el componente React para el formulario del Lean Canvas simplificado con los 5 campos clave, incluyendo validación y gestión de estado. Este componente debe seguir la arquitectura de componentes detallada en `High-Level-Architecture.md` e implementar el patrón de Custom Hooks para la lógica.

## Tareas

- [ ] Crear componente React con TypeScript para el formulario Lean Canvas
- [ ] Implementar estado local usando React Hook Form para gestionar los datos y validaciones
- [ ] Integrar Zod para esquemas de validación tipo-segura
- [ ] Crear sistema de navegación entre campos (botones siguiente/anterior)
- [ ] Implementar almacenamiento en Context API según el patrón de gestión de estado del proyecto
- [ ] Conectar con la API de Lean Canvas según las especificaciones en api.md
- [ ] Implementar mensajes de error y feedback visual siguiendo patrones de UI

## Criterios de Aceptación Técnicos

- El componente debe ser responsive siguiendo principios de TailwindCSS
- Debe implementar validación de campos en tiempo real usando Zod
- Debe seguir el patrón de formularios establecido en el proyecto
- Los campos deben aceptar texto con formato markdown simple para mejor estructura
- Debe serializar/deserializar correctamente los datos según el modelo LeanCanvas definido

## Referencias Técnicas

- API: `/api/v1/simulations/:id/lean-canvas` (PATCH) - Ver api.md líneas 280-330
- Modelo de datos: Entidad LeanCanvas - Ver Data-Model.md líneas 90-110
- Arquitectura: Capa de componentes UI - Ver High-Level-Architecture.md líneas 40-60

## Dependencias

- Estructura inicial del proyecto Next.js
- Configuración de TailwindCSS
- Context Provider para gestión de estado global

## Estimación

Medio (6h)

## Asignado a

TBD
```

## Aspectos Importantes para la Generación de Tickets

- **Especificidad**: Cada ticket debe ser lo suficientemente específico para que un desarrollador pueda trabajar en él sin ambigüedades.
- **Completitud**: Incluir todas las tareas necesarias para completar el ticket (configuración, desarrollo, pruebas).
- **Trazabilidad**: Relacionar claramente cada ticket con la historia de usuario y documentación técnica.
- **Independencia**: Minimizar dependencias entre tickets cuando sea posible.
- **Tamaño adecuado**: Un ticket no debería requerir más de 1-2 días de trabajo.
