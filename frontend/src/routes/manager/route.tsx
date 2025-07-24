import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ManagerDashboard } from "@/components/manager-dashboard";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureRole } from "@/utils/authGuard";
import { checkCurrentUserSession } from "@/utils/checkAuth";


export const Route = createFileRoute("/manager")({
  beforeLoad: async ({}) => {
   await checkCurrentUserSession();
    ensureRole("Manager");
  },
  component: ManagerLayout,
});

function ManagerLayout() {
  return (
    <SidebarProvider>
      <ManagerDashboard />
      <SidebarInset>
        <main className="flex p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
