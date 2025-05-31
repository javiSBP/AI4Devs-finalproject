import { describe, it, expect } from "vitest";
import {
  FinancialInputs,
  calculateKPIs,
  classifyHealth,
  generateRecommendations,
  calculateFinancialMetrics,
} from "./kpi-calculator";

describe("KPI Calculator", () => {
  // Valid test data
  const validInputs: FinancialInputs = {
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 50,
    averageCustomerLifetime: 12,
  };

  describe("calculateKPIs", () => {
    it("should calculate all KPIs correctly with valid inputs", () => {
      const result = calculateKPIs(validInputs);

      expect(result.unitMargin).toBe(50); // 100 - 50
      expect(result.monthlyRevenue).toBe(5000); // 100 * 50
      expect(result.monthlyProfit).toBe(250); // 5000 - (50*50) - 1000 - (25*50)
      expect(result.ltv).toBe(600); // 50 * 12
      expect(result.cac).toBe(25);
      expect(result.cacLtvRatio).toBeCloseTo(0.0417, 4); // 25/600
      expect(result.breakEvenUnits).toBe(20); // 1000/50
      expect(result.breakEvenMonths).toBeCloseTo(0.4, 1); // 20/50
    });

    it("should handle zero fixed costs", () => {
      const inputs = { ...validInputs, fixedCosts: 0 };
      const result = calculateKPIs(inputs);

      expect(result.breakEvenUnits).toBe(0);
      expect(result.breakEvenMonths).toBe(0);
    });

    it("should handle zero unit margin for break-even", () => {
      const inputs = { ...validInputs, costPerUnit: 100 };
      const result = calculateKPIs(inputs);

      expect(result.unitMargin).toBe(0);
      expect(result.breakEvenUnits).toBe(0); // Infinity converted to 0
      expect(result.breakEvenMonths).toBe(0); // Infinity converted to 0
    });

    it("should handle zero LTV for CAC ratio", () => {
      const inputs = { ...validInputs, averageCustomerLifetime: 0 };
      const result = calculateKPIs(inputs);

      expect(result.ltv).toBe(0);
      expect(result.cacLtvRatio).toBe(Infinity);
    });

    it("should calculate negative monthly profit correctly", () => {
      const inputs = { ...validInputs, fixedCosts: 10000 };
      const result = calculateKPIs(inputs);

      expect(result.monthlyProfit).toBe(-8750); // 5000 - 2500 - 10000 - 1250
    });

    it("should handle zero CAC", () => {
      const inputs = { ...validInputs, customerAcquisitionCost: 0 };
      const result = calculateKPIs(inputs);

      expect(result.cac).toBe(0);
      expect(result.cacLtvRatio).toBe(0);
    });
  });

  describe("classifyHealth", () => {
    it("should classify good health", () => {
      const kpis = {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 25,
        cacLtvRatio: 0.0417, // <0.33
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      };

      const health = classifyHealth(kpis);

      expect(health.profitabilityHealth).toBe("good");
      expect(health.ltvCacHealth).toBe("good");
      expect(health.overallHealth).toBe("good");
    });

    it("should classify medium profitability health", () => {
      const kpis = {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: -500, // Negative but positive unit margin
        ltv: 600,
        cac: 25,
        cacLtvRatio: 0.0417,
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      };

      const health = classifyHealth(kpis);

      expect(health.profitabilityHealth).toBe("medium");
      expect(health.overallHealth).toBe("medium"); // Not both good
    });

    it("should classify bad profitability health", () => {
      const kpis = {
        unitMargin: -10, // Negative unit margin
        monthlyRevenue: 5000,
        monthlyProfit: -2000,
        ltv: 600,
        cac: 25,
        cacLtvRatio: 0.0417,
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      };

      const health = classifyHealth(kpis);

      expect(health.profitabilityHealth).toBe("bad");
      expect(health.overallHealth).toBe("bad");
    });

    it("should classify medium LTV/CAC health", () => {
      const kpis = {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 300,
        cacLtvRatio: 0.5, // Between 0.33 and 1
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      };

      const health = classifyHealth(kpis);

      expect(health.ltvCacHealth).toBe("medium");
      expect(health.overallHealth).toBe("medium");
    });

    it("should classify bad LTV/CAC health", () => {
      const kpis = {
        unitMargin: 50,
        monthlyRevenue: 5000,
        monthlyProfit: 2000,
        ltv: 600,
        cac: 800,
        cacLtvRatio: 1.33, // >1
        breakEvenUnits: 20,
        breakEvenMonths: 0.4,
      };

      const health = classifyHealth(kpis);

      expect(health.ltvCacHealth).toBe("bad");
      expect(health.overallHealth).toBe("bad");
    });
  });

  describe("generateRecommendations", () => {
    const goodKpis = {
      unitMargin: 50,
      monthlyRevenue: 5000,
      monthlyProfit: 2000,
      ltv: 600,
      cac: 25,
      cacLtvRatio: 0.0417,
      breakEvenUnits: 20,
      breakEvenMonths: 0.4,
    };

    const goodHealth = {
      profitabilityHealth: "good" as const,
      ltvCacHealth: "good" as const,
      overallHealth: "good" as const,
    };

    it("should generate positive recommendations for good health", () => {
      const recommendations = generateRecommendations(goodKpis, goodHealth);

      expect(recommendations).toHaveLength(4); // viability, acquisition, optimization, next_steps

      const viabilityRec = recommendations.find((r) => r.type === "viability");
      expect(viabilityRec?.status).toBe("positive");
      expect(viabilityRec?.title).toBe("Viabilidad económica");

      const acquisitionRec = recommendations.find((r) => r.type === "acquisition");
      expect(acquisitionRec?.status).toBe("positive");
      expect(acquisitionRec?.title).toBe("Eficiencia de adquisición de clientes");

      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.status).toBe("positive");
      expect(optimizationRec?.title).toBe("Optimización del modelo");

      const nextStepsRec = recommendations.find((r) => r.type === "next_steps");
      expect(nextStepsRec?.status).toBe("neutral");
      expect(nextStepsRec?.title).toBe("Próximos pasos");
    });

    it("should generate warning for medium profitability", () => {
      const mediumKpis = { ...goodKpis, monthlyProfit: -500 };
      const mediumHealth = {
        ...goodHealth,
        profitabilityHealth: "medium" as const,
        overallHealth: "medium" as const,
      };

      const recommendations = generateRecommendations(mediumKpis, mediumHealth);

      const viabilityRec = recommendations.find((r) => r.type === "viability");
      expect(viabilityRec?.status).toBe("warning");
      expect(viabilityRec?.message).toContain(
        "margen unitario positivo pero <strong>pérdidas mensuales</strong>"
      );
    });

    it("should generate negative recommendations for bad health", () => {
      const badKpis = { ...goodKpis, unitMargin: -10, monthlyProfit: -500, cacLtvRatio: 1.5 };
      const badHealth = {
        profitabilityHealth: "bad" as const,
        ltvCacHealth: "bad" as const,
        overallHealth: "bad" as const,
      };

      const recommendations = generateRecommendations(badKpis, badHealth);

      const viabilityRec = recommendations.find((r) => r.type === "viability");
      expect(viabilityRec?.status).toBe("negative");
      expect(viabilityRec?.message).toContain("pérdidas mensuales");

      const acquisitionRec = recommendations.find((r) => r.type === "acquisition");
      expect(acquisitionRec?.status).toBe("negative");
      expect(acquisitionRec?.message).toContain("preocupante");
    });

    it("should generate warning for long break-even period", () => {
      const longBreakEvenKpis = { ...goodKpis, breakEvenMonths: 30 };
      const mediumHealth = {
        ...goodHealth,
        overallHealth: "medium" as const,
      };

      const recommendations = generateRecommendations(longBreakEvenKpis, mediumHealth);

      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.title).toBe("Punto de equilibrio");
      expect(optimizationRec?.status).toBe("warning");
      expect(optimizationRec?.message).toContain("30 meses");
    });

    it("should handle infinite break-even months", () => {
      const infiniteBreakEvenKpis = { ...goodKpis, breakEvenMonths: Infinity };

      const recommendations = generateRecommendations(infiniteBreakEvenKpis, goodHealth);

      // Should not generate break-even warning for Infinity
      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.title).toBe("Optimización del modelo");
      expect(optimizationRec?.message).toContain("¡Excelente!");
    });
  });

  describe("calculateFinancialMetrics", () => {
    it("should return complete calculation result for valid inputs", () => {
      const result = calculateFinancialMetrics(validInputs);

      expect(result.kpis.unitMargin).toBe(50);
      expect(result.health.overallHealth).toBe("good");
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations).toHaveLength(4);
      expect(result.calculatedAt).toBeInstanceOf(Date);
      expect(result.calculationVersion).toBe("1.0");
    });

    it("should handle edge case calculations", () => {
      const edgeInputs: FinancialInputs = {
        averagePrice: 10,
        costPerUnit: 15, // Higher than price (negative margin)
        fixedCosts: 0,
        customerAcquisitionCost: 100,
        monthlyNewCustomers: 1,
        averageCustomerLifetime: 1,
      };

      const result = calculateFinancialMetrics(edgeInputs);

      expect(result.kpis.unitMargin).toBe(-5);
      expect(result.health.profitabilityHealth).toBe("bad");
      expect(result.health.overallHealth).toBe("bad");

      const viabilityRec = result.recommendations.find((r) => r.type === "viability");
      expect(viabilityRec?.status).toBe("negative");
    });

    it("should calculate with zero values correctly", () => {
      const zeroInputs = {
        ...validInputs,
        fixedCosts: 0,
        customerAcquisitionCost: 0,
      };

      const result = calculateFinancialMetrics(zeroInputs);

      expect(result.kpis.cac).toBe(0);
      expect(result.kpis.cacLtvRatio).toBe(0);
      expect(result.kpis.breakEvenUnits).toBe(0);
    });

    it("should maintain calculation metadata", () => {
      const result = calculateFinancialMetrics(validInputs);

      expect(result.calculatedAt).toBeInstanceOf(Date);
      expect(result.calculationVersion).toBe("1.0");
      expect(Math.abs(result.calculatedAt.getTime() - Date.now())).toBeLessThan(1000); // Within 1 second
    });
  });
});
