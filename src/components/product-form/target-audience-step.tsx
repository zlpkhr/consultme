"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TargetAudienceStep({
  initialValue = "",
  onNext,
  loading = false,
}: {
  initialValue?: string;
  onNext: (data: { targetAudience: string }) => void;
  loading: boolean;
}) {
  const [targetAudience, setTargetAudience] = useState(initialValue);

  const handleNext = () => {
    onNext({ targetAudience });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Target Audience</h2>
      <p className="text-muted-foreground">
        Who is your initial target audience? Describe the specific group of
        people you are targeting with your product or service.
      </p>
      <Input
        placeholder="Enter your target audience..."
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={loading || !targetAudience.trim()}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
