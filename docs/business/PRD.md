# 📄 Product Requirements Document (PRD) – LeanSim

## 🧭 Introducción y Objetivos

**LeanSim** es una herramienta web que permite a emprendedores simular la viabilidad básica de su modelo de negocio sin conocimientos financieros.  
El objetivo del MVP es permitir que el usuario:

- Complete una versión simplificada del Lean Canvas.
- Ingrese datos clave sobre su modelo financiero.
- Visualice automáticamente métricas esenciales como beneficio mensual, CAC, LTV y punto de equilibrio.
- Aprenda durante el proceso con ayudas contextuales.

---

## 👥 Stakeholders

- **Usuarios finales**: Emprendedores, estudiantes de negocio, freelancers.
- **Compradores potenciales**: Instituciones educativas, incubadoras, formadores.
- **Desarrollador**: Tú (como estudiante/desarrollador del máster).
- **IA asistente**: ChatGPT (para documentación, desarrollo, testing).
- **Futuro soporte/marketing**: Automatizable o apoyado por plataformas.
- **Socios externos**: OpenAI (v2), plataformas de despliegue (Vercel).

---

## 🧑‍💻 Historias de Usuario (MVP)

1. **Como emprendedor**, quiero rellenar un Lean Canvas básico para estructurar mi idea de negocio.
2. **Como usuario sin formación financiera**, quiero introducir mis ingresos y costes y ver si mi modelo es rentable.
3. **Como usuario primerizo**, quiero recibir explicaciones simples de cada campo o métrica que ingreso o visualizo.
4. **Como usuario recurrente**, quiero ver un historial de mis simulaciones anteriores para revisarlas más tarde.

---

## 🧱 Componentes Principales y Sitemap

### Componentes

- **Home / Landing**
- **Paso 1**: Lean Canvas simplificado (5 campos)
- **Paso 2**: Inputs financieros clave
- **Paso 3**: Resultados (KPIs + explicaciones)
- **Historial**: Listado de simulaciones anteriores
- **Ayudas contextuales**: Tooltips y mini-glosario

### Sitemap

Home → Lean Canvas → Inputs Financieros → Resultados → Historial

---

## ⚙️ Características y Funcionalidades

| Función                          | Descripción                                          |
| -------------------------------- | ---------------------------------------------------- |
| Lean Canvas simplificado         | 5 campos clave con ayudas contextuales.              |
| Formulario de inputs financieros | Ingresos, costes, CAC, nº clientes, duración media.  |
| Cálculo de KPIs                  | Beneficio, punto de equilibrio, LTV, CAC, margen.    |
| Visualización de resultados      | Tarjetas o tabla + texto explicativo corto.          |
| Historial de simulaciones        | Guardado local o en base de datos.                   |
| Tooltips educativos              | Breves descripciones accesibles en todos los campos. |

---

## 🎨 Diseño y Experiencia del Usuario

- **Estilo visual**: Minimalista, moderno, claro.
- **UX**: Flujo en pasos tipo asistente (wizard).
- **Responsive**: Optimizado para escritorio y tablets.
- **Contenido**: En lenguaje claro, orientado a usuarios no técnicos.
- **Accesibilidad**: Colores legibles, campos bien definidos, explicaciones simples.

---

## 🧪 Requisitos Técnicos

| Categoría               | Detalle                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| **Framework fullstack** | Next.js con TypeScript (frontend + backend unificado)                |
| **Estilado**            | TailwindCSS                                                          |
| **Base de datos**       | SQLite o PostgreSQL usando Prisma ORM                                |
| **Despliegue**          | Vercel                                                               |
| **IA**                  | No obligatoria en el MVP; opcional para explicación avanzada en v2   |
| **Almacenamiento**      | Historial de simulaciones por ID simple (sin login obligatorio)      |
| **Interactividad**      | Tooltips, paso a paso, botones claros                                |
| **Normativas**          | Cumplimiento básico de privacidad (no datos sensibles ni personales) |

---

## 📅 Planificación del Proyecto (30h)

| Fase                            | Estimación |
| ------------------------------- | ---------- |
| Diseño UX + flujo               | 2h         |
| Lean Canvas (frontend + lógica) | 4h         |
| Inputs financieros + validación | 5h         |
| Cálculo y resultados            | 5h         |
| Tooltips educativos             | 3h         |
| Historial (local/db)            | 3h         |
| Pruebas funcionales             | 4h         |
| Despliegue + ajustes            | 4h         |
| **Total estimado**              | **30h**    |

---

## ✅ Criterios de Aceptación

- Todos los campos son funcionales y validados.
- Las métricas se calculan correctamente con base en inputs.
- Las ayudas contextuales están presentes y accesibles.
- El usuario puede realizar al menos una simulación completa.
- El historial permite consultar simulaciones anteriores.
- El producto puede desplegarse y ser usado sin errores críticos.

---

## 📎 Apéndices y Recursos Adicionales

- Glosario básico de términos: CAC, LTV, margen, punto de equilibrio.
- Recursos de referencia: [Lean Canvas original](https://leanstack.com/leancanvas), [OpenAI API docs](https://platform.openai.com/docs).
- Posibles fuentes de inspiración: Sturppy, Causal, ProjectionLab.
- Documento: Lean Canvas visual generado anteriormente.
