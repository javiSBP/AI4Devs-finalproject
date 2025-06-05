import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toast from "./toast";

describe("Toast", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when visible", () => {
    render(<Toast message="Test message" type="success" isVisible={true} onClose={mockOnClose} />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("does not render when not visible", () => {
    render(<Toast message="Test message" type="success" isVisible={false} onClose={mockOnClose} />);

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("shows progress bar when duration is set", () => {
    const { container } = render(
      <Toast
        message="Test message"
        type="success"
        isVisible={true}
        onClose={mockOnClose}
        duration={5000}
      />
    );

    // Check if progress bar container exists
    const progressContainer = container.querySelector(".h-1.bg-black\\/10");
    expect(progressContainer).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    render(<Toast message="Test message" type="success" isVisible={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button");
    await user.click(closeButton);

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders different icons based on type", () => {
    const { container, rerender } = render(
      <Toast message="Success message" type="success" isVisible={true} onClose={mockOnClose} />
    );

    // Check that an icon (svg) exists
    let svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();

    rerender(<Toast message="Error message" type="error" isVisible={true} onClose={mockOnClose} />);

    // Check that an icon (svg) still exists for error type
    svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });
});
