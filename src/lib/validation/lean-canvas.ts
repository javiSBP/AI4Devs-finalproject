import { z } from "zod";
import {
  SharedLeanCanvasSchema,
  SharedLeanCanvasUpdateSchema,
  type SharedLeanCanvasInput,
  type SharedLeanCanvasUpdateInput,
} from "./shared/lean-canvas";

// Re-export shared schemas for use in frontend forms
export const LeanCanvasSchema = SharedLeanCanvasSchema;
export const LeanCanvasUpdateSchema = SharedLeanCanvasUpdateSchema;

// Device ID validation - More permissive for browser-generated IDs
export const DeviceIdSchema = z
  .string()
  .min(1, "Device ID es requerido")
  .max(100, "Device ID inválido")
  .regex(/^[a-zA-Z0-9._+=/-]+$/, "Device ID contiene caracteres inválidos");

// Query parameters for listing
export const ListQuerySchema = z.object({
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

// Type exports (using shared types)
export type LeanCanvasInput = SharedLeanCanvasInput;
export type LeanCanvasUpdateInput = SharedLeanCanvasUpdateInput;
export type ListQueryInput = z.infer<typeof ListQuerySchema>;
