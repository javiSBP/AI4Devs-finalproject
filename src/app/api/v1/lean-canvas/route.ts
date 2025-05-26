import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { applyMiddleware, getSecurityHeaders } from "@/lib/api/middleware";
import { successResponse, validationErrorResponse, CommonErrors } from "@/lib/api/response";
import {
  CreateLeanCanvasSchema,
  ListQuerySchema,
  type CreateLeanCanvasInput,
  type ListQueryInput,
} from "@/lib/validation/lean-canvas";

// POST /api/v1/lean-canvas - Create a new Lean Canvas
export async function POST(request: NextRequest) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;

    // Parse and validate request body
    const body = await request.json();
    const validatedData: CreateLeanCanvasInput = CreateLeanCanvasSchema.parse(body);

    // Create Lean Canvas in database
    const leanCanvas = await prisma.leanCanvas.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        problem: validatedData.problem,
        solution: validatedData.solution,
        uniqueValueProposition: validatedData.uniqueValueProposition,
        customerSegments: validatedData.customerSegments,
        channels: validatedData.channels,
        revenueStreams: validatedData.revenueStreams,
        deviceId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        problem: true,
        solution: true,
        uniqueValueProposition: true,
        customerSegments: true,
        channels: true,
        revenueStreams: true,
        createdAt: true,
        updatedAt: true,
        deviceId: true,
      },
    });

    const response = successResponse(leanCanvas, 201);

    // Add security headers
    const securityHeaders = getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    console.error("Error creating Lean Canvas:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// GET /api/v1/lean-canvas - List Lean Canvases for a device
export async function GET(request: NextRequest) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams: ListQueryInput = ListQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sort: searchParams.get("sort"),
      order: searchParams.get("order"),
    });

    // Calculate pagination
    const skip = (queryParams.page - 1) * queryParams.limit;

    // Build order by clause
    const orderBy = {
      [queryParams.sort]: queryParams.order,
    };

    // Get total count
    const total = await prisma.leanCanvas.count({
      where: { deviceId },
    });

    // Get paginated results
    const leanCanvases = await prisma.leanCanvas.findMany({
      where: { deviceId },
      select: {
        id: true,
        name: true,
        description: true,
        problem: true,
        solution: true,
        uniqueValueProposition: true,
        customerSegments: true,
        channels: true,
        revenueStreams: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy,
      skip,
      take: queryParams.limit,
    });

    // Calculate pagination metadata
    const pages = Math.ceil(total / queryParams.limit);

    const responseData = {
      leanCanvases,
      pagination: {
        total,
        pages,
        currentPage: queryParams.page,
        limit: queryParams.limit,
      },
    };

    const response = successResponse(responseData);

    // Add security headers
    const securityHeaders = getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    console.error("Error listing Lean Canvases:", error);
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
