import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import HistorialPage from "./page";
import { useSimulations } from "@/hooks/useSimulations";
import type { SimulationListItem } from "@/types/simulation";

// Mock Next.js hooks
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}));

// Mock the custom hook
vi.mock("@/hooks/useSimulations");

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock MainLayout
vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Toast component
vi.mock("@/components/ui/toast", () => ({
  default: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div data-testid="toast" onClick={onClose}>
      {message}
    </div>
  ),
}));

// Mock AlertDialog component
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({
    isOpen,
    onConfirm,
    title,
    description,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    description: string;
  }) =>
    isOpen ? (
      <div data-testid="alert-dialog">
        <h3>{title}</h3>
        <p>{description}</p>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    ) : null,
}));

// Mock SimulationCard component
vi.mock("@/components/ui/simulation-card", () => ({
  SimulationCard: ({
    simulation,
    variant,
    onDelete,
    onDuplicate,
  }: {
    simulation: SimulationListItem;
    variant: "grid" | "list";
    onDelete: (id: string, name: string) => void;
    onDuplicate: (id: string, name: string) => void;
  }) => (
    <div data-testid={`simulation-card-${simulation.id}`} data-variant={variant}>
      <h3>{simulation.name}</h3>
      <p>{simulation.description}</p>
      <button onClick={() => onDelete(simulation.id, simulation.name)}>Eliminar</button>
      <button onClick={() => onDuplicate(simulation.id, simulation.name)}>Duplicar</button>
    </div>
  ),
}));

const mockSimulations: SimulationListItem[] = [
  {
    id: "sim_1",
    name: "Tienda Online de Ropa",
    description: "Venta de ropa femenina online",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    leanCanvas: {
      id: "canvas_1",
      name: "Canvas Tienda Ropa",
      description: "Canvas para tienda de ropa",
      problem: "No hay ropa de calidad",
      solution: "Vender ropa de calidad",
      uniqueValueProposition: "Ropa de calidad a buen precio",
    },
    financialInputs: {
      averagePrice: 50,
      costPerUnit: 20,
      fixedCosts: 5000,
      customerAcquisitionCost: 10,
      monthlyNewCustomers: 100,
      averageCustomerLifetime: 12,
    },
  },
  {
    id: "sim_2",
    name: "App de Delivery",
    description: "Aplicación de entrega de comida",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
    leanCanvas: {
      id: "canvas_2",
      name: "Canvas App Delivery",
      description: "Canvas para app de delivery",
      problem: "Delivery lento",
      solution: "App rápida",
      uniqueValueProposition: "Delivery en 30 minutos",
    },
    financialInputs: {
      averagePrice: 15,
      costPerUnit: 8,
      fixedCosts: 3000,
      customerAcquisitionCost: 5,
      monthlyNewCustomers: 200,
      averageCustomerLifetime: 8,
    },
  },
];

const mockUseSimulations = {
  createSimulation: vi.fn(),
  getSimulation: vi.fn(),
  updateSimulation: vi.fn(),
  listSimulations: vi.fn(),
  deleteSimulation: vi.fn(),
  duplicateSimulation: vi.fn(),
  loading: false,
  error: null as string | null,
  clearError: vi.fn(),
};

const mockPaginatedResponse = {
  simulations: mockSimulations,
  pagination: {
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
    limit: 12,
    totalRecords: 2,
  },
};

describe("HistorialPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSimulations).mockReturnValue(mockUseSimulations);
    mockUseSimulations.listSimulations.mockResolvedValue(mockPaginatedResponse);
  });

  describe("View Toggle", () => {
    it("should switch between grid and list views", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      // Find the view toggle buttons using test-ids or more specific selectors
      const viewToggleContainer = screen.getByText("Vista:").parentElement;
      const buttons = viewToggleContainer?.querySelectorAll("button");
      const gridButton = buttons?.[0];
      const listButton = buttons?.[1];

      expect(gridButton).toBeDefined();
      expect(listButton).toBeDefined();

      // Initially should be in grid view - check the container
      const simulationGrid = screen.getByTestId("simulations-container");
      expect(simulationGrid).toBeInTheDocument();

      // Switch to list view
      if (listButton) {
        fireEvent.click(listButton);
      }

      // The view should change (we can't easily test the exact layout change in this mock setup)
      await waitFor(() => {
        expect(listButton).toHaveClass("bg-primary", "text-primary-foreground");
      });

      // Switch back to grid view
      if (gridButton) {
        fireEvent.click(gridButton);
      }

      await waitFor(() => {
        expect(gridButton).toHaveClass("bg-primary", "text-primary-foreground");
      });
    });
  });

  describe("Search Functionality", () => {
    it("should handle search input changes", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      // Search for "Tienda"
      const searchInput = screen.getByPlaceholderText("Buscar en página actual...");
      fireEvent.change(searchInput, { target: { value: "Tienda" } });

      // The search input should update
      expect(searchInput).toHaveValue("Tienda");

      // Clear search - find the clear button by its position in the search container
      const clearButton = searchInput.parentElement?.querySelector("button");
      if (clearButton) {
        fireEvent.click(clearButton);
      }

      // The search input should be cleared
      expect(searchInput).toHaveValue("");
    });

    it("should show no results message when search has no matches", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      // Search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText("Buscar en página actual...");
      fireEvent.change(searchInput, { target: { value: "NonExistentApp" } });

      await waitFor(() => {
        expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument();
        expect(screen.getByText(/No hay simulaciones que coincidan con/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Limpiar búsqueda" })).toBeInTheDocument();
      });
    });
  });

  describe("Sort Functionality", () => {
    it("should sort simulations by different fields", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      // Should be sorted by "updatedAt" desc by default
      expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "updatedAt", "desc");

      // Change sort to name
      const sortSelect = screen.getByDisplayValue("Última actualización");
      fireEvent.change(sortSelect, { target: { value: "name" } });

      await waitFor(() => {
        expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "name", "desc");
      });

      // Change sort to createdAt
      fireEvent.change(sortSelect, { target: { value: "createdAt" } });

      await waitFor(() => {
        expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "createdAt", "desc");
      });
    });

    it("should toggle sort order", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      // Initial call should be desc
      expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "updatedAt", "desc");

      // Click sort order toggle
      const sortOrderButton = screen.getByTitle("Orden descendente");
      fireEvent.click(sortOrderButton);

      await waitFor(() => {
        expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "updatedAt", "asc");
      });

      // Click again to toggle back
      const sortOrderButtonAsc = screen.getByTitle("Orden ascendente");
      fireEvent.click(sortOrderButtonAsc);

      await waitFor(() => {
        expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 12, "updatedAt", "desc");
      });
    });
  });

  describe("Basic functionality", () => {
    it("should render page title and new simulation button", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Página 1 de 1")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("heading", { name: "Historial de Simulaciones" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /nueva simulación/i })).toBeInTheDocument();
    });

    it("should render simulations when loaded", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tienda Online de Ropa")).toBeInTheDocument();
        expect(screen.getByText("App de Delivery")).toBeInTheDocument();
      });
    });

    it("should handle delete action", async () => {
      mockUseSimulations.deleteSimulation.mockResolvedValue({ message: "Deleted" });

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tienda Online de Ropa")).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByText("Eliminar")[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
      });

      const confirmButton = screen.getByText("Confirmar");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockUseSimulations.deleteSimulation).toHaveBeenCalledWith("sim_1");
      });
    });

    it("should handle duplicate action", async () => {
      mockUseSimulations.duplicateSimulation.mockResolvedValue(mockSimulations[0]);

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tienda Online de Ropa")).toBeInTheDocument();
      });

      const duplicateButton = screen.getAllByText("Duplicar")[0];
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mockUseSimulations.duplicateSimulation).toHaveBeenCalledWith("sim_1");
      });
    });
  });

  describe("Error states", () => {
    it("should show loading state", () => {
      // Mock loading state
      const loadingMock = {
        ...mockUseSimulations,
        loading: true,
      };
      vi.mocked(useSimulations).mockReturnValue(loadingMock);

      render(<HistorialPage />);

      expect(screen.getByText("Cargando simulaciones...")).toBeInTheDocument();
    });

    it("should show error message when loading fails", async () => {
      const errorMock = {
        ...mockUseSimulations,
        loading: false,
        error: "Failed to load simulations",
      };
      vi.mocked(useSimulations).mockReturnValue(errorMock);

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Error al cargar las simulaciones")).toBeInTheDocument();
        expect(screen.getByText("Failed to load simulations")).toBeInTheDocument();
      });
    });

    it("should show empty state when no simulations", async () => {
      const emptyResponse = {
        simulations: [],
        pagination: {
          current: 1,
          total: 1,
          hasNext: false,
          hasPrev: false,
          limit: 12,
          totalRecords: 0,
        },
      };

      mockUseSimulations.listSimulations.mockResolvedValue(emptyResponse);

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("No hay simulaciones guardadas")).toBeInTheDocument();
        expect(screen.getByText(/Crea tu primera simulación/)).toBeInTheDocument();
      });
    });
  });
});
