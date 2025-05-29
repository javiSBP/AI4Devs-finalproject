import { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  UpdateSimulationSchema,
  FinancialInputsUpdateSchema,
} from "@/lib/validation/financial-inputs";
import {
  getSimulation,
  updateSimulation,
  updateSimulationFinancials,
  deleteSimulation,
  duplicateSimulation,
} from "@/lib/api/simulations";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  CommonErrors,
} from "@/lib/api/response";
import { applyMiddleware, getSecurityHeaders } from "@/lib/api/middleware";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/v1/simulations/[id]
 * Get a specific simulation
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { id } = await params; // Await params in Next.js 15

    // Get simulation
    const result = await getSimulation(id, deviceId);

    if (!result.success) {
      if (result.error === "Simulation not found") {
        return CommonErrors.NOT_FOUND();
      }
      return errorResponse("FETCH_FAILED", result.error || "Failed to fetch simulation", 500);
    }

    const response = successResponse(result.data);

    // Add security headers
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error in GET /api/v1/simulations/[id]:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

/**
 * PUT /api/v1/simulations/[id]
 * Update a simulation completely
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { id } = await params; // Await params in Next.js 15
    const body = await request.json();

    // Validate request body
    const validatedData = UpdateSimulationSchema.parse(body);

    // Update simulation
    const result = await updateSimulation(id, validatedData, deviceId);

    if (!result.success) {
      if (result.error === "Simulation not found") {
        return CommonErrors.NOT_FOUND();
      }
      return errorResponse("UPDATE_FAILED", result.error || "Failed to update simulation", 500);
    }

    const response = successResponse(result.data);

    // Add security headers
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    console.error("Error in PUT /api/v1/simulations/[id]:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

/**
 * PATCH /api/v1/simulations/[id]
 * Update simulation financial inputs partially
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { id } = await params; // Await params in Next.js 15
    const body = await request.json();

    // Validate request body for partial financial inputs
    const validatedData = FinancialInputsUpdateSchema.parse(body);

    // Update simulation financials
    const result = await updateSimulationFinancials(id, validatedData, deviceId);

    if (!result.success) {
      if (result.error === "Simulation not found") {
        return CommonErrors.NOT_FOUND();
      }
      return errorResponse("UPDATE_FAILED", result.error || "Failed to update simulation", 500);
    }

    const response = successResponse(result.data);

    // Add security headers
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    console.error("Error in PATCH /api/v1/simulations/[id]:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

/**
 * DELETE /api/v1/simulations/[id]
 * Delete a simulation
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { id } = await params; // Await params in Next.js 15

    // Delete simulation
    const result = await deleteSimulation(id, deviceId);

    if (!result.success) {
      if (result.error === "Simulation not found") {
        return CommonErrors.NOT_FOUND();
      }
      return errorResponse("DELETE_FAILED", result.error || "Failed to delete simulation", 500);
    }

    const response = successResponse(result.data);

    // Add security headers
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error in DELETE /api/v1/simulations/[id]:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

/**
 * POST /api/v1/simulations/[id]
 * Duplicate a simulation
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { id } = await params; // Await params in Next.js 15

    // Duplicate simulation
    const result = await duplicateSimulation(id, deviceId);

    if (!result.success) {
      if (result.error === "Simulation not found") {
        return CommonErrors.NOT_FOUND();
      }
      return errorResponse(
        "DUPLICATE_FAILED",
        result.error || "Failed to duplicate simulation",
        500
      );
    }

    const response = successResponse(result.data, 201);

    // Add security headers
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error in POST /api/v1/simulations/[id]:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}
