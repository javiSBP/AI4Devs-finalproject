# Ticket: KPI-001 - Desarrollar Motor de Cálculo de Métricas Financieras

## Historia de Usuario Relacionada

Visualizar Métricas de Viabilidad (@docs/backlog/calculos-kpis/historia-usuario.md)

## Descripción

Implementar un motor de cálculo que procese los datos financieros del usuario y calcule automáticamente las métricas clave de viabilidad: beneficio mensual, punto de equilibrio, valor del ciclo de vida del cliente (LTV), relación LTV/CAC y margen por cliente. Este motor debe incluir las fórmulas necesarias y generar recomendaciones user-friendly para asegurar resultados precisos y significativos.

## Tareas

- [x] Definir las fórmulas matemáticas para cada métrica a calcular
- [x] Implementar funciones de cálculo para beneficio mensual, punto de equilibrio, LTV, ratio LTV/CAC y margen por cliente
- [x] ~~Desarrollar validaciones para detectar valores extremos o inconsistentes~~ **SIMPLIFICADO** - Las validaciones se manejan en el formulario con Zod
- [x] Crear estructura para clasificar los resultados según niveles de salud (bueno/medio/malo)
- [x] Implementar lógica para generar recomendaciones user-friendly basadas en los resultados (estilo ResultsDisplay.tsx)
- [x] Desarrollar pruebas unitarias para verificar la precisión de los cálculos
- [x] ~~Crear una API interna para que los componentes frontend puedan consumir estos cálculos~~ **ELIMINADO** - Se implementará en un ticket posterior

## Criterios de Aceptación Técnicos

- ✅ Las fórmulas deben seguir estándares financieros reconocidos
- ✅ Los cálculos deben manejar correctamente casos especiales (división por cero, valores negativos)
- ✅ El motor debe generar recomendaciones claras y verbosas
- ✅ La precisión numérica debe ser adecuada para datos financieros
- ✅ El código debe ser modular para facilitar la adición de nuevas métricas en el futuro
- ✅ Las funciones deben estar bien documentadas explicando cada fórmula y sus parámetros

## Referencias Técnicas

- ✅ Implementar como módulo TypeScript con funciones puras
- ✅ ~~Utilizar bibliotecas para manejo preciso de cálculos financieros~~ **SIMPLIFICADO** - Uso de JavaScript nativo
- ✅ Desarrollar pruebas exhaustivas para cada fórmula
- ✅ Implementar manejo de errores robusto

## Dependencias

- ✅ Estructura de datos de inputs financieros (ya manejada en FinancialInputsForm.tsx con Zod)

## Estimación

Medio (6h) - ✅ **COMPLETADO**

## Asignado a

Claude Sonnet 4 - ✅ **COMPLETADO**

## Archivos Implementados

- `src/lib/financial/kpi-calculator.ts` - Motor de cálculo principal simplificado
- `src/lib/financial/kpi-calculator.test.ts` - Tests unitarios (96.5% cobertura, 20 tests)

## Archivos Eliminados (Simplificación)

- ~~`src/lib/api/financial-calculations.ts`~~ - Se implementará en un ticket posterior
- ~~`src/lib/api/financial-calculations.test.ts`~~ - Se implementará en un ticket posterior

## Simplificaciones Realizadas

1. **Validaciones eliminadas**: Las validaciones Zod ya están implementadas en `FinancialInputsForm.tsx`, por lo que se eliminó la validación duplicada en el calculador
2. **Recomendaciones mejoradas**: Se adoptó el estilo de recomendaciones verbosas y user-friendly de `ResultsDisplay.tsx`
3. **API interna removida**: Se eliminó `financial-calculations.ts` para implementar en un ticket posterior de persistencia

## Características Finales

- ✅ Cálculo de 8 KPIs financieros principales
- ✅ Clasificación de salud en 3 niveles (good/medium/bad)
- ✅ 4 tipos de recomendaciones user-friendly:
  - Viabilidad económica
  - Eficiencia de adquisición de clientes
  - Optimización del modelo
  - Próximos pasos
- ✅ Cobertura de tests del 96.5% (20 tests pasando)
- ✅ Manejo robusto de casos edge (división por cero, valores infinitos)
- ✅ TypeScript completamente tipado
