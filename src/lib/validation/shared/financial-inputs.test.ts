import { describe, it, expect } from "vitest";
import {
  SharedFinancialInputsSchema,
  SharedFinancialInputsUpdateSchema,
  FinancialInputsBusinessRulesSchema,
  FINANCIAL_LIMITS,
} from "./financial-inputs";

describe("SharedFinancialInputsSchema", () => {
  const validData = {
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 10,
    averageCustomerLifetime: 12,
  };

  describe("Valid inputs", () => {
    it("should validate correct financial data", () => {
      const result = SharedFinancialInputsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept zero values for allowed fields only", () => {
      const zeroData = {
        averagePrice: 0.01, // Minimum allowed
        costPerUnit: 0, // Allowed
        fixedCosts: 0, // Allowed
        customerAcquisitionCost: 0, // Allowed
        monthlyNewCustomers: 1, // Minimum allowed
        averageCustomerLifetime: 0.1, // Minimum allowed
      };
      const result = SharedFinancialInputsSchema.safeParse(zeroData);
      expect(result.success).toBe(true);
    });

    it("should reject zero values for restricted fields", () => {
      const zeroPrice = {
        averagePrice: 0, // Not allowed
        costPerUnit: 0,
        fixedCosts: 0,
        customerAcquisitionCost: 0,
        monthlyNewCustomers: 1,
        averageCustomerLifetime: 0.1,
      };
      const result1 = SharedFinancialInputsSchema.safeParse(zeroPrice);
      expect(result1.success).toBe(false);
      expect(result1.error?.errors[0].message).toContain("mayor que 0");

      const zeroCustomers = {
        averagePrice: 0.01,
        costPerUnit: 0,
        fixedCosts: 0,
        customerAcquisitionCost: 0,
        monthlyNewCustomers: 0, // Not allowed
        averageCustomerLifetime: 0.1,
      };
      const result2 = SharedFinancialInputsSchema.safeParse(zeroCustomers);
      expect(result2.success).toBe(false);
      expect(result2.error?.errors[0].message).toContain("al menos 1 cliente");
    });

    it("should accept maximum allowed values", () => {
      const maxData = {
        averagePrice: FINANCIAL_LIMITS.maxPrice,
        costPerUnit: FINANCIAL_LIMITS.maxPrice,
        fixedCosts: FINANCIAL_LIMITS.maxFixedCosts,
        customerAcquisitionCost: FINANCIAL_LIMITS.maxCAC,
        monthlyNewCustomers: FINANCIAL_LIMITS.maxCustomers,
        averageCustomerLifetime: FINANCIAL_LIMITS.maxLifetime,
      };
      const result = SharedFinancialInputsSchema.safeParse(maxData);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid inputs", () => {
    it("should reject negative values", () => {
      const negativeData = { ...validData, averagePrice: -1 };
      const result = SharedFinancialInputsSchema.safeParse(negativeData);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("mayor que 0");
    });

    it("should reject values exceeding maximum limits", () => {
      const exceedingData = { ...validData, averagePrice: FINANCIAL_LIMITS.maxPrice + 1 };
      const result = SharedFinancialInputsSchema.safeParse(exceedingData);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("no puede exceder");
    });

    it("should reject invalid number types", () => {
      const invalidData = { ...validData, averagePrice: "not a number" };
      const result = SharedFinancialInputsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject Infinity values", () => {
      const infinityData = { ...validData, averagePrice: Infinity };
      const result = SharedFinancialInputsSchema.safeParse(infinityData);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("no puede exceder");
    });

    it("should reject NaN values", () => {
      const nanData = { ...validData, averagePrice: NaN };
      const result = SharedFinancialInputsSchema.safeParse(nanData);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("Expected number, received nan");
    });

    it("should reject zero or negative customer lifetime", () => {
      const zeroLifetimeData = { ...validData, averageCustomerLifetime: 0 };
      const result = SharedFinancialInputsSchema.safeParse(zeroLifetimeData);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("mayor a 0");
    });

    it("should reject missing required fields", () => {
      const incompleteData = { averagePrice: 100 };
      const result = SharedFinancialInputsSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
      expect(result.error?.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Field-specific validations", () => {
    it("should validate averagePrice limits", () => {
      const invalidPrice = { ...validData, averagePrice: FINANCIAL_LIMITS.maxPrice + 1 };
      const result = SharedFinancialInputsSchema.safeParse(invalidPrice);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["averagePrice"]);
    });

    it("should validate costPerUnit limits", () => {
      const invalidCost = { ...validData, costPerUnit: FINANCIAL_LIMITS.maxPrice + 1 };
      const result = SharedFinancialInputsSchema.safeParse(invalidCost);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["costPerUnit"]);
    });

    it("should validate fixedCosts limits", () => {
      const invalidFixed = { ...validData, fixedCosts: FINANCIAL_LIMITS.maxFixedCosts + 1 };
      const result = SharedFinancialInputsSchema.safeParse(invalidFixed);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["fixedCosts"]);
    });

    it("should validate customerAcquisitionCost limits", () => {
      const invalidCAC = { ...validData, customerAcquisitionCost: FINANCIAL_LIMITS.maxCAC + 1 };
      const result = SharedFinancialInputsSchema.safeParse(invalidCAC);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["customerAcquisitionCost"]);
    });

    it("should validate monthlyNewCustomers limits", () => {
      const invalidCustomers = {
        ...validData,
        monthlyNewCustomers: FINANCIAL_LIMITS.maxCustomers + 1,
      };
      const result = SharedFinancialInputsSchema.safeParse(invalidCustomers);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["monthlyNewCustomers"]);
    });

    it("should validate averageCustomerLifetime limits", () => {
      const invalidLifetime = {
        ...validData,
        averageCustomerLifetime: FINANCIAL_LIMITS.maxLifetime + 1,
      };
      const result = SharedFinancialInputsSchema.safeParse(invalidLifetime);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toEqual(["averageCustomerLifetime"]);
    });
  });
});

describe("SharedFinancialInputsUpdateSchema", () => {
  it("should allow partial updates", () => {
    const partialData = { averagePrice: 150 };
    const result = SharedFinancialInputsUpdateSchema.safeParse(partialData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(partialData);
  });

  it("should allow empty object", () => {
    const result = SharedFinancialInputsUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
    expect(result.data).toEqual({});
  });

  it("should validate provided fields", () => {
    const invalidPartial = { averagePrice: -1 };
    const result = SharedFinancialInputsUpdateSchema.safeParse(invalidPartial);
    expect(result.success).toBe(false);
  });
});

describe("FinancialInputsBusinessRulesSchema", () => {
  const validData = {
    averagePrice: 100,
    costPerUnit: 50,
    fixedCosts: 1000,
    customerAcquisitionCost: 25,
    monthlyNewCustomers: 10,
    averageCustomerLifetime: 12,
  };

  describe("Cost vs Price validation", () => {
    it("should pass when cost is less than price", () => {
      const result = FinancialInputsBusinessRulesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should fail when cost equals price", () => {
      const equalCostPrice = { ...validData, costPerUnit: 100 };
      const result = FinancialInputsBusinessRulesSchema.safeParse(equalCostPrice);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("no puede ser mayor o igual");
      expect(result.error?.errors[0].path).toEqual(["costPerUnit"]);
    });

    it("should fail when cost is greater than price", () => {
      const higherCost = { ...validData, costPerUnit: 150 };
      const result = FinancialInputsBusinessRulesSchema.safeParse(higherCost);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("no puede ser mayor o igual");
    });

    it("should skip cost vs price validation when cost is zero", () => {
      const zeroCost = { ...validData, costPerUnit: 0 };
      const result = FinancialInputsBusinessRulesSchema.safeParse(zeroCost);
      expect(result.success).toBe(true);
    });
  });

  describe("Margin validation", () => {
    it("should warn about low margins (less than 5%)", () => {
      const lowMargin = { ...validData, averagePrice: 100, costPerUnit: 96 }; // 4% margin
      const result = FinancialInputsBusinessRulesSchema.safeParse(lowMargin);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("margen unitario parece muy bajo");
      expect(result.error?.errors[0].path).toEqual(["costPerUnit"]);
    });

    it("should pass with good margins (5% or more)", () => {
      const goodMargin = { ...validData, averagePrice: 100, costPerUnit: 95 }; // 5% margin
      const result = FinancialInputsBusinessRulesSchema.safeParse(goodMargin);
      expect(result.success).toBe(true);
    });

    it("should skip margin validation when cost is zero", () => {
      const zeroCost = { ...validData, averagePrice: 100, costPerUnit: 0 };
      const result = FinancialInputsBusinessRulesSchema.safeParse(zeroCost);
      expect(result.success).toBe(true);
    });
  });

  describe("CAC/LTV ratio validation", () => {
    it("should pass with good CAC/LTV ratio (less than 0.5)", () => {
      // LTV = (100 - 50) * 12 = 600, CAC = 25, ratio = 25/600 = 0.042
      const result = FinancialInputsBusinessRulesSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should warn about high CAC/LTV ratio (greater than 0.5)", () => {
      const highCAC = { ...validData, customerAcquisitionCost: 400 }; // CAC/LTV = 400/600 = 0.67
      const result = FinancialInputsBusinessRulesSchema.safeParse(highCAC);
      expect(result.success).toBe(false);
      expect(result.error?.errors[0].message).toContain("CAC parece muy alto");
      expect(result.error?.errors[0].path).toEqual(["customerAcquisitionCost"]);
    });

    it("should skip CAC/LTV validation when cost or CAC is zero", () => {
      const zeroCost = { ...validData, costPerUnit: 0 };
      const result = FinancialInputsBusinessRulesSchema.safeParse(zeroCost);
      expect(result.success).toBe(true);

      const zeroCAC = { ...validData, customerAcquisitionCost: 0 };
      const result2 = FinancialInputsBusinessRulesSchema.safeParse(zeroCAC);
      expect(result2.success).toBe(true);
    });
  });

  describe("Multiple validation errors", () => {
    it("should report multiple business rule violations", () => {
      const multipleErrors = {
        averagePrice: 100,
        costPerUnit: 100, // Equal to price
        fixedCosts: 1000,
        customerAcquisitionCost: 400, // High CAC
        monthlyNewCustomers: 10,
        averageCustomerLifetime: 12,
      };
      const result = FinancialInputsBusinessRulesSchema.safeParse(multipleErrors);
      expect(result.success).toBe(false);
      expect(result.error?.errors.length).toBeGreaterThan(1);
    });
  });
});
