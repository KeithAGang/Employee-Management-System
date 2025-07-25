import { ApplyForLeaveForm } from '@/components/apply-for-leave'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/apply-leave')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ApplyForLeaveForm />
}
