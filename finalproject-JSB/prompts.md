> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o los de corrección o adición de funcionalidades que consideres más relevantes.
> Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras

## Índice

1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 1. Descripción general del producto

**Prompt 1:**

# Proyecto en ChatGPT con las siguientes instrucciones

Este proyecto consiste en construir una aplicación desde cero, recorriendo todas las fases clave del desarrollo de producto digital. Se espera que ChatGPT actúe como copiloto experto en producto, diseño, desarrollo y documentación técnica. Las etapas del proyecto incluyen brainstorming inicial, análisis de la competencia, definición del MVP, creación del Lean Canvas y PRD, definición de User Stories y tickets, documentación técnica, desarrollo completo del backend y frontend, pruebas, y despliegue final del MVP.

¿Cómo me gustaría que ChatGPT respondiera?

- ChatGPT debe comportarse como un colaborador estructurado, claro y estratégico. Debe:
- Guiar cada fase del proyecto con preguntas clave y buenas prácticas.
- Sugerir enfoques, herramientas, estructuras y ejemplos relevantes.
- Ayudar a redactar documentación y código con calidad profesional.
- Adaptarse al stack tecnológico que se elija y sugerir herramientas si aún no se ha definido.
- Proporcionar respuestas paso a paso, bien estructuradas y listas para usarse o adaptarse rápidamente.
- Detectar riesgos, inconsistencias o decisiones que faltan y sugerir cómo abordarlas.
- Mantener un enfoque práctico, ágil y alineado a la entrega del MVP.
- Tener siempre en mente que todo debe poder llevarse a la práctica y mantenerse en un repositorio de GitHub.

**Prompt 2:**

# Brainstorming

## Objetivo

Vamos a realizar un **brainstorming** de posibles proyectos para realizar.

## Requisitos

- El proyecto consistirá en un **MVP funcional**.
- El proyecto va a realizarlo un **estudiante de un máster de inteligencia artificial** para desarrollo de software.
- Todas las **fases del proyecto**, desde la conceptualización a la implementación final, estarán **asistidas por IA**.
- La suma de todas las fases, concepto, documentación, testing, implementación, despliegue, etc. **no debería llevarle más de 30 horas**.
- Como **mínimo**, el proyecto debería tener **base de datos**, **backend** y **frontend**.

## Opcionalmente

- El proyecto integraré IA de alguna manera como parte de sus funcionalidades.
- El proyecto será monetizable y por lo tanto es susceptible de generar beneficios.

## Formato de salida

- Dame 5 posibles proyectos

**Prompt 3:**

Estructura el PRD para que tenga las siguientes secciones fundamentales:

```md
- Introducción y Objetivos: Proporciona un resumen del producto, incluyendo el propósito, los objetivos y las metas que se espera alcanzar con el producto.
- Stakeholders: Identifica a todas las partes interesadas, incluyendo usuarios, compradores, fabricantes, asistencia al cliente, marketing y ventas, socios externos, instancias reguladoras, minoristas, entre otros.
- Historias de Usuarios: Describe cómo los diferentes usuarios interactúan con el producto, lo que ayuda a entender mejor las necesidades del usuario final.
- Componentes Principales y Sitemaps: Detalla la estructura y organización del producto, incluyendo sus componentes principales y cómo se relacionan entre sí.
- Características y Funcionalidades: Enumera y describe las características y funcionalidades específicas que el producto debe tener para satisfacer las necesidades identificadas.
- Diseño y Experiencia del Usuario: Incluye especificaciones sobre el diseño del producto y la experiencia del usuario, asegurando que el producto sea usable y estéticamente agradable.
- Requisitos Técnicos: Detalla los aspectos técnicos necesarios para el desarrollo del producto, incluyendo hardware, software, interactividad, personalización y normativas.
- Planificación del Proyecto: Proporciona información sobre plazos, hitos y dependencias, crucial para la planificación y gestión efectiva del proyecto.
- Criterios de aceptación: Define los estándares y condiciones bajo los cuales el producto será aceptado tras su finalización.
- Apéndices y Recursos Adicionales: Puede incluir glosarios, explicaciones de términos, recursos externos, y otros documentos de referencia que apoyen el desarrollo del producto.
```

Puedes añadir cualquier sección que consideres para que el PRD tenga una calidad profesional. No es necesario extenderse mucho, prefiero que seas conciso en cada una de las secciones puesto que servirá como base para desarrollar el producto de manera asistida por IA.

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1:**

## Rol

Eres un copiloto experto prompting para Claude 3.7, con conocimientos en producto, diseño, desarrollo y documentación técnica.

## Contexto y objetivo

Basándote en la documentación de negocio que hay en la carpeta @business y las historias de usuario en @backlog, crea un prompt para que paso a paso se puedan generar los siguientes diagramas:

- Definición de casos de uso en formato UML, de acuerdo a la sintaxis y buenas prácticas UML.
- Modelo de datos que cubra entidades, atributos (nombre y tipo) y relaciones en formato mermaid.
- Diseño de sistema y arquitectura de alto nivel en formato mermaid. Teniendo en cuenta las buenas prácticas como SOLID, KISS, DRY y YAGNI. Usa el sentido común para el diseño y evita hacer sobreeingeniería (por ejemplo, quizá para un MVP como el de este proyecto no sea necesario usar arquitectura hexagonal y DDD, o sí, hazme una propuesta).
- Diagrama C4 que llegue en profundidad a cada uno de los componentes del sistema siguiendo las buenas prácticas y sintaxis de UML.

## Salida

El prompt debe indicar que queremos la siguiente salida.

- Cada artefacto debe guardarse como un fichero markdown, en la carpeta technical de
- Crea los diagramas que se especifican en cada punto en el fichero correspondiente.
- Acompaña los diagramas de texto explicativo.
- Tras la creación de cada artefacto. Pídeme validación para saber si estás en la dirección correcta y continuar con el siguiente.

## Requerimientos

Ten en cuenta todo lo que se indica en el @readme.md apartado "2. Arquitectura del Sistema" para el diseño, a excepción de "2.6. Tests" que será tratado en los tickets de trabajo. Recuerda que todo sea sencillo, no es necesario complicar las cosas.

**Prompt 2:**

## Rol

Eres un ingeniero de software experto con amplia experiencia en modelado de sistemas, diseño de arquitectura y documentación técnica. Tu tarea es crear diagramas detallados para el proyecto LeanSim siguiendo las mejores prácticas de UML, modelado de datos y arquitectura de software.

## Contexto del Proyecto

LeanSim es una herramienta web para emprendedores que permite simular la viabilidad financiera de una idea de negocio sin necesidad de conocimientos técnicos o financieros. El sistema combina:

- Un Lean Canvas simplificado (5 campos clave)
- Formulario de inputs financieros
- Cálculo automático de KPIs
- Visualización de resultados
- Historial de simulaciones
- Sistema de ayudas contextuales

El stack tecnológico incluye:

- Frontend: Next.js con TypeScript
- Estilos: TailwindCSS
- Backend: API routes de Next.js
- Base de datos: SQLite o PostgreSQL con Prisma ORM
- Despliegue: Vercel

Si encesitas más contexto, consulta @business.

## Instrucciones

Para cada artefacto solicitado, debes:

1. Analizar las historias de usuario y documentación de negocio proporcionadas
2. Aplicar las mejores prácticas para cada tipo de diagrama
3. Mantener la simplicidad adecuada para un MVP sin sobreeingeniería
4. Respetar los principios SOLID, KISS, DRY y YAGNI
5. Proporcionar breves explicaciones de las decisiones de diseño tomadas

## Artefactos a Generar

Debes crear un archivo markdown independiente para cada uno de los siguientes artefactos:

### 1. Diagrama de Casos de Uso UML

Crea un diagrama de casos de uso UML completo que identifique:

- Actores del sistema
- Casos de uso principales
- Relaciones entre casos de uso (include, extend)
- Límites del sistema

Usa la sintaxis correcta de UML para casos de uso. El diagrama debe representar todas las funcionalidades principales identificadas en las historias de usuario.

### 2. Modelo de Datos en formato Mermaid

Diseña un modelo de datos que incluya:

- Todas las entidades necesarias
- Atributos con nombres y tipos de datos específicos
- Relaciones entre entidades con cardinalidad
- Claves primarias y foráneas

Utiliza el formato Mermaid para representar el diagrama entidad-relación.

### 3. Arquitectura de Alto Nivel en formato Mermaid

Crea un diagrama de arquitectura que muestre:

- Componentes principales del sistema
- Capas de la aplicación
- Flujo de datos entre componentes
- Tecnologías utilizadas en cada componente

Propón una arquitectura apropiada para un MVP, justificando por qué es adecuada y cómo respeta los principios SOLID, KISS, DRY y YAGNI.

### 4. Diagrama C4 para Componentes del Sistema

Desarrolla los cuatro niveles del modelo C4:

- Nivel 1: Diagrama de Contexto (visión general del sistema)
- Nivel 2: Diagrama de Contenedores (aplicaciones, almacenes de datos)
- Nivel 3: Diagrama de Componentes (partes principales dentro de cada contenedor)
- Nivel 4: Diagrama de Código (opcional, solo para componentes críticos)

Utiliza la sintaxis correcta de C4 y asegúrate de que cada nivel proporcione el detalle adecuado.

## Formato de Salida

Para cada artefacto, debes generar un archivo markdown con la siguiente estructura:

```markdown
# [Título del Artefacto]

## Descripción

[Breve descripción del propósito y alcance del diagrama]

## Decisiones de Diseño

[Explicación de las decisiones clave tomadas en el diseño y su justificación]

## Diagrama

[Diagrama en la sintaxis apropiada (UML o Mermaid)]

## Elementos Principales

[Descripción de los elementos clave del diagrama y su propósito]

## Consideraciones Adicionales

[Limitaciones, extensiones futuras, alternativas consideradas, etc.]
```

## Guía de Validación

Después de completar cada artefacto, solicita retroalimentación para confirmar que satisface los requisitos antes de continuar con el siguiente. Asegúrate de:

- Verificar que el diagrama sea técnicamente correcto
- Confirmar que abarca todas las funcionalidades principales descritas en @backlog
- Comprobar que mantiene el nivel adecuado de simplicidad para el @MVP.md

## Recordatorios

- Estos diagramas serán utilizados para guiar el desarrollo, por lo que deben ser precisos y detallados
- Sigue estrictamente la sintaxis de UML y Mermaid para garantizar que los diagramas puedan renderizarse correctamente
- Mantén un equilibrio entre detalle y simplicidad, priorizando la claridad
- Para el modelo de datos, asegúrate de que sea implementable directamente con Prisma

**Prompt 3:**

### **2.2. Descripción de componentes principales:**

Se ha optado por meta-prompting + zero-shot prompt y tras revisar la salida no han sido necesarios más prompts.

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1:**
Haz una descripción de alto nivel de la estructura del proyecto y explica brevemente el propósito de las carpetas principales, así como si obedece a algún patrón o arquitectura específica.
Utiliza tanto el documento @High-Level-Architecture.md como la doc oficial de@NextJS.
Crea una nueva entrada de Estructura del proyecto dentro de @High-Level-Architecture.md

**Prompt 2:**

**Prompt 3:**

### **2.4. Infraestructura y despliegue**

**Prompt 1:**
Explíca detalladamente en un documento deployment.md dentro de , cual debe ser el proceso de despliegue en la plataforma vercel, asegúrate de usar la última documentación en el sitio web @Vercel.

**Prompt 2:**
Utilizando la información de @deployment.md , crea un prompt para @https://www.eraser.io/diagramgpt en el que pueda generar un diagrama de infraestructura

**Prompt 3:**
Genera un diagrama de infraestructura para una aplicación Next.js llamada "LeanSim" desplegada en Vercel con las siguientes características:

- Cliente: Navegadores web accediendo a la aplicación
- Plataforma: Vercel proporciona la infraestructura de despliegue
- Aplicación: Next.js con App Router, API Routes y componentes React
- Base de datos: PostgreSQL en producción (usando servicios como Neon, Supabase o Railway)
- Flujos:
  - Despliegue continuo desde GitHub con preview deployments para PRs
  - Migraciones de base de datos automáticas con Prisma ORM durante el despliegue
  - Edge Functions para mejora de rendimiento
  - Optimización de imágenes mediante servicio integrado de Vercel

Incluye los siguientes componentes con sus conexiones:

1. Cliente/Navegador
2. CDN de Vercel
3. Vercel Edge Network
4. Next.js Server-Side Rendering
5. Next.js API Routes
6. Prisma Client
7. Base de datos PostgreSQL
8. Repositorio Git y proceso de CI/CD

El diagrama debe mostrar claramente el flujo de datos y solicitudes desde el cliente hasta la base de datos, así como el proceso de despliegue desde el repositorio Git hasta la puesta en producción.

### **2.5. Seguridad**

**Prompt 1:**
Basándote en @technical , enumera y describe las prácticas de seguridad principales que podrian implementarse en el proyecto, por ejemplo CSF u OWASP y documentalo en security.md dentro de @technical

**Prompt 2:**

**Prompt 3:**

### **2.6. Tests**

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**

---

### 3. Modelo de Datos

**Prompt 1:**
Explíca detalladamente en un documento database-management.md dentro de @technical , como proceder a la gestión de una base de datos para desarrollo SQLite y una PostgreSQL en producción. Incluye la configuración de Prisma y de Docker si fuera necesario.

**Prompt 2:**
Incluye los siguientes elementos en la descripción de entidades principales del fichero @Data-Model.md :

- nombre y tipo de cada atributo, descripción breve si procede
- claves primarias y foráneas
- relaciones y tipo de relación
- restricciones (unique, not null…).

**Prompt 3:**

---

### 4. Especificación de la API

**Prompt 1:**
Diseña y documenta la API de LeanSim en un fichero api.md dentro de @technical.
Teniendo en cuenta toda la documentación no solo@technical , sino también el @backlog describe todos los endpoints necesarios.
Recuerda incluir:

- Ruta
- Cabeceras (si las hay)
- Parámetros (si los hay)
- Body (si lo hay)
- Los tipos de cada uno
- Validaciones a realizar
- Casos de error
- Seguridad (de ser necesaria para el @MVP.md )
- Todo lo que consideres para que sea lo mas detallada posible

**Prompt 2:**

**Prompt 3:**

---

### 5. Historias de Usuario

**Prompt 1:**

## Rol

Eres un copiloto experto prompting para Claude 3.7, con conocimientos en producto y desarrollo de software.

## Contexto y objetivo

Basándote en la documentación de negocio que hay en la carpeta @business, crea un prompt para que paso a paso se puedan generar las historias de usuario y tickets de trabajo para la implementación de LeanSim.

## Características de las Historias de Usuario

Las Historias de Usuario describen una funcionalidad de software desde la perspectiva del usuario final.

Las características más importantes que deben cumplir las Historias de Usuario para cumplir su propósito son:

- **Descripción informal en lenguaje natural**: Las Historias de Usuario describen funcionalidades del software de forma simple, no técnica, y desde el punto de vista del usuario. La narrativa es importante; no se trata de una descripción técnica, y si puede vincularse con un avatar/persona compradora/usuario que la solicita, mucho mejor.
- **Enfocadas en el usuario**: Las Historias de Usuario se centran en lo que el usuario quiere lograr, más que en las funcionalidades técnicas del sistema.
- **Estructura clásica**: Generalmente siguen el formato: _"Como [tipo de usuario], quiero [realizar una acción] para [obtener un beneficio]"_.
- **Priorización y estimación**: Las Historias de Usuario se priorizan y se les asigna un esfuerzo estimado por parte del equipo de desarrollo, en caso de que sea una variable a tener en cuenta para la priorización.
- **Conversación y confirmación**: Las Historias de Usuario fomentan la conversación entre los product managers, stakeholders y el equipo técnico, y se confirman una vez que la funcionalidad ha sido implementada.
- **Evolución iterativa**: A medida que avanza el proyecto, las Historias de Usuario pueden evolucionar y cambiar para adaptarse a necesidades cambiantes.

## Ejemplo

**Título de la Historia de Usuario:**

Como [rol del usuario],
quiero [acción que el usuario desea realizar],
para que [beneficio que el usuario espera obtener].

**Descripción**
[Una descripción concisa en lenguaje natural de la funcionalidad que el usuario desea.]

**Criterios de Aceptación:**

- [Detalle específico de la funcionalidad]
- [Detalle específico de la funcionalidad]
- [Detalle específico de la funcionalidad]

**Notas adicionales:**
[Cualquier consideración adicional]

**Tareas**
[Lista de tareas y subtareas necesarias para completar esta historia.]

**Historias de Usuario relacionadas:**
[Relaciones con otras historias de usuario]

## Salida

Las historias de usuario deben ser creadas dentro de la carpeta backlog en @docs, cada una en su propia carpeta que se compondrá de un fichero .md con las historia de usuario propiamente dicha y N ficheros .md para cada uno de los tickets de trabajo. Tanto las historias de usuario como los tickets de trabajo se escribirán en formato markdown.

**Prompt 2:**

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

**Prompt 3:**

---

### 6. Tickets de Trabajo

**Prompt 1:**
mejora el prompt de @work-tickets-generation-prompt.md para que pueda ser usado dinámicamente con la historia de usuario que se le indique y haga referencia a la documentación técnica en la carpeta @technical

**Prompt 2:**

**Prompt 3:**

---

### 7. Pull Requests

**Prompt 1:**

**Prompt 2:**

**Prompt 3:**
