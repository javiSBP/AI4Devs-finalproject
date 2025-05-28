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

interface ResultsDisplayProps {
  results: {
    unitMargin: number;
    monthlyRevenue: number;
    monthlyProfit: number;
    ltv: number;
    cac: number;
    cacLtvRatio: number;
    breakEvenUnits: number;
    breakEvenMonths: number;
  };
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

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, leanCanvasData }) => {
  const {
    unitMargin,
    monthlyRevenue,
    monthlyProfit,
    ltv,
    cacLtvRatio,
    breakEvenUnits,
    breakEvenMonths,
  } = results;

  const isProfitable = monthlyProfit > 0;
  const isGoodCacLtvRatio = cacLtvRatio < 0.33;

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
      status: unitMargin > 0 ? "positive" : "negative",
      tooltip: "Diferencia entre el precio de venta y el coste variable por unidad.",
    },
    {
      title: "Beneficio mensual",
      value: formatCurrency(monthlyProfit),
      description: "Ganancia total mensual.",
      status: monthlyProfit > 0 ? "positive" : "negative",
      tooltip:
        "Ingresos totales menos costes variables, costes fijos y costes de adquisición de clientes.",
    },
    {
      title: "LTV (Valor del cliente)",
      value: formatCurrency(ltv),
      description: "Ingresos que genera un cliente durante su ciclo de vida.",
      status: "neutral",
      tooltip: "Margen por cliente multiplicado por su duración media (meses).",
    },
    {
      title: "Ratio LTV/CAC",
      value: formatDecimal(1 / cacLtvRatio), // Invertimos para mostrar LTV/CAC en lugar de CAC/LTV
      description: "Ratio entre valor del cliente y coste de adquisición.",
      status: cacLtvRatio < 0.33 ? "positive" : cacLtvRatio < 1 ? "warning" : "negative",
      tooltip: "Ideal: >3 | Aceptable: >1 | Problema: <1",
    },
    {
      title: "Punto de equilibrio",
      value: `${Math.ceil(breakEvenUnits)} unidades`,
      description: `Ventas necesarias para cubrir costes (aprox. ${Math.ceil(breakEvenMonths)} meses).`,
      status: "neutral",
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

        <div className="mt-4 space-y-4">
          <div
            className={`p-4 rounded-lg border ${isProfitable ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900"}`}
          >
            <h4 className="font-medium mb-1 flex items-center gap-2">
              Viabilidad económica
              <InfoTooltip content="Analiza si el modelo de negocio genera suficientes ingresos para cubrir todos los costes." />
            </h4>
            {isProfitable ? (
              <p>
                Tu modelo muestra un <strong>beneficio mensual positivo</strong>. Esto indica que tu
                negocio puede ser viable si se cumplen las previsiones de ventas e ingresos.
              </p>
            ) : (
              <p>
                Tu modelo muestra <strong>pérdidas mensuales</strong>. Considera revisar tus
                precios, costes variables o estructura de costes fijos para mejorar la rentabilidad.
              </p>
            )}
          </div>

          <div
            className={`p-4 rounded-lg border ${isGoodCacLtvRatio ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900"}`}
          >
            <h4 className="font-medium mb-1 flex items-center gap-2">
              Eficiencia de adquisición de clientes
              <InfoTooltip content="Evalúa si el coste de conseguir un cliente nuevo se compensa con lo que generará durante su ciclo de vida." />
            </h4>
            {isGoodCacLtvRatio ? (
              <p>
                Tu ratio LTV/CAC es <strong>excelente</strong> (mayor a 3), lo que indica que tu
                estrategia de adquisición de clientes es muy eficiente.
              </p>
            ) : cacLtvRatio < 1 ? (
              <p>
                Tu ratio LTV/CAC es <strong>aceptable</strong> pero podría mejorar. Intenta reducir
                tus costes de adquisición o aumentar el valor del cliente (LTV).
              </p>
            ) : (
              <p>
                Tu ratio LTV/CAC es <strong>preocupante</strong> (menor que 1). Cuesta más adquirir
                un cliente que lo que te generará en ingresos. Revisa urgentemente tu estrategia de
                marketing y adquisición.
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">
            <h4 className="font-medium mb-1 flex items-center gap-2">
              Próximos pasos
              <InfoTooltip content="Recomendaciones para refinar y validar tu modelo de negocio." />
            </h4>
            <p>Para continuar validando tu modelo de negocio, considera:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Validar tus estimaciones de adquisición de clientes con experimentos reales.</li>
              <li>Confirmar tus costes variables y fijos con proveedores y expertos.</li>
              <li>Buscar formas de aumentar el ciclo de vida del cliente para mejorar el LTV.</li>
              <li>Explorar opciones para reducir tus costes de adquisición de clientes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
