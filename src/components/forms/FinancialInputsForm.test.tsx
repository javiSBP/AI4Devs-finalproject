import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FinancialInputsForm from "./FinancialInputsForm";
import { FinancialData } from "@/app/simulation/page";

// Mock the EnhancedInfoTooltip component
vi.mock("@/components/ui/enhanced-info-tooltip", () => ({
  default: ({ content }: { content: string }) => (
    <button data-testid="enhanced-info-tooltip">{content}</button>
  ),
}));

describe("FinancialInputsForm", () => {
  const mockOnSubmit = vi.fn();
  const defaultData: FinancialData = {
    averagePrice: 0,
    costPerUnit: 0,
    fixedCosts: 0,
    customerAcquisitionCost: 0,
    monthlyNewCustomers: 0,
    averageCustomerLifetime: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    // Use more specific selectors to avoid multiple element issues
    expect(
      screen.getByRole("spinbutton", { name: /precio medio por unidad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /coste variable por cliente/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /costes fijos mensuales/i })).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /coste de adquisición de cliente/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /nuevos clientes por mes/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /duración media del cliente/i })
    ).toBeInTheDocument();
  });

  it("renders all input fields with correct types", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    const inputs = screen.getAllByRole("spinbutton"); // number inputs
    expect(inputs).toHaveLength(6); // 6 form fields (removed auxiliary VAT helper field)

    inputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "number");
    });
  });

  it("calls onSubmit when values change", async () => {
    const user = userEvent.setup();

    // Start with valid initial data so validation can pass
    const validInitialData: FinancialData = {
      averagePrice: 10,
      costPerUnit: 5,
      fixedCosts: 1000,
      customerAcquisitionCost: 15,
      monthlyNewCustomers: 5,
      averageCustomerLifetime: 12, // Valid value (>= 0.1)
    };

    render(<FinancialInputsForm initialData={validInitialData} onSubmit={mockOnSubmit} />);

    const priceInput = screen.getByRole("spinbutton", {
      name: /precio medio por unidad\/servicio/i,
    });

    // Clear the field and type a new valid value
    await user.clear(priceInput);
    await user.type(priceInput, "50");

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("initializes with provided initial data", () => {
    const initialData: FinancialData = {
      averagePrice: 100,
      costPerUnit: 50,
      fixedCosts: 1000,
      customerAcquisitionCost: 25,
      monthlyNewCustomers: 10,
      averageCustomerLifetime: 12,
    };

    render(<FinancialInputsForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
  });

  it("shows descriptive placeholders", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText("ej: 29.99")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ej: 12.50")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ej: 2000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ej: 15")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ej: 50")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ej: 12")).toBeInTheDocument();
  });

  it("renders enhanced info tooltips for all fields", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    const tooltips = screen.getAllByTestId("enhanced-info-tooltip");
    expect(tooltips).toHaveLength(6); // One for each field
  });

  it("has responsive layout with grid classes", () => {
    const { container } = render(
      <FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />
    );

    // Check for grid containers (responsive design)
    const gridContainers = container.querySelectorAll(".grid");
    expect(gridContainers.length).toBeGreaterThan(0);

    // Check for responsive grid classes
    const responsiveGrids = container.querySelectorAll(".md\\:grid-cols-2");
    expect(responsiveGrids.length).toBeGreaterThan(0);
  });

  it("shows informative banner about VAT-free amounts", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    // Check for the new informative banner
    expect(screen.getByText(/todos los importes deben ser sin iva/i)).toBeInTheDocument();
    expect(screen.getByText(/para calcular márgenes y viabilidad reales/i)).toBeInTheDocument();
    expect(screen.getByText(/iva \(21%\)/i)).toBeInTheDocument();
  });

  it("renders FormMessage components for validation display", () => {
    render(<FinancialInputsForm initialData={defaultData} onSubmit={mockOnSubmit} />);

    // Verify that the form structure is present
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBe(6);

    // Verify form is using react-hook-form (all inputs should have name attribute now)
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("name");
      expect(input).toHaveAttribute("aria-invalid");
    });
  });

  // Note: Validation behavior tests will be covered by E2E tests with Playwright
  // as they require more complex browser behavior simulation for onBlur events
});
