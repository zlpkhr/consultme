"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function ProductDescriptionForm({
  initialDescription,
  onNext,
  loading,
}: {
  initialDescription?: string;
  onNext: (description: string) => void | Promise<void>;
  loading: boolean;
}) {
  const [description, setDescription] = useState(initialDescription ?? "");

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Product Description</h2>
        <p className="text-muted-foreground">
          Write a clear and concise description of your product. Focus on what
          it does, who it's for, and why it matters.
        </p>
        <Textarea
          placeholder="Enter your product description here..."
          className="min-h-[200px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <div className="flex justify-end">
          <Button onClick={() => onNext(description)} disabled={loading}>
            {loading ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
