import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Standard API response format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Success response helper
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

// Error response helper
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

// Validation error response helper
export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos proporcionados no son válidos",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
    },
    { status: 400 }
  );
}

// Common error responses
export const CommonErrors = {
  UNAUTHORIZED: () => errorResponse("UNAUTHORIZED", "No autorizado", 401),
  FORBIDDEN: () => errorResponse("FORBIDDEN", "Acceso denegado", 403),
  NOT_FOUND: () => errorResponse("NOT_FOUND", "Recurso no encontrado", 404),
  METHOD_NOT_ALLOWED: () => errorResponse("METHOD_NOT_ALLOWED", "Método no permitido", 405),
  CONFLICT: () => errorResponse("CONFLICT", "Conflicto con el estado actual del recurso", 409),
  RATE_LIMITED: () => errorResponse("RATE_LIMITED", "Límite de solicitudes excedido", 429),
  INTERNAL_ERROR: () => errorResponse("INTERNAL_ERROR", "Error interno del servidor", 500),
  DEVICE_ID_REQUIRED: () => errorResponse("DEVICE_ID_REQUIRED", "Device ID es requerido", 400),
  INVALID_DEVICE_ID: () => errorResponse("INVALID_DEVICE_ID", "Device ID inválido", 400),
};
