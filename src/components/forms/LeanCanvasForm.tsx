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
import EnhancedInfoTooltip from "@/components/ui/enhanced-info-tooltip";
import { SharedLeanCanvasSchema, LEAN_CANVAS_LIMITS } from "@/lib/validation/shared/lean-canvas";
import { LEAN_CANVAS_HELP } from "@/lib/content/lean-canvas-help";

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
                  {LEAN_CANVAS_HELP.problem.label}
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
            name="solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {LEAN_CANVAS_HELP.solution.label}
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
          name="uniqueValueProposition"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                {LEAN_CANVAS_HELP.uniqueValueProposition.label}
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
                  {LEAN_CANVAS_HELP.customerSegments.label}
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
            name="channels"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {LEAN_CANVAS_HELP.channels.label}
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
          name="revenueStreams"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                {LEAN_CANVAS_HELP.revenueStreams.label}
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
      </form>
    </Form>
  );
};

export default LeanCanvasForm;
