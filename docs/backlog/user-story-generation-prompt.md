# Prompt para Generación de Historias de Usuario - LeanSim

## Contexto del Proyecto

LeanSim es una herramienta web para emprendedores que permite simular la viabilidad financiera de una idea de negocio en minutos, sin necesidad de conocimientos técnicos o financieros. Combina una visión estratégica (mini-Lean Canvas) con el cálculo automático de KPIs clave, en un entorno educativo y accesible.

### Características Principales:

- Lean Canvas simplificado (5 campos clave con ayudas contextuales)
- Formulario de inputs financieros (ingresos, costes, CAC, nº clientes, duración media)
- Cálculo de KPIs (beneficio, punto de equilibrio, LTV, CAC, margen)
- Visualización de resultados (tarjetas o tabla + texto explicativo corto)
- Historial de simulaciones (guardado local o en base de datos)
- Tooltips educativos (breves descripciones accesibles en todos los campos)

## Instrucciones para Crear Historias de Usuario

Para cada una de las siguientes funcionalidades, crea una historia de usuario siguiendo el formato indicado:

1. Lean Canvas simplificado
2. Formulario de inputs financieros
3. Cálculo y visualización de KPIs
4. Historial de simulaciones
5. Sistema de ayudas contextuales (tooltips)

### Formato para Historias de Usuario:

```markdown
# Historia de Usuario: [Título descriptivo]

**Como** [tipo de usuario],
**quiero** [acción que el usuario desea realizar],
**para** [beneficio que el usuario espera obtener].

## Descripción

[Descripción detallada en lenguaje natural de la funcionalidad que el usuario desea]

## Criterios de Aceptación

- [Criterio específico y verificable]
- [Criterio específico y verificable]
- [Criterio específico y verificable]
- ...

## Notas Adicionales

- [Consideraciones relevantes para el desarrollo]
- [Consideraciones de UX/UI]
- [Posibles limitaciones o riesgos]

## Historias de Usuario Relacionadas

- [Referencias a otras historias de usuario relacionadas]
```

## Proceso de Generación

1. Identifica las personas/usuarios clave del sistema (emprendedor, usuario sin formación financiera, usuario primerizo, usuario recurrente)
2. Para cada funcionalidad principal, crea una historia de usuario desde la perspectiva más adecuada
3. Organiza las historias en carpetas siguiendo la estructura:
   ```
   /docs/backlog/[nombre-historia-usuario]/
     - historia-usuario.md
   ```

## Ejemplo de Historia de Usuario:

```markdown
# Historia de Usuario: Completar Lean Canvas Simplificado

**Como** emprendedor,
**quiero** rellenar un Lean Canvas básico de forma guiada,
**para** estructurar mi idea de negocio de manera estratégica.

## Descripción

Como emprendedor necesito una forma sencilla de estructurar mi idea de negocio siguiendo el marco del Lean Canvas, pero de manera simplificada con solo 5 campos esenciales. Quiero poder completar estos campos con ayudas que me expliquen qué debo incluir en cada uno.

## Criterios de Aceptación

- El formulario debe contener los 5 campos clave: Problema, Propuesta de Valor, Segmento de Clientes, Canales, y Estructura de ingresos/costes
- Cada campo debe tener un tooltip o ayuda contextual que explique qué información debe incluirse
- El formulario debe validar que todos los campos estén completos antes de avanzar
- El usuario debe poder navegar entre los campos y modificarlos fácilmente
- Los datos ingresados deben guardarse temporalmente para no perderse al navegar entre secciones

## Notas Adicionales

- El diseño debe ser minimalista y amigable para usuarios sin experiencia previa con Lean Canvas
- Considerar agregar ejemplos cortos para cada campo
- Limitar el texto en cada campo para mantener la simplicidad

## Historias de Usuario Relacionadas

- Formulario de inputs financieros
- Visualización de resultados
```
