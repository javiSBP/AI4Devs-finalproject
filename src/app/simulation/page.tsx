"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WizardLayout from "@/components/wizard/WizardLayout";
import LeanCanvasForm from "@/components/forms/LeanCanvasForm";
import FinancialInputsForm from "@/components/forms/FinancialInputsForm";
import ResultsDisplay from "@/components/results/ResultsDisplay";
import { LeanCanvasData } from "@/types/lean-canvas";
import { calculateFinancialMetrics, FinancialInputs } from "@/lib/financial/kpi-calculator";

export interface FinancialData {
  averagePrice: number;
  costPerUnit: number;
  fixedCosts: number;
  customerAcquisitionCost: number;
  monthlyNewCustomers: number;
  averageCustomerLifetime: number;
}

export default function SimulationPage() {
  const [leanCanvasData, setLeanCanvasData] = useState<LeanCanvasData>({
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
          <ResultsDisplay calculationResult={calculationResult} leanCanvasData={leanCanvasData} />
        </div>
      ),
    },
  ];

  const handleComplete = () => {
    // Save the simulation to local storage
    const savedSimulations = localStorage.getItem("simulations");
    const simulations = savedSimulations ? JSON.parse(savedSimulations) : [];

    const newSimulation = {
      id: Date.now(),
      date: new Date().toISOString(),
      leanCanvas: leanCanvasData,
      financial: financialData,
    };

    simulations.push(newSimulation);
    localStorage.setItem("simulations", JSON.stringify(simulations)); // In Next.js we would use router.push("/historial")    console.log("Simulation saved!", newSimulation);
  };

  return (
    <MainLayout>
      {" "}
      <WizardLayout steps={wizardSteps} onComplete={handleComplete} />{" "}
    </MainLayout>
  );
}
