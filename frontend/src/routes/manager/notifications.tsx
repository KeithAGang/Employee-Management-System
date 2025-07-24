import { ShowNotifications } from '@/components/showNotifications'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ShowNotifications />
}
