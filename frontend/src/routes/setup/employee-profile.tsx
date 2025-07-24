import { CreateEmployeeProfileForm } from '@/components/create-employee-profile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/setup/employee-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateEmployeeProfileForm />
}
