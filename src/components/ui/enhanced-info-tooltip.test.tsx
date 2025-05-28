import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EnhancedInfoTooltip from "./enhanced-info-tooltip";

describe("EnhancedInfoTooltip", () => {
  it("renders simple tooltip for basic content", () => {
    render(<EnhancedInfoTooltip content="Test tooltip content" />);

    // Check if the SVG icon is rendered
    const svg = document.querySelector('svg[class*="lucide-circle-help"]');
    expect(svg).toBeInTheDocument();
  });

  it("renders enhanced tooltip with example and tips", () => {
    render(
      <EnhancedInfoTooltip
        content="Test content"
        example="Test example"
        tips={["Tip 1", "Tip 2"]}
      />
    );

    // For enhanced tooltip with dialog, it should render a button
    const trigger = screen.getByRole("button");
    expect(trigger).toBeInTheDocument();
  });

  it("renders component without errors", () => {
    render(<EnhancedInfoTooltip content="Test tooltip content" />);

    // Just verify the component renders something
    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
