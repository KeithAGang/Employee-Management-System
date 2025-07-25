import { ShowNotifications } from '@/components/showNotifications'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ShowNotifications />
}
