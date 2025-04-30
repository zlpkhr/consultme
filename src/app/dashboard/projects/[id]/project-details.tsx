"use client";

import { Project } from "@/db/schema";
import { useState } from "react";
import {
  generateTargetAudienceAction,
  updateProjectProductDescriptionAction,
  updateProjectStageAction,
} from "../actions";
import { ProductDescriptionForm } from "./product-description-form";
import { ProjectHeader } from "./project-header";
import { RefinedProjectDescription } from "./refined-project-description";
import { TargetAudienceList } from "./target-audience-list";
import { TargetAudience } from "@/db/projects";

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

  const [generatingTargetAudience, setGeneratingTargetAudience] =
    useState(false);

  const handleProjectDescriptionRefinementNext = async () => {
    setGeneratingTargetAudience(true);
    await generateTargetAudienceAction(project.id);
    setGeneratingTargetAudience(false);
  };

  const handleProjectDescriptionRefinementPrevious = async () => {
    setLoading(true);
    await updateProjectStageAction(project.id, "productDescriptionEntry");
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <ProjectHeader project={project} />
      {project.stage === "productDescriptionEntry" && (
        <ProductDescriptionForm
          loading={loading}
          initialDescription={project.productDescription ?? undefined}
          onNext={handleNext}
        />
      )}
      {project.stage === "refinedProductDescriptionReview" &&
        !generatingTargetAudience && (
          <RefinedProjectDescription
            refinedProductDescription={project.refinedProductDescription ?? ""}
            onPrevious={handleProjectDescriptionRefinementPrevious}
            onNext={handleProjectDescriptionRefinementNext}
          />
        )}
      {(project.stage === "targetAudienceReview" ||
        generatingTargetAudience) && (
        <TargetAudienceList
          generatingTargetAudience={generatingTargetAudience}
          targetAudience={(project.targetAudience as TargetAudience[]) ?? []}
        />
      )}
    </div>
  );
}
