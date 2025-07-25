import { RecordSalesForm } from '@/components/record-sales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/add-sales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecordSalesForm />
}
