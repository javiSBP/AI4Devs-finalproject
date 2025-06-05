import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LTVCACDonut, BreakEvenProgress } from "./MetricVisualizations";

describe("LTVCACDonut", () => {
  it("should handle CAC = 0 (free customer acquisition)", () => {
    render(<LTVCACDonut ltvCacRatio={0} />);

    // Should show 100% LTV, 0% CAC
    expect(screen.getByText("LTV 100%")).toBeInTheDocument();
    expect(screen.getByText("CAC 0%")).toBeInTheDocument();
  });

  it("should handle infinite LTV/CAC ratio", () => {
    render(<LTVCACDonut ltvCacRatio={Infinity} />);

    // Should show 0% LTV, 100% CAC (unsustainable)
    expect(screen.getByText("LTV 0%")).toBeInTheDocument();
    expect(screen.getByText("CAC 100%")).toBeInTheDocument();
  });

  it("should handle NaN LTV/CAC ratio", () => {
    render(<LTVCACDonut ltvCacRatio={NaN} />);

    // Should treat as infinite/unsustainable
    expect(screen.getByText("LTV 0%")).toBeInTheDocument();
    expect(screen.getByText("CAC 100%")).toBeInTheDocument();
  });

  it("should handle normal LTV/CAC ratio", () => {
    // LTV/CAC = 3:1 → ltvCacRatio = 1/3 = 0.333
    render(<LTVCACDonut ltvCacRatio={0.333} />);

    // Should show calculated percentages
    expect(screen.getByText(/LTV \d+\.\d%/)).toBeInTheDocument();
    expect(screen.getByText(/CAC \d+\.\d%/)).toBeInTheDocument();
  });
});

describe("BreakEvenProgress", () => {
  it("should show 100% progress when already at break-even (breakEvenRevenue = 0)", () => {
    render(<BreakEvenProgress currentRevenue={5000} breakEvenRevenue={0} />);

    // Should show 100% progress and "Ya en equilibrio"
    expect(screen.getByText("100.0%")).toBeInTheDocument();
    expect(screen.getByText("Ya en equilibrio")).toBeInTheDocument();
  });

  it("should calculate normal progress correctly", () => {
    render(<BreakEvenProgress currentRevenue={3000} breakEvenRevenue={6000} />);

    // Should show 50% progress - using the actual format without comma for 4-digit numbers
    expect(screen.getByText("50.0%")).toBeInTheDocument();
    expect(screen.getByText("6000€")).toBeInTheDocument();
  });

  it("should handle progress over 100%", () => {
    render(<BreakEvenProgress currentRevenue={8000} breakEvenRevenue={5000} />);

    // Should cap at 100%
    expect(screen.getByText("100.0%")).toBeInTheDocument();
  });

  it("should handle invalid currentRevenue", () => {
    render(<BreakEvenProgress currentRevenue={NaN} breakEvenRevenue={6000} />);

    // Should treat current revenue as 0
    expect(screen.getByText("0.0%")).toBeInTheDocument();
    expect(screen.getByText("0€")).toBeInTheDocument();
  });

  it("should handle impossible break-even (Infinity)", () => {
    render(<BreakEvenProgress currentRevenue={5000} breakEvenRevenue={Infinity} />);

    // When breakEvenRevenue is Infinity, should show impossible state
    expect(screen.getByText("Imposible")).toBeInTheDocument();
    expect(screen.getByText("Imposible alcanzar")).toBeInTheDocument();
  });

  it("should handle invalid breakEvenRevenue (NaN treated as impossible)", () => {
    render(<BreakEvenProgress currentRevenue={5000} breakEvenRevenue={NaN} />);

    // When breakEvenRevenue is NaN, it's treated as impossible
    expect(screen.getByText("Imposible")).toBeInTheDocument();
    expect(screen.getByText("Imposible alcanzar")).toBeInTheDocument();
  });

  it("should show impossible for negative breakEvenRevenue", () => {
    render(<BreakEvenProgress currentRevenue={5000} breakEvenRevenue={-100} />);

    // When breakEvenRevenue is negative, should show impossible
    expect(screen.getByText("Imposible")).toBeInTheDocument();
    expect(screen.getByText("Imposible alcanzar")).toBeInTheDocument();
  });
});
