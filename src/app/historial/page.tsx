"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Toast from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ChartBar, FileText, CheckCircle, AlertCircle, XCircle } from "lucide-react";

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
  leanCanvas: {
    name: string;
    description?: string;
    problem: string;
    solution: string;
    uniqueValueProposition: string;
    customerSegments: string;
    channels: string;
    revenueStreams: string;
  };
  financial?: FinancialData;
  financialInputs?: FinancialData; // Para compatibilidad
}

export default function HistorialPage() {
  const searchParams = useSearchParams();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado del toast de éxito
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    // Load simulations from local storage
    const savedSimulations = localStorage.getItem("simulations");
    if (savedSimulations) {
      try {
        const parsed = JSON.parse(savedSimulations);
        setSimulations(parsed);
      } catch (error) {
        console.error("Error parsing simulations:", error);
        setSimulations([]);
      }
    }
    setLoading(false);

    // Mostrar toast de éxito si viene de una simulación guardada
    if (searchParams.get("success") === "true") {
      setSuccessToast(true);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando simulaciones...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Historial de Simulaciones</h1>
          <Button asChild>
            <Link href="/simulation">
              <ChartBar className="mr-2 h-4 w-4" />
              Nueva simulación
            </Link>
          </Button>
        </div>

        {simulations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-medium">No hay simulaciones guardadas</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera simulación para evaluar la viabilidad de tu modelo de negocio.
                </p>
                <Button asChild>
                  <Link href="/simulation">Nueva simulación</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Tus simulaciones guardadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Ingresos/mes</TableHead>
                    <TableHead>Viabilidad</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulations.map((simulation) => {
                    // Verificar y normalizar la estructura de datos financieros
                    const financialData = simulation.financial || simulation.financialInputs;

                    // Valores por defecto para evitar errores
                    const defaultFinancial: FinancialData = {
                      averagePrice: financialData?.averagePrice || 0,
                      costPerUnit: financialData?.costPerUnit || 0,
                      fixedCosts: financialData?.fixedCosts || 0,
                      customerAcquisitionCost: financialData?.customerAcquisitionCost || 0,
                      monthlyNewCustomers: financialData?.monthlyNewCustomers || 0,
                      averageCustomerLifetime: financialData?.averageCustomerLifetime || 0,
                    };

                    // Calcular ingresos mensuales estimados
                    const monthlyRevenue =
                      defaultFinancial.averagePrice * defaultFinancial.monthlyNewCustomers;

                    // Calcular margen unitario para determinar viabilidad
                    const unitMargin = defaultFinancial.averagePrice - defaultFinancial.costPerUnit;
                    const monthlyProfit =
                      monthlyRevenue -
                      defaultFinancial.fixedCosts -
                      defaultFinancial.customerAcquisitionCost *
                        defaultFinancial.monthlyNewCustomers;

                    // Determinar estado de viabilidad
                    let viabilityStatus = {
                      icon: XCircle,
                      text: "Baja",
                      className: "text-red-600 dark:text-red-400",
                    };
                    if (unitMargin > 0 && monthlyProfit > 0) {
                      viabilityStatus = {
                        icon: CheckCircle,
                        text: "Buena",
                        className: "text-green-600 dark:text-green-400",
                      };
                    } else if (unitMargin > 0) {
                      viabilityStatus = {
                        icon: AlertCircle,
                        text: "Media",
                        className: "text-yellow-600 dark:text-yellow-400",
                      };
                    }

                    const IconComponent = viabilityStatus.icon;

                    return (
                      <TableRow key={simulation.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{simulation.leanCanvas.name || "Sin nombre"}</div>
                            {simulation.leanCanvas.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {simulation.leanCanvas.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(simulation.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-mono">
                          {new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          }).format(monthlyRevenue)}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <IconComponent className={`h-4 w-4 ${viabilityStatus.className}`} />
                            <span className={viabilityStatus.className}>
                              {viabilityStatus.text}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/simulation/${simulation.id}`}>Ver detalles</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Toast de éxito */}
      <Toast
        message="¡Simulación guardada correctamente!"
        type="success"
        isVisible={successToast}
        onClose={() => setSuccessToast(false)}
        duration={4000}
      />
    </MainLayout>
  );
}
