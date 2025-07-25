import { SubordinateSalesRecordsCards } from '@/components/subordinates-salesrecords-cards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manager/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SubordinateSalesRecordsCards />
}
