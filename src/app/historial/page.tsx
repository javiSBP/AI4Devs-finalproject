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
import { ChartBar, FileText, CheckCircle, AlertCircle, XCircle, Trash2, Copy } from "lucide-react";
import { useSimulations } from "@/hooks/useSimulations";
import type { SimulationListItem } from "@/types/simulation";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function HistorialPage() {
  const searchParams = useSearchParams();
  const { listSimulations, deleteSimulation, duplicateSimulation, loading, error } =
    useSimulations();

  const [simulations, setSimulations] = useState<SimulationListItem[]>([]);
  const [successToast, setSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Alert Dialog state
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const loadSimulations = async () => {
    try {
      const result = await listSimulations(1, 50); // Load up to 50 simulations
      setSimulations(result.simulations);
    } catch (err) {
      console.error("Error loading simulations:", err);
    }
  };

  useEffect(() => {
    loadSimulations();

    // Mostrar toast de éxito si viene de una simulación guardada
    if (searchParams.get("success") === "true") {
      setToastMessage("¡Simulación guardada correctamente!");
      setSuccessToast(true);
    }
  }, [searchParams]);

  const handleDelete = (id: string, name: string) => {
    setAlertDialog({
      isOpen: true,
      title: "Eliminar simulación",
      description: `¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
      onConfirm: () => confirmDelete(id),
    });
  };

  const confirmDelete = async (id: string) => {
    setAlertDialog({ ...alertDialog, isOpen: false });
    setActionLoading(id);

    try {
      await deleteSimulation(id);
      setToastMessage("Simulación eliminada correctamente");
      setSuccessToast(true);
      await loadSimulations(); // Reload the list
    } catch (err) {
      console.error("Error deleting simulation:", err);
      setToastMessage("Error al eliminar la simulación");
      setSuccessToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (id: string, name: string) => {
    setActionLoading(id);
    try {
      await duplicateSimulation(id);
      setToastMessage(`"${name}" duplicada correctamente`);
      setSuccessToast(true);
      await loadSimulations(); // Reload the list
    } catch (err) {
      console.error("Error duplicating simulation:", err);
      setToastMessage("Error al duplicar la simulación");
      setSuccessToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando simulaciones...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-medium">Error al cargar las simulaciones</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadSimulations}>Reintentar</Button>
              </div>
            </CardContent>
          </Card>
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
              <CardTitle>Tus simulaciones guardadas ({simulations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Beneficio/mes</TableHead>
                    <TableHead>Viabilidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulations.map((simulation) => {
                    // Calculate monthly profit from results
                    const monthlyProfit = simulation.results?.monthlyProfit || 0;
                    const overallHealth = simulation.results?.overallHealth || "unknown";

                    // Determine viability status based on results
                    let viabilityStatus = {
                      icon: XCircle,
                      text: "Baja",
                      className: "text-red-600 dark:text-red-400",
                    };

                    if (overallHealth === "good") {
                      viabilityStatus = {
                        icon: CheckCircle,
                        text: "Buena",
                        className: "text-green-600 dark:text-green-400",
                      };
                    } else if (overallHealth === "medium") {
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
                            <div>{simulation.name || "Sin nombre"}</div>
                            {simulation.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {simulation.description}
                              </div>
                            )}
                            {simulation.leanCanvas?.name &&
                              simulation.leanCanvas.name !== simulation.name && (
                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  Canvas: {simulation.leanCanvas.name}
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(simulation.updatedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-mono">
                          {new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          }).format(monthlyProfit)}
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
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/simulation/${simulation.id}`}>Ver detalles</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(simulation.id, simulation.name)}
                              disabled={actionLoading === simulation.id}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(simulation.id, simulation.name)}
                              disabled={actionLoading === simulation.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Toast de feedback */}
      <Toast
        message={toastMessage}
        type="success"
        isVisible={successToast}
        onClose={() => setSuccessToast(false)}
        duration={4000}
      />

      {/* Alert Dialog para confirmaciones */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        onConfirm={alertDialog.onConfirm}
        title={alertDialog.title}
        description={alertDialog.description}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="default"
        confirmLoading={actionLoading !== null}
      />
    </MainLayout>
  );
}
