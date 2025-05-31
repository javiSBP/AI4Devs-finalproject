import { describe, it, expect } from "vitest";
import { FINANCIAL_METRICS_HELP } from "./financial-metrics-help";

describe("Financial Metrics Help", () => {
  const requiredKeys = ["unitMargin", "monthlyProfit", "ltv", "ltvCacRatio", "breakEven"];

  it("should have all required metric keys", () => {
    requiredKeys.forEach((key) => {
      expect(FINANCIAL_METRICS_HELP).toHaveProperty(key);
    });
  });

  it("should have valid structure for all metrics", () => {
    Object.entries(FINANCIAL_METRICS_HELP).forEach(([, metric]) => {
      expect(metric).toHaveProperty("label");
      expect(metric).toHaveProperty("description");
      expect(metric).toHaveProperty("example");
      expect(metric).toHaveProperty("tips");
      expect(metric).toHaveProperty("interpretation");

      expect(typeof metric.label).toBe("string");
      expect(typeof metric.description).toBe("string");
      expect(typeof metric.example).toBe("string");
      expect(Array.isArray(metric.tips)).toBe(true);
      expect(metric.interpretation).toHaveProperty("good");
      expect(metric.interpretation).toHaveProperty("warning");
      expect(metric.interpretation).toHaveProperty("bad");
    });
  });

  it("should have meaningful content (not empty strings)", () => {
    Object.entries(FINANCIAL_METRICS_HELP).forEach(([, metric]) => {
      expect(metric.label.length).toBeGreaterThan(5);
      expect(metric.description.length).toBeGreaterThan(20);
      expect(metric.example.length).toBeGreaterThan(30);
      expect(metric.tips.length).toBeGreaterThan(0);
      expect(metric.interpretation.good.length).toBeGreaterThan(10);
      expect(metric.interpretation.warning.length).toBeGreaterThan(10);
      expect(metric.interpretation.bad.length).toBeGreaterThan(10);
    });
  });

  it("should have appropriate number of tips for each metric", () => {
    Object.entries(FINANCIAL_METRICS_HELP).forEach(([, metric]) => {
      expect(metric.tips.length).toBeGreaterThanOrEqual(3);
      expect(metric.tips.length).toBeLessThanOrEqual(6);
    });
  });

  it("should use simple language (avoid complex financial jargon)", () => {
    const complexTerms = ["liquidez", "apalancamiento", "solvencia", "EBITDA", "ROI", "ROE"];

    Object.entries(FINANCIAL_METRICS_HELP).forEach(([, metric]) => {
      complexTerms.forEach((term) => {
        expect(metric.description.toLowerCase()).not.toContain(term);
        expect(metric.example.toLowerCase()).not.toContain(term);
      });
    });
  });

  it("should include euro symbol in relevant examples", () => {
    Object.entries(FINANCIAL_METRICS_HELP).forEach(([key, metric]) => {
      if (key !== "ltvCacRatio") {
        // Ratio no tiene euros
        expect(metric.example).toContain("€");
      }
    });
  });

  it("should have consistent interpretation messaging", () => {
    Object.entries(FINANCIAL_METRICS_HELP).forEach(([, metric]) => {
      // Good interpretations should be positive
      expect(metric.interpretation.good).toMatch(
        /alto|excelente|permite|sostenible|viable|alcanzable/i
      );

      // Warning interpretations should suggest optimization
      expect(metric.interpretation.warning).toMatch(
        /optimiza|ajustada|moderado|requiere|esfuerzo|justo/i
      );

      // Bad interpretations should indicate problems
      expect(metric.interpretation.bad).toMatch(
        /insuficiente|pérdidas|negativo|alto|muy|revisa|urgente|bajo|mejora|rentable/i
      );
    });
  });
});
