"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

import ResultsDisplay from "@/components/results/ResultsDisplay";
import { calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";
import { useSimulations } from "@/hooks/useSimulations";
import type { CompleteSimulation } from "@/types/simulation";

export default function SimulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getSimulation, loading: apiLoading, error } = useSimulations();

  const [simulation, setSimulation] = useState<CompleteSimulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimulation = async () => {
      if (!params.id || typeof params.id !== "string") {
        console.error("ID de simulación inválido");
        router.push("/historial");
        return;
      }

      try {
        const result = await getSimulation(params.id);
        setSimulation(result);
      } catch (err) {
        console.error("Error loading simulation:", err);
        router.push("/historial");
      } finally {
        setLoading(false);
      }
    };

    loadSimulation();
  }, [params.id, getSimulation, router]);

  const handleBack = () => {
    router.push("/historial");
  };

  if (loading || apiLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando simulación...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !simulation) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-medium">Simulación no encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {error || "La simulación que buscas no existe o no tienes acceso a ella."}
                </p>
                <Button onClick={handleBack}>Volver al historial</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Calculate results using the saved financial inputs
  const calculationResult = calculateFinancialMetrics(simulation.financialInputs);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al historial
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{simulation.name}</h1>
            {simulation.description && (
              <p className="text-muted-foreground mt-2">{simulation.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Última actualización: {new Date(simulation.updatedAt).toLocaleString("es-ES")}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Input Summary Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Datos de la simulación</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Lean Canvas Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Lean Canvas</CardTitle>
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
                  <CardTitle>Inputs Financieros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Precio medio</h3>
                    <p>{simulation.financialInputs.averagePrice}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coste por unidad</h3>
                    <p>{simulation.financialInputs.costPerUnit}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Costes fijos mensuales
                    </h3>
                    <p>{simulation.financialInputs.fixedCosts}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Coste de adquisición de cliente
                    </h3>
                    <p>{simulation.financialInputs.customerAcquisitionCost}€</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Nuevos clientes mensuales
                    </h3>
                    <p>{simulation.financialInputs.monthlyNewCustomers}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Duración media del cliente (meses)
                    </h3>
                    <p>{simulation.financialInputs.averageCustomerLifetime}</p>
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
              financialInputs={simulation.financialInputs}
              simulationName={simulation.name}
              simulationDescription={simulation.description}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
