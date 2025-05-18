## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**

Javier Sanz Benede

### **0.2. Nombre del proyecto:**

LeanSim

### **0.3. Descripción breve del proyecto:**

**LeanSim** es una herramienta web para emprendedores que permite simular la viabilidad financiera de su idea de negocio en minutos, sin necesidad de conocimientos técnicos o financieros. Combina una visión estratégica (mini-Lean Canvas) con el cálculo automático de KPIs clave, en un entorno educativo y accesible.

### **0.4. URL del proyecto:**

> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio

https://github.com/javiSBP/leansim

---

## 1. Descripción general del producto

> Describe en detalle los siguientes aspectos del producto:

### **1.1. Objetivo:**

**LeanSim** es una herramienta web que permite a emprendedores simular la viabilidad básica de su modelo de negocio sin conocimientos financieros.  
El objetivo del MVP es permitir que el usuario:

- Complete una versión simplificada del Lean Canvas.
- Ingrese datos clave sobre su modelo financiero.
- Visualice automáticamente métricas esenciales como beneficio mensual, CAC, LTV y punto de equilibrio.
- Aprenda durante el proceso con ayudas contextuales.

### **1.2. Características y funcionalidades principales:**

| Función                          | Descripción                                          |
| -------------------------------- | ---------------------------------------------------- |
| Lean Canvas simplificado         | 5 campos clave con ayudas contextuales.              |
| Formulario de inputs financieros | Ingresos, costes, CAC, nº clientes, duración media.  |
| Cálculo de KPIs                  | Beneficio, punto de equilibrio, LTV, CAC, margen.    |
| Visualización de resultados      | Tarjetas o tabla + texto explicativo corto.          |
| Historial de simulaciones        | Guardado local o en base de datos.                   |
| Tooltips educativos              | Breves descripciones accesibles en todos los campos. |

### **1.3. Diseño y experiencia de usuario:**

> Proporciona imágenes y/o videotutorial mostrando la experiencia del usuario desde que aterriza en la aplicación, pasando por todas las funcionalidades principales.

### **1.4. Instrucciones de instalación:**

> Documenta de manera precisa las instrucciones para instalar y poner en marcha el proyecto en local (librerías, backend, frontend, servidor, base de datos, migraciones y semillas de datos, etc.)

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

> Usa el formato que consideres más adecuado para representar los componentes principales de la aplicación y las tecnologías utilizadas. Explica si sigue algún patrón predefinido, justifica por qué se ha elegido esta arquitectura, y destaca los beneficios principales que aportan al proyecto y justifican su uso, así como sacrificios o déficits que implica.

### **2.2. Descripción de componentes principales:**

> Describe los componentes más importantes, incluyendo la tecnología utilizada

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

> Representa la estructura del proyecto y explica brevemente el propósito de las carpetas principales, así como si obedece a algún patrón o arquitectura específica.

### **2.4. Infraestructura y despliegue**

> Detalla la infraestructura del proyecto, incluyendo un diagrama en el formato que creas conveniente, y explica el proceso de despliegue que se sigue

### **2.5. Seguridad**

> Enumera y describe las prácticas de seguridad principales que se han implementado en el proyecto, añadiendo ejemplos si procede

### **2.6. Tests**

> Describe brevemente algunos de los tests realizados

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

> Recomendamos usar mermaid para el modelo de datos, y utilizar todos los parámetros que permite la sintaxis para dar el máximo detalle, por ejemplo las claves primarias y foráneas.

### **3.2. Descripción de entidades principales:**

> Recuerda incluir el máximo detalle de cada entidad, como el nombre y tipo de cada atributo, descripción breve si procede, claves primarias y foráneas, relaciones y tipo de relación, restricciones (unique, not null…), etc.

---

## 4. Especificación de la API

> Si tu backend se comunica a través de API, describe los endpoints principales (máximo 3) en formato OpenAPI. Opcionalmente puedes añadir un ejemplo de petición y de respuesta para mayor claridad

---

## 5. Historias de Usuario

> Documenta 3 de las historias de usuario principales utilizadas durante el desarrollo, teniendo en cuenta las buenas prácticas de producto al respecto.

**Historia de Usuario 1**

# Historia de Usuario: Completar Lean Canvas Simplificado

**Como** emprendedor,
**quiero** rellenar un Lean Canvas básico de forma guiada,
**para** estructurar mi idea de negocio de manera estratégica.

## Descripción

Como emprendedor necesito una forma sencilla de estructurar mi idea de negocio siguiendo el marco del Lean Canvas, pero de manera simplificada con solo 5 campos esenciales. Quiero poder completar estos campos con ayudas que me expliquen qué debo incluir en cada uno, ya que no tengo experiencia previa con herramientas de planificación de negocios.

## Criterios de Aceptación

- El formulario debe contener los 5 campos clave: Problema, Propuesta de Valor, Segmento de Clientes, Canales, y Estructura de ingresos/costes
- Cada campo debe tener un tooltip o ayuda contextual que explique qué información debe incluirse
- El formulario debe validar que todos los campos estén completos antes de avanzar
- El usuario debe poder navegar entre los campos y modificarlos fácilmente
- Los datos ingresados deben guardarse temporalmente para no perderse al navegar entre secciones
- El diseño debe ser intuitivo, con campos claramente etiquetados y espacio suficiente para escribir

## Notas Adicionales

- El diseño debe ser minimalista y amigable para usuarios sin experiencia previa con Lean Canvas
- Considerar agregar ejemplos cortos para cada campo basados en casos reales
- Limitar el texto en cada campo para mantener la simplicidad (máximo 300 caracteres por campo)
- Implementar un indicador visual de progreso para que el usuario sepa en qué parte del proceso está

## Historias de Usuario Relacionadas

- Formulario de inputs financieros
- Sistema de ayudas contextuales

**Historia de Usuario 2**

# Historia de Usuario: Ingresar Datos Financieros Básicos

**Como** usuario sin formación financiera,
**quiero** introducir mis ingresos y costes de forma simple,
**para** evaluar si mi modelo de negocio es rentable.

## Descripción

Como usuario sin conocimientos financieros avanzados, necesito una forma sencilla e intuitiva de ingresar los datos financieros clave de mi negocio. Quiero poder introducir información básica como ingresos mensuales, costes fijos, costes variables, el coste de adquisición de clientes, número estimado de clientes y duración media de la relación con ellos. Necesito que el proceso sea guiado y comprensible para alguien sin formación especializada.

## Criterios de Aceptación

- El formulario debe incluir campos para: ingresos mensuales estimados, costes fijos, costes variables por cliente, CAC, número estimado de clientes, precio medio por cliente y duración media del cliente
- Cada campo debe tener validación adecuada (no permitir valores negativos, formato numérico correcto)
- Los campos deben tener valores por defecto o ejemplos para orientar al usuario
- El formulario debe permitir guardar los datos parcialmente completados
- El usuario debe poder volver atrás para modificar información sin perder los datos ya ingresados
- Debe haber un botón claro para calcular los resultados una vez completados todos los campos requeridos

## Notas Adicionales

- Utilizar un lenguaje sencillo y no técnico en todas las etiquetas y explicaciones
- Incluir ayudas visuales como iconos o mini-gráficos junto a cada campo para facilitar la comprensión
- Considerar usar elementos interactivos como sliders para facilitar la entrada de algunos valores
- Mantener el formulario visualmente simple para no abrumar al usuario
- Mostrar un indicador de progreso para que el usuario sepa en qué punto del proceso se encuentra

## Historias de Usuario Relacionadas

- Completar Lean Canvas Simplificado
- Cálculo y visualización de KPIs
- Sistema de ayudas contextuales

**Historia de Usuario 3**

# Historia de Usuario: Visualizar Métricas de Viabilidad

**Como** emprendedor,
**quiero** ver automáticamente las métricas clave de mi negocio,
**para** entender la viabilidad financiera de mi idea sin necesidad de cálculos manuales.

## Descripción

Como emprendedor sin experiencia en análisis financiero, necesito que el sistema calcule y me muestre de forma clara las métricas clave para evaluar la viabilidad de mi modelo de negocio. Quiero ver indicadores como el beneficio mensual, punto de equilibrio, valor del ciclo de vida del cliente (LTV), relación LTV/CAC y margen por cliente, basados en los datos financieros que he ingresado previamente. Necesito entender estos valores con explicaciones sencillas para tomar decisiones informadas.

## Criterios de Aceptación

- El sistema debe calcular automáticamente: beneficio mensual, punto de equilibrio, LTV, relación LTV/CAC y margen por cliente
- Los resultados deben presentarse en tarjetas o paneles visuales claramente diferenciados
- Cada métrica debe mostrarse con una breve explicación en lenguaje sencillo de lo que significa
- Los valores críticos deben destacarse visualmente (ej. margen negativo en rojo)
- Debe haber indicadores visuales de "salud" para cada métrica (bueno/medio/malo)
- El usuario debe poder ver una explicación más detallada de cada métrica al hacer clic o pasar el cursor sobre ella
- Debe haber opciones para compartir o guardar los resultados

## Notas Adicionales

- Usar visualizaciones simples como códigos de color, iconos o mini-gráficos para facilitar la comprensión
- Evitar jerga financiera compleja en las explicaciones principales
- Considerar incluir recomendaciones básicas basadas en los resultados (ej. "Tu CAC es demasiado alto en comparación con el LTV")
- Mantener una estética limpia y no abrumadora, priorizando la claridad sobre la densidad de información
- Proporcionar opciones para ver los resultados en diferentes formatos (tarjetas, tabla, gráfico)

## Historias de Usuario Relacionadas

- Ingresar Datos Financieros Básicos
- Historial de simulaciones
- Sistema de ayudas contextuales

---

## 6. Tickets de Trabajo

> Documenta 3 de los tickets de trabajo principales del desarrollo, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto.

**Ticket 1**

**Ticket 2**

**Ticket 3**

---

## 7. Pull Requests

> Documenta 3 de las Pull Requests realizadas durante la ejecución del proyecto

**Pull Request 1**

**Pull Request 2**

**Pull Request 3**
