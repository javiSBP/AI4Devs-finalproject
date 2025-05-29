"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FinancialData } from "@/app/simulation/page";
import { FINANCIAL_LIMITS } from "@/lib/validation/shared/financial-inputs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EnhancedInfoTooltip from "@/components/ui/enhanced-info-tooltip";
import { FINANCIAL_INPUTS_HELP } from "@/lib/content/financial-inputs-help";

interface FinancialInputsFormProps {
  initialData: FinancialData;
  onSubmit: (data: FinancialData) => void;
}

// Form-specific schema with coercion for string inputs from HTML forms
const FormFinancialInputsSchema = z
  .object({
    averagePrice: z.coerce
      .number()
      .min(0, "El precio medio debe ser mayor o igual a 0")
      .max(
        FINANCIAL_LIMITS.maxPrice,
        `El precio medio no puede exceder ${FINANCIAL_LIMITS.maxPrice} euros`
      )
      .refine((val) => Number.isFinite(val), "El precio medio debe ser un número válido"),

    costPerUnit: z.coerce
      .number()
      .min(0, "El coste por unidad debe ser mayor o igual a 0")
      .max(
        FINANCIAL_LIMITS.maxPrice,
        `El coste por unidad no puede exceder ${FINANCIAL_LIMITS.maxPrice} euros`
      )
      .refine((val) => Number.isFinite(val), "El coste por unidad debe ser un número válido"),

    fixedCosts: z.coerce
      .number()
      .min(0, "Los costes fijos deben ser mayor o igual a 0")
      .max(
        FINANCIAL_LIMITS.maxFixedCosts,
        `Los costes fijos no pueden exceder ${FINANCIAL_LIMITS.maxFixedCosts} euros`
      )
      .refine((val) => Number.isFinite(val), "Los costes fijos deben ser un número válido"),

    customerAcquisitionCost: z.coerce
      .number()
      .min(0, "El CAC debe ser mayor o igual a 0")
      .max(FINANCIAL_LIMITS.maxCAC, `El CAC no puede exceder ${FINANCIAL_LIMITS.maxCAC} euros`)
      .refine((val) => Number.isFinite(val), "El CAC debe ser un número válido"),

    monthlyNewCustomers: z.coerce
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

    averageCustomerLifetime: z.coerce
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
  })
  .superRefine((data, ctx) => {
    // Apply the same business rules as the shared schema
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
  });

const formSchema = FormFinancialInputsSchema;

const FinancialInputsForm: React.FC<FinancialInputsFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Watch for changes and update parent component without triggering validation
  React.useEffect(() => {
    const subscription = form.watch((data) => {
      // Only call onSubmit with valid data, without triggering form validation
      if (data) {
        onSubmit(data as FinancialData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Banner informativo general */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Todos los importes deben ser sin IVA
              </h4>
              <p className="text-xs text-blue-700">
                Para calcular márgenes y viabilidad reales, ingresa precios y costes excluyendo IVA
                (21%). El IVA es dinero &ldquo;de paso&rdquo; que no forma parte de tus ingresos
                netos.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="averagePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.averagePrice.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.averagePrice.description}
                    example={FINANCIAL_INPUTS_HELP.averagePrice.example}
                    tips={FINANCIAL_INPUTS_HELP.averagePrice.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.averagePrice.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="costPerUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.costPerUnit.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.costPerUnit.description}
                    example={FINANCIAL_INPUTS_HELP.costPerUnit.example}
                    tips={FINANCIAL_INPUTS_HELP.costPerUnit.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.costPerUnit.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fixedCosts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.fixedCosts.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.fixedCosts.description}
                    example={FINANCIAL_INPUTS_HELP.fixedCosts.example}
                    tips={FINANCIAL_INPUTS_HELP.fixedCosts.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.fixedCosts.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerAcquisitionCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.customerAcquisitionCost.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.customerAcquisitionCost.description}
                    example={FINANCIAL_INPUTS_HELP.customerAcquisitionCost.example}
                    tips={FINANCIAL_INPUTS_HELP.customerAcquisitionCost.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.customerAcquisitionCost.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="monthlyNewCustomers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.monthlyNewCustomers.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.monthlyNewCustomers.description}
                    example={FINANCIAL_INPUTS_HELP.monthlyNewCustomers.example}
                    tips={FINANCIAL_INPUTS_HELP.monthlyNewCustomers.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.monthlyNewCustomers.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="averageCustomerLifetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {FINANCIAL_INPUTS_HELP.averageCustomerLifetime.label}
                  <EnhancedInfoTooltip
                    content={FINANCIAL_INPUTS_HELP.averageCustomerLifetime.description}
                    example={FINANCIAL_INPUTS_HELP.averageCustomerLifetime.example}
                    tips={FINANCIAL_INPUTS_HELP.averageCustomerLifetime.tips}
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={FINANCIAL_INPUTS_HELP.averageCustomerLifetime.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default FinancialInputsForm;
