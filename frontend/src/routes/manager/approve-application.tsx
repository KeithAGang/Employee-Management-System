import { ManagerPendingApprovalsSection } from '@/components/approve-pending-applications'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/approve-application')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManagerPendingApprovalsSection />
}
