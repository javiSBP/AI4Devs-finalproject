/**
 * KPI Financial Calculator for LeanSim
 * Implements comprehensive financial metrics calculation with user-friendly recommendations
 */

/**
 * Formats currency values in correct Spanish format (value + €)
 */
function formatEuro(value: number): string {
  // Formatear el número sin el símbolo de moneda
  const formattedNumber = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  // Añadir el símbolo € después del número, como es correcto en español
  const result = `${formattedNumber}€`;

  // Manejar números negativos
  return value < 0 ? `-${result}` : result;
}

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
 * Formats recovery time in a user-friendly way
 */
function formatRecoveryTime(months: number): string {
  if (months === Infinity || months <= 0) {
    return "∞";
  }

  // If exactly 1 month, don't show decimal
  if (months === 1) {
    return "1 mes";
  }

  // If it's a whole number of months, don't show decimals
  if (Math.abs(months - Math.round(months)) < 0.01) {
    return `${Math.round(months)} meses`;
  }

  // If less than 1 month, convert to days for better UX
  if (months < 1) {
    const days = Math.round(months * 30); // Approximate days per month

    if (days <= 7) {
      return days === 1 ? "1 día" : `${days} días`;
    } else if (days <= 14) {
      const weeks = Math.round(days / 7);
      return weeks === 1 ? "1 semana" : `${weeks} semanas`;
    } else {
      // For 15-29 days, show in weeks rounded
      const weeks = Math.round(days / 7);
      return weeks === 1 ? "1 semana" : `${weeks} semanas`;
    }
  }

  // For other cases (> 1 month), show one decimal place only if needed
  if (Math.abs(months - Math.round(months)) < 0.1) {
    return `${Math.round(months)} meses`;
  }
  return `${months.toFixed(1)} meses`;
}

/**
 * Calculates financial KPIs based on inputs
 */
export function calculateKPIs(inputs: FinancialInputs): KPIResults {
  // Validate and ensure all inputs are numbers
  const safeNumber = (value: number): number => {
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : 0;
  };

  const {
    averagePrice = 0,
    costPerUnit = 0,
    fixedCosts = 0,
    customerAcquisitionCost = 0,
    monthlyNewCustomers = 0,
    averageCustomerLifetime = 0,
  } = {
    averagePrice: safeNumber(inputs.averagePrice),
    costPerUnit: safeNumber(inputs.costPerUnit),
    fixedCosts: safeNumber(inputs.fixedCosts),
    customerAcquisitionCost: safeNumber(inputs.customerAcquisitionCost),
    monthlyNewCustomers: safeNumber(inputs.monthlyNewCustomers),
    averageCustomerLifetime: safeNumber(inputs.averageCustomerLifetime),
  };

  // Core calculations
  const unitMargin = averagePrice - costPerUnit;
  const monthlyRevenue = averagePrice * monthlyNewCustomers;
  const monthlyVariableCosts = costPerUnit * monthlyNewCustomers;
  const monthlyCACCosts = customerAcquisitionCost * monthlyNewCustomers;
  const monthlyProfit = monthlyRevenue - monthlyVariableCosts - fixedCosts - monthlyCACCosts;

  // LTV calculation
  const ltv = unitMargin * averageCustomerLifetime;

  // CAC/LTV ratio - Manejo especial de casos edge
  let cacLtvRatio: number;
  if (customerAcquisitionCost === 0) {
    cacLtvRatio = 0; // CAC gratuito = ratio perfecto
  } else if (ltv <= 0) {
    cacLtvRatio = Infinity; // LTV negativo/cero = insostenible
  } else {
    cacLtvRatio = customerAcquisitionCost / ltv;
  }

  // Break-even calculations - Manejo especial de casos edge
  let breakEvenUnits: number;
  let breakEvenMonths: number;

  if (fixedCosts === 0) {
    breakEvenUnits = 0; // Sin costes fijos = ya en equilibrio
    breakEvenMonths = 0;
  } else if (unitMargin === 0) {
    // Margen exactamente 0 = equilibrio por unidad, no cubres costes fijos pero tampoco pierdes por venta
    breakEvenUnits = 0;
    breakEvenMonths = 0;
  } else if (unitMargin < 0) {
    breakEvenUnits = Infinity; // Margen negativo = imposible equilibrio
    breakEvenMonths = Infinity;
  } else {
    breakEvenUnits = fixedCosts / unitMargin;
    breakEvenMonths = monthlyNewCustomers > 0 ? breakEvenUnits / monthlyNewCustomers : Infinity;
  }

  return {
    unitMargin,
    monthlyRevenue,
    monthlyProfit,
    ltv,
    cac: customerAcquisitionCost,
    cacLtvRatio,
    breakEvenUnits: Number.isFinite(breakEvenUnits) ? breakEvenUnits : Infinity,
    breakEvenMonths: Number.isFinite(breakEvenMonths) ? breakEvenMonths : Infinity,
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
    // Para pérdidas mensuales con margen positivo, evaluar magnitud relativa
    const lossThreshold = Math.min(kpis.monthlyRevenue * 0.1, 500); // 10% de ingresos o 500€, lo que sea menor
    if (Math.abs(kpis.monthlyProfit) <= lossThreshold) {
      profitabilityHealth = "medium"; // Pérdidas pequeñas
    } else {
      profitabilityHealth = "bad"; // Pérdidas significativas
    }
  } else {
    // Margen negativo siempre es malo
    profitabilityHealth = "bad";
  }

  // LTV/CAC health - Manejar casos especiales
  let ltvCacHealth: "good" | "medium" | "bad";

  if (kpis.cac === 0) {
    // CAC gratuito es siempre excelente (adquisición orgánica)
    ltvCacHealth = "good";
  } else if (kpis.cacLtvRatio === Infinity || kpis.ltv <= 0) {
    // LTV negativo o cero = insostenible
    ltvCacHealth = "bad";
  } else {
    // Convertir CAC/LTV a LTV/CAC para evaluación normal
    const ltvCacRatio = 1 / kpis.cacLtvRatio;

    if (ltvCacRatio >= 3) {
      ltvCacHealth = "good"; // LTV/CAC >= 3 es excelente
    } else if (ltvCacRatio >= 2) {
      ltvCacHealth = "medium"; // LTV/CAC >= 2 es aceptable
    } else {
      ltvCacHealth = "bad"; // LTV/CAC < 2 es malo
    }
  }

  // Overall health (most restrictive)
  let overallHealth: "good" | "medium" | "bad";

  // Caso especial: si CAC > LTV, el negocio es inviable independientemente de otros factores
  if (kpis.cac > kpis.ltv && kpis.ltv > 0) {
    overallHealth = "bad";
  } else if (profitabilityHealth === "good" && ltvCacHealth === "good") {
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
  health: HealthClassification,
  inputs: FinancialInputs
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Validate and ensure all inputs are numbers
  const safeInputs = {
    averagePrice: Number(inputs.averagePrice) || 0,
    costPerUnit: Number(inputs.costPerUnit) || 0,
    fixedCosts: Number(inputs.fixedCosts) || 0,
    customerAcquisitionCost: Number(inputs.customerAcquisitionCost) || 0,
    monthlyNewCustomers: Number(inputs.monthlyNewCustomers) || 0,
    averageCustomerLifetime: Number(inputs.averageCustomerLifetime) || 0,
  };

  // Validate and ensure all KPIs are numbers
  const safeKpis = {
    unitMargin: Number(kpis.unitMargin) || 0,
    monthlyRevenue: Number(kpis.monthlyRevenue) || 0,
    monthlyProfit: Number(kpis.monthlyProfit) || 0,
    ltv: Number(kpis.ltv) || 0,
    cac: Number(kpis.cac) || 0,
    cacLtvRatio: Number(kpis.cacLtvRatio) || 0,
    breakEvenUnits: Number(kpis.breakEvenUnits) || 0,
    breakEvenMonths: Number(kpis.breakEvenMonths) || 0,
  };

  // Viabilidad económica - con datos específicos
  if (health.profitabilityHealth === "good") {
    const profitMargin = ((safeKpis.monthlyProfit / safeKpis.monthlyRevenue) * 100).toFixed(1);
    recommendations.push({
      type: "viability",
      title: "Viabilidad económica",
      message: `Tu modelo genera un <strong>beneficio del ${profitMargin}%</strong> sobre ventas (${formatEuro(safeKpis.monthlyProfit)} de ${formatEuro(safeKpis.monthlyRevenue)} mensuales). Esto indica viabilidad si mantienes las previsiones de ventas.`,
      status: "positive",
    });
  } else if (health.profitabilityHealth === "medium") {
    const lossAmount = Math.abs(safeKpis.monthlyProfit);
    // CORRECCIÓN: Cada cliente nuevo aporta (margen unitario - CAC) al resultado neto
    const netContributionPerCustomer = safeKpis.unitMargin - safeKpis.cac;

    // VALIDACIÓN: Solo calcular si la contribución neta es positiva
    if (netContributionPerCustomer > 0) {
      const additionalSalesNeeded = Math.ceil(lossAmount / netContributionPerCustomer);
      recommendations.push({
        type: "viability",
        title: "Viabilidad económica",
        message: `Tienes margen unitario positivo (${formatEuro(safeKpis.unitMargin)}) pero <strong>pérdidas de ${formatEuro(lossAmount)}/mes</strong>. Necesitas <strong>${additionalSalesNeeded} ventas más al mes</strong> para ser rentable.`,
        status: "warning",
      });
    } else {
      // Caso especial: CAC >= margen unitario en categoría "medium"
      const maxViableCAC = Math.floor(safeKpis.unitMargin * 0.9);
      recommendations.push({
        type: "viability",
        title: "Viabilidad económica",
        message: `Tienes margen unitario positivo (${formatEuro(safeKpis.unitMargin)}) pero <strong>CAC demasiado alto (${formatEuro(safeKpis.cac)})</strong>. Cada cliente nuevo genera pérdidas. Reduce el CAC por debajo de ${formatEuro(maxViableCAC)} antes de aumentar ventas.`,
        status: "warning",
      });
    }
  } else {
    const lossAmount = Math.abs(safeKpis.monthlyProfit);

    // CASO ESPECIAL: Si CAC > margen unitario, aumentar ventas empeora las pérdidas
    if (safeKpis.cac > safeKpis.unitMargin) {
      const lossPerCustomer = safeKpis.cac - safeKpis.unitMargin;
      const maxViableCAC = Math.floor(safeKpis.unitMargin * 0.8);

      recommendations.push({
        type: "viability",
        title: "Viabilidad económica",
        message: `<strong>Modelo inviable:</strong> cada cliente genera ${formatEuro(lossPerCustomer)} de pérdida neta (CAC ${formatEuro(safeKpis.cac)} > margen ${formatEuro(safeKpis.unitMargin)}). <strong>AUMENTAR VENTAS EMPEORA LAS PÉRDIDAS</strong>. Urgente: reduce el CAC por debajo de ${formatEuro(maxViableCAC)} antes de adquirir más clientes.`,
        status: "negative",
      });
    } else {
      // Caso normal: margen positivo pero pérdidas por costes fijos o volumen insuficiente
      // CORRECCIÓN: Cada cliente nuevo aporta (margen unitario - CAC) al resultado neto
      const netContributionPerCustomer = safeKpis.unitMargin - safeKpis.cac;

      // VALIDACIÓN: Solo calcular si la contribución neta es positiva
      if (netContributionPerCustomer > 0) {
        const additionalSalesNeeded = Math.ceil(lossAmount / netContributionPerCustomer);
        const currentSalesGrowth =
          safeInputs.monthlyNewCustomers > 0
            ? ((additionalSalesNeeded / safeInputs.monthlyNewCustomers) * 100).toFixed(0)
            : "∞";

        if (safeInputs.fixedCosts > 0) {
          if (lossAmount <= safeInputs.fixedCosts) {
            // Reducción posible de costes fijos
            const costReductionPercentage = ((lossAmount / safeInputs.fixedCosts) * 100).toFixed(0);
            const newFixedCosts = safeInputs.fixedCosts - lossAmount;
            recommendations.push({
              type: "viability",
              title: "Viabilidad económica",
              message: `Pérdidas importantes de <strong>${formatEuro(lossAmount)}/mes</strong>. Para ser viable necesitas: <strong>reducir costes fijos un ${costReductionPercentage}%</strong> (de ${formatEuro(safeInputs.fixedCosts)} a ${formatEuro(newFixedCosts)}) o <strong>aumentar ventas un ${currentSalesGrowth}%</strong> (${additionalSalesNeeded} unidades más/mes).`,
              status: "negative",
            });
          } else {
            // Reducción imposible - necesitas eliminar TODOS los costes fijos y aún más
            const remainingLoss = lossAmount - safeInputs.fixedCosts;
            recommendations.push({
              type: "viability",
              title: "Viabilidad económica",
              message: `Pérdidas críticas de <strong>${formatEuro(lossAmount)}/mes</strong>. Incluso <strong>eliminando TODOS los costes fijos</strong> (${formatEuro(safeInputs.fixedCosts)}) aún tendrías ${formatEuro(remainingLoss)}/mes de pérdidas. Necesitas <strong>aumentar ventas ${additionalSalesNeeded} unidades más/mes</strong> (${currentSalesGrowth}% de crecimiento).`,
              status: "negative",
            });
          }
        } else {
          recommendations.push({
            type: "viability",
            title: "Viabilidad económica",
            message: `Pérdidas de <strong>${formatEuro(lossAmount)}/mes</strong> sin costes fijos. El problema está en los costes variables o CAC. Necesitas <strong>${additionalSalesNeeded} ventas más/mes</strong> (crecimiento del ${currentSalesGrowth}%) para compensar con mayor volumen.`,
            status: "negative",
          });
        }
      } else {
        // Caso especial: CAC >= margen unitario, pero no debe llegar aquí debido a la validación anterior
        // Pero por si acaso, manejo este edge case
        const maxViableCAC = Math.floor(safeKpis.unitMargin * 0.9);
        recommendations.push({
          type: "viability",
          title: "Viabilidad económica",
          message: `<strong>Error en clasificación:</strong> CAC (${formatEuro(safeKpis.cac)}) ≥ margen unitario (${formatEuro(safeKpis.unitMargin)}). Cada cliente genera pérdidas. Reduce el CAC por debajo de ${formatEuro(maxViableCAC)}.`,
          status: "negative",
        });
      }
    }
  }

  // Eficiencia de adquisición de clientes - con datos específicos
  const formatLtvCacRatio = (ltv: number, cac: number): string => {
    if (cac === 0) return "∞";
    if (ltv <= 0) return "0";
    const ratio = ltv / cac;
    // Para ratios, mostrar como entero si es >= 1, sino con 1 decimal
    return ratio >= 1 ? Math.round(ratio).toString() : ratio.toFixed(1);
  };

  const actualLtvCacRatio = formatLtvCacRatio(safeKpis.ltv, safeKpis.cac);

  if (health.ltvCacHealth === "good") {
    if (safeKpis.cac === 0) {
      recommendations.push({
        type: "acquisition",
        title: "Eficiencia de adquisición de clientes",
        message: `<strong>Ratio perfecto (CAC gratuito)</strong>. Adquisición de clientes totalmente gratuita (marketing orgánico, referencias, etc.). No hay coste de adquisición. Puedes acelerar el crecimiento maximizando estos canales.`,
        status: "positive",
      });
    } else {
      const monthsToRecoverRaw =
        safeKpis.unitMargin > 0 ? safeKpis.cac / safeKpis.unitMargin : Infinity;
      const monthsToRecover = formatRecoveryTime(monthsToRecoverRaw);
      recommendations.push({
        type: "acquisition",
        title: "Eficiencia de adquisición de clientes",
        message: `Ratio excelente de <strong>${actualLtvCacRatio}:1</strong>. Recuperas los ${formatEuro(safeKpis.cac)} de CAC en solo ${monthsToRecover}. Puedes invertir más en marketing para acelerar el crecimiento.`,
        status: "positive",
      });
    }
  } else if (health.ltvCacHealth === "medium") {
    const improvementNeeded = Math.ceil(safeKpis.cac * 3 - safeKpis.ltv);
    recommendations.push({
      type: "acquisition",
      title: "Eficiencia de adquisición de clientes",
      message: `Ratio de <strong>${actualLtvCacRatio}:1</strong> es aceptable pero mejorable. Para llegar al ideal (3:1) necesitas aumentar el LTV en ${formatEuro(improvementNeeded)} o reducir el CAC a ${formatEuro(Math.ceil(safeKpis.ltv / 3))}.`,
      status: "warning",
    });
  } else {
    if (safeKpis.cac > safeKpis.ltv) {
      const lossPerCustomer = safeKpis.cac - safeKpis.ltv;
      const maxViableCAC = Math.floor(safeKpis.ltv * 0.8);
      recommendations.push({
        type: "acquisition",
        title: "Eficiencia de adquisición de clientes",
        message: `<strong>Ratio crítico (${actualLtvCacRatio}:1)</strong>. Pierdes ${formatEuro(lossPerCustomer)} por cliente adquirido. URGENTE: reduce el CAC a máximo ${formatEuro(maxViableCAC)} o para temporalmente la adquisición hasta optimizar el modelo.`,
        status: "negative",
      });
    } else {
      recommendations.push({
        type: "acquisition",
        title: "Eficiencia de adquisición de clientes",
        message: `Ratio insuficiente (${actualLtvCacRatio}:1). La adquisición apenas es rentable. Reduce el CAC por debajo de ${formatEuro(Math.ceil(safeKpis.ltv / 2))} o aumenta el LTV mejorando retención.`,
        status: "negative",
      });
    }
  }

  // Optimización específica del modelo
  if (health.overallHealth === "good") {
    const reinvestmentCapacity = safeKpis.monthlyProfit * 0.7; // 70% del beneficio
    const potentialNewCustomers = Math.floor(reinvestmentCapacity / safeKpis.cac);
    recommendations.push({
      type: "optimization",
      title: "Optimización del modelo",
      message: `Negocio saludable. Puedes reinvertir ${formatEuro(reinvestmentCapacity)}/mes (70% del beneficio) para adquirir ${potentialNewCustomers} clientes adicionales mensuales y acelerar el crecimiento.`,
      status: "positive",
    });
  } else if (Number.isFinite(safeKpis.breakEvenMonths) && safeKpis.breakEvenMonths > 0) {
    // Umbral dinámico: si tardas más de 2 años O más del doble de tu ciclo de vida de cliente
    const dynamicThreshold = Math.max(24, safeInputs.averageCustomerLifetime * 2);
    if (safeKpis.breakEvenMonths > dynamicThreshold) {
      const monthlyGap = safeKpis.breakEvenUnits - safeInputs.monthlyNewCustomers;
      const requiredGrowth = ((monthlyGap / safeInputs.monthlyNewCustomers) * 100).toFixed(0);
      recommendations.push({
        type: "optimization",
        title: "Aceleración del punto de equilibrio",
        message: `Break-even en ${Math.ceil(safeKpis.breakEvenMonths)} meses es demasiado lejano. Necesitas aumentar ventas en ${requiredGrowth}% (${Math.ceil(monthlyGap)} unidades más/mes) o reducir costes fijos en ${formatEuro(Math.ceil(safeInputs.fixedCosts * 0.3))}.`,
        status: "warning",
      });
    }
  }

  // Próximos pasos específicos basados en el estado actual
  const nextStepsMessage = [];

  if (health.ltvCacHealth === "bad") {
    if (safeKpis.ltv <= 0) {
      // Caso especial: LTV negativo o cero - el problema es más fundamental
      if (safeKpis.unitMargin <= 0) {
        nextStepsMessage.push(
          `<strong>Prioridad 1:</strong> Modelo insostenible. Margen unitario negativo (${formatEuro(safeKpis.unitMargin)}). Aumenta precio por encima de ${formatEuro(safeInputs.costPerUnit)} o reduce costes variables`
        );
      } else {
        nextStepsMessage.push(
          `<strong>Prioridad 1:</strong> Aumenta la retención de clientes por encima de ${Math.ceil(safeKpis.cac / safeKpis.unitMargin)} meses para hacer el LTV positivo`
        );
      }
    } else if (safeKpis.cac > safeKpis.ltv) {
      // Calculamos un CAC objetivo válido (máximo 80% del LTV, pero nunca negativo)
      const targetCAC = Math.max(1, Math.floor(safeKpis.ltv * 0.8));
      nextStepsMessage.push(
        `<strong>Prioridad 1:</strong> Reduce CAC de ${formatEuro(safeKpis.cac)} a máximo ${formatEuro(targetCAC)} mediante marketing orgánico o mejores conversiones`
      );
    } else if (safeKpis.cac > safeKpis.unitMargin) {
      // CASO ESPECIAL: CAC > margen unitario - cada cliente genera pérdidas netas
      const maxViableCAC = Math.max(1, Math.floor(safeKpis.unitMargin * 0.9));
      nextStepsMessage.push(
        `<strong>Prioridad 1:</strong> Reduce CAC de ${formatEuro(safeKpis.cac)} a máximo ${formatEuro(maxViableCAC)} para que cada cliente sea rentable (CAC debe ser < margen ${formatEuro(safeKpis.unitMargin)})`
      );
    } else {
      // Para ratio 3:1, pero nunca negativo
      const targetCAC = Math.max(1, Math.floor(safeKpis.ltv / 3));
      nextStepsMessage.push(
        `<strong>Prioridad 1:</strong> Reduce CAC de ${formatEuro(safeKpis.cac)} a máximo ${formatEuro(targetCAC)} para lograr ratio LTV/CAC saludable (3:1)`
      );
    }
  }

  if (safeKpis.monthlyProfit < 0) {
    // IMPORTANTE: Solo sugerir aumentar ventas si CAC <= margen unitario
    // Si CAC > margen, cada venta adicional empeora las pérdidas
    if (safeKpis.cac <= safeKpis.unitMargin) {
      // CORRECCIÓN: Cada cliente nuevo aporta (margen unitario - CAC) al resultado neto
      const netContributionPerCustomer = safeKpis.unitMargin - safeKpis.cac;

      // VALIDACIÓN: Solo calcular si la contribución neta es positiva
      if (netContributionPerCustomer > 0) {
        const breakEvenSales = Math.ceil(
          Math.abs(safeKpis.monthlyProfit) / netContributionPerCustomer
        );
        nextStepsMessage.push(
          `<strong>Prioridad 2:</strong> Alcanza ${breakEvenSales} ventas adicionales/mes para ser rentable`
        );
      } else {
        // Caso especial: CAC = margen unitario (contribución neta = 0)
        nextStepsMessage.push(
          `<strong>Prioridad 2:</strong> CAC igual al margen unitario. Reduce el CAC por debajo de ${formatEuro(Math.floor(safeKpis.unitMargin * 0.9))} para que las ventas sean rentables`
        );
      }
    } else {
      // Caso especial: CAC > margen unitario - NO sugerir más ventas
      nextStepsMessage.push(
        `<strong>Prioridad 2:</strong> Para la adquisición de clientes hasta reducir el CAC. Cada cliente nuevo aumenta las pérdidas en ${formatEuro(safeKpis.cac - safeKpis.unitMargin)}/mes`
      );
    }
  }

  if (safeInputs.averageCustomerLifetime < 12) {
    const targetLifetime = Math.ceil(safeInputs.averageCustomerLifetime * 1.5);
    const ltvIncrease = safeKpis.unitMargin * (targetLifetime - safeInputs.averageCustomerLifetime);
    nextStepsMessage.push(
      `<strong>Mejora retención:</strong> Aumentar duración del cliente de ${safeInputs.averageCustomerLifetime} a ${targetLifetime} meses sumaría ${formatEuro(ltvIncrease)} al LTV`
    );
  }

  if (nextStepsMessage.length > 0) {
    recommendations.push({
      type: "next_steps",
      title: "Próximos pasos prioritarios",
      message: nextStepsMessage.join("<br><br>"),
      status: "neutral",
    });
  }

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
  const recommendations = generateRecommendations(kpis, health, inputs);

  return {
    kpis,
    health,
    recommendations,
    calculatedAt: new Date(),
    calculationVersion: "1.0",
  };
}
