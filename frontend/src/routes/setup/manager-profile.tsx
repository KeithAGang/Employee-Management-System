import { CreateManagerProfileForm } from '@/components/create-manager-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setup/manager-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateManagerProfileForm />
}
