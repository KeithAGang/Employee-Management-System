import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ensureAnyRole } from "@/utils/authGuard";
import { checkCurrentUserSession } from "@/utils/checkAuth";
import { EmployeeDashboard } from "@/components/employee-dashboard";


export const Route = createFileRoute("/employee")({
  beforeLoad: async ({}) => {
   await checkCurrentUserSession();
    ensureAnyRole(["Manager", "Employee"]);
  },
  component: ManagerLayout,
});

function ManagerLayout() {
  return (
    <SidebarProvider>
      <EmployeeDashboard />
      <SidebarInset>
        <main className="flex p-4">
          <Outlet />
        </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
