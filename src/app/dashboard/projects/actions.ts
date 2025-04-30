"use server";

import { db } from "@/db";
import {
  deleteProject,
  getLatestProject,
  updateProjectName,
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
