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
import InfoTooltip from "@/components/ui/info-tooltip";
import LeanCanvasVisual from "./LeanCanvasVisual";
import { LeanCanvasData } from "@/types/lean-canvas";
import { CalculationResult } from "@/lib/financial/kpi-calculator";

interface ResultsDisplayProps {
  calculationResult: CalculationResult;
  leanCanvasData: LeanCanvasData;
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

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ calculationResult, leanCanvasData }) => {
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

  const metricCards = [
    {
      title: "Margen unitario",
      value: formatCurrency(unitMargin),
      description: "Beneficio por cada unidad vendida.",
      status: getHealthStatus(health.profitabilityHealth),
      tooltip: "Diferencia entre el precio de venta y el coste variable por unidad.",
    },
    {
      title: "Beneficio mensual",
      value: formatCurrency(monthlyProfit),
      description: "Ganancia total mensual.",
      status: getHealthStatus(health.profitabilityHealth),
      tooltip:
        "Ingresos totales menos costes variables, costes fijos y costes de adquisición de clientes.",
    },
    {
      title: "LTV (Valor del cliente)",
      value: formatCurrency(ltv),
      description: "Ingresos que genera un cliente durante su ciclo de vida.",
      status: "neutral" as const,
      tooltip: "Margen por cliente multiplicado por su duración media (meses).",
    },
    {
      title: "Ratio LTV/CAC",
      value: formatDecimal(1 / cacLtvRatio), // Invertimos para mostrar LTV/CAC en lugar de CAC/LTV
      description: "Ratio entre valor del cliente y coste de adquisición.",
      status: getHealthStatus(health.ltvCacHealth),
      tooltip: "Ideal: >3 | Aceptable: >1 | Problema: <1",
    },
    {
      title: "Punto de equilibrio",
      value: `${Math.ceil(breakEvenUnits)} unidades`,
      description: `Ventas necesarias para cubrir costes (aprox. ${Math.ceil(breakEvenMonths)} meses).`,
      status: "neutral" as const,
      tooltip: "Cantidad de ventas necesarias para que los ingresos igualen a los costes totales.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-lg mb-2">Resumen del modelo financiero</h3>
        <div className="text-muted-foreground mb-6">
          Basado en tus datos, aquí tienes los resultados clave de tu modelo de negocio.
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Ingresos vs. Beneficio Mensual
              <InfoTooltip content="Comparación visual de ingresos totales mensuales contra los beneficios netos después de todos los costes." />
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
          {metricCards.map((card, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader
                className={`pb-2 ${
                  card.status === "positive"
                    ? "border-l-4 border-green-500"
                    : card.status === "negative"
                      ? "border-l-4 border-red-500"
                      : card.status === "warning"
                        ? "border-l-4 border-yellow-500"
                        : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <InfoTooltip content={card.tooltip} />
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lean Canvas Visual */}
      <LeanCanvasVisual data={leanCanvasData} />

      <div>
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          Análisis y recomendaciones
          <InfoTooltip content="Basados en tus datos financieros y tu Lean Canvas, estas son nuestras recomendaciones." />
        </h3>
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
              <h4 className="font-medium mb-1 flex items-center gap-2">
                {recommendation.title}
                <InfoTooltip content="Análisis generado automáticamente basado en tus métricas financieras." />
              </h4>
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
