"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import EnhancedInfoTooltip from "@/components/ui/enhanced-info-tooltip";
import LeanCanvasVisual from "./LeanCanvasVisual";
import { LeanCanvasData } from "@/types/lean-canvas";
import { CalculationResult, FinancialInputs, KPIResults } from "@/lib/financial/kpi-calculator";
import { FINANCIAL_METRICS_HELP } from "@/lib/content/financial-metrics-help";
import {
  LTVCACDonut,
  BreakEvenProgress,
  TrendIndicator,
  MetricIcons,
} from "./MetricVisualizations";

interface ResultsDisplayProps {
  calculationResult: CalculationResult;
  leanCanvasData: LeanCanvasData;
  financialInputs: FinancialInputs;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDecimal = (value: number) => {
  return value.toFixed(2);
};

// Helper function to get status color based on health classification
const getHealthStatus = (
  health: "good" | "medium" | "bad"
): "positive" | "warning" | "negative" => {
  switch (health) {
    case "good":
      return "positive";
    case "medium":
      return "warning";
    case "bad":
      return "negative";
  }
};

// Helper function to evaluate unit margin health independently
const getUnitMarginStatus = (
  unitMargin: number,
  averagePrice: number
): "positive" | "warning" | "negative" => {
  const marginPercentage = (unitMargin / averagePrice) * 100;

  if (unitMargin <= 0) {
    return "negative"; // Margen negativo siempre es malo
  } else if (marginPercentage >= 50) {
    return "positive"; // Margen >= 50% es excelente
  } else if (marginPercentage >= 20) {
    return "positive"; // Margen >= 20% es bueno
  } else if (marginPercentage >= 10) {
    return "warning"; // Margen 10-20% es aceptable pero mejorable
  } else {
    return "negative"; // Margen < 10% es insuficiente
  }
};

// Helper function to get recommendation status colors and styling
const getRecommendationStyling = (status: "positive" | "warning" | "negative" | "neutral") => {
  switch (status) {
    case "positive":
      return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900";
    case "warning":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900";
    case "negative":
      return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900";
    case "neutral":
      return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900";
  }
};

// Helper function to get dynamic interpretations for each metric
const getDynamicInterpretation = (
  metricKey: string,
  value: number,
  status: "positive" | "warning" | "negative" | "neutral",
  financialInputs: FinancialInputs,
  kpis: KPIResults
): string => {
  switch (metricKey) {
    case "unitMargin":
      // Validar que averagePrice sea válido para evitar NaN
      if (!financialInputs.averagePrice || financialInputs.averagePrice <= 0) {
        return "Introduce un precio medio válido para calcular el margen unitario";
      }

      const marginPercentage = ((value / financialInputs.averagePrice) * 100).toFixed(1);
      if (status === "positive") {
        return `Margen excelente (${marginPercentage}% del precio de ${formatCurrency(financialInputs.averagePrice)}). Tienes buena capacidad para reinvertir en crecimiento`;
      } else if (status === "warning") {
        return `Margen aceptable (${marginPercentage}% del precio) pero mejorable. Considera optimizar costes o ajustar precios`;
      } else {
        return value <= 0
          ? `Margen negativo (${marginPercentage}%). Pierdes dinero con cada venta, revisa urgentemente tu modelo`
          : `Margen insuficiente (${marginPercentage}% del precio). Difícil mantener el negocio a largo plazo`;
      }

    case "monthlyProfit":
      // Validar que fixedCosts sea válido
      if (!financialInputs.fixedCosts || financialInputs.fixedCosts <= 0) {
        if (status === "positive") {
          return `Beneficio positivo de ${formatCurrency(value)}. Sin costes fijos definidos, este sería tu beneficio neto`;
        } else {
          return `Introduce costes fijos válidos para una evaluación más precisa del beneficio`;
        }
      }

      const profitVsFixed = ((value / financialInputs.fixedCosts) * 100).toFixed(1);
      if (status === "positive") {
        return `Beneficio positivo equivale al ${profitVsFixed}% de tus costes fijos. Negocio rentable y sostenible`;
      } else if (status === "warning") {
        const revenueNeeded = Math.abs(value);
        return `Pérdidas pequeñas (-${profitVsFixed}% de costes fijos). Necesitas ${formatCurrency(revenueNeeded)} más en ingresos mensuales`;
      } else {
        const lossVsRevenue =
          kpis.monthlyRevenue > 0
            ? ((Math.abs(value) / kpis.monthlyRevenue) * 100).toFixed(1)
            : "100";
        return `Pérdidas importantes (${lossVsRevenue}% de tus ingresos). Necesitas cambios urgentes en costes o ventas`;
      }

    case "ltv":
      // Validar que los valores necesarios estén disponibles
      if (
        !financialInputs.customerAcquisitionCost ||
        !kpis.unitMargin ||
        !financialInputs.averageCustomerLifetime
      ) {
        return "Introduce datos de CAC, margen unitario y duración del cliente para evaluar el LTV";
      }

      const monthsToRecover =
        kpis.unitMargin > 0
          ? (financialInputs.customerAcquisitionCost / kpis.unitMargin).toFixed(1)
          : "∞";
      if (status === "positive") {
        return `Valor alto por cliente. Recuperas el CAC en ${monthsToRecover} meses de los ${financialInputs.averageCustomerLifetime} que dura el cliente`;
      } else if (status === "warning") {
        return `Valor moderado. Tardas ${monthsToRecover} meses en recuperar la inversión en adquisición`;
      } else {
        return `Valor bajo del cliente. Con ${financialInputs.averageCustomerLifetime} meses de duración, es difícil ser rentable`;
      }

    case "ltvCacRatio":
      // Validar que CAC y LTV sean válidos
      if (!kpis.cac || !kpis.ltv || kpis.cacLtvRatio <= 0) {
        return "Introduce datos válidos de CAC y LTV para evaluar este ratio";
      }

      const actualRatio = kpis.cacLtvRatio > 0 ? (1 / kpis.cacLtvRatio).toFixed(2) : "0";
      if (status === "positive") {
        return `Ratio excelente (${actualRatio}:1). Cada euro invertido en adquisición genera ${actualRatio} euros de valor`;
      } else if (status === "warning") {
        return `Ratio aceptable (${actualRatio}:1) pero mejorable. Idealmente debería ser 3:1 o superior`;
      } else {
        return kpis.cac > kpis.ltv
          ? `Ratio crítico (${actualRatio}:1). Pierdes ${formatCurrency(kpis.cac - kpis.ltv)} por cada cliente adquirido`
          : `Ratio insuficiente (${actualRatio}:1). La adquisición de clientes no es rentable`;
      }

    case "breakEven":
      // Validar que los datos necesarios estén disponibles
      if (!financialInputs.monthlyNewCustomers || !kpis.breakEvenUnits) {
        return "Introduce ventas mensuales válidas para calcular el punto de equilibrio";
      }

      const currentMonthlyUnits = financialInputs.monthlyNewCustomers;
      const monthsToBreakEven =
        currentMonthlyUnits > 0 ? (kpis.breakEvenUnits / currentMonthlyUnits).toFixed(1) : "∞";
      if (status === "positive") {
        return `Punto alcanzable. Con ${currentMonthlyUnits} ventas/mes actuales, lo logras en ${monthsToBreakEven} meses`;
      } else if (status === "warning") {
        return `Punto de equilibrio alto. Necesitas ${Math.ceil(kpis.breakEvenUnits - currentMonthlyUnits)} ventas más por mes`;
      } else {
        return kpis.unitMargin <= 0
          ? `Imposible con margen negativo. Cada venta aumenta las pérdidas`
          : `Muy difícil de alcanzar. Necesitas ${monthsToBreakEven} meses con las ventas actuales`;
      }

    default:
      return (
        FINANCIAL_METRICS_HELP[metricKey]?.interpretation?.[
          status === "positive" ? "good" : status === "warning" ? "warning" : "bad"
        ] || ""
      );
  }
};

// Helper function to get LTV status based on relationship with CAC
const getLtvStatus = (
  ltv: number,
  cac: number,
  unitMargin: number,
  customerLifetime: number
): "positive" | "warning" | "negative" => {
  if (ltv <= 0) return "negative";

  const ltvCacRatio = ltv / cac;
  const recoveryTime = unitMargin > 0 ? cac / unitMargin : Infinity;

  // Excelente: LTV > 3x CAC y se recupera en menos de la mitad del lifetime
  if (ltvCacRatio >= 3 && recoveryTime <= customerLifetime * 0.5) {
    return "positive";
  }
  // Bueno: LTV > CAC y se recupera en menos del 80% del lifetime
  else if (ltvCacRatio >= 1 && recoveryTime <= customerLifetime * 0.8) {
    return "positive";
  }
  // Warning: LTV > CAC pero recuperación lenta
  else if (ltvCacRatio >= 1) {
    return "warning";
  }
  // Malo: LTV < CAC
  else {
    return "negative";
  }
};

// Helper function to get break-even status
const getBreakEvenStatus = (
  breakEvenUnits: number,
  breakEvenMonths: number,
  monthlyNewCustomers: number,
  unitMargin: number
): "positive" | "warning" | "negative" => {
  if (unitMargin <= 0 || !Number.isFinite(breakEvenUnits)) return "negative";

  // Bueno: Break-even en menos de 6 meses con ventas actuales
  if (breakEvenMonths <= 6) {
    return "positive";
  }
  // Warning: Break-even entre 6-18 meses
  else if (breakEvenMonths <= 18) {
    return "warning";
  }
  // Malo: Más de 18 meses
  else {
    return "negative";
  }
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  calculationResult,
  leanCanvasData,
  financialInputs,
}) => {
  const { kpis, health, recommendations } = calculationResult;
  const {
    unitMargin,
    monthlyRevenue,
    monthlyProfit,
    ltv,
    cacLtvRatio,
    breakEvenUnits,
    breakEvenMonths,
  } = kpis;

  // Prepare chart data
  const chartData = [
    {
      name: "Ingresos",
      value: monthlyRevenue,
      fill: "#4a63e7",
    },
    {
      name: "Beneficio",
      value: monthlyProfit,
      fill: monthlyProfit >= 0 ? "#10b981" : "#ef4444",
    },
  ];

  // Calcular el revenue break-even correctamente - validar para evitar NaN
  const calculateBreakEvenRevenue = () => {
    if (
      !Number.isFinite(breakEvenUnits) ||
      !financialInputs.averagePrice ||
      financialInputs.averagePrice <= 0
    ) {
      return 0; // Valor seguro para evitar NaN
    }
    return breakEvenUnits * financialInputs.averagePrice;
  };

  const breakEvenRevenue = calculateBreakEvenRevenue();

  const metricCards = [
    {
      key: "unitMargin",
      title: "Margen unitario",
      value: formatCurrency(unitMargin),
      numericValue: unitMargin,
      description: "Beneficio por cada unidad vendida.",
      status: getUnitMarginStatus(unitMargin, financialInputs.averagePrice),
      icon: MetricIcons.margin,
      visual: (
        <TrendIndicator
          value={unitMargin}
          format="currency"
          threshold={{
            good: financialInputs.averagePrice * 0.2, // 20% del precio
            warning: financialInputs.averagePrice * 0.1, // 10% del precio
          }}
        />
      ),
    },
    {
      key: "monthlyProfit",
      title: "Beneficio mensual",
      value: formatCurrency(monthlyProfit),
      numericValue: monthlyProfit,
      description: "Ganancia total mensual.",
      status: getHealthStatus(health.profitabilityHealth),
      icon: MetricIcons.profit,
      visual: (
        <TrendIndicator
          value={monthlyProfit}
          format="currency"
          threshold={{
            good: financialInputs.fixedCosts * 0.5, // 50% de costes fijos
            warning: 0, // Punto de equilibrio
          }}
        />
      ),
    },
    {
      key: "ltv",
      title: "LTV (Valor del cliente)",
      value: formatCurrency(ltv),
      numericValue: ltv,
      description: "Ingresos que genera un cliente durante su ciclo de vida.",
      status: getLtvStatus(ltv, kpis.cac, unitMargin, financialInputs.averageCustomerLifetime),
      icon: MetricIcons.ltv,
      visual: <TrendIndicator value={ltv} format="currency" />,
    },
    {
      key: "ltvCacRatio",
      title: "Ratio LTV/CAC",
      value: formatDecimal(1 / cacLtvRatio), // Invertimos para mostrar LTV/CAC en lugar de CAC/LTV
      numericValue: 1 / cacLtvRatio,
      description: "Ratio entre valor del cliente y coste de adquisición.",
      status: getHealthStatus(health.ltvCacHealth),
      icon: MetricIcons.cac,
      visual: <LTVCACDonut ltvCacRatio={cacLtvRatio} />,
    },
    {
      key: "breakEven",
      title: "Punto de equilibrio",
      value: `${Math.ceil(breakEvenUnits)} unidades`,
      numericValue: breakEvenUnits,
      description: `Ventas necesarias para cubrir costes (aprox. ${Math.ceil(breakEvenMonths)} meses).`,
      status: getBreakEvenStatus(
        breakEvenUnits,
        breakEvenMonths,
        financialInputs.monthlyNewCustomers,
        unitMargin
      ),
      icon: MetricIcons.breakeven,
      visual: (
        <BreakEvenProgress currentRevenue={monthlyRevenue} breakEvenRevenue={breakEvenRevenue} />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Lean Canvas Visual - ahora aparece primero */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-semibold text-lg">{leanCanvasData.name}</h3>
        </div>
        {leanCanvasData.description && (
          <div className="text-muted-foreground mb-6">{leanCanvasData.description}</div>
        )}
        <LeanCanvasVisual data={leanCanvasData} />
      </div>

      {/* Resumen del modelo financiero - ahora aparece segundo */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Resumen del modelo financiero</h3>
        <div className="text-muted-foreground mb-6">
          Basado en tus datos, aquí tienes los resultados clave de tu modelo de negocio.
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MetricIcons.revenue className="h-5 w-5 text-blue-600" />
              Ingresos vs. Beneficio Mensual
              <EnhancedInfoTooltip
                content="Comparación visual de ingresos totales mensuales contra los beneficios netos después de todos los costes."
                example="Si generas €5.000 en ingresos pero tienes €4.500 en costes totales, tu beneficio mensual será de €500."
                tips={[
                  "Los ingresos son las ventas totales sin descontar gastos",
                  "El beneficio es lo que realmente te queda después de todos los costes",
                  "Si el beneficio es negativo, necesitas reducir costes o aumentar ventas",
                ]}
              />
            </CardTitle>
            <CardDescription>Comparación visual de ingresos y beneficios mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}€`} />
                  <RechartsTooltip
                    formatter={(value) => [`${value}€`, undefined]}
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metricCards.map((card, index) => {
            const helpData = FINANCIAL_METRICS_HELP[card.key];
            const IconComponent = card.icon;

            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader
                  className={`pb-3 ${
                    card.status === "positive"
                      ? "border-l-4 border-green-500"
                      : card.status === "negative"
                        ? "border-l-4 border-red-500"
                        : card.status === "warning"
                          ? "border-l-4 border-yellow-500"
                          : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className={`h-5 w-5 ${
                          card.status === "positive"
                            ? "text-green-600"
                            : card.status === "negative"
                              ? "text-red-600"
                              : card.status === "warning"
                                ? "text-yellow-600"
                                : "text-blue-600"
                        }`}
                      />
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                    {helpData && (
                      <EnhancedInfoTooltip
                        content={helpData.description}
                        example={helpData.example}
                        tips={helpData.tips}
                      />
                    )}
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-3">
                  <p
                    className={`text-2xl font-bold ${
                      card.status === "positive"
                        ? "text-green-600"
                        : card.status === "negative"
                          ? "text-red-600"
                          : card.status === "warning"
                            ? "text-yellow-600"
                            : ""
                    }`}
                  >
                    {card.value}
                  </p>

                  {/* Mini visualizations */}
                  {card.visual && (
                    <div className="mt-3 pt-3 border-t border-gray-100">{card.visual}</div>
                  )}

                  {/* Status interpretation */}
                  {helpData && (
                    <div
                      className={`text-xs p-2 rounded ${
                        card.status === "positive"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : card.status === "negative"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : card.status === "warning"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {getDynamicInterpretation(
                        card.key,
                        card.numericValue,
                        card.status,
                        financialInputs,
                        kpis
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Análisis y recomendaciones - ahora aparece al final */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Análisis y recomendaciones</h3>
        <div className="text-muted-foreground">
          Basado en los resultados de tu simulación, estas son las conclusiones clave:
        </div>

        {/* Dynamic Recommendations from KPI Calculator */}
        <div className="mt-4 space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getRecommendationStyling(recommendation.status)}`}
            >
              <h4 className="font-medium mb-1">{recommendation.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: recommendation.message }} />
              {recommendation.type === "next_steps" && (
                <ul className="list-disc list-inside mt-2">
                  <li>
                    Validar tus estimaciones de adquisición de clientes con experimentos reales.
                  </li>
                  <li>Confirmar tus costes variables y fijos con proveedores y expertos.</li>
                  <li>
                    Buscar formas de aumentar el ciclo de vida del cliente para mejorar el LTV.
                  </li>
                  <li>Explorar opciones para reducir tus costes de adquisición de clientes.</li>
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
