"use server";

import { db } from "@/db";
import { projects, ChatEntry } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getProjects() {
  return await db.query.projects.findMany();
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}

export async function getLatestProject() {
  const project = await db.query.projects.findFirst({
    orderBy: desc(projects.createdAt),
  });

  if (!project) {
    return null;
  }

  return project;
}

export async function getProject(id: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!project) {
      return null;
    }

    return project;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateProjectName(id: string, name: string) {
  await db.update(projects).set({ name }).where(eq(projects.id, id));
}

export async function updateProjectProductDescription(
  id: string,
  description: string
) {
  await db
    .update(projects)
    .set({ productDescription: description })
    .where(eq(projects.id, id));
}

export async function updateProjectRefinedProductDescription(
  id: string,
  description: string
) {
  await db
    .update(projects)
    .set({ refinedProductDescription: description })
    .where(eq(projects.id, id));
}

export async function updateProjectStage(id: string, stage: string) {
  await db.update(projects).set({ stage }).where(eq(projects.id, id));
}

export type TargetAudience = {
  name: string;
  age: number;
  ethnicity: string;
  country: string;
  gender: string;
  location: string;
  interests: string[];
  needs: string[];
  avatar: string;
};

export async function updateProjectTargetAudience(
  id: string,
  targetAudience: TargetAudience[]
) {
  await db.update(projects).set({ targetAudience }).where(eq(projects.id, id));
}

export async function updateProjectReport(id: string, report: string) {
  try {
    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!existingProject) {
      console.error(`Project ${id} not found`);
      throw new Error(`Project ${id} not found`);
    }

    await db.update(projects).set({ report }).where(eq(projects.id, id));

    const updatedProject = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!updatedProject || !updatedProject.report) {
      console.error(`Failed to update project ${id} report`);
      throw new Error(`Failed to update project ${id} report`);
    }

    return true;
  } catch (error) {
    console.error(`Error updating project ${id} report:`, error);
    throw error;
  }
}

export async function updateProjectEmoji(id: string, emoji: string) {
  await db.update(projects).set({ emoji }).where(eq(projects.id, id));
}

export async function updateProjectChat(id: string, chat: ChatEntry[]) {
  await db.update(projects).set({ chat }).where(eq(projects.id, id));
}
