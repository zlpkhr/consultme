"use client";

import { Button } from "@/components/ui/button";
import { createEmptyProjectAction } from "../actions";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <p className="text-muted-foreground text-pretty max-w-prose">
          The project you are looking for does not exist. <br /> Please create a
          new project or select another one from the sidebar.
        </p>
      </div>
      <Button onClick={() => createEmptyProjectAction()}>
        Create New Project
      </Button>
    </div>
  );
}
