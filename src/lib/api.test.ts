import { describe, expect, it } from "vitest";

/**
 * Integration tests for API endpoints
 * These tests use MSW to mock HTTP requests
 */
describe("API Integration Tests", () => {
  describe("Simulations API", () => {
    it("should fetch simulations list", async () => {
      const response = await fetch("/api/simulations");
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name");
    });

    it("should create a new simulation", async () => {
      const newSimulation = {
        name: "Test Simulation",
        leanCanvas: {
          problemSection: "Test problem",
          solutionSection: "Test solution",
        },
      };

      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSimulation),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.name).toBe(newSimulation.name);
    });

    it("should fetch a specific simulation", async () => {
      const simulationId = "test-id";
      const response = await fetch(`/api/simulations/${simulationId}`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.id).toBe(simulationId);
      expect(data).toHaveProperty("leanCanvas");
    });

    it("should update a simulation", async () => {
      const simulationId = "test-id";
      const updateData = {
        name: "Updated Simulation",
      };

      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.name).toBe(updateData.name);
      expect(data).toHaveProperty("updatedAt");
    });

    it("should delete a simulation", async () => {
      const simulationId = "test-id";
      const response = await fetch(`/api/simulations/${simulationId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("message");
    });
  });

  describe("Financial API", () => {
    it("should calculate financial metrics", async () => {
      const financialData = {
        monthlyRevenue: 10000,
        monthlyCosts: 5000,
      };

      const response = await fetch("/api/financial/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(financialData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("revenue");
      expect(data).toHaveProperty("costs");
      expect(data).toHaveProperty("profit");
      expect(data).toHaveProperty("breakEvenUnits");
      expect(data).toHaveProperty("breakEvenMonths");
    });
  });

  describe("Error Handling", () => {
    it("should handle server errors gracefully", async () => {
      const response = await fetch("/api/test/error");
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
    });
  });
});
