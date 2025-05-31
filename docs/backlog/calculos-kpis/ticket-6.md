# Ticket: KPI-006 - Limpieza de Modelo de Datos y Depreciación de Campos Legacy

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Limpiar y normalizar el modelo de datos eliminando completamente los campos legacy del modelo Simulation y las APIs no utilizadas. El objetivo es aprovechar que no estamos en producción para deprecar completamente la arquitectura legacy y usar exclusivamente las nuevas tablas FinancialInputs y SimulationResults.

**Contexto actual**: Los datos se guardan únicamente en localStorage y se calculan en tiempo real. Tenemos campos legacy en el modelo Simulation que duplican funcionalidad con las nuevas tablas especializadas.

**IMPORTANTE**: Aprovecharemos que no estamos en producción para **deprecar completamente los campos legacy** del modelo Simulation y usar exclusivamente las nuevas tablas FinancialInputs y SimulationResults.

## Tareas

### Revisión de Modelo de Datos

- [ ] **Revisar campos de `FinancialInputs`**: Verificar que coinciden con los datos de `FinancialInputsForm.tsx`
- [ ] **Revisar campos de `SimulationResults`**: Verificar que coinciden con los KPIs de `kpi-calculator.ts` y `ResultsDisplay.tsx`
- [ ] **Revisar campos de `LeanCanvas`**: Verificar que el modelo existente coincide con `LeanCanvasForm.tsx`
- [ ] Configurar relaciones entre los modelos para la simulación completa

### Depreciación de Campos Legacy

- [ ] **Migrar datos existentes**: Script para migrar simulaciones legacy a nuevas tablas
- [ ] **Limpiar uso de campos legacy en API**: Eliminar referencias en `src/lib/api/simulations.ts`
- [ ] **Actualizar schema Prisma**: Eliminar todos los campos legacy de `Simulation`:
  - `averagePrice`, `costPerUnit`, `fixedCosts`, `customerAcquisitionCost`
  - `monthlyNewCustomers`, `averageCustomerLifetime`, `initialInvestment`
  - `monthlyExpenses`, `avgRevenue`, `growthRate`, `timeframeMonths`
  - `otherParams`, `results_legacy`
- [ ] **Crear migración Prisma**: Nueva migración para eliminar columnas legacy
- [ ] **Actualizar tipos TypeScript**: Limpiar interfaces que referencien campos legacy
- [ ] **Verificar formularios frontend**: Asegurar que usan únicamente nuevas tablas

### Eliminación de API Actual

- [ ] **Eliminar `src/lib/api/lean-canvas.ts`**: API actual que no está siendo utilizada
- [ ] **Eliminar `src/lib/api/lean-canvas.test.ts`**: Tests correspondientes
- [ ] **Eliminar endpoints API existentes**: `/api/v1/lean-canvas/*` que están sin uso
- [ ] **Mantener validaciones shared**: Conservar `/src/lib/validation/shared/` intacto (usado por formularios frontend)
- [ ] **Simplificar validaciones nivel superior**: Limpiar esquemas no usados en `/src/lib/validation/` tras eliminar APIs de lean-canvas

## Criterios de Aceptación Técnicos

- **Modelo limpio**: Simulation solo contiene metadatos y relaciones
- **Validaciones backend**: Reutilizar esquemas Zod existentes en `src/lib/validation/`
- **Compatibilidad**: Mantener interfaces TypeScript existentes para nuevas tablas
- **Simplificación**: Eliminar APIs no utilizadas (lean-canvas actual) y campos legacy
- **Migración completa**: Todos los datos legacy migrados a nuevas tablas
- **Sin campos legacy**: Modelo Simulation limpio, solo metadatos y relaciones

## Referencias Técnicas

- **Eliminar completamente**: API endpoints y funciones de `lean-canvas.ts` actual
- **Deprecar completamente**: Todos los campos legacy de `Simulation` (aprovechando que no estamos en producción)
- **Reutilizar modelos**: `Simulation` (limpio), `LeanCanvas`, `FinancialInputs`, `SimulationResults` existentes
- **Mantener validaciones shared**: Esquemas en `/src/lib/validation/shared/` (usados por formularios)
- **Simplificar validaciones nivel superior**: Limpiar esquemas de APIs eliminadas
- **Integrar con**: `kpi-calculator.ts` para cálculos consistentes

## Dependencias

- ✅ Ticket KPI-001 (Motor de Cálculo) **COMPLETADO**
- ✅ Modelos Prisma existentes: `Simulation`, `LeanCanvas`, `FinancialInputs`, `SimulationResults`
- ✅ Validaciones Zod: `lean-canvas.ts`, `financial-inputs.ts`, `shared/`
- ✅ Formularios frontend: `LeanCanvasForm.tsx`, `FinancialInputsForm.tsx`

## Asignado a

TBD

## Tareas Específicas Detalladas

### Verificación de Modelos

- [ ] **FinancialInputs vs FinancialInputsForm**:
  - ✅ 6 campos númericos coinciden exactamente
  - ✅ `validationWarnings`, `calculationNotes` para metadatos
- [ ] **SimulationResults vs ResultsDisplay**:
  - ✅ 8 KPIs coinciden con `calculateResults()` actual
  - ✅ 3 health indicators, recommendations JSON
- [ ] **LeanCanvas vs LeanCanvasForm**:
  - ✅ 6 campos de texto coinciden exactamente
  - ✅ Límites de caracteres consistentes

### Migración y Limpieza de Campos Legacy

- [ ] **Script de migración de datos**:
  - Identificar simulaciones existentes con datos legacy
  - Migrar `averagePrice`, `costPerUnit`, etc. a tabla `FinancialInputs`
  - Migrar `results_legacy` JSON a tabla `SimulationResults` (recalculando con `kpi-calculator.ts`)
- [ ] **Actualizar `src/lib/api/simulations.ts`**:
  - Eliminar todas las referencias a campos legacy en `duplicateSimulation()`
  - Usar únicamente relaciones con `FinancialInputs` y `SimulationResults`
- [ ] **Nueva migración Prisma**:
  ```sql
  -- Eliminar campos legacy tras migración de datos
  ALTER TABLE "simulations" DROP COLUMN "averagePrice";
  ALTER TABLE "simulations" DROP COLUMN "costPerUnit";
  -- ... (todos los campos legacy)
  ```
- [ ] **Limpiar tipos TypeScript**: Eliminar campos legacy de interfaces de simulación

### Limpieza de Código No Usado

- [ ] **Eliminar archivos**:
  - `src/lib/api/lean-canvas.ts` (154 líneas)
  - `src/lib/api/lean-canvas.test.ts` (316 líneas)
  - `src/app/api/v1/lean-canvas/route.ts`
  - `src/app/api/v1/lean-canvas/[id]/route.ts`
- [ ] **Conservar validaciones shared**: Todo `/src/lib/validation/shared/` se mantiene intacto (frontend los usa directamente)
- [ ] **Simplificar validaciones nivel superior**:
  - Limpiar `src/lib/validation/lean-canvas.ts` de esquemas API no usados (`CreateLeanCanvasSchema`, etc.)
  - Mantener `src/lib/validation/financial-inputs.ts` para APIs de simulations

## Beneficios de esta Aproximación

1. **Arquitectura limpia**: Sin campos legacy, modelo de datos normalizado
2. **Eliminación de dead code**: API de lean-canvas no está en uso
3. **Aprovechamiento del momento**: Sin producción, podemos limpiar completamente
4. **Base sólida**: Modelo limpio para implementar APIs (Ticket KPI-007)
5. **Mantenibilidad**: Código más simple y fácil de entender

## Notas de Implementación

- **Arquitectura de validaciones**:
  - `/shared/` contiene esquemas base compartidos frontend/backend ✅ CONSERVAR
  - `/nivel superior` contiene extensiones para APIs backend ⚠️ LIMPIAR tras eliminar lean-canvas API
- **Migración de datos legacy**: Recalcular resultados con `kpi-calculator.ts` para consistencia
- **Modelo Simulation limpio**: Solo contendrá `id`, `name`, `description`, `userId`, `deviceId`, `leanCanvasId`, timestamps
- **Preparación para APIs**: Modelo limpio facilitará implementación de endpoints (Ticket KPI-007)
