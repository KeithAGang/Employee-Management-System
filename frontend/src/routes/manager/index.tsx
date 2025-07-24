import { ManagerOverviewPage } from '@/components/manager-overview';
import { useAuthStore } from '@/store/authStore';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manager/')({
  component: RouteComponent,
});

  const { userFullName } = useAuthStore.getState();


function RouteComponent() {
  return (
      <ManagerOverviewPage />
  );
}