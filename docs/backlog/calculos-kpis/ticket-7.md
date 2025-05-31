# Ticket: KPI-007 - API Endpoints y Integración Frontend para Persistencia

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Desarrollar los endpoints API centralizados para persistir y recuperar simulaciones completas, junto con la integración frontend que reemplace localStorage por llamadas API. Este ticket se enfoca en la implementación de la capa de API y la migración del frontend para usar la persistencia en base de datos.

**Contexto**: Tras la limpieza del modelo de datos y eliminación de campos legacy (Ticket KPI-006), necesitamos implementar los endpoints API que trabajen con la nueva arquitectura limpia y actualizar el frontend para consumir estos endpoints.

## Tareas

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

- **Endpoints RESTful**: Siguiendo patrón `/api/v1/` existente
- **Validaciones backend**: Reutilizar esquemas Zod existentes en `src/lib/validation/`
- **Transacciones atómicas**: Lean Canvas + Financial Inputs + Results en una operación
- **Manejo de errores**: Respuestas API consistentes y robustas
- **Migración gradual**: localStorage puede coexistir inicialmente como fallback
- **Cálculo consistente**: Usar `kpi-calculator.ts` tanto en frontend como backend

## Referencias Técnicas

- **Seguir patrón**: APIs existentes de `/api/v1/` para consistencia
- **Integrar con**: `kpi-calculator.ts` para cálculos consistentes
- **Usar modelos limpios**: `Simulation` (sin legacy), `LeanCanvas`, `FinancialInputs`, `SimulationResults`
- **Validaciones centralizadas**: Esquemas en `/src/lib/validation/shared/`
- **Device ID**: Seguir patrón existente para identificación de usuario

## Dependencias

- ✅ Ticket KPI-001 (Motor de Cálculo) **COMPLETADO**
- ⏳ Ticket KPI-006 (Limpieza de Modelo de Datos) **PREREQUISITO**
- ✅ Validaciones Zod: `lean-canvas.ts`, `financial-inputs.ts`, `shared/`
- ✅ Formularios frontend: `LeanCanvasForm.tsx`, `FinancialInputsForm.tsx`

## Asignado a

TBD

## Tareas Específicas Detalladas

### API Endpoints Nuevos

- [ ] **POST /api/v1/simulations**: Endpoint unificado que guarda:
  ```typescript
  {
    name: string,
    leanCanvas: LeanCanvasData,
    financialInputs: FinancialData,
    results: CalculationResult
  }
  ```
- [ ] **GET /api/v1/simulations/[id]**:
  - Recuperar simulación completa con todas las relaciones
  - Include: `leanCanvas`, `financialInputs`, `results`
- [ ] **PUT /api/v1/simulations/[id]**:
  - Actualizar simulación completa
  - Recalcular resultados si cambian inputs financieros
- [ ] **GET /api/v1/simulations**:
  - Listar simulaciones con paginación
  - Filtros por deviceId y userId
  - Ordenamiento por fecha de creación
- [ ] **Integración**: Con `kpi-calculator.ts` para validar y recalcular resultados

### Frontend Migration

- [ ] **Actualizar `src/app/simulation/page.tsx`**:
  - Reemplazar localStorage con API calls
  - Mantener localStorage como fallback durante transición
- [ ] **Usar kpi-calculator**:
  - Reemplazar `calculateResults()` inline
  - Usar `calculateFinancialMetrics()` del motor KPI
- [ ] **Manejo de estados**:
  - Loading states para llamadas API
  - Error handling y retry logic
- [ ] **Sincronización**:
  - Auto-save opcional
  - Conflicto resolution si hay cambios concurrentes

### Testing y Validación

- [ ] **Tests API endpoints**:
  - Tests unitarios para cada endpoint
  - Validación de esquemas Zod
  - Manejo de errores
- [ ] **Tests integración frontend**:
  - Verificar migración de localStorage
  - Testing de cálculos con `kpi-calculator.ts`

## Beneficios de esta Separación

1. **Enfoque específico**: API y frontend en ticket separado
2. **Dependencias claras**: Prerequiere limpieza de modelo (Ticket-6)
3. **Testing independiente**: Endpoints y frontend se pueden probar por separado
4. **Rollback seguro**: Frontend puede seguir usando localStorage si API falla

## Notas de Implementación

- **Transacción atómica**: Crear Lean Canvas + Financial Inputs + Results en una sola operación
- **Device ID**: Seguir patrón existente para identificación de usuario
- **JSON handling**: Serialización correcta de recommendations y health indicators
- **Error responses**: Formato consistente con APIs existentes
- **Validación doble**: Frontend (UX) + Backend (seguridad)
- **Cálculo server-side**: Validar resultados del frontend con `kpi-calculator.ts`

## Estructura Endpoint Principal

```typescript
// POST /api/v1/simulations
{
  name: string;
  description?: string;
  leanCanvas: {
    name: string;
    problem?: string;
    solution?: string;
    uniqueValueProposition?: string;
    customerSegments?: string;
    channels?: string;
    revenueStreams?: string;
  };
  financialInputs: {
    averagePrice: number;
    costPerUnit: number;
    fixedCosts: number;
    customerAcquisitionCost: number;
    monthlyNewCustomers: number;
    averageCustomerLifetime: number;
  };
  // results se calculan automáticamente en backend
}
```
