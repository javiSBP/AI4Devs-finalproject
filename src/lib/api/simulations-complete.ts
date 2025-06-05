import { prisma } from "@/lib/prisma";
import { calculateFinancialMetrics, FinancialInputs } from "@/lib/financial/kpi-calculator";
import type {
  CreateCompleteSimulationInput,
  UpdateCompleteSimulationInput,
  ListSimulationsQueryInput,
} from "../validation/simulation";

/**
 * Creates a complete simulation with Lean Canvas + Financial Inputs + calculated Results
 * This implements the transactional atomic operation required by ticket-7
 */
export async function createCompleteSimulation(
  data: CreateCompleteSimulationInput,
  deviceId: string
) {
  try {
    // Calculate KPIs using the financial calculator
    const calculationResult = calculateFinancialMetrics(data.financialInputs);

    // Execute atomic transaction: Simulation + LeanCanvas + FinancialInputs + Results
    const simulation = await prisma.$transaction(async (tx) => {
      // 1. Create the main simulation record
      const newSimulation = await tx.simulation.create({
        data: {
          name: data.name,
          description: data.description,
          deviceId,
        },
      });

      // 2. Create the Lean Canvas
      const leanCanvas = await tx.leanCanvas.create({
        data: {
          ...data.leanCanvas,
          deviceId,
        },
      });

      // 3. Create Financial Inputs
      await tx.financialInputs.create({
        data: {
          simulation: {
            connect: { id: newSimulation.id },
          },
          ...data.financialInputs,
        },
      });

      // Helper function to convert Infinity and NaN to safe database values
      const safeFloat = (value: number): number => {
        if (!Number.isFinite(value)) {
          return -1; // Use -1 to represent infinite/impossible values
        }
        return value;
      };

      // 4. Create Results with calculated KPIs
      await tx.simulationResults.create({
        data: {
          simulation: {
            connect: { id: newSimulation.id },
          },
          // KPI values (safe conversion for database)
          unitMargin: safeFloat(calculationResult.kpis.unitMargin),
          monthlyRevenue: safeFloat(calculationResult.kpis.monthlyRevenue),
          monthlyProfit: safeFloat(calculationResult.kpis.monthlyProfit),
          ltv: safeFloat(calculationResult.kpis.ltv),
          cac: safeFloat(calculationResult.kpis.cac),
          cacLtvRatio: safeFloat(calculationResult.kpis.cacLtvRatio),
          breakEvenUnits: safeFloat(calculationResult.kpis.breakEvenUnits),
          breakEvenMonths: safeFloat(calculationResult.kpis.breakEvenMonths),
          // Health indicators
          profitabilityHealth: calculationResult.health.profitabilityHealth,
          ltvCacHealth: calculationResult.health.ltvCacHealth,
          overallHealth: calculationResult.health.overallHealth,
          // Recommendations and insights as JSON
          recommendations: JSON.parse(JSON.stringify(calculationResult.recommendations)),
          insights: {
            calculatedAt: calculationResult.calculatedAt,
            calculationVersion: calculationResult.calculationVersion,
          },
          // Calculation metadata
          calculatedAt: calculationResult.calculatedAt,
          calculationVersion: calculationResult.calculationVersion,
        },
      });

      // 5. Update simulation with Lean Canvas relation
      const updatedSimulation = await tx.simulation.update({
        where: { id: newSimulation.id },
        data: { leanCanvasId: leanCanvas.id },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });

      return updatedSimulation;
    });

    return { success: true, data: simulation };
  } catch (error) {
    console.error("Error creating complete simulation:", error);
    return { success: false, error: "Failed to create complete simulation" };
  }
}

/**
 * Updates a complete simulation and recalculates results if financial inputs changed
 */
export async function updateCompleteSimulation(
  id: string,
  data: UpdateCompleteSimulationInput,
  deviceId: string
) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
      include: {
        leanCanvas: true,
        financialInputs: true,
        results: true,
      },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    // Check if financial inputs are changing
    const needsRecalculation = data.financialInputs && Object.keys(data.financialInputs).length > 0;

    let calculationResult = null;
    if (needsRecalculation && data.financialInputs) {
      // Merge existing financial inputs with updates
      const mergedFinancials: FinancialInputs = {
        averagePrice:
          data.financialInputs.averagePrice ??
          existingSimulation.financialInputs?.averagePrice ??
          0,
        costPerUnit:
          data.financialInputs.costPerUnit ?? existingSimulation.financialInputs?.costPerUnit ?? 0,
        fixedCosts:
          data.financialInputs.fixedCosts ?? existingSimulation.financialInputs?.fixedCosts ?? 0,
        customerAcquisitionCost:
          data.financialInputs.customerAcquisitionCost ??
          existingSimulation.financialInputs?.customerAcquisitionCost ??
          0,
        monthlyNewCustomers:
          data.financialInputs.monthlyNewCustomers ??
          existingSimulation.financialInputs?.monthlyNewCustomers ??
          0,
        averageCustomerLifetime:
          data.financialInputs.averageCustomerLifetime ??
          existingSimulation.financialInputs?.averageCustomerLifetime ??
          0,
      };

      calculationResult = calculateFinancialMetrics(mergedFinancials);
    }

    // Execute atomic transaction for updates
    const simulation = await prisma.$transaction(async (tx) => {
      // 1. Update main simulation
      if (data.name || data.description) {
        await tx.simulation.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            updatedAt: new Date(),
          },
        });
      }

      // 2. Update Lean Canvas if provided
      if (data.leanCanvas && existingSimulation.leanCanvas) {
        await tx.leanCanvas.update({
          where: { id: existingSimulation.leanCanvas.id },
          data: {
            ...data.leanCanvas,
            updatedAt: new Date(),
          },
        });
      }

      // 3. Update Financial Inputs if provided
      if (data.financialInputs && existingSimulation.financialInputs) {
        await tx.financialInputs.update({
          where: { simulationId: id },
          data: {
            ...data.financialInputs,
            updatedAt: new Date(),
          },
        });
      }

      // 4. Update Results if recalculation is needed
      if (needsRecalculation && calculationResult && existingSimulation.results) {
        // Helper function to convert Infinity and NaN to safe database values
        const safeFloat = (value: number): number => {
          if (!Number.isFinite(value)) {
            return -1; // Use -1 to represent infinite/impossible values
          }
          return value;
        };

        await tx.simulationResults.update({
          where: { simulationId: id },
          data: {
            // Updated KPI values (safe conversion for database)
            unitMargin: safeFloat(calculationResult.kpis.unitMargin),
            monthlyRevenue: safeFloat(calculationResult.kpis.monthlyRevenue),
            monthlyProfit: safeFloat(calculationResult.kpis.monthlyProfit),
            ltv: safeFloat(calculationResult.kpis.ltv),
            cac: safeFloat(calculationResult.kpis.cac),
            cacLtvRatio: safeFloat(calculationResult.kpis.cacLtvRatio),
            breakEvenUnits: safeFloat(calculationResult.kpis.breakEvenUnits),
            breakEvenMonths: safeFloat(calculationResult.kpis.breakEvenMonths),
            // Updated health indicators
            profitabilityHealth: calculationResult.health.profitabilityHealth,
            ltvCacHealth: calculationResult.health.ltvCacHealth,
            overallHealth: calculationResult.health.overallHealth,
            // Updated recommendations and insights
            recommendations: JSON.parse(JSON.stringify(calculationResult.recommendations)),
            insights: {
              calculatedAt: calculationResult.calculatedAt,
              calculationVersion: calculationResult.calculationVersion,
            },
            // Update calculation metadata
            calculatedAt: calculationResult.calculatedAt,
            calculationVersion: calculationResult.calculationVersion,
            updatedAt: new Date(),
          },
        });
      }

      // 5. Fetch and return updated simulation
      return await tx.simulation.findFirst({
        where: { id, deviceId },
        include: {
          leanCanvas: true,
          financialInputs: true,
          results: true,
        },
      });
    });

    return { success: true, data: simulation };
  } catch (error) {
    console.error("Error updating complete simulation:", error);
    return { success: false, error: "Failed to update complete simulation" };
  }
}

/**
 * Gets a complete simulation with all relations
 */
export async function getCompleteSimulation(id: string, deviceId: string) {
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
    console.error("Error fetching complete simulation:", error);
    return { success: false, error: "Failed to fetch complete simulation" };
  }
}

/**
 * Lists simulations with pagination for historial
 */
export async function getCompleteSimulations(query: ListSimulationsQueryInput, deviceId: string) {
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
    console.error("Error fetching complete simulations:", error);
    return { success: false, error: "Failed to fetch complete simulations" };
  }
}

/**
 * Deletes a complete simulation (cascading deletes handled by Prisma schema)
 */
export async function deleteCompleteSimulation(id: string, deviceId: string) {
  try {
    const existingSimulation = await prisma.simulation.findFirst({
      where: { id, deviceId },
    });

    if (!existingSimulation) {
      return { success: false, error: "Simulation not found" };
    }

    // Prisma handles cascading deletes based on schema relations
    await prisma.simulation.delete({
      where: { id },
    });

    return { success: true, data: { message: "Simulation deleted successfully" } };
  } catch (error) {
    console.error("Error deleting complete simulation:", error);
    return { success: false, error: "Failed to delete complete simulation" };
  }
}
