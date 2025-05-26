import { z } from "zod";

// Límites de caracteres optimizados para cada campo del Lean Canvas
export const LEAN_CANVAS_LIMITS = {
  problem: 200,
  solution: 250,
  uniqueValueProposition: 150,
  customerSegments: 200,
  channels: 180,
  revenueStreams: 250,
} as const;

// Schema base compartido entre frontend y backend
export const SharedLeanCanvasSchema = z.object({
  problem: z
    .string()
    .min(1, "El problema es requerido")
    .max(
      LEAN_CANVAS_LIMITS.problem,
      `El problema no puede exceder ${LEAN_CANVAS_LIMITS.problem} caracteres`
    )
    .trim(),
  solution: z
    .string()
    .min(1, "La solución es requerida")
    .max(
      LEAN_CANVAS_LIMITS.solution,
      `La solución no puede exceder ${LEAN_CANVAS_LIMITS.solution} caracteres`
    )
    .trim(),
  uniqueValueProposition: z
    .string()
    .min(1, "La propuesta de valor única es requerida")
    .max(
      LEAN_CANVAS_LIMITS.uniqueValueProposition,
      `La propuesta de valor única no puede exceder ${LEAN_CANVAS_LIMITS.uniqueValueProposition} caracteres`
    )
    .trim(),
  customerSegments: z
    .string()
    .min(1, "Los segmentos de cliente son requeridos")
    .max(
      LEAN_CANVAS_LIMITS.customerSegments,
      `Los segmentos de cliente no pueden exceder ${LEAN_CANVAS_LIMITS.customerSegments} caracteres`
    )
    .trim(),
  channels: z
    .string()
    .min(1, "Los canales son requeridos")
    .max(
      LEAN_CANVAS_LIMITS.channels,
      `Los canales no pueden exceder ${LEAN_CANVAS_LIMITS.channels} caracteres`
    )
    .trim(),
  revenueStreams: z
    .string()
    .min(1, "Las fuentes de ingresos son requeridas")
    .max(
      LEAN_CANVAS_LIMITS.revenueStreams,
      `Las fuentes de ingresos no pueden exceder ${LEAN_CANVAS_LIMITS.revenueStreams} caracteres`
    )
    .trim(),
});

// Esquemas derivados para diferentes casos de uso
export const SharedLeanCanvasUpdateSchema = SharedLeanCanvasSchema.partial();

// Tipos TypeScript exportados
export type SharedLeanCanvasInput = z.infer<typeof SharedLeanCanvasSchema>;
export type SharedLeanCanvasUpdateInput = z.infer<typeof SharedLeanCanvasUpdateSchema>;
