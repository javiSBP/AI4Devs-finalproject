import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with primary variant", () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole("button", { name: /primary button/i });
    expect(button).toHaveClass("bg-blue-600");
  });

  it("renders with loading state", () => {
    render(<Button isLoading>Loading Button</Button>);
    const button = screen.getByRole("button", { name: /loading button/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("renders as full width", () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const button = screen.getByRole("button", { name: /full width button/i });
    expect(button).toHaveClass("w-full");
  });
});
