import { getProject } from "@/db/projects";
import { notFound } from "next/navigation";
import { ProjectHeader } from "./project-header";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <ProjectHeader project={project} />
    </div>
  );
}
