import { FINANCIAL_INPUTS_HELP, FinancialFieldHelp } from "./financial-inputs-help";

describe("FINANCIAL_INPUTS_HELP", () => {
  const expectedFields = [
    "averagePrice",
    "costPerUnit",
    "fixedCosts",
    "customerAcquisitionCost",
    "monthlyNewCustomers",
    "averageCustomerLifetime",
  ];

  test("contiene todos los campos financieros requeridos", () => {
    expectedFields.forEach((field) => {
      expect(FINANCIAL_INPUTS_HELP[field]).toBeDefined();
    });
  });

  test("cada campo tiene la estructura completa requerida", () => {
    expectedFields.forEach((field) => {
      const fieldHelp: FinancialFieldHelp = FINANCIAL_INPUTS_HELP[field];

      expect(fieldHelp.label).toBeDefined();
      expect(fieldHelp.label.length).toBeGreaterThan(0);

      expect(fieldHelp.description).toBeDefined();
      expect(fieldHelp.description.length).toBeGreaterThan(20);

      expect(fieldHelp.placeholder).toBeDefined();
      expect(fieldHelp.placeholder.length).toBeGreaterThan(0);

      expect(fieldHelp.example).toBeDefined();
      expect(fieldHelp.example.length).toBeGreaterThan(20);

      expect(fieldHelp.tips).toBeDefined();
      expect(Array.isArray(fieldHelp.tips)).toBe(true);
      expect(fieldHelp.tips.length).toBeGreaterThan(0);
    });
  });

  test("los labels terminan con la moneda cuando es aplicable", () => {
    const fieldsWithCurrency = [
      "averagePrice",
      "costPerUnit",
      "fixedCosts",
      "customerAcquisitionCost",
    ];

    fieldsWithCurrency.forEach((field) => {
      expect(FINANCIAL_INPUTS_HELP[field].label).toMatch(/\(€\)$/);
    });
  });

  test("los placeholders tienen formato de ejemplo consistente", () => {
    expectedFields.forEach((field) => {
      const placeholder = FINANCIAL_INPUTS_HELP[field].placeholder;
      expect(placeholder).toMatch(/^ej: /);
    });
  });

  test("las descripciones están en español y son comprensibles", () => {
    expectedFields.forEach((field) => {
      const description = FINANCIAL_INPUTS_HELP[field].description;

      // Verifica que no contienen palabras demasiado técnicas
      expect(description).not.toMatch(/EBITDA|ROI|KPI/i);

      // Verifica que explican el concepto claramente
      expect(description.length).toBeGreaterThan(50);
    });
  });

  test("cada campo tiene al menos 3 tips útiles", () => {
    expectedFields.forEach((field) => {
      const tips = FINANCIAL_INPUTS_HELP[field].tips;
      expect(tips.length).toBeGreaterThanOrEqual(3);

      tips.forEach((tip: string) => {
        expect(tip.length).toBeGreaterThan(10);
      });
    });
  });
});
