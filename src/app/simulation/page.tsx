"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WizardLayout from "@/components/wizard/WizardLayout";
import LeanCanvasForm from "@/components/forms/LeanCanvasForm";
import FinancialInputsForm from "@/components/forms/FinancialInputsForm";
import ResultsDisplay from "@/components/results/ResultsDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeanCanvasData } from "@/types/lean-canvas";
import { FinancialInputs, calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";
import { useSimulations } from "@/hooks/useSimulations";

export interface FinancialData {
  averagePrice: number;
  costPerUnit: number;
  fixedCosts: number;
  customerAcquisitionCost: number;
  monthlyNewCustomers: number;
  averageCustomerLifetime: number;
}

export default function SimulationPage() {
  const { createSimulation, error, clearError } = useSimulations();

  // Estados para mostrar mensajes de éxito/error
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [leanCanvasData, setLeanCanvasData] = useState<LeanCanvasData>({
    name: "",
    description: "",
    problem: "",
    solution: "",
    uniqueValueProposition: "",
    customerSegments: "",
    channels: "",
    revenueStreams: "",
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    averagePrice: 0,
    costPerUnit: 0,
    fixedCosts: 0,
    customerAcquisitionCost: 0,
    monthlyNewCustomers: 0,
    averageCustomerLifetime: 0,
  });

  // Calculate results in real-time using kpi-calculator (as required by ticket-7)
  const calculateResults = () => {
    const financialInputs: FinancialInputs = {
      averagePrice: financialData.averagePrice,
      costPerUnit: financialData.costPerUnit,
      fixedCosts: financialData.fixedCosts,
      customerAcquisitionCost: financialData.customerAcquisitionCost,
      monthlyNewCustomers: financialData.monthlyNewCustomers,
      averageCustomerLifetime: financialData.averageCustomerLifetime,
    };

    return calculateFinancialMetrics(financialInputs);
  };

  const calculationResult = calculateResults();

  const wizardSteps = [
    {
      title: "Lean Canvas",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Define los aspectos clave de tu modelo de negocio</p>
          <LeanCanvasForm
            initialData={leanCanvasData}
            onSubmit={(data) => setLeanCanvasData(data)}
          />
        </div>
      ),
    },
    {
      title: "Datos Financieros",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Introduce los datos financieros de tu negocio</p>
          <FinancialInputsForm
            initialData={financialData}
            onSubmit={(data) => setFinancialData(data)}
          />
        </div>
      ),
    },
    {
      title: "Resultados",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Analiza los resultados de tu simulación</p>

          {/* Error de conexión API */}
          {error && (
            <Alert variant="default">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <AlertTitle>Conexión con servidor limitada</AlertTitle>
              <AlertDescription>
                Los datos se guardarán localmente como respaldo. {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensaje de éxito/error al guardar */}
          {saveMessage.type && (
            <Alert variant={saveMessage.type === "error" ? "destructive" : "default"}>
              {saveMessage.type === "success" ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <AlertTitle>
                {saveMessage.type === "success" ? "¡Simulación guardada!" : "Error al guardar"}
              </AlertTitle>
              <AlertDescription>{saveMessage.message}</AlertDescription>
            </Alert>
          )}

          <ResultsDisplay
            calculationResult={calculationResult}
            leanCanvasData={leanCanvasData}
            financialInputs={{
              averagePrice: financialData.averagePrice,
              costPerUnit: financialData.costPerUnit,
              fixedCosts: financialData.fixedCosts,
              customerAcquisitionCost: financialData.customerAcquisitionCost,
              monthlyNewCustomers: financialData.monthlyNewCustomers,
              averageCustomerLifetime: financialData.averageCustomerLifetime,
            }}
          />
        </div>
      ),
    },
  ];

  const handleComplete = async () => {
    // Limpiar mensajes anteriores
    setSaveMessage({ type: null, message: "" });
    clearError();

    const simulationData = {
      name: leanCanvasData.name || `Simulación ${new Date().toLocaleDateString()}`,
      description: `Simulación creada el ${new Date().toLocaleDateString()}`,
      leanCanvas: leanCanvasData,
      financialInputs: {
        averagePrice: financialData.averagePrice,
        costPerUnit: financialData.costPerUnit,
        fixedCosts: financialData.fixedCosts,
        customerAcquisitionCost: financialData.customerAcquisitionCost,
        monthlyNewCustomers: financialData.monthlyNewCustomers,
        averageCustomerLifetime: financialData.averageCustomerLifetime,
      },
    };

    try {
      const result = await createSimulation(simulationData);

      if (result.success) {
        // API call successful
        console.log("Simulation saved to API!", result.data);
        setSaveMessage({
          type: "success",
          message: "¡Simulación guardada correctamente en la base de datos!",
        });
      } else if (result.usedFallback) {
        // API failed but fallback worked
        console.log("Simulation saved to localStorage fallback:", result.data);
        setSaveMessage({
          type: "error",
          message: `Error de conexión: ${result.error || "API no disponible"}. Los datos se han guardado localmente.`,
        });
      }
    } catch (err) {
      // Unexpected error (shouldn't happen now, but just in case)
      console.error("Unexpected error saving simulation:", err);
      setSaveMessage({
        type: "error",
        message: `Error inesperado: ${err instanceof Error ? err.message : "Error desconocido"}`,
      });
    }
  };

  return (
    <MainLayout>
      <WizardLayout steps={wizardSteps} onComplete={handleComplete} />
    </MainLayout>
  );
}
