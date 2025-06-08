import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useSimulations } from "./useSimulations";

// Mock fetch globally with proper Response objects
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create proper Response mock
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockResponse = (data: any, options: { ok?: boolean; status?: number } = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  clone: vi.fn(() => createMockResponse(data, options)),
  json: vi.fn(() => Promise.resolve(data)),
  text: vi.fn(() => Promise.resolve(JSON.stringify(data))),
});

// Mock data
const mockLeanCanvas = {
  name: "Test Canvas",
  description: "Test description",
  problem: "Test problem",
  solution: "Test solution",
  uniqueValueProposition: "Test UVP",
  customerSegments: "Test segments",
  channels: "Test channels",
  revenueStreams: "Test revenue",
};

const mockFinancialInputs = {
  averagePrice: 100,
  costPerUnit: 50,
  fixedCosts: 1000,
  customerAcquisitionCost: 25,
  monthlyNewCustomers: 10,
  averageCustomerLifetime: 12,
};

const mockCompleteSimulation = {
  id: "1",
  name: "Test Simulation",
  description: "Test description",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  leanCanvas: mockLeanCanvas,
  financialInputs: mockFinancialInputs,
  results: {
    kpis: {
      unitMargin: 50,
      monthlyRevenue: 1000,
      monthlyProfit: 750,
      ltv: 1200,
      cac: 25,
      cacLtvRatio: 48,
      breakEvenUnits: 20,
      breakEvenMonths: 2,
    },
    health: {
      profitabilityHealth: "good",
      ltvCacHealth: "good",
      overallHealth: "good",
    },
    recommendations: [],
    calculatedAt: new Date("2024-01-01T00:00:00.000Z"),
    calculationVersion: "1.0",
  },
};

describe("useSimulations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createSimulation", () => {
    it("should create simulation successfully", async () => {
      const mockResponse = createMockResponse({ data: mockCompleteSimulation });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulation = await result.current.createSimulation({
          name: "Test Simulation",
          leanCanvas: mockLeanCanvas,
          financialInputs: mockFinancialInputs,
        });
        expect(simulation).toEqual(mockCompleteSimulation);
      });

      // Verify fetch was called (without checking exact format)
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      // Check that the request contains the expected URL
      expect(firstCall[0].url || firstCall[0]).toContain("/api/v1/simulations");
    });

    it("should handle API errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Validation failed" } },
        { ok: false, status: 400 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(
          result.current.createSimulation({
            name: "Test Simulation",
            leanCanvas: mockLeanCanvas,
            financialInputs: mockFinancialInputs,
          })
        ).rejects.toThrow("Validation failed");
      });

      expect(result.current.error).toBe("Validation failed");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(
          result.current.createSimulation({
            name: "Test Simulation",
            leanCanvas: mockLeanCanvas,
            financialInputs: mockFinancialInputs,
          })
        ).rejects.toThrow("Network error");
      });

      expect(result.current.error).toBe("Network error");
    });

    it("should handle malformed error responses", async () => {
      const mockErrorResponse = createMockResponse(null, { ok: false, status: 500 });
      mockErrorResponse.json = vi.fn(() => Promise.reject(new Error("JSON parse error")));
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(
          result.current.createSimulation({
            name: "Test Simulation",
            leanCanvas: mockLeanCanvas,
            financialInputs: mockFinancialInputs,
          })
        ).rejects.toThrow("HTTP 500");
      });

      expect(result.current.error).toBe("HTTP 500");
    });
  });

  describe("getSimulation", () => {
    it("should get simulation successfully", async () => {
      const mockResponse = createMockResponse({ data: mockCompleteSimulation });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulation = await result.current.getSimulation("1");
        expect(simulation).toEqual(mockCompleteSimulation);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      expect(firstCall[0].url || firstCall[0]).toContain("/api/v1/simulations/1");
    });

    it("should handle not found errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Simulation not found" } },
        { ok: false, status: 404 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(result.current.getSimulation("nonexistent")).rejects.toThrow(
          "Simulation not found"
        );
      });

      expect(result.current.error).toBe("Simulation not found");
    });
  });

  describe("updateSimulation", () => {
    it("should update simulation successfully", async () => {
      const updatedSimulation = { ...mockCompleteSimulation, name: "Updated Simulation" };
      const mockResponse = createMockResponse({ data: updatedSimulation });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulation = await result.current.updateSimulation("1", {
          name: "Updated Simulation",
        });
        expect(simulation).toEqual(updatedSimulation);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      expect(firstCall[0].url || firstCall[0]).toContain("/api/v1/simulations/1");
    });

    it("should handle update errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Simulation not found" } },
        { ok: false, status: 404 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(
          result.current.updateSimulation("1", { name: "Updated Simulation" })
        ).rejects.toThrow("Simulation not found");
      });

      expect(result.current.error).toBe("Simulation not found");
    });
  });

  describe("listSimulations", () => {
    const mockListResponse = {
      simulations: [
        {
          id: "1",
          name: "Test Simulation 1",
          description: "Test description",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          leanCanvas: {
            id: "canvas-id-1",
            name: "Test Canvas",
            description: "Test description",
            problem: "Test problem",
            solution: "Test solution",
            uniqueValueProposition: "Test UVP",
          },
          results: {
            id: "results-id-1",
            overallHealth: "good",
            monthlyProfit: 750,
            ltv: 1200,
            cacLtvRatio: 48,
            calculatedAt: "2024-01-01T00:00:00.000Z",
          },
        },
      ],
      pagination: {
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
        totalRecords: 1,
      },
    };

    it("should list simulations with default parameters", async () => {
      const mockResponse = createMockResponse({ data: mockListResponse });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulations = await result.current.listSimulations();
        expect(simulations).toEqual(mockListResponse);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      const url = firstCall[0].url || firstCall[0];
      expect(url).toContain("/api/v1/simulations");
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });

    it("should list simulations with custom parameters", async () => {
      const mockResponse = createMockResponse({ data: mockListResponse });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulations = await result.current.listSimulations(2, 5, "name", "asc");
        expect(simulations).toEqual(mockListResponse);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      const url = firstCall[0].url || firstCall[0];
      expect(url).toContain("page=2");
      expect(url).toContain("limit=5");
      expect(url).toContain("sort=name");
      expect(url).toContain("order=asc");
    });

    it("should handle list errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Internal server error" } },
        { ok: false, status: 500 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(result.current.listSimulations()).rejects.toThrow("Internal server error");
      });

      expect(result.current.error).toBe("Internal server error");
    });
  });

  describe("deleteSimulation", () => {
    it("should delete simulation successfully", async () => {
      const mockResponse = createMockResponse({
        data: { message: "Simulation deleted successfully" },
      });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const result_data = await result.current.deleteSimulation("1");
        expect(result_data).toEqual({ message: "Simulation deleted successfully" });
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      expect(firstCall[0].url || firstCall[0]).toContain("/api/v1/simulations/1");
    });

    it("should handle delete errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Simulation not found" } },
        { ok: false, status: 404 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(result.current.deleteSimulation("1")).rejects.toThrow("Simulation not found");
      });

      expect(result.current.error).toBe("Simulation not found");
    });
  });

  describe("duplicateSimulation", () => {
    it("should duplicate simulation successfully", async () => {
      const duplicatedSimulation = { ...mockCompleteSimulation, name: "Test Simulation - Copy" };
      const mockResponse = createMockResponse({ data: duplicatedSimulation });
      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        const simulation = await result.current.duplicateSimulation("1");
        expect(simulation).toEqual(duplicatedSimulation);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const firstCall = mockFetch.mock.calls[0];
      expect(firstCall[0].url || firstCall[0]).toContain("/api/v1/simulations/1");
    });

    it("should handle duplicate errors", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Simulation not found" } },
        { ok: false, status: 404 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      await act(async () => {
        await expect(result.current.duplicateSimulation("1")).rejects.toThrow(
          "Simulation not found"
        );
      });

      expect(result.current.error).toBe("Simulation not found");
    });
  });

  describe("utility functions", () => {
    it("should clear errors correctly", async () => {
      const mockErrorResponse = createMockResponse(
        { error: { message: "Test error" } },
        { ok: false, status: 400 }
      );
      mockFetch.mockResolvedValue(mockErrorResponse);

      const { result } = renderHook(() => useSimulations());

      // First, trigger an error
      await act(async () => {
        try {
          await result.current.createSimulation({
            name: "Test Simulation",
            leanCanvas: mockLeanCanvas,
            financialInputs: mockFinancialInputs,
          });
        } catch {
          // Expected to fail
        }
      });

      expect(result.current.error).toBe("Test error");

      // Then clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it("should provide hook functions and state", () => {
      const { result } = renderHook(() => useSimulations());

      expect(result.current).toHaveProperty("createSimulation");
      expect(result.current).toHaveProperty("getSimulation");
      expect(result.current).toHaveProperty("updateSimulation");
      expect(result.current).toHaveProperty("listSimulations");
      expect(result.current).toHaveProperty("deleteSimulation");
      expect(result.current).toHaveProperty("duplicateSimulation");
      expect(result.current).toHaveProperty("clearError");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
