"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Toast from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChartBar, FileText, XCircle } from "lucide-react";
import { useSimulations } from "@/hooks/useSimulations";
import type { SimulationListItem } from "@/types/simulation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { SimulationCard } from "@/components/ui/simulation-card";

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Tus simulaciones guardadas ({simulations.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((simulation) => (
                <SimulationCard
                  key={simulation.id}
                  simulation={simulation}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  isLoading={actionLoading === simulation.id}
                />
              ))}
            </div>
          </div>
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
