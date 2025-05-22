/**
 * Financial calculator utility for LeanSim
 * Provides basic financial calculations for business simulations
 */

export interface FinancialParams {
  initialInvestment: number;
  monthlyExpenses: number;
  avgMonthlyRevenue: number;
  growthRateMonthly: number;
  timeframeMonths: number;
}

export interface FinancialResults {
  monthlyData: MonthlyData[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    roi: number;
    breakEvenMonth: number | null;
  };
}

export interface MonthlyData {
  month: number;
  revenue: number;
  expenses: number;
  cashflow: number;
  cumulativeCashflow: number;
}

/**
 * Calculates financial projections based on input parameters
 */
export function calculateFinancials(params: FinancialParams): FinancialResults {
  const {
    initialInvestment,
    monthlyExpenses,
    avgMonthlyRevenue,
    growthRateMonthly,
    timeframeMonths,
  } = params;

  const monthlyData: MonthlyData[] = [];
  let totalRevenue = 0;
  let totalExpenses = initialInvestment;
  let breakEvenMonth: number | null = null;

  let currentRevenue = avgMonthlyRevenue;
  let cumulativeCashflow = -initialInvestment;

  for (let month = 1; month <= timeframeMonths; month++) {
    // Calculate revenue with growth rate
    if (month > 1) {
      currentRevenue = currentRevenue * (1 + growthRateMonthly);
    }

    const revenue = currentRevenue;
    const expenses = monthlyExpenses;
    const cashflow = revenue - expenses;
    cumulativeCashflow += cashflow;

    // Check if this is the break-even month (first month with positive cumulative cashflow)
    if (breakEvenMonth === null && cumulativeCashflow >= 0) {
      breakEvenMonth = month;
    }

    monthlyData.push({
      month,
      revenue,
      expenses,
      cashflow,
      cumulativeCashflow,
    });

    totalRevenue += revenue;
    totalExpenses += expenses;
  }

  const profit = totalRevenue - totalExpenses;
  const roi = initialInvestment > 0 ? profit / initialInvestment : 0;

  return {
    monthlyData,
    summary: {
      totalRevenue,
      totalExpenses,
      profit,
      roi,
      breakEvenMonth,
    },
  };
}
