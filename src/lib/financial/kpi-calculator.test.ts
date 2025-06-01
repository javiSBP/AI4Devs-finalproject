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

      expect(recommendations).toHaveLength(3); // viability, acquisition, optimization (next_steps es condicional)

      const viabilityRec = recommendations.find((r) => r.type === "viability");
      expect(viabilityRec?.status).toBe("positive");
      expect(viabilityRec?.title).toBe("Viabilidad económica");
      expect(viabilityRec?.message).toContain("beneficio del");

      const acquisitionRec = recommendations.find((r) => r.type === "acquisition");
      expect(acquisitionRec?.status).toBe("positive");
      expect(acquisitionRec?.title).toBe("Eficiencia de adquisición de clientes");
      expect(acquisitionRec?.message).toContain("Ratio excelente");

      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.status).toBe("positive");
      expect(optimizationRec?.title).toBe("Optimización del modelo");
      expect(optimizationRec?.message).toContain("Negocio saludable");
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
      expect(viabilityRec?.message).toContain("margen unitario positivo");
      expect(viabilityRec?.message).toContain("pérdidas de €500/mes");
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
      expect(viabilityRec?.message).toContain("Modelo inviable");
      expect(viabilityRec?.message).toContain("cada cliente genera €35 de pérdida neta");

      const acquisitionRec = recommendations.find((r) => r.type === "acquisition");
      expect(acquisitionRec?.status).toBe("negative");
      expect(acquisitionRec?.message).toContain("Ratio insuficiente");
    });

    it("should generate warning for long break-even period", () => {
      const longBreakEvenKpis = { ...goodKpis, breakEvenMonths: 30 };
      const mediumHealth = {
        ...goodHealth,
        overallHealth: "medium" as const,
      };

      const recommendations = generateRecommendations(longBreakEvenKpis, mediumHealth, validInputs);

      const optimizationRec = recommendations.find((r) => r.type === "optimization");
      expect(optimizationRec?.title).toBe("Aceleración del punto de equilibrio");
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
      expect(optimizationRec?.message).toContain("Negocio saludable");
    });
  });

  describe("calculateFinancialMetrics", () => {
    it("should return complete calculation result for valid inputs", () => {
      const result = calculateFinancialMetrics(validInputs);

      expect(result.kpis.unitMargin).toBe(50);
      expect(result.health.overallHealth).toBe("good");
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations).toHaveLength(3); // viability, acquisition, optimization
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

    it("should handle edge cases and invalid numbers", () => {
      const result = calculateFinancialMetrics({
        averagePrice: NaN,
        costPerUnit: Infinity,
        fixedCosts: -Infinity,
        customerAcquisitionCost: 0,
        monthlyNewCustomers: 0,
        averageCustomerLifetime: 0,
      });

      // Invalid inputs should be converted to 0, making calculations finite
      expect(result.kpis.unitMargin).toBe(0); // 0 - 0 = 0
      expect(result.kpis.monthlyRevenue).toBe(0); // 0 * 0 = 0
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should generate more useful viability messages with specific percentages and actions", () => {
      // Caso 1: Pérdidas manejables (menores que costes fijos)
      const manageableLossCase = calculateFinancialMetrics({
        averagePrice: 50,
        costPerUnit: 40,
        fixedCosts: 1000,
        customerAcquisitionCost: 5,
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const manageableViabilityRec = manageableLossCase.recommendations.find(
        (r) => r.type === "viability"
      );
      expect(manageableViabilityRec).toBeDefined();
      expect(manageableViabilityRec?.status).toBe("negative");

      // Verificar que incluye porcentajes específicos para reducción factible
      expect(manageableViabilityRec?.message).toContain("reducir costes fijos un");
      expect(manageableViabilityRec?.message).toContain("%");
      expect(manageableViabilityRec?.message).toContain("de €1000 a €");
      expect(manageableViabilityRec?.message).toContain("aumentar ventas un");

      // Caso 2: Pérdidas críticas (mayores que costes fijos)
      const criticalLossCase = calculateFinancialMetrics({
        averagePrice: 10,
        costPerUnit: 8,
        fixedCosts: 1000,
        customerAcquisitionCost: 5,
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const criticalViabilityRec = criticalLossCase.recommendations.find(
        (r) => r.type === "viability"
      );
      expect(criticalViabilityRec).toBeDefined();
      expect(criticalViabilityRec?.status).toBe("negative");

      // Verificar que muestra el caso crítico correctamente
      expect(criticalViabilityRec?.message).toContain("Modelo inviable");
      expect(criticalViabilityRec?.message).toContain("cada cliente genera €3 de pérdida neta");
      expect(criticalViabilityRec?.message).toContain("AUMENTAR VENTAS EMPEORA LAS PÉRDIDAS");

      // Caso sin costes fijos (edge case)
      const noCostsCase = calculateFinancialMetrics({
        averagePrice: 10,
        costPerUnit: 8,
        fixedCosts: 0,
        customerAcquisitionCost: 15, // CAC alto para generar pérdidas
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const noCostsViabilityRec = noCostsCase.recommendations.find((r) => r.type === "viability");
      expect(noCostsViabilityRec?.message).toContain("Modelo inviable");
      expect(noCostsViabilityRec?.message).toContain("cada cliente genera €13 de pérdida neta");
    });

    it("should have consistent numbers across all recommendation sections", () => {
      // Caso específico del usuario: pérdidas de €640/mes
      const result = calculateFinancialMetrics({
        averagePrice: 7,
        costPerUnit: 5,
        fixedCosts: 500,
        customerAcquisitionCost: 9,
        monthlyNewCustomers: 20,
        averageCustomerLifetime: 6,
      });

      // Verificar cálculos base
      expect(result.kpis.monthlyProfit).toBe(-640); // -640€ pérdidas
      expect(result.kpis.breakEvenUnits).toBe(250); // 500€ fijos ÷ 2€ margen
      expect(result.kpis.ltv).toBe(12); // 2€ × 6 meses
      expect(result.kpis.cac).toBe(9);

      // Verificar clasificación de salud
      // LTV/CAC = 12/9 = 1.33, que ahora debería ser "bad" (< 2)
      expect(result.health.ltvCacHealth).toBe("bad");

      const viabilityRec = result.recommendations.find((r) => r.type === "viability");
      const nextStepsRec = result.recommendations.find((r) => r.type === "next_steps");

      // Viabilidad debe explicar que aumentar ventas empeora las pérdidas (CAC > margen)
      expect(viabilityRec?.message).toContain("Modelo inviable");
      expect(viabilityRec?.message).toContain("cada cliente genera €7 de pérdida neta");
      expect(viabilityRec?.message).toContain("AUMENTAR VENTAS EMPEORA LAS PÉRDIDAS");

      // Próximos pasos: ahora SÍ debe tener Prioridad 1 porque LTV/CAC es "bad"
      expect(nextStepsRec?.message).toContain("Prioridad 1:");
      expect(nextStepsRec?.message).toContain("Prioridad 2:");
      // Prioridad 2 ya NO debe sugerir aumentar ventas (porque CAC > margen)
      expect(nextStepsRec?.message).toContain("Para la adquisición de clientes");
      expect(nextStepsRec?.message).toContain("Cada cliente nuevo aumenta las pérdidas en €7/mes");
    });

    it("should use correct singular/plural forms for time units", () => {
      // Test 1 día (singular)
      const oneDayCase = calculateFinancialMetrics({
        averagePrice: 100,
        costPerUnit: 50,
        fixedCosts: 1000,
        customerAcquisitionCost: 1.67, // Aproximadamente 1 día de recovery
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const oneDayRec = oneDayCase.recommendations.find((r) => r.type === "acquisition");
      expect(oneDayRec?.message).toMatch(/\b1 día\b/); // 1 día (singular)
      expect(oneDayRec?.message).not.toContain("1 días"); // No debe ser plural

      // Test 1 semana (singular) - aprox 8-10 días
      const oneWeekCase = calculateFinancialMetrics({
        averagePrice: 100,
        costPerUnit: 50,
        fixedCosts: 1000,
        customerAcquisitionCost: 15, // 15/50 = 0.3 meses = ~9 días, que se redondeará a 1 semana
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const oneWeekRec = oneWeekCase.recommendations.find((r) => r.type === "acquisition");
      expect(oneWeekRec?.message).toMatch(/\b1 semana\b/); // 1 semana (singular)
      expect(oneWeekRec?.message).not.toContain("1 semanas"); // No debe ser plural

      // Test múltiples días (plural)
      const multipleDaysCase = calculateFinancialMetrics({
        averagePrice: 100,
        costPerUnit: 50,
        fixedCosts: 1000,
        customerAcquisitionCost: 5, // Aproximadamente 3 días
        monthlyNewCustomers: 50,
        averageCustomerLifetime: 12,
      });

      const multipleDaysRec = multipleDaysCase.recommendations.find(
        (r) => r.type === "acquisition"
      );
      expect(multipleDaysRec?.message).toMatch(/\b\d+ días\b/); // X días (plural)
      expect(multipleDaysRec?.message).not.toMatch(/\b1 días\b/); // No debe ser "1 días"
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

      // Verificar que las recomendaciones reflejan la criticidad del caso
      const acquisitionRec = criticalRecommendations.find((r) => r.type === "acquisition");
      expect(acquisitionRec).toBeDefined();
      expect(acquisitionRec?.status).toBe("negative");
      expect(acquisitionRec?.message).toContain("Ratio crítico");
      expect(acquisitionRec?.message).toContain("Pierdes €38");

      // Verificar que hay próximos pasos específicos para este caso crítico
      const nextStepsRec = criticalRecommendations.find((r) => r.type === "next_steps");
      expect(nextStepsRec).toBeDefined();
      expect(nextStepsRec?.message).toContain("Prioridad 1");
    });
  });
});

describe("Type Safety and Validation", () => {
  it("should handle string inputs gracefully by converting them to numbers", () => {
    // Test with form-like data that comes as strings
    const result = calculateFinancialMetrics({
      averagePrice: Number("7"),
      costPerUnit: Number("5"),
      fixedCosts: Number("500"),
      customerAcquisitionCost: Number("9"),
      monthlyNewCustomers: Number("20"),
      averageCustomerLifetime: Number("6"),
    });

    // Should calculate correctly after conversion
    expect(result.kpis.unitMargin).toBe(2);
    expect(result.kpis.monthlyRevenue).toBe(140);
    expect(result.kpis.ltv).toBe(12);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("should have consistent numbers across all recommendation sections", () => {
    // Caso específico del usuario: pérdidas de €640/mes
    const result = calculateFinancialMetrics({
      averagePrice: 7,
      costPerUnit: 5,
      fixedCosts: 500,
      customerAcquisitionCost: 9,
      monthlyNewCustomers: 20,
      averageCustomerLifetime: 6,
    });

    // Verificar cálculos base
    expect(result.kpis.monthlyProfit).toBe(-640); // -640€ pérdidas
    expect(result.kpis.breakEvenUnits).toBe(250); // 500€ fijos ÷ 2€ margen
    expect(result.kpis.ltv).toBe(12); // 2€ × 6 meses
    expect(result.kpis.cac).toBe(9);

    // Verificar clasificación de salud
    // LTV/CAC = 12/9 = 1.33, que ahora debería ser "bad" (< 2)
    expect(result.health.ltvCacHealth).toBe("bad");

    const viabilityRec = result.recommendations.find((r) => r.type === "viability");
    const nextStepsRec = result.recommendations.find((r) => r.type === "next_steps");

    // Viabilidad debe explicar que aumentar ventas empeora las pérdidas (CAC > margen)
    expect(viabilityRec?.message).toContain("Modelo inviable");
    expect(viabilityRec?.message).toContain("cada cliente genera €7 de pérdida neta");
    expect(viabilityRec?.message).toContain("AUMENTAR VENTAS EMPEORA LAS PÉRDIDAS");

    // Próximos pasos: ahora SÍ debe tener Prioridad 1 porque LTV/CAC es "bad"
    expect(nextStepsRec?.message).toContain("Prioridad 1:");
    expect(nextStepsRec?.message).toContain("Prioridad 2:");
    // Prioridad 2 ya NO debe sugerir aumentar ventas (porque CAC > margen)
    expect(nextStepsRec?.message).toContain("Para la adquisición de clientes");
    expect(nextStepsRec?.message).toContain("Cada cliente nuevo aumenta las pérdidas en €7/mes");

    // Los números deben ser consistentes
    // Break-even (250) < Pérdidas totales (320) ✓ Lógico
    // Punto de equilibrio solo cuenta costes fijos
    // Viabilidad cuenta costes fijos + CAC
  });
});

describe("Recovery Time Formatting", () => {
  it("should format recovery times naturally without unnecessary decimals", () => {
    // Test exactamente 1 mes (no decimales)
    const oneMonthCase = calculateFinancialMetrics({
      averagePrice: 100,
      costPerUnit: 50,
      fixedCosts: 1000,
      customerAcquisitionCost: 50, // CAC = 50, margin = 50, recovery = 1 mes exacto
      monthlyNewCustomers: 50,
      averageCustomerLifetime: 12,
    });

    const oneMonthRec = oneMonthCase.recommendations.find((r) => r.type === "acquisition");
    expect(oneMonthRec?.message).toContain("1 mes"); // No "1.0 meses"
    expect(oneMonthRec?.message).not.toContain("1.0");

    // Test número entero de meses
    const twoMonthCase = calculateFinancialMetrics({
      averagePrice: 100,
      costPerUnit: 50,
      fixedCosts: 1000,
      customerAcquisitionCost: 100, // CAC = 100, margin = 50, recovery = 2 meses exactos
      monthlyNewCustomers: 50,
      averageCustomerLifetime: 12,
    });

    const twoMonthRec = twoMonthCase.recommendations.find((r) => r.type === "acquisition");
    expect(twoMonthRec?.message).toContain("2 meses"); // No "2.0 meses"
    expect(twoMonthRec?.message).not.toContain("2.0");

    // Test tiempo menor a 1 mes (debería mostrar en semanas/días)
    const shortTimeCase = calculateFinancialMetrics({
      averagePrice: 100,
      costPerUnit: 50,
      fixedCosts: 1000,
      customerAcquisitionCost: 15, // CAC = 15, margin = 50, recovery = 0.3 meses
      monthlyNewCustomers: 50,
      averageCustomerLifetime: 12,
    });

    const shortTimeRec = shortTimeCase.recommendations.find((r) => r.type === "acquisition");
    // Debería mostrar en días o semanas, no en "0.3 meses"
    expect(shortTimeRec?.message).toMatch(/(días?|semanas?)/);
    expect(shortTimeRec?.message).not.toContain("0.3 meses");
  });
});

describe("CAC > unit margin detection", () => {
  it("should detect and warn when CAC > unit margin makes sales counterproductive", () => {
    // Caso del usuario: CAC (9€) > margen unitario (2€)
    const result = calculateFinancialMetrics({
      averagePrice: 7,
      costPerUnit: 5,
      fixedCosts: 500,
      customerAcquisitionCost: 9, // CAC > margen unitario
      monthlyNewCustomers: 20,
      averageCustomerLifetime: 6,
    });

    const viabilityRec = result.recommendations.find((r) => r.type === "viability");
    expect(viabilityRec).toBeDefined();
    expect(viabilityRec?.status).toBe("negative");

    // Debe explicar que cada cliente genera pérdidas netas
    expect(viabilityRec?.message).toContain("Modelo inviable");
    expect(viabilityRec?.message).toContain("cada cliente genera €7 de pérdida neta");
    expect(viabilityRec?.message).toContain("CAC €9 > margen €2");

    // Debe advertir explícitamente que aumentar ventas empeora las pérdidas
    expect(viabilityRec?.message).toContain("AUMENTAR VENTAS EMPEORA LAS PÉRDIDAS");

    // Debe sugerir reducir CAC, no aumentar ventas
    expect(viabilityRec?.message).toContain("reduce el CAC por debajo de €1");
    expect(viabilityRec?.message).not.toContain("aumentar ventas");
    expect(viabilityRec?.message).not.toContain("unidades más/mes");
  });
});
