import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type {
  CreateSimulationInput,
  UpdateSimulationInput,
  ListSimulationsQueryInput,
  FinancialInputsInput,
} from "../validation/financial-inputs";

// Create a new simulation
export async function createSimulation(data: CreateSimulationInput, deviceId: string) {
  try {
    const simulation = await prisma.simulation.create({
      data: {
        ...data,
        deviceId,
      },
      include: {
        leanCanvas: true,
      },
    });

    return { success: true, data: simulation };
  } catch (error) {
    console.error("Error creating simulation:", error);
    return { success: false, error: "Failed to create simulation" };
  }
}

// Get simulations for a device
export async function getSimulations(query: ListSimulationsQueryInput, deviceId: string) {
  try {
    const { page, limit, sort, order } = query;
    const skip = (page - 1) * limit;

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where: { deviceId },
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          leanCanvas: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      }),
      prisma.simulation.count({
        where: { deviceId },
      }),
    ]);

    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
      limit,
      totalRecords: total,
    };

    return { success: true, data: { simulations, pagination } };
  } catch (error) {
    console.error("Error fetching simulations:", error);
    return { success: false, error: "Failed to fetch simulations" };
  }
}

// Get a specific simulation
export async function getSimulation(id: string, deviceId: string) {
  try {
    const simulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
      include: {
        leanCanvas: true,
      },
    });

    if (!simulation) {
      return { success: false, error: "Simulation not found" };
    }

    return { success: true, data: simulation };
  } catch (error) {
    console.error("Error fetching simulation:", error);
    return { success: false, error: "Failed to fetch simulation" };
  }
}

// Update a simulation
export async function updateSimulation(id: string, data: UpdateSimulationInput, deviceId: string) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    const updatedSimulation = await prisma.simulation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        leanCanvas: true,
      },
    });

    return { success: true, data: updatedSimulation };
  } catch (error) {
    console.error("Error updating simulation:", error);
    return { success: false, error: "Failed to update simulation" };
  }
}

// Update only financial inputs of a simulation (partial update)
export async function updateSimulationFinancials(
  id: string,
  data: Partial<FinancialInputsInput>,
  deviceId: string
) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    const updatedSimulation = await prisma.simulation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        leanCanvas: true,
      },
    });

    return { success: true, data: updatedSimulation };
  } catch (error) {
    console.error("Error updating simulation financials:", error);
    return { success: false, error: "Failed to update simulation financials" };
  }
}

// Delete a simulation
export async function deleteSimulation(id: string, deviceId: string) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    await prisma.simulation.delete({
      where: { id },
    });

    return { success: true, data: { message: "Simulation deleted successfully" } };
  } catch (error) {
    console.error("Error deleting simulation:", error);
    return { success: false, error: "Failed to delete simulation" };
  }
}

// Duplicate a simulation
export async function duplicateSimulation(id: string, deviceId: string) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    const duplicatedSimulation = await prisma.simulation.create({
      data: {
        name: `${existingSimulation.name} - Copia`,
        description: existingSimulation.description,
        deviceId: existingSimulation.deviceId,
        userId: existingSimulation.userId,
        leanCanvasId: existingSimulation.leanCanvasId,
        averagePrice: existingSimulation.averagePrice,
        costPerUnit: existingSimulation.costPerUnit,
        fixedCosts: existingSimulation.fixedCosts,
        customerAcquisitionCost: existingSimulation.customerAcquisitionCost,
        monthlyNewCustomers: existingSimulation.monthlyNewCustomers,
        averageCustomerLifetime: existingSimulation.averageCustomerLifetime,
        // Legacy fields
        initialInvestment: existingSimulation.initialInvestment,
        monthlyExpenses: existingSimulation.monthlyExpenses,
        avgRevenue: existingSimulation.avgRevenue,
        growthRate: existingSimulation.growthRate,
        timeframeMonths: existingSimulation.timeframeMonths,
        otherParams: existingSimulation.otherParams || Prisma.JsonNull,
        results: existingSimulation.results || Prisma.JsonNull,
      },
      include: {
        leanCanvas: true,
      },
    });

    return { success: true, data: duplicatedSimulation };
  } catch (error) {
    console.error("Error duplicating simulation:", error);
    return { success: false, error: "Failed to duplicate simulation" };
  }
}
