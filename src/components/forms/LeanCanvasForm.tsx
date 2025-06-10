"use client";

import React, { forwardRef, useImperativeHandle } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EnhancedInfoTooltip from "@/components/ui/enhanced-info-tooltip";
import {
  FirstStepSchema,
  LEAN_CANVAS_LIMITS,
  SIMULATION_METADATA_LIMITS,
  type FirstStepInput,
} from "@/lib/validation/shared/lean-canvas";
import { LEAN_CANVAS_HELP } from "@/lib/content/lean-canvas-help";

interface LeanCanvasFormProps {
  initialData: {
    metadata: { name: string; description?: string };
    leanCanvas: LeanCanvasData;
  };
  onSubmit: (data: FirstStepInput) => void;
}

export interface LeanCanvasFormRef {
  validate: () => Promise<boolean>;
}

const LeanCanvasForm = forwardRef<LeanCanvasFormRef, LeanCanvasFormProps>(
  ({ initialData, onSubmit }, ref) => {
    const form = useForm<FirstStepInput>({
      resolver: zodResolver(FirstStepSchema),
      defaultValues: initialData,
      mode: "onBlur",
      reValidateMode: "onChange",
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
          onSubmit(data as FirstStepInput);
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
          {/* Información de la Simulación */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-950 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-semibold text-foreground">
                Información de la Simulación
              </h3>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="metadata.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la simulación *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Mi App de Delivery, Plataforma SaaS B2B..."
                        {...field}
                        maxLength={SIMULATION_METADATA_LIMITS.name}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/{SIMULATION_METADATA_LIMITS.name} caracteres
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Breve descripción de esta simulación..."
                        {...field}
                        rows={3}
                        maxLength={SIMULATION_METADATA_LIMITS.description}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/{SIMULATION_METADATA_LIMITS.description}{" "}
                        caracteres
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Lean Canvas */}
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="leanCanvas.problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {LEAN_CANVAS_HELP.problem.label} *
                      <EnhancedInfoTooltip
                        content={LEAN_CANVAS_HELP.problem.description}
                        example={LEAN_CANVAS_HELP.problem.example}
                        tips={LEAN_CANVAS_HELP.problem.tips}
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={LEAN_CANVAS_HELP.problem.placeholder}
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
                name="leanCanvas.solution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {LEAN_CANVAS_HELP.solution.label} *
                      <EnhancedInfoTooltip
                        content={LEAN_CANVAS_HELP.solution.description}
                        example={LEAN_CANVAS_HELP.solution.example}
                        tips={LEAN_CANVAS_HELP.solution.tips}
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={LEAN_CANVAS_HELP.solution.placeholder}
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
              name="leanCanvas.uniqueValueProposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {LEAN_CANVAS_HELP.uniqueValueProposition.label} *
                    <EnhancedInfoTooltip
                      content={LEAN_CANVAS_HELP.uniqueValueProposition.description}
                      example={LEAN_CANVAS_HELP.uniqueValueProposition.example}
                      tips={LEAN_CANVAS_HELP.uniqueValueProposition.tips}
                    />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={LEAN_CANVAS_HELP.uniqueValueProposition.placeholder}
                      {...field}
                      maxLength={LEAN_CANVAS_LIMITS.uniqueValueProposition}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/{LEAN_CANVAS_LIMITS.uniqueValueProposition}{" "}
                      caracteres
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="leanCanvas.customerSegments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {LEAN_CANVAS_HELP.customerSegments.label} *
                      <EnhancedInfoTooltip
                        content={LEAN_CANVAS_HELP.customerSegments.description}
                        example={LEAN_CANVAS_HELP.customerSegments.example}
                        tips={LEAN_CANVAS_HELP.customerSegments.tips}
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={LEAN_CANVAS_HELP.customerSegments.placeholder}
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
                name="leanCanvas.channels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {LEAN_CANVAS_HELP.channels.label} *
                      <EnhancedInfoTooltip
                        content={LEAN_CANVAS_HELP.channels.description}
                        example={LEAN_CANVAS_HELP.channels.example}
                        tips={LEAN_CANVAS_HELP.channels.tips}
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={LEAN_CANVAS_HELP.channels.placeholder}
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
              name="leanCanvas.revenueStreams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {LEAN_CANVAS_HELP.revenueStreams.label} *
                    <EnhancedInfoTooltip
                      content={LEAN_CANVAS_HELP.revenueStreams.description}
                      example={LEAN_CANVAS_HELP.revenueStreams.example}
                      tips={LEAN_CANVAS_HELP.revenueStreams.tips}
                    />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={LEAN_CANVAS_HELP.revenueStreams.placeholder}
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
          </div>
        </form>
      </Form>
    );
  }
);

LeanCanvasForm.displayName = "LeanCanvasForm";

export default LeanCanvasForm;
