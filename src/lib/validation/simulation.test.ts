import { describe, it, expect } from "vitest";
import {
  CreateCompleteSimulationSchema,
  UpdateCompleteSimulationSchema,
  ListSimulationsQuerySchema,
} from "./simulation";

describe("Simulation Validation Schemas", () => {
  describe("CreateCompleteSimulationSchema", () => {
    it("should validate a complete simulation with all required fields", () => {
      const validData = {
        name: "Test Simulation",
        description: "A test simulation",
        leanCanvas: {
          name: "Test Canvas",
          problem: "Test problem",
          solution: "Test solution",
          uniqueValueProposition: "Test UVP",
          customerSegments: "Test segments",
          channels: "Test channels",
          revenueStreams: "Test revenue",
        },
        financialInputs: {
          averagePrice: 100,
          costPerUnit: 50,
          fixedCosts: 1000,
          customerAcquisitionCost: 25,
          monthlyNewCustomers: 10,
          averageCustomerLifetime: 12,
        },
      };

      const result = CreateCompleteSimulationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject simulation with missing name", () => {
      const invalidData = {
        leanCanvas: {
          name: "Test Canvas",
          problem: "Test problem",
          solution: "Test solution",
          uniqueValueProposition: "Test UVP",
          customerSegments: "Test segments",
          channels: "Test channels",
          revenueStreams: "Test revenue",
        },
        financialInputs: {
          averagePrice: 100,
          costPerUnit: 50,
          fixedCosts: 1000,
          customerAcquisitionCost: 25,
          monthlyNewCustomers: 10,
          averageCustomerLifetime: 12,
        },
      };

      const result = CreateCompleteSimulationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject simulation with invalid financial inputs", () => {
      const invalidData = {
        name: "Test Simulation",
        leanCanvas: {
          name: "Test Canvas",
          problem: "Test problem",
          solution: "Test solution",
          uniqueValueProposition: "Test UVP",
          customerSegments: "Test segments",
          channels: "Test channels",
          revenueStreams: "Test revenue",
        },
        financialInputs: {
          averagePrice: -100, // Invalid negative price
          costPerUnit: 50,
          fixedCosts: 1000,
          customerAcquisitionCost: 25,
          monthlyNewCustomers: 10,
          averageCustomerLifetime: 12,
        },
      };

      const result = CreateCompleteSimulationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateCompleteSimulationSchema", () => {
    it("should validate partial updates", () => {
      const validData = {
        name: "Updated Simulation",
        financialInputs: {
          averagePrice: 150,
        },
      };

      const result = UpdateCompleteSimulationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate empty updates", () => {
      const validData = {};

      const result = UpdateCompleteSimulationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("ListSimulationsQuerySchema", () => {
    it("should validate query parameters with defaults", () => {
      const validData = {
        page: "1",
        limit: "10",
        sort: "updatedAt",
        order: "desc",
      };

      const result = ListSimulationsQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sort).toBe("updatedAt");
        expect(result.data.order).toBe("desc");
      }
    });

    it("should apply defaults for missing parameters", () => {
      const validData = {};

      const result = ListSimulationsQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sort).toBe("updatedAt");
        expect(result.data.order).toBe("desc");
      }
    });

    it("should reject invalid sort field", () => {
      const invalidData = {
        sort: "invalidField",
      };

      const result = ListSimulationsQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid page number", () => {
      const invalidData = {
        page: "0",
      };

      const result = ListSimulationsQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
