"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Toast from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ChartBar,
  FileText,
  XCircle,
  LayoutGrid,
  LayoutList,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSimulations } from "@/hooks/useSimulations";
import type { SimulationListItem } from "@/types/simulation";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { RocketLoader } from "@/components/ui/rocket-loader";
import { SimulationCard } from "@/components/ui/simulation-card";

type ViewMode = "grid" | "list";
type SortField = "createdAt" | "updatedAt" | "name";
type SortOrder = "asc" | "desc";

interface FilterState {
  sortField: SortField;
  sortOrder: SortOrder;
  searchQuery: string;
  page: number;
  limit: number;
}

interface PaginationInfo {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
  totalRecords: number;
}

export default function HistorialPage() {
  const { listSimulations, deleteSimulation, duplicateSimulation, loading, error } =
    useSimulations();

  // View and filter state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>({
    sortField: "updatedAt",
    sortOrder: "desc",
    searchQuery: "",
    page: 1,
    limit: 12, // Good number for grid layout (3x4, 4x3, etc.)
  });

  // Simulation data state
  const [simulations, setSimulations] = useState<SimulationListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
    limit: 12,
    totalRecords: 0,
  });
  const [filteredSimulations, setFilteredSimulations] = useState<SimulationListItem[]>([]);

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [dialogConfig, setDialogConfig] = useState<{
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

  // Load simulations on mount and when filters change
  useEffect(() => {
    const loadSimulations = async () => {
      try {
        const response = await listSimulations(
          filters.page,
          filters.limit,
          filters.sortField,
          filters.sortOrder
        );
        setSimulations(response.simulations);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Error loading simulations:", err);
        showToast("Error al cargar las simulaciones", "error");
      }
    };

    loadSimulations();
  }, [listSimulations, filters.page, filters.limit, filters.sortField, filters.sortOrder]);

  // Apply search filter to simulations (client-side for current page)
  useEffect(() => {
    if (!filters.searchQuery.trim()) {
      setFilteredSimulations(simulations);
    } else {
      const query = filters.searchQuery.toLowerCase().trim();
      const filtered = simulations.filter(
        (sim) =>
          sim.name.toLowerCase().includes(query) ||
          (sim.description && sim.description.toLowerCase().includes(query))
      );
      setFilteredSimulations(filtered);
    }
  }, [simulations, filters.searchQuery]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleDelete = async (id: string, name: string) => {
    setDialogConfig({
      isOpen: true,
      title: "Confirmar eliminación",
      description: `¿Estás seguro de que quieres eliminar la simulación "${name}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await deleteSimulation(id);
          // Reload current page
          const response = await listSimulations(
            filters.page,
            filters.limit,
            filters.sortField,
            filters.sortOrder
          );
          setSimulations(response.simulations);
          setPagination(response.pagination);

          // If current page is empty and not the first page, go to previous page
          if (response.simulations.length === 0 && filters.page > 1) {
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
          }

          showToast("Simulación eliminada correctamente");
        } catch (err) {
          console.error("Error deleting simulation:", err);
          showToast("Error al eliminar la simulación", "error");
        }
        setDialogConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDuplicate = async (id: string, name: string) => {
    try {
      await duplicateSimulation(id);
      // Reload current page
      const response = await listSimulations(
        filters.page,
        filters.limit,
        filters.sortField,
        filters.sortOrder
      );
      setSimulations(response.simulations);
      setPagination(response.pagination);
      showToast(`Simulación "${name}" duplicada correctamente`);
    } catch (err) {
      console.error("Error duplicating simulation:", err);
      showToast("Error al duplicar la simulación", "error");
    }
  };

  const handleSortChange = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      // Toggle order if same field, otherwise default to desc
      sortOrder: prev.sortField === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1, // Reset to first page when sorting changes
    }));
  };

  const handleOrderToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1, // Reset to first page when order changes
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: e.target.value,
      // Don't reset page for search as it's client-side filtering
    }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when changing page size
    }));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const { current, total } = pagination;

    // Always show first page
    if (total > 0) pages.push(1);

    // Show ellipsis if needed
    if (current > 3) pages.push("...");

    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(current + 1, total - 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Show ellipsis if needed
    if (current < total - 2) pages.push("...");

    // Always show last page
    if (total > 1 && !pages.includes(total)) pages.push(total);

    return pages;
  };

  if (loading && simulations.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <RocketLoader message="Cargando simulaciones..." size="lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto">
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-xl font-medium">Error al cargar las simulaciones</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Reintentar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const displayCount = filteredSimulations.length;
  const isFiltered = filters.searchQuery.trim() !== "";

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Historial de Simulaciones</h1>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/simulation">
              <ChartBar className="mr-2 h-4 w-4" />
              Nueva simulación
            </Link>
          </Button>
        </div>

        {pagination.totalRecords === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-medium">No hay simulaciones guardadas</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera simulación para comenzar a analizar tu modelo de negocio
                </p>
                <Button asChild>
                  <Link href="/simulation">
                    <ChartBar className="mr-2 h-4 w-4" />
                    Crear simulación
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Controls Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">
                  {isFiltered
                    ? `${displayCount} de ${simulations.length} simulaciones en esta página`
                    : `Página ${pagination.current} de ${pagination.total}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {pagination.totalRecords} simulaciones en total
                </p>
              </div>

              {/* View Toggle and Page Size */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrar:</span>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                    className="px-2 py-1 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                {/* View Toggle - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Vista:</span>
                  <div className="flex rounded-lg border p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`${
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      } inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 py-1`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`${
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      } inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 py-1`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar en página actual..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 border border-input bg-background rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                {filters.searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Ordenar por:
                  </span>
                </div>

                {/* Sort Field Dropdown */}
                <select
                  value={filters.sortField}
                  onChange={(e) => handleSortChange(e.target.value as SortField)}
                  className="px-3 py-1 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-0"
                >
                  <option value="updatedAt">Última actualización</option>
                  <option value="createdAt">Fecha de creación</option>
                  <option value="name">Nombre</option>
                </select>

                {/* Sort Order Toggle */}
                <button
                  onClick={handleOrderToggle}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1 border border-input bg-background rounded-md text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex-shrink-0"
                  title={`Orden ${filters.sortOrder === "desc" ? "descendente" : "ascendente"}`}
                >
                  {filters.sortOrder === "desc" ? (
                    <SortDesc className="h-4 w-4" />
                  ) : (
                    <SortAsc className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {filters.sortOrder === "desc" ? "Desc" : "Asc"}
                  </span>
                </button>
              </div>
            </div>

            {/* Results */}
            {displayCount === 0 && isFiltered ? (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-medium">No se encontraron resultados</h3>
                    <p className="text-muted-foreground mb-4">
                      No hay simulaciones que coincidan con &ldquo;{filters.searchQuery}&rdquo; en
                      esta página
                    </p>
                    <Button onClick={clearSearch} variant="outline">
                      Limpiar búsqueda
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Loading overlay for pagination */}
                <div className="relative">
                  {loading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                      <RocketLoader message="" size="md" />
                    </div>
                  )}

                  <div
                    data-testid="simulations-container"
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "hidden sm:block sm:space-y-4"
                    }
                  >
                    {filteredSimulations.map((simulation) => (
                      <SimulationCard
                        key={simulation.id}
                        simulation={simulation}
                        variant={viewMode}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                        isLoading={loading}
                      />
                    ))}
                  </div>

                  {/* Mobile-only grid view */}
                  <div className="block sm:hidden">
                    <div className="grid grid-cols-1 gap-6">
                      {filteredSimulations.map((simulation) => (
                        <SimulationCard
                          key={simulation.id}
                          simulation={simulation}
                          variant="grid"
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                          isLoading={loading}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pagination Controls */}
                {pagination.total > 1 && (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-8 pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 overflow-x-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className="flex-shrink-0"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span className="hidden xs:inline">Anterior</span>
                        <span className="xs:hidden">Ant</span>
                      </Button>

                      <div className="flex items-center gap-1 overflow-x-auto">
                        {getPageNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 py-1 text-muted-foreground flex-shrink-0"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              disabled={loading}
                              className={`px-2 sm:px-3 py-1 text-sm rounded-md transition-colors flex-shrink-0 ${
                                page === pagination.current
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={!pagination.hasNext || loading}
                        className="flex-shrink-0"
                      >
                        <span className="hidden xs:inline">Siguiente</span>
                        <span className="xs:hidden">Sig</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                      Página {pagination.current} de {pagination.total}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            isVisible={!!toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={dialogConfig.isOpen}
          onClose={() => setDialogConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={dialogConfig.onConfirm}
          title={dialogConfig.title}
          description={dialogConfig.description}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="destructive"
        />
      </div>
    </MainLayout>
  );
}
