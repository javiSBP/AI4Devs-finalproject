import { describe, it, expect } from "vitest";
import { calculateFinancials, FinancialParams } from "./calculator";

describe("Financial Calculator", () => {
  it("calculates financials with no growth rate", () => {
    const params: FinancialParams = {
      initialInvestment: 10000,
      monthlyExpenses: 1000,
      avgMonthlyRevenue: 2000,
      growthRateMonthly: 0,
      timeframeMonths: 12,
    };

    const results = calculateFinancials(params);

    expect(results.monthlyData.length).toBe(12);
    expect(results.summary.totalRevenue).toBe(24000);
    expect(results.summary.totalExpenses).toBe(22000); // 10000 + (12 * 1000)
    expect(results.summary.profit).toBe(2000);
    expect(results.summary.roi).toBe(0.2); // 2000 / 10000
    expect(results.summary.breakEvenMonth).toBe(10); // Break even in month 10
  });

  it("calculates financials with growth rate", () => {
    const params: FinancialParams = {
      initialInvestment: 10000,
      monthlyExpenses: 1000,
      avgMonthlyRevenue: 2000,
      growthRateMonthly: 0.1, // 10% monthly growth
      timeframeMonths: 12,
    };

    const results = calculateFinancials(params);

    expect(results.monthlyData.length).toBe(12);
    expect(results.summary.totalRevenue).toBeGreaterThan(24000); // Should be higher due to growth
    expect(results.summary.totalExpenses).toBe(22000); // 10000 + (12 * 1000)
    expect(results.summary.profit).toBeGreaterThan(2000);
    expect(results.summary.roi).toBeGreaterThan(0.2);
    expect(results.summary.breakEvenMonth).toBeLessThan(10); // Should break even faster
  });

  it("handles case with no break-even point", () => {
    const params: FinancialParams = {
      initialInvestment: 10000,
      monthlyExpenses: 2000,
      avgMonthlyRevenue: 1000, // Revenue less than expenses
      growthRateMonthly: 0,
      timeframeMonths: 12,
    };

    const results = calculateFinancials(params);

    expect(results.summary.breakEvenMonth).toBeNull(); // Never breaks even
    expect(results.summary.profit).toBeLessThan(0); // Should be negative profit
  });
});
