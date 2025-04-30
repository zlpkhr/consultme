"use client";

import { createEmptyProjectAction } from "./actions";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Projects</h1>
        <p className="text-muted-foreground text-pretty max-w-prose">
          Get started by creating your first project. Our AI-powered tool helps
          you identify and analyze your target audience, enabling data-driven
          marketing decisions.
        </p>
      </div>
      <Button onClick={() => createEmptyProjectAction()} size="lg">
        Create New Project
      </Button>
    </div>
  );
}
