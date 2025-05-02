"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function ElevatorPitchStep({
  initialValue = "",
  onNext,
  loading = false,
}: {
  initialValue?: string;
  onNext: (data: { elevatorPitch: string }) => void;
  loading: boolean;
}) {
  const [elevatorPitch, setElevatorPitch] = useState(initialValue);

  const handleNext = () => {
    onNext({ elevatorPitch });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Elevator Pitch</h2>
      <p className="text-muted-foreground">
        Provide a concise elevator pitch for your product or service. What would
        you tell someone about your idea in 30 seconds?
      </p>
      <Textarea
        placeholder="Enter your elevator pitch here..."
        className="min-h-[150px]"
        value={elevatorPitch}
        onChange={(e) => setElevatorPitch(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={loading || !elevatorPitch.trim()}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
