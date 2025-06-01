import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createSimulation,
  getSimulations,
  getSimulation,
  updateSimulation,
  updateSimulationFinancials,
  deleteSimulation,
  duplicateSimulation,
} from "./simulations";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    simulation: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    financialInputs: {
      create: vi.fn(),
      update: vi.fn(),
    },
    simulationResults: {
      create: vi.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  simulation: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  financialInputs: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  simulationResults: {
    create: ReturnType<typeof vi.fn>;
  };
};

describe("Simulations API Service", () => {
  const deviceId = "test-device-123";
  const simulationId = "clxyz123456789";

  const mockSimulation = {
    id: simulationId,
    name: "Test Simulation",
    description: "A test simulation",
    deviceId,
    userId: null,
    leanCanvasId: null,
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 10,
    averageCustomerLifetime: 12,
    initialInvestment: null,
    monthlyExpenses: null,
    avgRevenue: null,
    growthRate: null,
    timeframeMonths: null,
    otherParams: null,
    results_legacy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    leanCanvas: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSimulation", () => {
    const createData = {
      name: "Test Simulation",
      description: "A test simulation",
      averagePrice: 100,
      costPerUnit: 50,
    };

    it("should create a simulation successfully", async () => {
      mockPrisma.simulation.create.mockResolvedValue(mockSimulation);

      const result = await createSimulation(createData, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSimulation);
      expect(mockPrisma.simulation.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          deviceId,
        },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Database error");
      mockPrisma.simulation.create.mockRejectedValue(error);

      const result = await createSimulation(createData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to create simulation");
    });
  });

  describe("getSimulations", () => {
    const query = {
      page: 1,
      limit: 10,
      sort: "updatedAt" as const,
      order: "desc" as const,
    };

    const mockSimulations = [mockSimulation];
    const mockTotal = 1;

    it("should get simulations successfully", async () => {
      mockPrisma.simulation.findMany.mockResolvedValue(mockSimulations);
      mockPrisma.simulation.count.mockResolvedValue(mockTotal);

      const result = await getSimulations(query, deviceId);

      expect(result.success).toBe(true);
      expect(result.data?.simulations).toEqual(mockSimulations);
      expect(result.data?.pagination).toEqual({
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
              name: true,
              description: true,
            },
          },
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should handle pagination correctly", async () => {
      const paginatedQuery = { ...query, page: 2, limit: 5 };
      mockPrisma.simulation.findMany.mockResolvedValue([]);
      mockPrisma.simulation.count.mockResolvedValue(15);

      const result = await getSimulations(paginatedQuery, deviceId);

      expect(result.success).toBe(true);
      expect(result.data?.pagination).toEqual({
        current: 2,
        total: 3,
        hasNext: true,
        hasPrev: true,
        limit: 5,
        totalRecords: 15,
      });

      expect(mockPrisma.simulation.findMany).toHaveBeenCalledWith({
        where: { deviceId },
        skip: 5,
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          leanCanvas: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Database error");
      mockPrisma.simulation.findMany.mockRejectedValue(error);

      const result = await getSimulations(query, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch simulations");
    });
  });

  describe("getSimulation", () => {
    it("should get a simulation successfully", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);

      const result = await getSimulation(simulationId, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSimulation);
      expect(mockPrisma.simulation.findFirst).toHaveBeenCalledWith({
        where: { id: simulationId, deviceId },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should return error when simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await getSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle fetch errors", async () => {
      const error = new Error("Database error");
      mockPrisma.simulation.findFirst.mockRejectedValue(error);

      const result = await getSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch simulation");
    });
  });

  describe("updateSimulation", () => {
    const updateData = {
      name: "Updated Simulation",
      averagePrice: 150,
    };

    it("should update a simulation successfully", async () => {
      const updatedSimulation = { ...mockSimulation, ...updateData };
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);
      mockPrisma.simulation.update.mockResolvedValue(updatedSimulation);

      const result = await updateSimulation(simulationId, updateData, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedSimulation);
      expect(mockPrisma.simulation.update).toHaveBeenCalledWith({
        where: { id: simulationId },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });
    });

    it("should return error when simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await updateSimulation(simulationId, updateData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle update errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);
      const error = new Error("Database error");
      mockPrisma.simulation.update.mockRejectedValue(error);

      const result = await updateSimulation(simulationId, updateData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to update simulation");
    });
  });

  describe("updateSimulationFinancials", () => {
    const financialData = {
      averagePrice: 150,
      costPerUnit: 75,
      fixedCosts: 1000,
      customerAcquisitionCost: 25,
      monthlyNewCustomers: 10,
      averageCustomerLifetime: 12,
    };

    it("should update financial data successfully", async () => {
      const mockSimulationWithFinancials = {
        ...mockSimulation,
        financialInputs: { id: "financial-id", ...financialData },
      };
      const updatedSimulation = { ...mockSimulationWithFinancials };

      // Mock para el primer findFirst (buscar simulación existente)
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulationWithFinancials);
      // Mock para la actualización
      mockPrisma.financialInputs.update.mockResolvedValue({ id: "financial-id", ...financialData });
      // Mock para el segundo findFirst (obtener simulación actualizada) - usamos mockImplementation para el segundo call
      mockPrisma.simulation.findFirst.mockImplementation(() => Promise.resolve(updatedSimulation));

      const result = await updateSimulationFinancials(simulationId, financialData, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedSimulation);
    });

    it("should return error when simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await updateSimulationFinancials(simulationId, financialData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle update errors", async () => {
      const mockSimulationWithoutFinancials = {
        ...mockSimulation,
        financialInputs: null,
      };
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulationWithoutFinancials);

      // Should fail because of incomplete data for new record
      const partialData = { averagePrice: 150 };
      const result = await updateSimulationFinancials(simulationId, partialData, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Incomplete financial data for new record");
    });
  });

  describe("deleteSimulation", () => {
    it("should delete a simulation successfully", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);
      mockPrisma.simulation.delete.mockResolvedValue(mockSimulation);

      const result = await deleteSimulation(simulationId, deviceId);

      expect(result.success).toBe(true);
      expect(result.data?.message).toBe("Simulation deleted successfully");
      expect(mockPrisma.simulation.delete).toHaveBeenCalledWith({
        where: { id: simulationId },
      });
    });

    it("should return error when simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await deleteSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle delete errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);
      const error = new Error("Database error");
      mockPrisma.simulation.delete.mockRejectedValue(error);

      const result = await deleteSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to delete simulation");
    });
  });

  describe("duplicateSimulation", () => {
    it("should duplicate a simulation successfully", async () => {
      const mockFinancialInputs = {
        id: "financial-id",
        averagePrice: 100,
        costPerUnit: 50,
        fixedCosts: 1000,
        customerAcquisitionCost: 25,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      };

      const mockResults = {
        id: "results-id",
        unitMargin: 50,
        monthlyRevenue: 1000,
        monthlyProfit: 500,
        ltv: 600,
        cac: 25,
        cacLtvRatio: 0.04,
        breakEvenUnits: 20,
        breakEvenMonths: 2,
        profitabilityHealth: "good",
        ltvCacHealth: "good",
        overallHealth: "good",
        recommendations: [],
        insights: {},
        calculationVersion: "1.0",
      };

      const mockSimulationWithRelations = {
        ...mockSimulation,
        financialInputs: mockFinancialInputs,
        results: mockResults,
      };

      const duplicatedSimulation = {
        id: "new-id",
        name: "Test Simulation - Copia",
        description: mockSimulation.description,
        deviceId: mockSimulation.deviceId,
        userId: mockSimulation.userId,
        leanCanvasId: mockSimulation.leanCanvasId,
        financialInputs: mockFinancialInputs,
        results: mockResults,
        leanCanvas: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      // Mock sequence: first call returns existing simulation, second call returns duplicated
      let callCount = 0;
      mockPrisma.simulation.findFirst.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(mockSimulationWithRelations);
        } else {
          return Promise.resolve(duplicatedSimulation);
        }
      });

      mockPrisma.simulation.create.mockResolvedValue({
        id: "new-id",
        name: "Test Simulation - Copia",
        description: mockSimulation.description,
        deviceId: mockSimulation.deviceId,
        userId: mockSimulation.userId,
        leanCanvasId: mockSimulation.leanCanvasId,
        leanCanvas: null,
      });

      mockPrisma.financialInputs.create.mockResolvedValue(mockFinancialInputs);
      mockPrisma.simulationResults.create.mockResolvedValue(mockResults);

      const result = await duplicateSimulation(simulationId, deviceId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(duplicatedSimulation);

      expect(mockPrisma.simulation.create).toHaveBeenCalledWith({
        data: {
          name: "Test Simulation - Copia",
          description: mockSimulation.description,
          deviceId: mockSimulation.deviceId,
          userId: mockSimulation.userId,
          leanCanvasId: mockSimulation.leanCanvasId,
        },
        include: {
          leanCanvas: true,
        },
      });
    });

    it("should return error when simulation not found", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(null);

      const result = await duplicateSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Simulation not found");
    });

    it("should handle duplication errors", async () => {
      mockPrisma.simulation.findFirst.mockResolvedValue(mockSimulation);
      const error = new Error("Database error");
      mockPrisma.simulation.create.mockRejectedValue(error);

      const result = await duplicateSimulation(simulationId, deviceId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to duplicate simulation");
    });
  });
});
