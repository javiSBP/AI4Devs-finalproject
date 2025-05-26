# Validaciones Compartidas

Este directorio contiene esquemas de validación Zod que se comparten entre el frontend y backend para garantizar consistencia.

## 📁 Estructura

```
shared/
├── lean-canvas.ts    # Validaciones para Lean Canvas
└── README.md         # Esta documentación
```

## 🎯 Beneficios

- **DRY (Don't Repeat Yourself)**: Una sola fuente de verdad para las validaciones
- **Consistencia**: Frontend y backend usan exactamente las mismas reglas
- **Mantenibilidad**: Cambios en un solo lugar se reflejan en toda la aplicación
- **Type Safety**: TypeScript garantiza que los tipos coincidan

## 📏 Límites de Caracteres Optimizados

Los límites están basados en mejores prácticas del Lean Canvas:

| Campo                | Límite | Razón                                  |
| -------------------- | ------ | -------------------------------------- |
| Problema             | 200    | Debe ser conciso y específico          |
| Solución             | 250    | Necesita más detalle que el problema   |
| Propuesta de Valor   | 150    | Debe ser un "elevator pitch" corto     |
| Segmentos de Cliente | 200    | Descripción clara pero concisa         |
| Canales              | 180    | Lista de canales principales           |
| Ingresos/Costes      | 250    | Puede necesitar más detalle financiero |

## 🔧 Uso

### Frontend

```typescript
import { SharedLeanCanvasSchema, LEAN_CANVAS_LIMITS } from "@/lib/validation/shared/lean-canvas";

// Usar en formularios
const form = useForm({
  resolver: zodResolver(SharedLeanCanvasSchema)
});

// Usar límites en UI
<input maxLength={LEAN_CANVAS_LIMITS.problem} />
```

### Backend

```typescript
import { LeanCanvasSchema } from "@/lib/validation/lean-canvas";

// El backend automáticamente usa los esquemas compartidos
const validatedData = LeanCanvasSchema.parse(requestBody);
```

## ✅ Ventajas de esta Arquitectura

1. **Sincronización automática**: Cambiar un límite actualiza frontend y backend
2. **Mensajes de error consistentes**: Mismos mensajes en toda la aplicación
3. **Fácil mantenimiento**: Un solo archivo para modificar validaciones
4. **Prevención de bugs**: Imposible que frontend y backend se desincronicen
