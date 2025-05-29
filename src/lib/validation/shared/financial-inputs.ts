import { z } from "zod";

// Límites y validaciones para campos financieros
export const FINANCIAL_LIMITS = {
  maxPrice: 1000000, // 1M euros máximo
  maxFixedCosts: 10000000, // 10M euros máximo
  maxCAC: 100000, // 100k euros máximo
  maxCustomers: 1000000, // 1M clientes máximo
  maxLifetime: 120, // 10 años máximo
} as const;

// Schema base compartido entre frontend y backend para inputs financieros
export const SharedFinancialInputsSchema = z.object({
  averagePrice: z
    .number()
    .min(0, "El precio medio debe ser mayor o igual a 0")
    .max(
      FINANCIAL_LIMITS.maxPrice,
      `El precio medio no puede exceder ${FINANCIAL_LIMITS.maxPrice} euros`
    )
    .refine((val) => Number.isFinite(val), "El precio medio debe ser un número válido"),

  costPerUnit: z
    .number()
    .min(0, "El coste por unidad debe ser mayor o igual a 0")
    .max(
      FINANCIAL_LIMITS.maxPrice,
      `El coste por unidad no puede exceder ${FINANCIAL_LIMITS.maxPrice} euros`
    )
    .refine((val) => Number.isFinite(val), "El coste por unidad debe ser un número válido"),

  fixedCosts: z
    .number()
    .min(0, "Los costes fijos deben ser mayor o igual a 0")
    .max(
      FINANCIAL_LIMITS.maxFixedCosts,
      `Los costes fijos no pueden exceder ${FINANCIAL_LIMITS.maxFixedCosts} euros`
    )
    .refine((val) => Number.isFinite(val), "Los costes fijos deben ser un número válido"),

  customerAcquisitionCost: z
    .number()
    .min(0, "El CAC debe ser mayor o igual a 0")
    .max(FINANCIAL_LIMITS.maxCAC, `El CAC no puede exceder ${FINANCIAL_LIMITS.maxCAC} euros`)
    .refine((val) => Number.isFinite(val), "El CAC debe ser un número válido"),

  monthlyNewCustomers: z
    .number()
    .min(0, "Los nuevos clientes mensuales deben ser mayor o igual a 0")
    .max(
      FINANCIAL_LIMITS.maxCustomers,
      `Los nuevos clientes mensuales no pueden exceder ${FINANCIAL_LIMITS.maxCustomers}`
    )
    .refine(
      (val) => Number.isFinite(val),
      "Los nuevos clientes mensuales deben ser un número válido"
    ),

  averageCustomerLifetime: z
    .number()
    .min(0.1, "La duración media del cliente debe ser mayor a 0")
    .max(
      FINANCIAL_LIMITS.maxLifetime,
      `La duración media del cliente no puede exceder ${FINANCIAL_LIMITS.maxLifetime} meses`
    )
    .refine(
      (val) => Number.isFinite(val),
      "La duración media del cliente debe ser un número válido"
    ),
});

// Validaciones adicionales lógicas entre campos
export const FinancialInputsBusinessRulesSchema = SharedFinancialInputsSchema.superRefine(
  (data, ctx) => {
    // El coste por unidad no puede ser mayor que el precio medio
    if (data.costPerUnit >= data.averagePrice && data.averagePrice > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El coste por unidad no puede ser mayor o igual al precio medio",
        path: ["costPerUnit"],
      });
    }

    // Validar que el margen unitario sea razonable (al menos 5% del precio)
    if (data.averagePrice > 0 && data.costPerUnit > 0) {
      const margin = data.averagePrice - data.costPerUnit;
      const marginPercentage = (margin / data.averagePrice) * 100;

      if (marginPercentage < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "El margen unitario parece muy bajo (menos del 5%). Revisa tus precios y costes.",
          path: ["costPerUnit"],
        });
      }
    }

    // Validar ratio CAC/LTV básico
    if (
      data.averagePrice > 0 &&
      data.costPerUnit > 0 &&
      data.customerAcquisitionCost > 0 &&
      data.averageCustomerLifetime > 0
    ) {
      const ltv = (data.averagePrice - data.costPerUnit) * data.averageCustomerLifetime;
      const cacLtvRatio = data.customerAcquisitionCost / ltv;

      if (cacLtvRatio > 0.5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "El CAC parece muy alto comparado con el LTV. Considera reducir costes de adquisición o aumentar el valor del cliente.",
          path: ["customerAcquisitionCost"],
        });
      }
    }
  }
);

// Esquemas derivados para diferentes casos de uso
export const SharedFinancialInputsUpdateSchema = SharedFinancialInputsSchema.partial();

// Tipos TypeScript exportados
export type SharedFinancialInputsInput = z.infer<typeof SharedFinancialInputsSchema>;
export type SharedFinancialInputsUpdateInput = z.infer<typeof SharedFinancialInputsUpdateSchema>;
