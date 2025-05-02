"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

export function ProductFeaturesStep({
  initialValues = [""],
  onNext,
  loading = false,
}: {
  initialValues?: string[];
  onNext: (data: { features: string[] }) => void;
  loading: boolean;
}) {
  const [features, setFeatures] = useState<string[]>(
    initialValues.length ? initialValues : [""]
  );

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const handleNext = () => {
    // Filter out empty features
    const filteredFeatures = features.filter((feature) => feature.trim());
    onNext({ features: filteredFeatures });
  };

  const isValid = features.some((feature) => feature.trim());

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Product Features</h2>
      <p className="text-muted-foreground">
        List the key features of your product or service. What makes it unique?
      </p>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              disabled={loading}
            />
            {features.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="flex items-center gap-2 w-full"
        onClick={addFeature}
        disabled={loading}
      >
        <PlusCircle className="h-4 w-4" />
        Add Feature
      </Button>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={loading || !isValid}>
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
