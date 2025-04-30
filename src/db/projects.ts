"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
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
