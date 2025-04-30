"use server";

import {
  generateAvatar,
  generateTargetAudience,
  refindeProductDescription,
} from "@/ai/projects";
import { db } from "@/db";
import {
  deleteProject,
  getLatestProject,
  getProject,
  updateProjectName,
  updateProjectProductDescription,
  updateProjectRefinedProductDescription,
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

  const targetAudienceWithAvatars = [] as any;

  for (const person of targetAudience) {
    const avatar = await generateAvatar(person);
    targetAudienceWithAvatars.push({ ...person, avatar });
  }

  await updateProjectTargetAudience(id, targetAudienceWithAvatars);

  await updateProjectStage(id, "targetAudienceReview");

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}
