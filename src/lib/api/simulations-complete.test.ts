import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  createCompleteSimulation,
  updateCompleteSimulation,
  getCompleteSimulation,
  getCompleteSimulations,
  deleteCompleteSimulation,
  duplicateCompleteSimulation,
} from "./simulations-complete";
import { prisma } from "@/lib/prisma";
import { calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn(),
    simulation: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    leanCanvas: {
      create: vi.fn(),
      update: vi.fn(),
    },
    financialInputs: {
      create: vi.fn(),
      update: vi.fn(),
    },
    simulationResults: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock financial calculator
vi.mock("@/lib/financial/kpi-calculator", () => ({
  calculateFinancialMetrics: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma = prisma as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCalculateFinancialMetrics = calculateFinancialMetrics as any;

describe("simulations-complete API", () => {
  const deviceId = "test-device-123";

  const mockLeanCanvasData = {
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

  const mockCreateData = {
    name: "Test Simulation",
    description: "Test description",
    leanCanvas: mockLeanCanvasData,
    financialInputs: mockFinancialInputs,
  };

  const mockCalculationResult = {
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
      profitabilityHealth: "good" as const,
      ltvCacHealth: "good" as const,
      overallHealth: "good" as const,
    },
    recommendations: [],
    calculatedAt: new Date("2024-01-01T00:00:00.000Z"),
    calculationVersion: "1.0",
  };

  const mockCompleteSimulation = {
    id: "test-simulation-id",
    name: "Test Simulation",
    description: "Test description",
    deviceId,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    leanCanvas: {
      id: "test-canvas-id",
      ...mockLeanCanvasData,
    },
    financialInputs: {
      id: "test-inputs-id",
      simulationId: "test-simulation-id",
      ...mockFinancialInputs,
    },
    results: {
      id: "test-results-id",
      simulationId: "test-simulation-id",
      ...mockCalculationResult.kpis,
      ...mockCalculationResult.health,
      recommendations: mockCalculationResult.recommendations,
      insights: {},
      calculatedAt: mockCalculationResult.calculatedAt,
      calculationVersion: mockCalculationResult.calculationVersion,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCalculateFinancialMetrics.mockReturnValue(mockCalculationResult);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createCompleteSimulation", () => {
    it("should create complete simulation successfully", async () => {
      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        return await callback({
          simulation: {
            create: vi.fn().mockResolvedValue({ id: "test-simulation-id" }),
            update: vi.fn().mockResolvedValue(mockCompleteSimulation),
          },
          leanCanvas: {
            create: vi.fn().mockResolvedValue({ id: "test-canvas-id" }),
          },
          financialInputs: {
            create: vi.fn().mockResolvedValue({}),
          },
          simulationResults: {
            create: vi.fn().mockResolvedValue({}),
          },
        });
      });

      mockPrisma.$transaction = mockTransaction;

      const result = await createCompleteSimulation(mockCreateData, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompleteSimulation);
      expect(mockCalculateFinancialMetrics).toHaveBeenCalledWith(mockFinancialInputs);
      expect(mockTransaction).toHaveBeenCalledTimes(1);
    });

    it("should handle transaction errors", async () => {
      mockPrisma.$transaction.mockRejectedValue(new Error("Database error"));

      const result = await createCompleteSimulation(mockCreateData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to create complete simulation");
    });

    it("should handle infinite values in calculations", async () => {
      const calculationWithInfinity = {
        ...mockCalculationResult,
        kpis: {
          ...mockCalculationResult.kpis,
          cacLtvRatio: Infinity,
          breakEvenMonths: NaN,
        },
      };

      mockCalculateFinancialMetrics.mockReturnValue(calculationWithInfinity);

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          simulation: {
            create: vi.fn().mockResolvedValue({ id: "test-simulation-id" }),
            update: vi.fn().mockResolvedValue(mockCompleteSimulation),
          },
          leanCanvas: {
            create: vi.fn().mockResolvedValue({ id: "test-canvas-id" }),
          },
          financialInputs: {
            create: vi.fn().mockResolvedValue({}),
          },
          simulationResults: {
            create: vi.fn(),
          },
        };

        await callback(tx);

        const createCall = tx.simulationResults.create.mock.calls[0][0];
        expect(createCall.data.cacLtvRatio).toBe(-1); // Infinity converted to -1
        expect(createCall.data.breakEvenMonths).toBe(-1); // NaN converted to -1

        return mockCompleteSimulation;
      });

      mockPrisma.$transaction = mockTransaction;

      const result = await createCompleteSimulation(mockCreateData, deviceId);

      expect(result.success).toBe(true);
    });
  });

  describe("updateCompleteSimulation", () => {
    const updateData = {
      name: "Updated Simulation",
      financialInputs: {
        averagePrice: 150,
      },
    };

    it("should update simulation successfully", async () => {
      const existingSimulation = {
        ...mockCompleteSimulation,
        financialInputs: mockCompleteSimulation.financialInputs,
        results: mockCompleteSimulation.results,
        leanCanvas: mockCompleteSimulation.leanCanvas,
      };

      mockPrisma.simulation.findFirst.mockResolvedValue(existingSimulation);

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          simulation: {
            findFirst: vi.fn().mockResolvedValue(existingSimulation),
            update: vi.fn().mockResolvedValue({ ...existingSimulation, ...updateData }),
          },
          leanCanvas: {
            update: vi.fn(),
          },
          financialInputs: {
            update: vi.fn(),
          },
          simulationResults: {
            update: vi.fn(),
          },
        };

        const result = await callback(tx);
        return result;
      });

      mockPrisma.$transaction = mockTransaction;

      const result = await updateCompleteSimulation("test-id", updateData, deviceId);

      expect(result.success).toBe(true);
      expect(mockCalculateFinancialMetrics).toHaveBeenCalled();
      expect(mockTransaction).toHaveBeenCalledTimes(1);
    });

    it("should handle simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await updateCompleteSimulation("nonexistent-id", updateData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should update without recalculation when no financial inputs changed", async () => {
      const updateDataNoFinancials = {
        name: "Updated Name Only",
      };

      const existingSimulation = mockCompleteSimulation;
      mockPrisma.simulation.findFirst.mockResolvedValue(existingSimulation);

      const mockTransaction = vi.fn().mockImplementation(async (callback) => {
        const tx = {
          simulation: {
            findFirst: vi.fn().mockResolvedValue(existingSimulation),
            update: vi.fn().mockResolvedValue({ ...existingSimulation, ...updateDataNoFinancials }),
          },
          leanCanvas: {
            update: vi.fn(),
          },
          financialInputs: {
            update: vi.fn(),
          },
          simulationResults: {
            update: vi.fn(),
          },
        };

        const result = await callback(tx);

        // Should not update results when no financial inputs changed
        expect(tx.simulationResults.update).not.toHaveBeenCalled();

        return result;
      });

      mockPrisma.$transaction = mockTransaction;

      const result = await updateCompleteSimulation("test-id", updateDataNoFinancials, deviceId);

      expect(result.success).toBe(true);
      expect(mockCalculateFinancialMetrics).not.toHaveBeenCalled();
    });

    it("should handle update errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);
      mockPrisma.$transaction.mockRejectedValue(new Error("Update failed"));

      const result = await updateCompleteSimulation("test-id", updateData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to update complete simulation");
    });
  });

  describe("getCompleteSimulation", () => {
    it("should get simulation successfully", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);

      const result = await getCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompleteSimulation);
      expect(mockPrisma.simulation.findFirst).toHaveBeenCalledWith({
        where: { id: "test-id", deviceId },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should handle simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await getCompleteSimulation("nonexistent-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle database errors", async () => {
      mockPrisma.simulation.findFirst.mockRejectedValue(new Error("Database error"));

      const result = await getCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch complete simulation");
    });
  });

  describe("getCompleteSimulations", () => {
    const queryParams = {
      page: 1,
      limit: 10,
      sort: "updatedAt" as const,
      order: "desc" as const,
    };

    const mockListSimulations = [
      {
        id: "test-id-1",
        name: "Simulation 1",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        leanCanvas: {
          id: "canvas-1",
          name: "Canvas 1",
          description: "Description 1",
        },
        results: {
          id: "results-1",
          overallHealth: "good",
          monthlyProfit: 750,
          ltv: 1200,
          cacLtvRatio: 48,
          calculatedAt: new Date("2024-01-01"),
        },
      },
    ];

    it("should list simulations successfully", async () => {
      mockPrisma.simulation.findMany.mockResolvedValue(mockListSimulations);
      mockPrisma.simulation.count.mockResolvedValue(1);

      const result = await getCompleteSimulations(queryParams, deviceId);

      expect(result.success).toBe(true);
      expect(result.data!.simulations).toEqual(mockListSimulations);
      expect(result.data!.pagination).toEqual({
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false,
        limit: 10,
        totalRecords: 1,
      });

      expect(mockPrisma.simulation.findMany).toHaveBeenCalledWith({
        where: { deviceId },
        skip: 0,
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: {
          leanCanvas: {
            select: {
              id: true,
              problem: true,
              solution: true,
              uniqueValueProposition: true,
            },
          },
          financialInputs: true,
          results: {
            select: {
              id: true,
              overallHealth: true,
              monthlyProfit: true,
              ltv: true,
              cacLtvRatio: true,
              calculatedAt: true,
            },
          },
        },
      });
    });

    it("should handle pagination correctly", async () => {
      const page2Params = { ...queryParams, page: 2, limit: 5 };

      mockPrisma.simulation.findMany.mockResolvedValue([]);
      mockPrisma.simulation.count.mockResolvedValue(15);

      const result = await getCompleteSimulations(page2Params, deviceId);

      expect(result.success).toBe(true);
      expect(result.data!.pagination).toEqual({
        current: 2,
        total: 3, // Math.ceil(15 / 5)
        hasNext: true,
        hasPrev: true,
        limit: 5,
        totalRecords: 15,
      });

      expect(mockPrisma.simulation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5, // (2 - 1) * 5
          take: 5,
        })
      );
    });

    it("should handle database errors", async () => {
      mockPrisma.simulation.findMany.mockRejectedValue(new Error("Database error"));

      const result = await getCompleteSimulations(queryParams, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch complete simulations");
    });
  });

  describe("deleteCompleteSimulation", () => {
    it("should delete simulation successfully", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);
      mockPrisma.simulation.delete.mockResolvedValue(mockCompleteSimulation);

      const result = await deleteCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(true);
      expect(result.data!.message).toBe("Simulation deleted successfully");
      expect(mockPrisma.simulation.delete).toHaveBeenCalledWith({
        where: { id: "test-id" },
      });
    });

    it("should handle simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await deleteCompleteSimulation("nonexistent-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
      expect(mockPrisma.simulation.delete).not.toHaveBeenCalled();
    });

    it("should handle delete errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);
      mockPrisma.simulation.delete.mockRejectedValue(new Error("Delete failed"));

      const result = await deleteCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to delete complete simulation");
    });
  });

  describe("duplicateCompleteSimulation", () => {
    const mockDuplicatedSimulation = {
      ...mockCompleteSimulation,
      id: "duplicated-id",
      name: "Test Simulation - Copia",
    };

    it("should duplicate simulation successfully", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation((callback: any) =>
        callback({
          simulation: {
            create: vi
              .fn()
              .mockResolvedValue({ id: "duplicated-id", name: "Test Simulation - Copia" }),
            update: vi.fn().mockResolvedValue(mockDuplicatedSimulation),
            findFirst: vi.fn().mockResolvedValue(mockDuplicatedSimulation),
          },
          leanCanvas: {
            create: vi.fn().mockResolvedValue({ id: "new-canvas-id" }),
          },
          financialInputs: {
            create: vi.fn().mockResolvedValue({}),
          },
          simulationResults: {
            create: vi.fn().mockResolvedValue({}),
          },
        })
      );

      const result = await duplicateCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDuplicatedSimulation);
    });

    it("should handle simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await duplicateCompleteSimulation("nonexistent-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle duplication errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockCompleteSimulation);
      mockPrisma.$transaction.mockRejectedValue(new Error("Duplication failed"));

      const result = await duplicateCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to duplicate complete simulation");
    });

    it("should duplicate simulation without financial inputs", async () => {
      const simulationWithoutFinancials = {
        ...mockCompleteSimulation,
        financialInputs: null,
      };

      mockPrisma.simulation.findFirst.mockResolvedValue(simulationWithoutFinancials);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPrisma.$transaction.mockImplementation((callback: any) =>
        callback({
          simulation: {
            create: vi
              .fn()
              .mockResolvedValue({ id: "duplicated-id", name: "Test Simulation - Copia" }),
            update: vi.fn().mockResolvedValue(mockDuplicatedSimulation),
            findFirst: vi.fn().mockResolvedValue(mockDuplicatedSimulation),
          },
          leanCanvas: {
            create: vi.fn().mockResolvedValue({ id: "new-canvas-id" }),
          },
        })
      );

      const result = await duplicateCompleteSimulation("test-id", deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDuplicatedSimulation);
    });
  });
});
