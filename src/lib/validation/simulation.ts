import { z } from "zod";
import { SharedLeanCanvasSchema } from "./shared/lean-canvas";
import { SharedFinancialInputsSchema } from "./shared/financial-inputs";

// Schema para crear una simulación completa con Lean Canvas + Financial Inputs
export const CreateCompleteSimulationSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim(),
  description: z
    .string()
    .max(150, "La descripción no puede exceder 150 caracteres")
    .trim()
    .optional(),
  leanCanvas: SharedLeanCanvasSchema,
  financialInputs: SharedFinancialInputsSchema,
});

// Schema para actualizar una simulación completa
export const UpdateCompleteSimulationSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim()
    .optional(),
  description: z
    .string()
    .max(150, "La descripción no puede exceder 150 caracteres")
    .trim()
    .optional(),
  leanCanvas: SharedLeanCanvasSchema.partial().optional(),
  financialInputs: SharedFinancialInputsSchema.partial().optional(),
});

// Device ID validation - More permissive for browser-generated IDs
export const DeviceIdSchema = z
  .string()
  .min(1, "Device ID es requerido")
  .max(100, "Device ID inválido")
  .regex(/^[a-zA-Z0-9._+=/-]+$/, "Device ID contiene caracteres inválidos");

// Query parameters for listing simulations
export const ListSimulationsQuerySchema = z.object({
  page: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "La página debe ser mayor a 0"),
  limit: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 50, "El límite debe estar entre 1 y 50"),
  sort: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || "updatedAt")
    .refine(
      (val) => ["createdAt", "updatedAt", "name"].includes(val),
      "Campo de ordenamiento inválido"
    ),
  order: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || "desc")
    .refine((val) => ["asc", "desc"].includes(val), "Orden inválido"),
});

// Type exports
export type CreateCompleteSimulationInput = z.infer<typeof CreateCompleteSimulationSchema>;
export type UpdateCompleteSimulationInput = z.infer<typeof UpdateCompleteSimulationSchema>;
export type ListSimulationsQueryInput = z.infer<typeof ListSimulationsQuerySchema>;
