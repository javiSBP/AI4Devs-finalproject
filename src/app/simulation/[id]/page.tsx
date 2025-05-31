"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import ResultsDisplay from "@/components/results/ResultsDisplay";
import InfoTooltip from "@/components/ui/info-tooltip";
import { calculateFinancialMetrics, FinancialInputs } from "@/lib/financial/kpi-calculator";

interface LeanCanvasData {
  problem: string;
  solution: string;
  uniqueValueProposition: string;
  customerSegments: string;
  channels: string;
  revenueStreams: string;
}

interface FinancialData {
  averagePrice: number;
  costPerUnit: number;
  fixedCosts: number;
  customerAcquisitionCost: number;
  monthlyNewCustomers: number;
  averageCustomerLifetime: number;
}

interface Simulation {
  id: number;
  date: string;
  leanCanvas: LeanCanvasData;
  financial: FinancialData;
}

export default function SimulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load simulations from localStorage
    const savedSimulations = localStorage.getItem("simulations");
    if (savedSimulations) {
      const parsedSimulations: Simulation[] = JSON.parse(savedSimulations);
      const foundSimulation = parsedSimulations.find((sim) => sim.id === Number(params.id));

      if (foundSimulation) {
        setSimulation(foundSimulation);
      } else {
        console.error("No se encontró la simulación");
        router.push("/historial");
      }
    } else {
      console.error("No hay simulaciones guardadas");
      router.push("/historial");
    }

    setLoading(false);
  }, [params.id, router]);

  const handleBack = () => {
    router.push("/historial");
  };

  // Calculate results using KPI calculator
  const calculateResults = (financial: FinancialData) => {
    const financialInputs: FinancialInputs = {
      averagePrice: financial.averagePrice,
      costPerUnit: financial.costPerUnit,
      fixedCosts: financial.fixedCosts,
      customerAcquisitionCost: financial.customerAcquisitionCost,
      monthlyNewCustomers: financial.monthlyNewCustomers,
      averageCustomerLifetime: financial.averageCustomerLifetime,
    };

    return calculateFinancialMetrics(financialInputs);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando simulación...</p>
        </div>
      </MainLayout>
    );
  }

  if (!simulation) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Simulación no encontrada</p>
        </div>
      </MainLayout>
    );
  }

  const calculationResult = calculateResults(simulation.financial);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al historial
        </Button>

        <h1 className="text-3xl font-bold mb-8">
          Simulación del {new Date(simulation.date).toLocaleDateString()}
        </h1>

        <div className="space-y-8">
          {/* Input Summary Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Datos de la simulación</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Lean Canvas Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Lean Canvas
                    <InfoTooltip content="Resumen de los datos del Lean Canvas introducidos" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Problema</h3>
                    <p>{simulation.leanCanvas.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Solución</h3>
                    <p>{simulation.leanCanvas.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Propuesta de Valor Única
                    </h3>
                    <p>{simulation.leanCanvas.uniqueValueProposition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Segmentos de Cliente
                    </h3>
                    <p>{simulation.leanCanvas.customerSegments}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Canales</h3>
                    <p>{simulation.leanCanvas.channels}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Flujos de Ingresos
                    </h3>
                    <p>{simulation.leanCanvas.revenueStreams}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Inputs Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Inputs Financieros
                    <InfoTooltip content="Resumen de los datos financieros introducidos" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Precio medio</h3>
                    <p>{simulation.financial.averagePrice}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coste por unidad</h3>
                    <p>{simulation.financial.costPerUnit}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Costes fijos mensuales
                    </h3>
                    <p>{simulation.financial.fixedCosts}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Coste de adquisición de cliente
                    </h3>
                    <p>{simulation.financial.customerAcquisitionCost}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Nuevos clientes mensuales
                    </h3>
                    <p>{simulation.financial.monthlyNewCustomers}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Duración media del cliente (meses)
                    </h3>
                    <p>{simulation.financial.averageCustomerLifetime}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Resultados</h2>
            <ResultsDisplay
              calculationResult={calculationResult}
              leanCanvasData={simulation.leanCanvas}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
