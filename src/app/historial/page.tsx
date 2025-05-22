"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
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
import { ChartBar, FileText } from "lucide-react";

interface Simulation {
  id: number;
  date: string;
  leanCanvas: {
    problem: string;
    solution: string;
    uniqueValueProposition: string;
    customerSegments: string;
    channels: string;
    revenueStreams: string;
  };
  financial: {
    averagePrice: number;
    costPerUnit: number;
    fixedCosts: number;
    customerAcquisitionCost: number;
    monthlyNewCustomers: number;
    averageCustomerLifetime: number;
  };
}

export default function HistorialPage() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Propuesta de valor</TableHead>
                    <TableHead>Precio medio</TableHead>
                    <TableHead>Clientes/mes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulations.map((simulation) => (
                    <TableRow key={simulation.id}>
                      <TableCell>{new Date(simulation.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {simulation.leanCanvas.uniqueValueProposition || "Sin definir"}
                      </TableCell>
                      <TableCell>{simulation.financial.averagePrice}€</TableCell>
                      <TableCell>{simulation.financial.monthlyNewCustomers}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/simulation/${simulation.id}`}>Ver detalles</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
