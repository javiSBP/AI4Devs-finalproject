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
import { calculateFinancialMetrics } from "@/lib/financial/kpi-calculator";
import { useSimulations } from "@/hooks/useSimulations";
import type { FirstStepInput } from "@/lib/validation/shared/lean-canvas";

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

  // Estado combinado para el primer paso
  const [firstStepData, setFirstStepData] = useState<FirstStepInput>({
    metadata: {
      name: "",
      description: "",
    },
    leanCanvas: {
      problem: "",
      solution: "",
      uniqueValueProposition: "",
      customerSegments: "",
      channels: "",
      revenueStreams: "",
    },
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
            initialData={firstStepData}
            onSubmit={(data) => setFirstStepData(data)}
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
            leanCanvasData={firstStepData.leanCanvas}
            financialInputs={financialData}
            simulationName={firstStepData.metadata.name}
            simulationDescription={firstStepData.metadata.description}
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
      name: firstStepData.metadata.name,
      description: firstStepData.metadata.description || undefined,
      leanCanvas: firstStepData.leanCanvas,
      financialInputs: financialData,
    };

    try {
      const result = await createSimulation(simulationData);
      console.log("Simulation saved successfully!", result);

      // Navegar al historial con parámetro de éxito
      router.push("/historial?success=true");
    } catch (err) {
      console.error("Error saving simulation:", err);
      setToast({
        type: "error",
        message: `Error al guardar la simulación: ${err instanceof Error ? err.message : "Error desconocido"}`,
        isVisible: true,
      });
      // Desactivar estado de loading si hay error
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
