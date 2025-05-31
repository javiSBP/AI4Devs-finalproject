# Ticket: KPI-006 - API y Modelo de Datos para Persistencia de Métricas

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Desarrollar la infraestructura de API necesaria para persistir y recuperar simulaciones completas que incluyen datos del Lean Canvas, inputs financieros y resultados calculados. El objetivo es centralizar toda la información en un único endpoint, eliminando la API de lean-canvas actual que no está siendo utilizada y simplificando la arquitectura del proyecto.

**Contexto actual**: Los datos se guardan únicamente en localStorage y se calculan en tiempo real. Los formularios `LeanCanvasForm.tsx`, `FinancialInputsForm.tsx` y los resultados de `ResultsDisplay.tsx` están integrados en un wizard pero sin persistencia en base de datos.

## Tareas (Movidas desde Ticket-2)

### Revisión de Modelo de Datos

- [ ] **Revisar campos de `FinancialInputs`**: Verificar que coinciden con los datos de `FinancialInputsForm.tsx`
- [ ] **Revisar campos de `SimulationResults`**: Verificar que coinciden con los KPIs de `kpi-calculator.ts` y `ResultsDisplay.tsx`
- [ ] **Revisar campos de `LeanCanvas`**: Verificar que el modelo existente coincide con `LeanCanvasForm.tsx`
- [ ] Configurar relaciones entre los modelos para la simulación completa

### Eliminación de API Actual

- [ ] **Eliminar `src/lib/api/lean-canvas.ts`**: API actual que no está siendo utilizada
- [ ] **Eliminar `src/lib/api/lean-canvas.test.ts`**: Tests correspondientes
- [ ] **Eliminar endpoints API existentes**: `/api/v1/lean-canvas/*` que están sin uso
- [ ] **Mantener validaciones shared**: Conservar `/src/lib/validation/shared/` intacto (usado por formularios frontend)
- [ ] **Simplificar validaciones nivel superior**: Limpiar esquemas no usados en `/src/lib/validation/` tras eliminar APIs de lean-canvas

### Endpoints API Centralizados

- [ ] **POST /api/v1/simulations**: Crear simulación completa con:
  - Datos del Lean Canvas (`LeanCanvasForm.tsx`)
  - Inputs financieros (`FinancialInputsForm.tsx`)
  - Resultados calculados (`ResultsDisplay.tsx` + `kpi-calculator.ts`)
- [ ] **GET /api/v1/simulations/[id]**: Recuperar simulación completa
- [ ] **PUT /api/v1/simulations/[id]**: Actualizar simulación completa
- [ ] **GET /api/v1/simulations**: Listar simulaciones con paginación (para historial)

### Integración con Frontend

- [ ] **Actualizar `src/app/simulation/page.tsx`**: Reemplazar localStorage con llamadas API
- [ ] **Migrar de cálculo inline**: Usar `kpi-calculator.ts` en lugar del cálculo directo en el componente
- [ ] **Mantener cálculo en tiempo real**: Los KPIs se calculan en frontend, persistencia es opcional

## Criterios de Aceptación Técnicos

- **Centralización**: Un único endpoint maneja toda la información de la simulación
- **Validaciones backend**: Reutilizar esquemas Zod existentes en `src/lib/validation/`
- **Compatibilidad**: Mantener interfaces TypeScript existentes
- **Simplificación**: Eliminar APIs no utilizadas (lean-canvas actual)
- **Migración limpia**: Datos de localStorage pueden importarse al nuevo sistema
- **Manejo de errores**: Respuestas API consistentes y robustas

## Referencias Técnicas

- **Eliminar completamente**: API endpoints y funciones de `lean-canvas.ts` actual
- **Reutilizar modelos**: `Simulation`, `LeanCanvas`, `FinancialInputs`, `SimulationResults` existentes
- **Mantener validaciones shared**: Esquemas en `/src/lib/validation/shared/` (usados por formularios)
- **Simplificar validaciones nivel superior**: Limpiar esquemas de APIs eliminadas
- **Integrar con**: `kpi-calculator.ts` para cálculos consistentes
- **Seguir patrón**: APIs existentes de `/api/v1/` para consistencia

## Dependencias

- ✅ Ticket KPI-001 (Motor de Cálculo) **COMPLETADO**
- ✅ Modelos Prisma existentes: `Simulation`, `LeanCanvas`, `FinancialInputs`, `SimulationResults`
- ✅ Validaciones Zod: `lean-canvas.ts`, `financial-inputs.ts`, `shared/`
- ✅ Formularios frontend: `LeanCanvasForm.tsx`, `FinancialInputsForm.tsx`

## Estimación

~~Medio (3-4h)~~ **REDUCIDO A 2-3h** - Los modelos ya existen, eliminamos código no usado

## Asignado a

TBD

## Tareas Específicas Detalladas

### Verificación de Modelos (30min)

- [ ] **FinancialInputs vs FinancialInputsForm**:
  - ✅ 6 campos númericos coinciden exactamente
  - ✅ `validationWarnings`, `calculationNotes` para metadatos
- [ ] **SimulationResults vs ResultsDisplay**:
  - ✅ 8 KPIs coinciden con `calculateResults()` actual
  - ✅ 3 health indicators, recommendations JSON
- [ ] **LeanCanvas vs LeanCanvasForm**:
  - ✅ 6 campos de texto coinciden exactamente
  - ✅ Límites de caracteres consistentes

### Limpieza de Código No Usado (45min)

- [ ] **Eliminar archivos**:
  - `src/lib/api/lean-canvas.ts` (154 líneas)
  - `src/lib/api/lean-canvas.test.ts` (316 líneas)
  - `src/app/api/v1/lean-canvas/route.ts`
  - `src/app/api/v1/lean-canvas/[id]/route.ts`
- [ ] **Conservar validaciones shared**: Todo `/src/lib/validation/shared/` se mantiene intacto (frontend los usa directamente)
- [ ] **Simplificar validaciones nivel superior**:
  - Limpiar `src/lib/validation/lean-canvas.ts` de esquemas API no usados (`CreateLeanCanvasSchema`, etc.)
  - Mantener `src/lib/validation/financial-inputs.ts` para APIs de simulations

### API Endpoints Nuevos (60-90min)

- [ ] **POST /api/v1/simulations**: Endpoint unificado que guarda:
  ```typescript
  {
    name: string,
    leanCanvas: LeanCanvasData,
    financialInputs: FinancialData,
    results: CalculationResult
  }
  ```
- [ ] **GET endpoints**: Para recuperación y listado
- [ ] **Integración**: Con `kpi-calculator.ts` para validar resultados

### Frontend Migration (30min)

- [ ] **Actualizar `simulation/page.tsx`**: Reemplazar localStorage con API calls
- [ ] **Usar kpi-calculator**: Reemplazar `calculateResults()` inline

## Beneficios de esta Aproximación

1. **Simplificación**: Un solo endpoint en lugar de múltiples APIs
2. **Consistency**: Datos relacionados se guardan juntos atómicamente
3. **Eliminación de dead code**: API de lean-canvas no está en uso
4. **Validaciones centralizadas**: Backend mantiene todas las validaciones Zod
5. **Migración gradual**: localStorage puede coexistir inicialmente

## Notas de Implementación

- **Arquitectura de validaciones**:
  - `/shared/` contiene esquemas base compartidos frontend/backend ✅ CONSERVAR
  - `/nivel superior` contiene extensiones para APIs backend ⚠️ LIMPIAR tras eliminar lean-canvas API
- **Transacción atómica**: Lean Canvas + Financial Inputs + Results en una sola operación
- **Device ID**: Seguir patrón existente para identificación de usuario
- **JSON handling**: Serialización correcta de recommendations y health indicators
