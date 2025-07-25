import { EmployeeSalesRecordsCards } from '@/components/employee-sales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EmployeeSalesRecordsCards />
}
