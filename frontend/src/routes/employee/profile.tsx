import { EmployeeProfileForm } from '@/components/employee-profile-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EmployeeProfileForm />
}
