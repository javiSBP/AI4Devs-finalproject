import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "./route";

// Mock dependencies - Updated to match actual route imports
vi.mock("@/lib/validation/simulation", () => ({
  CreateCompleteSimulationSchema: {
    parse: vi.fn(),
  },
  ListSimulationsQuerySchema: {
    parse: vi.fn(),
  },
}));

vi.mock("@/lib/api/simulations-complete", () => ({
  createCompleteSimulation: vi.fn(),
  getCompleteSimulations: vi.fn(),
}));

vi.mock("@/lib/api/middleware", () => ({
  applyMiddleware: vi.fn(),
  getSecurityHeaders: vi.fn(() => ({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  })),
}));

vi.mock("@/lib/api/response", () => ({
  successResponse: vi.fn(),
  errorResponse: vi.fn(),
  validationErrorResponse: vi.fn(),
  CommonErrors: {
    INTERNAL_ERROR: vi.fn(),
  },
}));

import {
  CreateCompleteSimulationSchema,
  ListSimulationsQuerySchema,
} from "@/lib/validation/simulation";
import { createCompleteSimulation, getCompleteSimulations } from "@/lib/api/simulations-complete";
import { applyMiddleware, getSecurityHeaders } from "@/lib/api/middleware";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  CommonErrors,
} from "@/lib/api/response";
import { ZodError } from "zod";

const mockCreateCompleteSimulationSchema = CreateCompleteSimulationSchema as unknown as {
  parse: ReturnType<typeof vi.fn>;
};
const mockListSimulationsQuerySchema = ListSimulationsQuerySchema as unknown as {
  parse: ReturnType<typeof vi.fn>;
};
const mockCreateCompleteSimulation = createCompleteSimulation as ReturnType<typeof vi.fn>;
const mockGetCompleteSimulations = getCompleteSimulations as ReturnType<typeof vi.fn>;
const mockApplyMiddleware = applyMiddleware as ReturnType<typeof vi.fn>;
const mockGetSecurityHeaders = getSecurityHeaders as ReturnType<typeof vi.fn>;
const mockSuccessResponse = successResponse as ReturnType<typeof vi.fn>;
const mockErrorResponse = errorResponse as ReturnType<typeof vi.fn>;
const mockValidationErrorResponse = validationErrorResponse as ReturnType<typeof vi.fn>;
const mockCommonErrors = CommonErrors as unknown as { INTERNAL_ERROR: ReturnType<typeof vi.fn> };

describe("/api/v1/simulations", () => {
  const deviceId = "test-device-123";
  const mockResponse = new Response();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSecurityHeaders.mockReturnValue({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    });
  });

  describe("POST", () => {
    const validData = {
      name: "Test Simulation",
      description: "A test simulation",
      leanCanvas: {
        name: "Test Canvas",
        problem: "Test problem",
        solution: "Test solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test segments",
        channels: "Test channels",
        revenueStreams: "Test revenue",
      },
      financialInputs: {
        averagePrice: 100,
        costPerUnit: 50,
        fixedCosts: 1000,
        customerAcquisitionCost: 25,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      },
    };

    const mockSimulation = {
      id: "clxyz123456789",
      ...validData,
      deviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should create a simulation successfully", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "POST",
        body: JSON.stringify(validData),
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      });

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockCreateCompleteSimulationSchema.parse.mockReturnValue(validData);
      mockCreateCompleteSimulation.mockResolvedValue({ success: true, data: mockSimulation });
      mockSuccessResponse.mockReturnValue(mockResponse);

      const response = await POST(request);

      expect(mockApplyMiddleware).toHaveBeenCalledWith(request);
      expect(mockCreateCompleteSimulationSchema.parse).toHaveBeenCalledWith(validData);
      expect(mockCreateCompleteSimulation).toHaveBeenCalledWith(validData, deviceId);
      expect(mockSuccessResponse).toHaveBeenCalledWith(mockSimulation, 201);
      expect(response).toBe(mockResponse);
    });

    it("should handle middleware errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "POST",
        body: JSON.stringify(validData),
      });

      const middlewareError = new Response("Unauthorized", { status: 401 });
      mockApplyMiddleware.mockReturnValue({ error: middlewareError, deviceId: null });

      const response = await POST(request);

      expect(response).toBe(middlewareError);
      expect(mockCreateCompleteSimulationSchema.parse).not.toHaveBeenCalled();
    });

    it("should handle validation errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "POST",
        body: JSON.stringify({ name: "ab" }), // Invalid data - missing required fields
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      });

      const validationError = new ZodError([
        {
          code: "too_small",
          minimum: 3,
          type: "string",
          inclusive: true,
          exact: false,
          message: "El nombre debe tener al menos 3 caracteres",
          path: ["name"],
        },
        {
          code: "invalid_type",
          expected: "object",
          received: "undefined",
          path: ["leanCanvas"],
          message: "Required",
        },
        {
          code: "invalid_type",
          expected: "object",
          received: "undefined",
          path: ["financialInputs"],
          message: "Required",
        },
      ]);

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockCreateCompleteSimulationSchema.parse.mockImplementation(() => {
        throw validationError;
      });
      mockValidationErrorResponse.mockReturnValue(mockResponse);

      const response = await POST(request);

      expect(mockValidationErrorResponse).toHaveBeenCalledWith(validationError);
      expect(response).toBe(mockResponse);
    });

    it("should handle creation failures", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "POST",
        body: JSON.stringify(validData),
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      });

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockCreateCompleteSimulationSchema.parse.mockReturnValue(validData);
      mockCreateCompleteSimulation.mockResolvedValue({ success: false, error: "Database error" });
      mockErrorResponse.mockReturnValue(mockResponse);

      const response = await POST(request);

      expect(mockErrorResponse).toHaveBeenCalledWith("CREATE_FAILED", "Database error", 500);
      expect(response).toBe(mockResponse);
    });

    it("should handle unexpected errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "POST",
        body: JSON.stringify(validData),
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      });

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockCreateCompleteSimulationSchema.parse.mockImplementation(() => {
        throw new Error("Unexpected error");
      });
      mockCommonErrors.INTERNAL_ERROR.mockReturnValue(mockResponse);

      const response = await POST(request);

      expect(mockCommonErrors.INTERNAL_ERROR).toHaveBeenCalled();
      expect(response).toBe(mockResponse);
    });
  });

  describe("GET", () => {
    const mockSimulations = [
      {
        id: "clxyz123456789",
        name: "Test Simulation",
        deviceId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockPagination = {
      current: 1,
      total: 1,
      hasNext: false,
      hasPrev: false,
      limit: 10,
      totalRecords: 1,
    };

    it("should get simulations successfully", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations?page=1&limit=10", {
        method: "GET",
        headers: {
          "X-Device-ID": deviceId,
        },
      });

      const queryParams = {
        page: "1",
        limit: "10",
        sort: null,
        order: null,
      };

      const validatedQuery = {
        page: 1,
        limit: 10,
        sort: "updatedAt",
        order: "desc",
      };

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockListSimulationsQuerySchema.parse.mockReturnValue(validatedQuery);
      mockGetCompleteSimulations.mockResolvedValue({
        success: true,
        data: { simulations: mockSimulations, pagination: mockPagination },
      });
      mockSuccessResponse.mockReturnValue(mockResponse);

      const response = await GET(request);

      expect(mockApplyMiddleware).toHaveBeenCalledWith(request);
      expect(mockListSimulationsQuerySchema.parse).toHaveBeenCalledWith(queryParams);
      expect(mockGetCompleteSimulations).toHaveBeenCalledWith(validatedQuery, deviceId);
      expect(mockSuccessResponse).toHaveBeenCalledWith({
        simulations: mockSimulations,
        pagination: mockPagination,
      });
      expect(response).toBe(mockResponse);
    });

    it("should handle middleware errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "GET",
      });

      const middlewareError = new Response("Unauthorized", { status: 401 });
      mockApplyMiddleware.mockReturnValue({ error: middlewareError, deviceId: null });

      const response = await GET(request);

      expect(response).toBe(middlewareError);
      expect(mockListSimulationsQuerySchema.parse).not.toHaveBeenCalled();
    });

    it("should handle query validation errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations?page=0", {
        method: "GET",
        headers: {
          "X-Device-ID": deviceId,
        },
      });

      const validationError = new ZodError([
        {
          code: "custom",
          message: "La página debe ser mayor a 0",
          path: ["page"],
        },
      ]);

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockListSimulationsQuerySchema.parse.mockImplementation(() => {
        throw validationError;
      });
      mockValidationErrorResponse.mockReturnValue(mockResponse);

      const response = await GET(request);

      expect(mockValidationErrorResponse).toHaveBeenCalledWith(validationError);
      expect(response).toBe(mockResponse);
    });

    it("should handle fetch failures", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "GET",
        headers: {
          "X-Device-ID": deviceId,
        },
      });

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockListSimulationsQuerySchema.parse.mockReturnValue({
        page: 1,
        limit: 10,
        sort: "updatedAt",
        order: "desc",
      });
      mockGetCompleteSimulations.mockResolvedValue({ success: false, error: "Database error" });
      mockErrorResponse.mockReturnValue(mockResponse);

      const response = await GET(request);

      expect(mockErrorResponse).toHaveBeenCalledWith("FETCH_FAILED", "Database error", 500);
      expect(response).toBe(mockResponse);
    });

    it("should handle unexpected errors", async () => {
      const request = new NextRequest("http://localhost/api/v1/simulations", {
        method: "GET",
        headers: {
          "X-Device-ID": deviceId,
        },
      });

      mockApplyMiddleware.mockReturnValue({ error: null, deviceId });
      mockListSimulationsQuerySchema.parse.mockImplementation(() => {
        throw new Error("Unexpected error");
      });
      mockCommonErrors.INTERNAL_ERROR.mockReturnValue(mockResponse);

      const response = await GET(request);

      expect(mockCommonErrors.INTERNAL_ERROR).toHaveBeenCalled();
      expect(response).toBe(mockResponse);
    });
  });
});
