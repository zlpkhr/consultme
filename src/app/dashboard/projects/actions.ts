"use server";

import {
  generateAvatar,
  generateProjectEmoji,
  generateProjectName,
  generateReport,
  generateTargetAudience,
  refindeProductDescription,
} from "@/ai/projects";
import { db } from "@/db";
import {
  deleteProject,
  getLatestProject,
  getProject,
  TargetAudience,
  updateProjectEmoji,
  updateProjectName,
  updateProjectProductDescription,
  updateProjectRefinedProductDescription,
  updateProjectReport,
  updateProjectStage,
  updateProjectTargetAudience,
} from "@/db/projects";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";

export async function deleteProjectAction(id: string) {
  await deleteProject(id);

  revalidatePath("/dashboard/projects");

  const latestProject = await getLatestProject();

  if (latestProject) {
    redirect(`/dashboard/projects/${latestProject.id}`);
  }

  redirect("/dashboard/projects");
}

export async function createEmptyProjectAction() {
  const [project] = await db
    .insert(projects)
    .values({
      id: randomUUID(),
      name: "Untitled Project",
      emoji: "🚀",
      stage: "productDescriptionEntry",
    })
    .returning({
      id: projects.id,
    });

  redirect(`/dashboard/projects/${project.id}`);
}

export async function updateProjectNameAction(id: string, name: string) {
  await updateProjectName(id, name);

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function updateProjectProductDescriptionAction(
  id: string,
  description: string
) {
  await updateProjectProductDescription(id, description);

  const refinedDescription = await refindeProductDescription(description);
  await updateProjectRefinedProductDescription(id, refinedDescription);

  const projectName = await generateProjectName(refinedDescription);
  await updateProjectName(id, projectName);

  const projectEmoji = await generateProjectEmoji(refinedDescription);

  await updateProjectEmoji(id, projectEmoji);

  await updateProjectStage(id, "refinedProductDescriptionReview");

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function updateProjectStageAction(id: string, stage: string) {
  await updateProjectStage(id, stage);

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function generateTargetAudienceAction(id: string) {
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);

  const project = await getProject(id);

  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.productDescription) {
    throw new Error("Product description not found");
  }

  const targetAudience = await generateTargetAudience(
    project.productDescription
  );

  const targetAudienceWithAvatars = await Promise.all(
    targetAudience.map(async (person) => {
      const avatar = await generateAvatar(person);
      return { ...person, avatar };
    })
  );

  await updateProjectTargetAudience(id, targetAudienceWithAvatars);

  await updateProjectStage(id, "targetAudienceReview");

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function generateReportAction(id: string) {
  try {
    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);

    const project = await getProject(id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.targetAudience) {
      throw new Error("Target audience not found");
    }

    const targetAudience =
      project.targetAudience as unknown as TargetAudience[];

    const report = await generateReport(targetAudience);
    const reportJson = JSON.stringify(report);

    try {
      await updateProjectReport(id, reportJson);
    } catch (error) {
      console.error("Failed to save report:", error);
      throw new Error("Failed to save report to database");
    }

    await updateProjectStage(id, "report");

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
  } catch (error) {
    console.error("Error in generateReportAction:", error);
    throw error;
  }
}
