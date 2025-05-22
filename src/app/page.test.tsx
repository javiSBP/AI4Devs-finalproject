import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  it("renders the title", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { name: /leansim/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/simulador de modelos de negocio/i);
    expect(description).toBeInTheDocument();
  });

  it("renders the action buttons", () => {
    render(<Home />);
    const startButton = screen.getByRole("button", { name: /comenzar/i });
    const learnMoreButton = screen.getByRole("button", {
      name: /aprender más/i,
    });

    expect(startButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();
  });
});
