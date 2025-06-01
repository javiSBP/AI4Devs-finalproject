"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  Target,
  Scale,
  BarChart3,
  TrendingDown,
  Minus,
} from "lucide-react";

interface LTVCACDonutProps {
  ltvCacRatio: number;
}

export const LTVCACDonut: React.FC<LTVCACDonutProps> = ({ ltvCacRatio }) => {
  // Convertir ratio a valores para el gráfico
  const ltv = 1 / ltvCacRatio; // LTV normalizado
  const cac = 1; // CAC normalizado a 1

  const data = [
    { name: "LTV", value: ltv, fill: "#10b981" },
    { name: "CAC", value: cac, fill: "#ef4444" },
  ];

  const total = ltv + cac;
  const ltvPercentage = ((ltv / total) * 100).toFixed(1);

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={30}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>LTV {ltvPercentage}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>CAC {(100 - parseFloat(ltvPercentage)).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

interface BreakEvenProgressProps {
  currentRevenue: number;
  breakEvenRevenue: number;
}

export const BreakEvenProgress: React.FC<BreakEvenProgressProps> = ({
  currentRevenue,
  breakEvenRevenue,
}) => {
  // Validar inputs para evitar NaN
  const validCurrentRevenue = Number.isFinite(currentRevenue) ? currentRevenue : 0;
  const validBreakEvenRevenue =
    Number.isFinite(breakEvenRevenue) && breakEvenRevenue > 0 ? breakEvenRevenue : 0;

  let progress = 0;
  let isBreakEven = false;

  if (validBreakEvenRevenue > 0) {
    progress = Math.min((validCurrentRevenue / validBreakEvenRevenue) * 100, 100);
    isBreakEven = validCurrentRevenue >= validBreakEvenRevenue;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progreso hacia equilibrio</span>
        <span className={isBreakEven ? "text-green-600 font-medium" : "text-gray-600"}>
          {validBreakEvenRevenue > 0 ? `${progress.toFixed(1)}%` : "N/A"}
        </span>
      </div>
      <Progress
        value={progress}
        className={`h-2 ${isBreakEven ? "[&>div]:bg-green-500" : "[&>div]:bg-blue-500"}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>€{validCurrentRevenue.toLocaleString()}</span>
        <span>
          {validBreakEvenRevenue > 0
            ? `€${validBreakEvenRevenue.toLocaleString()}`
            : "No calculable"}
        </span>
      </div>
    </div>
  );
};

interface TrendIndicatorProps {
  value: number;
  threshold?: {
    good: number;
    warning: number;
  };
  format?: "currency" | "ratio" | "percentage";
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  threshold,
  format = "currency",
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `€${val.toLocaleString()}`;
      case "ratio":
        return val.toFixed(2);
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return val.toString();
    }
  };

  const getStatus = () => {
    if (!threshold) return "neutral";
    if (value >= threshold.good) return "good";
    if (value >= threshold.warning) return "warning";
    return "bad";
  };

  const status = getStatus();
  const getIcon = () => {
    switch (status) {
      case "good":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case "bad":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className="font-medium">{formatValue(value)}</span>
    </div>
  );
};

// Iconos para métricas
export const MetricIcons = {
  revenue: DollarSign,
  ltv: TrendingUp,
  cac: Target,
  margin: Scale,
  breakeven: BarChart3,
  profit: DollarSign,
} as const;

export type MetricIconType = keyof typeof MetricIcons;
