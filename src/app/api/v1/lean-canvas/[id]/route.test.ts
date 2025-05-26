import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// Mock Prisma
const mockPrisma = {
  leanCanvas: {
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
  })),
}));

// Import after mocking
const { GET, PUT, PATCH, DELETE, POST } = await import("./route");
const { applyMiddleware } = await import("@/lib/api/middleware");

describe("Lean Canvas Individual Resource API Routes", () => {
  const mockParams = { params: { id: "canvas-123" } };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful middleware response
    vi.mocked(applyMiddleware).mockReturnValue({
      error: null,
      deviceId: "test-device-123",
    });
  });

  describe("GET /api/v1/lean-canvas/[id]", () => {
    it("should get a specific lean canvas successfully", async () => {
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

      // Mock ownership check
      mockPrisma.leanCanvas.findUnique
        .mockResolvedValueOnce({ deviceId: "test-device-123" }) // ownership check
        .mockResolvedValueOnce(mockLeanCanvas); // actual data fetch

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockLeanCanvas);
    });

    it("should return 404 when lean canvas does not exist", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/nonexistent", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request, { params: { id: "nonexistent" } });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("NOT_FOUND");
    });

    it("should return 403 when user does not own the lean canvas", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "other-device" });

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(403);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("FORBIDDEN");
    });

    it("should handle database errors", async () => {
      mockPrisma.leanCanvas.findUnique.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });
  });

  describe("PUT /api/v1/lean-canvas/[id]", () => {
    it("should update a lean canvas completely", async () => {
      const updatedCanvas = {
        id: "canvas-123",
        name: "Updated Canvas",
        description: "Updated Description",
        problem: "Updated Problem",
        solution: "Updated Solution",
        uniqueValueProposition: "Updated UVP",
        customerSegments: "Updated Segments",
        channels: "Updated Channels",
        revenueStreams: "Updated Revenue",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deviceId: "test-device-123",
      };

      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.update.mockResolvedValueOnce(updatedCanvas);

      const requestBody = {
        name: "Updated Canvas",
        description: "Updated Description",
        problem: "Updated Problem",
        solution: "Updated Solution",
        uniqueValueProposition: "Updated UVP",
        customerSegments: "Updated Segments",
        channels: "Updated Channels",
        revenueStreams: "Updated Revenue",
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(updatedCanvas);
    });

    it("should return validation error for invalid data", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });

      const requestBody = {
        name: "Te", // Too short
        problem: "", // Empty
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 404 when lean canvas does not exist", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/nonexistent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify({ name: "Test" }),
      });

      const response = await PUT(request, { params: { id: "nonexistent" } });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("NOT_FOUND");
    });
  });

  describe("PATCH /api/v1/lean-canvas/[id]", () => {
    it("should partially update a lean canvas", async () => {
      const updatedCanvas = {
        id: "canvas-123",
        problem: "Updated Problem",
        solution: "Updated Solution",
        uniqueValueProposition: "Updated UVP",
        customerSegments: "Updated Segments",
        channels: "Updated Channels",
        revenueStreams: "Updated Revenue",
        updatedAt: new Date().toISOString(),
      };

      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.update.mockResolvedValueOnce(updatedCanvas);

      const requestBody = {
        problem: "Updated Problem",
        solution: "Updated Solution",
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(updatedCanvas);
    });

    it("should handle empty partial update", async () => {
      const updatedCanvas = {
        id: "canvas-123",
        problem: "Existing Problem",
        solution: "Existing Solution",
        uniqueValueProposition: "Existing UVP",
        customerSegments: "Existing Segments",
        channels: "Existing Channels",
        revenueStreams: "Existing Revenue",
        updatedAt: new Date().toISOString(),
      };

      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.update.mockResolvedValueOnce(updatedCanvas);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify({}),
      });

      const response = await PATCH(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it("should return validation error for invalid partial data", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });

      const requestBody = {
        problem: "", // Empty string not allowed
      };

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("DELETE /api/v1/lean-canvas/[id]", () => {
    it("should delete a lean canvas successfully", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.delete.mockResolvedValueOnce({});

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "DELETE",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await DELETE(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe("Lean Canvas eliminado correctamente");
    });

    it("should return 404 when trying to delete non-existent canvas", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/nonexistent", {
        method: "DELETE",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await DELETE(request, { params: { id: "nonexistent" } });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("NOT_FOUND");
    });

    it("should return 403 when trying to delete canvas owned by different device", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "other-device" });

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "DELETE",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await DELETE(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(403);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("FORBIDDEN");
    });

    it("should handle database errors during deletion", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.delete.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "DELETE",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await DELETE(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });
  });

  describe("POST /api/v1/lean-canvas/[id]", () => {
    it("should return METHOD_NOT_ALLOWED for POST", async () => {
      const response = await POST();
      const responseData = await response.json();

      expect(response.status).toBe(405);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("METHOD_NOT_ALLOWED");
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors in GET", async () => {
      mockPrisma.leanCanvas.findUnique.mockRejectedValueOnce(
        new Error("Database connection failed")
      );

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "GET",
        headers: {
          "X-Device-ID": "test-device-123",
        },
      });

      const response = await GET(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });

    it("should handle database errors in PUT", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.update.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify({ name: "Test", problem: "Test" }),
      });

      const response = await PUT(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });

    it("should handle database errors in PATCH", async () => {
      mockPrisma.leanCanvas.findUnique.mockResolvedValueOnce({ deviceId: "test-device-123" });
      mockPrisma.leanCanvas.update.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/v1/lean-canvas/canvas-123", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "test-device-123",
        },
        body: JSON.stringify({ problem: "Updated Problem" }),
      });

      const response = await PATCH(request, mockParams);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.error.code).toBe("INTERNAL_ERROR");
    });
  });
});
