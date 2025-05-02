"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ElevatorPitchStep } from "./elevator-pitch-step";
import { LanguagesStep } from "./languages-step";
import { MarketFocusStep } from "./market-focus-step";
import { ProblemStatementStep } from "./problem-statement-step";
import { ProductFeaturesStep } from "./product-features-step";
import { TargetAudienceStep } from "./target-audience-step";

type MarketFocus = "country" | "regional" | "global";

interface ProductFormData {
  elevatorPitch: string;
  problemStatement: string;
  features: string[];
  targetAudience: string;
  marketFocus: MarketFocus;
  languages: string[];
}

interface MultistepProductFormProps {
  projectId: string;
  initialData?: Partial<ProductFormData>;
  onComplete?: (data: ProductFormData) => void | Promise<void>;
}

export function MultistepProductForm({
  projectId,
  initialData = {},
  onComplete,
}: MultistepProductFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] =
    useState<Partial<ProductFormData>>(initialData);

  const handleStepComplete = async (stepData: Partial<ProductFormData>) => {
    try {
      setLoading(true);

      // Update form data with new step data
      const updatedData = { ...formData, ...stepData };
      setFormData(updatedData);

      // If this is the last step, submit the form
      if (currentStep === steps.length - 1) {
        if (onComplete) {
          await onComplete(updatedData as ProductFormData);
        } else {
          // Save to API
          await fetch(`/api/projects/${projectId}/product-info`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });
          router.push(`/dashboard/projects/${projectId}`);
        }
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: "elevator-pitch",
      component: (
        <ElevatorPitchStep
          initialValue={formData.elevatorPitch}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
    {
      id: "problem-statement",
      component: (
        <ProblemStatementStep
          initialValue={formData.problemStatement}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
    {
      id: "product-features",
      component: (
        <ProductFeaturesStep
          initialValues={formData.features}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
    {
      id: "target-audience",
      component: (
        <TargetAudienceStep
          initialValue={formData.targetAudience}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
    {
      id: "market-focus",
      component: (
        <MarketFocusStep
          initialValue={formData.marketFocus}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
    {
      id: "languages",
      component: (
        <LanguagesStep
          initialValues={formData.languages}
          onNext={(data) => handleStepComplete(data)}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        {steps[currentStep].component}
      </div>
    </div>
  );
}
