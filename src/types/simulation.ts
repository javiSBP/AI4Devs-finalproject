import type { LeanCanvasData } from "./lean-canvas";
import type { FinancialInputs, CalculationResult } from "@/lib/financial/kpi-calculator";

/**
 * Complete simulation with all related data
 */
export interface CompleteSimulation {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deviceId: string;
  leanCanvas: LeanCanvasData;
  financialInputs: FinancialInputs;
  results: CalculationResult;
}

/**
 * Data required to create a new simulation
 */
export interface CreateSimulationData {
  name: string;
  description?: string;
  leanCanvas: LeanCanvasData;
  financialInputs: FinancialInputs;
}

/**
 * Data for updating an existing simulation
 */
export interface UpdateSimulationData {
  name?: string;
  description?: string;
  leanCanvas?: Partial<LeanCanvasData>;
  financialInputs?: Partial<FinancialInputs>;
}

/**
 * Simulation item in list view (with selected fields for performance)
 */
export interface SimulationListItem {
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
  financialInputs?: FinancialInputs; // Include for real-time calculation consistency
  results?: {
    id: string;
    overallHealth: string;
    monthlyProfit: number;
    ltv: number;
    cacLtvRatio: number;
    calculatedAt: string;
  };
}

/**
 * Paginated response for simulation listings
 */
export interface PaginatedSimulationsResponse {
  simulations: SimulationListItem[];
  pagination: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    totalRecords: number;
  };
}

/**
 * Sort options for simulation listings
 */
export type SimulationSortField = "name" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

/**
 * Query parameters for listing simulations
 */
export interface SimulationListParams {
  page?: number;
  limit?: number;
  sort?: SimulationSortField;
  order?: SortOrder;
}

/**
 * Response from simulation operations
 */
export interface SimulationOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
