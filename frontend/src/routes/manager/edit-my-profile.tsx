import { EditManagerProfileForm } from '@/components/edit-manager-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/edit-my-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditManagerProfileForm />
}
