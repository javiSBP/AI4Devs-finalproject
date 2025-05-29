"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FinancialData } from "@/app/simulation/page";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InfoTooltip from "@/components/ui/info-tooltip";

interface FinancialInputsFormProps {
  initialData: FinancialData;
  onSubmit: (data: FinancialData) => void;
}

const formSchema = z.object({
  averagePrice: z.coerce.number().min(0),
  costPerUnit: z.coerce.number().min(0),
  fixedCosts: z.coerce.number().min(0),
  customerAcquisitionCost: z.coerce.number().min(0),
  monthlyNewCustomers: z.coerce.number().min(0),
  averageCustomerLifetime: z.coerce.number().min(0),
});

const FinancialInputsForm: React.FC<FinancialInputsFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="averagePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Precio medio por unidad/servicio (€)
                  <InfoTooltip content="Precio medio que pagaría un cliente por tu producto o servicio." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>Ingresa el precio sin IVA.</FormDescription>
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
                  Coste variable por cliente (€)
                  <InfoTooltip content="Coste directo para producir una unidad o prestar un servicio a un cliente, excluyendo costes fijos." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                  Costes fijos mensuales (€)
                  <InfoTooltip content="Gastos que no varían con el volumen de ventas: alquiler, salarios, suministros, etc." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                  Coste de adquisición de cliente - CAC (€)
                  <InfoTooltip content="Cuánto cuesta conseguir un nuevo cliente (marketing, ventas, etc)." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                  Nuevos clientes por mes
                  <InfoTooltip content="Número estimado de nuevos clientes que conseguirás cada mes." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                  Duración media del cliente (meses)
                  <InfoTooltip content="Durante cuántos meses un cliente típico seguirá comprando tu producto o servicio." />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
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
