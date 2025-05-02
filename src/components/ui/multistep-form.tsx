"use client";

import { ReactNode, useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

interface Step {
  title: string;
  content: ReactNode;
}

interface MultistepFormProps {
  steps: Step[];
  onComplete: (data: any) => void | Promise<void>;
  loading?: boolean;
}

export function MultistepForm({
  steps,
  onComplete,
  loading = false,
}: MultistepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = steps[currentStepIndex];

  const handleNext = (stepData: Record<string, any>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (isLastStep) {
      onComplete(updatedData);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{currentStep.title}</CardTitle>
        <div className="flex gap-1 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full flex-1 ${
                index <= currentStepIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>{currentStep.content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || loading}
        >
          Back
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </CardFooter>
    </Card>
  );
}
