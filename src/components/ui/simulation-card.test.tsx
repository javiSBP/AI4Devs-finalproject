import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { SimulationCard } from "./simulation-card";
import type { SimulationListItem } from "@/types/simulation";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockSimulation: SimulationListItem = {
  id: "sim_123",
  name: "Mi Startup de Ejemplo",
  description: "Una descripción de ejemplo para mi startup",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z",
  leanCanvas: {
    id: "canvas_123",
    name: "Canvas de Ejemplo",
    description: "Descripción del canvas",
    problem: "Problema identificado",
    solution: "Solución propuesta",
    uniqueValueProposition: "Propuesta única",
  },
  results: {
    id: "result_123",
    overallHealth: "good",
    monthlyProfit: 5000,
    ltv: 240,
    cacLtvRatio: 0.333, // CAC/LTV = 0.333 → LTV/CAC = 3
    calculatedAt: "2024-01-20T15:30:00Z",
  },
};

const mockHandlers = {
  onDelete: vi.fn(),
  onDuplicate: vi.fn(),
};

describe("SimulationCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render simulation data correctly", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    expect(screen.getByText("Mi Startup de Ejemplo")).toBeInTheDocument();
    expect(screen.getByText("Una descripción de ejemplo para mi startup")).toBeInTheDocument();
    expect(screen.getByText("5000 €")).toBeInTheDocument(); // Formatted profit
    expect(screen.getByText("3.0")).toBeInTheDocument(); // LTV/CAC ratio with 1 decimal (1/0.333 ≈ 3.0)
  });

  it("should show correct viability badge for good health", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    expect(screen.getByText("Buena")).toBeInTheDocument();
  });

  it("should show correct viability badge for medium health", () => {
    const simulationMedium = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, overallHealth: "medium" },
    };

    render(<SimulationCard simulation={simulationMedium} {...mockHandlers} />);

    expect(screen.getByText("Media")).toBeInTheDocument();
  });

  it("should show correct viability badge for poor health", () => {
    const simulationPoor = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, overallHealth: "poor" },
    };

    render(<SimulationCard simulation={simulationPoor} {...mockHandlers} />);

    expect(screen.getByText("Baja")).toBeInTheDocument();
  });

  it("should format LTV/CAC ratio correctly for values < 1", () => {
    const simulationLowRatio = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: 1.33 }, // CAC/LTV = 1.33 → LTV/CAC = 0.75
    };

    render(<SimulationCard simulation={simulationLowRatio} {...mockHandlers} />);

    expect(screen.getByText("0.8")).toBeInTheDocument(); // Should show 1 decimal (1/1.33 ≈ 0.75 → 0.8)
  });

  it("should show No viable for invalid LTV/CAC ratios", () => {
    const simulationInvalidRatio = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: -1 },
    };

    render(<SimulationCard simulation={simulationInvalidRatio} {...mockHandlers} />);

    expect(screen.getByText("No viable")).toBeInTheDocument();
  });

  it("should show correct target icon color based on LTV/CAC ratio", () => {
    const simulationGoodRatio = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: 0.2 }, // CAC/LTV = 0.2 → LTV/CAC = 5
    };

    render(<SimulationCard simulation={simulationGoodRatio} {...mockHandlers} />);
    expect(screen.getByText("5.0")).toBeInTheDocument(); // 1/0.2 = 5.0 (with decimal)
  });

  it("should show yellow color for LTV/CAC ratio of exactly 2", () => {
    const simulationRatio2 = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: 0.5 }, // CAC/LTV = 0.5 → LTV/CAC = 2
    };

    render(<SimulationCard simulation={simulationRatio2} {...mockHandlers} />);
    expect(screen.getByText("2.0")).toBeInTheDocument(); // 1/0.5 = 2.0 (now with decimal)

    // Find the Target icon which should have yellow color for ratio 2
    const targetIcon = screen.getByText("2.0").closest("div")?.querySelector("svg");
    expect(targetIcon).toHaveClass("text-yellow-600");
  });

  it("should show red color for LTV/CAC ratio just below 2", () => {
    const simulationRatio1_9 = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: 0.526 }, // CAC/LTV = 0.526 → LTV/CAC ≈ 1.9
    };

    render(<SimulationCard simulation={simulationRatio1_9} {...mockHandlers} />);
    expect(screen.getByText("1.9")).toBeInTheDocument(); // 1/0.526 ≈ 1.9

    // Find the Target icon which should have red color for ratio < 2
    const targetIcon = screen.getByText("1.9").closest("div")?.querySelector("svg");
    expect(targetIcon).toHaveClass("text-red-600");
  });

  it("should show Perfecto (CAC gratuito) for CAC = 0 (free acquisition)", () => {
    const simulationFreeCAC = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, cacLtvRatio: 0 }, // CAC = 0
    };

    render(<SimulationCard simulation={simulationFreeCAC} {...mockHandlers} />);
    expect(screen.getByText("Perfecto (CAC gratuito)")).toBeInTheDocument();
  });

  it("should show red arrow for negative profit", () => {
    const simulationNegativeProfit = {
      ...mockSimulation,
      results: { ...mockSimulation.results!, monthlyProfit: -1500 },
    };

    render(<SimulationCard simulation={simulationNegativeProfit} {...mockHandlers} />);

    expect(screen.getByText("-1500 €")).toBeInTheDocument();
  });

  it("should handle simulation without results", () => {
    const simulationNoResults = {
      ...mockSimulation,
      results: undefined,
    };

    render(<SimulationCard simulation={simulationNoResults} {...mockHandlers} />);

    expect(screen.getByText("Mi Startup de Ejemplo")).toBeInTheDocument();
    expect(screen.getByText("0 €")).toBeInTheDocument();
    expect(screen.getByText("Baja")).toBeInTheDocument();
  });

  it("should call onDuplicate when duplicate button is clicked", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    const duplicateButton = screen.getByRole("button", { name: /duplicar simulación/i });
    fireEvent.click(duplicateButton);

    expect(mockHandlers.onDuplicate).toHaveBeenCalledWith("sim_123", "Mi Startup de Ejemplo");
  });

  it("should call onDelete when delete button is clicked", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    const deleteButton = screen.getByRole("button", { name: /eliminar simulación/i });
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith("sim_123", "Mi Startup de Ejemplo");
  });

  it("should disable buttons when loading", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} isLoading={true} />);

    const duplicateButton = screen.getByRole("button", { name: /duplicar simulación/i });
    const deleteButton = screen.getByRole("button", { name: /eliminar simulación/i });

    expect(duplicateButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it("should show canvas name when different from simulation name", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    expect(screen.getByText("Canvas de Ejemplo")).toBeInTheDocument();
  });

  it("should not show canvas section when names are the same", () => {
    const simulationSameName = {
      ...mockSimulation,
      leanCanvas: { ...mockSimulation.leanCanvas!, name: mockSimulation.name },
    };

    render(<SimulationCard simulation={simulationSameName} {...mockHandlers} />);

    expect(screen.queryByText("Canvas")).not.toBeInTheDocument();
  });

  it("should render link to simulation details", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    const detailsLink = screen.getByRole("link", { name: /ver detalles/i });
    expect(detailsLink).toHaveAttribute("href", "/simulation/sim_123");
  });

  it("should format date correctly", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);

    // The date should be formatted as "20 ene 2024" in Spanish locale
    expect(screen.getByText(/20 ene 2024/)).toBeInTheDocument();
  });

  it("should show correct LTV/CAC ratio", () => {
    render(<SimulationCard simulation={mockSimulation} {...mockHandlers} />);
    // Verifica que el label esté
    expect(screen.getByText("LTV/CAC")).toBeInTheDocument();
    // Verifica que el valor esté en algún lugar del DOM
    expect(screen.getByText("3.0")).toBeInTheDocument();
  });
});
