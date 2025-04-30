import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getProjects } from "@/db/projects";
import {
  createEmptyProjectAction,
  deleteProjectAction,
} from "./projects/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();

  return (
    <div className="[--header-height:calc(--spacing(14))] sm:[--header-height:calc(--spacing(0))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar
            projects={projects}
            onDelete={deleteProjectAction}
            onCreate={createEmptyProjectAction}
          />
          <SidebarInset>
            <div className="flex-1 grid">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
