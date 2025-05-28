"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LeanCanvasData } from "@/types/lean-canvas";
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
import { SharedLeanCanvasSchema, LEAN_CANVAS_LIMITS } from "@/lib/validation/shared/lean-canvas";

interface LeanCanvasFormProps {
  initialData: LeanCanvasData;
  onSubmit: (data: LeanCanvasData) => void;
}

const LeanCanvasForm: React.FC<LeanCanvasFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<LeanCanvasData>({
    resolver: zodResolver(SharedLeanCanvasSchema),
    defaultValues: initialData,
  });

  // Initialize form with initialData only once on mount or when initialData changes
  React.useEffect(() => {
    if (initialData) {
      const currentData = form.getValues();
      const currentDataString = JSON.stringify(currentData);
      const initialDataString = JSON.stringify(initialData);

      // Solo resetear si los datos son realmente diferentes
      if (currentDataString !== initialDataString) {
        form.reset(initialData);
      }
    }
  }, [initialData, form]);

  // Watch for changes and update parent component
  React.useEffect(() => {
    const subscription = form.watch((data) => {
      // Only call onSubmit with valid data, without triggering form validation
      if (data) {
        onSubmit(data as LeanCanvasData);
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
                    maxLength={LEAN_CANVAS_LIMITS.problem}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <span className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.problem} caracteres
                  </span>
                </div>
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
                  <Textarea
                    placeholder="Describe tu solución..."
                    {...field}
                    className="h-32"
                    maxLength={LEAN_CANVAS_LIMITS.solution}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <span className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.solution} caracteres
                  </span>
                </div>
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
                <Textarea
                  placeholder="Define tu propuesta de valor..."
                  {...field}
                  maxLength={LEAN_CANVAS_LIMITS.uniqueValueProposition}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <span className="text-xs text-muted-foreground">
                  {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.uniqueValueProposition} caracteres
                </span>
              </div>
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
                  <Textarea
                    placeholder="Define tus segmentos de cliente..."
                    {...field}
                    maxLength={LEAN_CANVAS_LIMITS.customerSegments}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <span className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.customerSegments} caracteres
                  </span>
                </div>
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
                  <Textarea
                    placeholder="Define tus canales..."
                    {...field}
                    maxLength={LEAN_CANVAS_LIMITS.channels}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <span className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.channels} caracteres
                  </span>
                </div>
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
                  maxLength={LEAN_CANVAS_LIMITS.revenueStreams}
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormMessage />
                <span className="text-xs text-muted-foreground">
                  {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.revenueStreams} caracteres
                </span>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default LeanCanvasForm;
