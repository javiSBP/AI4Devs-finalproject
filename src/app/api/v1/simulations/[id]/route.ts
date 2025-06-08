import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { UpdateCompleteSimulationSchema } from "@/lib/validation/simulation";
import {
  getCompleteSimulation,
  updateCompleteSimulation,
  deleteCompleteSimulation,
  duplicateCompleteSimulation,
} from "@/lib/api/simulations-complete";
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
 * Get a specific complete simulation with all relations
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

    // Get complete simulation with all relations
    const result = await getCompleteSimulation(id, deviceId);

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
 * Update a complete simulation and recalculate results if financial inputs changed
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

    // Validate request body using complete simulation update schema
    const validatedData = UpdateCompleteSimulationSchema.parse(body);

    // Update complete simulation with automatic recalculation if needed
    const result = await updateCompleteSimulation(id, validatedData, deviceId);

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
 * DELETE /api/v1/simulations/[id]
 * Delete a complete simulation (cascading deletes handled by Prisma)
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

    // Delete complete simulation
    const result = await deleteCompleteSimulation(id, deviceId);

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
 * Duplicate an existing simulation
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

    // Duplicate complete simulation using new atomic function
    const result = await duplicateCompleteSimulation(id, deviceId);

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
