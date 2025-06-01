import { prisma } from "@/lib/prisma";
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
        financialInputs: true,
        results: true,
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
          financialInputs: true,
          results: true,
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
        financialInputs: true,
        results: true,
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
        financialInputs: true,
        results: true,
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
      include: { financialInputs: true },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    // Update or create financial inputs
    if (existingSimulation.financialInputs) {
      await prisma.financialInputs.update({
        where: { simulationId: id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      // For creation, we need complete data, not partial
      if (!isCompleteFinancialData(data)) {
        return { success: false, error: "Incomplete financial data for new record" };
      }
      await prisma.financialInputs.create({
        data: {
          simulationId: id,
          ...data,
        },
      });
    }

    // Fetch updated simulation
    const updatedSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
      include: {
        leanCanvas: true,
        financialInputs: true,
        results: true,
      },
    });

    return { success: true, data: updatedSimulation };
  } catch (error) {
    console.error("Error updating simulation financials:", error);
    return { success: false, error: "Failed to update simulation financials" };
  }
}

// Helper function to check if financial data is complete
function isCompleteFinancialData(
  data: Partial<FinancialInputsInput>
): data is FinancialInputsInput {
  return !!(
    data.averagePrice !== undefined &&
    data.costPerUnit !== undefined &&
    data.fixedCosts !== undefined &&
    data.customerAcquisitionCost !== undefined &&
    data.monthlyNewCustomers !== undefined &&
    data.averageCustomerLifetime !== undefined
  );
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
      include: {
        financialInputs: true,
        results: true,
      },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    // Create new simulation (only core metadata, no legacy fields)
    const duplicatedSimulation = await prisma.simulation.create({
      data: {
        name: `${existingSimulation.name} - Copia`,
        description: existingSimulation.description,
        deviceId: existingSimulation.deviceId,
        userId: existingSimulation.userId,
        leanCanvasId: existingSimulation.leanCanvasId,
      },
      include: {
        leanCanvas: true,
      },
    });

    // Duplicate financial inputs if they exist
    if (existingSimulation.financialInputs) {
      await prisma.financialInputs.create({
        data: {
          simulationId: duplicatedSimulation.id,
          averagePrice: existingSimulation.financialInputs.averagePrice,
          costPerUnit: existingSimulation.financialInputs.costPerUnit,
          fixedCosts: existingSimulation.financialInputs.fixedCosts,
          customerAcquisitionCost: existingSimulation.financialInputs.customerAcquisitionCost,
          monthlyNewCustomers: existingSimulation.financialInputs.monthlyNewCustomers,
          averageCustomerLifetime: existingSimulation.financialInputs.averageCustomerLifetime,
          validationWarnings:
            existingSimulation.financialInputs.validationWarnings === null
              ? undefined
              : existingSimulation.financialInputs.validationWarnings,
          calculationNotes: "Duplicado de simulación existente",
        },
      });
    }

    // Duplicate results if they exist
    if (existingSimulation.results) {
      const originalInsights =
        (existingSimulation.results.insights as Record<string, unknown>) || {};
      await prisma.simulationResults.create({
        data: {
          simulationId: duplicatedSimulation.id,
          unitMargin: existingSimulation.results.unitMargin,
          monthlyRevenue: existingSimulation.results.monthlyRevenue,
          monthlyProfit: existingSimulation.results.monthlyProfit,
          ltv: existingSimulation.results.ltv,
          cac: existingSimulation.results.cac,
          cacLtvRatio: existingSimulation.results.cacLtvRatio,
          breakEvenUnits: existingSimulation.results.breakEvenUnits,
          breakEvenMonths: existingSimulation.results.breakEvenMonths,
          profitabilityHealth: existingSimulation.results.profitabilityHealth,
          ltvCacHealth: existingSimulation.results.ltvCacHealth,
          overallHealth: existingSimulation.results.overallHealth,
          recommendations:
            existingSimulation.results.recommendations === null
              ? []
              : existingSimulation.results.recommendations,
          insights: {
            ...originalInsights,
            duplicatedFrom: existingSimulation.id,
            duplicatedAt: new Date().toISOString(),
          },
          calculationVersion: existingSimulation.results.calculationVersion,
        },
      });
    }

    // Fetch complete duplicated simulation
    const completeSimulation = await prisma.simulation.findFirst({
      where: { id: duplicatedSimulation.id },
      include: {
        leanCanvas: true,
        financialInputs: true,
        results: true,
      },
    });

    return { success: true, data: completeSimulation };
  } catch (error) {
    console.error("Error duplicating simulation:", error);
    return { success: false, error: "Failed to duplicate simulation" };
  }
}
