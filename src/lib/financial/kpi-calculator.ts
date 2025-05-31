/**
 * KPI Financial Calculator for LeanSim
 * Implements comprehensive financial metrics calculation with user-friendly recommendations
 */

export interface FinancialInputs {
  averagePrice: number;
  costPerUnit: number;
  fixedCosts: number;
  customerAcquisitionCost: number;
  monthlyNewCustomers: number;
  averageCustomerLifetime: number;
}

export interface KPIResults {
  unitMargin: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  ltv: number;
  cac: number;
  cacLtvRatio: number;
  breakEvenUnits: number;
  breakEvenMonths: number;
}

export interface HealthClassification {
  profitabilityHealth: "good" | "medium" | "bad";
  ltvCacHealth: "good" | "medium" | "bad";
  overallHealth: "good" | "medium" | "bad";
}

export interface Recommendation {
  type: "viability" | "acquisition" | "optimization" | "next_steps";
  title: string;
  message: string;
  status: "positive" | "warning" | "negative" | "neutral";
}

export interface CalculationResult {
  kpis: KPIResults;
  health: HealthClassification;
  recommendations: Recommendation[];
  calculatedAt: Date;
  calculationVersion: string;
}

/**
 * Calculates financial KPIs based on inputs
 */
export function calculateKPIs(inputs: FinancialInputs): KPIResults {
  const {
    averagePrice,
    costPerUnit,
    fixedCosts,
    customerAcquisitionCost,
    monthlyNewCustomers,
    averageCustomerLifetime,
  } = inputs;

  // Core calculations
  const unitMargin = averagePrice - costPerUnit;
  const monthlyRevenue = averagePrice * monthlyNewCustomers;
  const monthlyVariableCosts = costPerUnit * monthlyNewCustomers;
  const monthlyCACCosts = customerAcquisitionCost * monthlyNewCustomers;
  const monthlyProfit = monthlyRevenue - monthlyVariableCosts - fixedCosts - monthlyCACCosts;

  // LTV calculation
  const ltv = unitMargin * averageCustomerLifetime;

  // CAC/LTV ratio
  const cacLtvRatio = ltv > 0 ? customerAcquisitionCost / ltv : Infinity;

  // Break-even calculations
  const breakEvenUnits = unitMargin > 0 ? fixedCosts / unitMargin : Infinity;
  const breakEvenMonths = monthlyNewCustomers > 0 ? breakEvenUnits / monthlyNewCustomers : Infinity;

  return {
    unitMargin,
    monthlyRevenue,
    monthlyProfit,
    ltv,
    cac: customerAcquisitionCost,
    cacLtvRatio,
    breakEvenUnits: Number.isFinite(breakEvenUnits) ? breakEvenUnits : 0,
    breakEvenMonths: Number.isFinite(breakEvenMonths) ? breakEvenMonths : 0,
  };
}

/**
 * Classifies health indicators based on KPI results
 */
export function classifyHealth(kpis: KPIResults): HealthClassification {
  // Profitability health
  let profitabilityHealth: "good" | "medium" | "bad";
  if (kpis.monthlyProfit > 0 && kpis.unitMargin > 0) {
    profitabilityHealth = "good";
  } else if (kpis.unitMargin > 0) {
    profitabilityHealth = "medium";
  } else {
    profitabilityHealth = "bad";
  }

  // LTV/CAC health
  let ltvCacHealth: "good" | "medium" | "bad";
  if (kpis.cacLtvRatio < 0.33) {
    ltvCacHealth = "good";
  } else if (kpis.cacLtvRatio < 1) {
    ltvCacHealth = "medium";
  } else {
    ltvCacHealth = "bad";
  }

  // Overall health (most restrictive)
  let overallHealth: "good" | "medium" | "bad";
  if (profitabilityHealth === "good" && ltvCacHealth === "good") {
    overallHealth = "good";
  } else if (profitabilityHealth === "bad" || ltvCacHealth === "bad") {
    overallHealth = "bad";
  } else {
    overallHealth = "medium";
  }

  return {
    profitabilityHealth,
    ltvCacHealth,
    overallHealth,
  };
}

/**
 * Generates user-friendly recommendations based on KPIs and health indicators
 */
export function generateRecommendations(
  kpis: KPIResults,
  health: HealthClassification
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Viabilidad económica
  if (health.profitabilityHealth === "good") {
    recommendations.push({
      type: "viability",
      title: "Viabilidad económica",
      message:
        "Tu modelo muestra un <strong>beneficio mensual positivo</strong>. Esto indica que tu negocio puede ser viable si se cumplen las previsiones de ventas e ingresos.",
      status: "positive",
    });
  } else if (health.profitabilityHealth === "medium") {
    recommendations.push({
      type: "viability",
      title: "Viabilidad económica",
      message:
        "Tu modelo tiene margen unitario positivo pero <strong>pérdidas mensuales</strong>. Considera aumentar las ventas o reducir costes fijos para alcanzar la rentabilidad.",
      status: "warning",
    });
  } else {
    recommendations.push({
      type: "viability",
      title: "Viabilidad económica",
      message:
        "Tu modelo muestra <strong>pérdidas mensuales</strong>. Considera revisar tus precios, costes variables o estructura de costes fijos para mejorar la rentabilidad.",
      status: "negative",
    });
  }

  // Eficiencia de adquisición de clientes
  if (health.ltvCacHealth === "good") {
    recommendations.push({
      type: "acquisition",
      title: "Eficiencia de adquisición de clientes",
      message:
        "Tu ratio LTV/CAC es <strong>excelente</strong> (mayor a 3), lo que indica que tu estrategia de adquisición de clientes es muy eficiente.",
      status: "positive",
    });
  } else if (health.ltvCacHealth === "medium") {
    recommendations.push({
      type: "acquisition",
      title: "Eficiencia de adquisición de clientes",
      message:
        "Tu ratio LTV/CAC es <strong>aceptable</strong> pero podría mejorar. Intenta reducir tus costes de adquisición o aumentar el valor del cliente (LTV).",
      status: "warning",
    });
  } else {
    recommendations.push({
      type: "acquisition",
      title: "Eficiencia de adquisición de clientes",
      message:
        "Tu ratio LTV/CAC es <strong>preocupante</strong> (menor que 1). Cuesta más adquirir un cliente que lo que te generará en ingresos. Revisa urgentemente tu estrategia de marketing y adquisición.",
      status: "negative",
    });
  }

  // Optimización adicional
  if (health.overallHealth === "good") {
    recommendations.push({
      type: "optimization",
      title: "Optimización del modelo",
      message:
        "¡Excelente! Tu modelo financiero muestra <strong>buena salud</strong>. Para seguir mejorando, considera optimizar procesos, reducir costes operativos o explorar nuevas oportunidades de crecimiento.",
      status: "positive",
    });
  } else if (Number.isFinite(kpis.breakEvenMonths) && kpis.breakEvenMonths > 24) {
    recommendations.push({
      type: "optimization",
      title: "Punto de equilibrio",
      message: `Tu punto de equilibrio está <strong>muy lejos</strong> (${Math.ceil(kpis.breakEvenMonths)} meses). Considera estrategias para acelerar las ventas o reducir la estructura de costes.`,
      status: "warning",
    });
  }

  // Próximos pasos
  recommendations.push({
    type: "next_steps",
    title: "Próximos pasos",
    message:
      "Para continuar validando tu modelo de negocio, considera: <strong>validar tus estimaciones</strong> con experimentos reales, <strong>confirmar costes</strong> con proveedores, buscar formas de <strong>aumentar el ciclo de vida del cliente</strong>, y explorar opciones para <strong>reducir costes de adquisición</strong>.",
    status: "neutral",
  });

  return recommendations;
}

/**
 * Main calculation function that orchestrates all calculations
 */
export function calculateFinancialMetrics(inputs: FinancialInputs): CalculationResult {
  // Calculate KPIs
  const kpis = calculateKPIs(inputs);

  // Classify health
  const health = classifyHealth(kpis);

  // Generate recommendations
  const recommendations = generateRecommendations(kpis, health);

  return {
    kpis,
    health,
    recommendations,
    calculatedAt: new Date(),
    calculationVersion: "1.0",
  };
}
