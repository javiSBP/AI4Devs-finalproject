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
        cacLtvRatio: 0.0417, // CAC/LTV = 0.0417, so LTV/CAC = 24 (>3, good)
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
        cacLtvRatio: 0.5, // CAC/LTV = 0.5, so LTV/CAC = 2 (between 1 and 3, medium)
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
        cacLtvRatio: 1.33, // CAC/LTV = 1.33, so LTV/CAC = 0.75 (<1, bad)
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
      const recommendations = generateRecommendations(goodKpis, goodHealth, validInputs);

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

      const recommendations = generateRecommendations(mediumKpis, mediumHealth, validInputs);

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

      const recommendations = generateRecommendations(badKpis, badHealth, validInputs);

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

      const recommendations = generateRecommendations(longBreakEvenKpis, mediumHealth, validInputs);

      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.title).toBe("Punto de equilibrio");
      expect(optimizationRec?.status).toBe("warning");
      expect(optimizationRec?.message).toContain("30 meses");
    });

    it("should handle infinite break-even months", () => {
      const infiniteBreakEvenKpis = { ...goodKpis, breakEvenMonths: Infinity };

      const recommendations = generateRecommendations(
        infiniteBreakEvenKpis,
        goodHealth,
        validInputs
      );

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

  describe("Updated Health Classification Logic", () => {
    it("should classify profitability health correctly with dynamic thresholds", () => {
      // Caso 1: Margen positivo con pérdidas pequeñas (< 10% de ingresos)
      const smallLossCase = calculateKPIs({
        averagePrice: 100,
        costPerUnit: 80,
        fixedCosts: 500, // Reducido para que la pérdida sea menor
        customerAcquisitionCost: 10,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const smallLossHealth = classifyHealth(smallLossCase);
      // Revenue = 1000€, VariableCosts = 800€, CAC = 100€, FixedCosts = 500€
      // Profit = 1000 - 800 - 100 - 500 = -400€ (threshold = 100€, so this is "bad")
      expect(smallLossHealth.profitabilityHealth).toBe("bad"); // Corrijo expectativa

      // Caso 1b: Pérdidas realmente pequeñas
      const actualSmallLossCase = calculateKPIs({
        averagePrice: 100,
        costPerUnit: 80,
        fixedCosts: 50, // Muy bajo para pérdidas pequeñas
        customerAcquisitionCost: 5,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const actualSmallLossHealth = classifyHealth(actualSmallLossCase);
      // Revenue = 1000€, VariableCosts = 800€, CAC = 50€, FixedCosts = 50€
      // Profit = 1000 - 800 - 50 - 50 = 100€ (positivo = good)
      expect(actualSmallLossHealth.profitabilityHealth).toBe("good");

      // Caso 2: Margen positivo con pérdidas significativas (> 10% de ingresos)
      const largeLossCase = calculateKPIs({
        averagePrice: 100,
        costPerUnit: 80,
        fixedCosts: 2000,
        customerAcquisitionCost: 10,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const largeLossHealth = classifyHealth(largeLossCase);
      // Revenue = 1000€, Loss = 1600€ (much > 10% threshold)
      expect(largeLossHealth.profitabilityHealth).toBe("bad");

      // Caso 3: Beneficio positivo
      const profitCase = calculateKPIs({
        averagePrice: 100,
        costPerUnit: 30,
        fixedCosts: 500,
        customerAcquisitionCost: 10,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const profitHealth = classifyHealth(profitCase);
      expect(profitHealth.profitabilityHealth).toBe("good");
    });

    it("should handle edge cases in profitability classification", () => {
      // Margen negativo siempre debe ser "bad"
      const negativeMarginCase = calculateKPIs({
        averagePrice: 50,
        costPerUnit: 80,
        fixedCosts: 100,
        customerAcquisitionCost: 5,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const negativeMarginHealth = classifyHealth(negativeMarginCase);
      expect(negativeMarginHealth.profitabilityHealth).toBe("bad");

      // Pérdidas exactamente en el umbral del 10%
      const thresholdCase = calculateKPIs({
        averagePrice: 100,
        costPerUnit: 90,
        fixedCosts: 195, // Ajustado para generar pérdida pequeña
        customerAcquisitionCost: 0,
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      });

      const thresholdHealth = classifyHealth(thresholdCase);
      // Revenue = 1000€, VariableCosts = 900€, FixedCosts = 195€
      // Profit = 1000 - 900 - 195 = -95€ (< 10% threshold = 100€)
      expect(thresholdHealth.profitabilityHealth).toBe("medium");
    });

    it("should detect critical CAC > LTV scenarios like in the user image", () => {
      // Caso de la imagen del usuario: precio 7€, coste 5€, CAC 50€, duración 6 meses
      const criticalCase = calculateKPIs({
        averagePrice: 7,
        costPerUnit: 5,
        fixedCosts: 570,
        customerAcquisitionCost: 50,
        monthlyNewCustomers: 20,
        averageCustomerLifetime: 6,
      });

      const criticalHealth = classifyHealth(criticalCase);
      const criticalRecommendations = generateRecommendations(criticalCase, criticalHealth, {
        averagePrice: 7,
        costPerUnit: 5,
        fixedCosts: 570,
        customerAcquisitionCost: 50,
        monthlyNewCustomers: 20,
        averageCustomerLifetime: 6,
      });

      // Verificar cálculos
      expect(criticalCase.unitMargin).toBe(2); // 7 - 5
      expect(criticalCase.ltv).toBe(12); // 2 * 6
      expect(criticalCase.cac).toBe(50);
      expect(criticalCase.monthlyProfit).toBe(-1530); // 140 - 100 - 570 - 1000

      // Verificar que se detecta el caso crítico
      expect(criticalCase.cac).toBeGreaterThan(criticalCase.ltv); // 50 > 12
      expect(criticalHealth.overallHealth).toBe("bad"); // Debe ser bad por CAC > LTV

      // Verificar que hay alerta crítica
      const criticalAlert = criticalRecommendations.find((r) => r.title.includes("ALERTA CRÍTICA"));
      expect(criticalAlert).toBeDefined();
      expect(criticalAlert?.status).toBe("negative");
      expect(criticalAlert?.message).toContain("pierdes dinero con cada cliente nuevo");
    });
  });
});
