// src/routes/manager.tsx (or wherever your ManagerLayout is defined)
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // Ensure correct import path
import { createFileRoute, Outlet } from "@tanstack/react-router";


export const Route = createFileRoute("/manager")({
  component: ManagerLayout,
});

function ManagerLayout() {
  return (
    // Use a flex container to arrange sidebar and main content horizontally
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
