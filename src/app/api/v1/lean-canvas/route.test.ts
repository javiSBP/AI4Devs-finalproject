import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Mock Prisma
const mockPrisma = {
  leanCanvas: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

// Mock middleware
vi.mock("@/lib/api/middleware", () => ({
  applyMiddleware: vi.fn(),
  getSecurityHeaders: vi.fn(() => ({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  })),
}));

// Import after mocking
const { POST, GET, PUT, DELETE, PATCH } = await import("./route");
const { applyMiddleware } = await import("@/lib/api/middleware");

describe("Lean Canvas API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful middleware response
    vi.mocked(applyMiddleware).mockReturnValue({
      error: null,
      deviceId: "test-device-123",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("POST /api/v1/lean-canvas", () => {
    it("should create a new lean canvas successfully", async () => {
      const mockLeanCanvas = {
        id: "canvas-123",
        name: "Test Canvas",
        description: "Test Description",
        problem: "Test Problem",
        solution: "Test Solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test Segments",
        channels: "Test Channels",
        revenueStreams: "Test Revenue",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deviceId: "test-device-123",
      };

      mockPrisma.leanCanvas.create.mockResolvedValue(mockLeanCanvas);

      const requestBody = {
        name: "Test Canvas",
        description: "Test Description",
        problem: "Test Problem",
        solution: "Test Solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test Segments",
        channels: "Test Channels",
        revenueStreams: "Test Revenue",
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockLeanCanvas);
      expect(mockPrisma.leanCanvas.create).toHaveBeenCalledWith({
        data: {
          name: "Test Canvas",
          description: "Test Description",
          problem: "Test Problem",
          solution: "Test Solution",
          uniqueValueProposition: "Test UVP",
          customerSegments: "Test Segments",
          channels: "Test Channels",
          revenueStreams: "Test Revenue",
          deviceId: "test-device-123",
        },
        select: expect.any(Object),
      });
    });

    it("should return validation error for invalid data", async () => {
      const requestBody = {
        name: "Te", // Too short
        problem: "", // Empty
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("VALIDATION_ERROR");
      expect(responseData.error.details).toBeInstanceOf(Array);
    });

    it("should return error when middleware fails", async () => {
      const mockError = NextResponse.json(
        {
          success: false,
          error: { code: "DEVICE_ID_REQUIRED", message: "Device ID es requerido" },
        },
        { status: 400 }
      );

      vi.mocked(applyMiddleware).mockReturnValue({
        error: mockError,
        deviceId: null,
      });

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Test" }),
      });

      const response = await POST(request);

      expect(response).toBe(mockError);
    });

    it("should handle database errors", async () => {
      mockPrisma.leanCanvas.create.mockRejectedValue(new Error("Database error"));

      const requestBody = {
        name: "Test Canvas",
        problem: "Test Problem",
        solution: "Test Solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test Segments",
        channels: "Test Channels",
        revenueStreams: "Test Revenue",
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });

    it("should apply security headers to POST response", async () => {
      const mockLeanCanvas = {
        id: "canvas-123",
        name: "Test Canvas",
        description: "Test Description",
        problem: "Test Problem",
        solution: "Test Solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test Segments",
        channels: "Test Channels",
        revenueStreams: "Test Revenue",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deviceId: "test-device-123",
      };

      mockPrisma.leanCanvas.create.mockResolvedValue(mockLeanCanvas);

      const requestBody = {
        name: "Test Canvas",
        description: "Test Description",
        problem: "Test Problem",
        solution: "Test Solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test Segments",
        channels: "Test Channels",
        revenueStreams: "Test Revenue",
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      // Verify security headers are applied
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    });
  });

  describe("GET /api/v1/lean-canvas", () => {
    it("should list lean canvases with pagination", async () => {
      // Reset middleware mock for this test
      vi.mocked(applyMiddleware).mockReturnValue({
        error: null,
        deviceId: "test-device-123",
      });

      const mockLeanCanvases = [
        {
          id: "canvas-1",
          name: "Canvas 1",
          description: "Description 1",
          problem: "Problem 1",
          solution: "Solution 1",
          uniqueValueProposition: "UVP 1",
          customerSegments: "Segments 1",
          channels: "Channels 1",
          revenueStreams: "Revenue 1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "canvas-2",
          name: "Canvas 2",
          description: "Description 2",
          problem: "Problem 2",
          solution: "Solution 2",
          uniqueValueProposition: "UVP 2",
          customerSegments: "Segments 2",
          channels: "Channels 2",
          revenueStreams: "Revenue 2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      mockPrisma.leanCanvas.count.mockResolvedValue(2);
      mockPrisma.leanCanvas.findMany.mockResolvedValue(mockLeanCanvases);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas?page=1&limit=10", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.leanCanvases).toEqual(mockLeanCanvases);
      expect(responseData.data.pagination).toEqual({
        total: 2,
        pages: 1,
        currentPage: 1,
        limit: 10,
      });
    });

    it("should handle query parameter validation", async () => {
      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas?page=0&limit=100", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("VALIDATION_ERROR");
    });

    it("should use default pagination values", async () => {
      // Reset middleware mock for this test
      vi.mocked(applyMiddleware).mockReturnValue({
        error: null,
        deviceId: "test-device-123",
      });

      mockPrisma.leanCanvas.count.mockResolvedValue(0);
      mockPrisma.leanCanvas.findMany.mockResolvedValue([]);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.data.pagination.currentPage).toBe(1);
      expect(responseData.data.pagination.limit).toBe(10);
      expect(mockPrisma.leanCanvas.findMany).toHaveBeenCalledWith({
        where: { deviceId: "test-device-123" },
        select: expect.any(Object),
        orderBy: { updatedAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("should apply security headers to GET response", async () => {
      // Reset middleware mock for this test
      vi.mocked(applyMiddleware).mockReturnValue({
        error: null,
        deviceId: "test-device-123",
      });

      mockPrisma.leanCanvas.count.mockResolvedValue(0);
      mockPrisma.leanCanvas.findMany.mockResolvedValue([]);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request);

      // Verify security headers are applied
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    });

    it("should handle database errors in GET", async () => {
      // Reset middleware mock for this test
      vi.mocked(applyMiddleware).mockReturnValue({
        error: null,
        deviceId: "test-device-123",
      });

      mockPrisma.leanCanvas.count.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });
  });

  describe("Unsupported HTTP Methods", () => {
    it("should return METHOD_NOT_ALLOWED for PUT", async () => {
      const response = await PUT();
      const responseData = await response.json();

      expect(response.status).toBe(405);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("METHOD_NOT_ALLOWED");
    });

    it("should return METHOD_NOT_ALLOWED for DELETE", async () => {
      const response = await DELETE();
      const responseData = await response.json();

      expect(response.status).toBe(405);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("METHOD_NOT_ALLOWED");
    });

    it("should return METHOD_NOT_ALLOWED for PATCH", async () => {
      const response = await PATCH();
      const responseData = await response.json();

      expect(response.status).toBe(405);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("METHOD_NOT_ALLOWED");
    });
  });
});
