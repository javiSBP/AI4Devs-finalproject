# UML Use Case Diagram - LeanSim

## Descripción

Este diagrama de casos de uso UML identifica los actores principales del sistema LeanSim, los casos de uso fundamentales y sus relaciones. Representa las funcionalidades principales del MVP según las historias de usuario identificadas.

## Decisiones de Diseño

- Se ha identificado un único actor principal ("Emprendedor/Usuario") ya que el MVP no contempla diferentes roles o usuarios con distintos permisos.
- Los casos de uso se organizan siguiendo el flujo natural de interacción con el sistema.
- Se han incluido relaciones de tipo "include" para representar funcionalidades que son siempre parte de un caso de uso mayor.
- Se han usado relaciones de tipo "extend" para representar funcionalidades opcionales que pueden ocurrir durante un caso de uso.

## Diagrama

```mermaid
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Emprendedor/Usuario" as user

rectangle "LeanSim" {
  usecase "Completar Lean Canvas" as UC1
  usecase "Ingresar Datos Financieros" as UC2
  usecase "Visualizar KPIs" as UC3
  usecase "Guardar Simulación" as UC4
  usecase "Ver Historial de Simulaciones" as UC5
  usecase "Consultar Simulación Guardada" as UC6
  usecase "Duplicar Simulación" as UC7
  usecase "Eliminar Simulación" as UC8
  usecase "Acceder a Ayudas Contextuales" as UC9
  usecase "Ver Glosario de Términos" as UC10

  user --> UC1
  user --> UC2
  user --> UC3
  user --> UC4
  user --> UC5
  user --> UC6
  user --> UC7
  user --> UC8
  user --> UC9

  UC9 <.. UC1 : <<extend>>
  UC9 <.. UC2 : <<extend>>
  UC9 <.. UC3 : <<extend>>

  UC3 ..> UC2 : <<include>>
  UC2 ..> UC1 : <<include>>

  UC6 ..> UC5 : <<include>>
  UC7 ..> UC6 : <<include>>
  UC8 ..> UC5 : <<include>>

  UC10 ..> UC9 : <<include>>
}
@enduml
```

## Elementos Principales

1. **Actor**:

   - **Emprendedor/Usuario**: Representa al usuario principal del sistema que utiliza todas las funcionalidades.

2. **Casos de Uso Principales**:

   - **Completar Lean Canvas**: Permite al usuario rellenar el formulario de Lean Canvas simplificado.
   - **Ingresar Datos Financieros**: Permite introducir información financiera básica del negocio.
   - **Visualizar KPIs**: Muestra las métricas calculadas en base a los inputs del usuario.
   - **Guardar Simulación**: Almacena los datos y resultados de una simulación.
   - **Ver Historial de Simulaciones**: Muestra un listado de las simulaciones guardadas.
   - **Consultar Simulación Guardada**: Permite ver en detalle una simulación anterior.
   - **Duplicar Simulación**: Crea una copia de una simulación existente para modificarla.
   - **Eliminar Simulación**: Borra una simulación del historial.
   - **Acceder a Ayudas Contextuales**: Muestra tooltips y explicaciones sobre campos y métricas.
   - **Ver Glosario de Términos**: Proporciona definiciones de los términos financieros usados.

3. **Relaciones**:
   - Las relaciones **include** indican funcionalidades obligatorias (ej: para visualizar KPIs es necesario ingresar datos financieros).
   - Las relaciones **extend** indican funcionalidades opcionales (ej: acceder a ayudas contextuales durante el proceso).

## Consideraciones Adicionales

- Este diagrama representa el alcance del MVP, no incluye funcionalidades futuras como registro de usuarios, exportación a PDF o IA generativa para sugerencias.
- La interacción entre casos de uso refleja el flujo de trabajo secuencial (Lean Canvas → Datos Financieros → KPIs).
- El sistema de ayudas contextuales se representa como un caso de uso transversal que puede ser utilizado en múltiples partes del sistema.
