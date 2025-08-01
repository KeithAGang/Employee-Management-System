import { ManagerAllLeaveApplications } from '@/components/leave-applications'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/leave-applications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ManagerAllLeaveApplications />
}
