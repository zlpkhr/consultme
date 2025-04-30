"use client";

import { Project } from "@/db/schema";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">
        <span className="mr-2">{project.emoji}</span>
        {project.name}
      </h1>
      <p className="text-muted-foreground font-mono">
        Project ID: {project.id}
      </p>
    </div>
  );
}
