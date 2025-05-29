# Tests E2E para Validaciones del Formulario Financiero

## Propósito

Este documento describe los tests E2E que deben implementarse con Playwright para validar el comportamiento de las validaciones `onBlur` en el formulario de inputs financieros, ya que estos comportamientos son difíciles de testear con tests unitarios.

## Tests Requeridos

### 1. Validaciones Básicas onBlur

```typescript
test("muestra error de validación al perder foco con valores negativos", async ({ page }) => {
  await page.goto("/simulation");

  // Completar Lean Canvas primero
  await completeLeanCanvas(page);

  // Ir al formulario financiero
  await page.click('[data-testid="next-step"]');

  // Ingresar valor negativo y perder foco
  await page.fill('[name="averagePrice"]', "-10");
  await page.press('[name="averagePrice"]', "Tab");

  // Verificar mensaje de error
  await expect(page.locator("text=El precio medio debe ser mayor o igual a 0")).toBeVisible();
});
```

### 2. Validaciones de Límites Máximos

```typescript
test("muestra error cuando el valor excede límites máximos", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Ingresar valor que excede el límite
  await page.fill('[name="averagePrice"]', "1000001");
  await page.press('[name="averagePrice"]', "Tab");

  await expect(page.locator("text=El precio medio no puede exceder 1000000 euros")).toBeVisible();
});
```

### 3. Validaciones de Reglas de Negocio

```typescript
test("muestra error cuando coste >= precio", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Configurar precio y coste con conflicto
  await page.fill('[name="averagePrice"]', "100");
  await page.press('[name="averagePrice"]', "Tab");

  await page.fill('[name="costPerUnit"]', "100");
  await page.press('[name="costPerUnit"]', "Tab");

  await expect(
    page.locator("text=El coste por unidad no puede ser mayor o igual al precio medio")
  ).toBeVisible();
});
```

### 4. Advertencias de Margen Bajo

```typescript
test("muestra advertencia con margen menor a 5%", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Configurar margen del 4%
  await page.fill('[name="averagePrice"]', "100");
  await page.press('[name="averagePrice"]', "Tab");

  await page.fill('[name="costPerUnit"]', "96");
  await page.press('[name="costPerUnit"]', "Tab");

  await expect(page.locator("text=El margen unitario parece muy bajo")).toBeVisible();
});
```

### 5. Advertencias CAC/LTV

```typescript
test("muestra advertencia con ratio CAC/LTV alto", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Configurar ratio CAC/LTV > 0.5
  await page.fill('[name="averagePrice"]', "100");
  await page.press('[name="averagePrice"]', "Tab");

  await page.fill('[name="costPerUnit"]', "50");
  await page.press('[name="costPerUnit"]', "Tab");

  await page.fill('[name="customerAcquisitionCost"]', "400");
  await page.press('[name="customerAcquisitionCost"]', "Tab");

  await page.fill('[name="averageCustomerLifetime"]', "12");
  await page.press('[name="averageCustomerLifetime"]', "Tab");

  await expect(page.locator("text=El CAC parece muy alto comparado con el LTV")).toBeVisible();
});
```

### 6. Re-validación onChange

```typescript
test("re-valida en onChange después de primera validación", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Primero ingresar valor inválido para activar validación
  await page.fill('[name="averagePrice"]', "-10");
  await page.press('[name="averagePrice"]', "Tab");

  // Verificar error
  await expect(page.locator("text=El precio medio debe ser mayor o igual a 0")).toBeVisible();

  // Cambiar a valor válido - debería re-validar inmediatamente
  await page.fill('[name="averagePrice"]', "50");

  // El error debería desaparecer sin necesidad de blur
  await expect(page.locator("text=El precio medio debe ser mayor o igual a 0")).not.toBeVisible();
});
```

### 7. Valores Válidos Sin Errores

```typescript
test("acepta valores válidos sin mostrar errores", async ({ page }) => {
  await page.goto("/simulation");
  await completeLeanCanvas(page);
  await page.click('[data-testid="next-step"]');

  // Ingresar valores válidos
  await page.fill('[name="averagePrice"]', "100");
  await page.press('[name="averagePrice"]', "Tab");

  await page.fill('[name="costPerUnit"]', "50");
  await page.press('[name="costPerUnit"]', "Tab");

  // No debería haber mensajes de error
  await expect(page.locator("text=debe ser mayor o igual a 0")).not.toBeVisible();
  await expect(page.locator("text=no puede exceder")).not.toBeVisible();
});
```

## Función Helper

```typescript
async function completeLeanCanvas(page: Page) {
  // Completar campos mínimos del Lean Canvas
  await page.fill('[name="problem"]', "Problema de prueba");
  await page.fill('[name="solution"]', "Solución de prueba");
  await page.fill('[name="uniqueValueProposition"]', "UVP de prueba");
  await page.fill('[name="customerSegments"]', "Segmento de prueba");
  await page.fill('[name="channels"]', "Canales de prueba");
  await page.fill('[name="revenueStreams"]', "Ingresos de prueba");
}
```

## Configuración

Estos tests deben estar en el archivo `src/e2e/financial-form-validations.spec.ts` y utilizar la configuración de Playwright existente.

## Importancia

Estos tests E2E son cruciales porque:

1. Validan el comportamiento real del usuario (blur, focus, cambios)
2. Verifican la integración completa de React Hook Form + Zod
3. Confirman que las validaciones aparecen en el momento correcto
4. Aseguran que la UX de validación es fluida

## Notas de Implementación

- Configurar `mode: "onBlur"` y `reValidateMode: "onChange"` está implementado
- Las validaciones Zod compartidas están funcionando
- Los tests unitarios cubren la UI y estructura básica
- Los tests E2E complementan verificando el comportamiento interactivo
