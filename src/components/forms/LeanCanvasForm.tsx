"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LeanCanvasData } from "@/app/simulation/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import InfoTooltip from "@/components/ui/info-tooltip";

interface LeanCanvasFormProps {
  initialData: LeanCanvasData;
  onSubmit: (data: LeanCanvasData) => void;
}

const formSchema = z.object({
  problem: z.string(),
  solution: z.string(),
  uniqueValueProposition: z.string(),
  customerSegments: z.string(),
  channels: z.string(),
  revenueStreams: z.string(),
});

const LeanCanvasForm: React.FC<LeanCanvasFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = React.useCallback(
    (data: LeanCanvasData) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  // This is triggered when the next button in the wizard is clicked
  React.useEffect(() => {
    const subscription = form.watch(() => {
      form.handleSubmit(handleSubmit)();
    });
    return () => subscription.unsubscribe();
  }, [form, handleSubmit]);

  return (
    <Form {...form}>
      <form className="space-y-8" onChange={() => form.handleSubmit(handleSubmit)()}>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="problem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Problema
                  <InfoTooltip content="¿Qué problema o necesidad resuelve tu producto o servicio?" />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe el problema que resuelves..."
                    {...field}
                    className="h-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Solución
                  <InfoTooltip content="¿Cómo resuelve tu producto o servicio el problema identificado?" />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe tu solución..." {...field} className="h-32" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="uniqueValueProposition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Propuesta de Valor Única
                <InfoTooltip content="¿Qué hace diferente a tu producto o servicio? ¿Por qué deberían elegirte?" />
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Define tu propuesta de valor..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customerSegments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Segmentos de Cliente
                  <InfoTooltip content="¿Quiénes son tus clientes ideales? Define sus características principales." />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Define tus segmentos de cliente..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Canales
                  <InfoTooltip content="¿Cómo llegas a tus clientes? Canales de distribución, comunicación y venta." />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Define tus canales..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="revenueStreams"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Estructura de Ingresos/Costes
                <InfoTooltip content="¿Cómo vas a ganar dinero? Suscripciones, ventas directas, etc. y principales costes asociados." />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Define tus fuentes de ingresos y estructura de costes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LeanCanvasForm;
