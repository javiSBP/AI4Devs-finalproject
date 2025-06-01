import { useState, useCallback } from "react";
import type { LeanCanvasData } from "@/types/lean-canvas";
import type { FinancialInputs, CalculationResult } from "@/lib/financial/kpi-calculator";

// Helper to generate a device ID (browser fingerprint)
function getDeviceId(): string {
  if (typeof window === "undefined") return "server";

  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    // Generate a simple device ID based on browser characteristics
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Device fingerprint", 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join("|");

    deviceId = "fp_" + btoa(fingerprint).slice(0, 20);
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

// Helper function to ensure financial inputs are numbers
const normalizeFinancialInputs = (inputs: Partial<FinancialInputs>): Partial<FinancialInputs> => {
  const normalized: Partial<FinancialInputs> = {};

  if (inputs.averagePrice !== undefined) {
    normalized.averagePrice = Number(inputs.averagePrice);
  }
  if (inputs.costPerUnit !== undefined) {
    normalized.costPerUnit = Number(inputs.costPerUnit);
  }
  if (inputs.fixedCosts !== undefined) {
    normalized.fixedCosts = Number(inputs.fixedCosts);
  }
  if (inputs.customerAcquisitionCost !== undefined) {
    normalized.customerAcquisitionCost = Number(inputs.customerAcquisitionCost);
  }
  if (inputs.monthlyNewCustomers !== undefined) {
    normalized.monthlyNewCustomers = Number(inputs.monthlyNewCustomers);
  }
  if (inputs.averageCustomerLifetime !== undefined) {
    normalized.averageCustomerLifetime = Number(inputs.averageCustomerLifetime);
  }

  return normalized;
};

interface CompleteSimulation {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  leanCanvas: LeanCanvasData;
  financialInputs: FinancialInputs;
  results: CalculationResult;
}

interface CreateSimulationData {
  name: string;
  description?: string;
  leanCanvas: LeanCanvasData;
  financialInputs: FinancialInputs;
}

interface UpdateSimulationData {
  name?: string;
  description?: string;
  leanCanvas?: Partial<LeanCanvasData>;
  financialInputs?: Partial<FinancialInputs>;
}

interface SimulationListItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  leanCanvas?: {
    id: string;
    name: string;
    description?: string;
    problem?: string;
    solution?: string;
    uniqueValueProposition?: string;
  };
  results?: {
    id: string;
    overallHealth: string;
    monthlyProfit: number;
    ltv: number;
    cacLtvRatio: number;
    calculatedAt: string;
  };
}

interface PaginatedResponse<T> {
  simulations: T[];
  pagination: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    totalRecords: number;
  };
}

interface LegacySimulation {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  leanCanvas: LeanCanvasData;
  financialInputs: FinancialInputs;
  // Legacy format may not have results
  results?: CalculationResult;
  date?: string; // Legacy field
}

export function useSimulations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Make API call with device ID header
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const deviceId = getDeviceId();

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": deviceId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  };

  // Fallback to localStorage for backward compatibility
  const localStorageFallback = {
    save: (data: CreateSimulationData): LegacySimulation => {
      try {
        const savedSimulations = localStorage.getItem("simulations");
        const simulations = savedSimulations ? JSON.parse(savedSimulations) : [];
        const newSimulation: LegacySimulation = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        };
        simulations.push(newSimulation);
        localStorage.setItem("simulations", JSON.stringify(simulations));
        return newSimulation;
      } catch (err) {
        console.error("LocalStorage fallback save failed:", err);
        throw err;
      }
    },

    list: (): LegacySimulation[] => {
      try {
        const savedSimulations = localStorage.getItem("simulations");
        return savedSimulations ? JSON.parse(savedSimulations) : [];
      } catch (err) {
        console.error("LocalStorage fallback list failed:", err);
        return [];
      }
    },

    get: (id: string): LegacySimulation | null => {
      try {
        const savedSimulations = localStorage.getItem("simulations");
        const simulations = savedSimulations ? JSON.parse(savedSimulations) : [];
        return simulations.find((sim: LegacySimulation) => sim.id === id) || null;
      } catch (err) {
        console.error("LocalStorage fallback get failed:", err);
        return null;
      }
    },
  };

  // Create a complete simulation
  const createSimulation = useCallback(
    async (
      data: CreateSimulationData
    ): Promise<{
      success: boolean;
      data: CompleteSimulation;
      usedFallback: boolean;
      error?: string;
    }> => {
      setLoading(true);
      setError(null);

      try {
        // Normalize financial inputs to ensure they are numbers
        const normalizedData = {
          ...data,
          financialInputs: normalizeFinancialInputs(data.financialInputs) as FinancialInputs,
        };

        const result = await apiCall("/api/v1/simulations", {
          method: "POST",
          body: JSON.stringify(normalizedData),
        });

        return {
          success: true,
          data: result,
          usedFallback: false,
        };
      } catch (err) {
        console.warn("API call failed, using localStorage fallback:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`API unavailable: ${errorMessage}`);

        // Fallback to localStorage - we need to calculate results manually for legacy compatibility
        const legacy = localStorageFallback.save(data);

        // For localStorage fallback, calculate results using the KPI calculator
        const { calculateFinancialMetrics } = await import("@/lib/financial/kpi-calculator");
        const results = calculateFinancialMetrics(data.financialInputs);

        return {
          success: false,
          data: {
            ...legacy,
            results,
          } as CompleteSimulation,
          usedFallback: true,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [localStorageFallback, normalizeFinancialInputs]
  );

  // Get a specific simulation
  const getSimulation = useCallback(
    async (id: string): Promise<CompleteSimulation | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(`/api/v1/simulations/${id}`);
        return result;
      } catch (err) {
        console.warn("API call failed, using localStorage fallback:", err);
        setError(`API unavailable: ${err}`);

        // Fallback to localStorage
        const legacy = localStorageFallback.get(id);
        if (!legacy) return null;

        // If results are missing, calculate them
        if (!legacy.results) {
          const { calculateFinancialMetrics } = await import("@/lib/financial/kpi-calculator");
          const results = calculateFinancialMetrics(legacy.financialInputs);
          return {
            ...legacy,
            results,
          } as CompleteSimulation;
        }

        return legacy as CompleteSimulation;
      } finally {
        setLoading(false);
      }
    },
    [localStorageFallback]
  );

  // Update a simulation
  const updateSimulation = useCallback(
    async (id: string, data: UpdateSimulationData): Promise<CompleteSimulation> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(`/api/v1/simulations/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        return result;
      } catch (err) {
        console.warn("API call failed:", err);
        setError(`API unavailable: ${err}`);
        throw err; // For update, we don't have a good localStorage fallback
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // List simulations with pagination
  const listSimulations = useCallback(
    async (
      page = 1,
      limit = 10,
      sort = "updatedAt",
      order = "desc"
    ): Promise<PaginatedResponse<SimulationListItem>> => {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/v1/simulations?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
        const result = await apiCall(url);
        return result;
      } catch (err) {
        console.warn("API call failed, using localStorage fallback:", err);
        setError(`API unavailable: ${err}`);

        // Fallback to localStorage - convert legacy format to list format
        const legacySimulations = localStorageFallback.list();
        const convertedSimulations: SimulationListItem[] = legacySimulations.map((sim) => ({
          id: sim.id,
          name: sim.name,
          description: sim.description,
          createdAt: sim.createdAt,
          updatedAt: sim.updatedAt,
          leanCanvas: {
            id: `legacy_${sim.id}`,
            name: sim.leanCanvas.name,
            description: sim.leanCanvas.description,
            problem: sim.leanCanvas.problem,
            solution: sim.leanCanvas.solution,
            uniqueValueProposition: sim.leanCanvas.uniqueValueProposition,
          },
          results: sim.results
            ? {
                id: `legacy_results_${sim.id}`,
                overallHealth: sim.results.health.overallHealth,
                monthlyProfit: sim.results.kpis.monthlyProfit,
                ltv: sim.results.kpis.ltv,
                cacLtvRatio: sim.results.kpis.cacLtvRatio,
                calculatedAt: sim.results.calculatedAt.toISOString(),
              }
            : undefined,
        }));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
          simulations: convertedSimulations.slice(startIndex, endIndex),
          pagination: {
            current: page,
            total: Math.ceil(convertedSimulations.length / limit),
            hasNext: page < Math.ceil(convertedSimulations.length / limit),
            hasPrev: page > 1,
            limit,
            totalRecords: convertedSimulations.length,
          },
        };
      } finally {
        setLoading(false);
      }
    },
    [localStorageFallback]
  );

  // Delete a simulation
  const deleteSimulation = useCallback(async (id: string): Promise<{ message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(`/api/v1/simulations/${id}`, {
        method: "DELETE",
      });

      return result;
    } catch (err) {
      console.warn("API call failed:", err);
      setError(`API unavailable: ${err}`);
      throw err; // For delete, we don't have a good localStorage fallback
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSimulation,
    getSimulation,
    updateSimulation,
    listSimulations,
    deleteSimulation,
    loading,
    error,
    clearError: () => setError(null),
  };
}
