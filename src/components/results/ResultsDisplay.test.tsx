import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResultsDisplay from "./ResultsDisplay";
import type { CalculationResult } from "@/lib/financial/kpi-calculator";
import type { LeanCanvasData } from "@/types/lean-canvas";
import type { FinancialInputs } from "@/lib/financial/kpi-calculator";

// Mock data for testing
const mockLeanCanvasData: LeanCanvasData = {
  name: "Test Business",
  description: "Test description",
  problem: "Test problem",
  solution: "Test solution",
  uniqueValueProposition: "Test UVP",
  customerSegments: "Test segments",
  channels: "Test channels",
  revenueStreams: "Test revenue",
};

const mockFinancialInputs: FinancialInputs = {
  averagePrice: 100,
  costPerUnit: 50,
  fixedCosts: 1000,
  customerAcquisitionCost: 20,
  monthlyNewCustomers: 50,
  averageCustomerLifetime: 12,
};

describe("ResultsDisplay LTV/CAC Ratio Formatting", () => {
  it("should format LTV/CAC ratio as integer when >= 1", () => {
    // LTV = (100-50) * 12 = 600, CAC = 20, ratio = 600/20 = 30
    const mockResult: CalculationResult = {
      kpis: {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 20,
        cacLtvRatio: 20 / 600, // CAC/LTV = 0.033, so LTV/CAC = 30
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      },
      health: {
        profitabilityHealth: "good",
        ltvCacHealth: "good",
        overallHealth: "good",
      },
      recommendations: [],
      calculatedAt: new Date(),
      calculationVersion: "1.0",
    };

    render(
      <ResultsDisplay
        calculationResult={mockResult}
        leanCanvasData={mockLeanCanvasData}
        financialInputs={mockFinancialInputs}
      />
    );

    // Should show "30" not "30.00" or "30.0"
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("should format LTV/CAC ratio with 1 decimal when < 1", () => {
    // LTV = (100-50) * 12 = 600, CAC = 800, ratio = 600/800 = 0.75
    const mockResult: CalculationResult = {
      kpis: {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 800,
        cacLtvRatio: 800 / 600, // CAC/LTV = 1.33, so LTV/CAC = 0.75
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      },
      health: {
        profitabilityHealth: "good",
        ltvCacHealth: "bad",
        overallHealth: "bad",
      },
      recommendations: [],
      calculatedAt: new Date(),
      calculationVersion: "1.0",
    };

    render(
      <ResultsDisplay
        calculationResult={mockResult}
        leanCanvasData={mockLeanCanvasData}
        financialInputs={mockFinancialInputs}
      />
    );

    // Should show "0.8" (rounded from 0.75)
    expect(screen.getByText("0.8")).toBeInTheDocument();
  });

  it("should handle CAC = 0 (free acquisition) correctly", () => {
    const mockResult: CalculationResult = {
      kpis: {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 0,
        cacLtvRatio: 0, // Special case for CAC = 0
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      },
      health: {
        profitabilityHealth: "good",
        ltvCacHealth: "good",
        overallHealth: "good",
      },
      recommendations: [],
      calculatedAt: new Date(),
      calculationVersion: "1.0",
    };

    render(
      <ResultsDisplay
        calculationResult={mockResult}
        leanCanvasData={mockLeanCanvasData}
        financialInputs={mockFinancialInputs}
      />
    );

    // Should show "Perfecto (CAC gratuito)"
    expect(screen.getByText("Perfecto (CAC gratuito)")).toBeInTheDocument();
  });
});
