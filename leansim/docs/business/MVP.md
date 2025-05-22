# 🚀 MVP – LeanSim

## 🎯 Objetivo del MVP

Permitir que un usuario sin conocimientos financieros:

- Defina su idea de negocio de forma estratégica (Lean Canvas).
- Introduzca datos clave financieros.
- Visualice métricas básicas como beneficio, CAC, LTV, punto de equilibrio.
- Aprenda en el proceso con ayudas educativas y contexto.

---

## 🧩 Funcionalidades del MVP

### 1. Formulario Lean Canvas simplificado

- 5 campos:
  - Problema
  - Propuesta de Valor
  - Segmento de Clientes
  - Canales
  - Estructura de ingresos/costes
- Tooltips con explicaciones breves.

### 2. Formulario de inputs financieros

- Ingresos mensuales estimados
- Costes fijos
- Costes variables por cliente
- CAC (Coste de Adquisición)
- Nº estimado de clientes
- Precio medio por cliente
- Duración media del cliente

### 3. Cálculo de KPIs automáticos

- Beneficio mensual
- Punto de equilibrio
- LTV (Customer Lifetime Value)
- LTV / CAC
- Margen por cliente

### 4. Visualización de resultados

- Tarjetas o tabla con resultados.
- Explicaciones breves por métrica (en texto).

### 5. Historial de simulaciones

- Guardado local o en base de datos.
- Listado simple de simulaciones anteriores.

### 6. Ayudas contextuales

- Tooltips y mini-glosario en cada campo relevante.

---

## ⏱ Estimación temporal

| Módulo                            | Tiempo estimado |
| --------------------------------- | --------------- |
| Diseño UX + flujo                 | 2h              |
| Lean Canvas (formulario + lógica) | 4h              |
| Inputs financieros                | 5h              |
| Cálculo de métricas               | 5h              |
| Visualización de resultados       | 4h              |
| Tooltips y ayudas                 | 3h              |
| Historial                         | 3h              |
| Pruebas y ajustes                 | 4h              |
| **Total estimado**                | **30h**         |

---

## ❌ Excluido del MVP

- Login/registro de usuario.
- Exportación a PDF.
- IA generativa para sugerencias.
- Comparación de múltiples simulaciones.
- Integraciones externas.

---

## 🛠️ Stack sugerido

- **Framework:** Next.js (TypeScript, fullstack)
- **Estilo:** TailwindCSS
- **ORM:** Prisma
- **Base de datos:** SQLite o PostgreSQL
- **Despliegue:** Vercel
