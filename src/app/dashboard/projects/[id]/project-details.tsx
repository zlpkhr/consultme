"use client";

import { TargetAudience } from "@/db/projects";
import { Project } from "@/db/schema";
import { useState } from "react";
import {
  generateReportAction,
  generateTargetAudienceAction,
  updateProjectProductDescriptionAction,
  updateProjectStageAction,
} from "../actions";
import { ProductDescriptionForm } from "./product-description-form";
import { ProjectHeader } from "./project-header";
import { RefinedProjectDescription } from "./refined-project-description";
import Report from "./report";
import { TargetAudienceList } from "./target-audience-list";
import { Chat } from "./chat";

export function ProjectDetails({
  project,
}: {
  project: Project & { stage: string };
}) {
  const [loading, setLoading] = useState(false);
  const [generatingTargetAudience, setGeneratingTargetAudience] =
    useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleNext = async (description: string) => {
    setLoading(true);
    await updateProjectProductDescriptionAction(project.id, description);
    setLoading(false);
  };

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

  const handleTargetAudienceReviewNext = async () => {
    await updateProjectStageAction(project.id, "chat");
  };

  const handleTargetAudienceReviewPrevious = async () => {
    setLoading(true);
    await updateProjectStageAction(
      project.id,
      "refinedProductDescriptionReview"
    );
    setLoading(false);
  };

  const handleChatPrevious = async () => {
    setLoading(true);
    await updateProjectStageAction(project.id, "targetAudienceReview");
    setLoading(false);
  };

  const handleChatNext = async () => {
    setGeneratingReport(true);
    await generateReportAction(project.id);
    setGeneratingReport(false);
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
          generatingReport={generatingReport}
          targetAudience={(project.targetAudience as TargetAudience[]) ?? []}
          onNext={handleTargetAudienceReviewNext}
          onPrevious={handleTargetAudienceReviewPrevious}
        />
      )}
      {project.stage === "chat" && (
        <Chat
          projectId={project.id}
          onPreviousClick={handleChatPrevious}
          onNextClick={handleChatNext}
        />
      )}
      {project.stage === "report" && !generatingReport && (
        <Report
          project={project}
          generatingReport={generatingReport}
          setGeneratingReport={setGeneratingReport}
        />
      )}
    </div>
  );
}
