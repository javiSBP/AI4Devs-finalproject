"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import WizardLayout from "@/components/wizard/WizardLayout";
import LeanCanvasForm, { LeanCanvasFormRef } from "@/components/forms/LeanCanvasForm";
import FinancialInputsForm, {
  FinancialInputsFormRef,
} from "@/components/forms/FinancialInputsForm";
import ResultsDisplay from "@/components/results/ResultsDisplay";
import Toast from "@/components/ui/toast";
import { LeanCanvasData } from "@/types/lean-canvas";
import { calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";
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
  const router = useRouter();
  const { createSimulation } = useSimulations();
  const leanCanvasFormRef = useRef<LeanCanvasFormRef>(null);
  const financialInputsFormRef = useRef<FinancialInputsFormRef>(null);

  // Estados para mostrar mensajes de éxito/error
  const [toast, setToast] = useState<{
    type: "success" | "error" | "info";
    message: string;
    isVisible: boolean;
  }>({ type: "info", message: "", isVisible: false });

  // Estado para loading del guardado
  const [isCompleting, setIsCompleting] = useState(false);

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
    return calculateFinancialMetrics(financialData);
  };

  const calculationResult = calculateResults();

  const wizardSteps = [
    {
      title: "Lean Canvas",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Define los aspectos clave de tu modelo de negocio</p>
          <LeanCanvasForm
            ref={leanCanvasFormRef}
            initialData={leanCanvasData}
            onSubmit={(data) => setLeanCanvasData(data)}
          />
        </div>
      ),
      validate: async () => {
        if (leanCanvasFormRef.current) {
          return await leanCanvasFormRef.current.validate();
        }
        return false;
      },
    },
    {
      title: "Datos Financieros",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Introduce los datos financieros de tu negocio</p>
          <FinancialInputsForm
            ref={financialInputsFormRef}
            initialData={financialData}
            onSubmit={(data) => setFinancialData(data)}
          />
        </div>
      ),
      validate: async () => {
        if (financialInputsFormRef.current) {
          return await financialInputsFormRef.current.validate();
        }
        return false;
      },
    },
    {
      title: "Resultados",
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Analiza los resultados de tu simulación</p>

          <ResultsDisplay
            calculationResult={calculationResult}
            leanCanvasData={leanCanvasData}
            financialInputs={financialData}
          />
        </div>
      ),
    },
  ];

  const handleComplete = async () => {
    // Activar estado de loading
    setIsCompleting(true);
    // Limpiar mensajes anteriores
    setToast({ type: "info", message: "", isVisible: false });

    const simulationData = {
      name: leanCanvasData.name || `Simulación ${new Date().toLocaleDateString()}`,
      description: `Simulación creada el ${new Date().toLocaleDateString()}`,
      leanCanvas: leanCanvasData,
      financialInputs: financialData, // Para la API
      // Estructura adicional para compatibilidad con historial local
      financial: financialData,
      date: new Date().toISOString(),
      id: Date.now(), // ID temporal para localStorage
    };

    try {
      const result = await createSimulation(simulationData);

      if (result.success) {
        // API call successful
        console.log("Simulation saved to API!", result.data);

        // Navegar primero al historial
        router.push("/historial?success=true");
      } else if (result.usedFallback) {
        // API failed but fallback worked
        console.log("Simulation saved to localStorage fallback:", result.data);
        setToast({
          type: "error",
          message: `Error de conexión: ${result.error || "API no disponible"}. Los datos se han guardado localmente.`,
          isVisible: true,
        });
      }
    } catch (err) {
      // Unexpected error (shouldn't happen now, but just in case)
      console.error("Unexpected error saving simulation:", err);
      setToast({
        type: "error",
        message: `Error inesperado: ${err instanceof Error ? err.message : "Error desconocido"}`,
        isVisible: true,
      });
    } finally {
      // Desactivar estado de loading
      setIsCompleting(false);
    }
  };

  return (
    <MainLayout>
      <WizardLayout steps={wizardSteps} onComplete={handleComplete} isCompleting={isCompleting} />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={5000}
      />
    </MainLayout>
  );
}
