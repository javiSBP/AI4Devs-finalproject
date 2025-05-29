import { z } from "zod";
import {
  SharedFinancialInputsSchema,
  SharedFinancialInputsUpdateSchema,
  FinancialInputsBusinessRulesSchema,
  type SharedFinancialInputsInput,
  type SharedFinancialInputsUpdateInput,
} from "./shared/financial-inputs";

// Re-export shared schemas for backward compatibility
export const FinancialInputsSchema = SharedFinancialInputsSchema;
export const FinancialInputsUpdateSchema = SharedFinancialInputsUpdateSchema;
export const FinancialInputsWithBusinessRulesSchema = FinancialInputsBusinessRulesSchema;

// Schema for creating a new Simulation with financial inputs
export const CreateSimulationSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .trim(),
    description: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .trim()
      .optional(),
    leanCanvasId: z.string().cuid("ID de Lean Canvas inválido").optional(),
  })
  .merge(FinancialInputsSchema.partial());

// Schema for updating an existing Simulation
export const UpdateSimulationSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .trim()
      .optional(),
    leanCanvasId: z.string().cuid("ID de Lean Canvas inválido").optional(),
  })
  .merge(FinancialInputsUpdateSchema);

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
      (val) => ["createdAt", "updatedAt", "name", "averagePrice"].includes(val),
      "Campo de ordenamiento inválido"
    ),
  order: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || "desc")
    .refine((val) => ["asc", "desc"].includes(val), "Orden inválido"),
});

// Type exports (using shared types)
export type FinancialInputsInput = SharedFinancialInputsInput;
export type FinancialInputsUpdateInput = SharedFinancialInputsUpdateInput;
export type CreateSimulationInput = z.infer<typeof CreateSimulationSchema>;
export type UpdateSimulationInput = z.infer<typeof UpdateSimulationSchema>;
export type ListSimulationsQueryInput = z.infer<typeof ListSimulationsQuerySchema>;
