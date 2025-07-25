import { SalesRecordEditForm } from '@/components/edit-sales'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee/sales/$name')({
  component: RouteComponent,
})

function RouteComponent() {
  const salesId = Route.useParams().name
  return <SalesRecordEditForm salesRecordId={salesId}/>
}
