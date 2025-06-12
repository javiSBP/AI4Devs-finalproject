import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Copy,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { SimulationListItem } from "@/types/simulation";
import { calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";

interface SimulationCardProps {
  simulation: SimulationListItem;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, name: string) => void;
  isLoading?: boolean;
  variant?: "grid" | "list";
}

export function SimulationCard({
  simulation,
  onDelete,
  onDuplicate,
  isLoading = false,
  variant = "grid",
}: SimulationCardProps) {
  // Use real-time calculation for consistency with detail page when financialInputs available
  const useRealTimeCalculation = simulation.financialInputs !== undefined;

  let monthlyProfit: number;
  let overallHealth: string;
  let rawCacLtvRatio: number | undefined;
  let ltv: number;

  if (useRealTimeCalculation && simulation.financialInputs) {
    // Use same calculation as detail page for consistency
    const calculationResult = calculateFinancialMetrics(simulation.financialInputs);
    monthlyProfit = calculationResult.kpis.monthlyProfit;
    overallHealth = calculationResult.health.overallHealth;
    rawCacLtvRatio = calculationResult.kpis.cacLtvRatio;
    ltv = calculationResult.kpis.ltv;
  } else {
    // Fallback to pre-calculated results from database
    monthlyProfit = simulation.results?.monthlyProfit || 0;
    overallHealth = simulation.results?.overallHealth || "poor";
    rawCacLtvRatio = simulation.results?.cacLtvRatio;
    ltv = simulation.results?.ltv || 0;
  }

  // Enhanced formatDecimal function with better precision for critical ratios
  const formatDecimal = (value: number) => {
    // Show 1 decimal for critical ranges (1.0-9.9) where thresholds matter most
    if (value >= 10) {
      return Math.round(value).toString(); // 10+ without decimals (e.g., "15")
    } else if (value >= 1) {
      return value.toFixed(1); // 1.0-9.9 with 1 decimal (e.g., "1.5", "2.0", "3.2")
    } else {
      return value.toFixed(1); // <1 with 1 decimal (e.g., "0.8")
    }
  };

  // Calculate LTV/CAC ratio for display - unified with ResultsDisplay.tsx logic
  const getLtvCacRatio = () => {
    // Following ResultsDisplay.tsx pattern exactly (lines 354-362)
    if (rawCacLtvRatio === 0) {
      return "Perfecto (CAC gratuito)";
    } else if (rawCacLtvRatio === Infinity || ltv <= 0) {
      return "No viable";
    } else if (rawCacLtvRatio === null || rawCacLtvRatio === undefined) {
      return "No viable";
    } else if (rawCacLtvRatio < 0) {
      // Invalid negative ratio
      return "No viable";
    } else {
      return formatDecimal(1 / rawCacLtvRatio); // Use exact same formatDecimal function
    }
  };

  const ltvCacRatio = getLtvCacRatio();

  // Get LTV/CAC ratio color based on REAL VALUE, not formatted string
  const getLtvCacColor = () => {
    if (ltvCacRatio === "No viable") return "text-red-600";
    if (ltvCacRatio === "Perfecto (CAC gratuito)") return "text-green-600";

    // Use raw numeric value (not formatted string) for classification - same as kpi-calculator
    const realNumericRatio = rawCacLtvRatio ? 1 / rawCacLtvRatio : 0;

    // Use same thresholds as kpi-calculator.ts classifyHealth function
    if (realNumericRatio >= 3) return "text-green-600"; // good (>= 3)
    if (realNumericRatio >= 2) return "text-yellow-600"; // medium (>= 2)
    return "text-red-600"; // bad (< 2)
  };

  // Format currency (with space like the tests expect)
  const formatCurrency = (value: number): string => {
    const formattedNumber = new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));

    const result = `${formattedNumber} €`;
    return value < 0 ? `-${result}` : result;
  };

  // Get viability info - following ResultsDisplay.tsx patterns
  const getViabilityInfo = () => {
    switch (overallHealth) {
      case "good":
        return {
          text: "Buena",
          variant: "default" as const,
          icon: CheckCircle,
          className:
            "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
        };
      case "medium":
        return {
          text: "Media",
          variant: "secondary" as const,
          icon: AlertCircle,
          className:
            "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
        };
      case "poor":
      case "bad":
      default:
        return {
          text: "Baja",
          variant: "destructive" as const,
          icon: XCircle,
          className:
            "bg-red-100 text-red-600 border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-600 dark:border-red-800",
        };
    }
  };

  const viabilityInfo = getViabilityInfo();
  const IconComponent = viabilityInfo.icon;

  // Grid variant (default behavior)
  if (variant === "grid") {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight truncate">
                {simulation.name || "Sin nombre"}
              </CardTitle>
              {simulation.description && (
                <p className="text-sm text-muted-foreground mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {simulation.description}
                </p>
              )}
            </div>
            <Badge
              variant={viabilityInfo.variant}
              className={`shrink-0 ${viabilityInfo.className}`}
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {viabilityInfo.text}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Monthly Profit */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {monthlyProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium">Beneficio</span>
              </div>
              <p
                className={`text-lg font-semibold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(monthlyProfit)}
              </p>
            </div>

            {/* LTV/CAC Ratio */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className={`h-4 w-4 ${getLtvCacColor()}`} />
                <span className="text-sm font-medium">LTV/CAC</span>
              </div>
              <p className={`text-lg font-semibold ${getLtvCacColor()}`}>{ltvCacRatio}</p>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Actualizada el{" "}
              {new Date(simulation.updatedAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <Link href={`/simulation/${simulation.id}`}>
                Ver detalles
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>

            <TooltipProvider>
              <div className="flex gap-2 justify-center sm:justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(simulation.id, simulation.name || "Sin nombre")}
                      disabled={isLoading}
                      aria-label="Duplicar simulación"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicar simulación</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(simulation.id, simulation.name || "Sin nombre")}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label="Eliminar simulación"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar simulación</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List variant
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section: Title and description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg leading-tight truncate">
                {simulation.name || "Sin nombre"}
              </CardTitle>
              <Badge
                variant={viabilityInfo.variant}
                className={`shrink-0 ${viabilityInfo.className}`}
              >
                <IconComponent className="h-3 w-3 mr-1" />
                {viabilityInfo.text}
              </Badge>
            </div>
            {simulation.description && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {simulation.description}
              </p>
            )}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Actualizada el{" "}
                {new Date(simulation.updatedAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Center section: Key metrics */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Monthly Profit */}
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                {monthlyProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-muted-foreground">Beneficio</span>
              </div>
              <p
                className={`text-lg font-semibold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(monthlyProfit)}
              </p>
            </div>

            {/* LTV/CAC Ratio */}
            <div className="text-center">
              <div className="flex items-center gap-1 mb-1">
                <Target className={`h-4 w-4 ${getLtvCacColor()}`} />
                <span className="text-sm font-medium text-muted-foreground">LTV/CAC</span>
              </div>
              <p className={`text-lg font-semibold ${getLtvCacColor()}`}>{ltvCacRatio}</p>
            </div>
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/simulation/${simulation.id}`}>
                <span className="hidden lg:inline">Ver detalles</span>
                <span className="lg:hidden">Ver</span>
                <ChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>

            <TooltipProvider>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(simulation.id, simulation.name || "Sin nombre")}
                      disabled={isLoading}
                      aria-label="Duplicar simulación"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicar simulación</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(simulation.id, simulation.name || "Sin nombre")}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      aria-label="Eliminar simulación"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar simulación</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
