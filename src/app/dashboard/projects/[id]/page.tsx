import { getProject } from "@/db/projects";
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

  return <ProjectDetails project={project} />;
}
