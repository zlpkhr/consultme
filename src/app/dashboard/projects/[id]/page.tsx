import { getProject, getProjectStage } from "@/db/projects";
import { notFound } from "next/navigation";
import { ProjectDetails } from "./project-details";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return notFound();
  }

  const stage = await getProjectStage(id);

  return <ProjectDetails project={{ ...project, stage }} />;
}
