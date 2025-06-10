import type { z } from "zod";
import type {
  SharedLeanCanvasSchema,
  SharedLeanCanvasUpdateSchema,
} from "@/lib/validation/shared/lean-canvas";
import { LeanCanvasSchema, LeanCanvasUpdateSchema } from "@/lib/validation/lean-canvas";

// Main LeanCanvas type based on validation schema
export type LeanCanvasData = z.infer<typeof SharedLeanCanvasSchema>;
export type LeanCanvasUpdateData = z.infer<typeof SharedLeanCanvasUpdateSchema>;
export type CreateLeanCanvasData = z.infer<typeof LeanCanvasSchema>;
export type UpdateLeanCanvasData = z.infer<typeof LeanCanvasUpdateSchema>;

// API Response types
export interface LeanCanvasResponse {
  id: string;
  problem: string;
  solution: string;
  uniqueValueProposition: string;
  customerSegments: string;
  channels: string;
  revenueStreams: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeanCanvasListResponse {
  leanCanvases: LeanCanvasResponse[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Form state types
export interface LeanCanvasFormState {
  data: LeanCanvasData;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Storage types
export interface StoredLeanCanvas {
  id: string;
  data: LeanCanvasData;
  timestamp: number;
  isTemporary: boolean;
}
