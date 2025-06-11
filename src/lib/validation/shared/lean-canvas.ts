import { z } from "zod";

// Límites de caracteres optimizados para cada campo del Lean Canvas
export const LEAN_CANVAS_LIMITS = {
  problem: 500,
  solution: 500,
  uniqueValueProposition: 500,
  customerSegments: 500,
  channels: 500,
  revenueStreams: 500,
} as const;

// Límites para metadatos de simulación
export const SIMULATION_METADATA_LIMITS = {
  name: 50,
  description: 250,
} as const;

// Schema para metadatos de simulación
export const SimulationMetadataSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(
      SIMULATION_METADATA_LIMITS.name,
      `El nombre no puede exceder ${SIMULATION_METADATA_LIMITS.name} caracteres`
    )
    .trim(),
  description: z
    .string()
    .max(
      SIMULATION_METADATA_LIMITS.description,
      `La descripción no puede exceder ${SIMULATION_METADATA_LIMITS.description} caracteres`
    )
    .trim()
    .optional(),
});

// Schema base compartido entre frontend y backend para Lean Canvas
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

// Schema combinado para el primer paso del wizard
export const FirstStepSchema = z.object({
  metadata: SimulationMetadataSchema,
  leanCanvas: SharedLeanCanvasSchema,
});

// Esquemas derivados para diferentes casos de uso
export const SharedLeanCanvasUpdateSchema = SharedLeanCanvasSchema.partial();

// Tipos TypeScript exportados
export type SharedLeanCanvasInput = z.infer<typeof SharedLeanCanvasSchema>;
export type SharedLeanCanvasUpdateInput = z.infer<typeof SharedLeanCanvasUpdateSchema>;
export type SimulationMetadataInput = z.infer<typeof SimulationMetadataSchema>;
export type FirstStepInput = z.infer<typeof FirstStepSchema>;
