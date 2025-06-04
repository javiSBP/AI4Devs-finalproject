"use client";

import React, { forwardRef, useImperativeHandle } from "react";
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

export interface FinancialInputsFormRef {
  validate: () => Promise<boolean>;
}

// Form-specific schema with coercion for string inputs from HTML forms
const FormFinancialInputsSchema = z.object({
  averagePrice: z.coerce
    .number()
    .min(0.01, "El precio medio debe ser mayor que 0")
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
    .min(1, "Debe haber al menos 1 nuevo cliente mensual para simular un negocio")
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
});

const formSchema = FormFinancialInputsSchema;

const FinancialInputsForm = forwardRef<FinancialInputsFormRef, FinancialInputsFormProps>(
  ({ initialData, onSubmit }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData,
      mode: "onBlur",
      reValidateMode: "onChange",
    });

    // Watch for changes and update parent component with validated data
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        // Only call onSubmit with valid, parsed data
        if (data) {
          try {
            // Parse and validate the data through the schema to ensure proper type conversion
            const validatedData = FormFinancialInputsSchema.parse(data);
            onSubmit(validatedData as FinancialData);
          } catch (error) {
            // If validation fails, don't call onSubmit - let the form show the errors
            console.debug("Form data validation failed:", error);
          }
        }
      });
      return () => subscription.unsubscribe();
    }, [form, onSubmit]);

    // Expose validation function to parent component
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const result = await form.trigger();
        return result;
      },
    }));

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
                  Para calcular márgenes y viabilidad reales, ingresa precios y costes excluyendo
                  IVA (21%). El IVA es dinero &ldquo;de paso&rdquo; que no forma parte de tus
                  ingresos netos.
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
                      value={field.value === 0 ? "" : field.value}
                      onFocus={(e) => e.target.select()}
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
  }
);

FinancialInputsForm.displayName = "FinancialInputsForm";

export default FinancialInputsForm;
