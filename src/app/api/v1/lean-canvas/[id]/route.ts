import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { applyMiddleware, getSecurityHeaders } from "@/lib/api/middleware";
import { successResponse, validationErrorResponse, CommonErrors } from "@/lib/api/response";
import {
  UpdateLeanCanvasSchema,
  LeanCanvasUpdateSchema,
  type UpdateLeanCanvasInput,
  type LeanCanvasUpdateInput,
} from "@/lib/validation/lean-canvas";

interface RouteParams {
  params: {
    id: string;
  };
}

// Helper function to check if Lean Canvas belongs to device
async function checkLeanCanvasOwnership(id: string, deviceId: string) {
  const leanCanvas = await prisma.leanCanvas.findUnique({
    where: { id },
    select: { deviceId: true },
  });

  if (!leanCanvas) {
    return { exists: false, authorized: false };
  }

  return {
    exists: true,
    authorized: leanCanvas.deviceId === deviceId,
  };
}

// GET /api/v1/lean-canvas/[id] - Get a specific Lean Canvas
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;
    const { id } = params;

    // Check ownership
    const ownership = await checkLeanCanvasOwnership(id, deviceId);
    if (!ownership.exists) {
      return CommonErrors.NOT_FOUND();
    }
    if (!ownership.authorized) {
      return CommonErrors.FORBIDDEN();
    }

    // Get Lean Canvas
    const leanCanvas = await prisma.leanCanvas.findUnique({
      where: { id },
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

    const response = successResponse(leanCanvas);

    // Add security headers
    const securityHeaders = getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error getting Lean Canvas:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// PUT /api/v1/lean-canvas/[id] - Update a complete Lean Canvas
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;
    const { id } = params;

    // Check ownership
    const ownership = await checkLeanCanvasOwnership(id, deviceId);
    if (!ownership.exists) {
      return CommonErrors.NOT_FOUND();
    }
    if (!ownership.authorized) {
      return CommonErrors.FORBIDDEN();
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData: UpdateLeanCanvasInput = UpdateLeanCanvasSchema.parse(body);

    // Update Lean Canvas
    const updatedLeanCanvas = await prisma.leanCanvas.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.problem && { problem: validatedData.problem }),
        ...(validatedData.solution && { solution: validatedData.solution }),
        ...(validatedData.uniqueValueProposition && {
          uniqueValueProposition: validatedData.uniqueValueProposition,
        }),
        ...(validatedData.customerSegments && { customerSegments: validatedData.customerSegments }),
        ...(validatedData.channels && { channels: validatedData.channels }),
        ...(validatedData.revenueStreams && { revenueStreams: validatedData.revenueStreams }),
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

    const response = successResponse(updatedLeanCanvas);

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

    console.error("Error updating Lean Canvas:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// PATCH /api/v1/lean-canvas/[id] - Partially update a Lean Canvas
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;
    const { id } = params;

    // Check ownership
    const ownership = await checkLeanCanvasOwnership(id, deviceId);
    if (!ownership.exists) {
      return CommonErrors.NOT_FOUND();
    }
    if (!ownership.authorized) {
      return CommonErrors.FORBIDDEN();
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData: LeanCanvasUpdateInput = LeanCanvasUpdateSchema.parse(body);

    // Build update data object
    const updateData: Record<string, unknown> = {};
    if (validatedData.problem !== undefined) updateData.problem = validatedData.problem;
    if (validatedData.solution !== undefined) updateData.solution = validatedData.solution;
    if (validatedData.uniqueValueProposition !== undefined)
      updateData.uniqueValueProposition = validatedData.uniqueValueProposition;
    if (validatedData.customerSegments !== undefined)
      updateData.customerSegments = validatedData.customerSegments;
    if (validatedData.channels !== undefined) updateData.channels = validatedData.channels;
    if (validatedData.revenueStreams !== undefined)
      updateData.revenueStreams = validatedData.revenueStreams;

    // Update Lean Canvas
    const updatedLeanCanvas = await prisma.leanCanvas.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        problem: true,
        solution: true,
        uniqueValueProposition: true,
        customerSegments: true,
        channels: true,
        revenueStreams: true,
        updatedAt: true,
      },
    });

    const response = successResponse(updatedLeanCanvas);

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

    console.error("Error partially updating Lean Canvas:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// DELETE /api/v1/lean-canvas/[id] - Delete a Lean Canvas
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Apply security middleware
    const middlewareResult = applyMiddleware(request);
    if (middlewareResult.error) {
      return middlewareResult.error;
    }

    const { deviceId } = middlewareResult;
    const { id } = params;

    // Check ownership
    const ownership = await checkLeanCanvasOwnership(id, deviceId);
    if (!ownership.exists) {
      return CommonErrors.NOT_FOUND();
    }
    if (!ownership.authorized) {
      return CommonErrors.FORBIDDEN();
    }

    // Delete Lean Canvas
    await prisma.leanCanvas.delete({
      where: { id },
    });

    const response = successResponse({
      message: "Lean Canvas eliminado correctamente",
    });

    // Add security headers
    const securityHeaders = getSecurityHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Error deleting Lean Canvas:", error);
    return CommonErrors.INTERNAL_ERROR();
  }
}

// POST method not allowed on individual resources
export async function POST() {
  return CommonErrors.METHOD_NOT_ALLOWED();
}
