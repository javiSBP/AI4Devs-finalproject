import { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  CreateSimulationSchema,
  ListSimulationsQuerySchema,
} from "@/lib/validation/financial-inputs";
import { createSimulation, getSimulations } from "@/lib/api/simulations";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  CommonErrors,
} from "@/lib/api/response";
import { applyMiddleware, getSecurityHeaders } from "@/lib/api/middleware";

/**
 * POST /api/v1/simulations
 * Create a new simulation
 */
export async function POST(request: NextRequest) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const body = await request.json();

    // Validate request body
    const validatedData = CreateSimulationSchema.parse(body);

    // Create simulation
    const result = await createSimulation(validatedData, deviceId);

    if (!result.success) {
      return errorResponse("CREATE_FAILED", result.error || "Failed to create simulation", 500);
    }

    const response = successResponse(result.data, 201);

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

    console.error("Error in POST /api/v1/simulations:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

/**
 * GET /api/v1/simulations
 * Get simulations for the current device
 */
export async function GET(request: NextRequest) {
  try {
    // Apply middleware (rate limiting, device ID validation)
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const deviceId = middlewareResult.deviceId!;
    const { searchParams } = new URL(request.url);

    // Convert URLSearchParams to object for validation
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
    };

    // Validate query parameters
    const validatedQuery = ListSimulationsQuerySchema.parse(queryParams);

    // Get simulations
    const result = await getSimulations(validatedQuery, deviceId);

    if (!result.success) {
      return errorResponse("FETCH_FAILED", result.error || "Failed to fetch simulations", 500);
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

    console.error("Error in GET /api/v1/simulations:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// Handle unsupported methods
export async function PUT() {
  return CommonErrors.METHOD_NOT_ALLOWED();
}

export async function DELETE() {
  return CommonErrors.METHOD_NOT_ALLOWED();
}

export async function PATCH() {
  return CommonErrors.METHOD_NOT_ALLOWED();
}
