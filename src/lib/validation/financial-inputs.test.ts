import { describe, it, expect } from "vitest";
import {
  FinancialInputsSchema,
  FinancialInputsUpdateSchema,
  FinancialInputsWithBusinessRulesSchema,
  CreateSimulationSchema,
  UpdateSimulationSchema,
  DeviceIdSchema,
  ListSimulationsQuerySchema,
} from "./financial-inputs";

describe("FinancialInputsSchema", () => {
  const validData = {
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 10,
    averageCustomerLifetime: 12,
  };

  it("should validate correct financial data", () => {
    const result = FinancialInputsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid data", () => {
    const invalidData = { ...validData, averagePrice: -1 };
    const result = FinancialInputsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // New tests for enhanced validation
  describe("Enhanced Validation Rules", () => {
    it("should reject averagePrice of 0 (must be > 0)", () => {
      const zeroPrice = { ...validData, averagePrice: 0 };
      const result = FinancialInputsSchema.safeParse(zeroPrice);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("El precio medio debe ser mayor que 0");
    });

    it("should accept minimum averagePrice of 0.01", () => {
      const minPrice = { ...validData, averagePrice: 0.01 };
      const result = FinancialInputsSchema.safeParse(minPrice);
      expect(result.success).toBe(true);
    });

    it("should reject averagePrice below 0.01", () => {
      const belowMin = { ...validData, averagePrice: 0.005 };
      const result = FinancialInputsSchema.safeParse(belowMin);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("El precio medio debe ser mayor que 0");
    });

    it("should reject monthlyNewCustomers of 0 (must be >= 1)", () => {
      const zeroCustomers = { ...validData, monthlyNewCustomers: 0 };
      const result = FinancialInputsSchema.safeParse(zeroCustomers);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain(
        "Debe haber al menos 1 cliente nuevo por mes"
      );
    });

    it("should accept minimum monthlyNewCustomers of 1", () => {
      const minCustomers = { ...validData, monthlyNewCustomers: 1 };
      const result = FinancialInputsSchema.safeParse(minCustomers);
      expect(result.success).toBe(true);
    });

    it("should reject negative monthlyNewCustomers", () => {
      const negativeCustomers = { ...validData, monthlyNewCustomers: -1 };
      const result = FinancialInputsSchema.safeParse(negativeCustomers);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain(
        "Debe haber al menos 1 cliente nuevo por mes"
      );
    });

    it("should allow CAC = 0 (free acquisition)", () => {
      const freeCAC = { ...validData, customerAcquisitionCost: 0 };
      const result = FinancialInputsSchema.safeParse(freeCAC);
      expect(result.success).toBe(true);
    });

    it("should allow fixedCosts = 0 (no fixed costs)", () => {
      const noFixedCosts = { ...validData, fixedCosts: 0 };
      const result = FinancialInputsSchema.safeParse(noFixedCosts);
      expect(result.success).toBe(true);
    });

    it("should allow costPerUnit = 0 (free product)", () => {
      const freeCost = { ...validData, costPerUnit: 0 };
      const result = FinancialInputsSchema.safeParse(freeCost);
      expect(result.success).toBe(true);
    });

    it("should validate business edge case: very small but valid values", () => {
      const edgeCase = {
        averagePrice: 0.01, // Minimum price
        costPerUnit: 0.005, // Half the price
        fixedCosts: 1, // Minimum fixed costs
        customerAcquisitionCost: 0, // Free acquisition
        monthlyNewCustomers: 1, // Minimum customers
        averageCustomerLifetime: 0.1, // Very short lifetime
      };
      const result = FinancialInputsSchema.safeParse(edgeCase);
      expect(result.success).toBe(true);
    });

    it("should handle decimal values correctly", () => {
      const decimalValues = {
        averagePrice: 19.99,
        costPerUnit: 8.75,
        fixedCosts: 1250.5,
        customerAcquisitionCost: 15.25,
        monthlyNewCustomers: 25,
        averageCustomerLifetime: 18.5,
      };
      const result = FinancialInputsSchema.safeParse(decimalValues);
      expect(result.success).toBe(true);
    });
  });
});

describe("FinancialInputsUpdateSchema", () => {
  it("should allow partial updates", () => {
    const partialData = { averagePrice: 150 };
    const result = FinancialInputsUpdateSchema.safeParse(partialData);
    expect(result.success).toBe(true);
  });

  it("should allow empty object", () => {
    const result = FinancialInputsUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("FinancialInputsWithBusinessRulesSchema", () => {
  const validData = {
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 10,
    averageCustomerLifetime: 12,
  };

  it("should validate data with business rules", () => {
    const result = FinancialInputsWithBusinessRulesSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject data violating business rules", () => {
    const invalidData = { ...validData, costPerUnit: 100 }; // Equal to price
    const result = FinancialInputsWithBusinessRulesSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("CreateSimulationSchema", () => {
  const validData = {
    name: "Test Simulation",
    description: "A test simulation",
    averagePrice: 100,
    costPerUnit: 50,
  };

  it("should validate complete simulation data", () => {
    const result = CreateSimulationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require name", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name: _name, ...dataWithoutName } = validData;
    const result = CreateSimulationSchema.safeParse(dataWithoutName);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].path).toEqual(["name"]);
  });

  it("should validate name length", () => {
    const shortName = { ...validData, name: "ab" };
    const result = CreateSimulationSchema.safeParse(shortName);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("al menos 3 caracteres");
  });

  it("should validate name maximum length", () => {
    const longName = { ...validData, name: "a".repeat(51) };
    const result = CreateSimulationSchema.safeParse(longName);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("no puede exceder 50 caracteres");
  });

  it("should trim name", () => {
    const nameWithSpaces = { ...validData, name: "  Test Simulation  " };
    const result = CreateSimulationSchema.safeParse(nameWithSpaces);
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Test Simulation");
  });

  it("should allow optional description", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { description: _description, ...dataWithoutDescription } = validData;
    const result = CreateSimulationSchema.safeParse(dataWithoutDescription);
    expect(result.success).toBe(true);
  });

  it("should validate description length", () => {
    const longDescription = { ...validData, description: "a".repeat(151) };
    const result = CreateSimulationSchema.safeParse(longDescription);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("no puede exceder 150 caracteres");
  });

  it("should allow optional leanCanvasId", () => {
    const withLeanCanvas = { ...validData, leanCanvasId: "clxyz123456789" };
    const result = CreateSimulationSchema.safeParse(withLeanCanvas);
    expect(result.success).toBe(true);
  });

  it("should validate leanCanvasId format", () => {
    const invalidId = { ...validData, leanCanvasId: "invalid-id" };
    const result = CreateSimulationSchema.safeParse(invalidId);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("ID de Lean Canvas inválido");
  });

  it("should allow partial financial data", () => {
    const partialFinancial = {
      name: "Test Simulation",
      averagePrice: 100,
      // Missing other financial fields
    };
    const result = CreateSimulationSchema.safeParse(partialFinancial);
    expect(result.success).toBe(true);
  });
});

describe("UpdateSimulationSchema", () => {
  it("should allow partial updates", () => {
    const partialData = { name: "Updated Simulation" };
    const result = UpdateSimulationSchema.safeParse(partialData);
    expect(result.success).toBe(true);
  });

  it("should allow empty object", () => {
    const result = UpdateSimulationSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should validate provided fields", () => {
    const invalidName = { name: "ab" }; // Too short
    const result = UpdateSimulationSchema.safeParse(invalidName);
    expect(result.success).toBe(false);
  });

  it("should validate financial fields when provided", () => {
    const invalidFinancial = { averagePrice: -1 };
    const result = UpdateSimulationSchema.safeParse(invalidFinancial);
    expect(result.success).toBe(false);
  });
});

describe("DeviceIdSchema", () => {
  it("should validate correct device IDs", () => {
    const validIds = [
      "device123",
      "user-device-456",
      "abc123XYZ",
      "device_id_123",
      "device.id.123",
      "device+id+123",
      "device=id=123",
      "device/id/123",
      "device-id-123",
    ];

    validIds.forEach((id) => {
      const result = DeviceIdSchema.safeParse(id);
      expect(result.success).toBe(true);
    });
  });

  it("should reject empty device ID", () => {
    const result = DeviceIdSchema.safeParse("");
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("Device ID es requerido");
  });

  it("should reject device ID that's too long", () => {
    const longId = "a".repeat(101);
    const result = DeviceIdSchema.safeParse(longId);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("Device ID inválido");
  });

  it("should reject device IDs with invalid characters", () => {
    const invalidIds = ["device@123", "device#123", "device%123", "device 123"];

    invalidIds.forEach((id) => {
      const result = DeviceIdSchema.safeParse(id);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("caracteres inválidos");
    });
  });
});

describe("ListSimulationsQuerySchema", () => {
  it("should use default values for missing parameters", () => {
    const result = ListSimulationsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 1,
      limit: 10,
      sort: "updatedAt",
      order: "desc",
    });
  });

  it("should parse string parameters correctly", () => {
    const queryParams = {
      page: "2",
      limit: "20",
      sort: "name",
      order: "asc",
    };
    const result = ListSimulationsQuerySchema.safeParse(queryParams);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 2,
      limit: 20,
      sort: "name",
      order: "asc",
    });
  });

  it("should handle null values", () => {
    const queryParams = {
      page: null,
      limit: null,
      sort: null,
      order: null,
    };
    const result = ListSimulationsQuerySchema.safeParse(queryParams);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 1,
      limit: 10,
      sort: "updatedAt",
      order: "desc",
    });
  });

  it("should validate page number", () => {
    const invalidPage = { page: "0" };
    const result = ListSimulationsQuerySchema.safeParse(invalidPage);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("mayor a 0");
  });

  it("should validate limit range", () => {
    const invalidLimit = { limit: "51" };
    const result = ListSimulationsQuerySchema.safeParse(invalidLimit);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("entre 1 y 50");

    const zeroLimit = { limit: "0" };
    const result2 = ListSimulationsQuerySchema.safeParse(zeroLimit);
    expect(result2.success).toBe(false);
  });

  it("should validate sort field", () => {
    const invalidSort = { sort: "invalidField" };
    const result = ListSimulationsQuerySchema.safeParse(invalidSort);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("ordenamiento inválido");
  });

  it("should validate order direction", () => {
    const invalidOrder = { order: "invalid" };
    const result = ListSimulationsQuerySchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain("Orden inválido");
  });

  it("should accept valid sort fields", () => {
    const validSorts = ["createdAt", "updatedAt", "name", "averagePrice"];

    validSorts.forEach((sort) => {
      const result = ListSimulationsQuerySchema.safeParse({ sort });
      expect(result.success).toBe(true);
      expect(result.data?.sort).toBe(sort);
    });
  });

  it("should accept valid order directions", () => {
    const validOrders = ["asc", "desc"];

    validOrders.forEach((order) => {
      const result = ListSimulationsQuerySchema.safeParse({ order });
      expect(result.success).toBe(true);
      expect(result.data?.order).toBe(order);
    });
  });
});
