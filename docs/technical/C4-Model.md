# Diagrama C4 para LeanSim

## Descripción

Este documento contiene los diagramas del modelo C4 para la aplicación LeanSim, presentados en cuatro niveles de abstracción: Contexto, Contenedores, Componentes y Código. Estos diagramas proporcionan una visión progresivamente más detallada del sistema, desde una perspectiva general hasta los componentes específicos.

## Decisiones de Diseño

- Se ha seguido estrictamente la notación C4 para mantener la claridad y consistencia.
- Los diagramas se centran en la arquitectura del MVP, sin incluir componentes futuros.
- Se mantiene la simplicidad apropiada para un MVP, evitando la sobreingeniería.
- Se han incluido los cuatro niveles de C4, con énfasis en los tres primeros que son los más relevantes para esta fase.

## Diagrama de Contexto (Nivel 1)

```mermaid
C4Context
    title Diagrama de Contexto para LeanSim

    Person(emprendedor, "Emprendedor", "Usuario que busca evaluar la viabilidad de su idea de negocio")

    System(leanSimSystem, "LeanSim", "Permite crear simulaciones financieras básicas y visualizar KPIs clave")

    System_Ext(vercelSystem, "Vercel", "Plataforma de despliegue para la aplicación web")
    System_Ext(databaseSystem, "Base de Datos", "Almacena las simulaciones y datos del usuario")

    Rel(emprendedor, leanSimSystem, "Crea simulaciones, ingresa datos y visualiza resultados")
    Rel(leanSimSystem, vercelSystem, "Se despliega en")
    Rel(leanSimSystem, databaseSystem, "Almacena y recupera datos de")
```

## Diagrama de Contenedores (Nivel 2)

```mermaid
C4Container
    title Diagrama de Contenedores para LeanSim

    Person(emprendedor, "Emprendedor", "Usuario que busca evaluar la viabilidad de su idea de negocio")

    System_Boundary(leanSimSystem, "LeanSim") {
        Container(webApplication, "Aplicación Web", "Next.js, React, TypeScript, TailwindCSS", "Proporciona la interfaz de usuario y funcionalidades principales a través del navegador")
        Container(apiLayer, "API Backend", "Next.js API Routes, TypeScript", "Maneja solicitudes API para operaciones CRUD y cálculos financieros")
        ContainerDb(database, "Base de Datos", "SQLite (dev), PostgreSQL (prod)", "Almacena simulaciones, datos financieros, y ayudas contextuales")
    }

    System_Ext(vercelSystem, "Vercel", "Plataforma de despliegue que aloja la aplicación web y API")

    Rel(emprendedor, webApplication, "Accede e interactúa a través del navegador", "HTTPS")
    Rel(webApplication, apiLayer, "Realiza llamadas API", "JSON/HTTP")
    Rel(apiLayer, database, "Lee y escribe datos", "Prisma ORM")
    Rel(webApplication, vercelSystem, "Se despliega en")
    Rel(apiLayer, vercelSystem, "Se despliega en")
```

## Diagrama de Componentes (Nivel 3)

```mermaid
C4Component
    title Diagrama de Componentes para LeanSim

    Person(emprendedor, "Emprendedor", "Usuario que busca evaluar la viabilidad de su idea de negocio")

    System_Boundary(leanSimSystem, "LeanSim") {
        Container_Boundary(webApplication, "Aplicación Web") {
            Component(pageComponents, "Páginas", "Next.js Pages", "Implementan las rutas principales de la aplicación")
            Component(leanCanvasForm, "Formulario Lean Canvas", "React Component", "Permite al usuario rellenar el Lean Canvas simplificado")
            Component(financialInputForm, "Formulario Inputs Financieros", "React Component", "Permite ingresar datos financieros clave")
            Component(resultsDisplay, "Visualizador de Resultados", "React Component", "Muestra los KPIs calculados y sus explicaciones")
            Component(historyList, "Historial", "React Component", "Muestra el listado de simulaciones previas")
            Component(contextualHelp, "Sistema de Ayudas", "React Component", "Proporciona tooltips y explicaciones contextuales")
            Component(stateManagement, "Gestión de Estado", "React Context/Hooks", "Maneja el estado global de la aplicación")
        }

        Container_Boundary(apiLayer, "API Backend") {
            Component(simulationAPI, "API de Simulaciones", "Next.js API Route", "Endpoints para CRUD de simulaciones")
            Component(calculationService, "Servicio de Cálculo", "TypeScript", "Implementa la lógica de cálculo de KPIs financieros")
            Component(validationService, "Servicio de Validación", "TypeScript", "Valida los inputs del usuario")
            Component(dataAccessLayer, "Capa de Acceso a Datos", "Prisma Client", "Interactúa con la base de datos")
        }

        ContainerDb(database, "Base de Datos", "SQLite/PostgreSQL", "Almacena simulaciones, datos financieros y contenido de ayuda")
    }

    Rel(emprendedor, pageComponents, "Interactúa con")
    Rel(pageComponents, leanCanvasForm, "Utiliza")
    Rel(pageComponents, financialInputForm, "Utiliza")
    Rel(pageComponents, resultsDisplay, "Utiliza")
    Rel(pageComponents, historyList, "Utiliza")

    Rel(leanCanvasForm, contextualHelp, "Usa para mostrar ayudas")
    Rel(financialInputForm, contextualHelp, "Usa para mostrar ayudas")
    Rel(resultsDisplay, contextualHelp, "Usa para mostrar ayudas")

    Rel(leanCanvasForm, stateManagement, "Lee/actualiza estado")
    Rel(financialInputForm, stateManagement, "Lee/actualiza estado")
    Rel(resultsDisplay, stateManagement, "Lee estado")
    Rel(historyList, stateManagement, "Lee estado")

    Rel(stateManagement, simulationAPI, "Realiza llamadas a", "JSON/HTTP")

    Rel(simulationAPI, calculationService, "Utiliza para calcular KPIs")
    Rel(simulationAPI, validationService, "Utiliza para validar inputs")
    Rel(simulationAPI, dataAccessLayer, "Utiliza para acceder a datos")

    Rel(calculationService, validationService, "Utiliza para validar datos")
    Rel(dataAccessLayer, database, "Lee/escribe")
```

## Diagrama de Código (Nivel 4)

Para el MVP, presentaremos un diagrama de código simplificado centrado en el componente de cálculo financiero, que es crítico para la aplicación:

```mermaid
C4Code
    title Diagrama de Código para el Componente de Cálculo Financiero

    Boundary(calculationService, "Servicio de Cálculo Financiero") {
        Class(financialCalculator, "FinancialCalculator", "class") {
            + calculateProfit(data: FinancialData): number
            + calculateBreakEven(data: FinancialData): number
            + calculateLTV(data: FinancialData): number
            + calculateLTVCAC(data: FinancialData): number
            + calculateMargin(data: FinancialData): number
            + calculateAllKPIs(data: FinancialData): KPIResults
        }

        Class(kpiUtils, "KPIUtils", "class") {
            + formatCurrency(value: number): string
            + getKPIStatus(kpi: string, value: number): 'good' | 'medium' | 'bad'
            + getKPIDescription(kpi: string): string
        }

        Class(kpiInterface, "Interfaces", "interface") {
            + FinancialData
            + KPIResults
            + KPIStatus
        }
    }

    Rel(financialCalculator, kpiUtils, "Utiliza")
    Rel(financialCalculator, kpiInterface, "Implementa")
    Rel(kpiUtils, kpiInterface, "Utiliza")
```

## Elementos Principales

### Nivel 1: Contexto

- **Emprendedor**: Usuario principal del sistema.
- **LeanSim**: El sistema en su conjunto.
- **Vercel**: Plataforma externa para el despliegue.
- **Base de Datos**: Sistema externo para almacenamiento de datos.

### Nivel 2: Contenedores

- **Aplicación Web**: Front-end construido con Next.js y React.
- **API Backend**: Back-end implementado con API Routes de Next.js.
- **Base de Datos**: SQLite para desarrollo y PostgreSQL para producción.

### Nivel 3: Componentes

- **Componentes de UI**: Páginas, formularios, visualizadores.
- **Gestión de Estado**: Contexto y hooks de React para manejo de estado.
- **APIs y Servicios**: Endpoints API y servicios de cálculo, validación y acceso a datos.

### Nivel 4: Código

- **FinancialCalculator**: Clase principal para cálculos financieros.
- **KPIUtils**: Utilidades para formateo y evaluación de KPIs.
- **Interfaces**: Definiciones de tipos para datos financieros y resultados.

## Consideraciones Adicionales

- Los diagramas están diseñados para ser implementables directamente con las tecnologías especificadas (Next.js, Prisma, etc.).
- El nivel de detalle aumenta progresivamente, manteniendo la coherencia entre los diferentes niveles.
- La arquitectura propuesta es adaptable a futuras extensiones como autenticación de usuarios, exportación de datos, o integración de IA.
- Se ha priorizado la claridad y la simplicidad sobre la exhaustividad, de acuerdo con los principios de desarrollo de MVP.
- Los componentes están organizados siguiendo buenas prácticas de separación de responsabilidades.
