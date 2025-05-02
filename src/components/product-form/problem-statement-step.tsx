"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function ProblemStatementStep({
  initialValue = "",
  onNext,
  loading = false,
}: {
  initialValue?: string;
  onNext: (data: { problemStatement: string }) => void;
  loading: boolean;
}) {
  const [problemStatement, setProblemStatement] = useState(initialValue);

  const handleNext = () => {
    onNext({ problemStatement });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Problem Statement</h2>
      <p className="text-muted-foreground">
        What problem does your product or service solve? Describe the pain
        points your target audience is experiencing.
      </p>
      <Textarea
        placeholder="Enter the problem you're solving..."
        className="min-h-[150px]"
        value={problemStatement}
        onChange={(e) => setProblemStatement(e.target.value)}
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={loading || !problemStatement.trim()}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
