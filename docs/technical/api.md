# API de LeanSim

Este documento especifica la API RESTful para LeanSim, detallando todos los endpoints necesarios para implementar las funcionalidades requeridas en el MVP.

## Consideraciones Generales

### Base URL

Todas las rutas tienen como prefijo: `/api/v1`

### Formato de Respuesta

Todas las respuestas se devuelven en formato JSON con la siguiente estructura:

**Éxito:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

### Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Solicitud inválida (error de validación)
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto con el estado actual del recurso
- `500 Internal Server Error`: Error del servidor

### Autenticación y Seguridad

- Para el MVP no se requiere autenticación de usuarios
- Se utiliza `deviceId` como identificador del dispositivo para relacionar simulaciones con usuarios anónimos
- Se aplica rate limiting para prevenir abusos (máximo 100 solicitudes por hora por IP)

## Endpoints

### 1. Gestión de Simulaciones

#### 1.1 Crear Simulación

Crea una nueva simulación con datos opcionales de Lean Canvas y datos financieros.

**Método:** POST  
**Ruta:** `/api/v1/simulations`

**Headers:**

- `Content-Type: application/json` (obligatorio)
- `X-Device-ID: string` (obligatorio) - Identificador único del dispositivo

**Body:**

```json
{
  "name": "string",
  "leanCanvas": {
    "problem": "string",
    "valueProposition": "string",
    "customerSegment": "string",
    "channels": "string",
    "costRevenueStructure": "string"
  },
  "financialData": {
    "monthlyRevenue": "number",
    "fixedCosts": "number",
    "variableCostsPerCustomer": "number",
    "customerAcquisitionCost": "number",
    "estimatedCustomers": "number",
    "averagePricePerCustomer": "number",
    "customerLifetimeMonths": "number"
  }
}
```

**Validaciones:**

- `name`: Obligatorio, entre 3 y 50 caracteres
- `leanCanvas`: Opcional, todos los campos son cadenas de texto
- `financialData`: Opcional, todos los valores numéricos deben ser mayores o iguales a 0

**Respuesta (201):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "deviceId": "string",
    "calculatedKPIs": null
  }
}
```

**Errores:**

- `400 Bad Request`: Datos inválidos
- `429 Too Many Requests`: Rate limit excedido

#### 1.2 Obtener Simulación

Recupera los detalles completos de una simulación específica.

**Método:** GET  
**Ruta:** `/api/v1/simulations/:id`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `X-Device-ID: string` (obligatorio) - Para verificar que la simulación pertenece al dispositivo

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "deviceId": "string",
    "calculatedKPIs": {
      "monthlyProfit": "number",
      "breakEvenPoint": "number",
      "ltv": "number",
      "ltvCacRatio": "number",
      "customerMargin": "number"
    },
    "leanCanvas": {
      "id": "string",
      "problem": "string",
      "valueProposition": "string",
      "customerSegment": "string",
      "channels": "string",
      "costRevenueStructure": "string"
    },
    "financialData": {
      "id": "string",
      "monthlyRevenue": "number",
      "fixedCosts": "number",
      "variableCostsPerCustomer": "number",
      "customerAcquisitionCost": "number",
      "estimatedCustomers": "number",
      "averagePricePerCustomer": "number",
      "customerLifetimeMonths": "number"
    }
  }
}
```

**Errores:**

- `403 Forbidden`: Dispositivo no autorizado para acceder a esta simulación
- `404 Not Found`: Simulación no encontrada

#### 1.3 Actualizar Simulación

Actualiza los datos de una simulación existente.

**Método:** PUT  
**Ruta:** `/api/v1/simulations/:id`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `Content-Type: application/json` (obligatorio)
- `X-Device-ID: string` (obligatorio) - Para verificar que la simulación pertenece al dispositivo

**Body:**

```json
{
  "name": "string",
  "leanCanvas": {
    "problem": "string",
    "valueProposition": "string",
    "customerSegment": "string",
    "channels": "string",
    "costRevenueStructure": "string"
  },
  "financialData": {
    "monthlyRevenue": "number",
    "fixedCosts": "number",
    "variableCostsPerCustomer": "number",
    "customerAcquisitionCost": "number",
    "estimatedCustomers": "number",
    "averagePricePerCustomer": "number",
    "customerLifetimeMonths": "number"
  }
}
```

**Validaciones:**

- Similares a la creación, pero todos los campos son opcionales
- Solo se actualizan los campos proporcionados

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "updatedAt": "string (ISO date)",
    "calculatedKPIs": {
      "monthlyProfit": "number",
      "breakEvenPoint": "number",
      "ltv": "number",
      "ltvCacRatio": "number",
      "customerMargin": "number"
    }
  }
}
```

**Errores:**

- `400 Bad Request`: Datos inválidos
- `403 Forbidden`: Dispositivo no autorizado para modificar esta simulación
- `404 Not Found`: Simulación no encontrada

#### 1.4 Eliminar Simulación

Elimina una simulación existente.

**Método:** DELETE  
**Ruta:** `/api/v1/simulations/:id`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `X-Device-ID: string` (obligatorio) - Para verificar que la simulación pertenece al dispositivo

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "message": "Simulación eliminada correctamente"
  }
}
```

**Errores:**

- `403 Forbidden`: Dispositivo no autorizado para eliminar esta simulación
- `404 Not Found`: Simulación no encontrada

#### 1.5 Listar Simulaciones

Recupera todas las simulaciones asociadas a un dispositivo.

**Método:** GET  
**Ruta:** `/api/v1/simulations`

**Headers:**

- `X-Device-ID: string` (obligatorio) - Identificador único del dispositivo

**Query Parameters:**

- `page`: Número de página (opcional, por defecto: 1)
- `limit`: Número de elementos por página (opcional, por defecto: 10)
- `sort`: Campo para ordenar (opcional, por defecto: 'updatedAt')
- `order`: Dirección de ordenación ('asc' o 'desc', opcional, por defecto: 'desc')

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "simulations": [
      {
        "id": "string",
        "name": "string",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)",
        "calculatedKPIs": {
          "monthlyProfit": "number",
          "breakEvenPoint": "number",
          "ltv": "number",
          "ltvCacRatio": "number",
          "customerMargin": "number"
        }
      }
    ],
    "pagination": {
      "total": "number",
      "pages": "number",
      "currentPage": "number",
      "limit": "number"
    }
  }
}
```

**Errores:**

- `400 Bad Request`: Parámetros de consulta inválidos

### 2. Actualización de Componentes Individuales

#### 2.1 Actualizar Lean Canvas

Actualiza solo la información de Lean Canvas de una simulación.

**Método:** PATCH  
**Ruta:** `/api/v1/simulations/:id/lean-canvas`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `Content-Type: application/json` (obligatorio)
- `X-Device-ID: string` (obligatorio)

**Body:**

```json
{
  "problem": "string",
  "valueProposition": "string",
  "customerSegment": "string",
  "channels": "string",
  "costRevenueStructure": "string"
}
```

**Validaciones:**

- Todos los campos son opcionales pero deben ser cadenas de texto válidas
- Se actualizarán solo los campos proporcionados

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "problem": "string",
    "valueProposition": "string",
    "customerSegment": "string",
    "channels": "string",
    "costRevenueStructure": "string",
    "updatedAt": "string (ISO date)"
  }
}
```

**Errores:**

- `400 Bad Request`: Datos inválidos
- `403 Forbidden`: Dispositivo no autorizado
- `404 Not Found`: Simulación no encontrada

#### 2.2 Actualizar Datos Financieros

Actualiza solo la información financiera de una simulación.

**Método:** PATCH  
**Ruta:** `/api/v1/simulations/:id/financial-data`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `Content-Type: application/json` (obligatorio)
- `X-Device-ID: string` (obligatorio)

**Body:**

```json
{
  "monthlyRevenue": "number",
  "fixedCosts": "number",
  "variableCostsPerCustomer": "number",
  "customerAcquisitionCost": "number",
  "estimatedCustomers": "number",
  "averagePricePerCustomer": "number",
  "customerLifetimeMonths": "number"
}
```

**Validaciones:**

- Todos los campos son opcionales pero deben ser números válidos
- Los valores numéricos deben ser mayores o iguales a 0
- Los campos `estimatedCustomers`, `averagePricePerCustomer` y `customerLifetimeMonths` deben ser mayores que 0 si se proporcionan

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "id": "string",
    "monthlyRevenue": "number",
    "fixedCosts": "number",
    "variableCostsPerCustomer": "number",
    "customerAcquisitionCost": "number",
    "estimatedCustomers": "number",
    "averagePricePerCustomer": "number",
    "customerLifetimeMonths": "number",
    "updatedAt": "string (ISO date)"
  }
}
```

**Errores:**

- `400 Bad Request`: Datos inválidos
- `403 Forbidden`: Dispositivo no autorizado
- `404 Not Found`: Simulación no encontrada

### 3. Cálculo de KPIs

#### 3.1 Calcular KPIs

Calcula o recalcula los KPIs basados en los datos financieros existentes.

**Método:** POST  
**Ruta:** `/api/v1/simulations/:id/calculate-kpis`

**Path Parameters:**

- `id`: ID único de la simulación (string)

**Headers:**

- `X-Device-ID: string` (obligatorio)

**Respuesta (200):**

```json
{
  "success": true,
  "data": {
    "simulationId": "string",
    "calculatedKPIs": {
      "monthlyProfit": "number",
      "breakEvenPoint": "number",
      "ltv": "number",
      "ltvCacRatio": "number",
      "customerMargin": "number"
    }
  }
}
```

**Errores:**

- `403 Forbidden`: Dispositivo no autorizado
- `404 Not Found`: Simulación no encontrada
- `422 Unprocessable Entity`: Datos financieros incompletos o inválidos para el cálculo

### 4. Sistema de Ayudas Contextuales

#### 4.1 Obtener Ayudas Contextuales

Recupera el contenido de ayuda contextual para campos específicos.

**Método:** GET  
**Ruta:** `/api/v1/contextual-help`

**Query Parameters:**

- `fieldKey`: Clave del campo para el que se solicita ayuda (opcional)

**Respuesta (200) - Con fieldKey:**

```json
{
  "success": true,
  "data": {
    "fieldKey": "string",
    "description": "string",
    "example": "string"
  }
}
```

**Respuesta (200) - Sin fieldKey (todas las ayudas):**

```json
{
  "success": true,
  "data": [
    {
      "fieldKey": "string",
      "description": "string",
      "example": "string"
    }
  ]
}
```

**Errores:**

- `404 Not Found`: Campo de ayuda no encontrado

## Modelos de Datos

### Simulation

```typescript
interface Simulation {
  id: string; // CUID generado automáticamente
  name: string; // Nombre de la simulación
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
  deviceId: string; // ID del dispositivo que creó la simulación
  calculatedKPIs: KPIs | null; // KPIs calculados o null
}
```

### LeanCanvas

```typescript
interface LeanCanvas {
  id: string; // CUID generado automáticamente
  problem: string; // Descripción del problema
  valueProposition: string; // Propuesta de valor
  customerSegment: string; // Segmento de clientes
  channels: string; // Canales de distribución
  costRevenueStructure: string; // Estructura de costes e ingresos
  simulationId: string; // ID de la simulación relacionada
}
```

### FinancialData

```typescript
interface FinancialData {
  id: string; // CUID generado automáticamente
  monthlyRevenue: number; // Ingresos mensuales
  fixedCosts: number; // Costes fijos
  variableCostsPerCustomer: number; // Costes variables por cliente
  customerAcquisitionCost: number; // Coste de adquisición de clientes
  estimatedCustomers: number; // Número estimado de clientes
  averagePricePerCustomer: number; // Precio medio por cliente
  customerLifetimeMonths: number; // Duración media del cliente en meses
  simulationId: string; // ID de la simulación relacionada
}
```

### KPIs

```typescript
interface KPIs {
  monthlyProfit: number; // Beneficio mensual
  breakEvenPoint: number; // Punto de equilibrio
  ltv: number; // Lifetime Value (valor del ciclo de vida del cliente)
  ltvCacRatio: number; // Relación LTV/CAC
  customerMargin: number; // Margen por cliente
}
```

### ContextualHelp

```typescript
interface ContextualHelp {
  id: string; // CUID generado automáticamente
  fieldKey: string; // Clave única del campo
  description: string; // Descripción explicativa
  example: string; // Ejemplo ilustrativo
}
```

## Consideraciones de Seguridad

### Protección contra Abusos

- **Rate Limiting**: Límite de 100 solicitudes por hora por IP para prevenir abusos
- **Validación de Headers**: Todas las solicitudes deben incluir el header `X-Device-ID`
- **Validación de Datos**: Todos los inputs se validan estrictamente antes de procesarse

### Prevención de Ataques

- **Sanitización de Entradas**: Todos los inputs del usuario son sanitizados para prevenir inyecciones
- **Protección XSS**: Implementación de Content Security Policy (CSP)
- **CORS**: Configuración adecuada para permitir solo orígenes conocidos

### Protección de Datos

- **Validación de Dispositivo**: La cabecera `X-Device-ID` se utiliza para asegurar que solo el dispositivo que creó una simulación puede acceder o modificarla
- **Sin Datos Sensibles**: La aplicación no maneja datos personales sensibles en esta fase MVP

## Implementación Recomendada

La API debe implementarse utilizando los API Routes de Next.js, aprovechando las capacidades de serverless functions con las siguientes herramientas:

- **Validación**: [Zod](https://github.com/colinhacks/zod) para validación con TypeScript
- **ORM**: [Prisma](https://www.prisma.io/) para acceso a base de datos
- **Rate Limiting**: Middleware personalizado o paquete como `next-rate-limit`
- **Sanitización**: Uso de `validator.js` o funciones personalizadas
