"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TipCard from "../tips/TipCard";

interface WizardLayoutProps {
  steps: {
    title: string;
    component: React.ReactNode;
  }[];
  onComplete?: () => void;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else if (onComplete) {
      onComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs navigation */}
      <Tabs
        value={currentStep.toString()}
        onValueChange={(value) => setCurrentStep(Number(value))}
        className="mb-6"
      >
        <TabsList className="w-full justify-between">
          {steps.map((step, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="flex items-center gap-2 flex-1"
            >
              <div
                className={`number-badge ${
                  index < currentStep
                    ? "bg-primary/20 text-primary"
                    : index === currentStep
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Current step content */}
        <div className="step-container lg:col-span-3">
          <h2 className="step-title">{steps[currentStep].title}</h2>
          <Card className="wizard-card">{steps[currentStep].component}</Card>
        </div>

        {/* Tips sidebar */}
        <div className="lg:col-span-1">
          <TipCard stepIndex={currentStep} />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={goToNextStep}>
          {isLastStep ? "Finalizar" : "Siguiente"}
          {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default WizardLayout;
