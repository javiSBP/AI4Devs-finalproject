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

// Mock SimulationCard
vi.mock("@/components/ui/simulation-card", () => ({
  SimulationCard: ({
    simulation,
    variant,
  }: {
    simulation: SimulationListItem;
    variant?: "grid" | "list";
  }) => (
    <div data-testid="simulation-card" data-variant={variant || "grid"}>
      {simulation.name}
    </div>
  ),
}));

const mockSimulations: SimulationListItem[] = [
  {
    id: "sim_1",
    name: "Startup 1",
    description: "Primera startup",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    leanCanvas: {
      id: "canvas_1",
      name: "Canvas 1",
      description: "Descripción 1",
      problem: "Problema 1",
      solution: "Solución 1",
      uniqueValueProposition: "UVP 1",
    },
    results: {
      id: "result_1",
      overallHealth: "good",
      monthlyProfit: 5000,
      ltv: 240,
      cacLtvRatio: 0.333,
      calculatedAt: "2024-01-20T15:30:00Z",
    },
  },
  {
    id: "sim_2",
    name: "Startup 2",
    description: "Segunda startup",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-21T15:30:00Z",
    leanCanvas: {
      id: "canvas_2",
      name: "Canvas 2",
      description: "Descripción 2",
      problem: "Problema 2",
      solution: "Solución 2",
      uniqueValueProposition: "UVP 2",
    },
    results: {
      id: "result_2",
      overallHealth: "medium",
      monthlyProfit: 3000,
      ltv: 180,
      cacLtvRatio: 0.5,
      calculatedAt: "2024-01-21T15:30:00Z",
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

describe("HistorialPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSimulations).mockReturnValue(mockUseSimulations);
    mockUseSimulations.listSimulations.mockResolvedValue({
      simulations: mockSimulations,
      totalCount: 2,
    });
  });

  describe("View Toggle", () => {
    it("should render with grid view by default", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tus simulaciones guardadas (2)")).toBeInTheDocument();
      });

      // Check that toggle buttons exist - use testid for more reliable queries
      const toggleContainer = screen.getByText("Vista:").parentElement;
      const buttons = toggleContainer?.querySelectorAll("button");

      expect(buttons).toHaveLength(2);

      // Grid button should be active (has bg-primary class)
      expect(buttons?.[0]).toHaveClass("bg-primary");

      // All simulation cards should have grid variant
      const simulationCards = screen.getAllByTestId("simulation-card");
      expect(simulationCards).toHaveLength(2);
      simulationCards.forEach((card) => {
        expect(card).toHaveAttribute("data-variant", "grid");
      });
    });

    it("should switch to list view when list button is clicked", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tus simulaciones guardadas (2)")).toBeInTheDocument();
      });

      // Find the toggle buttons by their containers
      const toggleContainer = screen.getByText("Vista:").parentElement;
      const buttons = toggleContainer?.querySelectorAll("button");
      const listButton = buttons?.[1]; // Second button should be list

      expect(listButton).toBeDefined();

      // Click list button
      fireEvent.click(listButton!);

      // All simulation cards should now have list variant
      const simulationCards = screen.getAllByTestId("simulation-card");
      simulationCards.forEach((card) => {
        expect(card).toHaveAttribute("data-variant", "list");
      });
    });

    it("should switch back to grid view when grid button is clicked", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tus simulaciones guardadas (2)")).toBeInTheDocument();
      });

      const toggleContainer = screen.getByText("Vista:").parentElement;
      const buttons = toggleContainer?.querySelectorAll("button");
      const gridButton = buttons?.[0]; // First button should be grid
      const listButton = buttons?.[1]; // Second button should be list

      // First switch to list view
      fireEvent.click(listButton!);

      let simulationCards = screen.getAllByTestId("simulation-card");
      simulationCards.forEach((card) => {
        expect(card).toHaveAttribute("data-variant", "list");
      });

      // Then switch back to grid view
      fireEvent.click(gridButton!);

      simulationCards = screen.getAllByTestId("simulation-card");
      simulationCards.forEach((card) => {
        expect(card).toHaveAttribute("data-variant", "grid");
      });
    });

    it("should maintain view toggle visibility even with no simulations", async () => {
      mockUseSimulations.listSimulations.mockResolvedValue({
        simulations: [],
        totalCount: 0,
      });

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("No hay simulaciones guardadas")).toBeInTheDocument();
      });

      // Toggle should not be visible when there are no simulations
      expect(screen.queryByText("Vista:")).not.toBeInTheDocument();
    });

    it("should render correct number of simulations in both views", async () => {
      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tus simulaciones guardadas (2)")).toBeInTheDocument();
      });

      // Check grid view
      let simulationCards = screen.getAllByTestId("simulation-card");
      expect(simulationCards).toHaveLength(2);

      // Switch to list view
      const toggleContainer = screen.getByText("Vista:").parentElement;
      const listButton = toggleContainer?.querySelectorAll("button")?.[1];
      fireEvent.click(listButton!);

      // Check list view
      simulationCards = screen.getAllByTestId("simulation-card");
      expect(simulationCards).toHaveLength(2);
    });
  });

  describe("Error handling", () => {
    it("should handle loading state", () => {
      mockUseSimulations.loading = true;
      render(<HistorialPage />);

      expect(screen.getByText("Cargando simulaciones...")).toBeInTheDocument();
      expect(screen.queryByText("Vista:")).not.toBeInTheDocument();
    });

    it("should handle error state", () => {
      mockUseSimulations.loading = false;
      mockUseSimulations.error = "Error de conexión";

      render(<HistorialPage />);

      expect(screen.getByText("Error al cargar las simulaciones")).toBeInTheDocument();
      expect(screen.getByText("Error de conexión")).toBeInTheDocument();
      expect(screen.queryByText("Vista:")).not.toBeInTheDocument();
    });
  });

  describe("Basic functionality", () => {
    it("should render page title and new simulation button", async () => {
      // Reset the mock to return successful data for this test
      mockUseSimulations.loading = false;
      mockUseSimulations.error = null;
      mockUseSimulations.listSimulations.mockResolvedValue({
        simulations: mockSimulations,
        totalCount: 2,
      });
      vi.mocked(useSimulations).mockReturnValue(mockUseSimulations);

      render(<HistorialPage />);

      await waitFor(() => {
        expect(screen.getByText("Tus simulaciones guardadas (2)")).toBeInTheDocument();
      });

      expect(
        screen.getByRole("heading", { name: "Historial de Simulaciones" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /nueva simulación/i })).toBeInTheDocument();
    });

    it("should call listSimulations on mount", () => {
      render(<HistorialPage />);

      expect(mockUseSimulations.listSimulations).toHaveBeenCalledWith(1, 50);
    });
  });
});
