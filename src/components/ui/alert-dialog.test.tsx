import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AlertDialog } from "./alert-dialog";

describe("AlertDialog", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Test Title",
    description: "Test description",
  };

  it("should render when isOpen is true", () => {
    render(<AlertDialog {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(<AlertDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    render(<AlertDialog {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<AlertDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText("Confirmar"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should use custom button texts", () => {
    render(<AlertDialog {...defaultProps} confirmText="Delete" cancelText="Keep" />);

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Keep")).toBeInTheDocument();
  });

  it("should show default variant styling", () => {
    render(<AlertDialog {...defaultProps} variant="default" />);

    const confirmButton = screen.getByText("Confirmar");
    expect(confirmButton).toHaveClass("bg-primary");
  });

  it("should show destructive variant styling when specified", () => {
    render(<AlertDialog {...defaultProps} variant="destructive" />);

    const confirmButton = screen.getByText("Confirmar");
    expect(confirmButton).toHaveClass("bg-destructive");
  });
});
