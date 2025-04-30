"use client";

import { Project } from "@/db/schema";
import { updateProjectProductDescriptionAction } from "../actions";
import { ProductDescriptionForm } from "./product-description-form";
import { ProjectHeader } from "./project-header";
import { useState } from "react";

export function ProjectDetails({
  project,
}: {
  project: Project & { stage: string };
}) {
  const [loading, setLoading] = useState(false);

  const handleNext = async (description: string) => {
    setLoading(true);
    await updateProjectProductDescriptionAction(project.id, description);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <ProjectHeader project={project} />
      {project.stage === "productDescription" && (
        <ProductDescriptionForm
          loading={loading}
          initialDescription={project.productDescription ?? undefined}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
